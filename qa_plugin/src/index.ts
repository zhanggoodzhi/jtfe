import * as SockJS from 'sockjs-client';
import axios, { AxiosPromise } from 'axios';
import * as qq from 'fine-uploader/lib/core';
import * as models from './models';
import { merge, uniqueId, get, debounce } from 'lodash';
import { stringify } from 'qs';
const { ClientGetTypes, ClientSendTypes, MessageTypes, MessageContentTypes, TargetTypes, ClientGetOperations, ClientSendOperations } = models;

export default class QAPlugin {
    static models = models;
    /**
     * 所有后台接口
     *
     * @private
     * @memberof QAPlugin
     */
    private _interface = {
        config: 'getAllConfig', // 获取app基本信息
        faq: 'faq', // 常见问题列表
        emoji: 'getEmojiConfig', // 表情数据
        emojiBase: 'public/emoji', // 表情的根路径
        hisitory: 'getMsglogs', // 聊天记录
        character: 'listCharacters', // 角色列表
        fileUpload: 'upload/fileUpload', // 上传文件
        imageUpload: 'upload/imgUpload', // 上传图片
        fileDownload: 'upload/fileDownload', // 下载文件
        imageDownload: 'upload', // 下载图片
        feedback: 'sendfeedback', // 点赞点踩
        robotFeedback: 'comment', // 机器人满意度评价
        staffFeedback: 'cscomment'// 人工客服满意度评价
    };
    private _imageUploader;
    private _fileUploader;
    private _messages: models.IMessageObject[] = []; // 消息队列
    private _options: models.IQAPluginOptions;
    private _config: models.IConfig; // getAllConfig的返回值
    private _sock: SockJS.Socket | WebSocket; // webSocket实例
    private _connected: boolean = false; // 是否连接并登录
    private _heartbeatTimer: number = null; // 心跳包定时器
    private _target: models.TargetTypes = null; // 用户要发送的目标(客服或机器人)
    private _prevTarget: models.TargetTypes; // 上一次的目标时的值
    private _staff: models.IStaff = null; // 当前正在服务的人工客服
    private _device: string = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'MOBILE' : 'PC';
    private _character: string; // 选中的角色id
    private _moreLogs: boolean; // 是否有更多的聊天记录
    private _timeoutCount: number = 0; // 超时计时
    constructor(options: models.IQAPluginOptions) {
        if (!options) {
            throw (new Error(`参数不能为空`));
        }

        // 参数必填项
        const requiredOptions = [
            'clientUri',
            'serverUri',
            'appkey',
            'username',
            'userid'
        ];

        for (const key of requiredOptions) {
            if (!options.hasOwnProperty(key)) {
                throw (new Error(`参数 '${key}' 为必填项`));
            }
        }

        // 默认值
        const _options: models.IQAPluginOptions = {
            uploader: {
                imageAccept: 'image/*',
                fileAccept: '.txt,.xls,.xlsx,.doc,.docx,.pdf'
            }
        } as models.IQAPluginOptions;

        const clientInterface = this._interface;

        this._options = merge(_options, options);

        // 拼接接口uri
        Object.keys(clientInterface).forEach(key => {
            clientInterface[key] = _options.clientUri + clientInterface[key];
        });
    }

    /**
     * 获取app基本信息
     *
     * @private
     * @returns
     * @memberof QAPlugin
     */
    private initConfig() {
        const op = this._options;

        // 获取初始配置
        return axios.get(this._interface.config, {
            params: {
                appkey: op.appkey
            }
        })
            .then(res => {
                if (res.data.error) {
                    return Promise.reject('获取配置信息失败');
                }

                this._config = res.data.msg;
                // 这边头像返回的是相对路径，先拼接一下
                this._config.robotPic = this._config.cloudurl + this._config.robotPic;
                this._config.visitorPic = this._config.cloudurl + this._config.visitorPic;

                this._moreLogs = this._config.moreLogs;
            });
    }

    /**
     * 初始化websocket
     *
     * @private
     * @returns
     * @memberof QAPlugin
     */
    private initSock() {
        return new Promise((resolve, reject) => {
            const config = this._config;
            const op = this._options;
            const sock = window.hasOwnProperty('WebSocket') ?
                new WebSocket(config.wsuri) :
                new SockJS(config.sjuri);

            sock.onopen = (e) => {
                // 链接上立即登陆
                this.sendLogin();
            };

            // sockjs没有onerror
            (sock as WebSocket).onerror = (e) => {
                reject('连接到Websocket出现异常');
            };

            sock.onclose = (e) => {
                op.onConnectClose && op.onConnectClose(e);
                if (this._heartbeatTimer) {
                    clearInterval(this._heartbeatTimer);
                    this._heartbeatTimer = null;
                }
            };

            sock.onmessage = (e) => {
                // 所有后台返回的数据必须是json
                const data: models.IResponseMessage = e.data ? JSON.parse(e.data) : null;

                if (!data) {
                    return;
                }

                // 结构为type+content
                const { type, content } = data;

                switch (type) {
                    // 发送登陆信息后会响应登录，响应后算connect成功
                    case ClientGetTypes.authenticate:
                        this._connected = true;
                        this._heartbeatTimer = setInterval(this.sendHeartbeat, 60 * 1000);
                        resolve(e);
                        break;
                    // 无论通过何种方式连接上人工客服后，后台都会推送这条消息
                    case ClientGetTypes.transfer:
                        this.changeTarget(models.TargetTypes.staff);
                        this._staff = content;
                        break;
                    // 消息类型，真正的对话使用的类型
                    case ClientGetTypes.message:
                        const message: models.IMessageObject = {
                            timestamp: new Date().getTime(),
                            evaluable: false,
                            type: MessageTypes.answer,
                            origin: content,
                            from: content.target
                        } as models.IMessageObject;

                        // 将后台返回不同结构的数据转换为统一的
                        switch (content.target) {
                            case models.TargetTypes.robot:
                                merge(message, {
                                    // 机器人信息不会变动
                                    sender: {
                                        name: config.robotName,
                                        avatar: config.robotPic,
                                        id: null
                                    },
                                    content: {
                                        type: models.MessageContentTypes.robot,
                                        data: content,
                                        logId: content.logId
                                    },
                                    // 只有机器人的回复是可以点赞点踩的
                                    evaluable: true
                                });

                                break;
                            case models.TargetTypes.staff:
                                merge(message, {
                                    sender: {
                                        name: content.sender.uname,
                                        avatar: content.avatar,
                                        id: content.sender.uid
                                    },
                                    content: {
                                        type: content.msgType,
                                        data: content.text,
                                        logId: content.logId
                                    },
                                    evaluable: false
                                });
                                
                                break;
                            default:
                                break;
                        }

                        // 在_message队列中插入回复
                        this.insertAnswer(message);
                        break;
                    // 警告类型，一般用于前台提醒
                    case ClientGetTypes.warn:
                        switch (Number(content.code)) {
                            // 这两种是连接人工客服失败的状态码，要将target切换至修改前
                            case 1005:
                            case 1001:
                                if (this._prevTarget) {
                                    this.toggleTaget(this._prevTarget);
                                    this._prevTarget = null;
                                } else {
                                    // 这种情况一般出现在仅人工客服模式下但人工客服不在线
                                    this.changeTarget(null);
                                }
                                break;
                            default:
                                break;
                        }

                        // 回调
                        if (op.onWarning) {
                            op.onWarning(content);
                        }
                        break;
                    // 成功类型
                    case ClientGetTypes.success:
                        switch (Number(content.code)) {
                            case 2002: // 消息发送成功，后台会响应一个logId用于查询聊天记录。这条不需要通知，相当于系统级消息
                                // 用户发送的消息会有feid属性(前端生成)，这里后台会将feid返回，用于准确寻找到该条消息绑定logId
                                const msg: models.IMessageObject = this._messages.find(v => v._id === content.msg.feid);
                                if (msg) {
                                    msg.content.logId = content.msg.nodeId;
                                    op.onSendQuestionSuccess && op.onSendQuestionSuccess(msg,this._messages);
                                }
                                break;
                            default:
                                break;
                        }
                        // 排除2002
                        if (op.onSuccess && content.code !== '2002') {
                            op.onSuccess(content);
                        }
                        break;
                    // 客服操作类型
                    case ClientGetTypes.ServicerOp:
                        // 判断不同的操作
                        switch (content.operation) {
                            // 邀请对话
                            case models.ClientGetOperations.invite:
                                // 接收到邀请对话后必须要接受或者拒绝,否则会一直占用客服的服务队列
                                if (this._options.onInviteChat) {
                                    this._options.onInviteChat(this.accept, this.refuse);
                                }
                                break;
                            // 邀请评价
                            case models.ClientGetOperations.invite_feedback:
                                if (this._options.onInviteFeedback) {
                                    this._options.onInviteFeedback(this.satisfactionFeedback);
                                }
                                break;
                            // 结束对话
                            case models.ClientGetOperations.end:
                                this.changeTarget(null);

                                if (this._options.onEnd) {
                                    this._options.onEnd();
                                }
                                break;
                            default:
                                break;
                        }
                        break;
                    // 留言类型
                    case ClientGetTypes.LeaveMsg:
                        const q = this.getUserSendQuestion(content.content);
                        const a = this.getRobotSendAnswer(content.replyContent);

                        merge(q, {
                            timestamp: content.messageTime
                        });

                        merge(a, {
                            timestamp: content.replyTime
                        });

                        if (this._options.onGetLeaveMessage) {
                            this._options.onGetLeaveMessage(q, a);
                        } else {
                            // 这里相当于一个默认的onGetLeaveMessage
                            this.insertMessage(q);
                            this.insertMessage(a);
                        }

                        break;
                    default:
                        break;
                }

            };

            this._sock = sock;
        });
    }

    /**
     * 接受客服邀请对话
     *
     */
    public accept = () => {
        return this.send(ClientSendTypes.ServicerOp, {
            currentPage: this.getCurrentPage(),
            operation: ClientSendOperations.accept_invite
        })
            .then(() => {
                this.changeTarget(TargetTypes.staff);
            });

    }

    /**
     * 拒绝客服邀请对话
     *
     */
    public refuse = () => {
        // 这里逻辑可能还有一些问题
        let queue = null;
        switch (this._target) {
            case TargetTypes.robot:
                queue = 'queue_robot';
                break;
            case TargetTypes.staff:
                queue = this.staff ? 'queue_serving' : 'queue_waiting';
                break;
            case null:
                queue = this.staff ? 'queue_closed' : 'queue_vistor';
                break;
            default:
                break;
        }
        return this.send(ClientSendTypes.ServicerOp, {
            operation: ClientSendOperations.refuse_invite,
            originQueue: queue
        });
    }

    /**
     * 满意度评价
     *
     * @param {models.ISatisfactionFeedback} data
     * @returns
     */
    public satisfactionFeedback = (data: models.ISatisfactionFeedback) => {
        let uri;

        const config = this._config;

        Object.assign(data, {
            fileType: 'FEEDBACK',
            uid: this.config.sessionId
        });

        // 不同的目标调用不同的接口
        if (this._staff) {
            // 在线体验页面中，请求人工客服后，不论是否结束对话，都不可能再和机器人发起聊天了。
            // 如果其他用户定制则这里默认只要和客服发起聊天后就是评价客服
            uri = this._interface.staffFeedback;
            Object.assign(data, {
                servicer: this._staff.servicer.id,
                cscustomsession: this._staff.customSession
            });
        } else {
            // 评价机器人
            switch (this._target) {
                case TargetTypes.robot:
                    uri = this._interface.robotFeedback;
                    Object.assign(data, {
                        customsession: config.customsession
                    });
                    break;
                case TargetTypes.staff:
                case TargetTypes.comment:
                default:
                    return Promise.reject('尚未开始对话');
            }
        }

        return axios.post(uri, stringify(data));
    }

    // 当前访问页面
    private getCurrentPage() {
        return {
            title: document.querySelector('title').innerHTML,
            uri: document.referrer || location.href,
            timestamp: new Date().getTime(),
            userid: this._options.userid
        };
    }

    // 一些初始化方法调用
    private init() {
        // 必须要成功获取config
        return this.initConfig()
            .then(() => {
                const config = this._config;
                const options = this._options;
                const uploaderOptions = options.uploader;

                if (uploaderOptions.imageElement || uploaderOptions.fileElement) {
                    this.initUploader();
                }

                if (options.onTimeout && config.timeoutLength) {
                    setInterval(() => {
                        this._timeoutCount++;
                        if (this._timeoutCount === config.timeoutLength) {
                            options.onTimeout(config.timeoutMsg);
                        }
                    }, 1000);
                }

                return this.initSock();
            });
    }

    // 发送语音文件
    private sendVoice(blob) {
        const formData = new FormData();
        formData.append('attach', blob);
        return axios.post('/csclient/upload/tempVoiceUpload', formData);
    }

    // 触发列表更新回调
    private triggerListChange() {
        if (this._options.onMessageListUpdate) {
            this._options.onMessageListUpdate(this._messages);
        }
    }

    // 重置超时时间计数
    public resetTimeoutCount = () => {
        this._timeoutCount = 0;
    }

    /**
     * 获取表情数据
     *
     * @returns
     */
    public getEmoji = () => {
        return axios.get(this._interface.emoji)
            .then(res => {
                const { data } = res;
                if (!data.error) {
                    const emojiBase = this._interface.emojiBase;
                    const emojiData = JSON.parse(data.msg);
                    // 拼接uri
                    Object.keys(emojiData).forEach(key => {
                        const emojiType = emojiData[key];
                        emojiType.forEach(v => {
                            v.uri = emojiBase + '/' + key + '/' + v.filename;
                        });
                    });
                    return emojiData;
                } else {
                    return Promise.reject('获取表情数据失败');
                }
            });
    }

    /**
     * 获取常见问题
     *
     * @returns {AxiosPromise}
     */
    public getFaqs = (): AxiosPromise => {
        return axios.get(this._interface.faq, {
            params: {
                app_key: this._options.appkey
            }
        });
    }

    /**
     * 获取角色列表
     *
     * @returns {AxiosPromise}
     */
    public getCharacters = (): AxiosPromise => {
        return axios.post(this._interface.character, stringify({ appid: this._config.appid }));
    }

    /**
     * 获取历史记录，从消息队列的头部开始，这里会将历史记录直接插入到消息队列中
     *
     * @param {number} [size=10] 数量
     * @returns
     */
    public getHistories = (size: number = 10): Promise<boolean> => {
        const config = this._config;

        const options = this._options;

        // 从头部开始查找拥有logId的消息,通过insertRobotAnswer等前端显示用的消息(不会被存储在服务器中，不算真正的对话)没有logId
        // const firstMessage = this._messages.find(m => !!get(m, 'content.data.logId'));
        const firstMessage = this._messages.find(m => !!get(m, 'content.logId'));

        const logId = get(firstMessage, 'content.logId');

        return axios.get(this._interface.hisitory, {
            params: {
                sessionId: config.sessionId,
                appkey: config.app_key,
                logId,
                size
            }
        })
            .then(res => {
                const { data } = res;
                if (data.error) {
                    throw new Error(data.error);
                }

                const logs = get<any, any[]>(data, 'msg.logList');

                if (logs) {
                    this._messages = (
                        logs
                            .reverse()
                            .map(log => {
                                const messageConfig: models.IMessageObject = {
                                    _id: this.createId(),
                                    type: null,
                                    sender: null,
                                    timestamp: log.msgtime,
                                    evaluable: false,
                                    content: {
                                        logId: log.id,
                                        data: null,
                                        type: null
                                    },
                                    origin: log
                                };

                                switch (log.sendername) {
                                    case '访客':
                                        merge(messageConfig, {
                                            type: models.MessageTypes.question,
                                            sender: {
                                                name: options.username,
                                                avatar: config.visitorPic,
                                                id: options.userid
                                            },
                                            content: {
                                                data: log.msgtext,
                                                questionType: log.questionType,
                                                type: models.MessageContentTypes.text
                                            }

                                        });
                                        break;
                                    case '机器人':
                                        merge(messageConfig, {
                                            type: models.MessageTypes.answer,
                                            sender: {
                                                name: config.robotName,
                                                avatar: config.robotPic,
                                                id: null
                                            },
                                            from: models.TargetTypes.robot,
                                            content: {
                                                data: {
                                                    msgid: log.msgid,
                                                    answerType: log.answerType,
                                                    content: log.msgtext
                                                },
                                                type: models.MessageContentTypes.robot
                                            }
                                        });
                                        break;
                                    default:
                                        merge(messageConfig, {
                                            type: models.MessageTypes.answer,
                                            sender: {
                                                name: log.sendername,
                                                avatar: log.avatar,
                                                id: null
                                            },
                                            content: {
                                                data: log.msgtext,
                                                type: models.MessageContentTypes.text
                                            }

                                        });
                                        break;
                                }
                                return messageConfig;
                            }).concat(this._messages));

                    this.triggerListChange();
                }

                // 这里一般_message队列必然发生的改变，所以没有加一个onMoreLogsChange之类的回调
                this._moreLogs = get<any, boolean>(data, 'msg.moreLogs');

                return this._moreLogs;
            });
    }

    /**
     * 主动初始化uploader
     *
     * @param {HTMLElement} [imageElement]
     * @param {HTMLElement} [fileElement]
     */
    public initUploader = (imageElement?: HTMLElement, fileElement?: HTMLElement) => {
        const config = this._config;
        const uploaderOptions = this._options.uploader;
        const parseFileData = (args) => {
            return {
                uri: args.uri + '?' + stringify({
                    prefix: args.prefix,
                    suffix: args.suffix,
                    fileDir: args.fileDir
                }),
                name: args.oiginalFileName + '.' + args.suffix
            };
        };
        const parseImageData = (args) => {
            return args;
        };
        const createUploader = (button: HTMLElement, accept: string, uri: string, type: models.MessageContentTypes, getUploadData) => {
            if (!button) {
                return null;
            }
            const uploader = new qq.FineUploaderBasic({
                autoUpload: true,
                multiple: false,
                button,
                cors: {
                    allowXdr: true,
                    expected: true,
                    sendCredentials: true
                },
                request: {
                    filenameParam: 'filename',
                    uuidName: 'uuid',
                    totalFileSizeName: 'totalfilesize',
                    inputName: 'attach',
                    endpoint: uri
                },
                validation: {
                    acceptFiles: accept
                },
                callbacks: {
                    onError: (id, name, error, xhr) => {
                        const res = JSON.parse(xhr.responseText);
                        if (!res.error) {
                            this.sendQuestion(getUploadData(res.msg), type);
                        }
                        uploader.reset();
                    }
                },
                text: {
                    fileInputTitle: ''
                }
            });

            return uploader;
        };

        this._imageUploader = createUploader(
            imageElement || uploaderOptions.imageElement,
            uploaderOptions.imageAccept,
            this._interface.imageUpload,
            models.MessageContentTypes.image,
            parseImageData
        );

        this._fileUploader = createUploader(
            fileElement || uploaderOptions.fileElement,
            uploaderOptions.fileAccept,
            this._interface.fileUpload,
            models.MessageContentTypes.file,
            parseFileData
        );
    }

    /**
     * 连接到websocket服务器，在服务端可以看到机器人列表下的用户
     *
     * @returns
     * @memberof QAPlugin
     */
    public connect = () => {
        if (this._connected) {
            return Promise.reject('Websocket已经连接');
        }

        return this.init();
    }

    /**
     * 评论机器人回复是否有用
     *
     * @param {models.IMessageObject} message 消息对象
     * @param {boolean} useful 是否有用
     */
    public feedback = (message: models.IMessageObject, useful: boolean) => {
        const msgid = get(message, 'content.data.msgid'),
            logId = get(message, 'content.data.logId');

        message.evaluation = useful;

        axios.post(this._interface.feedback, stringify({
            msgid,
            logId,
            rating: useful ? 1 : -1
        }));

        this.triggerListChange();
    }

    /**
     * 切换请求对象，这里会发送消息给后台
     *
     * @private
     * @param {models.TargetTypes} target
     * @returns
     * @memberof QAPlugin
     */
    private toggleTaget(target: models.TargetTypes) {
        return this.send(models.ClientSendTypes.transfer, {
            currentPage: this.getCurrentPage(),
            target
        })
            .then(() => {
                this.changeTarget(target);
            });
    }

    /**
     * 仅改变请求对象的值，不会发送消息给后台，一般用于纠正
     *
     * @private
     * @param {models.TargetTypes} target
     * @memberof QAPlugin
     */
    private changeTarget(target: models.TargetTypes) {
        this._prevTarget = this._target;
        this._target = target;
        if (this._options.onTargetChange) {
            this._options.onTargetChange(this._target);
        }
    }

    /**
     * 请求申请至人工客服
     *
     * @memberof QAPlugin
     */
    public requestStaff = () => {
        this.toggleTaget(models.TargetTypes.staff);
    }

    /**
     * 请求机器人
     *
     * @memberof QAPlugin
     */
    public requestRobot = () => {
        this._prevTarget = null;
        this.toggleTaget(models.TargetTypes.robot);
    }

    /**
     * 设置角色
     *
     * @param {string} character 角色ID
     */
    public setCharacter = (character: string) => {
        this._character = character;
        if (this._options.onCharacterChange) {
            this._options.onCharacterChange(character);
        }
    }

    private sendHeartbeat = () => {
        const { username, userid } = this._options;
        return this.send(ClientSendTypes.heartbeat, {
            uname: username,
            uid: userid
        });
    }

    private sendLogin() {
        const op = this._options;
        const config = this._config;
        return this.send(ClientSendTypes.authenticate, {
            appkey: op.appkey,
            uname: op.username,
            uid: op.userid,
            isServicer: 'false',
            secret: 'jttest',
            os: config.os,
            ip: config.clientIP,
            browser: config.browser,
            device: this._device,
            currentPage: this.getCurrentPage()
        });
    }

    /**
     * 获取用户发送的消息数据
     *
     * @private
     * @param {string} text
     * @param {models.MessageContentTypes} [type=models.MessageContentTypes.text]
     * @returns {models.IMessageObject}
     * @memberof QAPlugin
     */
    private getUserSendQuestion(text: string, type: models.MessageContentTypes = models.MessageContentTypes.text): models.IMessageObject {
        const op = this._options;
        const config = this._config;
        return {
            sender: {
                name: op.username,
                id: op.userid,
                avatar: config.visitorPic
            },
            timestamp: new Date().getTime(),
            content: {
                data: text,
                type
            },
            type: MessageTypes.question
        };
    }

    /**
     * 获取机器人发送的消息数据
     *
     * @private
     * @param {string} text
     * @returns {models.IMessageObject}
     * @memberof QAPlugin
     */
    private getRobotSendAnswer(text: string): models.IMessageObject {
        const op = this._options,
            config = this._config;
        return {
            sender: {
                name: config.robotName,
                id: null,
                avatar: config.robotPic
            },
            timestamp: new Date().getTime(),
            evaluable: false,
            content: {
                data: text,
                type: models.MessageContentTypes.text
            },
            type: MessageTypes.answer,
            from: models.TargetTypes.robot
        };
    }

    /**
     * 发送问题
     *
     * @memberof QAPlugin
     */
    public sendQuestion = (messageContent, type: models.MessageContentTypes = models.MessageContentTypes.text) => {
        const config = this._config;
        const options = this._options;
        const feid = this.createId();
        const message = {
            target: this._target,
            avatar: config.visitorPic,
            feid
        };

        switch (this._target) {
            case models.TargetTypes.robot:
                merge(message, {
                    uid: options.userid,
                    app_key: config.app_key,
                    q: messageContent,
                    device: this._device,
                    ip: config.clientIP,
                    character: this._character,
                    customsession: config.customsession,
                    questionType: type
                });
                break;
            case models.TargetTypes.staff:
                merge(message, {
                    receiver: 's_8001641',
                    device: this._device,
                    message: {
                        msgType: type,
                        content: messageContent
                    }
                });
                break;
            default:
                break;
        }

        this.resetTimeoutCount();

        return this.send(ClientSendTypes.message, message)
            .then(() => {
                this.insertQuestion(this.getUserSendQuestion(messageContent, type), feid);
            });
    }

    /**
     * 留言
     *
     * @memberof QAPlugin
     */
    public sendComment = (comment: models.ICommentContent) => {
        const config = this._config;
        const options = this._options;
        const message = {
            target: TargetTypes.comment,
            avatar: config.visitorPic,
            message: {
                appId: config.appid,
                name: options.username,
                visitor: options.userid
            }
        };

        let error: string;

        // 不在这里设置初始值是因为不填时间的话是''空字符串而不是undefined
        let { expectReplyTimeStart, expectReplyTimeEnd } = comment;
        // 设置默认值
        if (!expectReplyTimeStart) {
            expectReplyTimeStart = '00:00';
        }

        if (!expectReplyTimeEnd) {
            expectReplyTimeEnd = '23:59';
        }
        // 如果相反则交换，时间只能是24小时内，不允许跨天比如下午17:00~凌晨1:00，会被纠正为(凌晨1:00~下午17:00)
        if (this.time2number(expectReplyTimeStart) > this.time2number(expectReplyTimeEnd)) {
            [expectReplyTimeEnd, expectReplyTimeStart] = [expectReplyTimeStart, expectReplyTimeEnd];
        }

        if (!comment.content) {
            error = '留言内容不能为空';
        } else if (+comment.expectReplyType === 1 && !comment.phone) {
            error = '电话不能为空';
        } else if (expectReplyTimeStart === expectReplyTimeEnd) {
            error = '时间段不能为相同值';
        }

        merge(message.message, {
            ...comment,
            expectReplyTimeStart,
            expectReplyTimeEnd
        });

        if (error) {
            return Promise.reject(error);
        }

        return this.send(ClientSendTypes.message, message);
    }

    // 发送实时预览消息
    public sendPreview = debounce((text: string) => {// 加了个防抖
        if (this._target !== models.TargetTypes.staff) {
            return Promise.resolve();
        }

        return this.send(models.ClientSendTypes.preview, {
            id: this._options.userid,
            message: text
        });
    }, 600);

    private send(type: models.ClientSendTypes, content) {
        if (!this.inited) {
            return Promise.reject('Websocket尚未初始化完毕！');
        }
        this._sock.send(JSON.stringify({
            type,
            content
        }));
        return Promise.resolve();
    }

    private insertQuestion = (message: models.IMessageObject, feid?: string) => {
        this.insertMessage(message, feid);

        if (this._options.onSendQuestion) {
            this._options.onSendQuestion(message, this._messages);
        }
    }

    private insertAnswer = (message: models.IMessageObject) => {
        this.insertMessage(message);

        if (this._options.onGetAnswer) {
            this._options.onGetAnswer(message, this._messages);
        }
    }

    /**
     * 直接插入机器人回复数据，但不发送给后台交互，常用语欢迎语，或者提示信息显示。
     *
     * @memberof QAPlugin
     */
    public insertRobotAnswer = (text: string) => {
        this.insertMessage(
            this.getRobotSendAnswer(text)
        );
    }

    /**
     * 直接插入用户问题。一般用不到
     *
     * @memberof QAPlugin
     */
    public insertUserQuestion = (text: string) => {
        this.insertQuestion(
            this.getUserSendQuestion(text)
        );
    }

    private createId = (): string => {
        return uniqueId('jt_message_') + '_' + new Date().getTime();
    }

    private insertMessage(message: models.IMessageObject, feid?: string) {
        message._id = feid || this.createId();
        this._messages.push(message);

        this.triggerListChange();
    }

    // // 给某一条聊天信息增加属性
    // private addMessageProps(i, data) {
    //     console.log(this._messages);
    //     this._messages[i] = { ...this._messages[i], ...data };
    //     console.log(this._messages);
    // }

    // 播放语音回复接口
    private getVoiceUrl(id, app_key) {
        return `/csclient/getVoice?msgid=${id}&appKey=${app_key}`;
    }

    private time2number = (time: string) => {
        return Number(time.replace(/:/g, ''));
    }

    /**
     * 对话列表
     *
     * @readonly
     * @type {models.IMessageObject[]}
     * @memberof QAPlugin
     */
    get messages(): models.IMessageObject[] {
        return this._messages;
    }

    /**
     * websocket是否初始化完毕
     *
     * @readonly
     * @type {boolean}
     * @memberof QAPlugin
     */
    get inited(): boolean {
        return this._sock && this._sock.readyState === 1;
    }

    /**
     * websocket是否登录完毕
     *
     * @readonly
     * @type {boolean}
     * @memberof QAPlugin
     */
    get connected(): boolean {
        return this._connected;
    }

    /**
     * websocket实例
     *
     * @readonly
     * @type {(WebSocket | SockJS.Socket)}
     * @memberof QAPlugin
     */
    get sock(): WebSocket | SockJS.Socket {
        return this._sock;
    }

    /**
     * 配置信息
     *
     * @readonly
     * @type {models.IConfig}
     * @memberof QAPlugin
     */
    get config(): models.IConfig {
        return this._config;
    }

    /**
     * 是否有历史记录
     *
     * @readonly
     * @type {boolean}
     * @memberof QAPlugin
     */
    get hasHistories(): boolean {
        return this._moreLogs;
    }

    get staff() {
        return this._staff;
    }
}

export { models };
