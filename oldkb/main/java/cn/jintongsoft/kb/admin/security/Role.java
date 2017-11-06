package cn.jintongsoft.kb.admin.security;

import org.springframework.security.core.GrantedAuthority;

public class Role implements GrantedAuthority {
	/**
	 * 
	 */
	private static final long serialVersionUID = 8403221872228160026L;
	private String role;
	
	public enum SecurityRole {
		ROLE_ADMIN, ROLE_SYSTEM,ROLE_USER
	}
	
	public Role(SecurityRole role) {
		super();
		this.role = role.name();
	}
	
	public Role(String role) {
		super();
		this.role = role;
	}
	public Role() {
		super();
	}
	@Override
	public String getAuthority() {
		return role;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}

	public String toString() {
		return this.role;
	}

	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}

		if (obj instanceof Role) {
			return role.equals(((Role) obj).role);
		}

		return false;
	}
	

}
