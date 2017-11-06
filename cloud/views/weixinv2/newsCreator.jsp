<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="en">

<head>
<jsp:include page="../headv2.jsp" />
<!-- richtext editor -->
<script src="js/editor/bootstrap-wysiwyg.js"></script>
<script src="js/weixinv2/material/newsCreator.js"></script>
<script src="js/editor/external/jquery.hotkeys.js"></script>
<script src="js/editor/external/google-code-prettify/prettify.js"></script>
<script src="js/ajaxfileupload.js"></script>
<script src="js/jquery.form.js"></script>

<!-- editor -->
<link href="fonts/css/font-awesome.css" rel="stylesheet">
<link href="css/editor/external/google-code-prettify/prettify.css" rel="stylesheet">
<link href="css/editor/index.css" rel="stylesheet">
<style>
.block-list li {
	list-style: none;
	background: #fff;
	padding: 5px 10px;
	margin: 0 0 10px 0;
	border-radius: 3px;
	color: #666;
	line-height: 1.321;
	opacity: 1;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}
#color_picker a {
line-height:30px;
color:white;
}
#editor_container {
	height: 100%;
}
.btn-group a {
padding:6px 10px;

}
#editor {
	min-height: 250px;
	overflow-x: hidden;
}
.dropdown-menu > li:hover {

}
#operation-tools {
	position: fixed;
	bottom: 20px;
	left: 40%;
	background-color: #73879C;
	height: 50px;
	color: white;
	z-index: 10;
	border-radius: 5px;
	padding: 10px;
}

#editor img {
  max-width: 100%;
	height: auto;
}

#editor .newline {
	line-height: 30px;
	width: 100%;
	min-height: 30px;
}

.imgcover {
	width: 100px;
	height: 100px;
	background-image: url('images/upimage.png');
	background-size: 100% 100%;
}

.block-list li {
	min-height: 50px;
}

* {
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
}

#piccontainer_parent img {
	cursor: pointer
}

.editor-img-container {
	padding: 2px;
}

#editor .block-inner {
	border: 2px dashed grey;
	position: relative;
}

.img_toolbar {
  border:2px solid red;
	position: absolute;
	top: 2px;
	opacity: 1;
	height: 40px;
	width: 200px;
	background-color: gainsboro;
}
</style>
<script>
	$(function() {
		$(".sidebar-footer").css("display", "none");
		resizeHeightRow();
		$(window).resize(function() {
			resizeHeightRow();
		});
    // 键盘kyeup则查询图片
		$('#searchbar').keypress(function (e) {
			 var key = e.which;
			 if(key == 13)  // the enter key code
			  {
			    $('#searchpic').click();
			    return false;
			  }
			});
	});
	var mediaId = '${mediaId}';
	var newsid = '${newsid}';
	var currentwxid = '${credential.id}';
	var currentwxname = '${credential.wxName}';
	var matrix = new Array();

	<c:forEach var="wechatCredential" items="${wechatCredentials}">
	matrix["${wechatCredential.id}"] = '${wechatCredential.wxName}';
	</c:forEach>

	 var defaultContent ='<div style="text-align: center;">本文为<b>${credential.wxName}</b>原创文章, 转载请注明出处<br/>欢迎大家扫描二维码关注微信公众号<br>';
     defaultContent+='<img src="${credential.qrcode}" style="width:120px;height:120px;"></div><hr>';
     defaultContent+='<div id="editor-usercontent-area" ><br/>请在此输入正文<br/><br/><br/></div>';
     var matrixercode ='<br/><hr><div style="text-align: center;">点击图片扫描二维码关注公众号</div><br/>';
     var matrixsize=0;
     matrixercode+='<div style="text-align: center;">';
     // <c:forEach var="wechatCredential" items="${wechatCredentials}">
     //         <c:if test="${wechatCredential.id!=credential.id}">
     //                 matrixercode +='<img src="${wechatCredential.qrcode}" style="width:120px;height:120px;">';
     //                 matrixsize+=1;
     //         </c:if>
     //         </c:forEach>
     matrixercode+='</div>';
     if(matrixsize>0)
             defaultContent+=matrixercode;

</script>
</head>


<body class="nav-sm" id="pagebody" style="overflow-y: hidden;">

	<div class="container body">
		<div class="main_container">
			<div class="col-md-3 left_col">
				<jsp:include page="../leftv2.jsp" />
			</div>

			<!-- page content -->
			<div class="right_col" role="main">
				<div class="white_panel" style="height: 100%;">

					<div id="editor_container" class="row" style="height: 100%;">
						<div class="col-lg-3" id="leftcontainer" style="height: 100%; overflow: auto">
							<!-- Nav tabs -->
							<ul class="nav nav-tabs" role="tablist">
								<li role="presentation" class="active"><a href="#blocktitle" aria-controls="blocktitle"
									role="tab" data-toggle="tab">标题黑寡妇</a></li>
								<li role="presentation"><a href="#blockimage" aria-controls="blockimage" role="tab"
									data-toggle="tab">图片</a></li>
								<li role="presentation"><a href="#blocktext" aria-controls="blocktext" role="tab"
									data-toggle="tab">文字</a></li>
								<li role="presentation"><a href="#blocksep" aria-controls="blocksep" role="tab"
									data-toggle="tab">分隔</a></li>
							</ul>

							<!-- Tab panes -->
							<div class="tab-content">
								<div role="tabpanel" class="tab-pane active" id="blocktitle">
									<ul class="block-list">
										<li class="js-add-block js-block-YVO8Pwz js-cat-102 js-scene-101 show" data-pcat-id="10"
										data-cat-id="102" data-scene-id="101" data-component-id="YVO8Pwz">
											<section class="block-inner" style="position: relative; width: 100%; margin: 0 auto;">
												<section style="text-align: center; margin: 0.5em 0;" data-component-id="YVO8Pwz">
													<section style="display: inline-block;">
														<section style="margin: 5px; height: 1.5em; box-sizing: border-box; padding: 0px;">
															<section class="color-changeable"
																style="display: inline-block; height: 100%; width: 1.5em; float: left; border-top-width: 0.4em; border-top-style: solid; border-color: rgb(198, 198, 199); border-left-width: 0.4em; border-left-style: solid; box-sizing: border-box; color: inherit; padding: 0px; margin: 0px;"></section>
														</section>
														<section
															style="margin: -1em 5px; padding: 10px 30px; box-sizing: border-box; color: inherit; display: inline-block;">
															<section
																style="font-size: 1.5em; line-height: 1.4; word-break: break-all; word-wrap: break-word; text-align: center; display: inline-block; box-sizing: border-box; padding: 0px; margin: 0px;">
																<p class="fontcolor-changeable gsTitle gsText"
																	style="color: rgb(51, 51, 51); font-size: 20px;">简洁标题</p>
															</section>
														</section>
														<section
															style="height: 1.5em; box-sizing: border-box; color: inherit; padding: 0px; margin: 0px;">
															<section class="color-changeable"
																style="height: 100%; width: 1.5em; float: right; border-bottom-width: 0.4em; border-bottom-style: solid; border-color: rgb(198, 198, 199); border-right-width: 0.4em; border-right-style: solid; box-sizing: border-box; color: inherit; padding: 0px; margin: 0px;"></section>
														</section>
													</section>
												</section>
											</section>

									</li>
										<li class="js-add-block js-block-3we8pOz js-cat-102 js-scene-101 show" data-pcat-id="10"
										data-cat-id="102" data-scene-id="101" data-component-id="3we8pOz">
											<section class="block-inner" style="position: relative; width: 100%; margin: 0 auto;">
												<section style="margin: 0.5em auto;" data-component-id="3we8pOz">
													<section style="padding: 0; box-sizing: border-box">
														<section style="text-align: center; margin-bottom: 10px">
															<section class="color-changeable"
																style="border: 3px solid rgb(230, 0, 18); padding: 3px; display: inline-block; text-align: center;">
																<section class="color-changeable"
																	style="border: 2px solid rgb(230, 0, 18); padding: 10px 40px; font-size: 20px; display: inline-block;">
																	<p class="fontcolor-changeable gsTitle gsText"
																		style="margin: 0px; color: rgb(51, 51, 51);">请输入标题</p>
																</section>
															</section>
														</section>
													</section>
												</section>
											</section>
									</li>
										<li class="js-add-block js-block-Y7Zmnk3 js-cat-103 js-scene-101" data-pcat-id="10"
										data-cat-id="103" data-scene-id="101" data-component-id="Y7Zmnk3">
											<section class="block-inner" style="position: relative; width: 100%; margin: 0 auto;">
												<section style="margin: 0.5em 0;" data-component-id="Y7Zmnk3">
													<section class="color-changeable"
														style="padding: 2px 0px; background-color: rgb(0, 176, 240);">
														<section
															style="border: 1px solid rgb(255, 255, 255); padding: 0.5em 1.5em; display: flex;">
															<p class="gsTitle gsText"
																style="font-size: 20px; color: rgb(255, 255, 255); font-weight: bold; line-height: 20px; margin: 0;">文章标题</p>
														</section>
													</section>
												</section>
											</section>
									</li>
										<li class="js-add-block js-block-3memkv3 js-cat-103 js-scene-101" data-pcat-id="10"
										data-cat-id="103" data-scene-id="101" data-component-id="3memkv3">
											<section class="block-inner" style="position: relative; width: 100%; margin: 0 auto;">
												<section style="margin: 0.5em 0; white-space: normal;" data-component-id="3memkv3">
													<section style="margin: 0px; box-sizing: border-box; display: inline-block">
														<section class="color-changeable"
															style="padding: 0.5em 0.2em; line-height: 14px; font-weight: 500; border-top-left-radius: 5px; border-top-right-radius: 5px; background-color: rgb(86, 197, 0);">
															<p class="gsTitle gsText" style="margin: 0px; color: rgb(254, 254, 254);">INFORMATION
																| 文章编辑</p>
														</section>
													</section>
													<section class="color-changeable"
														style="margin: 0em 0px 0px; padding: 0px; max-width: 100%; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(86, 197, 0); box-sizing: border-box; text-align: center;">
														<section
															style="margin-top: -9px; padding: 0; max-width: 100%; text-align: center; line-height: 1.4; box-sizing: border-box; margin-left: 1em;">
															<section class="color-changeable"
																style="display: inline-block; border-top-width: 6px; border-top-style: solid; border-top-color: rgb(86, 197, 0); border-bottom-width: 0px; border-bottom-color: rgb(86, 197, 0); color: inherit; border-left-width: 6px !important; border-right-width: 6px !important; border-left-style: solid !important; border-right-style: solid !important; border-left-color: transparent !important; border-right-color: transparent !important;"></section>
														</section>
													</section>
												</section>
											</section>
									</li>
										<li class="js-add-block js-block-Pz0Rr3y js-cat-101 js-scene-101" data-pcat-id="10"
										data-cat-id="101" data-scene-id="101" data-component-id="Pz0Rr3y">
											<section class="block-inner" style="position: relative; width: 100%; margin: 0 auto;">
												<section class="color-changeable"
													style="margin-top: 0.5em; margin-bottom: 0.5em; border-bottom-width: 2px; border-bottom-style: solid; border-bottom-color: rgb(210, 42, 208);"
													data-component-id="Pz0Rr3y">
													<section
														style="font-weight: bold; line-height: 28px; max-width: 100%; min-height: 32px;">
														<section class="color-changeable autonum gsText"
															style="border-radius: 80% 100% 90% 20%; color: rgb(255, 255, 255); display: inline-block; float: left; line-height: 20px; margin-right: 8px; padding: 4px 10px; word-wrap: break-word !important; background-color: rgb(210, 42, 208);">1</section>
														<section style="display: inline-block;">
															<p class="fontcolor-changeable gsText"
																style="margin: 0px; color: rgb(210, 42, 208); font-size: 16px;">标题</p>
														</section>
													</section>
												</section>
											</section>
									</li>
									</ul>
								</div>
								<div role="tabpanel" class="tab-pane" id="blockimage">
									<ul class="block-list">
										<li class="js-add-block js-block-z0DWmdz js-cat-201 js-scene-101 show" data-pcat-id="20"
										data-cat-id="201" data-scene-id="101" data-component-id="z0DWmdz">
											<section class="block-inner" style="position: relative; width: 100%; margin: 0 auto;">
												<section style="margin: 1em 0; box-sizing: border-box;" data-component-id="z0DWmdz">
													<section
														style="box-sizing: border-box; display: inline-block; border: 1px solid rgb(197, 161, 161); margin-left: 1em;">
														<section style="float: left; display: inline-block; width: 55%; padding-bottom: 10px;">
															<section style="width: 100%; margin-left: -1em; margin-top: -1em;">
																<img class="replaceable" src="upload/img/wxeditor/PM_YRO8WGz@!w300.jpg"
																	style="width: 100%; height: auto !important;">
															</section>
														</section>
														<section style="display: inline-block; width: 42%;">
															<section>
																<p class="gsText"
																	style="line-height: 1.5; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(197, 161, 161); font-size: 25px; margin: 0;">埃菲尔铁塔</p>
																<p class="gsText" style="font-size: 12px; line-height: 1.5em; margin: 0;">埃菲尔铁塔,法语LaTourEiffel;英语EiffelTower</p>
															</section>
														</section>
													</section>
												</section>
											</section>
									</li>
										<li class="js-add-block js-block-zMrDQO4 js-cat-201 js-scene-101 show" data-pcat-id="20"
										data-cat-id="201" data-scene-id="101" data-component-id="zMrDQO4">
											<section class="block-inner" style="position: relative; width: 100%; margin: 0 auto;">
												<section style="margin: 1em 0; box-sizing: border-box;" data-component-id="zMrDQO4">
													<section
														style="box-sizing: border-box; display: inline-block; border: 1px solid rgb(197, 161, 161); width: 98%;">
														<section style="display: inline-block; width: 45%;">
															<section style="padding-left: 10px;">
																<p class="gsText"
																	style="line-height: 1.5; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(197, 161, 161); font-size: 25px; text-align: right; font-weight: bold; margin: 0;">埃菲尔铁塔</p>
																<p class="gsText"
																	style="font-size: 12px; line-height: 1.5em; text-align: right; margin: 0;">埃菲尔铁塔,法语LaTourEiffel;英语EiffelTower</p>
															</section>
														</section>
														<section
															style="float: right; display: inline-block; width: 55%; padding-bottom: 10px;">
															<section style="width: 100%; margin-left: 1em; margin-top: -1em;">
																<img class="replaceable" src="upload/img/wxeditor/PM_zMrDPA4@!w300.jpg"
																	style="width: 100%; height: auto !important;">
															</section>
														</section>
													</section>
												</section>
											</section>
									</li>
										<li class="js-add-block js-block-4GOlym4 js-cat-201 js-scene-101 show" data-pcat-id="20"
										data-cat-id="201" data-scene-id="101" data-component-id="4GOlym4">
											<section class="block-inner" style="position: relative; width: 100%; margin: 0 auto;">
												<section style="margin: 1em 0; box-sizing: border-box;" data-component-id="4GOlym4">
													<section style="box-sizing: border-box; display: inline-block">
														<section style="display: inline-block; width: 43%; margin-left: 0.5em;">
															<section style="color: rgb(0, 0, 0)">
																<p class="gsText"
																	style="line-height: 1.5; text-align: center; font-size: 25px; font-weight: bold; margin: 0;">埃菲尔铁塔</p>
																<p class="gsText"
																	style="font-size: 12px; line-height: 1.5em; text-align: center; margin: 0;">La
																	Tour Eiffel</p>
																<p class="gsText"
																	style="font-size: 14px; line-height: 1.5em; text-align: left; margin: 0;">埃菲尔铁塔于1889年建成，得名于设计它的著名建筑师、结构工程师古斯塔夫·埃菲尔。</p>
															</section>
														</section>
														<section
															style="float: right; border: 1px solid rgb(197, 161, 161); display: inline-block; width: 50%; padding-bottom: 0.5em;">
															<section style="width: 100%; margin-left: -0.5em; margin-top: -1em;">
																<img class="replaceable" src="upload/img/wxeditor/PM_3Wl8LwY@!w300.jpg"
																	style="width: 100%; height: auto !important;">
															</section>
														</section>
													</section>
												</section>
											</section>
									</li>
										<li class="js-add-block js-block-4AGl6DY js-cat-201 js-scene-101 show" data-pcat-id="20"
										data-cat-id="201" data-scene-id="101" data-component-id="4AGl6DY">
											<section class="block-inner" style="position: relative; width: 100%; margin: 0 auto;">
												<section style="margin: 0.5em 0; width: 100%; display: table;"
													data-component-id="4AGl6DY">
													<section class="backgroundimage-style gsBG"
														style="padding: 10% 0px; text-align: -webkit-center; background: url(upload/img/wxeditor/PM_YQ0gQ83@!w500.jpg) 50% 50%/cover no-repeat;">
														<section
															style="text-align: center; box-sizing: border-box; display: block; margin: 0 auto; width: 200px; height: 200px; vertical-align: middle; border: 2px solid rgb(255, 255, 255);"></section>
														<section
															style="text-align: center; box-sizing: border-box; display: block; margin: 0 auto; width: 200px; vertical-align: middle; background-color: rgb(255, 255, 255); padding: 10px;">
															<p class="gsText"
																style="margin: 0 auto; text-align: center; font-size: 20px; color: rgb(0, 0, 0);">带你创意带你飞</p>
															<p class="gsText"
																style="margin: 0 auto; text-align: center; padding-top: 10px; color: rgb(0, 0, 0);">超级编辑器</p>
														</section>
													</section>
												</section>
											</section>
									</li>
									</ul>
								</div>
								<div role="tabpanel" class="tab-pane" id="blocktext">
									<ul class="block-list">
										<li class="js-add-block js-block-zLdW5wz js-cat-303 js-scene-101 show" data-pcat-id="30"
										data-cat-id="303" data-scene-id="101" data-component-id="zLdW5wz">
											<section class="block-inner" style="position: relative; width: 100%; margin: 0 auto;">
												<section
													style="margin: 0.5em 0; font-size: 1em; font-style: normal; font-weight: inherit; text-align: inherit; text-decoration: inherit; color: rgb(51, 51, 51); background-color: transparent;"
													data-component-id="zLdW5wz">
													<section style="height: 16px; box-sizing: border-box;">
														<section class="color-changeable"
															style="height: 100%; width: 24px; float: left; border-top: 6px solid; border-left: 6px solid; border-color: #000000;"></section>
														<section class="color-changeable"
															style="height: 100%; width: 24px; float: right; border-top: 6px solid; border-right: 6px solid; border-color: #000000;"></section>
														<section style="display: inline-block; color: transparent; clear: both;"></section>
													</section>
													<section class="color-changeable"
														style="margin: -13px 0px; padding: 12px; border-left-width: 6px; border-left-style: solid; border-right-width: 6px; border-right-style: solid; border-radius: 6px; line-height: 1.4; word-break: break-all; word-wrap: break-word; box-sizing: border-box; font-style: normal; color: rgb(51, 51, 51); border-color: #000000; font-size: 14px;">
														<p class="gsText" style="margin: 0;">有人告诉我，鱼的记忆只有7秒，7秒之后它就不记得过去的事情，一切又都变成新的。所以，在那小小鱼缸里的鱼儿，永远不会感到无聊。我宁愿是条鱼，7秒一过就什么都忘记，曾经遇到的人，曾经做过的事，都可以烟消云散。可我不是鱼，无法忘记我爱的人，无法忘记牵挂的苦，无法忘记相思的痛。</p>
													</section>
													<section style="height: 15px; box-sizing: border-box;">
														<section class="color-changeable"
															style="height: 100%; width: 24px; float: left; border-bottom: 6px solid; border-left: 6px solid; border-color: #000000;"></section>
														<section class="color-changeable"
															style="height: 100%; width: 24px; float: right; border-bottom-width: 6px; border-bottom-style: solid; border-right-width: 6px; border-right-style: solid; border-color: #000000;"></section>
													</section>
												</section>
											</section>
									</li>
										<li class="js-add-block js-block-zOP5oy4 js-cat-303 js-scene-101 show" data-pcat-id="30"
										data-cat-id="303" data-scene-id="101" data-component-id="zOP5oy4">
											<section class="block-inner" style="position: relative; width: 100%; margin: 0 auto;">
												<section style="margin: 0.5em 0px 0px; padding-left: 20px; text-align: right"
													data-component-id="zOP5oy4">
													<section class="color-changeable"
														style="border: 2px solid rgb(243, 136, 0); padding: 0px; margin: 0px; box-sizing: border-box; width: 96%;">
														<section
															style="text-align: left; width: 35px; height: 35px; margin-right: -16px; margin-top: -10px; float: right; display: flex;">
															<img class="color-changeable" src="upload/img/wxeditor/MASDFHP12P1.jpg"
																style="width: 100%; background-color: rgb(243, 136, 0);">
														</section>
														<section style="text-align: left; padding: 20px;">
															<p class="gsText" style="font-size: 14px; color: rgb(0, 0, 0); margin: 0;">土地是以它的肥沃和收获而被估价的；才能也是土地，不过它生产的不是粮食，而是真理。如果只能滋生瞑想和幻想的话，即使再大的才能也只是砂地或盐池，那上面连小草也长不出来的。</p>
														</section>
													</section>
													<section
														style="text-align: left; width: 35px; height: 35px; margin-top: -24px; margin-left: -18px; display: flex;">
														<img class="color-changeable" src="upload/img/wxeditor/MASDFHP12P2.jpg"
															style="width: 100%; background-color: rgb(243, 136, 0);">
													</section>
												</section>
											</section>
									</li>
										<li class="js-add-block js-block-4AGMxwY js-cat-301 js-scene-101 show" data-pcat-id="30"
										data-cat-id="301" data-scene-id="101" data-component-id="4AGMxwY">
											<section class="block-inner" style="position: relative; width: 100%; margin: 0 auto;">
												<section style="margin: 1em 0;" data-component-id="4AGMxwY">
													<section
														style="transform: matrix(1, 0.02, 0, 1, 0, 0); -ms-transform: matrix(1, 0.02, 0, 1, 0, 0); -moz-transform: matrix(1, 0.02, 0, 1, 0, 0); -webkit-transform: matrix(1, 0.02, 0, 1, 0, 0); -o-transform: matrix(1, 0.02, 0, 1, 0, 0);">
														<section style="background-color: rgb(191, 191, 191);">
															<section class="color-changeable"
																style="transform: matrix(1, -0.04, 0, 1, 0, 0); -ms-transform: matrix(1, -0.04, 0, 1, 0, 0); -moz-transform: matrix(1, -0.04, 0, 1, 0, 0); -webkit-transform: matrix(1, -0.04, 0, 1, 0, 0); -o-transform: matrix(1, -0.04, 0, 1, 0, 0);">
																<section style="padding: 10px 35px; background-color: rgb(195, 214, 155);">
																	<section style="width: 100%; margin: 10px 0px;">
																		<section
																			style="-webkit-transform: matrix(1, 0.02, 0, 1, 0, 0); transform: matrix(1, 0.02, 0, 1, 0, 0); -ms-transform: matrix(1, 0.02, 0, 1, 0, 0); -moz-transform: matrix(1, 0.02, 0, 1, 0, 0); -o-transform: matrix(1, 0.02, 0, 1, 0, 0);">
																			<p class="gsText" style="line-height: 2em; font-size: 18px; margin: 0;">时间是你我的桥</p>
																			<p class="gsText" style="margin: 0;">时间与空间的交错里，我的思念逡巡，或许在你熟睡
																				的窗边停留，或是你不经意仰望的天，你说我是你最美的遇见，可我知晓，人生就是无常的恒定，终究逃不过现实的变迁。</p>
																		</section>
																	</section>
																</section>
															</section>
														</section>
													</section>
												</section>
											</section>
									</li>
										<li class="js-add-block js-block-znOmKa4 js-cat-303 js-scene-101 show" data-pcat-id="30"
										data-cat-id="303" data-scene-id="101" data-component-id="znOmKa4">
											<section class="block-inner" style="position: relative; width: 100%; margin: 0 auto;">
												<section style="margin-top: 3em; margin-bottom: 0.5em;" data-component-id="znOmKa4">
													<section class="color-changeable"
														style="border: 2px solid rgb(58, 158, 108); box-sizing: border-box; width: 100%; margin-right: auto; margin-left: auto; display: inline-block; text-align: center;">
														<section
															style="width: 50px; height: 50px; /* margin-left: -19px; */ /* margin-top: 20px; */ margin-top: -40px; margin-left: auto; margin-right: auto;">
															<img class="color-changeable" src="upload/img/wxeditor/MASDFHP12P3.jpg"
																style="width: 100%; background-color: rgb(58, 158, 108);">
														</section>
														<section
															style="text-align: left; padding: 30px 10px 10px; margin-top: -15px; border: 1px; color: rgb(0, 0, 0);">
															<p class="gsText"
																style="font-weight: bold; text-align: center; font-size: 16px; margin: 0; padding-bottom: 5px;">一个人的事</p>
															<p class="gsText" style="font-size: 14px; margin: 0;">可以一个人唱歌，一个人喝咖啡，一个人涂鸦，一个人旅行，一个人逛大街，一个人在雨中漫步，一个人听音乐，一个人自言自语，一个人发呆，一个人跳舞，一个人看电视，一个人翻杂志……只有爱，是自己一个人做不到的。</p>
														</section>
													</section>
												</section>
											</section>
									</li>
										<li class="js-add-block js-block-znA6R9Y js-cat-301 js-scene-101 show" data-pcat-id="30"
										data-cat-id="301" data-scene-id="101" data-component-id="znA6R9Y">
											<section class="block-inner" style="position: relative; width: 100%; margin: 0 auto;">
												<section style="position: static; box-sizing: border-box; margin: 0.5em 0;"
													data-component-id="znA6R9Y">
													<section style="color: inherit;">
														<section style="border: 0px none;">
															<section style="margin-top: 10px; margin-left: 5px; color: rgb(0, 0, 0);">
																<section
																	style="width: 48%; display: inline-block; float: left; box-shadow: rgb(128, 130, 110) 0px 2px 5px;">
																	<section
																		style="padding: 10px; min-height: 140px; text-align: center; background: rgb(255, 255, 255);">
																		<h3 class="gsText" style="font-weight: bold; margin-bottom: 10px;">执着</h3>
																		<section style="color: inherit; font-size: 14px;">
																			<p class="gsText"
																				style="line-height: 24px; zoom: 1; margin-bottom: 0px; white-space: pre-wrap; text-align: left; background-color: rgb(255, 255, 255);">大部份的痛苦，都是不肯离场的结果，没有命定的不幸，只有死不放手的执着。</p>
																		</section>
																	</section>
																</section>
																<section
																	style="width: 48%; display: inline-block; text-align: center; box-shadow: rgb(128, 130, 110) 0px 2px 5px;">
																	<section style="padding: 10px; min-height: 140px; background: rgb(255, 255, 255);">
																		<h3 class="gsText" style="font-weight: bold; margin-bottom: 10px;">酒事</h3>
																		<section style="color: inherit; font-size: 14px;">
																			<p class="gsText"
																				style="line-height: 24px; zoom: 1; margin-bottom: 0px; white-space: pre-wrap; text-align: left; background-color: rgb(255, 255, 255);">酒在肚子里,事在心里,中间总好象隔着一层,无论喝多少酒,都淹不到心上去。</p>
																		</section>
																	</section>
																</section>
															</section>
														</section>
													</section>
												</section>
											</section>
									</li>
										<li class="js-add-block js-block-Y7Z0eb3 js-cat-301 js-scene-101 show" data-pcat-id="30"
										data-cat-id="301" data-scene-id="101" data-component-id="Y7Z0eb3">
											<section class="block-inner" style="position: relative; width: 100%; margin: 0 auto;">
												<section
													style="position: static; box-sizing: border-box; border: 0px none; margin: 0.5em 0;"
													data-component-id="Y7Z0eb3">
													<section style="margin-right: auto; margin-left: auto;">
														<section class="color-changeable"
															style="width: 90%; margin-top: 10px; margin-bottom: 10px; padding: 20px 10px 40px; box-sizing: border-box; border-radius: 10px; color: rgb(255, 255, 255); height: auto !important; background-color: rgb(140, 0, 0);">
															<section
																style="font-size: 14px; line-height: 32px; display: inline-block; width: 100%;">
																<section style="display: inline-block; float: left; width: 5%;">
																	<section style="color: inherit;">
																		<p style="font-size: 30px;">问</p>
																	</section>
																</section>
																<section style="float: left; padding-left: 20px; width: 90%;">
																	<section style="display: inline-block;">
																		<p class="gsText" style="line-height: 1.5em; margin: 0;">唐僧哪了？</p>
																		<p class="gsText" style="line-height: 1em; margin: 0;">本大王要吃唐僧肉...</p>
																	</section>
																</section>
															</section>
														</section>
														<section
															style="box-sizing: border-box; width: 90%; border: 1px dashed rgb(112, 112, 110); display: inline-block; margin-left: 10%; margin-top: -40px; padding: 20px 10px; border-radius: 8px; height: auto !important; background-color: rgb(254, 254, 254);">
															<section
																style="line-height: 32px; display: inline-block; width: 100%; font-size: 14px;">
																<section style="display: inline-block; float: left; width: 5%;">
																	<section>
																		<p style="font-size: 30px;">答</p>
																	</section>
																</section>
																<section style="float: left; padding-left: 20px; width: 90%;">
																	<section style="display: inline-block;">
																		<p class="gsText" style="line-height: 1.5em; margin: 0;">大王，唐僧马上就到火焰山了。</p>
																		<p class="gsText" style="line-height: 1.5em; margin: 0;">小的已经布置好天罗地网，到时一定能吃到唐僧肉^_^</p>
																	</section>
																</section>
															</section>
														</section>
													</section>
												</section>
											</section>
									</li>
									</ul>
								</div>

								<div role="tabpanel" class="tab-pane" id="blocksep">
									<ul class="block-list">
										<li class="js-add-block js-block-YROZW5z js-cat-504 js-scene-101 show" data-pcat-id="50"
										data-cat-id="504" data-scene-id="101" data-component-id="YROZW5z">
											<section class="block-inner" style="position: relative; width: 100%; margin: 0 auto;">
												<section style="margin: 0.5em 0; text-align: center;" data-component-id="YROZW5z">
													<img style="width: 100%;" src="upload/img/wxeditor/MASDFHP12P4.jpg">
												</section>
											</section>
									</li>
										<li class="js-add-block js-block-3rwv5yY js-cat-504 js-scene-101 show" data-pcat-id="50"
										data-cat-id="504" data-scene-id="101" data-component-id="3rwv5yY">
											<section class="block-inner" style="position: relative; width: 100%; margin: 0 auto;">
												<section style="margin: 0.5em 0; text-align: center;" data-component-id="3rwv5yY">
													<img style="max-width: 100%;" src="upload/img/wxeditor/MASDFHP12P5.jpg">
												</section>
											</section>
									</li>

										<li class="js-add-block js-block-zMrNwO4 js-cat-504 js-scene-101 show" data-pcat-id="50"
										data-cat-id="504" data-scene-id="101" data-component-id="zMrNwO4">
											<section class="block-inner" style="position: relative; width: 100%; margin: 0 auto;">
												<section style="margin: 0.5em 0; text-align: center;" data-component-id="zMrNwO4">
													<img style="width: 90%;" src="upload/img/wxeditor/MASDFHP12P6.jpg">
												</section>
											</section>
									</li>
										<li class="js-add-block js-block-4XXN0P4 js-cat-504 js-scene-101 show" data-pcat-id="50"
										data-cat-id="504" data-scene-id="101" data-component-id="4XXN0P4">
											<section class="block-inner" style="position: relative; width: 100%; margin: 0 auto;">
												<section style="margin: 0.5em 0;" data-component-id="4XXN0P4">
													<img style="width: 100%;" src="upload/img/wxeditor/MASDFHP12P7.jpg">
												</section>
											</section>
									</li>
										<li class="js-add-block js-block-YgPJBXz js-cat-504 js-scene-101 show" data-pcat-id="50"
										data-cat-id="504" data-scene-id="101" data-component-id="YgPJBXz">
											<section class="block-inner" style="position: relative; width: 100%; margin: 0 auto;">
												<section style="margin: 0.5em 0; text-align: center;" data-component-id="YgPJBXz">
													<img style="width: 100%;" src="upload/img/wxeditor/MASDFHP12P8.jpg">
												</section>
											</section>
									</li>
									</ul>
								</div>
							</div>
						</div>
						<div class="col-lg-4" id="centercontainer" style="height: 100%;">
							<div id="metaform" class="row">
								<div class="col-md-3">
									<div class="newcontentpart">
										<div id="imgcover_0" class="imgcover"></div>
										<form id="imgfile" action="" enctype="multipart/form-data">
											<div id="container" class="moxie-shim"
												style="position: absolute; top: 0px; left: 10px; width: 100px; height: 100px; overflow: hidden; z-index: 0;">
												<input type="file"
													style="cursor: pointer; font-size: 999px; opacity:0; position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;"
													id="upfile_0" onchange="uploadCover()" name="attach"
													accept="image/png, image/jpeg, image/jpg">
											</div>
											<input type="text" class="form-control" name="wxid" style="display: none"
												value="${credentialId}">

										</form>
									</div>
								</div>
								<div class="col-md-9">
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
										<div class="form-group">
											<input id="mediaId" name="mediaId" value="${mediaId }" style="display: none">
										</div>
										<div class="form-group">
											<input id="credentialId" name="credentialId" value="${credentialId }"
												style="display: none">
										</div>
									</div>
									<div class="checkbox search-type-wrap">
 	                                 	 <label>
                                           	<input type="checkbox" name="cover_show" id="cover_show">封面图片显示在正文中
	                                     </label>
	                                </div>
								</div>
							</div>
							<div class="newcontentpart">
								<div id="alerts"></div>
								<div class="btn-toolbar editor" id="editor_toolbar" data-role="editor-toolbar"
									data-target="#editor">
									<div class="btn-group">

										<a class="btn dropdown-toggle" data-toggle="dropdown" title="字体"> <i
											class="fa fa-font"></i>
										</a>
										<ul class="dropdown-menu">
											<li><a data-edit="fontName SimSun " style="font-family: 'SimSun '">宋体</a></li>
											<li><a data-edit="fontName FangSong  " style="font-family: 'FangSong  '">仿宋</a></li>
											<li><a data-edit="fontName KaiTi  " style="font-family: 'KaiTi  '">楷体</a></li>
											<li><a data-edit="fontName Microsoft YaHei  "
												style="font-family: 'Microsoft YaHei  '">雅黑</a></li>
										</ul>
									</div>
									<div class="btn-group">
										<a class="btn dropdown-toggle" data-toggle="dropdown" title="字体大小"> <i
											class="fa fa-text-height"></i>
										</a>
										<ul class="dropdown-menu">
											<li><a data-edit="fontSize 5">
													<p style="font-size: 17px">大号</p>
											</a></li>
											<li><a data-edit="fontSize 3">
													<p style="font-size: 14px">正常</p>
											</a></li>
											<li><a data-edit="fontSize 1">
													<p style="font-size: 11px">小号</p>
											</a></li>
										</ul>
									</div>
									<div class="btn-group">
										<a class="btn dropdown-toggle" data-toggle="dropdown" title="字体颜色"> <i id='color_identifier'
											class="fa fa-dashboard"></i>
										</a>
										<ul id="color_picker" class="dropdown-menu">
											<li style="background-color: #5856D6"><a data-edit="foreColor #5856D6">暗蓝</a></li>
											<li style="background-color: #007aff"><a data-edit="foreColor #007aff">深蓝</a></li>
											<li style="background-color: #34aadc"><a data-edit="foreColor #34aadc">蓝色</a></li>
											<li style="background-color: #5ac8fa"><a data-edit="foreColor #5ac8fa">浅蓝</a></li>
											<li style="background-color: #4cd964"><a data-edit="foreColor #4cd964">绿色</a></li>
											<li style="background-color: #ff2d55"><a data-edit="foreColor #ff2d55">粉红</a></li>
											<li style="background-color: #ff3b30"><a data-edit="foreColor #ff3b30">红色</a></li>
											<li style="background-color: #ff9500"><a data-edit="foreColor #ff9500">桔黄</a></li>
											<li style="background-color: #ffcc00"><a data-edit="foreColor #ffcc00">黄色</a></li>
											<li style="background-color: #8e8e93"><a data-edit="foreColor #8e8e93">灰色</a></li>
											<li style="background-color: BLACK"><a data-edit="foreColor BLACK">黑色</a></li>
											<li style="background-color: WHITE;"><a style = "color:black" data-edit="foreColor WHITE">白色</a></li>
										</ul>
									</div>
									<div class="btn-group">
										<a class="btn" data-edit="bold" title="加粗 (Ctrl/Cmd+B)"> <i class="fa fa-bold"></i></a>
                    <a class="btn" data-edit="italic" title="斜体 (Ctrl/Cmd+I)"> <i class="fa fa-italic"></i></a>
                    <a class="btn" data-edit="underline" title="Underline (Ctrl/Cmd+U)"> <i class="fa fa-underline"></i></a>
									</div>
									<div class="btn-group">
										<a class="btn" data-edit="justifyleft" title="左对齐 (Ctrl/Cmd+L)"> <i
											class="fa fa-align-left"></i>
										</a> <a class="btn" data-edit="justifycenter" title="居中对齐 (Ctrl/Cmd+E)"> <i
											class="fa fa-align-center"></i>
										</a> <a class="btn" data-edit="justifyright" title="右对齐 (Ctrl/Cmd+R)"> <i
											class="fa fa-align-right"></i>
										</a>
									</div>
									<div class="btn-group">
										<form id="articleImgfile" action="" enctype="multipart/form-data">
											<a class="btn" title="Insert picture (or just drag & drop)" id="articleImg"> <i class="fa fa-picture-o"></i></a>
											<div id="container" class="moxie-shim"
												style="position: absolute; top: 0px; left: 0px; width: 40px; height: 34px; overflow: hidden; z-index: 0;">
												<input type="file"
													style="cursor: pointer; font-size: 999px; opacity:0; position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;"
													id="upfile_article" onchange="uploadArticleImg()" name="attach">
											</div>
											<input type="text" class="form-control" name="wxid" style="display: none"
												value="${credentialId}">

										</form>


									</div>
									<div class="btn-group">
										<a class="btn" data-edit="undo" title="撤销 (Ctrl/Cmd+Z)"> <i class="fa fa-undo"></i>
										</a> <a class="btn" data-edit="redo" title="恢复 (Ctrl/Cmd+Y)"> <i class="fa fa-repeat"></i>
										</a>
									</div>
								</div>
								<div id="editor" name="content" value="${wechatNews.content }"></div>
								<ul id="operation-tools" role="group">
									<li class="btn-group" role="group"><a href="javascript:;" class="btn btn-default"
										id="js-cleardoc" onclick="addNewsEntity()">保存</a></li>
									<li class="btn-group" role="group"><a href="javascript:;" class="btn btn-default"
										id="js-cleardoc" onclick="emptyeditor()">清空</a></li>
									<li class="btn-group" role="group"><a href="javascript:;" class="btn btn-default"
										id="js-cleardoc" onclick="returnPrevious()">返回</a></li>
								</ul>
								<textarea name="descr" id="descr" style="display: none;"></textarea>
							</div>
						</div>
						<div class="col-lg-5" id="rightcontainer" style="height: 100%;">
							<!-- 							<ul class="nav nav-tabs" role="tablist">
								<li role="presentation" class="active">
									<a href="#imgftm" aria-controls="imgftm" role="tab" data-toggle="tab">视图网图库</a>
								</li>
								<li role="presentation">
									<a href="#imgprivate" aria-controls="imgprivate" role="tab" data-toggle="tab">我的图片</a>
								</li>
							</ul>
 -->
							<!-- Tab panes -->
							<div class="tab-content">
								<div role="tabpanel" class="tab-pane active" id="imgftm">
									<div class="row">
										<div class="col-sm-10">
											<input type="text" class="form-control" id="searchbar" placeholder="输入关键词查找视图网正版图片">
										</div>
										<div class="col-sm-2">
											<button type="submit" id="searchpic" class="btn btn-default" onclick="searchpic()">查找图片</button>
										</div>
									</div>
									<div id="piccontainer_parent" style="overflow-y: auto">
										<div id="piccontainer" style="margin-top: 10px"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

	</div>

</body>
<script type="text/javascript">
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
	};
	$(function() {
		$('#editor').wysiwyg({
			fileUploadError : showErrorAlert,
		});

	});

	$(".block-list li").mousedown(function(event) {
		rteInsertHTML($(this).html());
	});
	rteName = "editor";


</script>
<script src="js/waterfall/handlebars.js"></script>
<script src="js/waterfall/waterfall.min.js"></script>
<script type="text/x-handlebars-template" id="waterfall-tpl">
  {{#result}}
    <div class="item">
        <img src="{{thumb}}" onclick="insertPic('{{thumb}}')" style="width:150px;height:auto"/>
    </div>
  {{/result}}
</script>
<script>
	var pickeyword = "moutain";
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
</script>

</html>
