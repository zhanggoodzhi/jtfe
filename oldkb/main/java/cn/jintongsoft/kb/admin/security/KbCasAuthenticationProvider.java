package cn.jintongsoft.kb.admin.security;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jasig.cas.client.validation.Assertion;
import org.jasig.cas.client.validation.TicketValidationException;
import org.jasig.cas.client.validation.TicketValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.MessageSource;
import org.springframework.context.MessageSourceAware;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.security.authentication.AccountStatusUserDetailsChecker;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.cas.ServiceProperties;
import org.springframework.security.cas.authentication.*;
import org.springframework.security.cas.web.CasAuthenticationFilter;
import org.springframework.security.cas.web.authentication.ServiceAuthenticationDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.SpringSecurityMessageSource;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.core.authority.mapping.NullAuthoritiesMapper;
import org.springframework.security.core.userdetails.*;
import org.springframework.util.Assert;

/**
 * Created by Liu on 2017/3/10.CasAuthenticationProvider
 */
public class KbCasAuthenticationProvider implements AuthenticationProvider,
        InitializingBean, MessageSourceAware {
    // ~ Static fields/initializers
    // =====================================================================================
    private static final Logger logger = LoggerFactory.getLogger(KbCasAuthenticationProvider.class);

    // ~ Instance fields
    // ================================================================================================

    private KbUserDetailsByNameServiceWrapper<CasAssertionAuthenticationToken> authenticationUserDetailsService;

    private final UserDetailsChecker userDetailsChecker = new AccountStatusUserDetailsChecker();
    protected MessageSourceAccessor messages = SpringSecurityMessageSource.getAccessor();
    private StatelessTicketCache statelessTicketCache = new NullStatelessTicketCache();
    private String key;
    private TicketValidator ticketValidator;
    private ServiceProperties serviceProperties;
    private GrantedAuthoritiesMapper authoritiesMapper = new NullAuthoritiesMapper();

    private Assertion assertion;

    // ~ Methods
    // ========================================================================================================

    public void afterPropertiesSet() throws Exception {
        Assert.notNull(this.authenticationUserDetailsService,
                "An authenticationUserDetailsService must be set");
        Assert.notNull(this.ticketValidator, "A ticketValidator must be set");
        Assert.notNull(this.statelessTicketCache, "A statelessTicketCache must be set");
        Assert.hasText(
                this.key,
                "A Key is required so CasAuthenticationProvider can identify tokens it previously authenticated");
        Assert.notNull(this.messages, "A message source must be set");
    }

    public Authentication authenticate(Authentication authentication)
            throws AuthenticationException {
        logger.debug("CAS Client enter into the authentication manager!");
        if (!supports(authentication.getClass())) {
            return null;
        }

        if (authentication instanceof UsernamePasswordAuthenticationToken
                && (!CasAuthenticationFilter.CAS_STATEFUL_IDENTIFIER
                .equals(authentication.getPrincipal().toString()) && !CasAuthenticationFilter.CAS_STATELESS_IDENTIFIER
                .equals(authentication.getPrincipal().toString()))) {
            // UsernamePasswordAuthenticationToken not CAS related
            return null;
        }

        // If an existing CasAuthenticationToken, just check we created it
        if (authentication instanceof CasAuthenticationToken) {
            if (this.key.hashCode() == ((CasAuthenticationToken) authentication)
                    .getKeyHash()) {
                return authentication;
            }
            else {
                throw new BadCredentialsException(
                        messages.getMessage("CasAuthenticationProvider.incorrectKey",
                                "The presented CasAuthenticationToken does not contain the expected key"));
            }
        }

        // Ensure credentials are presented
        if ((authentication.getCredentials() == null)
                || "".equals(authentication.getCredentials())) {
            throw new BadCredentialsException(messages.getMessage(
                    "CasAuthenticationProvider.noServiceTicket",
                    "Failed to provide a CAS service ticket to validate"));
        }

        boolean stateless = false;

        if (authentication instanceof UsernamePasswordAuthenticationToken
                && CasAuthenticationFilter.CAS_STATELESS_IDENTIFIER.equals(authentication
                .getPrincipal())) {
            stateless = true;
        }

        CasAuthenticationToken result = null;

        if (stateless) {
            // Try to obtain from cache
            result = statelessTicketCache.getByTicketId(authentication.getCredentials()
                    .toString());
        }

        if (result == null) {
            result = this.authenticateNow(authentication);
            result.setDetails(authentication.getDetails());
        }

        if (stateless) {
            // Add to cache
            statelessTicketCache.putTicketInCache(result);
        }

        return result;
    }

    private CasAuthenticationToken authenticateNow(final Authentication authentication)
            throws AuthenticationException {
        logger.debug("Cann't know the real type of the authention,so create new CasAuthention from cas20Validator");
        try {
            final Assertion assertion = getAssertion(authentication);
            final UserDetails userDetails = loadUserByAssertion(assertion);
            userDetailsChecker.check(userDetails);
            return new CasAuthenticationToken(this.key, userDetails,
                    authentication.getCredentials(),
                    authoritiesMapper.mapAuthorities(userDetails.getAuthorities()),
                    userDetails, assertion);
        }
        catch (final TicketValidationException e) {
            throw new BadCredentialsException(e.getMessage(), e);
        }
    }

    /**
     * Gets the serviceUrl. If the {@link Authentication#getDetails()} is an instance of
     * {@link ServiceAuthenticationDetails}, then
     * {@link ServiceAuthenticationDetails#getServiceUrl()} is used. Otherwise, the
     * {@link ServiceProperties#getService()} is used.
     *
     * @param authentication
     * @return
     */
    private String getServiceUrl(Authentication authentication) {
        String serviceUrl;
        if (authentication.getDetails() instanceof ServiceAuthenticationDetails) {
            serviceUrl = ((ServiceAuthenticationDetails) authentication.getDetails())
                    .getServiceUrl();
        }
        else if (serviceProperties == null) {
            throw new IllegalStateException(
                    "serviceProperties cannot be null unless Authentication.getDetails() implements ServiceAuthenticationDetails.");
        }
        else if (serviceProperties.getService() == null) {
            throw new IllegalStateException(
                    "serviceProperties.getService() cannot be null unless Authentication.getDetails() implements ServiceAuthenticationDetails.");
        }
        else {
            serviceUrl = serviceProperties.getService();
        }
        if (logger.isDebugEnabled()) {
            logger.debug("serviceUrl = " + serviceUrl);
        }
        return serviceUrl;
    }

    /**
     * Template method for retrieving the UserDetails based on the assertion. Default is
     * to call configured userDetailsService and pass the username. Deployers can override
     * this method and retrieve the user based on any criteria they desire.
     *
     * @param assertion The CAS Assertion.
     * @return the UserDetails.
     */
    protected UserDetails loadUserByAssertion(final Assertion assertion) {
        final CasAssertionAuthenticationToken token = new CasAssertionAuthenticationToken(
                assertion, "");
        return this.authenticationUserDetailsService.loadUserDetails(token, assertion);
    }

    @SuppressWarnings("unchecked")
    /**
     * Sets the UserDetailsService to use. This is a convenience method to invoke
     */
    public void setUserDetailsService(final KbUserDetailsService userDetailsService) {
        this.authenticationUserDetailsService = new KbUserDetailsByNameServiceWrapper(
                userDetailsService);
    }

    public void setAuthenticationUserDetailsService(
            final KbUserDetailsByNameServiceWrapper<CasAssertionAuthenticationToken> authenticationUserDetailsService) {
        this.authenticationUserDetailsService = authenticationUserDetailsService;
    }

    public void setServiceProperties(final ServiceProperties serviceProperties) {
        this.serviceProperties = serviceProperties;
    }

    protected String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public StatelessTicketCache getStatelessTicketCache() {
        return statelessTicketCache;
    }

    protected TicketValidator getTicketValidator() {
        return ticketValidator;
    }

    public void setMessageSource(final MessageSource messageSource) {
        this.messages = new MessageSourceAccessor(messageSource);
    }

    public void setStatelessTicketCache(final StatelessTicketCache statelessTicketCache) {
        this.statelessTicketCache = statelessTicketCache;
    }

    public void setTicketValidator(final TicketValidator ticketValidator) {
        this.ticketValidator = ticketValidator;
    }

    public void setAuthoritiesMapper(GrantedAuthoritiesMapper authoritiesMapper) {
        this.authoritiesMapper = authoritiesMapper;
    }

    public boolean supports(final Class<?> authentication) {
        return (UsernamePasswordAuthenticationToken.class
                .isAssignableFrom(authentication))
                || (CasAuthenticationToken.class.isAssignableFrom(authentication))
                || (CasAssertionAuthenticationToken.class
                .isAssignableFrom(authentication));
    }

    private Assertion getAssertion(Authentication authentication) throws TicketValidationException {
        if(assertion != null) return assertion;
        return this.ticketValidator.validate(authentication
                .getCredentials().toString(), getServiceUrl(authentication));
    }
}
