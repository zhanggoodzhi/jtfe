package cn.jintongsoft.kb.admin.security;


import cn.jintongsoft.kb.admin.AppGet;
import cn.jintongsoft.kb.api.RolePrivilegeService;
import cn.jintongsoft.kb.api.db.PrivilegeGet;
import cn.jintongsoft.kb.api.db.RolePrivilegeRelGet;
import com.alibaba.dubbo.config.annotation.Reference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jasig.cas.client.authentication.AttributePrincipal;
import org.jasig.cas.client.validation.Assertion;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class KbUserDetailsService
		implements UserDetailsService {

    private static Logger logger = LoggerFactory.getLogger(KbUserDetailsService.class);

    @Reference
    private RolePrivilegeService rolePrivilegeService;

	private Assertion assertion;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		AttributePrincipal principal = assertion.getPrincipal();
		Map<String, Object> attributes = principal.getAttributes();
		String pricipalName = principal.getName();
		int userid = Integer.parseInt((String) attributes.get("id"));
		String alias = (String) attributes.get("alias");
		String headicon = (String) attributes.get("headicon");
		String email = (String) attributes.get("email");
		String mobile = (String) attributes.get("mobile");
		String qq = (String) attributes.get("qq");
		String regtime = (String) attributes.get("regtime");
		String apps = (String) attributes.get("apps");
        apps = apps.replace(",{]", "]");
        ObjectMapper objectMapper = new ObjectMapper();
        List<AppGet> applist = new ArrayList<>();
        List<RolePrivilegeRelGet> rolePrivilegeRels = null;
		try {
            List<LinkedHashMap> appmaplist = objectMapper.readValue(apps, List.class);
            for (LinkedHashMap map: appmaplist) {
                int appid = (Integer) map.get("id");
                String appname = (String) map.get("name");
                applist.add(new AppGet(appid, appname));
            }
            rolePrivilegeRels = rolePrivilegeService.listOfUserRolePrivilege(userid);

        } catch (Exception e) {
			logger.error("Exception:", e);
		}

        List<GrantedAuthority> authorities = new ArrayList<>();
        for (RolePrivilegeRelGet rel : rolePrivilegeRels) {
            String rolename = rel.getName();
            List<PrivilegeGet> privileges = rel.getPrivileges();
            for(PrivilegeGet p:privileges){
                authorities.add(new Role(p.getName()));
            }
           // authorities.add(new Role(rolename));
        }
        authorities.add(new Role("ROLE_USER"));
		KbUser user = new KbUser(pricipalName, "******", authorities);
		user.setId(userid);
		user.setAlias(alias);
		user.setHeadicon(headicon);
		user.setEmail(email);
		user.setMobile(mobile);
		user.setQq(qq);
		user.setRegtime(regtime);
		user.setApps(applist);
		return user;
	}

	public void setAssertion(final Assertion assertion) {
		this.assertion = assertion;
	}
}
