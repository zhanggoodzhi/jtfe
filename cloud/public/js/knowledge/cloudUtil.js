$(function(){

});


Date.prototype.formatDate = function (format) {  
    var o = {  
        "M+": this.getMonth() + 1, 
        "d+": this.getDate(),  
        "h+": this.getHours(),  
        "m+": this.getMinutes(), 
        "s+": this.getSeconds(),  
        "q+": Math.floor((this.getMonth() + 3) / 3),  
        "S": this.getMilliseconds() 
    }  
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,  
    (this.getFullYear() + "").substr(4 - RegExp.$1.length));  
    for (var k in o) if (new RegExp("(" + k + ")").test(format))  
        format = format.replace(RegExp.$1,  
      RegExp.$1.length == 1 ? o[k] :  
        ("00" + o[k]).substr(("" + o[k]).length));  
    return format;
} 



var cloudUtil = (function($,undefined){

	var gridTips = function(value, wordLength){
		var tipValue = value;
		if(value != null && value.length >= wordLength){
			tipValue = value.substring(0,wordLength-3) + "...";
		}
		return "<a  title='" + value + "' class='grid-tip'  style='color:#000000' >"+ tipValue + "</a>";
	};
	
	
	var gridHtmlTips = function(htmlContent, wordLength){
		
		
		var value = undefined;
			
		try{
			if(htmlContent.test(/^<p>/)){
				
			}else{
				htmlContent = "<p>" + htmlContent + "</p>";
			}
			
			value = $(htmlContent).text();
		}catch(exc){
			value = $("<p>"+htmlContent+"</p>").text();
		}
		var tipValue = value;

		if(value != null && value.length >= wordLength){
			tipValue = value.substring(0,wordLength-3) + "...";
		}
		return "<a  title='" + value + "' class='grid-tip'  style='color:#000000' >"+ tipValue + "</a>";
	}
	
	var method = {
		gridTips: gridTips,
		gridHtmlTips: gridHtmlTips
	};
	
	return method;

})(jQuery);


