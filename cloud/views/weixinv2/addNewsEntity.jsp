<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page isELIgnored="false" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html lang="en">

<head>
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
    <!-- ajax文件上传 -->

<jsp:include page="../headv2.jsp" />

	<!-- bootstrap3-dialog 组件引用 -->
<script type="text/javascript" charset="utf-8"
	src="${ctx }/js/bootstrap-dialog.min.js"></script>
<!-- 页面Js文件的引用 -->
<script type="text/javascript" charset="utf-8"
	src="${ctx }/js/weixinv2/addNews.js"></script>
	<script type="text/javascript" src="${ctx }/js/ajaxfileupload.js"></script>
<style>
.imgcover{
	border: 1px solid #f5f5f5;
	width: 120px; height: 120px; 
	background-image: url('${ctx }/images/upimage.png'); 
	background-size: 100% 100%; 
	margin: 10px;
}
</style>

</head>

<body>
<!-- <div class="modal-dialog" role="document"> -->
		<!-- <div class="modal-content"> -->
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
				<h4 class="modal-title" id="myModalLabel">新增文章</h4>
			</div>
			
					<div class="newcontentpart">
						<h4>标题</h4>
						<input class="title form-control " id="title_0" name="title"
							value="${wechatNews.title }">
					</div>			
				
				
					<div class="newcontentpart">
						<h4>作者</h4>
						<input class="description form-control " id="description_0"
							name="author" value="${wechatNews.author }">
					</div>
				
				
					<div class="newcontentpart">
						<h4>封面</h4>
						<div id="imgcover_0" class="imgcover"></div>
						<input type="file" style="display: none" id="upfile_0"
							onchange="uploadcover(this,0)" name="upfile"> <input
							type="text" class="form-control" name="picMediaId"
							style="display: none" id="picMediaId_0">
					</div>
				
				
					<div class="newcontentpart">
						<h4>内容</h4>
						<div id="alerts"></div>
						<div class="btn-toolbar editor" data-role="editor-toolbar"
							data-target="#editor">
							<div class="btn-group">
								<a class="btn dropdown-toggle" data-toggle="dropdown"
									title="Font"><i class="fa icon-font"></i><b class="caret"></b></a>
								<ul class="dropdown-menu">
								</ul>
							</div>
							<div class="btn-group">
								<a class="btn dropdown-toggle" data-toggle="dropdown"
									title="Font Size"><i class="icon-text-height"></i>&nbsp;<b
									class="caret"></b></a>
								<ul class="dropdown-menu">
									<li><a data-edit="fontSize 5"><p
												style="font-size: 17px">Huge</p></a></li>
									<li><a data-edit="fontSize 3"><p
												style="font-size: 14px">Normal</p></a></li>
									<li><a data-edit="fontSize 1"><p
												style="font-size: 11px">Small</p></a></li>
								</ul>
							</div>
							<div class="btn-group">
								<a class="btn" data-edit="bold" title="Bold (Ctrl/Cmd+B)"><i
									class="icon-bold"></i></a> <a class="btn" data-edit="italic"
									title="Italic (Ctrl/Cmd+I)"><i class="icon-italic"></i></a> <a
									class="btn" data-edit="strikethrough" title="Strikethrough"><i
									class="icon-strikethrough"></i></a> <a class="btn"
									data-edit="underline" title="Underline (Ctrl/Cmd+U)"><i
									class="icon-underline"></i></a>
							</div>
							<div class="btn-group">
								<a class="btn" data-edit="insertunorderedlist"
									title="Bullet list"><i class="icon-list-ul"></i></a> <a
									class="btn" data-edit="insertorderedlist" title="Number list"><i
									class="icon-list-ol"></i></a> <a class="btn" data-edit="outdent"
									title="Reduce indent (Shift+Tab)"><i
									class="icon-indent-left"></i></a> <a class="btn" data-edit="indent"
									title="Indent (Tab)"><i class="icon-indent-right"></i></a>
							</div>
							<div class="btn-group">
								<a class="btn" data-edit="justifyleft"
									title="Align Left (Ctrl/Cmd+L)"><i class="icon-align-left"></i></a>
								<a class="btn" data-edit="justifycenter"
									title="Center (Ctrl/Cmd+E)"><i class="icon-align-center"></i></a>
								<a class="btn" data-edit="justifyright"
									title="Align Right (Ctrl/Cmd+R)"><i
									class="icon-align-right"></i></a> <a class="btn"
									data-edit="justifyfull" title="Justify (Ctrl/Cmd+J)"><i
									class="icon-align-justify"></i></a>
							</div>
							<div class="btn-group">
								<a class="btn dropdown-toggle" data-toggle="dropdown"
									title="Hyperlink"><i class="icon-link"></i></a>
								<div class="dropdown-menu input-append">
									<input class="span2" placeholder="URL" type="text"
										data-edit="createLink" />
									<button class="btn" type="button">Add</button>
								</div>
								<a class="btn" data-edit="unlink" title="Remove Hyperlink"><i
									class="icon-cut"></i></a>

							</div>

							<div class="btn-group">
								<a class="btn" title="Insert picture (or just drag & drop)"
									id="pictureBtn"><i class="icon-picture"></i></a> <input
									type="file" data-role="magic-overlay" data-target="#pictureBtn"
									data-edit="insertImage" />
							</div>
							<div class="btn-group">
								<a class="btn" data-edit="undo" title="Undo (Ctrl/Cmd+Z)"><i
									class="icon-undo"></i></a> <a class="btn" data-edit="redo"
									title="Redo (Ctrl/Cmd+Y)"><i class="icon-repeat"></i></a>
							</div>
						</div>

						<div id="editor" name="content" value="${wechatNews.content }">

						</div>
						<textarea name="descr" id="descr" style="display: none;"></textarea>
					</div>
				
				<div clas="ln_solid"></div>
				<br />
				<div class="form-group">
					<div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
						<button type="button" class="btn btn-success" onclick="addNewsEntity()">提交</button>
						<button type="button" class="btn btn-primary" data-dismiss="modal">取消</button>
					</div>
				</div>

			
		<!-- </div> -->
<!-- 	</div> -->
	
</body>
</html>
<script src="js/bootstrap.min.js"></script>

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
        <script type="text/javascript">
            $(function () {
                'use strict';
                var countriesArray = $.map(countries, function (value, key) {
                    return {
                        value: value,
                        data: key
                    };
                });
                // Initialize autocomplete with custom appendTo:
                $('#autocomplete-custom-append').autocomplete({
                    lookup: countriesArray,
                    appendTo: '#autocomplete-container'
                });
            });
        </script>
        <script src="${ctx }/js/custom.js"></script>


        <!-- select2 -->
        <script>
            $(document).ready(function () {
                $(".select2_single").select2({
                    placeholder: "Select a state",
                    allowClear: true
                });
                $(".select2_group").select2({});
                $(".select2_multiple").select2({
                    maximumSelectionLength: 4,
                    placeholder: "With Max Selection limit 4",
                    allowClear: true
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

            $(function () {
                $('#tags_1').tagsInput({
                    width: 'auto'
                });
            });
        </script>
        <!-- /input tags -->
        <!-- form validation -->
        <script type="text/javascript">
            $(document).ready(function () {
                $.listen('parsley:field:validate', function () {
                    validateFront();
                });
                $('#demo-form .btn').on('click', function () {
                    $('#demo-form').parsley().validate();
                    validateFront();
                });
                var validateFront = function () {
                    if (true === $('#demo-form').parsley().isValid()) {
                        $('.bs-callout-info').removeClass('hidden');
                        $('.bs-callout-warning').addClass('hidden');
                    } else {
                        $('.bs-callout-info').addClass('hidden');
                        $('.bs-callout-warning').removeClass('hidden');
                    }
                };
            });

            $(document).ready(function () {
                $.listen('parsley:field:validate', function () {
                    validateFront();
                });
                $('#demo-form2 .btn').on('click', function () {
                    $('#demo-form2').parsley().validate();
                    validateFront();
                });
                var validateFront = function () {
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
            } catch (err) {}
        </script>
        <!-- /form validation -->
        <!-- editor -->
        <script>
            $(document).ready(function () {
                $('.xcxc').click(function () {
                    $('#descr').val($('#editor').html());
                });
            });

            $(function () {
                function initToolbarBootstrapBindings() {
                    var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier',
                'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
                'Times New Roman', 'Verdana'],
                        fontTarget = $('[title=Font]').siblings('.dropdown-menu');
                    $.each(fonts, function (idx, fontName) {
                        fontTarget.append($('<li><a data-edit="fontName ' + fontName + '" style="font-family:\'' + fontName + '\'">' + fontName + '</a></li>'));
                    });
                    $('a[title]').tooltip({
                        container: 'body'
                    });
                    $('.dropdown-menu input').click(function () {
                            return false;
                        })
                        .change(function () {
                            $(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');
                        })
                        .keydown('esc', function () {
                            this.value = '';
                            $(this).change();
                        });

                    $('[data-role=magic-overlay]').each(function () {
                        var overlay = $(this),
                            target = $(overlay.data('target'));
                        overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
                    });
                    if ("onwebkitspeechchange" in document.createElement("input")) {
                        var editorOffset = $('#editor').offset();
                        $('#voiceBtn').css('position', 'absolute').offset({
                            top: editorOffset.top,
                            left: editorOffset.left + $('#editor').innerWidth() - 35
                        });
                    } else {
                        $('#voiceBtn').hide();
                    }
                };

                function showErrorAlert(reason, detail) {
                    var msg = '';
                    if (reason === 'unsupported-file-type') {
                        msg = "Unsupported format " + detail;
                    } else {
                        console.log("error uploading file", reason, detail);
                    }
                    $('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>File upload error</strong> ' + msg + ' </div>').prependTo('#alerts');
                };
                initToolbarBootstrapBindings();
                $('#editor').wysiwyg({
                    fileUploadError: showErrorAlert
                });
                window.prettyPrint && prettyPrint();
            });
        </script>
        <!-- /editor -->
       