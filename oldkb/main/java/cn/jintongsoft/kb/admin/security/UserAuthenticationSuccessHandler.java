package cn.jintongsoft.kb.admin.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;


@Component
public class UserAuthenticationSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

	private static Logger logger = LoggerFactory.getLogger(UserAuthenticationSuccessHandler.class);

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws ServletException, IOException {
		// 初始化主体session
		HttpSession session = request.getSession();
		try {
			initPrincipalSession(session);
		} catch (Exception e) {
			e.printStackTrace();
		}
		logger.debug("登录成功，且主体信息已存入会话");
		super.onAuthenticationSuccess(request, response, authentication);
	}

	public void initPrincipalSession(HttpSession session) throws Exception {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		// 初始化会话信息
		Object principal = authentication.getPrincipal();
		logger.debug("principal=[{}]", principal);
		logger.debug("principalClass=[{}]", principal.getClass());
		Integer userid = null;
		if (principal instanceof KbUser) {
			logger.debug("principal为KbUser类型");
			KbUser kbUser = (KbUser)principal;
			userid = kbUser.getId();
		} else {
			throw new Exception("principal");
		}

		// 记录其他信息到session
		session.setAttribute("user", principal);
		session.setAttribute("userid", userid);
	}
}
