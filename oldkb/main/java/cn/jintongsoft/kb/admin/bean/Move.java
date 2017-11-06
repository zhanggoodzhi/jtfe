package cn.jintongsoft.kb.admin.bean;

import java.io.Serializable;

import lombok.Data;

@Data
public class Move implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	long id;//待移动目录或知识点ID
	private Long parent;//可以为空，代表父目录
}
