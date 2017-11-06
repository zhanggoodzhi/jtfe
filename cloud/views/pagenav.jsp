<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<c:if test="${total>0}">
	<ul class="pagination">
		<c:if test="${page!=1}">
			<li>
				<a href="weixinv2/group/index?page=1">首页</a>
			</li>
		</c:if>
		<c:if test="${page>=3}">
			<li>
				<a href="weixinv2/group/index?page=${page-2}">${page-2}</a>
			</li>
		</c:if>
		<c:if test="${page>=2}">
			<li>
				<a href="weixinv2/group/index?page=${page-1}">${page-1}</a>
			</li>
		</c:if>
		<li class="active">
			<a href="javascript:;">${page}</a>
		</li>
		<c:if test="${page+1<lastpage&&page+1<=lastpage}">
			<li>
				<a href="weixinv2/group/index?page=${page+1}">${page+1}</a>
			</li>
		</c:if>
		<c:if test="${page+2<lastpage&&page+2<=lastpage}">
			<li>
				<a href="weixinv2/group/index?page=${page+2}">${page+2}</a>
			</li>
		</c:if>
		<c:if test="${page<3&&page+3<=lastpage}">
			<li>
				<a href="weixinv2/group/index?page=${page+3}">${page+3}</a>
			</li>
		</c:if>
		<c:if test="${page<2&&page+4<=lastpage}">
			<li>
				<a href="weixinv2/group/index?page=${page+4}">${page+4}</a>
			</li>
		</c:if>
		<c:if test="${page!=lastpage}">
			<li>
				<a href="weixinv2/group/index?page=${lastpage}">尾页</a>
			</li>
		</c:if>
	</ul>
	<div>共有记录 ${total} 条, 当前为第${page}页, 共计${lastpage}页</div>
</c:if>