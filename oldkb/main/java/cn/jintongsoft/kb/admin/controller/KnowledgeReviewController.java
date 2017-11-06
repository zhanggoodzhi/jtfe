package cn.jintongsoft.kb.admin.controller;

import cn.jintongsoft.kb.admin.bean.KnowledgeAudit;
import cn.jintongsoft.kb.admin.bean.KnowledgeAuditAll;
import cn.jintongsoft.kb.api.KnowledgeService;
import cn.jintongsoft.kb.api.KnowledgeTemplateService;
import cn.jintongsoft.kb.api.KnowlegeReviewHistoryService;
import cn.jintongsoft.kb.api.db.KnowledgeReviewHistoryGet;
import cn.jintongsoft.kb.api.db.KnowledgeReviewHistorySearch;
import cn.jintongsoft.kb.api.exception.KnowledgeReviewHistoryServiceException;
import cn.jintongsoft.kb.api.tool.Page;
import cn.jintongsoft.kb.api.tool.Pageable;
import com.alibaba.dubbo.config.annotation.Reference;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@Controller
@RequestMapping("/api/review")
@Slf4j
public class KnowledgeReviewController {

    @Reference
    private KnowledgeTemplateService knowledgeTemplateService;

    @Reference
    private KnowlegeReviewHistoryService reviewHistoryService;

    @Reference
    private KnowledgeService knowledgeService;



    /**
     * 审核列表
     *
     * @param startDay
     * @param endDay
     * @param page
     * @param size
     * @throws KnowledgeReviewHistoryServiceException
     */
    @ResponseBody
    @GetMapping("/recordlist")
    public Page<KnowledgeReviewHistoryGet> actionRecordList(
        @SessionAttribute("appid") int appid,
        @RequestParam(value = "startDay", required = false) Date startDay,
        @RequestParam(value = "endDay", required = false) Date endDay,
        @RequestParam(value = "page", defaultValue = "1") int page,
        @RequestParam(value = "size", defaultValue = "10") int size) throws KnowledgeReviewHistoryServiceException {
        Pageable pageable = new Pageable(page, size);
        KnowledgeReviewHistorySearch search = new KnowledgeReviewHistorySearch();
        search.setStartDay(startDay);
        search.setEndDay(endDay);
        search.setPageable(pageable);
        Page<KnowledgeReviewHistoryGet> result = reviewHistoryService.listOfReviewHistory(appid, search);
        return result;
    }

    /**
     * 批量审核
     *
     * @throws KnowledgeReviewHistoryServiceException
     */
    @ResponseBody
    @PutMapping("/auditall")
    @PreAuthorize("hasRole('REVIEW_KNOWLEDGE_DATA')")
    public boolean actionAuditAll(@SessionAttribute("userid") int userid, @RequestBody KnowledgeAuditAll audit)
        throws KnowledgeReviewHistoryServiceException {
        List<Long> knowledgeIds = audit.getKnowledgeIds();
        int result = audit.getResult();
        knowledgeService.auditKnowledges(knowledgeIds, result, userid);
        return true;
    }

    /**
     * 进行审核
     * <p>
     * param id
     * DocReviewHistory的id
     *
     * @throws KnowledgeReviewHistoryServiceException
     */
    @ResponseBody
    @PutMapping("/audit")
    @PreAuthorize("hasRole('REVIEW_KNOWLEDGE_DATA')")
    public boolean actionAudit(@SessionAttribute("userid") int userid, @RequestBody KnowledgeAudit audit)
        throws KnowledgeReviewHistoryServiceException {
        long knowledgeId = audit.getKnowledgeId();
        int result = audit.getResult();
        String reason = audit.getReason();
        knowledgeService.auditKnowledge(knowledgeId, result, reason, userid);
        return true;
    }

}
