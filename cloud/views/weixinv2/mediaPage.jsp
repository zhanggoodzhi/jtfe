<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<c:if test="${total>0}">
	<c:if test="${action==0}">
		<c:if test="${all==0}">
			<ul class="pagination">
				<c:if test="${page!=1}">
					<li>
						<a href="weixinv2/material/mediaHistory.do?type=${type}&page=1">首页</a>
					</li>
				</c:if>
				<c:if test="${page>=3}">
					<li>
						<a href="weixinv2/material/mediaHistory.do?type=${type}&page=${page-2}">${page-2}</a>
					</li>
				</c:if>
				<c:if test="${page>=2}">
					<li>
						<a href="weixinv2/material/mediaHistory.do?type=${type}&page=${page-1}">${page-1}</a>
					</li>
				</c:if>
				<li class="active">
					<a href="javascript:;">${page}</a>
				</li>
				<c:if test="${page+1<lastpage&&page+1<=lastpage}">
					<li>
						<a href="weixinv2/material/mediaHistory.do?type=${type}&page=${page+1}">${page+1}</a>
					</li>
				</c:if>
				<c:if test="${page+2<lastpage&&page+2<=lastpage}">
					<li>
						<a href="weixinv2/material/mediaHistory.do?type=${type}&page=${page+2}">${page+2}</a>
					</li>
				</c:if>
				<c:if test="${page<3&&page+3<=lastpage}">
					<li>
						<a href="weixinv2/material/mediaHistory.do?type=${type}&page=${page+3}">${page+3}</a>
					</li>
				</c:if>
				<c:if test="${page<2&&page+4<=lastpage}">
					<li>
						<a href="weixinv2/material/mediaHistory.do?type=${type}&page=${page+4}">${page+4}</a>
					</li>
				</c:if>
				<c:if test="${page!=lastpage}">
					<li>
						<a href="weixinv2/material/mediaHistory.do?type=${type}&page=${lastpage}">尾页</a>
					</li>
				</c:if>
			</ul>
		</c:if>
		<c:if test="${all==1}">
			<ul class="pagination">
				<c:if test="${page!=1}">
					<li>
						<a href="weixinv2/material/mediaHistory.do?type=${type}&id=-1&page=1">首页</a>
					</li>
				</c:if>
				<c:if test="${page>=3}">
					<li>
						<a href="weixinv2/material/mediaHistory.do?type=${type}&id=-1&page=${page-2}">${page-2}</a>
					</li>
				</c:if>
				<c:if test="${page>=2}">
					<li>
						<a href="weixinv2/material/mediaHistory.do?type=${type}&id=-1&page=${page-1}">${page-1}</a>
					</li>
				</c:if>
				<li class="active">
					<a href="javascript:;">${page}</a>
				</li>
				<c:if test="${page+1<lastpage&&page+1<=lastpage}">
					<li>
						<a href="weixinv2/material/mediaHistory.do?type=${type}&id=-1&page=${page+1}">${page+1}</a>
					</li>
				</c:if>
				<c:if test="${page+2<lastpage&&page+2<=lastpage}">
					<li>
						<a href="weixinv2/material/mediaHistory.do?type=${type}&id=-1&page=${page+2}">${page+2}</a>
					</li>
				</c:if>
				<c:if test="${page<3&&page+3<=lastpage}">
					<li>
						<a href="weixinv2/material/mediaHistory.do?type=${type}&id=-1&page=${page+3}">${page+3}</a>
					</li>
				</c:if>
				<c:if test="${page<2&&page+4<=lastpage}">
					<li>
						<a href="weixinv2/material/mediaHistory.do?type=${type}&id=-1&page=${page+4}">${page+4}</a>
					</li>
				</c:if>
				<c:if test="${page!=lastpage}">
					<li>
						<a href="weixinv2/material/mediaHistory.do?type=${type}&id=-1&page=${lastpage}">尾页</a>
					</li>
				</c:if>
			</ul>
		</c:if>
	</c:if>
	<c:if test="${action==1}">
		<ul class="pagination">
			<c:if test="${page!=1}">
				<li>
					<a href="weixinv2/material/mediaHistory.do?type=${type}&id=${wechatCredential.id}&page=1">首页</a>
				</li>
			</c:if>
			<c:if test="${page>=3}">
				<li>
					<a href="weixinv2/material/mediaHistory.do?type=${type}&id=${wechatCredential.id}&page=${page-2}">${page-2}</a>
				</li>
			</c:if>
			<c:if test="${page>=2}">
				<li>
					<a href="weixinv2/material/mediaHistory.do?type=${type}&id=${wechatCredential.id}&page=${page-1}">${page-1}</a>
				</li>
			</c:if>
			<li class="active">
				<a href="javascript:;">${page}</a>
			</li>
			<c:if test="${page+1<lastpage&&page+1<=lastpage}">
				<li>
					<a href="weixinv2/material/mediaHistory.do?type=${type}&id=${wechatCredential.id}&page=${page+1}">${page+1}</a>
				</li>
			</c:if>
			<c:if test="${page+2<lastpage&&page+2<=lastpage}">
				<li>
					<a href="weixinv2/material/mediaHistory.do?type=${type}&id=${wechatCredential.id}&page=${page+2}">${page+2}</a>
				</li>
			</c:if>
			<c:if test="${page<3&&page+3<=lastpage}">
				<li>
					<a href="weixinv2/material/mediaHistory.do?type=${type}&id=${wechatCredential.id}&page=${page+3}">${page+3}</a>
				</li>
			</c:if>
			<c:if test="${page<2&&page+4<=lastpage}">
				<li>
					<a href="weixinv2/material/mediaHistory.do?type=${type}&id=${wechatCredential.id}&page=${page+4}">${page+4}</a>
				</li>
			</c:if>
			<c:if test="${page!=lastpage}">
				<li>
					<a href="weixinv2/material/mediaHistory.do?type=${type}&id=${wechatCredential.id}&page=${lastpage}">尾页</a>
				</li>
			</c:if>
		</ul>
	</c:if>
	
	<div>共有记录 ${total} 条, 当前为第${page}页, 共计${lastpage}页</div>
</c:if>