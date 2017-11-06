$(function() {
	setting.init();
});

var setting = (function($, undefined) {

	// 页面元素
	var $appkey=undefined;
	var $appsecret = undefined;
	var $weiboRedirectUri=undefined;
	// 请求参数
	var submitUrl = "weibo/settingSubmit";
	var queryParams = {};
	var initVar = function() {
		$weiboName=$("#txtweiboName");
		$appId = $("#txtApplicationId");
		$appkey = $("#txtAppkey");
		$appsecret = $("#txtAppsecret");
		$weiboRedirectUri = $("#txtweiboRedirectUri");
	};
	var initSaveData = function(){
		queryParams.weiboName = $weiboName.val();
		queryParams.appkey = $appkey.val();
		queryParams.appsecret = $appsecret.val();
	};
	var accessSubmit=function (){
		window.open("https://api.weibo.com/oauth2/authorize?client_id="+$appkey.val()+"&redirect_uri="+$weiboRedirectUri.val()+"");
	};
	
	var submit = function(){
		initSaveData();
		if($weiboName.val()==""){
			jQuery.messager.alert('提示:', "请填写微博账号", 'warning');
		}else if($appkey.val()==""){
			jQuery.messager.alert('提示:', "请填写App key", 'warning');
		}else if($appsecret.val()==""){
			jQuery.messager.alert('提示:', "请填写App secret", 'warning');
		}else{
		$.post(submitUrl, queryParams, function(data){
			var title = "";
			if(data.status == "success"){
				title = "消息:设置成功，请重新登陆";
			}else if(data.status == "error"){
				title = "消息:设置失败";
			}else{
				title = "消息:设置警告";
			}
			jQuery.messager.alert(title,data.message, 'info');
		}, "json");
	};
	}
	var method = {
		init : function() {
			initVar();
		},
		submit : function(){
			submit();
		},
		accessSubmit:function(){
			accessSubmit();
		},
	};
	return method;
})(jQuery);
