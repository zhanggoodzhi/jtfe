<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@taglib prefix="sf" uri="http://www.springframework.org/tags/form"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="en">

<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<!-- Meta, title, CSS, favicons, etc. -->
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>创建应用</title>
<script type="text/javascript">
	var appName = '${ctx}';
</script>
<!-- Bootstrap core CSS -->

<link href="${ctx}/css/bootstrap.min.css" rel="stylesheet">

<link href="${ctx}/fonts/css/font-awesome.min.css" rel="stylesheet">
<link href="${ctx}/css/animate.min.css" rel="stylesheet">

<!-- Custom styling plus plugins -->
<link href="${ctx}/css/custom.css" rel="stylesheet">
<link href="${ctx}/css/icheck/flat/green.css" rel="stylesheet">


<script src="${ctx}/js/jquery.min.js"></script>

<script type="text/javascript"
	src="${ctx}/js/jquery.noty.packaged.min.js"></script>
<script type="text/javascript" src="${ctx}/js/jtnoty.js"></script>
<!--[if lt IE 9]>
        <script src="../assets/js/ie8-responsive-file-warning.js"></script>
        <![endif]-->

<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
<!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
          <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->

</head>
<style>
body.nav-sm .main_container .top_nav {
	margin-left: 0px;
}

body.nav-md .container.body .right_col {
	margin-left: 0px;
}

body.nav-sm .container.body .right_col {
	margin-left: 0px;
}

.main_container .top_nav {
	margin-left: 0px;
}

#photo {
	width: 180px;
	border: 1px solid skyblue;
	border-radius: 4px;
	display: inline;
}

.control-domian {
	text-align: left;
	padding-left: 30px;
	margin-bottom: 0;
}
</style>

<body class="nav-md">

	<div class="container body">
		<div class="main_container">
			<!-- page content -->
			<div class="right_col_height right_col" role="main">
				<div class="">
					<div class="page-title">
						<div class="title_left">
							<h3>智能机器人初始化</h3>
						</div>
					</div>
					<div class="clearfix"></div>

					<div class="row">

						<div class="col-md-12 col-sm-12 col-xs-12">
							<div class="x_panel">
								<div class="x_title">
									<div class="clearfix"></div>
								</div>

								<div class="x_content">
									<form id="saveAppCreate" method="post"
										enctype="multipart/form-data"
										class="form-horizontal form-label-left">

										<!-- Smart Wizard -->
										<p>正式使用金童云平台之前, 需要您来帮忙创建专属于您的智能机器人</p>
										<div id="wizard" class="form_wizard wizard_horizontal">
											<ul class="wizard_steps">
												<li><a href="#step-1"> <span class="step_no">1</span>
														<span class="step_descr"> Step 1<br /> <small>基本信息填写</small>
													</span>
												</a></li>
												<li><a href="#step-2"> <span class="step_no">2</span>
														<span class="step_descr"> Step 2<br /> <small>初始化领域信息及聊天语料</small>
													</span>
												</a></li>
												<!-- <li><a href="#step-3"> <span class="step_no">3</span>
														<span class="step_descr"> Step 3<br /> <small>初始化公司基本信息</small>
													</span>
												</a></li> -->
											</ul>

											<div id="step-1">
												<h2 class="StepTitle">Step 1 完善智能机器人基本信息</h2>
												<p>基本信息是智能机器人的最基础的信息, 相当于机器人的身份证.</p>


												<span class="section">基本信息</span>

												<div class="form-group">
													<label class="col-md-12 col-sm12" for="first-name">智能客服名称<span
														class="required">*</span>
													</label>
													<div class="col-md-12 col-sm-12">
														<input type="text" id="robotname" name="robotname"
															required="required"
															class="form-control col-md-12 col-xs-12">
													</div>
												</div>
												<div class="form-group">
													<label class=" col-md-12 col-sm-12" for="last-name">机器人头像<span
														class="required">*</span>
													</label>

													<div class="row">
														<div class="col-md-12 col-sm-12 col-xs-12">
															<div class="x_panel">

																<div class="x_content">

																	<p>点击下面按钮打开上传窗口进行上传</p>
																	<form action="choices/form_upload.html"
																		class="dropzone"
																		style="border: 1px solid #e5e5e5; height: 300px;"></form>
																	<input type="file" id="robotpic" name="robotpic" /><span
																		id="picmsg">(推荐图像尺寸60×60像素)</span>

																</div>
															</div>
														</div>
													</div>
												</div>
												<div style="display:none;" class="form-group">
													<label for="middle-name"
														class="col-md-12 col-sm-12">个性化域名</label>
													<div class="col-md-12 col-sm-12">
														<input id="middle-name2"
															class="form-control col-md-12 col-xs-12" type="text"
															name="middle-name">
													</div>
												</div>



											</div>
											<div id="step-2">
												<h2 class="StepTitle">Step 2 初始化领域信息及聊天语料</h2>
												<div class="form-group">
												<p>1.请选择智能机器人所处的领域</p>
													<label class="control-domian col-md-3 col-sm-3 col-xs-12">领域列表</label>
													<div class="col-md-12 col-sm-12 col-xs-12">
														<c:forEach items="${domainList }" var="domian">
															<div class="checkbox">
																<label> <input id="domainList${domian.id }" name="domain" type="checkbox"
																	class="flat" value="${domian.id }">
																	${domian.domainName }
																</label>
															</div>
														</c:forEach>

													</div>
												</div>
												<p>2.聊天语料是智能机器人最基本的语料, 为用户提供了日常交流以及调侃的能力</p>
												<div class="form-group">
													<div class="checkbox">
														<label class="">
															<div class="icheckbox_flat-green"
																style="position: relative;">
																<input name="ischatcorpus" id="ischatcorpus" click="chatonchage()"
																	type="checkbox" class="flat" value="1"
																	style="position: absolute; opacity: 0;">
																<ins class="iCheck-helper"
																	style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);">
																</ins>
															</div> 导入聊天休闲语料
														</label>
													</div>
												</div>
												


												<!-- <div class="form-group">
													<div class="checkbox">
														<label class="">
															<div class="icheckbox_flat-green"
																style="position: relative;">
																<input name="isdomaincorpus" id="isdomaincorpus"
																	type="checkbox" class="flat" value="1"
																	style="position: absolute; opacity: 0;">
																<ins class="iCheck-helper"
																	style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);">
																</ins>
															</div> 导入领域自带语料
														</label>
													</div>
												</div> -->
												
											</div>

											<!-- <div id="step-3">
												<h2 class="StepTitle">Step 3 初始化公司基本信息</h2>
												<p>告诉我们贵公司的基本信息, 能够帮忙智能机器人回答用户贵公司的基本信息.</p>

												<div class="form-group">
													<label class="col-md-12 col-sm-12"
														for="first-name">公司是做什么的<span class="required">*</span>
													</label>
													<div class="col-md-12 col-sm-12">
														<input type="text" id="first-name2" required="required"
															class="form-control col-md-7 col-xs-12">
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-12 col-sm-12"
														for="first-name">公司的电话是什么<span class="required">*</span>
													</label>
													<div class="col-md-12 col-sm-12">
														<input type="text" id="first-name2" required="required"
															class="form-control col-md-7 col-xs-12">
													</div>
												</div>
												<div class="form-group">
													<label class="col-md-12 col-sm-12"
														for="last-name">公司的地址是什么<span class="required">*</span>
													</label>
													<div class="col-md-12 col-sm-12">
														<input type="text" id="last-name2" name="last-name"
															required="required"
															class="form-control col-md-7 col-xs-12">
													</div>
												</div>
												<div class="form-group">
													<label for="middle-name"
														class="col-md-12 col-sm-12">公司的主要产品是什么</label>
													<div class="col-md-12 col-sm-12">
														<input id="middle-name2"
															class="form-control col-md-7 col-xs-12" type="text"
															name="middle-name">
													</div>
												</div>
												<div class="form-group">
													<label for="middle-name"
														class="col-md-12 col-sm-12">公司的分支机构有哪些</label>
													<div class="col-md-12 col-sm-12">
														<input id="middle-name2"
															class="form-control col-md-7 col-xs-12" type="text"
															name="middle-name">
													</div>
												</div>
												<div class="form-group">
													<label for="middle-name"
														class="col-md-12 col-sm-12">公司的总裁是谁</label>
													<div class="col-md-12 col-sm-12">
														<input id="middle-name2"
															class="form-control col-md-7 col-xs-12" type="text"
															name="middle-name">
													</div>
												</div>
												<div class="form-group">
													<label for="middle-name"
														class="col-md-12 col-sm-12">公司的微信公众号是什么</label>
													<div class="col-md-12 col-sm-12">
														<input id="middle-name2"
															class="form-control col-md-7 col-xs-12" type="text"
															name="middle-name">
													</div>
												</div>
												<div class="form-group">
													<label for="middle-name"
														class="col-md-12 col-sm-12">公司的微博账号是多少</label>
													<div class="col-md-12 col-sm-12">
														<input id="middle-name2"
															class="form-control col-md-7 col-xs-12" type="text"
															name="middle-name">
													</div>
												</div>
												<div class="form-group">
													<label for="middle-name"
														class="col-md-12 col-sm-12">公司的官网是什么</label>
													<div class="col-md-12 col-sm-12">
														<input id="middle-name2"
															class="form-control col-md-7 col-xs-12" type="text"
															name="middle-name">
													</div>
												</div>
											</div> -->

										</div>
										<!-- End SmartWizard Content -->

									</form>
								</div>
							</div>
						</div>

					</div>
				</div>

				<!-- footer content -->
				<footer>
					<div class="">
						<p class="pull-right">
							金童软件 <a>Jintong Software</a>. | <span class="lead"> <i
								class="fa fa-cloud"></i> 云平台系统
							</span>
						</p>
					</div>
					<div class="clearfix"></div>
				</footer>
				<!-- /footer content -->

			</div>
			<!-- /page content -->
		</div>

	</div>

	<div id="custom_notifications" class="custom-notifications dsp_none">
		<ul class="list-unstyled notifications clearfix"
			data-tabbed_notifications="notif-group">
		</ul>
		<div class="clearfix"></div>
		<div id="notif-group" class="tabbed_notifications"></div>
	</div>

	<script src="${ctx}/js/bootstrap.min.js"></script>

	<!-- chart js -->
	<script src="${ctx}/js/chartjs/chart.min.js"></script>
	<!-- bootstrap progress js -->
	<script src="${ctx}/js/progressbar/bootstrap-progressbar.min.js"></script>
	<script src="${ctx}/js/nicescroll/jquery.nicescroll.min.js"></script>
	<!-- icheck -->
	<script src="${ctx}/js/icheck/icheck.min.js"></script>

	<!-- form wizard -->
	<script type="text/javascript"
		src="${ctx}/js/wizard/jquery.smartWizard.js"></script>
		<!-- PNotify -->
<script type="text/javascript" src="${ctx}/module/pnotify/pnotify.core.js"></script>
<script type="text/javascript" src="${ctx}/module/pnotify/pnotify.buttons.js"></script>
<script type="text/javascript" src="${ctx}/module/pnotify/pnotify.nonblock.js"></script>
<script src="${ctx}/js/appcreate.js"></script>
	<script type="text/javascript">
  
	function chatonchage(){
		console.log("ddddddddddddddddddd");
		if(this.checked){
			document.getElementById("domainList109").checked=true;	
		}else{
			document.getElementById("domainList109").checked=false;
		}
	}
	
	
		$(document).ready(function() {
			console.log("fe");
			
			
			//$("#domainList[value='109']").
			
			//Smart Wizard 	
			$('#wizard').smartWizard({
				onFinish : onFinishCallback,
				onLeaveStep: leaveAStepCallback,
				onShowStep : resizeHeight,
				labelNext : '下一步', // label for Next button
				labelPrevious : '上一步', // label for Previous button
				labelFinish : '提交', // label for Finish button        
			});

			function onFinishCallback() {
				$('#wizard').smartWizard('showMessage', 'Finish Clicked');
				console.log('Finish Clicked');
				appcreate();
			}
			
			//当点下一步时回调该函数，一般用于当前步骤的校验  
			function leaveAStepCallback(obj, context){
		        return validateSteps(context.fromStep); // return false to stay on step and true to continue navigation
			    
			} 
			// Your Step validation logic
		    function validateSteps(stepnumber){
		        var isStepValid = true;
		        // validate step 1
		        if(stepnumber == 1){
		        	if(checkImg() && checkRobotName()){
		        		return isStepValid;
		        	}else{
		        		isStepValid = false;
		        		return isStepValid;
		        	}
		            // Your step validation logic
		            // set isStepValid = false if has errors
		            
		        }else if(stepnumber == 2){
		        	if(checkDomain()){
		        		return isStepValid;
		        	}else{
		        		isStepValid = false;
		        		return isStepValid;
		        	}
		        }else{
		        	return isStepValid;
		        }
		        // ...      
		    }
		});

		$(document).ready(function() {
			// Smart Wizard	
			$('#wizard_verticle').smartWizard({
				transitionEffect : 'slide'
			});

		});
	</script>
	<script type="text/javascript" charset="utf-8"
		src="${ctx }/js/jquery.form.js"></script>
	<script src="${ctx}/js/custom.js"></script>

</body>

</html>