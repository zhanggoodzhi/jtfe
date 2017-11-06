/**
 * 
 */

$(function() {

})

function appcreateTest2() {
	console.log("進入appcreateTest2");
	$.ajax({
		url : appName + "/app/createAppCfgOntology",
		type : 'post',
		dateType : 'json',
		// onSubmit: function(){},
		beforeSend : function() {
			loadingshow();
		},
		complete : function(data, status, xhr) {
			console.log(data);
		},
		success : function(result) {
			console.log(result);
			if (result == 1) {
				console.log("===");
			} else {
				completeLoading();
				console.log("保存失败！");
			}
		}
	});
}

function appcreateTest() {
	console.log("進入appcreateTest");
	$("#saveAppCreate").ajaxSubmit({
		url : appName + "/app/createAppCfgOntology",
		type : 'post',
		dateType : 'json',
		// onSubmit: function(){},
		beforeSend : function() {
			loadingshow();
		},
		complete : function(data, status, xhr) {
			console.log(data);
		},
		success : function(result) {
			console.log(result);
			if (result == 1) {
				console.log("===");
			} else {
				completeLoading();
				console.log("保存失败！");
			}
		}
	});
}
function appcreate() {
	if (check()) {
		$("#saveAppCreate").ajaxSubmit({
			url : appName + "/app/saveAppCreate",
			type : 'post',
			dateType : 'json',
			// onSubmit: function(){},
			beforeSend : function() {
				loadingshow();
			},
			complete : function(data, status, xhr) {
				console.log(data);
			},
			success : function(result) {
				console.log(result);
				if (result.code == "200") {
					window.location.href = appName + "/index";
				} else {
					completeLoading();
					console.log("保存失败！")
				}
			}
		});
	}

}

function check() {
	return checkImg() && checkDomain() && checkRobotName();
}

function checkRobotName() {
	if ($("#robotname").val() == "" || $("#robotname").val() == null) {
		new PNotify({
			title : '提示：',
			text : '客服名为必填项！'
		});
		return false;
	} else {
		return true;
	}
}

function checkDomain() {
	var domianLenght = $("input[name='domain']:checked").length;
	if (!(domianLenght > 0)) {
		new PNotify({
			title : '提示：',
			text : '请选择领域！'
		});
		return false;
	} else {
		return true;
	}
}

function checkImg() {
	// 验证图片格式
	var imgfile = $("#robotpic");
	var fileValue = document.getElementById("robotpic").value;
	if (fileValue != null && fileValue.length > 0) {
		if (!/.(gif|jpg|jpeg|png|jpg)$/.test(fileValue)) {
			fileValue = null;
			new PNotify({
				title : '提示：',
				text : '图片格式需在gif/jpg/jpeg/png/jpg中选择！'
			});
			clearFileInput(imgfile);
			return false;
		} else if (!checkfile("robotpic")) {
			clearFileInput(imgfile);
			return false;
		} else {
			return true;
		}
	} else {
		new PNotify({
			title : '提示：',
			text : '图片未上传！(格式在gif/jpg/jpeg/png/jpg中选择)'
		});
		return false;
	}
}

function checkfile(fid) {
	var maxsize = 5 * 1024 * 1024;// 50KB
	var errMsg = "上传的附件文件不能超过2M！！！";
	var tipMsg = "您的浏览器暂不支持计算上传文件的大小，确保上传文件不要超过5M，建议使用IE、FireFox、Chrome浏览器。";
	var browserCfg = {};
	var backValue;
	var ua = window.navigator.userAgent;
	if (ua.indexOf("MSIE") >= 1) {
		browserCfg.ie = true;
	} else if (ua.indexOf("Firefox") >= 1) {
		browserCfg.firefox = true;
	} else if (ua.indexOf("Chrome") >= 1) {
		browserCfg.chrome = true;
	}
	try {
		var obj_file = document.getElementById(fid);
		var filesize = 0;
		if (browserCfg.firefox || browserCfg.chrome) {
			filesize = obj_file.files[0].size;
		} else if (browserCfg.ie) {
			var obj_img = document.getElementById('tempimg');
			obj_img.dynsrc = obj_file.value;
			filesize = obj_img.fileSize;
		} else {
			new PNotify({
				title : '提示：',
				text : tipMsg
			});
			backValue = false;
		}

		if (filesize == -1) {
			new PNotify({
				title : '提示：',
				text : errMsg
			});
			backValue = false;
		} else if (filesize > maxsize) {
			new PNotify({
				title : '提示：',
				text : errMsg
			});
			backValue = false;
		} else {
			backValue = true;
			;
		}
	} catch (e) {
		new PNotify({
			title : '提示：',
			text : e
		});
		backValue = false;
	}
	return backValue;
}

function clearFileInput(imgfile) {
	imgfile.after(imgfile.clone().val(""));
	imgfile.remove();
}

// 获取浏览器页面可见高度和宽度
var _PageHeight = document.documentElement.clientHeight, _PageWidth = document.documentElement.clientWidth;
// 计算loading框距离顶部和左部的距离（loading框的宽度为215px，高度为61px）
var _LoadingTop = _PageHeight > 61 ? (_PageHeight - 61) / 2 : 0, _LoadingLeft = _PageWidth > 215 ? (_PageWidth - 215) / 2
		: 0;
// 在页面未加载完毕之前显示的loading Html自定义内容
var _LoadingHtml = '<div id="loadingDiv" style="position:fixed;left:0;width:100%;height:'
		+ _PageHeight
		+ 'px;top:0;background-color: black;-moz-opacity: 0.6;opacity:0.60;filter:alpha(opacity=60);z-index:1001;"><div style="position: absolute; cursor: wait; left: '
		+ _LoadingLeft
		+ 'px; top:'
		+ _LoadingTop
		+ 'px; width: auto; height: 57px; line-height: 57px; padding-left: 50px; padding-right: 5px; '
		+ 'background: #fff url('
		+ appName
		+ '/images/loadingPic.gif) no-repeat scroll 5px 10px; border: 2px solid #95B8E7; color: black; border-radius:4px;'
		+ 'font-family:\'Microsoft YaHei\';">数据处理中，请等待...</div></div>';

function loadingshow() {
	// 呈现loading效果
	// document.write(_LoadingHtml);
	$('body').append(_LoadingHtml);
	// window.onload = function () {
	// var loadingMask = document.getElementById('loadingDiv');
	// loadingMask.parentNode.removeChild(loadingMask);
	// };

	// 监听加载状态改变
	document.onreadystatechange = completeLoading;

	// 加载状态为complete时移除loading效果
}

function completeLoading() {
	/* if (document.readyState == "complete") { */
	var loadingMask = document.getElementById('loadingDiv');
	loadingMask.parentNode.removeChild(loadingMask);
	/* } */
}
