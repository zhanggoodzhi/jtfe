$(function(){
	
	//初始化页面元素
	
	$imgcover=$("#imgcover_0");
	

	//封面选择事件
	$imgcover.click(function(){
		selectCover(0);
	});
	

});


//封面选择事件
function selectCover(index)
{
	$("#upfile_" + index).click();
}
function uploadcover(uploadcover,index) {
	$.ajaxFileUpload({
		url : 'news/uploadImg.do',
		secureuri : false,
		fileElementId : $(uploadcover).attr("id"),
		dataType : 'json',
		error : function(data, status, e) {
			console.log(e);
		},
		success : function(data, status) {
			if (typeof (data.state) != 'undefined') {
				if (data.state != 'SUCCESS') {
					// print error
					alert("上传图片出错");
				} else {
					$("#imgcover_" + index)
							.css(
									"backgroundImage",
									"url('v2/medias/push/news/" + data.mediaid
											+ "')");
					$("#picMediaId_" + index)
							.val(data.name);

				}
			}
		},
		complete : function(data) {
		}
	});
	return false;
}


