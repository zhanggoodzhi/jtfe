
function initDefaultFeedbackGrid() {
	var autoWidth = function(percent, minWidth, remainMinWidth) {
		var tableWidth = $("body").width() - 2 * 22;

		remainWidth = tableWidth;
		var result = 0;
		if (remainMinWidth) {
			result = Math.max(remainWidth, remainMinWidth);
		} else if (minWidth) {
			result = Math.round(Math.max(tableWidth * percent, minWidth));
		} else {
			result = Math.round(tableWidth * percent);
		}

		remainWidth = remainWidth - result;
		// alert("table width = " + tableWidth + ", percent = " + percent +",
		// result = " + result);
		return result;
	}; 
	var h = $("#mainContextSession").height();
	var appid = $("#appid").val();
	$("#defaultFeedbackTab")
			.datagrid({
						width : '100%',
						height : h,// document.body.scrollHeight-110,
						nowrap : true,
						rownumbers : true,
						singleSelect : true,
						toolbar : '#tb',
						pagination : true,
						pageSize : 100,
						pageList : [100,300,500],
						url : appName + "/csSession/queryAppDefaultCsSessionPage",
						queryParams:{
							appid:appid
						},
						columns : [ [
								
								{
									field : 'remoteid',
									title : 'sessionID',
									width : autoWidth(0.16),
									sortable : true,
									align : 'center',
									formatter : function(value, rec) {
										var sessionHref;
										if(rec.remoteid==null||rec.remoteid == "undefined"){
											sessionHref="";
										}else{
											var data = rec.remoteid;
											sessionHref = '<a style="color:blue;text-decoration:underline;cursor:pointer;" onclick="showSessionData('
													+ rec.appid
													+ ',\''+data+'\')" >'
													+ data
													+ '</a>';
										}
										

										return sessionHref;
									}
								},
								
								{
									field : 'username',
									title : '客服名',
									width : autoWidth(0.05),
									sortable : true,
									align : 'center',
									formatter: function (value, rec) {
										var name;
										if(rec.account==null){
											name = '';
										}else{
											name =rec.account.username;
										}
								         return name;
								     }
								},

								{
									field : 'degree',
									title : '评分',
									width : autoWidth(0.03),
									sortable : true,
									align : 'center',
								},
								{
									field : 'shortComment',
									title : '用户评价',
									width : autoWidth(0.15),
									sortable : true,
									align : 'center',
								},
								{
									field : 'fullComment',
									title : '额外评价',
									width : autoWidth(0.15),
									sortable : true,
									align : 'center',
								},
								{
									field : 'tsp',
									title : '创建时间',
									width : autoWidth(0.11),
									sortable : true,
									align : 'center',
									formatter : function(value, rec) {
										var tsp = new Date(rec.tsp);
										var time = tsp.toLocaleString();
										return time;
									}
								},
								{
									field : 'opt',
									title : '操作',
									width : autoWidth(0.1),
									align : 'center',
									formatter : function(value, rec) {
										var remoteid = rec.remoteid;
										var chatLog = '<a class="btnSerDA" onclick="showChatLog(\''
												+ remoteid
												+ '\',\''
												+ ""
												+ '\',\''
												+ ""
												+ '\',\''
												+ 0
												+ '\')" >查看聊天记录</a>';
										return chatLog;
									}
								}, 
								 ] ],
							 onLoadSuccess : function(data) {
								$('.btnSerDA').linkbutton({
									text : '查看聊天记录',
									plain : true,
									iconCls : 'icon-search'
								});
							}
							
					});
	var pageConfig = function(pageSize, pageList){
		return {
	        pageSize: pageSize,
	        pageList: pageList,
	        beforePageText: '第',
	        afterPageText: '页    共 {pages} 页',  
	        displayMsg: '显示 {from} - {to} 条,  共 {total}条',  
	    };
	};
}
/**
 * 刷新
 */
function reject() {
	window.location.href = appName + "/csSession/csSessionManager";
}

function getChatlogData(remoteid,msgtext,sendername,pageNo,pageSize){
	$.ajax({
		url:appName + "/csSession/queryAppDefaultCsMsglogPage",
		type:'post',
		data:{"sessionid":remoteid,"msgtext":msgtext,"sendername":sendername,"pageNo":pageNo,"pageSize":pageSize},
		dataType:'json',
		success : function(data) {
			if(data==0){
				new PNotify({
	                title: '读取失败：',
	                text: '无相关聊天记录！',
	                type: 'error'
	            });
			}else{
				var page = data;
				var chatlist= "";
				$.each(page.list,function(i,item){
					var id = i+1;
					var time = new Date(parseInt(item.msgtime)).toLocaleString();
					chatlist = chatlist + "<tr id='chat" + id + "'>";
					chatlist = chatlist + "		<td class='tableid'>" + id + "</td>"
															+ "		<td class='tablesendname'>"
															+ item.sendername
															+ "</td>"
										+ "		<td class='tabletext'>" + item.msgtext + "</td>"
										+ "		<td class='tabletime'>" + time + "</td>"
										+ "</tr>";
				});
				//goPage(" + pageIndex +",\"" + remoteid + "\");
				var mslogPages = "";
				if(data.pageNo>1){
					var pageIndex = data.pageNo-1;
					mslogPages = mslogPages + "<li><a href='javascript:goPage(" + 1 +",\"" + remoteid + "\");' title='首页'>&laquo;</a></li>"
											+ "<li><a href='javascript:goPage(" + pageIndex +",\"" + remoteid + "\");' title='上一页'>&lsaquo;</a></li>";
					
				}else{
					mslogPages = mslogPages + "<li class='disabled'><a title='首页'>&laquo;</a></li>"
											+ "<li class='disabled'><a title='上一页'>&lsaquo;</a></li>";
											
				}
				
				
				
				if(data.numbers!=null){
					/*data.numbers.reverse();&raquo;rsaquo*/
					$.each(data.numbers,function(i,number){
						var pagination = data.pageCount - number + 1;
						if(data.pageNo==number){
							mslogPages = mslogPages + "<li class='active'><a>" + number + "</a></li>";
						}else{
							mslogPages = mslogPages + "<li><a href='javascript:goPage(" + number + ",\"" + remoteid + "\")' >" + number + "</a></li>";
						}
					});
				}
				
				if(data.pageCount > 0 && data.pageNo != data.pageCount){
					var pageIndex = data.pageNo+1;
					mslogPages = mslogPages	+ "<li><a href='javascript:goPage(" + pageIndex +",\"" + remoteid + "\");' title='下一页'>&rsaquo;</a></li>"
											+ "<li><a href='javascript:goPage(" + data.pageCount +",\"" + remoteid + "\");' href='#' title='尾页'>&raquo;</a></li>";
								
				}else{
					mslogPages = mslogPages + "<li class='disabled'><a title='下一页'>&rsaquo;</a></li>"
											+ "<li class='disabled'><a title='尾页'>&raquo;</a></li>";
				}
				/**------------------------------------------------------------------------------------**/
			
				var pages = "";
				
				pages = pages + "&nbsp;<span class='food'>共" + page.pageCount + "页</span>&nbsp;"
							  + "<span class='food'>总计" + page.totalCount + "条记录</span>&nbsp;"
							  + "<span class='food'><input type='hidden' name='pageCount' id='pageCount' /></span>&nbsp;"
							  + "<span class='food'>每页<input type='text' name='tpageSize' id='tpageSize'/>条记录</span>&nbsp;"
							  + "&nbsp;<span class='food'>跳转到第<input type='text' name='tpageNo' id='tpageNo'/>页</span>&nbsp;&nbsp;"
							  + "<div id='enterBt' onclick='javascript:goPageBtn($(\"#tpageNo\").val(),\""+ remoteid + "\");' id='go'>跳转</div>&nbsp;&nbsp;";
				
	    		
				$("#chatlist").html(chatlist);
				var pagination = page.pageCount - page.pageNo + 1;
				$("#page-select").html(pages);
				$("#pagination_page").html(mslogPages);
				$("#tpageNo").val(page.pageNo);
				$("#tpageSize").val(page.pageSize);
				$("#pageCount").val(page.pageCount);
			}
		}
	},'json');
}

function goPageBtn(num,remoteid){
	var pageCount = $("#pageCount").val();
	var pagination = pageCount - num + 1;
	goPage(num,remoteid);
}
function showChatLog(remoteid,msgtext,sendername,pageNo,pageSize){
	getChatlogData(remoteid,msgtext,sendername,pageNo,pageSize);
	$("#chatDiv").modal('toggle');
}

function showSessionData(appid, sessionid){
	$.ajax({
		url:appName + "/csSession/appDefaultClientDetailByCsSessionId",
		type:'post',
		data:{"appid":appid,"sessionid":sessionid},
		dataType:'json',
		success : function(data) {
			var val = data;
			$("#sessionid").html(val.id);
			
				if(val.realname==null||val.realname==""){
					val.realname='未分派';
				}
				if(val.email==null||val.email==""){
					val.email='未分派';
				}
				if(val.mobile==null||val.mobile==""){
					val.mobile='未分派';
				}
				if(val.qq==null||val.qq==""){
					val.qq='未分派';
				}
				if(val.wechat==null||val.wechat==""){
					val.wechat='未分派';
				}
				if(val.city==null||val.city==""){
					val.city='未分派';
				}
				if(val.ip==null||val.ip==""){
					val.ip='未分派';
				}
				if(val.notes==null||val.notes==""){
					val.notes='未分派';
				}
				$("#realname").html(val.realname);
				$("#email").html(val.email);
				$("#mobile").html(val.mobile);
				$("#qq").html(val.qq);
				$("#wechat").html(val.wechat);
				$("#city").html(val.city);
				$("#ip").html(val.ip);
				$("#notes").html(val.notes);
			
			
		}
	});
	
	$("#feedbackDiv").modal('toggle');
	
}

function goPage(num,remoteid,pageSize){
	var reg = /^[1-9]\d*$/;
	if(!reg.test(num)){
		new PNotify({
            title: '提示：',
            text: '请输入大于1（包括1）的整数字符！'
        });
	}else{
		var pageCount = document.getElementById("pageCount").value;
		if(num<0||parseInt(num)>parseInt(pageCount)){
			new PNotify({
                title: '提示：',
                text: "请输入1到" + pageCount + "的整数！"
            });
		}else{	
			var pageSize = $("#tpageSize").val();
			getChatlogData(remoteid,null,null,num,pageSize);
		}
	}
}

$(function() {

	$("#defaultFeedbackTabDiv").css("height",
			$("#mainContextSession").height() + "px");
	$("#defaultFeedbackTab").css("height",
			$("#defaultFeedbackTabDiv").height() + "px");
	initDefaultFeedbackGrid();
});