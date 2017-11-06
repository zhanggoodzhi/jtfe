package cn.jintongsoft.kb.admin.controller;

import cn.jintongsoft.kb.admin.tool.JsonLongConfig;
import cn.jintongsoft.kb.api.KnowledgeDirectoryService;
import cn.jintongsoft.kb.api.KnowledgeService;
import cn.jintongsoft.kb.api.KnowledgeTemplateService;
import cn.jintongsoft.kb.api.LabelService;
import cn.jintongsoft.kb.api.db.DataStatistics;
import cn.jintongsoft.kb.api.db.KnowledgeDirectoryGet;
import cn.jintongsoft.kb.api.db.KnowledgeTemplateGet;
import cn.jintongsoft.kb.api.db.LabelGet;
import com.alibaba.dubbo.config.annotation.Reference;
import lombok.extern.slf4j.Slf4j;
import net.sf.json.JSONArray;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttribute;

import java.util.List;

/**
 * Created by Liu on 2017/1/22.
 */
@Controller
@RequestMapping("/user_center")
@Slf4j
public class UserCenterController {

    @Reference
    private KnowledgeService knowledgeService;

    @Reference
    private KnowledgeDirectoryService directoryService;

    @Reference
    private KnowledgeTemplateService templateService;

    @Reference
    private LabelService labelService;

    @RequestMapping("/index")
    public String actionIndex(ModelMap model, @SessionAttribute("appid") int appid, @SessionAttribute("userid") int userid) throws Exception {
        DataStatistics result = knowledgeService.getUserStatistics(userid);
        List<KnowledgeDirectoryGet> alldirectory = directoryService.getDirectorys(appid);
        List<KnowledgeTemplateGet> templates = templateService.listOfKnowledgeTemplates(appid);
        List<LabelGet> labels = labelService.listOfLabels(appid);
        JsonLongConfig config = new JsonLongConfig();
        model.addAttribute("templates", JSONArray.fromObject(templates, config));
        model.addAttribute("labels", JSONArray.fromObject(labels, config));
        model.addAttribute("alldirectory", JSONArray.fromObject(alldirectory, config));
        model.addAttribute("result", result);
        model.addAttribute("title", "用户中心");
        return "user_center/index/index";
    }


}
