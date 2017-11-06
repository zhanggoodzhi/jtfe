$(function() {
	$("#rolelist li.list-group-item").click(function(e) {
		$("#prilist li.list-group-item").removeClass("active");
		$("#rolelist li.list-group-item").removeClass("active");
		$(e.target).addClass("active");
		var roleid = $(e.target).attr('id');
		showPri(roleid);

	});
	$("#prilist li.list-group-item").click(function(e) {
		$(e.target).toggleClass("active");
	});
});

//将已有权限置active
function priCheck(pris) {
	var ids = new Array();
	ids = pris.split(',');
	for (i=0;i<ids.length;i++)
	{
		$("#pri-record-"+ids[i]).addClass("active");
	}
}

//显示每个应用角色的权限
function showPri(roleid) {
	var id = roleid.split('-')[1];
	$.ajax({
		url : 'user/app/showPri',
		type : 'POST',
		data : {
			"id" : id,
		},
		success : function(data) {
			if (data.state == "success")
				priCheck(data.msg);
			else
				$("#prilist li.list-group-item").removeClass("active");
		}
	});

}
function roleclick(id) {
	$("#rolelist li.list-group-item").removeClass("active");
	$("#record-"+id).addClass("active");
	showPri("#record-"+id);
}
function addRecordDynamically(id, name) {
	trhtml = '<li id="record-' + id + '" class="list-group-item" onclick="roleclick(\'' + id
			+ '\')">';
	trhtml += name;
	trhtml += '</li>';
	$('#rolelist').append(trhtml);
}
function refreshRecordDynamically(id, name) {
	$("#record-"+id).html(name);
}
function addRole() {
	$("#roleid").val("0");
	$('#addRoleModal').modal('toggle');
}
function postRole() {
	var name = $('#roleName').val().trim();
	var id = $("#roleid").val().trim();

	if (name == undefined || name == "") {
		new PNotify({
			title : '添加失败',
			text : '请填写角色名称',
			type : 'error'
		});
		return;
	}
	$('#addRoleModal').modal('hide');
	$.ajax({
		url : 'user/app/addRole',
		type : 'POST',
		data : {
			"id" : id,
			"name" : name,
		},
		success : function(data) {
			PNotify.removeAll();

			if (data.state == "success") {
				new PNotify({
					title : '添加成功',
					text : '您已成功添加了角色:' + name,
					type : 'success'
				});
				$('#roleName').val('');

			addRecordDynamically(data.msg, name);
			}
			else if (data.state == "exit") {
				new PNotify({
					title : '添加失败',
					text : '此角色已存在',
					type : 'error'
				});

			}
			else if (data.state == "fail") {
				new PNotify({
					title : '添加失败',
					text : '添加失败',
					type : 'error'
				});

			}else if (data.state == "editfail") {
				new PNotify({
					title : '编辑角色名称失败',
					text : /*data.msg*/'编辑角色名称失败',
					type : 'error'
				});

			}else if (data.state == "editsuccess") {
				new PNotify({
					title : '编辑成功',
					text : '编辑角色成功',
					type : 'success'
				});
				$('#roleName').val('');
				$("#roleid").val('0');
				refreshRecordDynamically(id, name);
			}
		}
	});
}

var userDialog = undefined;
function delRole() {
	var roleid = $("#rolelist [class='list-group-item active']").attr('id');
	if (roleid == undefined || roleid == "") {
		new PNotify({
			title : '删除失败',
			text : '请选择角色',
			type : 'error'
		});
		return;
	}
	/*var pris = "";
	$("#prilist [class^='list-group-item'][class$='active']").each(function () {
           pris+= $(this).attr('id').split('-')[2] + ",";
  	});
  	if (pris != "") {
		new PNotify({
			title : '删除失败',
			text : '请先删除角色的权限配置',
			type : 'error'
		});
		return;
	}*/

	roleid = roleid.split('-')[1];
	userDialog = new BootstrapDialog.show({
		title : '提示',
		message : '确认删除?',
		buttons : [ {
			label : '确认',
			cssClass : 'btn-primary',
			action : function() {
				ajaxDeleteRole(roleid,false);
			}
		}, {
			label : '取消',
			cssClass : 'btn-default',
			action : function(dialogItself) {
				dialogItself.close();
			}
		} ]
	});
}

function ajaxDeleteRole(roleId,flag) {
	$.ajax({
		url : 'user/app/delRole',
		data : {
			roleId : roleId,
			flag : flag,
		},
		type : 'post',
		success : function(data) {
			if (data.state == "success") {
				userDialog.close();
				if (flag) {
					userDialog.close();
				};
				new PNotify({
					title : '删除成功',
					text : data.name + ' 角色删除成功',
					type : 'success'
				});
				$("#record-" + roleId).remove();
				$("li.list-group-item").removeClass("active");
			}
			else if (data.state == "fail_existUser") {
					userDialog.close();
					userDialog = new BootstrapDialog.show({
					title : '提示',
					message : '存在用户使用该角色，是否继续删除?',
					buttons : [ {
						label : '确认',
						cssClass : 'btn-primary',
						action : function() {
							ajaxDeleteRole(roleId,true);
						}
					}, {
						label : '取消',
						cssClass : 'btn-default',
						action : function(dialogItself) {
							dialogItself.close();
						}
					} ]
				});
			}
			else {
				new PNotify({
					title : '删除失败',
					text : '删除失败',
					type : 'error'
				});

			}
		}
	});
}
//角色权限配置的删除修改和添加
function editPri() {
	var roleid = $("#rolelist [class='list-group-item active']").attr('id');
	var pris = "";
	$("#prilist [class^='list-group-item'][class$='active']").each(function () {
           pris+= $(this).attr('id').split('-')[2] + ",";
  	});
  	if (roleid == undefined || roleid == "") {
		new PNotify({
			title : '提交失败',
			text : '请选择角色名称',
			type : 'error'
		});
		return;
	}
	roleid = roleid.split('-')[1];
	$.ajax({
		url : 'user/app/editPri',
		data : {
			"roleid" : roleid,
			"pris" : pris,
		},
		type : 'post',
		success : function(data) {
            if(data.state=='fail'){
                new PNotify({
					title : '配置失败',
					text : data.msg,
					type : 'fail'
				});
            }else{
                if (data.state == "delete") {
                    new PNotify({
                        title : '删除成功',
                        text : data.msg + '  角色的权限配置已删除',
                        type : 'success'
                    });
                }
                else if (data.state == "add"){
                    new PNotify({
                        title : '添加成功',
                        text : data.msg + '  角色的权限配置已添加',
                        type : 'success'
                    });
                }
                else if (data.state == "success"){
                    new PNotify({
                        title : '修改成功',
                        text : data.msg + '  角色权限配置已修改',
                        type : 'success'
                    });
                }
                $("li.list-group-item").removeClass("active");
            }
		}
	});

}
//点击编辑应用角色时，获取应用角色名称
function editRole() {
	var roleid = $("#rolelist [class='list-group-item active']").attr('id');
	if (roleid == undefined || roleid == "") {
		new PNotify({
			title : '编辑失败',
			text : '请选择角色',
			type : 'error'
		});
		return;
	}

	roleid = roleid.split('-')[1];

	$.ajax({
		url : 'user/app/getRoleName',
		type : 'POST',
		data : {
			"roleid" : roleid,
		},
		success : function(data) {
			if (data.state == "success") {
				$("#roleName").val(data.msg);
				$("#roleid").val(roleid);
				$('#addRoleModal').modal('toggle');
			}
			else{
				new PNotify({
					title : '编辑失败',
					text : '编辑失败',
					type : 'fail'
				});
			}
		}
	});

}
