<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="en">

<head>
<script>
	var mediaId = '${mediaId}';
	var currentwxid = '${credential.id}';
	var currentwxname = '${credential.wxName}';
	var matrix = new Array();

	<c:forEach var="wechatCredential" items="${wechatCredentials}">
	matrix["${wechatCredential.id}"] = '${wechatCredential.wxName}';
	</c:forEach>

	var defaultContent ='本文为<b>${credential.wxName}</b>原创文章, 转载请注明出处<br/>欢迎大家扫描二维码关注微信公众号<br/>';
	defaultContent+='<img src="${credential.qrcode}" style="width:120px;height:120px;">';
	defaultContent+='<br/>请在此输入正文<br/><br/><br/>';
	var matrixercode ='<br/>======欢迎点击图片扫描二维码关注以下公众号=====<br/>';
	var matrixsize=0;
	<c:forEach var="wechatCredential" items="${wechatCredentials}">
		<c:if test="${wechatCredential.id!=credential.id}">
			matrixercode +='<img src="${wechatCredential.qrcode}" style="width:120px;height:120px;">';
			matrixsize+=1;
		</c:if>
		</c:forEach>
	if(matrixsize>0)
		defaultContent+=matrixercode;
</script>

<link href="${ctx }/css/bootstrap.min.css" rel="stylesheet">
<link href="${ctx }/fonts/css/font-awesome.min.css" rel="stylesheet">
<link href="${ctx }/css/animate.min.css" rel="stylesheet">
<!-- Custom styling plus plugins -->
<link href="${ctx }/css/custom.css" rel="stylesheet">
<link href="${ctx }/css/icheck/flat/green.css" rel="stylesheet">
<!-- editor -->
<link href="public/fonts/css/font-awesome.css" rel="stylesheet">
<link href="${ctx }/css/editor/external/google-code-prettify/prettify.css" rel="stylesheet">
<link href="${ctx }/css/editor/index.css" rel="stylesheet">
<!-- select2 -->
<link href="${ctx }/css/select/select2.min.css" rel="stylesheet">
<!-- switchery -->
<link rel="stylesheet" href="${ctx }/css/switchery/switchery.min.css" />
<script src="${ctx }/js/jquery.min.js"></script>
<jsp:include page="../headv2.jsp" />
<script type="text/javascript" charset="utf-8" src="${ctx }/js/bootstrap-dialog.min.js"></script>
<!-- 页面Js文件的引用 -->
<script type="text/javascript" src="${ctx }/js/weixinv2/material/updateNewsList.js"></script>
<script type="text/javascript" src="${ctx }/js/ajaxfileupload.js"></script>
<!-- chart js -->
<script src="${ctx }/js/chartjs/chart.min.js"></script>
<!-- bootstrap progress js -->
<script src="${ctx }/js/progressbar/bootstrap-progressbar.min.js"></script>
<script src="${ctx }/js/nicescroll/jquery.nicescroll.min.js"></script>
<!-- icheck -->
<script src="${ctx }/js/icheck/icheck.min.js"></script>
<!-- tags -->
<script src="${ctx }/js/tags/jquery.tagsinput.min.js"></script>
<!-- switchery -->
<script src="${ctx }/js/switchery/switchery.min.js"></script>
<!-- daterangepicker -->
<script type="${ctx }/text/javascript" src="js/moment.min2.js"></script>
<script type="${ctx }/text/javascript" src="js/datepicker/daterangepicker.js"></script>
<!-- richtext editor -->
<script src="${ctx }/js/editor/bootstrap-wysiwyg.js"></script>
<script src="${ctx }/js/editor/external/jquery.hotkeys.js"></script>
<script src="${ctx }/js/editor/external/google-code-prettify/prettify.js"></script>
<!-- select2 -->
<script src="${ctx }/js/select/select2.full.js"></script>
<!-- form validation -->
<script type="text/javascript" src="${ctx }/js/parsley/parsley.min.js"></script>
<!-- textarea resize -->
<script src="${ctx }/js/textarea/autosize.min.js"></script>
<script>
	autosize($('.resizable_textarea'));
</script>
<!-- Autocomplete -->
<script type="text/javascript" src="${ctx }/js/autocomplete/countries.js"></script>
<script src="${ctx }/js/autocomplete/jquery.autocomplete.js"></script>
<script type="text/javascript" src="${ctx }/js/jquery.form.js"></script>
<!-- 修改 -->

<style>
.last a {
	margin-right: 5px;
}

.bootstrap-dialog-footer-buttons button {
	margin-bottom: 5px !important
}

.imgcover {
	width: 120px;
	height: 120px;
	background-image: url('images/upimage.png');
	background-size: 100% 100%;
}

.newcontentpart {
	margin: 10px
}

.modal-dialog-mainform {
	width: 1000px !important;
	height: 620px !important;
	margin: 30px auto 0px auto !important;
}

.modal-content-mainform {
	width: 1000px !important;
	height: 620px !important;
}

#editor img {
	max-width: 100%;
	height: auto !important;
}

.load {
	margin: auto;
  	position: absolute;
  	top: 0; left: 0; bottom: 0; right: 0;
	z-index: 1000;
}

.fa-small-size {
	font-size: 12px;
	font-weight: bolder;
	vertical-align: middle;
}
</style>
</head>
<body class="nav-md">
	<div class="container body">
		<div class="main_container">
			<div class="col-md-3 left_col">
				<jsp:include page="../leftv2.jsp" />
			</div>
			<div class="top_nav">
				<jsp:include page="../topnavv2.jsp" />
			</div>
			<div class="right_col" role="main">
				<div class="x_panel">
					<div style='display: none' id="loadGif" class="load">
							<img src='images/loadingPic.gif' class="load" alt='' />
					</div>
					<h4 class="modal-title" id="myModalLabel">编辑图文组</h4>
					<button type="button" class="btn btn-default" style="float: right"
						onclick="addWechatNewsEmpty()">新增文章</button>

					<div class="form-group">
						<input id="mediaId" name="mediaId" value="${mediaId }" style="display: none">
					</div>
					<div class="form-group">
						<input id="credentialId" name="credentialId" value="${credentialId }" style="display: none">
					</div>
					<table id="wechattable" class="table table-striped responsive-utilities jambo_table">
						<thead>
							<tr class="headings">
								<th style="width: 80px">封面</th>
								<th>标题</th>
								<th class=" no-link last" style="width: 150px">
									<span class="nobr">操作</span>
								</th>
							</tr>
						</thead>
						<tbody>
							<c:forEach var="newsList" items="${newsLists}">
								<tr id="record-${newsList.id}" class="even pointer">
									<c:if test="${newsList.cover!=null}">
										<td  class=" ">
											<img id="record-cover-${newsList.id}" class="coverimg lazy" src="images/loading.png" style="height: 40px; width: 70px"
												data-original="${newsList.cover.localuri}" src="">
										</td>
									</c:if>
									<c:if test="${newsList.cover==null}">
										<td id="record-title-${newsList.id}" class=" ">
											<img class="coverimg" data-original="" src="">
										</td>
									</c:if>

									<td id="record-title-${newsList.id}" class=" ">${newsList.title }</td>
									<td class=" last">
										<a onclick="editWechatNews('${newsList.id }')" href="javascript:;">编辑</a>
										<a onclick="delWechatNews('${newsList.id }')" href="javascript:;">删除文章</a>
									</td>
								</tr>
							</c:forEach>
						</tbody>
					</table>
					<!-- wechattable end -->
					<button type="button" class="btn btn-default" onclick="delWechatMedia()">删除</button>
					<button type="button" class="btn btn-default" onclick="self.location=document.referrer;">返回</button>

				</div>
				<footer>
					<jsp:include page="../footerv2.jsp" />
				</footer>
			</div>
		</div>
	</div>
</body>
<!-- Modal -->
<div class="modal fade" id="addNewsEntity" tabindex="-1" role="dialog"
	aria-labelledby="addWechatLabel">
	<div class="modal-dialog  modal-dialog-mainform" role="document">
		<div class="modal-content modal-content-mainform">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
				<button type="button" class="close" onclick="maxsize()">
					<span aria-hidden="true">
						<i data-toggle="tooltip" data-placement="left" data-original-title="编辑框尺寸最大化"
							class="fa fa-expand fa-small-size"></i>
					</span>
				</button>
				<button type="button" class="close" onclick="normalsize()">
					<span aria-hidden="true">
						<i data-toggle="tooltip" data-placement="left" data-original-title="编辑框尺寸正常化" class="fa fa-compress fa-small-size"></i>
					</span>
				</button>

				<h4 class="modal-title" id="formtitle">新增文章</h4>
			</div>
			<div class="x_content">
				<div id="metaform" class="row">
					<div class="col-md-2">
						<div class="newcontentpart">
							<div id="imgcover_0" class="imgcover"></div>
							<form id="imgfile" action="" enctype="multipart/form-data">
								<div id="container" class="moxie-shim"
									style="position: absolute; top: 10px; left: 20px; width: 120px; height: 120px; overflow: hidden; z-index: 0;">
									<input type="file"
										style="cursor: pointer; font-size: 999px; opacity: 50; position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;"
										id="upfile_0" onchange="uploadCover()" name="attach">
								</div>
								<input type="text" class="form-control" name="wxid" style="display: none"
									value="${credentialId}">

							</form>
						</div>
					</div>
					<div class="col-md-10">
						<div class="newcontentpart">
							<input class="title form-control " id="title_0" name="title" value="${wechatNews.title }"
								placeholder="标题">
						</div>
						<div class="newcontentpart">
							<input class="description form-control " id="digest" name="digest"
								value="${wechatNews.digest }" placeholder="文章摘要">
						</div>
						<div class="newcontentpart">
							<div class="row">
								<div class="col-md-4">
									<input class="description form-control " id="description_0" name="author"
										value="${wechatNews.author }" placeholder="作者">
								</div>
								<div class="col-md-8">
									<input class="description form-control " id="sourceUrl" name="sourceUrl"
										value="${wechatNews.sourceUrl}" placeholder="查看原文链接">
								</div>
							</div>
							<input type="text" class="form-control" name="coverLocalUri" id="coverLocalUri"
								style="display: none" id="picMediaId_0">
						</div>
					</div>
				</div>
				<div class="newcontentpart">
					<div id="alerts"></div>
					<div class="btn-toolbar editor" data-role="editor-toolbar" data-target="#editor">
						<div class="btn-group">
							<a class="btn dropdown-toggle" data-toggle="dropdown" title="字体">
								<i class="fa icon-font"></i>
								<b class="caret"></b>
							</a>
							<ul class="dropdown-menu">
							</ul>
						</div>
						<div class="btn-group">
							<a class="btn dropdown-toggle" data-toggle="dropdown" title="字体大小">
								<i class="icon-text-height"></i>
								&nbsp;
								<b class="caret"></b>
							</a>
							<ul class="dropdown-menu">
								<li>
									<a data-edit="fontSize 5">
										<p style="font-size: 17px">大号</p>
									</a>
								</li>
								<li>
									<a data-edit="fontSize 3">
										<p style="font-size: 14px">正常</p>
									</a>
								</li>
								<li>
									<a data-edit="fontSize 1">
										<p style="font-size: 11px">小号</p>
									</a>
								</li>
							</ul>
						</div>
						<div class="btn-group">
							<a class="btn" data-edit="bold" title="加粗 (Ctrl/Cmd+B)">
								<i class="icon-bold"></i>
							</a>
							<a class="btn" data-edit="italic" title="斜体 (Ctrl/Cmd+I)">
								<i class="icon-italic"></i>
							</a>
							<a class="btn" data-edit="strikethrough" title="删除线">
								<i class="icon-strikethrough"></i>
							</a>
							<a class="btn" data-edit="下划线" title="Underline (Ctrl/Cmd+U)">
								<i class="icon-underline"></i>
							</a>
						</div>
						<div class="btn-group">
							<a class="btn" data-edit="insertunorderedlist" title="无编号列表">
								<i class="icon-list-ul"></i>
							</a>
							<a class="btn" data-edit="insertorderedlist" title="有编号列表">
								<i class="icon-list-ol"></i>
							</a>
							<a class="btn" data-edit="outdent" title="反缩进 (Shift+Tab)">
								<i class="icon-indent-left"></i>
							</a>
							<a class="btn" data-edit="indent" title="缩进 (Tab)">
								<i class="icon-indent-right"></i>
							</a>
						</div>
						<div class="btn-group">
							<a class="btn" data-edit="justifyleft" title="左对齐 (Ctrl/Cmd+L)">
								<i class="icon-align-left"></i>
							</a>
							<a class="btn" data-edit="justifycenter" title="居中对齐 (Ctrl/Cmd+E)">
								<i class="icon-align-center"></i>
							</a>
							<a class="btn" data-edit="justifyright" title="右对齐 (Ctrl/Cmd+R)">
								<i class="icon-align-right"></i>
							</a>
							<a class="btn" data-edit="justifyfull" title="两端对齐 (Ctrl/Cmd+J)">
								<i class="icon-align-justify"></i>
							</a>
						</div>
						<div class="btn-group">
							<form id="articleImgfile" action="" enctype="multipart/form-data">
								<a class="btn" title="Insert picture (or just drag & drop)" id="articleImg">
									<i class="icon-picture"></i>
								</a>
								<div id="container" class="moxie-shim"
									style="position: absolute; top: 0px; left: 0px; width: 40px; height: 34px; overflow: hidden; z-index: 0;">
									<input type="file"
										style="cursor: pointer; font-size: 999px; opacity: 50; position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;"
										id="upfile_article" onchange="uploadArticleImg()" name="attach">
								</div>
								<input type="text" class="form-control" name="wxid" style="display: none"
									value="${credentialId}">

							</form>


						</div>
						<div class="btn-group">
							<a class="btn" data-edit="undo" title="撤销 (Ctrl/Cmd+Z)">
								<i class="icon-undo"></i>
							</a>
							<a class="btn" data-edit="redo" title="恢复 (Ctrl/Cmd+Y)">
								<i class="icon-repeat"></i>
							</a>
						</div>
					</div>
					<div id="editor" name="content" value="${wechatNews.content }"></div>
					<textarea name="descr" id="descr" style="display: none;"></textarea>
				</div>
			</div>
			<div clas="ln_solid"></div>
			<br />
			<div id="commander" class="form-group" style="margin: 0 auto; text-align: center;">
				<button type="button" class="btn btn-primary" style="margin: 0 auto; text-align: center;"
					onclick="addNewsEntity()">保存</button>
				<button type="button" class="btn" style="margin: 0 auto; text-align: center;"
					data-dismiss="modal">取消</button>
			</div>
		</div>
	</div>
</div>

</html>

<script type="text/javascript">
	$(function() {
		'use strict';
		var countriesArray = $.map(countries, function(value, key) {
			return {
				value : value,
				data : key
			};
		});
		// Initialize autocomplete with custom appendTo:
		$('#autocomplete-custom-append').autocomplete({
			lookup : countriesArray,
			appendTo : '#autocomplete-container'
		});
	});
</script>

<!-- select2 -->
<script>
	$(document).ready(function() {
		$(".select2_single").select2({
			placeholder : "Select a state",
			allowClear : true
		});
		$(".select2_group").select2({});
		$(".select2_multiple").select2({
			maximumSelectionLength : 4,
			placeholder : "With Max Selection limit 4",
			allowClear : true
		});
	});
</script>
<!-- /select2 -->
<!-- input tags -->
<script>
	function onAddTag(tag) {
		alert("Added a tag: " + tag);
	}

	function onRemoveTag(tag) {
		alert("Removed a tag: " + tag);
	}

	function onChangeTag(input, tag) {
		alert("Changed a tag: " + tag);
	}

	$(function() {
		$('#tags_1').tagsInput({
			width : 'auto'
		});
	});
</script>
<!-- /input tags -->
<!-- form validation -->
<script type="text/javascript">
	$(document).ready(function() {
		$.listen('parsley:field:validate', function() {
			validateFront();
		});
		$('#demo-form .btn').on('click', function() {
			$('#demo-form').parsley().validate();
			validateFront();
		});
		var validateFront = function() {
			if (true === $('#demo-form').parsley().isValid()) {
				$('.bs-callout-info').removeClass('hidden');
				$('.bs-callout-warning').addClass('hidden');
			} else {
				$('.bs-callout-info').addClass('hidden');
				$('.bs-callout-warning').removeClass('hidden');
			}
		};
	});

	$(document).ready(function() {
		$.listen('parsley:field:validate', function() {
			validateFront();
		});
		$('#demo-form2 .btn').on('click', function() {
			$('#demo-form2').parsley().validate();
			validateFront();
		});
		var validateFront = function() {
			if (true === $('#demo-form2').parsley().isValid()) {
				$('.bs-callout-info').removeClass('hidden');
				$('.bs-callout-warning').addClass('hidden');
			} else {
				$('.bs-callout-info').addClass('hidden');
				$('.bs-callout-warning').removeClass('hidden');
			}
		};
	});
	try {
		hljs.initHighlightingOnLoad();
	} catch (err) {
	}

	$(document).ready(function() {
		$('.xcxc').click(function() {
			$('#descr').val($('#editor').html());
		});
	});

	$(function() {
		    $("img.lazy").lazyload();
		function initToolbarBootstrapBindings() {
			var fonts = [ 'Serif', 'Sans', 'Arial', 'Arial Black', 'Courier',
					'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact',
					'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
					'Times New Roman', 'Verdana' ], fontTarget = $(
					'[title=Font]').siblings('.dropdown-menu');
			$
					.each(
							fonts,
							function(idx, fontName) {
								fontTarget
										.append($('<li><a data-edit="fontName ' + fontName + '" style="font-family:\'' + fontName + '\'">'
												+ fontName + '</a></li>'));
							});
			$('a[title]').tooltip({
				container : 'body'
			});
			$('.dropdown-menu input').click(function() {
				return false;
			}).change(
					function() {
						$(this).parent('.dropdown-menu').siblings(
								'.dropdown-toggle').dropdown('toggle');
					}).keydown('esc', function() {
				this.value = '';
				$(this).change();
			});

			$('[data-role=magic-overlay]').each(
					function() {
						var overlay = $(this), target = $(overlay
								.data('target'));
						overlay.css('opacity', 0).css('position', 'absolute')
								.offset(target.offset()).width(
										target.outerWidth()).height(
										target.outerHeight());
					});
			if ("onwebkitspeechchange" in document.createElement("input")) {
				var editorOffset = $('#editor').offset();
				$('#voiceBtn').css('position', 'absolute').offset({
					top : editorOffset.top,
					left : editorOffset.left + $('#editor').innerWidth() - 35
				});
			} else {
				$('#voiceBtn').hide();
			}
		}
		;

		function showErrorAlert(reason, detail) {
			var msg = '';
			if (reason === 'unsupported-file-type') {
				msg = "Unsupported format " + detail;
			} else {
				console.log("error uploading file", reason, detail);
			}
			$(
					'<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button>'
							+ '<strong>File upload error</strong> '
							+ msg
							+ ' </div>').prependTo('#alerts');
		}
		;
		initToolbarBootstrapBindings();
		$('#editor').wysiwyg({
			fileUploadError : showErrorAlert
		});
		window.prettyPrint && prettyPrint();
	});

	function normalsize() {
		$('#metaform').css("display","block");
		$('#editor').css("max-height","250px");
		$('#editor').css("height","250px");
	}
	function maxsize() {
		$('#metaform').css("display","none");
		$('#editor').css("max-height","430px");
		$('#editor').css("height","430px");

	}
</script>
<!-- /editor -->
