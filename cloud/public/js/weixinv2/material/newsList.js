$(function() {
	if (mediaId == null || mediaId == "")
		addWechatNewsEmpty();
});

var userDialog = undefined;
var createOrUpdate = "create";
function addRecordDynamically(wechatId, title, coverLocalUri) {
	trhtml = '<tr id="record-' + wechatId + '" class="even pointer">';
	trhtml += '<td class=" ">'
			+ '<img id="record-cover-' + wechatId + '" src="' + coverLocalUri
			+ '" style="height: 40px;width:70px">' + '</td>';
	trhtml += '<td id="record-title-' + wechatId + '" class=" ">' + title
			+ '</td>';
	trhtml += '<td class=" last">';
	trhtml += '<a onclick="editWechatNews(\'' + wechatId
			+ '\')" href="javascript:;">&nbsp;编辑&nbsp;</a>';
	trhtml += '<a onclick="delWechatNews(\'' + wechatId
			+ '\')" href="javascript:;">删除文章</a>';
	trhtml += '</td>';
	trhtml += '</tr>';
	$('#wechattable').append(trhtml);
};

function addNewsEntity() {
	var title = $('#title_0').val();
	var author = $('#description_0').val();
	var digest = $('#digest').val();
	var content = $('#editor').html();
	var credentialId = $('#credentialId').val();
	var mediaId = $('#mediaId').val();
	var coverLocalUri = $('#coverLocalUri').val();
	if (title == undefined || title == "") {
		new PNotify({
			title : '保存失败',
			text : '请设置文章标题',
			type : 'error'
		});
		return;
	} else if (coverLocalUri == undefined || coverLocalUri == "") {
		new PNotify({
			title : '保存失败',
			text : '请设置一个封面',
			type : 'error'
		});
		return;
	}

	var sourceUrl = $('#sourceUrl').val();
	$
			.ajax({
				url : 'weixinv2/material/addNewsEntityAction',
				type : 'POST',
				data : {
					"title" : title,
					"author" : author,
					"digest" : digest,
					"content" : content,
					"mediaId" : mediaId,
					"credentialId" : credentialId,
					"createOrUpdateid" : createOrUpdate,
					"coverLocalUri" : coverLocalUri,
					"sourceUrl" : sourceUrl
				},
				success : function(data) {
					if (data.code == "201") {
						$('#record-title-' + data.msg).text(title);
						$('#record-cover-' + data.msg).attr('src',coverLocalUri);
					} else {
						$('#mediaId').val(data.code);
						addRecordDynamically(data.msg, title, coverLocalUri);
					}
					$('#addNewsEntity').modal('hide');
					$('#title_0').val('');
					$('#digest').val('');
					$('#sourcUrl').val('');
					$('#description_0').val('');
					$(".imgcover").css("background-image",
							"url('images/upimage.png')");
					$('#editor').html(defaultContent);
					createOrUpdate = "create";
				}
			});
};
function addWechatNewsEmpty() {
	$('#formtitle').text("新增文章");
	$('#title_0').val('');
	$('#digest').val('');
	$('#sourcUrl').val('');
	$('#description_0').val('');
	$(".imgcover").css("background-image",
			"url('images/upimage.png')");
	$('#editor').html(defaultContent);
	$('#addNewsEntity').modal({
		backdrop : 'static',
		keyboard : false
	});
	$('#addNewsEntity').modal('show');

}
function editWechatNews(id) {
	$.ajax({
		url : 'weixinv2/material/getWechatNewsDetail',
		data : {
			id : id,
		},
		type : 'post',
		dataType : "json",
		beforeSend : function() {
			$('#loadGif').css("display", "block");
		},
		success : function(data) {
			if (data != null) {
				$('#loadGif').css("display", "none");
				$('#formtitle').text("编辑文章");
				$('#title_0').val(data.title);
				$('#description_0').val(data.author);
				$('#digest').val(data.digest);
				$('#sourcUrl').val(data.sourcUrl);
				$('#addNewsEntity').modal('show');
				$('#editor').html(data.content);
				if (data.cover != null) {
					$(".imgcover").css("background-image",
							"url('" + data.cover.localuri + "')");
					$("#coverLocalUri").val(data.cover.localuri);
				}
				createOrUpdate = id;
			}
		}
	});

}
// 编辑图文组页面--》删除图文
function delWechatMedia() {
	var mediaId = $('#mediaId').val();
	var credentialId = $('#credentialId').val();
	userDialog = new BootstrapDialog.show(
			{
				title : '提示',
				message : '确认删除图文组?',
				buttons : [
						{
							label : '确认',
							cssClass : 'btn-primary',
							action : function() {
								$
										.ajax({
											url : 'weixinv2/material/deleteNewsList',
											type : 'post',
											data : {
												"mediaId" : mediaId,
											},
											success : function(data) {
												window.location.href = ctx+"/weixinv2/material/mediaHistory.do?id="
														+ credentialId;
											}
										});
							}
						}, {
							label : '取消',
							cssClass : 'btn-default',
							action : function(dialogItself) {
								dialogItself.close();
							}
						} ]
			});
};

function delWechatNews(id) {
	userDialog = new BootstrapDialog.show({
		title : '提示',
		message : '确认删除文章?',
		buttons : [ {
			label : '确认',
			cssClass : 'btn-primary',
			action : function() {
				$.ajax({
					url : 'weixinv2/material/delWechatNews',
					data : {
						id : id,
					},
					type : 'post',
					success : function(data, status) {
						if (status == "success") {
							userDialog.close();
							$("#record-" + id).remove();
                            if($('.article-nums').length===0){
                                var href=$('.article-back').attr('href');
                                location.href=href;
                            }
						}
					}
				});
			}
		}, {
			label : '取消',
			cssClass : 'btn-default',
			action : function(dialogItself) {
				dialogItself.close();
			}
		} ]
	});
};

function uploadCover() {
	var formObject;
	var url;
	formObject = $("#imgfile");
	url = "weixinv2/material/uploadCover";
	formObject.ajaxSubmit({
		url : url,
		type : 'post',
		dataType : 'json',
		complete : function(data, status, xhr) {
			var result = eval('(' + data.responseText + ')');
			if (result.code == "200") {
				$(".imgcover").css("background-image",
						"url('" + result.msg + "')");
				$("#coverLocalUri").val(result.msg);
			} else {
				new PNotify({
					title : '上传图片失败',
					text : result.msg,
					type : 'error'
				});
			}

		},
	}, 'json');
}

function uploadArticleImg() {
	var formObject;
	var url;
	formObject = $("#articleImgfile");
	url = "weixinv2/material/uploadArticleImg";
	formObject.ajaxSubmit({
		url : url,
		type : 'post',
		complete : function(data) {
			var result = eval('(' + data.responseText + ')');
			if (result.code == "200") {
				document.execCommand('insertimage', false, result.msg);
			} else {
				new PNotify({
					title : '上传图片失败',
					text : result.msg,
					type : 'error'
				});
			}
		},
	}, 'json');
}
