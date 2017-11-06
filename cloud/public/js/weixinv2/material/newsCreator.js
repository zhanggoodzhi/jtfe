// 右侧查询图片功能
function searchpic() {
	pickeyword = $('#searchbar').val();

		$('#piccontainer_parent').empty();
		$('#piccontainer_parent').append(
				'<div id="piccontainer" style="margin-top: 10px"></div>');

		$('#piccontainer').waterfall(
				{
					itemCls : 'item',
					colWidth : 150,
					gutterWidth : 10,
					gutterHeight : 10,
					checkImagesLoaded : true,
					params:{keyword:pickeyword},
					path : function(page) {
						return 'weixinv2/material/searchpic?page=' + page;
					}
				});
}
// 未知功能
function addtag(tag) {
    debugger
	var sel, range;
	if (window.getSelection) {
		sel = window.getSelection();
		var text = sel.toString();
		if (text == "")
			return;
		if (sel.rangeCount) {
			range = sel.getRangeAt(0);
			range.deleteContents();
			range.insertNode(document.createTextNode("<" + tag + ">" + text
					+ "</" + tag + ">"));
		}
	} else if (document.selection && document.selection.createRange) {
		range = document.selection.createRange();
		range.text = replacementText;
	}
}
// 点击右侧，把图片插入到编辑器中
function insertPic(url) {
	var credentialId = $('#credentialId').val();
	var imgurl = url.replace("thumb", "nowatermid");
	sel = window.getSelection();
	var text = sel.toString();
	if(text!="")
		document.execCommand('Delete','false',null);
	if (sel.rangeCount) {
		range = sel.getRangeAt(0);
		if(hasClass(range.commonAncestorContainer,"block-inner"))
			rteInsertHTML("<img class='replaceable' src='"+imgurl+"'></img>");
		else
			rteInsertHTML("<div class='editor-img-container block-inner'><img class='replaceable' src='"+imgurl+"'></img></div>");
	}

}
// 判断element元素是否有cls样式
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
// 选择富文本编辑器中的图片
function selectimg(img) {
    debugger
	console.log("selectimg");
	var node=document.createRange();
	node.selectNode(img);
	var sel=getSelection();
	sel.removeAllRanges();
	sel.addRange(node);
	//$('.img_toolbar').remove();
	var parentnode = img.parentNode;
//	parentnode.insertBefore(createHTMLNodeImgToolbar(),img);
}
// 清空富文本编辑器中的内容
function emptyeditor() {
	if (window.confirm("您真的要清空编辑器里的内容吗?")) {
		$('#editor').html('');
	}
}
// 返回上一页
function returnPrevious() {
	if (window.confirm("您真的要返回上一页吗? 确定返回的话, 编辑器中的内容将不会被保存")) {
		self.location = document.referrer;
	}
}

$(function() {
	if (newsid == null || newsid == "")
		addWechatNewsEmpty();
	else
		editWechatNews(newsid);

	$("#editor").bind("click",function(e){
		clickInsideEditor(this);
	});
	$('.left_col').removeClass('scroll-view');
	setTimeout(function(){
		$('.left_col').removeAttr('style');
	},100);
});

var userDialog = undefined;
var createOrUpdate = "create";

function addRecordDynamically(wechatId, title, coverLocalUri) {
    debugger
	trhtml = '<tr id="record-' + wechatId + '" class="even pointer">';
	trhtml += '<td class=" ">' + '<img id="record-cover-' + wechatId
			+ '" src="' + coverLocalUri + '" style="height: 40px;width:70px">'
			+ '</td>';
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
// 点击添加，保存素材内容
function addNewsEntity() {
    var title = $.trim($('#title_0').val());
	var author = $('#description_0').val();
    var digest = $.trim($('#digest').val());
    var content = $.trim($('#editor').text());
    var chtml=$('#editor').html();
	var credentialId = $('#credentialId').val();
	var mediaId = $('#mediaId').val();
	var coverLocalUri = $('#coverLocalUri').val();
    var coverShow=$('#cover_show').prop('checked');
	if (!title) {
		new PNotify({
			title : '保存失败',
			text : '标题不能为空！',
			type : 'error'
		});
		return;
    } if(!digest){
        new PNotify({
			title : '保存失败',
			text : '文章摘要不能为空！',
			type : 'error'
		});
		return;
    }else if (coverLocalUri == undefined || coverLocalUri == "") {
		new PNotify({
			title : '保存失败',
			text : '请设置一个封面！',
			type : 'error'
		});
		return;
    }else if(!content&&chtml.indexOf("img")===-1){
        new PNotify({
			title : '保存失败',
			text : '文本内容不能为空！',
			type : 'error'
		});
		return;
    }

	var sourceUrl = $('#sourceUrl').val();
	$.ajax({
		url : 'weixinv2/material/addNewsEntityAction',
		type : 'POST',
		data : {
			"title" : title,
			"author" : author,
			"digest" : digest,
			"content" : chtml,
			"mediaId" : mediaId,
			"credentialId" : credentialId,
			"createOrUpdateid" : createOrUpdate,
			"coverLocalUri" : coverLocalUri,
			"sourceUrl" : sourceUrl,
            'coverShow':coverShow?1:0
		},
		success : function(data) {
            var code=parseInt(data.code);
            if(code===500){
                new PNotify({
                    title : '保存失败',
                    text : data.msg,
                    type : 'error'
                });
            }else{
                self.location = document.referrer;
            }

		}
	});
};
// 素材管理页面--》点击新增，进入添加素材页面
function addWechatNewsEmpty() {
	/*$('#formtitle').text("新增文章");*/
	$('#title_0').val('');
	$('#digest').val('');
	$('#sourcUrl').val('');
	$('#description_0').val('');
	$(".imgcover").css("background-image", "url('images/upimage.png')");
	$('#editor').html(defaultContent);
	$('#addNewsEntity').modal({
		backdrop : 'static',
		keyboard : false
	});
	$('#addNewsEntity').modal('show');

}
// 素材管理页面--》点击编辑 进入编辑素材页面
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
				/*$('#formtitle').text("编辑文章");*/
				$('#title_0').val(data.title);
				$('#description_0').val(data.author);
				$('#digest').val(data.digest);
				$('#sourceUrl').val(data.sourceUrl);
				$('#addNewsEntity').modal('show');
				$('#editor').html(data.content);
				if (data.cover != null) {
					$(".imgcover").css("background-image",
							"url('" + data.cover.localuri + "')");
					$("#coverLocalUri").val(data.cover.localuri);
				}
				createOrUpdate = id;
                var $coverShow=$('#cover_show');
                data.coverPic===0?$coverShow.prop('checked',null):$coverShow.prop('checked','checked');
			}
		}
	});

}

/*function delWechatMedia() {
    debugger
	var mediaId = $('#mediaId').val();
	var credentialId = $('#credentialId').val();
	userDialog = new BootstrapDialog.show(
			{
				title : '提示',
				message : '确认删除图文组111?',
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
												window.location.href = "/cloud/weixinv2/material/mediaHistory.do?id="
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
};*/

/*function delWechatNews(id) {
    debugger
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
};*/
// 点击上传封面
function uploadCover() {
	var f = document.getElementById("upfile_0").files;
    //上次修改时间

    if(f[0].size > 5*1024*1024) {
    	alert("图片大小不能超过5MB");
    	return false;
    }
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
// 富文本编辑器中--》上传图片功能
function uploadArticleImg() {
    debugger
	var f = document.getElementById("upfile_article").files;
    //上次修改时间

    if(f[0].size > 2*1024*1024) {
    	alert("图片大小不能超过2MB");
    	return false;
    }

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
				document.execCommand('Delete','false',null);
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
// 使用左侧模板里的标题样式
function rteInsertHTML(html) {
	var sel, range;
	var div_editor = document.getElementById("editor");
	var pagebody = document.getElementById("pagebody");

	if (window.getSelection) {
		sel = window.getSelection();
		var text = sel.toString();
		if (sel.rangeCount) {
			range = sel.getRangeAt(0);
			console.log(range.commonAncestorContainer);
			var insideeditor = true;
			var parentNode = range.commonAncestorContainer;
			while (parentNode != null && parentNode != div_editor
					&& parentNode != pagebody) {
				parentNode = parentNode.parentNode;
			}

			if (parentNode == div_editor) { //位于EDITOR中
				document.execCommand("InsertHTML", false, html);
				div_editor.focus();
			} else {
				new PNotify({
					title : '插入失败',
					text : '请使用鼠标点击光标到想要插入图片或者样式的地方',
					type : 'error'
				});
			}
		} else {
			new PNotify({
				title : '插入失败',
				text : '请使用鼠标点击光标到想要插入图片或者样式的地方',
				type : 'error'
			});
		}
	} else if (document.selection && document.selection.createRange) {
		range = document.selection.createRange();
		range.text = replacementText;
	}

	$("#editor .replaceable").unbind("click").bind("click",function(e){
		selectimg(this);
	});
}
// 点击富文本编辑器内部
function clickInsideEditor() {
	sel = window.getSelection();
	if (!(sel.rangeCount&&hasClass(sel.getRangeAt(0).commonAncestorContainer,"block-inner"))) {
        $('.img_toolbar').remove();
	}
}
function createHTMLNode(htmlCode) {
    debugger
	// create html node
	var htmlNode = document.createElement('div');
	htmlNode.innerHTML = htmlCode;
	return htmlNode;
}
function createHTMLNodeNewLine() {
    debugger
	// create html node
	var htmlNode = document.createElement('div');
	htmlNode.className = 'newline';
	return htmlNode;
}
function createHTMLNodeImgToolbar() {
    debugger
	// create html node
	var htmlNode = document.createElement('div');
	htmlNode.className = 'img_toolbar';
	htmlNode.innerHTML = '<button class="btn btn-default" onclick="resize_to_50(this)" style="margin-right:20px">50%</button> <button class="btn btn-default" onclick=" onclick="resize_to_100(this)" >100%</button>';
	return htmlNode;
}
/*
function resize_to_50() {

}*/
// 调整富文本编辑器高度，并修改样式
function resizeHeightRow() {
	var h_editor_container = $('#editor_container').height();
	var h_metaform = $('#metaform').height();
	var h_editor_toolbar = $('#editor_toolbar').height();
	$('#editor').css(
			"height",
			(h_editor_container - h_metaform - h_editor_toolbar - 30)
					+ "px");
	$('#piccontainer_parent').css("max-height",
			(h_editor_container - 50) + "px");
}

function setColor(color) {
    debugger
	document.execCommand('foreColor', false, color);
	$('#color_identifier').css('color',color);
}

