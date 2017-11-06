import Storage from '../app/utils/storage';
import _JTChat_ from './jtchat';

(function(window,plugin){

    window.onload = function(){

        let _configs_ = (function(){
            var conf = JSON.parse(JSON.stringify(window[plugin].c || []));
            var oConfs = {};
            conf.forEach(function(v){
                oConfs[v[0]] = v[1];
            })
            return oConfs;
        }());

        // let JTChat = window[plugin] = new _JTChat_(_configs_);
        let JTChat = new _JTChat_(_configs_);

        let storage = new Storage(window.localStorage,'$_jtchat');
        
        // onmessage消息处理程序
        let receiveMessageHandles = {
            close () {
                JTChat.hidePanel();
                storage.set('closed',true);
                JTChat.reload();
                storage.set('reload',+new Date());
            },
            targetChange (target) {
                //console.log('targetChange... ',target)
            },
            sendMessage (msg) {
                //console.log('sendMessage... ',msg)
            }
        }

        // onstorage事件处理 对应key （多Tab同步）
        let storageChangeHandles = {
            // 多Tab同步重置超时时间
            closed (close) {
                close ? JTChat.hidePanel() : JTChat.showPanel();
            },
            reload () {
                JTChat.reload();
            },
            windows (count){
                // console.log('windows change : ',value)
            }
        }

        // onmessage事件监听 （与iframe窗口交互）
        window.onmessage = function(evt){
            let {data,origin,source} = evt;
            if(origin !== JTChat.configs.domain){
                return ;//console.warn(`Danger message from ${origin}. data -> ${data.valueOf()}`);
            }
            // 执行处理程序
            let actionFn = typeof data.action === 'string' && receiveMessageHandles[data.action];
            typeof actionFn === 'function' && actionFn(data.data);
        }

        // onmessage事件监听 （多Tab交互）
        window.onstorage = function(evt){
            let fnName = storage.getInputKey(evt.key);
            let value = storage.get(fnName);
            typeof storageChangeHandles[fnName] === 'function' && storageChangeHandles[fnName](value);
        }

        // 打开页面时窗口的初始打开关闭状态
        let defaultClosed = storage.get('closed');
        storageChangeHandles.closed(defaultClosed);

        storage.set('windows',storage.get('windows') + 1);

        // 关闭前清理storage数据
        window.onunload = function(){
            storage.set('windows',storage.get('windows') - 1);
            if(storage.get('windows') <= 0){
                storage.set('closed',true);
            }
        }

    }

}(window,'_JTCHAT_'));