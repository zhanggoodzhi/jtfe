/**
 * 判断是否手机端
 * 
 * @export
 * @returns Boolean
 */
export function isMobile() {
    let [userAgentInfo,_isMobile_] = [navigator.userAgent,false];
    var mobileAgents=["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    for(var i=0,len=mobileAgents.length;i<len;i++){
        if(userAgentInfo.indexOf(mobileAgents[i])>=0){
            _isMobile_ = true;
            break;
        }
    }
    return _isMobile_;
}

/**
 * 判断本页面是否iframe引入
 * 
 * @export
 * @returns Boolean
 */
export function isIframe() {
    return window.parent !== window.self;
}