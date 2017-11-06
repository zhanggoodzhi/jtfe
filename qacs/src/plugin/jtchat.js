import Storage from '../app/utils/storage';
let storage = new Storage(window.localStorage,'$_jtchat');

// 字符串是否是数值
function isNumberString(s){
    if(typeof s !== 'number' && typeof s !== 'string'){
        return false;
    }
    return /^([\d]+)?\.?[\d]+$/g.test(s);
}
// 是否合适的尺寸单位值
function isFixedSizeUnit(s){
    if(typeof s !== 'number' && typeof s !== 'string'){
        return false;
    }
    return /^([\d]+)?\.?[\d]+(px|%|em|rem|vh|vw)?$/g.test(s);
}

export default class _JTChat_ {
    constructor (opts) {
        this.defaultConfigs = {
            appkey : '',
            domain : 'http://demo.jintongsoft.cn',
            width : '360px',
            height : '560px'
        }
        this._isFirstOpen = true;
        this._config(opts); // this.configs
        this._init();
    }

    // 初始化
    _init () {
        this.ele = {};
        this.addStyle();
        this.createElements();
        this.bindEvent();
    }

    // 配置参数
    _config (opts) {
        if(typeof opts !== 'object'){
            throw new Error('配置参数类型错误')
        }else{
            if(!opts.appkey){
                throw new Error('appkey必须配置');
            }
            this.configs = Object.assign({},this.defaultConfigs,opts);
        }
        
    }

    // 得到正确的尺寸值
    getValidSize (s) {
        return isFixedSizeUnit(s) ? (isNumberString(s) ? s+'px' : s) : false;
    }

    // 获取样式字符串
    _initStyle () {
        let { width, height } = this.configs;
        width = this.getValidSize(width) || this.defaultConfigs.width;
        height = this.getValidSize(height) || this.defaultConfigs.height;

        return `#jt-chat-trigger{
                position: fixed;
                right:10px;
                bottom:10px;
                z-index:99999;
            }
            #jt-chat-trigger .trigger{
                display:block;
                height: 24px;
                line-height: 24px;
                padding:10px 16px;
                background-color: #007aff;
                font-size: 16px;
                border-radius:5px;
                color: #fff;
                text-decoration: none;
                cursor: pointer;
                font-family: Helvetica Neue For Number,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif;
            }
            #jt-chat-trigger .trigger img{
                vertical-align: top;
                height: 24px;
                margin-right: 8px;
            }
            #jt-chat-panel{
                position: fixed;
                right:10px;
                bottom:10px;
                z-index:99999;
                display:none;
                width: ${width};
                height: ${height};
                max-width:100%;
                max-height:100%;
                padding: 0;
                margin: 0;
                border-radius: 5px;
                overflow: hidden;
                background-color: transparent;
                box-shadow: 0 0 20px 0 rgba(0, 0, 0, .15);
                border: 1px solid #eee;
            }
            #jt-chat-panel iframe{
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index:1;
                width:100% !important;
                height:100% !important;
                border: 0;
                padding: 0;
                margin: 0;
                float: none;
                background: none;
            }
            #jt-chat-panel .close{
                position: absolute;
                right: 4px;
                top: 4px;
                z-index:2;
                width:40px;
                height:40px;
                line-height:40px;
                color:#dadada;
                font-size:28px;
                text-align:center;
                text-decoration: none;
            }
            @media (max-width:768px) {
                #jt-chat-panel{
                    top:0;
                    left:0;
                    right:0;
                    bottom:0;
                    width: auto;
                    height:auto;
                }
            }`;
    }

    // 添加样式
    addStyle () {
        let eStyle = document.createElement('style');
        eStyle.id = "jt-chat-style";
        eStyle.rel="stylesheet";
        eStyle.innerHTML = this._initStyle();
        document.head.appendChild(eStyle)
    }

    // 创建元素并添加到文档
    createElements () {

        let eTrigger = document.createElement('div');
        let imgdata = 'data:image/png;base64,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';
        eTrigger.id = 'jt-chat-trigger';
        eTrigger.innerHTML = `<span class="trigger"><img src="${imgdata}"> 咨询客服</span>`;
        this.ele.eTrigger = eTrigger;

        let eChatPanel = document.createElement('div');
        eChatPanel.id = 'jt-chat-panel';
        this.ele.eChatPanel = eChatPanel;

        //let origin = window.location.href;
        let eChartIFrame = document.createElement('iframe');
        eChartIFrame.name = 'jtChat';
        eChartIFrame.src = this.getIframeUri();
        eChartIFrame.frameborder = "";
        eChartIFrame.scrolling = "no";
        eChartIFrame.allowtransparency = "true";
        this.ele.eChartIFrame = eChartIFrame;

        let eChatClose = document.createElement('a');
        eChatClose.className = "close";
        eChatClose.href = "javascript:void 0;";
        eChatClose.innerHTML = "&times;";
        this.ele.eChatClose = eChatClose;
        
        document.body.appendChild(eTrigger);
        eChatPanel.appendChild(eChatClose);
        eChatPanel.appendChild(eChartIFrame);
        document.body.appendChild(eChatPanel);
    }

    getIframeUri () {
        return `${this.configs.domain}/csclient/views/home?key=${this.configs.appkey}&t=${+new Date()}`;
    }

    // 绑定事件
    bindEvent () {
        let self = this;

        this.ele.eTrigger.addEventListener('click',function(){
            self.showPanel();
            storage.set('closed',false);
        },false);

        this.ele.eChatClose.addEventListener('click',function(){
            self.hidePanel();
            storage.set('closed',true);
        },false);
    }

    // 显示聊天框
    showPanel () {
        if(this._isFirstOpen){
            this.reload();
            this._isFirstOpen = false;
        }
        this.ele.eChatPanel.style.display = 'block';
        this.ele.eTrigger.style.display = 'none';
    }
    // 隐藏聊天框
    hidePanel () {
        this.ele.eChatPanel.style.display = 'none';
        this.ele.eTrigger.style.display = 'block';
    }
    // 重载聊天界面
    reload () {
        this.ele.eChartIFrame.src = this.getIframeUri();
    }

}