package cn.jintongsoft.kb.admin.controller;

import cn.jintongsoft.kb.admin.bean.Rule;
import cn.jintongsoft.kb.admin.bean.RuleConditionOrConclusion;
import cn.jintongsoft.kb.admin.bean.RuleDetail;
import cn.jintongsoft.kb.api.RuleService;
import cn.jintongsoft.kb.api.db.RuleGet;
import cn.jintongsoft.kb.api.db.RulePost;
import cn.jintongsoft.kb.api.exception.LabelServiceException;
import cn.jintongsoft.kb.api.sparql.SparqlQuery;
import cn.jintongsoft.kb.api.tool.Page;
import com.alibaba.dubbo.config.annotation.Reference;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import net.sf.json.JSONArray;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static cn.jintongsoft.kb.api.sparql.Reference.Type.DATATYPE_PROPERTY;
import static cn.jintongsoft.kb.api.sparql.Reference.Type.OBJECT_PROPERTY;

/**
 * Created by bys on 2017-08-13.
 */

@Controller
@RequestMapping("/rule")
@Slf4j
public class RuleController {

    @Reference
    private RuleService ruleService;

    @Reference
    private SparqlQuery sparqlQuery;

    ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 获取所有模板的属性
     *
     * @return
     * @throws Exception
     */
    @GetMapping("/index")
    @ResponseBody
    public String actionIndex(@SessionAttribute("appid") int appid) throws Exception {
        List<cn.jintongsoft.kb.api.sparql.Reference> result = sparqlQuery.listReferences(appid);

        List<cn.jintongsoft.kb.api.sparql.Reference> references = new ArrayList<>();
        for (cn.jintongsoft.kb.api.sparql.Reference r : result) {
            if (DATATYPE_PROPERTY.equals(r.getType()) || OBJECT_PROPERTY.equals(r.getType())) {
                references.add(r);
            }
        }
        String resultString = JSONArray.fromObject(references).toString();

        return resultString;
    }

    /**
     * 获取应用下的所有规则
     */
    @ResponseBody
    @GetMapping("/list")
    public Page<Rule> actionList(HttpServletRequest request, HttpServletResponse response,
                                 HttpSession session,
                                 @RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
                                 @RequestParam(value = "pageSize", required = false, defaultValue = "10") Integer pageSize,
                                 @SessionAttribute("appid") int appid) throws LabelServiceException {
        List<RuleGet> ruleGets = ruleService.findByAppid(appid);

        int total = ruleGets.size();
        List<RuleGet> list = new ArrayList<>();
        if (page * pageSize > total) {
            list = ruleGets.subList((page - 1) * pageSize, total);
        } else {
            list = ruleGets.subList((page - 1) * pageSize, page * pageSize);
        }

        List<Rule> rules = new ArrayList<Rule>();

        for (RuleGet ruleGet : list) {
            Rule rule = new Rule();

            rule.setId(ruleGet.getId().toString());
            rule.setMerge("[" + ruleGet.getRuleName() + ":" + ruleGet.getCondition() + "->" + ruleGet.getConclusion() + "]");

            RuleDetail ruleDetail = new RuleDetail();
            ruleDetail.setRuleName(ruleGet.getRuleName());


            List<RuleConditionOrConclusion> condition = new ArrayList<RuleConditionOrConclusion>();

            String[] strs = ruleGet.getCondition().split("\\)");
            for (int i = 0; i < strs.length; i++) {
                String str = strs[i].substring(1, strs[i].length());

                RuleConditionOrConclusion r = new RuleConditionOrConclusion();
                String[] split = str.split("\\s+");
                r.setSubject(split[0]);
                r.setPredicate(split[1]);
                r.setObject(split[2]);
                condition.add(r);
            }
            ruleDetail.setCondition(condition);

            List<RuleConditionOrConclusion> conclusion = new ArrayList<RuleConditionOrConclusion>();
            String[] myStr = ruleGet.getConclusion().split("\\)");
            for (int i = 0; i < myStr.length; i++) {
                String str = myStr[i].substring(1, myStr[i].length());

                RuleConditionOrConclusion r = new RuleConditionOrConclusion();
                String[] split = str.split("\\s+");
                r.setSubject(split[0]);
                r.setPredicate(split[1]);
                r.setObject(split[2]);
                conclusion.add(r);
            }
            ruleDetail.setConclusion(conclusion);

            rule.setDetail(ruleDetail);

            rules.add(rule);
        }

        Page<Rule> listPageGet = new Page<Rule>();
        listPageGet.setContent(rules);
        listPageGet.setTotal(total);

        return listPageGet;
    }

    /**
     * 新增规则
     */
    @ResponseBody
    @PostMapping("/create")
    public RuleGet actionCreate(@RequestParam(value = "ruleParam") String ruleParam,
                                @SessionAttribute("appid") int appid) throws LabelServiceException {
        Rule rule = new Rule();

        try {
            rule = objectMapper.readValue(ruleParam, Rule.class);
        } catch (JsonParseException e) {
            e.printStackTrace();
        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        String ruleCondition = "";
        String ruleConclusion = "";
        for (RuleConditionOrConclusion r : rule.getDetail().getCondition()) {
            ruleCondition = ruleCondition + "(" + r.getSubject() + "  " + r.getPredicate() + "  " + r.getObject() + ")";
        }
        for (RuleConditionOrConclusion r : rule.getDetail().getConclusion()) {
            ruleConclusion = ruleConclusion + "(" + r.getSubject() + "  " + r.getPredicate() + "  " + r.getObject() + ")";
        }

        RulePost rulePost = new RulePost();
        rulePost.setAppid(appid);
        rulePost.setRuleName(rule.getDetail().getRuleName());
        rulePost.setCondition(ruleCondition);
        rulePost.setConclusion(ruleConclusion);

        RuleGet ruleGet = ruleService.createRule(rulePost);

        return ruleGet;
    }

    /**
     * 修改规则
     */
    @ResponseBody
    @PostMapping("/update")
    public ResponseEntity<Void> actionUpdate(@RequestParam(value = "ruleParam") String ruleParam,
                                             @RequestParam(value = "id") Long id,
                                             @SessionAttribute("appid") int appid) throws LabelServiceException {
        Rule rule = new Rule();

        try {
            rule = objectMapper.readValue(ruleParam, Rule.class);
        } catch (JsonParseException e) {
            e.printStackTrace();
        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        String ruleCondition = "";
        String ruleConclusion = "";
        for (RuleConditionOrConclusion r : rule.getDetail().getCondition()) {
            ruleCondition = ruleCondition + "(" + r.getSubject() + "  " + r.getPredicate() + "  " + r.getObject() + ")";
        }
        for (RuleConditionOrConclusion r : rule.getDetail().getConclusion()) {
            ruleConclusion = ruleConclusion + "(" + r.getSubject() + "  " + r.getPredicate() + "  " + r.getObject() + ")";
        }

        RuleGet ruleGet = new RuleGet();
        ruleGet.setId(id);
        ruleGet.setAppid(appid);
        ruleGet.setRuleName(rule.getDetail().getRuleName());
        ruleGet.setCondition(ruleCondition);
        ruleGet.setConclusion(ruleConclusion);
        ruleService.updateRule(ruleGet);

        return ResponseEntity.ok().build();
    }

    /**
     * 删除规则
     */
    @ResponseBody
    @PostMapping("/delete")
    public ResponseEntity<Void> actionDelete(@RequestParam(value = "id") Long id) throws LabelServiceException {
        ruleService.deleteRule(id);
        return ResponseEntity.ok().build();
    }
}
