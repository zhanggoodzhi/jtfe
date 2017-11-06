package cn.jintongsoft.kb.admin.bean;

import cn.jintongsoft.cloud.bean.UserGet;
import cn.jintongsoft.kb.api.db.DirectoryTemplateGet;
import cn.jintongsoft.kb.api.db.KnowledgeTemplateGet;
import cn.jintongsoft.kb.api.db.LabelGet;
import cn.jintongsoft.kb.api.db.PrivilegeGet;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Created by chenxian on 2017/8/18.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InitDataVo {
    List<DirectoryTemplateGet> directoryTemplateGetList;
    List<KnowledgeTemplateGet> knowledgeTemplateGetList;
    List<LabelGet> labelGetList;
    List<UserGet> userList;
    List<PrivilegeGet> privilegeGetList;

}
