var client_style = undefined;
function onSelectSex(sexId) {
	client_style = sexId;
}


function innerDel(id,name) {
	if(name=="小金童"){
		new PNotify({
            title: '提示：',
            text: '小金童为默认角色，不可删除！'
        });
		return;
	}
		$.messager.confirm('Confirm', '确定要删除吗?', function(r) {
			if (r) {
					if(name=="小金童"){
						new PNotify({
				            title: '提示：',
				            text: '小金童为默认角色，不可删除！'
				        });
						doRefresh();
						exit;
					}
				
					window.location="/cloud/frontStyle/delete?id="+id;
			}
		});
}

function doRefresh() {
	$('#dg2').datagrid('clearChecked');
	$('#dg2').datagrid('clearSelections');
	$('#dg2').datagrid('unselectAll');
	$('#dg2').datagrid('reload');
	$('#cParent').combobox('reload');
}

function del(){
	window.location = "/cloud/app/deleteRelateTable";
}
function add2() {
	if($("#sid").val()==0){
		if($("#robot_name").val()==""||$("#robot_name").val()==null){
			new PNotify({
	            title: '提示：',
	            text: '机器人名为必填项！'
	        });
			return;
		}
		//验证图片格式
		var imgfile = $("#photo");
		var fileValue = document.getElementById("photo").value;
		if(fileValue !=null && fileValue.length > 0){
			if(!/.(gif|jpg|jpeg|png|jpg)$/.test(fileValue)) {
				fileValue = null;
				new PNotify({
		            title: '提示：',
		            text: '机器人头像格式格式需为gif/jpg/jpeg/png/jpg中的一种！'
		        });
				clearFileInput(imgfile);
				return false;
			}else if(!checkfile("photo")){
				clearFileInput(imgfile);
				return;
	        }else{
	        	
	        }
		}else{
			new PNotify({
	            title: '提示：',
	            text: '图片未上传'
	        });
			return false;
		}
        
		
		$("#ff").attr("action","frontStyle/add");
		$("#ff").submit();
		
	}
	else{
		
		if($("#robot_name").val()==""||$("#robot_name").val()==null){
			new PNotify({
	            title: '提示：',
	            text: '机器人名为必填项！'
	        });
			return;
		}
		
		
		//验证图片格式
		var imgfile = $("#photo");
		$("#pics");
		var fileValue = document.getElementById("photo").value;
		if(fileValue !=null && fileValue.length > 0){
			if(!/.(gif|jpg|jpeg|png)$/.test(fileValue)) {
				fileValue = null;
				new PNotify({
		            title: '提示：',
		            text: '机器人头像格式需为gif/jpg/jpeg/png中的一种！'
		        });
				clearFileInput(imgfile);
				return false;
			}else if(!checkfile("photo")){
				clearFileInput(imgfile);
				return;
	        }else{
	        	
	        }
		}
		
		$("#ff").attr("action","frontStyle/update");
		$("#ff").submit();
		
	}
}

function checkfile(fid){
	  var maxsize = 50*1024;//50KB
	  var errMsg = "上传的附件文件不能超过50KB！！！";
	  var tipMsg = "您的浏览器暂不支持计算上传文件的大小，确保上传文件不要超过50KB，建议使用IE、FireFox、Chrome浏览器。";
	  var  browserCfg = {};
	  var backValue;
	  var ua = window.navigator.userAgent;
	  if (ua.indexOf("MSIE")>=1){
		  browserCfg.ie = true;
	  }else if(ua.indexOf("Firefox")>=1){
		  browserCfg.firefox = true;
	  }else if(ua.indexOf("Chrome")>=1){
		  browserCfg.chrome = true;
	  }
	  try{
		     var obj_file = document.getElementById(fid);
		     var filesize = 0;
		     if(browserCfg.firefox || browserCfg.chrome ){
		    	 filesize = obj_file.files[0].size;
		     }else if(browserCfg.ie){
		    	 var obj_img = document.getElementById('tempimg');
		    	 obj_img.dynsrc=obj_file.value;
		    	 filesize = obj_img.fileSize;
		     }else{
		    	 new PNotify({
			            title: '提示：',
			            text: tipMsg
			     });
		    	 backValue = false;
		     }
		     
		     if(filesize==-1){
		    	 new PNotify({
			            title: '提示：',
			            text: errMsg
			     });
		    	 backValue = false;
		     }else if(filesize>maxsize){
		    	 new PNotify({
			            title: '提示：',
			            text: errMsg
			     });
		    	 backValue = false;
		     }else{
		    	 backValue = true;;
		     }
	   }catch(e){
		   new PNotify({
	            title: '提示：',
	            text: e
	     });
		   	 backValue = false;
	   }
	   return backValue;
}

function clearFileInput(imgfile){
	imgfile.after(imgfile.clone().val(""));      
	imgfile.remove();
}

function showAccess(accessStyle){
	if(accessStyle==0){
		$("input[name='quick_access_style']:eq(3)").attr("checked",true);
		accessStyle=4;
	}
	var aimg = "";
	var aradius = "";
	var apadding = "";
	var extra = "";
	if(accessStyle <= 4){
		aradius = "5";
		apadding = "0 5";
		if(accessStyle <= 2){
			aimg = "style='position:relative;float:left;top:-3px;width: 40px;height: 40px' />";
			extra = "<div style='margin: 5 1px;height: 23px; width: 5px;border-left: 1px solid #fff;float: left;'></div>联系客服</a>";
			if(accessStyle == 1){//网页右下角横版
				var alocation = "line-height: 33px;height:33px;bottom:5;right:4%;";
				produceAccess(alocation,aradius,apadding,aimg,extra);
			}else{//网页左下角横版
				var alocation = "line-height: 33px;height:33px;bottom:5;left:4%;";
				produceAccess(alocation,aradius,apadding,aimg,extra);
			}
		}else{
			aimg = "style='position:relative;left:-5px;display: block;width: 40px;height: 40px' />";
			extra = "<div style='margin: 1px;height:1px;width: 30px;background-color: #fff;'></div><div style='padding: 3 0px;'>联系客服</div></a>";
			if(accessStyle == 3){//网页中部靠左竖版
				var alocation = "line-height: 21px;margin-top: -50px;top:50%;left:4%;width: 40px;";
				produceAccess(alocation,aradius,apadding,aimg,extra);
			}else{//网页中部靠右竖版
				var alocation = "line-height: 21px;margin-top: -50px;top:50%;right:4%;width: 40px; ";
				produceAccess(alocation,aradius,apadding,aimg,extra);
			}
		}
	}else{
		aradius = "30";
		apadding = "0";
		aimg = "style='margin:auto;float:left;height: 45px;' />";
		extra = "</a>";
		if(accessStyle <= 6){
			if(accessStyle == 5){//网页右下角圆形
				var alocation = "line-height: 35px;bottom:10px;right:4%;width: 45px;";
				produceAccess(alocation,aradius,apadding,aimg,extra);
			}else{//网页左下角圆形
				var alocation = "line-height: 35px;bottom:10px;left:4%;width: 45px;";
				produceAccess(alocation,aradius,apadding,aimg,extra);
			}
		}else{
			if(accessStyle == 7){//网页中部靠左圆形
				var alocation = "line-height: 35px;margin-top: -50px;top:50%;left:4%;width: 45px;";
				produceAccess(alocation,aradius,apadding,aimg,extra);
			}else{//网页中部靠右圆形
				var alocation = "line-height: 35px;margin-top: -50px;top:50%;right:4%;width: 45px;";
				produceAccess(alocation,aradius,apadding,aimg,extra);
			}
		}
	}
}

function funcStyleReflash(){
	window.location.href = appName + "/app/updateAppInfo";
	

}


function produceAccess(alocation,aradius,apadding,aimg,extra){
	var quickStyle;
	var imgUrl = "images/servericon.png";
	var link = "<script>var jintongAccess = document.getElementById('jintongAccess');jintongAccess.onclick =function(){"
	+"window.open('http://cs.jintongsoft.cn/csclient/views/home?key=" + appkey+"');}</script>"
	quickStyle = "<a id='jintongAccess' target='_blank' href='javascript:;' " 
			+"style='text-align:center;z-index:9999;text-decoration:none;display:block;color: #fff;background-color:#2ea7e0;position: fixed;"
			+alocation
			+"border-radius:"+ aradius +"px;-moz-border-radius: "+ aradius +"px;-webkit-border-radius: "+ aradius +"px;padding: "+ apadding +"px;' >"
			+"<img src='" + imgUrl + "' "
			+aimg
			+extra
			+link;
	$("#accessCodes").text(quickStyle);
	quickStyle = quickStyle.replace("fixed","absolute");
	$("#accessView").html(quickStyle);
	
}
$(function() {

	var heightDG = document.body.scrollHeight - 110;
	
	showAccess(quickAccessStyleId);
	if(clientStyleId==2){
		$("#accessView").css("background-image","url(/cloud/images/frontStyle/simplified.jpg)");
	}else{
		$("#accessView").css("background-image","url(/cloud/images/frontStyle/standard.jpg)");
	}
	$("#accessView").css("max-width","95%");
	$("#standard").change(function() {
		$("#accessView").css("background-image","url(/cloud/images/frontStyle/standard.jpg)");
	});
	$("#simple").change(function() {
		$("#accessView").css("background-image","url(/cloud/images/frontStyle/simplified.jpg)");
	});
	
	$("input[name='quick_access_style']").change(function() {
		var accessStyle = $("input[name='quick_access_style']:checked ").val();
		showAccess(accessStyle);
	});
	
});
