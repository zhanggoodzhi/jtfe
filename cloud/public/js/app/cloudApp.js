var cloudApp = (function($,undefined){
	var method = {
		log : function(){
			console.log(12345646);
		}
	};
	
	return method;
})(jQuery);


$(function(){
	$(".link").each(
		function(){
			$(this).click({url: $(this).attr('url')}, function(event){
				$("#content").attr("src", event.data.url);
				$.cookie('contentUrl', event.data.url);
				return false;
			});
		}
	);

	
	var url = $.cookie('contentUrl');
	if(url){
		
		$(".easyui-accordion").accordion("select",$("a[url='"+url+"']").closest(".panel").find(".panel-title").html());
		$("#content").attr("src", url);
	}
	
	$(".layout-split-west").css("border-right-color", "white");
});