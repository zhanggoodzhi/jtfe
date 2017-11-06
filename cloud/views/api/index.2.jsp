<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
	<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
		<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
			<c:set var="ctx" value="${pageContext.request.contextPath}" />
			<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

				<html>

				<head>
					<jsp:include page="../headv2.jsp" />
					<script>
					</script>
					<script type="text/javascript">
						$(function() {
							$('#myTab li:eq(0) a').tab('show');
							$("#myTab a").on('shown.bs.tab', function(e) {
								height();
							});
						});

						function invoke(btn) {
							var $btn = $(btn);
							var $q = $("input[name='q']");
							var val = $.trim($q.val());
							if (val == '') {
								new PNotify({
									title: '提示：',
									text: '请输入问句！'
								});
								//alert('请输入问句');
								$q.focus();
								return;
							}
							var queryString = $("form").serialize();
							var url = "api/debug?" + queryString;
							$.ajax(url, {
								async: false,
								dataType: 'text',
								beforeSend: function(XMLHttpRequest) {
									$q.attr('disabled', 'disabled');
									$btn.attr('disabled', 'disabled');
								},
								success: function(data, textStatus) {
									$("#response").val(data);
								},
								complete: function(XMLHttpRequest, textStatus) {
									$q.removeAttr('disabled');
									$btn.removeAttr('disabled');
								}
							});
						}

						function height() {
							var screenHeight = window.innerHeight;
							var h = $(".x_panel").outerHeight(true) + $("footer").outerHeight(true) + $(".nav_menu").outerHeight(true) + 16;
							if (h > screenHeight) {
								$(".left_col").css("height", h + "px");
								$(".right_col").css("height", h + "px");
								$(".main_container").css("height", h + "px");
								$(".container").css("height", h + "px");
								$("body").css("height", h + "px");
							} else {
								$(".left_col").css("height", "100%");
								$(".right_col").css("height", "100%");
								$(".main_container").css("height", "100%");
								$(".container").css("height", "100%");
								$("body").css("height", "100%");
							}
						}
					</script>
					<style type="text/css">
						#home div {
							margin: 5px;
						}

						#suanfa div {
							margin: 5px;
						}

						#suanfa p {
							margin: 10px;
						}

						.sub-title {
							font-size: 14px;
							font-weight: bold;
							margin-top: 5px;
						}

						.li-margin-left {
							padding: 5px;
						}

						p {
							padding: 5px;
						}

						table {
							border-collapse: collapse;
							font-size: 14px;
						}

						#api th,
						#api td {
							border: 1px solid;
							padding: 5px;
						}

						#apiTest th,
						#apiTest td {
							padding: 5px;
							width: 400px;
						}

						#apiTest td input {
							padding: 5px;
							width: 600px;
						}

						.labelTb {
							text-align: right;
							width: 200px !important;
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
							<!-- page content -->
							<div class="right_col" role="main">
								<div class="x_panel">
									<ul id="myTab" class="nav nav-tabs">
										<li class="active">
											<a href="#home" data-toggle="tab"> 快速接入</a>
										</li>
										<li>
											<a href="#suanfa" data-toggle="tab">签名算法</a>
										</li>
										<li>
											<a href="#api" data-toggle="tab">接口详细</a>
										</li>
										<li>
											<a href="#apiTest" data-toggle="tab">接口调试</a>
										</li>

									</ul>
									<div id="myTabContent" class="tab-content">

										<div class="tab-pane fade in active" id="home">
											<div class="sub-title">开发者凭证</div>
											<div>
												<div>Key:${key }</div>
												<div>Secret:${secret }</div>
											</div>
											<div>金童云服务平台针对开发者公布API接口，开发者可以通过访问API接口与云服务进行快速对接。</div>
										</div>
										<div class="tab-pane fade" id="suanfa">
											<div class="sub-title">概述</div>
											<p>机器人API需要通过签名来访问，签名的过程是将App的key和secret以及随机数等参数根据一定签名算法生成的签名值，作为新的请求头中的一部分以此来提高访问过程中的防篡改性。签名值的生成详见下面的描述。</p>
											<div class="sub-title">签名生成规则</div>
											<p>所有机器人API的有效访问都必须包含签名</p>
											<p>签名算法如下：</p>
											<ol>
												<li class="li-margin-left">根据参数名称将所有请求参数及其值用英文"="连接</li>
												<li class="li-margin-left">将步骤一的各项按照字母先后顺序(自然顺序)排序</li>
												<li class="li-margin-left">将系统分配的secret拼接到步骤二的值的首尾</li>
												<li class="li-margin-left">使用密钥相关的哈希运算消息认证码(Hash-based Message Authentication Code,加密散列函数可以是MD5或者SHA-1)对步骤3的结果进行运算得到签名
												</li>
											</ol>
										</div>
										<div class="tab-pane fade" id="api" style="overflow: auto;">
											<div>
												<p class="sub-title">描述</p>
												<p>智能问答接口，基于HTTP协议的类REST调用方式，支持json输出格式，有普通和高级两种交互形式。</p>
											</div>
											<div>
												<p class="sub-title">调用入口</p>
												<p>环境地址，即调用接口(API)时，都通过访问该地址，来获取该接口需要获取的数据</p>
												<p>正式环境：http://open.jintongsoft.cn/router/rest</p>
												<p>测试环境：http://open.jintongsoft.cn/router-sandbox/rest</p>
											</div>
											<div>
												<p class="sub-title">请求参数</p>
												<div>
													<table border="1" cellspacing="0" cellpadding="0" width="100%">
														<tr>
															<th>名称</th>
															<th>类型</th>
															<th>是否必须</th>
															<th>描述</th>
														</tr>
														<tr>
															<td>method</td>
															<td>string</td>
															<td>Y</td>
															<td>API接口名称,设为"jintong.qa.answer.get"</td>
														</tr>
														<tr>
															<td>timestamp</td>
															<td>string</td>
															<td>Y</td>
															<td>时间戳(格式: yyyy-MM-dd HH:mm:ss)，服务端允许客户端请求时间误差为5分钟。</td>
														</tr>
														<tr>
															<td>format</td>
															<td>string</td>
															<td>N</td>
															<td>可选，指定响应格式，默认是json。目前支持格式为json和xml</td>
														</tr>
														<tr>
															<td>app_key</td>
															<td>string</td>
															<td>Y</td>
															<td>分配给应用的AppKey，创建应用时可获得</td>
														</tr>
														<tr>
															<td>v</td>
															<td>string</td>
															<td>Y</td>
															<td>API协议版本，可选值:2.0。</td>
														</tr>
														<tr>
															<td>sign</td>
															<td>string</td>
															<td>Y</td>
															<td>对API输入参数进行hmac加密获得</td>
														</tr>
														<tr>
															<td>sign_method</td>
															<td>string</td>
															<td>Y</td>
															<td>参数的加密方法选择，可选值是：md5,sha1</td>
														</tr>
														<tr>
															<td>fields</td>
															<td>string</td>
															<td>Y</td>
															<td>设置为空字符串即可</td>
														</tr>
														<tr>
															<td>ip</td>
															<td>string</td>
															<td>Y</td>
															<td>客户端ip地址</td>
														</tr>
														<tr>
															<td>uid</td>
															<td>string</td>
															<td>Y</td>
															<td>客户端用户id,如果是匿名用户,使用能唯一标识的字符串代替即可</td>
														</tr>
														<tr>
															<td>anony</td>
															<td>integer</td>
															<td>Y</td>
															<td>指明是0->注册用户还是1->匿名用户</td>
														</tr>
														<tr>
															<td>view</td>
															<td>integer</td>
															<td>Y</td>
															<td>指明平台1->pc端，2->移动端，3->微信，4->微博，5->易信，6->Android，7->IOS，8->论坛</td>
														</tr>
														<tr>
															<td>type</td>
															<td>integer</td>
															<td>Y</td>
															<td>响应格式（0-基础、1-高级）</td>
														</tr>
														<tr>
															<td>q</td>
															<td>string</td>
															<td>Y</td>
															<td>question</td>
														</tr>
														<tr>
															<td>sid</td>
															<td>string</td>
															<td>Y</td>
															<td>跟踪此次会话的字段,如果不需要此字段,则用时间戳代替</td>
														</tr>
														<tr>
															<td>character</td>
															<td>string</td>
															<td>N</td>
															<td>角色编号，（请见角色管理界面）</td>
														</tr>
													</table>
												</div>
											</div>
											<div>
												<p class="sub-title">响应说明（普通）</p>
												<table border="1" cellspacing="0" cellpadding="0" width="100%">
													<tbody>
														<tr>
															<th width="15%">元素名</th>
															<th width="40%">说明</th>
															<th width="45%">示例</th>
														</tr>
														<tr>
															<td>无</td>
															<td>直接纯文本响应</td>
															<td>为纯文本类型。例如：“您好, 小金童很高兴为您服务!”。</td>
														</tr>
													</tbody>
												</table>
											</div>
											<div>
												<p class="sub-title">响应说明（高级）</p>
												<table border="1" cellspacing="0" cellpadding="0" width="100%">
													<tbody>
														<tr>
															<th width="15%">元素名</th>
															<th width="40%">说明</th>
															<th width="45%">示例</th>
														</tr>
														<tr>
															<td>sid</td>
															<td>跟踪标识</td>
															<td>辅助作用字段</td>
														</tr>
														<tr>
															<td>msgid</td>
															<td>系统分配的消息id</td>
															<td>辅助作用字段</td>
														</tr>
														<tr>
															<td>question</td>
															<td>原始问句</td>
															<td>用户输入的原始问句，例如：“hi”</td>
														</tr>
														<tr>
															<td>hasAnswer</td>
															<td>标识是否具有业务意义上的答案</td>
															<td>用户输入的原始问句，例如：“hi”</td>
														</tr>
														<tr>
															<td>type</td>
															<td>响应类型。STANDARD或COMPOSITE。标识这次答案的类型是标准的语义答案还是特殊的复合类型的答案。</td>
															<td>type为STANDARD时从content或richContent中获取语义答案，type为COMPOSITE时可以从commands中依据各个command的名称解析其结构化信息作为答案</td>
														</tr>
														<tr>
															<td>content</td>
															<td>回复的文本内容。</td>
															<td>为纯文本类型。例如：“您好, 小金童很高兴为您服务!”。</td>
														</tr>
														<tr>
															<td>richContent</td>
															<td>回复的富文本内容。包含了一些html标签渲染样式，可通过百度uparse解析。</td>
															<td>为纯文本类型。例如：“您好, 小金童很高兴为您服务!”。</td>
														</tr>
														<tr>
															<td>related</td>
															<td>相关问题</td>
															<td>包含推荐问题和相似问题</td>
														</tr>
														<tr>
															<td>commands</td>
															<td>非文本的语义表述。</td>
															<td>根据command的名称解析相应的数据结构</td>
														</tr>
													</tbody>
												</table>
											</div>
											<div>
												<p class="sub-title">调用示例(请求)</p>
												<textarea rows="4" readonly="readonly" style="width: 80%; margin-left: 5%;">sign=xxx&anony=1&app_key=ed8ffe28ff7047afb47aa73b9a0c9790&fields=&ip=127.0.0.1&method=jintong.qa.answer.get&q=%E4%BD%A0%E4%BB%AC%E5%85%AC%E5%8F%B8%E5%9C%B0%E5%9D%80%E5%9C%A8%E5%93%AA%E9%87%8C&sid=1403508064000&sign_method=md5&amp;timestamp=2014-06-23+15%3A21%3A04&type=1&uid=hgpkfafjn5er6r34j22jdcrn65&v=2.0&view=2</textarea>

											</div>
											<div>
												<p class="sub-title">调用示例(响应)(普通)</p>
												<div>
													<p>您好, 我们公司总部地址为: 北京市朝阳区酒仙桥北路7号电通时代广场区2号楼A区 邮编:100015</p>
												</div>
											</div>
											<div>
												<p class="sub-title">调用示例(响应)(高级)</p>
												<div>
													<textarea style="width: 100%; height: 350px; border: 1px grey dashed; resize: none;" readonly="readonly">
{
  "sid" : "1403507050000",
  "msgid" : "11cf26a9b07f495588d0430fd1d08ebf",
  "question" : "你们公司地址在哪里",
  "hasAnswer" : true,
  "type" : "STANDARD",
  "content" : "您好, 我们公司总部地址为: 北京市朝阳区酒仙桥北路7号电通时代广场区2号楼A区 邮编:100015",
  "richContent" : "<p>您好, 我们公司总部地址为: 北京市朝阳区酒仙桥北路7号电通时代广场区2号楼A区 邮编:100015</p>",
  "related" : [ {
    "question" : "省/市/区/详细地址",
    "answer" : "您好, 我们公司总部地址为: 北京市朝阳区酒仙桥北路7号电通时代广场区2号楼A区 邮编:100015"
  } ],
  "commands" : [ ]
}
				</textarea>
												</div>
											</div>
										</div>

										<div class="tab-pane fade" id="apiTest" style="overflow: auto;">
											<form action="api/invoke">
												<table>
													<tr>
														<td class="labelTb">app_key:</td>
														<td>
															<input name="key" value="${key }">
														</td>
													</tr>
													<tr>
														<td class="labelTb">app_secret:</td>
														<td>
															<input name="secret" value="${secret }">
														</td>
													</tr>
												</table>
												<table>
													<tr>
														<td class="labelTb">method:</td>
														<td>
															<input name="method" value="jintong.qa.answer.get">
														</td>
													</tr>
													<tr>
														<td class="labelTb">timestamp:</td>

														<td>
															<input name="timestamp" value="${timestamp}">
														</td>
													</tr>
													<tr>
														<td class="labelTb">format:</td>
														<td>
															<input type="radio" name="format" value="json" id="json" style="width: auto" checked="checked"> &nbsp;&nbsp;
															<label for="json">json</label> &nbsp;&nbsp;
															<input type="radio" name="format" value="xml" id="xml" style="width: auto"> &nbsp;&nbsp;
															<label for="xml">xml</label>
														</td>
													</tr>
													<tr>
														<td class="labelTb">v:</td>
														<td>
															<input name="v" value="2.0">
														</td>
													</tr>
													<tr>
														<td class="labelTb">sign_method:</td>
														<td>
															<select name="sign_method">
												<option value="md5" selected="selected">md5</option>
												<option value="sha1">sha1</option>
											</select>
														</td>
													</tr>
													<tr>
														<td class="labelTb">fields:</td>
														<td>
															<input name="fields" value="" disabled="disabled">
														</td>
													</tr>
												</table>
												<table>
													<tr>
														<td class="labelTb">ip:</td>
														<td>
															<input name="ip" value="${ip }">
														</td>
													</tr>
													<tr>
														<td class="labelTb">anony:</td>
														<td>
															<input type="radio" name="anony" value="1" id="anony1" style="width: auto" checked="checked"> &nbsp;&nbsp;
															<label for="anony1">来访游客</label> &nbsp;&nbsp;
															<input type="radio" name="anony" value="0" id="anony0" style="width: auto"> &nbsp;&nbsp;
															<label for="anony0">注册用户</label>
														</td>
													</tr>
													<tr>
														<td class="labelTb">uid:</td>
														<td>
															<input name="uid" value="${uid }">
														</td>
													</tr>
													<tr>
														<td class="labelTb">view:</td>
														<td>
															<input type="radio" name="view" value="1" id="view1" style="width: auto" checked="checked"> &nbsp;&nbsp;
															<label for="view1">PC端</label> &nbsp;&nbsp;
															<input type="radio" name="view" value="2" id="view2" style="width: auto"> &nbsp;&nbsp;
															<label for="view2">移动端</label>
														</td>
													</tr>
													<tr>
														<td class="labelTb">type:</td>
														<td>
															<input type="radio" name="type" value="0" id="type0" style="width: auto" checked="checked"> &nbsp;&nbsp;
															<label for="type0">基础</label> &nbsp;&nbsp;
															<input type="radio" name="type" value="1" id="type1" style="width: auto"> &nbsp;&nbsp;
															<label for="type1">高级</label>
														</td>
													</tr>
													<tr>
														<td class="labelTb">
															<b>
												<sup style="color: red">*</sup>
												q:
											</b>
														</td>
														<td>
															<input name="q" value="" placeholder="输入测试问句">
														</td>
													</tr>
													<tr>
														<td class="labelTb">sid:</td>
														<td>
															<input name="sid" value="${sid }">
														</td>
													</tr>
												</table>
												<table>
													<tr>
														<td class="labelTb"></td>
														<td>
															<input type="button" value="调用接口" onclick="invoke(this);">
														</td>
													</tr>
												</table>
											</form>
											<table>
												<tr>
													<td class="labelTb">response:</td>
													<td>
														<textarea id="response" style="width: 600px; height: 250px; resize: none;" readonly="readonly"></textarea>
													</td>
												</tr>
											</table>
										</div>
									</div>
								</div>
								<footer>
									<jsp:include page="../footerv2.jsp" />
								</footer>
							</div>
						</div>
					</div>
				</body>

				</html>
