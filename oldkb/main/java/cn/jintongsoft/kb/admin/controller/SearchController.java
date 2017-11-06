package cn.jintongsoft.kb.admin.controller;

import cn.jintongsoft.kb.admin.tool.JsonLongConfig;
import cn.jintongsoft.kb.api.*;
import cn.jintongsoft.kb.api.db.KnowledgeBase;
import cn.jintongsoft.kb.api.db.KnowledgeDirectoryGet;
import cn.jintongsoft.kb.api.db.KnowledgeTemplateGet;
import cn.jintongsoft.kb.api.db.LabelGet;
import cn.jintongsoft.kb.api.exception.KnowledgeServiceException;
import cn.jintongsoft.kb.api.exception.KnowledgeSolrServiceException;
import cn.jintongsoft.kb.api.exception.LabelServiceException;
import com.alibaba.dubbo.config.annotation.Reference;
import lombok.extern.slf4j.Slf4j;
import net.sf.json.JSONArray;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

/**
 * Created by Administrator on 2017/1/22.
 */
@Controller
@RequestMapping("/api/search")
@Slf4j
public class SearchController {

    @Reference
    private KnowledgeService knowledgeService;

    @Reference
    private KnowledgeDirectoryService directoryService;

    @Reference
    private KnowledgeTemplateService templateService;

    @Reference
    private LabelService labelService;

    @Reference
    private KnowledgeSolrService knowledgeSolrService;


    @RequestMapping("/index")
    public String actionIndex(ModelMap model, @SessionAttribute("appid") int appid) throws Exception {
        List<KnowledgeDirectoryGet> alldirectory = directoryService.getDirectorys(appid);
        List<KnowledgeTemplateGet> templates = templateService.listOfKnowledgeTemplates(appid);
        List<LabelGet> labels = labelService.listOfLabels(appid);
        JsonLongConfig config = new JsonLongConfig();
        model.addAttribute("templates", JSONArray.fromObject(templates, config));
        model.addAttribute("labels", JSONArray.fromObject(labels, config));
        model.addAttribute("alldirectory", JSONArray.fromObject(alldirectory, config));
        return "search/index/index";
    }

    /**
     * type=1:按评论
     * type=2:按收藏
     * type=3:按搜索
     */
    @ResponseBody
    @GetMapping("/knowledge/hot")
    public Set<KnowledgeBase> actionKnowledgeHot(@SessionAttribute("appid") int appid,
                                                  @RequestParam(value = "type", defaultValue = "3") int type,
                                                  @RequestParam(value = "keyword", required = false) String keyword)
        throws  KnowledgeSolrServiceException {
        Set<KnowledgeBase> list = knowledgeSolrService.listOfHotKnowledge(keyword, type, appid);
        return list;
    }

    @ResponseBody
    @GetMapping("/label/hot")
    public List<LabelGet> actionLabelHot() throws LabelServiceException {
        List<LabelGet> list = labelService.listOfTopLabels();
        return list;
    }
}
