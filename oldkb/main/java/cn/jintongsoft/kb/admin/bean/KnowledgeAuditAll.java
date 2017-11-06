package cn.jintongsoft.kb.admin.bean;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
@Data
public class KnowledgeAuditAll implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private List<Long> knowledgeIds;
	private int result;
}
