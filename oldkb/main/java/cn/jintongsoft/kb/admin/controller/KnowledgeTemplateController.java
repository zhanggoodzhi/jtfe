package cn.jintongsoft.kb.admin.controller;

import cn.jintongsoft.kb.api.KnowledgeTemplateService;
import cn.jintongsoft.kb.api.db.KnowledgeTemplateGet;
import cn.jintongsoft.kb.api.db.KnowledgeTemplatePost;
import cn.jintongsoft.kb.api.db.KnowledgeTemplatePut;
import com.alibaba.dubbo.config.annotation.Reference;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;

@Controller
@RequestMapping("/api/template")
@Slf4j
public class KnowledgeTemplateController {

    @Reference
    private KnowledgeTemplateService knowledgeTemplateService;

    /**
     * 根据主键查看模板详情
     *
     * @param knowledgeTemplateId 模板主键
     * @return KnowledgeTemplateGet
     *
     * 韦唯
     * 2017/8/28 15:37
     */
    @ResponseBody
    @GetMapping("/detail")
    public KnowledgeTemplateGet actionDetail(HttpSession session, Long knowledgeTemplateId) {
        KnowledgeTemplateGet template = knowledgeTemplateService.getKnowledgeTemplate(knowledgeTemplateId);
        return template;
    }

    /**
     * 查看当前应用下所有模板信息
     *
     * @return List<KnowledgeTemplateGet>
     *
     * 韦唯
     * 2017/8/28 15:37
     */
    @ResponseBody
    @GetMapping("list")
    public List<KnowledgeTemplateGet> getlist(@SessionAttribute("appid") int appid) {
        return knowledgeTemplateService.listOfKnowledgeTemplates(appid);
    }

    /**
     * 新增模板
     *
     * @param data 待添加模板信息和域的list
     *      {
     *          name : 模板名称,
     *          comments : 模板描述,
     *          fields : [{
     *             key : 键值,
     *             label : 域标签,
     *             typeUri : 类uri,
     *             propUri : 属性uri,
     *             propType : 是否外键,
     *             config : 配置信息
     *          }]
     *      }
     *
     * 韦唯
     * 2017/8/28 15:35
     */
    @ResponseBody
    @PostMapping("/create")
    @PreAuthorize("hasRole('MANIPULATION_KNOWLEDGE_TEMPLATE_DATA')")
    public ResponseEntity<Void> create(@RequestBody KnowledgeTemplatePost data, @SessionAttribute("appid") int appid) {
        knowledgeTemplateService.createKnowledgeTemplate(data, appid);
        return ResponseEntity.ok().build();
    }

    /**
     * 修改模板
     *
     * @param data 待修改模板信息和域的list
     *      {
     *          id : 模板ID,
     *          name : 模板名称,
     *          comments : 模板描述,
     *          fields : [{
     *             id : 域ID
     *             key : 键值,
     *             label : 域标签,
     *             typeUri : 类uri,
     *             propUri : 属性uri,
     *             propType : 是否外键,
     *             config : 配置信息
     *          },...]
     *      }
     *
     * 韦唯
     * 2017/8/28 15:39
     */
    @ResponseBody
    @PutMapping("/update")
    @PreAuthorize("hasRole('MANIPULATION_KNOWLEDGE_TEMPLATE_DATA')")
    public ResponseEntity<Void> update(@RequestBody KnowledgeTemplatePut data) {
        knowledgeTemplateService.updateKnowledgeTemplate(data);
        return ResponseEntity.ok().build();
    }

    /**
     * 删除模板
     *
     * @param knowledgeTemplateId 待删除模板主键
     *
     * 韦唯
     * 2017/8/28 15:40
     */
    @ResponseBody
    @DeleteMapping("/delete")
    @PreAuthorize("hasRole('MANIPULATION_KNOWLEDGE_TEMPLATE_DATA')")
    public ResponseEntity<Void> delete(Long knowledgeTemplateId) {
        knowledgeTemplateService.deleteKnowledgeTemplate(knowledgeTemplateId);
        return ResponseEntity.ok().build();
    }

    /**
     * 校验key是否已存在
     *
     * @param
     * @return Boolean
     *      true 已存在
     *      false 不存在
     *
     * 韦唯
     * 2017/8/31 10:28
     */
    @ResponseBody
    @GetMapping("checkKeyIsUsed")
    public Boolean checkKeyIsUsed(@RequestParam(value = "key") String key){
        return knowledgeTemplateService.checkKeyIsUsed(key);
    }

}
