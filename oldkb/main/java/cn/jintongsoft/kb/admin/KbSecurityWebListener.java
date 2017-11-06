package cn.jintongsoft.kb.admin;

import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.jasig.cas.client.session.SingleSignOutHttpSessionListener;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@WebListener
public class KbSecurityWebListener implements HttpSessionListener {

	private SingleSignOutHttpSessionListener singleSignOutHttpSessionListener = new SingleSignOutHttpSessionListener();

    @Override
    public void sessionCreated(HttpSessionEvent se) {
        singleSignOutHttpSessionListener.sessionCreated(se);
        se.getSession().setAttribute("userid", 1000);
        log.debug("SingleSignOutHttpSessionListener sessionCreated.");
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        singleSignOutHttpSessionListener.sessionDestroyed(se);
        log.debug("SingleSignOutHttpSessionListener sessionDestroyed.");
    }
}
