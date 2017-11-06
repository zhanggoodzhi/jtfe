package cn.jintongsoft.kb.admin.bean;

import java.io.Serializable;

public class UserGet implements Serializable, Comparable<UserGet> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Integer id;
	private String name;
	private String alias;
	private String password;
	private String email;
	private String mobile;
	private String qq;
	
	
	public UserGet() {
		super();
	}
	
	public UserGet(Integer id, String name, String alias, String password, String email, String mobile,
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

	
	@Override
	public int compareTo(UserGet other) {
		if(this.id < other.id){
			return 1;
		}else if(this.id > other.id){
			return -1;
		}else{
			return 0;
		}
	}

	@Override
	public String toString() {
		return "{id:" + id + ", name:" + name + ", alias:" + alias + ", password:" + password + ", email:"
				+ email + ", mobile:" + mobile + ", qq:" + qq + "}/r/n";
	}
	
	
	
}
