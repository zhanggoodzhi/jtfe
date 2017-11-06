package cn.jintongsoft.kb.admin.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.access.AccessDeniedHandler;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by Liu on 2017/3/22.
 */
public class KbAccessDeniedHandler implements AccessDeniedHandler {

    private static Logger log = LoggerFactory.getLogger(KbAccessDeniedHandler.class);

    private String deniedPage;

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        if (!response.isCommitted()) {
            if (deniedPage != null) {
                String origin = request.getRequestURI();
//                request.setAttribute(WebAttributes.ACCESS_DENIED_403,accessDeniedException);
//                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                RequestDispatcher dispatcher = request.getRequestDispatcher(deniedPage + "?origin=" + origin);
                dispatcher.forward(request, response);
            }
            else {
                response.sendError(HttpServletResponse.SC_FORBIDDEN,accessDeniedException.getMessage());
            }

        }
    }

    public void setErrorPage(String deniedPage) {
        if ((deniedPage != null) && !deniedPage.startsWith("/")) {
            throw new IllegalArgumentException("errorPage must begin with '/'");
        }

        this.deniedPage = deniedPage;
    }


}
