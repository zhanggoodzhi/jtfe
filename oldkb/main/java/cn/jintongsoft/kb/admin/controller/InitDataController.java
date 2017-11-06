package cn.jintongsoft.kb.admin.controller;

import cn.jintongsoft.cloud.bean.UserGet;
import cn.jintongsoft.cloud.bean.UserSearch;
import cn.jintongsoft.cloud.exception.AdminUserServiceException;
import cn.jintongsoft.cloud.service.AdminUserService;
import cn.jintongsoft.kb.admin.bean.InitDataVo;
import cn.jintongsoft.kb.api.KnowledgeDirectoryService;
import cn.jintongsoft.kb.api.KnowledgeTemplateService;
import cn.jintongsoft.kb.api.LabelService;
import cn.jintongsoft.kb.api.RolePrivilegeService;
import cn.jintongsoft.kb.api.db.DirectoryTemplateGet;
import cn.jintongsoft.kb.api.db.KnowledgeTemplateGet;
import cn.jintongsoft.kb.api.db.LabelGet;
import cn.jintongsoft.kb.api.db.PrivilegeGet;
import cn.jintongsoft.kb.api.exception.KnowledgeDirectoryServiceException;
import cn.jintongsoft.kb.api.exception.KnowledgeInitDataServiceException;
import cn.jintongsoft.kb.api.exception.LabelServiceException;
import cn.jintongsoft.kb.api.exception.RolePrivilegeServiceException;
import com.alibaba.dubbo.config.annotation.Reference;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;

import java.util.List;

/**
 * Created by chenxian on 2017/8/18.
 */
@Controller
@RequestMapping("/api/initData")
@Slf4j
public class InitDataController {

    @Reference
    private KnowledgeDirectoryService directoryService;

    @Reference
    private KnowledgeTemplateService knowledgeTemplateService;

    @Reference
    private LabelService labelService;

    @Reference
    private AdminUserService adminUserService;

    @Reference
    private RolePrivilegeService rolePrivilegeService;

    /**
     * 获取初始化信息
     *
     * @param appid
     * @return
     * @throws KnowledgeInitDataServiceException
     */
    @ResponseBody
    @GetMapping("/list")
    public InitDataVo actionList(@SessionAttribute("appid") int appid) throws KnowledgeInitDataServiceException {
        InitDataVo initDataVo = new InitDataVo();
        List<DirectoryTemplateGet> list;
        //获取目录（分类）与模板关系列表，包括目录以及模板的详细信息
        try {
            list = directoryService.listOfDirectoryTemplate(null, appid);
        } catch (KnowledgeDirectoryServiceException e) {
            throw new KnowledgeInitDataServiceException("获取分类异常");
        }
        initDataVo.setDirectoryTemplateGetList(list);

        //获取app下所有模板
        List<KnowledgeTemplateGet> knowledgeTemplateGetList;
        try {
            knowledgeTemplateGetList = knowledgeTemplateService.listOfKnowledgeTemplates(appid);
        }catch (Exception e){
            throw new KnowledgeInitDataServiceException("获取模板异常");
        }
        initDataVo.setKnowledgeTemplateGetList(knowledgeTemplateGetList);

        // 获取所有标签
        List<LabelGet> labelGetList ;
        try {
            labelGetList = labelService.listOfLabels(appid);
        } catch (LabelServiceException e) {
            throw new KnowledgeInitDataServiceException("获取所有标签异常");
        }
        initDataVo.setLabelGetList(labelGetList);
        //查询启用状态下的所有用户信息
        UserSearch search = new UserSearch();
        search.setStatus(1);
        List<UserGet> userGetList;
        try {
            userGetList = adminUserService.listOfUserNoPage(search, appid);
        } catch (AdminUserServiceException e) {
            throw new KnowledgeInitDataServiceException("获取所有用户异常");
        }
        initDataVo.setUserList(userGetList);
        //查询所有权限信息
        List<PrivilegeGet> privilegeGetList;
            try {
                privilegeGetList=rolePrivilegeService. listOfPrivilege();
            } catch (RolePrivilegeServiceException e) {
                throw new KnowledgeInitDataServiceException("获取权限信息异常");
            }
            initDataVo.setPrivilegeGetList(privilegeGetList);
        return initDataVo;
    }
}
