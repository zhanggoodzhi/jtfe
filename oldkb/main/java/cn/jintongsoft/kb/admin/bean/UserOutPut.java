package cn.jintongsoft.kb.admin.bean;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonTypeInfo;

import cn.jintongsoft.kb.api.db.RoleSimple;

@JsonTypeInfo(use= JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY)
public class UserOutPut implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Integer id;
	private String name;
	private String alias;
	private String password;
	private String email;
	private String headicon;
	private String mobile;
	private String qq;
	private List<RoleSimple> roles;
	
	
	public UserOutPut() {
		super();
	}
	public UserOutPut(Integer id, String name, String alias, String password, String email, String headicon, String mobile,
			String qq, List<RoleSimple> roles) {
		super();
		this.id = id;
		this.name = name;
		this.alias = alias;
		this.password = password;
		this.email = email;
		this.headicon = headicon;
		this.mobile = mobile;
		this.qq = qq;
		this.roles = roles;
	}
	
	public UserOutPut(Integer id, String name, String alias, String password, String email, String mobile,
			String qq) {
		super();
		this.id = id;
		this.name = name;
		this.alias = alias;
		this.password = password;
		this.email = email;
		this.mobile = mobile;
		this.qq = qq;
	}
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getName() {
		return name == null ? "" : name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getAlias() {
		return alias == null ? "" : alias;
	}
	public void setAlias(String alias) {
		this.alias = alias;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEmail() {
		return email == null ? "" : email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getHeadicon() {
		return headicon;
	}
	public void setHeadicon(String headicon) {
		this.headicon = headicon;
	}
	public String getMobile() {
		return mobile == null ? "" : mobile;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	public String getQq() {
		return qq == null ? "" : qq;
	}
	public void setQq(String qq) {
		this.qq = qq;
	}
	public List<RoleSimple> getRoles() {
		return roles;
	}
	public void setRoles(List<RoleSimple> roles) {
		this.roles = roles;
	}
	
	
	
	
}
