package cn.jintongsoft.kb.admin.security;

import org.jasig.cas.client.session.SingleSignOutFilter;
import org.jasig.cas.client.validation.Assertion;
import org.jasig.cas.client.validation.Cas20ServiceTicketValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.security.cas.ServiceProperties;
import org.springframework.security.cas.authentication.CasAssertionAuthenticationToken;
import org.springframework.security.cas.web.CasAuthenticationEntryPoint;
import org.springframework.security.cas.web.CasAuthenticationFilter;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.access.ExceptionTranslationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;


 @EnableWebSecurity
 @EnableGlobalMethodSecurity(securedEnabled = true, prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	private Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private UserAuthenticationSuccessHandler successHandler;

	@Autowired
    private KbUserDetailsService kbUserDetailsService;

     private Assertion assertion;



	@Value("${spring.security.cas.server.url.prefix}")
	private String casServerUrlPrefix;

	@Value("${spring.security.cas.client.service}")
	private String service;

	@Value("${spring.security.cas.server.login.url}")
	private String loginUrl;

	@Value("${spring.security.cas.server.logout.url}")
	private String logoutUrl;

	@Value("${spring.security.cas.client.logout.success.url}")
	private String logoutSuccessUrl;

	@Value("${spring.security.request.single.logout.filter.processes.url}")
	private String requestSingleLogoutFilterProcessesUrl;

	@Value("${spring.security.access.denied.url}")
    private String securityAccessDeniedUrl;

	@Bean
	public ServiceProperties serviceProperties() {
		ServiceProperties serviceProperties = new ServiceProperties();
		log.debug("tdb:{}", service);
		serviceProperties.setService(service);
		serviceProperties.setSendRenew(false);
		return serviceProperties;
	}


	@Bean
	public KbCasAuthenticationProvider casAuthenticationProvider() {
		KbCasAuthenticationProvider casAuthenticationProvider = new KbCasAuthenticationProvider();
		casAuthenticationProvider.setAuthenticationUserDetailsService(authenticationUserDetailsService());
		casAuthenticationProvider.setServiceProperties(serviceProperties());
		casAuthenticationProvider.setTicketValidator(cas20ServiceTicketValidator());
		casAuthenticationProvider.setKey("an_id_for_this_auth_provider_only");
		return casAuthenticationProvider;
	}

	@Bean
	public KbUserDetailsByNameServiceWrapper<CasAssertionAuthenticationToken> authenticationUserDetailsService() {
		KbUserDetailsByNameServiceWrapper<CasAssertionAuthenticationToken> wrapper = new KbUserDetailsByNameServiceWrapper<>();
		wrapper.setUserDetailsService(kbUserDetailsService);
		return wrapper;//权限处理
	}

	@Bean
	public Cas20ServiceTicketValidator cas20ServiceTicketValidator() {
		log.debug("casServerUrlPrefix:{}", casServerUrlPrefix);
		Cas20ServiceTicketValidator cas20ServiceTicketValidator = new Cas20ServiceTicketValidator(casServerUrlPrefix);
		return cas20ServiceTicketValidator;
	}

	@Bean
	public CasAuthenticationFilter casAuthenticationFilter() throws Exception {
		CasAuthenticationFilter casAuthenticationFilter = new CasAuthenticationFilter();
		casAuthenticationFilter.setAuthenticationManager(authenticationManager());
		casAuthenticationFilter.setAuthenticationSuccessHandler(successHandler);
		casAuthenticationFilter.setServiceProperties(serviceProperties());
        return casAuthenticationFilter;
	}


	@Bean
	public CasAuthenticationEntryPoint casAuthenticationEntryPoint() {
		CasAuthenticationEntryPoint casAuthenticationEntryPoint = new CasAuthenticationEntryPoint();
		log.debug("loginUrl:{}", loginUrl);
		casAuthenticationEntryPoint.setLoginUrl(loginUrl);
		casAuthenticationEntryPoint.setServiceProperties(serviceProperties());
		return casAuthenticationEntryPoint;
	}

	@Bean
    public AccessDeniedHandler accessDeniedHandler(){
        KbAccessDeniedHandler handler = new KbAccessDeniedHandler();
        handler.setErrorPage(securityAccessDeniedUrl);
	    return handler;
    }

	@Bean
	public SingleSignOutFilter singleSignOutFilter() {
		SingleSignOutFilter singleSignOutFilter = new SingleSignOutFilter();
		singleSignOutFilter.setCasServerUrlPrefix(casServerUrlPrefix);
		singleSignOutFilter.setIgnoreInitConfiguration(true);
		return singleSignOutFilter;
	}

	@Bean
	public LogoutFilter requestSingleLogoutFilter() {
		SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();
		log.debug("logoutUrl:{}", logoutUrl);
		LogoutFilter requestSingleLogoutFilter = new LogoutFilter(logoutUrl, logoutHandler);
		requestSingleLogoutFilter.setFilterProcessesUrl(requestSingleLogoutFilterProcessesUrl);
		return requestSingleLogoutFilter;
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {

		// 使用自定义的login页面
		http.csrf().disable()
		.addFilterAt(casAuthenticationFilter(), CasAuthenticationFilter.class)
		.addFilterBefore(requestSingleLogoutFilter(), LogoutFilter.class)
		.addFilterBefore(singleSignOutFilter(), CasAuthenticationFilter.class)
		.exceptionHandling().authenticationEntryPoint(casAuthenticationEntryPoint()).accessDeniedHandler(accessDeniedHandler())
		.and()
		.authorizeRequests()
		.antMatchers("/public/**", "/images/**", "*.html", "*.css", "*.js").permitAll()
		.antMatchers("/app/**", "/configuration/**", "/framework/**", "/repository/**", "/search/**", "/statistics/**", "/user_center/**")
            .hasAuthority("ROLE_USER")
		.anyRequest().authenticated()
		.and()
		.logout().logoutSuccessUrl(logoutSuccessUrl);

	}

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.authenticationProvider(casAuthenticationProvider());
	}
}
