$(function() {
	main.init();

	var heightDG = document.body.scrollHeight - 190;
	console.log(heightDG);
	$("#toolTabsFaq").css("height",heightDG+"px");
	questionList.init();
	previewReplyList.init();
	classList.init();
	var initVar = function() {
		$toolTabs = $("#toolTabs1");
		status =$("#txtWxStatus").val();
	};
	
	$("#updateGeneralMenu_confirmed").click(function(){
		if(general_menu_id == 0){
			previewReplyList.operateAppend_ajax();
		}else{
			previewReplyList.operateEdit_ajax();
		}
	});
});
var main = (function($, undefined) {
	var $toolTabs = undefined;
	var $toolBarFrame = undefined;
	var status=undefined;
	var initVar = function() {
		$toolTabs = $("#toolTabsFaq");
	};

	var initTabCompleteFlag = false;

	var initEvent = function() {

		// 初始化tabs
		$toolTabs.tabs({
			border : false,
			onSelect : function(title) {
				var $tabContent = $(this).tabs("getSelected").children();

				if ($tabContent.is("iframe")) {

					if (!initTabCompleteFlag) {
					} else {
						// 删除其它iframe页面的src,防止iframe下次加载闪动
						$toolBarFrame.removeAttr("src");
						$tabContent.attr("src", $tabContent.attr("source"));
						$tabContent.show();
					}
				} else {
				}
			},
		});
		$toolTabs.tabs("select", "常见问题");
	}

	var method = {
			init : function() {
				initVar();
				initEvent();
			},
			$toolTabs : $toolTabs,
		};

	return method;
})(jQuery);
