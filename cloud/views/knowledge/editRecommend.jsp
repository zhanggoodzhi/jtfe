<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>


<jsp:include page="../common/common.jsp"></jsp:include>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/knowledge/cloudKnowledge.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/knowledge/editRecommend.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerResizable.js" ></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerTree.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerComboBox.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerDrag.js" ></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/lib/ligerUI/js/plugins/ligerDialog.js"></script>
<script type="text/javascript">var contextPath = '${pageContext.request.contextPath}';</script>


</head>
<body style="padding:15px;">
    <div style="float:left; padding:20px;">
    	选择问题
        <div id="questionGrid"></div>
    </div>
    <div style="float:right; padding:20px;">
    	选择关联问题
        <div id="recommendGrid"></div>
    </div>
</body>
</html>
