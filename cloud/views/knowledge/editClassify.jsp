<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>


<jsp:include page="../common/common.jsp"></jsp:include>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/knowledge/cloudKnowledge.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerResizable.js" ></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerTree.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerComboBox.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerDrag.js" ></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerDialog.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerTab.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerDrag.js"></script>

<script type="text/javascript" src="${pageContext.request.contextPath}/js/knowledge/editClassify.js"></script>
<script type="text/javascript">var contextPath = '${pageContext.request.contextPath}';</script>



</head>
<body style="padding:15px;">

    <div id="classifyTab" style="width: 100%;overflow:hidden; border:1px solid #A3C0E8; "> 
        <div title="新增" style="height:280px; margin:10px;">
            <p>
	            <label for="classifyName" id="classifyNameLabel">名称</label>
	            <input id="classifyName" type="text" autocomplete="off" placeholder="新增类型名称" style="height:20px; width:200px; border: 1px solid #AECAF0;">
	        </p>
	
	        <br>
	
	        <p>
	            <label for="parentClassify" id="parentClassifyLabel" style="margin-right:4px; float:left;">父类</label>
	            <div style="float:left;"><input type="input" id="parentClassify" readonly="" class="l-tex"></div>
	        </p>
        </div>
        
        
        <div title="编辑" style="height:280px; margin:10px;">
            
            <p>
                <label for="classify2" id="classify2Label" style="margin-right:4px; float:left;">类型</label>
                <div style="float:left;"><input type="input" id="classify2" readonly="" class="l-tex"></div>
            </p>
            
            <br style="clear:both">
            <br>
            <p>
                <label for="parentClassify2" id="parentClassify2Label" style="margin-right:4px; float:left;">父类</label>
                <div style="float:left;"><input type="input" id="parentClassify2" readonly="" class="l-tex"></div>
            </p>
            
            <br style="clear:both">
            <br>
            <label for="classifyName2" id="classifyName2Label">名称</label>
            <input id="classifyName2" type="text" autocomplete="off" placeholder="类型新名称" style="height:20px; width:200px; border: 1px solid #AECAF0;">
            
        </div>
  
        <div title="删除" style="height:280px; margin:10px;">
            <p>
                <label for="classify3" id="classify3Label" style="margin-right:4px; float:left;">类型</label>
                <div style="float:left;"><input type="input" id="classify3" readonly="" class="l-tex"></div>
            </p>
        </div>

    </div>


    <div style="display:none"><form>
        <p>
	        <label for="question" id="questionLabel">问题</label>
	        <input id="question" type="text" name="account" autocomplete="off" placeholder="对话问题描述" style="height:20px; width:200px; border: 1px solid #AECAF0;">
        </p>

        <br>

        <p>
	        <label for="classify" id="classifyLabel" style="margin-right:4px; float:left;">分类</label>
            <div style="float:left;"><input type="input" id="classify" readonly="" class="l-tex"></div>
        </p>
    </form></div>
    
</body>
</html>
