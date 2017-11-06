package cn.jintongsoft.kb.admin.security;

import org.jasig.cas.client.validation.Assertion;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.AuthenticationUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.util.Assert;

/**
 * Created by Administrator on 2017/3/10.
 */
public class KbUserDetailsByNameServiceWrapper <T extends Authentication> implements
        AuthenticationUserDetailsService<T>, InitializingBean {
    private static final Logger logger = LoggerFactory.getLogger(KbUserDetailsByNameServiceWrapper.class);
    private KbUserDetailsService userDetailsService = null;

    /**
     * Constructs an empty wrapper for compatibility with Spring Security 2.0.x's method
     * of using a setter.
     */
    public KbUserDetailsByNameServiceWrapper() {
        // constructor for backwards compatibility with 2.0
    }

    /**
     * Constructs a new wrapper using the supplied
     * {@link org.springframework.security.core.userdetails.UserDetailsService} as the
     * service to delegate to.
     *
     * @param userDetailsService the UserDetailsService to delegate to.
     */
    public KbUserDetailsByNameServiceWrapper(final KbUserDetailsService userDetailsService) {
        Assert.notNull(userDetailsService, "userDetailsService cannot be null.");
        this.userDetailsService = userDetailsService;
    }

    /**
     * Check whether all required properties have been set.
     *
     * @see org.springframework.beans.factory.InitializingBean#afterPropertiesSet()
     */
    public void afterPropertiesSet() throws Exception {
        Assert.notNull(this.userDetailsService, "UserDetailsService must be set");
    }

    /**
     * Get the UserDetails object from the wrapped UserDetailsService implementation
     */
    public UserDetails loadUserDetails(T authentication) throws UsernameNotFoundException {
        return this.userDetailsService.loadUserByUsername(authentication.getName());
    }

    public UserDetails loadUserDetails(T authentication, final Assertion assertion) throws UsernameNotFoundException {
        this.userDetailsService.setAssertion(assertion);
        return this.userDetailsService.loadUserByUsername(authentication.getName());
    }

    /**
     * Set the wrapped UserDetailsService implementation
     *
     * @param aUserDetailsService The wrapped UserDetailsService to set
     */
    public void setUserDetailsService(KbUserDetailsService aUserDetailsService) {
        this.userDetailsService = aUserDetailsService;
    }
}
