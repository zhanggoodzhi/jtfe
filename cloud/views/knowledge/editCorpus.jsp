<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

<link rel="stylesheet" type="text/css" 	href="${pageContext.request.contextPath}/jquery-easyui-1.3.6/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css" 	href="${pageContext.request.contextPath}/jquery-easyui-1.3.6/themes/icon.css">
<script type="text/javascript" 	src="${pageContext.request.contextPath}/jquery-easyui-1.3.6/jquery.min.js"></script>
<script type="text/javascript" 	src="${pageContext.request.contextPath}/jquery-easyui-1.3.6/jquery.easyui.min.js"></script>
<script type="text/javascript" 	src="${pageContext.request.contextPath}/jquery-easyui-1.3.6/jquery.easyui.mask.js"></script>


<script type="text/javascript" 	src="${pageContext.request.contextPath}/js/My97DatePicker/WdatePicker.js" charset="UTF-8"></script>

<link href="${pageContext.request.contextPath}/lib/ligerUI/skins/Aqua/css/ligerui-all.css" rel="stylesheet" type="text/css">
<script src="${pageContext.request.contextPath}/lib/ligerUI/js/core/base.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerComboBox.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerTree.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerDialog.js" type="text/javascript"></script>

<script type="text/javascript" src="${pageContext.request.contextPath}/js/knowledge/editCorpus.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerResizable.js" ></script>

<script type="text/javascript">var contextPath = '${pageContext.request.contextPath}';</script>
<script type="text/javascript" charset="utf-8" src="${pageContext.request.contextPath}/lib/ueditor1_4_3-utf8-jsp/ueditor.config.js"></script>
<script type="text/javascript" charset="utf-8" src="${pageContext.request.contextPath}/lib/ueditor1_4_3-utf8-jsp/ueditor.all.js"> </script>
<script type="text/javascript" charset="utf-8" src="${pageContext.request.contextPath}/lib/ueditor1_4_3-utf8-jsp/custom/editor_api.js"> </script>
<script type="text/javascript" charset="utf-8" src="${pageContext.request.contextPath}/lib/ueditor1_4_3-utf8-jsp/custom/addAnswerButton.js"></script>



</head>
<body style="padding:2px;">
    <div><form>
        <p>
        <label for="question" id="questionLabel">　　问题</label>
	        <input id="question" type="text" name="account" autocomplete="off" placeholder="对话问题描述" style="height:20px; width:500px; border: 1px solid #ccc;">
	        <a id="questions"  display="none"></a>
        </p>

        <br>


        <p>
	        <label for="classify" id="classifyLabel" style="margin-right:4px; float:left;">　　分类</label>
            <div style="float:left;"><input type="input" id="classify" readonly="" class="l-tex"></div>
        </p>
        
        <br>
        
 		<div style="clear:both;"></div>
 		
 		<br>
        <p>
	        <label for="corpusStatus" id="corpusStatusLabel" style="margin-right:4px; float:left;">　　状态</label>
            <div style="float:left;"><input type="input" id="corpusStatus" readonly="" class="l-tex"></div>
        </p>
        <div style="clear:both;"></div>
        <br>
        <p>
	        <label for="character" id="characterLabel" style="margin-right:4px; float:left;">　　角色</label>
            <div style="float:left;"><input type="input" id="character" readonly="" class="l-tex"></div>
        </p>
         <div style="clear:both;"></div>
        <br>
         <p>
	        <label for="beginTime" id="beginTimeLabel" style="margin-right:4px; float:left;">生效时间</label>
             <div style="float:left;"><input type="input" id="beginTime" value=""
									onfocus="WdatePicker({dateFmt:'yyyy-MM-dd'})"
									class="Wdate"style="cursor: pointer; border: #CCCCCC 1px solid; display: block; width: 200px; " />
          </div>
        </p>
         <div style="clear:both;"></div>
        <br>
         <p>
	        <label for="endTime" id="endTimeLabel" style="margin-right:4px; float:left;">失效时间</label>
              <div style="float:left;"><input type="input" id="endTime" value=""
									onfocus="WdatePicker({dateFmt:'yyyy-MM-dd'})"
									class="Wdate"style="cursor: pointer; border: #CCCCCC 1px solid; display: block; width: 200px; " />
          </div>
        </p>
        <br>

    </form></div>
    
    <div style="clear:both">
        <br>
	    <p>
	        <label for="classify" id="classifyLabel" style="margin-right:2px; float:left">　　回答</label>
	        <div style="float:left; width:575px;">
	           <script id="answer" name="content" type="text/plain"></script>
	        </div>
	    </p>
    </div>
    
</body>
</html>
