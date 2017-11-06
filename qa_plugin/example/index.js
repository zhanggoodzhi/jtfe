// tslint:disable:space-before-function-paren

var id = localStorage.getItem('jt-qa-uid') || Math.random().toString().slice(2); // 仅演示时使用，真实环境下请使用唯一Id
localStorage.setItem('jt-qa-uid',id);

var box = document.querySelector('#message-box');

var input = document.querySelector('#question-input');

var plugin = new QAPlugin({
    clientUri: 'https://demo.jintongsoft.cn/csclient/',
    serverUri: 'https://demo.jintongsoft.cn/cs-server/',
    appkey: 'c2dcae13125449b2b899c66e854918fd', // 对应的appkey
    username: '访客' + id.slice(6), // 显示的用户名
    userid: id, //必须是唯一的
    onMessageListUpdate: function (messages) { // 消息列表发生变化时
        var html = messages.map(function (message) {
            var sender = message.sender;
            var content = message.content;
            switch (content.type) {
                case models.MessageContentTypes.text:
                    return '<div class="message-item">' +
                        '<div class="message-info">' +
                        sender.name +
                        '</div>' +
                        '<div class="message-content">' +
                        content.data +
                        '</div>' +
                        '</div>';
                    // case ... 其他类型的回复
                case models.MessageContentTypes.robot:
                    return '<div class="message-item">' +
                        '<div class="message-info">' +
                        sender.name +
                        '</div>' +
                        '<div class="message-content">' +
                        content.data.content +
                        '</div>' +
                        '</div>';
                default:
                    break;
            }
        }).join('');

        box.innerHTML = html;
    }
});

// 一些常量配置
var models = QAPlugin.models;

// 连接到webSocket
plugin.connect()
    // 登录成功,建议所有涉及到客服模块的操作都放在成功的回调中
    .then(function () {
        // 获取角色数据，未选择角色发送消息机器人不会回复
        return plugin.getCharacters();
    })
    .then((req) => {
        var characters = req.data.msg;
        // 设置一个角色
        plugin.setCharacter(characters[0].id);

        // 连接到机器人
        plugin.requestRobot();

        // 或者连接到人工客服
        // plugin.requestStaff();

        // 插入欢迎语
        plugin.insertRobotAnswer(plugin.config.guide);

        init();

    });

function init() {
    document
        .querySelector('#question-form')
        .addEventListener('submit', function (e) {
            e.preventDefault();
            var value = input.value.trim();

            if (!value) {
                return;
            }

            plugin.sendQuestion(value)
                .then(function () {
                    input.value = '';
                });

        });
}
