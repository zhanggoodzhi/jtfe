package cn.jintongsoft.kb.admin.bean;

import java.io.Serializable;
import java.util.List;

import cn.jintongsoft.cloud.bean.UserPost;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPostAll extends UserPost implements Serializable {
	/**
	 *
	 */
	private static final long serialVersionUID = 1L;
	private List<Long> roleids;
}
