$(function () {
	var mainItem = $(".weixin-chat-area-menu"),  		//主菜单
		allItem = $(".weixin-menu"),					//所有菜单
		sortBtn = $("#sort-btn"),						//排序按钮
		sortListArray = [],
		createMainMenuBtn = $(".create-main-menu"),		//新建主菜单按钮
		createNodeMenuBtn = $(".create-node-menu"),		//新建子菜单按钮
		deleteBtn = $("#delete-menu"),
		menuName = $("#menu-name"),						//input
		radio = $(":radio"),							//radio
		content = $("#content"),						//textarea
		saveBtn = $("#save-btn");

	//菜单弹出
	mainItem.on("click", menuOut);
	//ajax
	allItem.on("click", clickMenu);
	//菜单排序按钮
	sortBtn.on("click", clickSortBtn);
	//添加主菜单
	createMainMenuBtn.on("click", createMainMenu);
	//添加子菜单
	createNodeMenuBtn.on("click", createNodeMenu);
	//删除菜单
	deleteBtn.on("click", deleteMenu);
	//修改名字本地刷新
	menuName.on("blur", inputBlur);
	//修改type本地刷新
	radio.on("click", radioClick);
	//textarea本地刷新
	content.on("blur", contentBlur);
	//保存
	saveBtn.on("click", save);
	if($("#main-menu-list li").length!==1){
		$($("#main-menu-list li a")[0]).click();
	}
	else{
		$(".weixin-edit-area-wrap").css("display","none");
	}

	function menuOut() {
		var clickItem = $(this);
		//避免重复点击
		if (clickItem.hasClass("menu-selected")) {
			return;
		}
		$(".weixin-chat-area-menu").next().fadeOut("normal");				//next,子菜单ul元素
		clickItem.next().fadeToggle("normal");
	}

	function clickMenu() {
		if($(".weixin-edit-area-wrap").css("display")==="none"){
			$(".weixin-edit-area-wrap").css("display","block");
		}
		var clickItem = $(this);
		//避免重复点击
		if (clickItem.hasClass("menu-selected")) {
			return;
		}
		//选中border
		$(".weixin-menu").removeClass("menu-selected");
		var displayMenu = $("#menu-display"),
			message = $("#weixin-edit-area-message");
		clickItem.addClass("menu-selected");
		//主菜单
		if (clickItem.hasClass("weixin-chat-area-menu")) {
			refresh(clickItem);
			if (clickItem.next().find(".weixin-sub-menu").length > 1) {
				displayMenu.css("display", "none");
				message.css("display", "block");
			}
			else {
				displayMenu.css("display", "block");
				message.css("display", "none");
			}
		}
		//子菜单
		else if (clickItem.hasClass("weixin-sub-menu")) {
			refresh(clickItem);
			displayMenu.css("display", "block");
			message.css("display", "none");
		}
		else {
			return;
		}
	}



	function clickSortBtn() {
		var sortList = $(".drop-list");					//拖放菜单的父元素
		if ($(this).text() === "菜单排序") {
			$(this).text("完成");
			//防止新建的菜单未添加
			sortListArray = [];
			Array.prototype.forEach.call(sortList, function (v) {
				sortListArray.push(new Sortable(v, {
					sort: true
				}));
			});
		}
		else {
			$(this).text("菜单排序");
			sortListArray.forEach(function (v) {
				v.options.disabled = true;
			});
		}
		$(this).toggleClass("sort-finish");
		$(".weixin-menu").parent().toggleClass("sort-menu");
	}

	function createMainMenu() {
		var clickItem = $(this),
			len = $("#main-menu-list")[0].children.length,
			parent = clickItem.parent().parent(),
			createMainMenu = clickItem.parent().detach(),
			newMainMenu = createMainMenuElement();
		if (len <= 3) {
			parent.append(newMainMenu);
			if (len < 3) {
				parent.append(createMainMenu);
			}
			newMainMenu.find(".weixin-chat-area-menu").click();//新建后点击
		}
	}

	function createNodeMenu() {
		var clickItem = $(this),
			parent = clickItem.parent().parent(),
			len = parent[0].children.length,
			createNodeMenu = clickItem.parent().detach(),
			newNodeMenu = createNodeMenuElement();
			$(":radio").removeProp("checked");
		if (len <= 5) {
			parent.append(newNodeMenu);
			if (len < 5) {
				parent.append(createNodeMenu);
			}
			newNodeMenu.find(".weixin-menu").click();//新建后点击
		}

	}
	function createMainMenuElement() {
		var newMainMenu = $('<li><a href= "javascript:;" class="weixin-chat-area-menu weixin-menu" data-name="新建菜单">新建菜单</a><ul class="sub-menu-box drop-list"><li><a href="javascript:;" class="weixin-sub-menu weixin-menu create-node-menu"><i class="fa fa-plus add-icon"></i></a></li></ul></li >');
		newMainMenu.find(".weixin-chat-area-menu").on("click", menuOut);
		newMainMenu.find(".weixin-menu").on("click", clickMenu);
		newMainMenu.find(".create-node-menu").on("click", createNodeMenu);
		return newMainMenu;
	}
	function createNodeMenuElement() {
		var newNodeMenu = $('<li><a href="javascript:;" class="weixin-sub-menu weixin-menu" data-name="新建菜单">新建菜单</a></li>');
		newNodeMenu.find(".weixin-menu").on("click", clickMenu);
		return newNodeMenu;
	}

	function createAddMainMenuElement() {
		var newAddNodeMenu = $('<li><a href="javascript:;" class="weixin-chat-area-menu weixin-menu create-main-menu"><i class="fa fa-plus add-icon"></i></a></li>');
		newAddNodeMenu.find(".create-main-menu").on("click", createMainMenu);
		return newAddNodeMenu;
	}

	function createAddNodeMenuElement() {
		var newAddMainMenu = $('<li><a href="javascript:;" class="weixin-sub-menu weixin-menu create-node-menu"><i class="fa fa-plus add-icon"></i></a></li>');
		newAddMainMenu.find(".create-node-menu").on("click", createNodeMenu);
		return newAddMainMenu;
	}

	function deleteMenu() {
		var select = $(".menu-selected"),
			li = select.parent(),
			ul = li.parent();
		if (select.length !== 1) {
			return;
		}
		else {
			BootstrapDialog.show({
				title: "温馨提示",
				message: "删除后“" + select.attr("data-name") + "”菜单下设置的内容将被删除",
				buttons: [
					{
						label: "确认",
						cssClass: "btn-success",
						action: function (dialogItself) {
							li.remove();
							if (select.hasClass("weixin-chat-area-menu")) {
								if (ul.find(".create-main-menu").length <= 0) {
									ul.append(createAddMainMenuElement());
								}
								if (ul.find(".weixin-chat-area-menu").length > 1) {
									ul.find(".weixin-chat-area-menu").first().click();
								}
								else {
									$(".weixin-edit-area-wrap").css("display","none");
								}

							}
							if (select.hasClass("weixin-sub-menu")) {
								if (ul.find(".create-node-menu").length <= 0) {
									ul.append(createAddNodeMenuElement());
								}
								if (ul.find(".weixin-sub-menu").length > 1) {
									ul.find(".weixin-sub-menu").first().click();
								}
								else {
									ul.prev().click();
								}

							}
							dialogItself.close();
						}
					},
					{
						label: "取消",
						cssClass: "btn-default",
						action: function (dialogItself) {
							dialogItself.close();
						}
					}
				]
			});



		}
	}

	function inputBlur() {
		var select = $(".menu-selected");
		var val = $(this).val();
		if (select.length !== 1) {
			return;
		}
		else if (select.attr("data-name") === $(this).val()) {
			return;
		}
		else if (!val) {
			select.attr("data-name", "新建菜单");
			$(this).val("新建菜单");
			refresh(select);
		}
		else {
			if (select.hasClass("weixin-chat-area-menu")) {
				if (val.match(/[\u4E00-\u9FA5]+/) && val.length > 4 || val.length > 8) {
					alertMessage("主菜单字数不超过4个汉字或8个字母", "error");
				}
				else {
					select.attr("data-name", $(this).val());
					refresh(select);
				}
			}
			else if (select.hasClass("weixin-sub-menu")) {
				if (val.match(/[\u4E00-\u9FA5]+/) && val.length > 8 || val.length > 16) {
					alertMessage("子菜单字数不超过8个汉字或16个字母", "error");
				}
				else {
					select.attr("data-name", $(this).val());
					refresh(select);
				}
			}


		}
	}

	function radioClick() {
		var select = $(".menu-selected");
		if (select.length !== 1) {
			return;
		}
		else if (select.attr("data-type") === $(this).val()) {
			return;
		}
		else {
			select.attr("data-type", $(this).val());
			refresh(select);
		}
	}
	function contentBlur() {
		var select = $(".menu-selected");
		if (select.length !== 1) {
			return;
		}
		else if (select.attr("data-menuKey") === $(this).val() || select.attr("data-url") === $(this).val()) {
			return;
		}
		else if ($(":radio:checked").length <= 0 && $(this).val()) {
			alertMessage("请选择类型", "error");
			return;
		}
		else {
			if (select.attr("data-type") === "click") {
				select.attr("data-menuKey", $(this).val());
			}
			if (select.attr("data-type") === "view") {
				if (!$(this).val().match(/^(http|https):\/\/([\w-]+\.)+[\w-]+([\w-./?%&=]*)?$/)) {
					alertMessage("链接格式为http://xxx.xxxxxxx.xxx", "error");
					return;
				}
				select.attr("data-url", $(this).val());
			}
		}
		refresh(select);
	}
	function refresh(obj) {
		//点击为新建菜单按钮则退出
		if (obj.hasClass("create-node-menu") || obj.hasClass("create-main-menu")) {
			return;
		}
		var menuHead = $("#menu-head"),
			menuName = $("#menu-name"),
			content = $("#content");
		obj.text(obj.attr("data-name"));
		menuHead.text(obj.attr("data-name"));
		menuName.val(obj.attr("data-name"));
		$(":radio").removeProp("checked");
		content.val("");
		if (obj.attr("data-type")) {
			if (obj.attr("data-type") === "view") {
				$(":radio[value=view]").prop("checked", "checked");
				content.val(obj.attr("data-url") ? obj.attr("data-url") : "");

			}
			if (obj.attr("data-type") === "click") {
				$(":radio[value=click]").prop("checked", "checked");
				content.val(obj.attr("data-menuKey") ? obj.attr("data-menuKey") : "");
			}
		}
		else {
			return;
		}
	}
	function save() {
		var data = [],
			dataObj = {},
			credentialId = $("#main-menu-list").attr("data-credentialId"),
			select = $(".menu-selected"),
			mainMenu = $(".weixin-chat-area-menu:not(.create-main-menu)");
			if(select.length>0){
				refresh(select);
			}
		if (mainMenu.length > 0) {
			Array.prototype.forEach.call(mainMenu, function (v, i) {
				var val = $(v),

					//无值时设为空
					oData = {
						name: val.attr("data-name"),
						type: val.attr("data-type") ? val.attr("data-type") : null,
						menuKey: val.attr("data-menuKey") ? val.attr("data-menuKey") : null,
						url: val.attr("data-url") ? val.attr("data-url") : null,
						priority: (i + 1) * 10,
						credentialId: credentialId
					},
					childNode = val.next().find(".weixin-sub-menu:not(.create-node-menu)");

				//有type但key url无值时也为空
				if (!val.attr("data-menuKey") && !val.attr("data-url")) {
					oData.type = null;
				}
				if (childNode.length > 0) {
					oData.type = null;
					oData.menuKey = null;
					oData.url = null;
					Array.prototype.forEach.call(childNode, function (v1, i1) {
						var val1 = $(v1);
						var pData = {
							name: val1.attr("data-name"),
							type: val1.attr("data-type") ? val1.attr("data-type") : null,
							menuKey: val1.attr("data-menuKey") ? val1.attr("data-menuKey") : null,
							url: val1.attr("data-url") ? val1.attr("data-url") : null,
							priority: (i + 1) * 10 + i1 + 1,
							credentialId: credentialId
						};
						if (!val1.attr("data-menuKey") && !val1.attr("data-url")) {
							pData.type = null;
						}
						data.push(pData);
					});
				}
				data.push(oData);

			});

			data = data.sort(function (x, y) {
				return x.priority - y.priority;
			});
		}
		dataObj.credentialId = credentialId;
		dataObj.data = data;
		$.ajax({
			url: "weixinv2/menu/saveMenu",
			type: "POST",
			data: JSON.stringify(dataObj),
			contentType: "application/json",
			cache: false,
			dataType: "json",
			success: function (data) {
				if (data.code === "200") {
					alertMessage(data.msg, "success");
				}
				else {
					alertMessage(data.msg, "error");
				}

			},
			error: function (err) {
				alertMessage(err.status, "error");
			}
		});

	}
});
function alertMessage(msg, status) {
	var title;
	PNotify.removeAll();
	if (status === "success") {
		title = "操作成功";
	}
	else {
		title = "操作失败";
	}
	new PNotify({
		title: title,
		text: msg,
		type: status,
		styling: 'bootstrap3',
		delay: "5000"
	});
}