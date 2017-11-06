package cn.jintongsoft.kb.admin.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;
import org.springframework.stereotype.Component;


@Component
public class UserLogoutSuccessHandler extends SimpleUrlLogoutSuccessHandler {


	@Override
	public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
			throws IOException, ServletException {
		Cookie cookie = new Cookie("User", null);
		cookie.setMaxAge(0);
		response.addCookie(cookie);
		logger.debug("相关cookie已删除，正在logout...");
		super.onLogoutSuccess(request, response, authentication);
		logger.debug("已退出系统");
	}
}
