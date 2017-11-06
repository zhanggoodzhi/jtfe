package cn.jintongsoft.kb.admin.bean;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSearch implements Serializable {
	/**
	 *
	 */
	private static final long serialVersionUID = 1L;
	private String key;
	private Integer roleid;
	private int page;
	private int size;
}
