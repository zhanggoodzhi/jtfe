$(function() {
	main.init();
});

var main = (function($, undefined) {

	var toolBarInfo = [ {
//		title : "用户管理",
//		content : "<div class='fs_18A'>开发中... 敬请等待</div>",
//	}, {
//		title : "素材管理",
//		src : "",
//		content : "<div class='fs_18A'>开发中... 敬请等待</div>",
//		
//	}, {
		title : "自定义菜单",
		content : "<div class='fs_18A'>开发中... 敬请等待</div>",
//	}, {
//		title : "群发功能",
//		content : "<div class='fs_18A'>开发中... 敬请等待</div>",
//	}, {
//		title : "历史记录",
//		content : "<div class='fs_18A'>开发中... 敬请等待</div>",
	} ];

	var $toolTabs = undefined;
	var $toolBarFrame = undefined;

	var initVar = function() {
		$toolTabs = $("#toolTabs");
		
	};
	
	var initTabCompleteFlag = false;

	var initEvent = function() {
		
		// 初始化tabs
		$toolTabs.tabs({
			border : false,
			onSelect : function(title) {
				var $tabContent = $(this).tabs("getSelected").children();
				
				if ($tabContent.is("iframe")) {
					
					if(!initTabCompleteFlag){
					}else{
						// 删除其它iframe页面的src,防止iframe下次加载闪动
						$toolBarFrame.removeAttr("src");
						$tabContent.attr("src", $tabContent.attr("source"));
						$tabContent.show();
					}
				} else {
				}
			},
		});
		
		//其它页面
		if (status === "1") {
		$.each(toolBarInfo, function(index, element) {
				var content = undefined;
				if (element.content) {
					content = element.content;
				} else {
					content = '<iframe class="weiboToolBar" source="'
							+ element.src + '"></iframe>';
				}
			$toolTabs.tabs("add", {
				title : element.title,
				content : content,
				closable : false,
			});
		});
		}
		initTabCompleteFlag = true;
		$toolBarFrame = $("iframe.weixinToolBar");
		
		$toolTabs.tabs("select", "快速接入");
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
