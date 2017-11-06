package cn.jintongsoft.kb.admin.bean;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPut extends cn.jintongsoft.cloud.bean.UserPut implements Serializable {
	/**
	 *
	 */
	private static final long serialVersionUID = 1L;
    private List<Long> roleids;
}
