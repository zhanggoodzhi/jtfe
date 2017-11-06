package cn.jintongsoft.kb.admin.bean;

import java.io.Serializable;

import lombok.Data;
@Data
public class KnowledgeAudit implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private long knowledgeId;
	private int result;
	private String reason;
}
