package cn.jintongsoft.kb.admin.controller;

import cn.jintongsoft.kb.api.KnowledgeCollectionService;
import cn.jintongsoft.kb.api.db.KnowledgeCollectionGet;
import cn.jintongsoft.kb.api.db.KnowledgeCollectionSearch;
import cn.jintongsoft.kb.api.exception.KnowledgeCollectionServiceException;
import cn.jintongsoft.kb.api.tool.Page;
import com.alibaba.dubbo.config.annotation.Reference;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

/**
 * Created by Liu on 2017/2/15.
 */
@Controller
@RequestMapping("/api/collection")
@Slf4j
public class KnowledgeCollectionController {

    @Reference
    private KnowledgeCollectionService knowledgeCollectionService;

    /**
     * 获取收藏列表
     *
     * @param search
     * @return
     * @throws KnowledgeCollectionServiceException
     */
    @ResponseBody
    @GetMapping("/list")
    public Page<KnowledgeCollectionGet> actionList(@SessionAttribute("appid") int appid, @SessionAttribute("userid") int userid, KnowledgeCollectionSearch search) throws KnowledgeCollectionServiceException {
        search.setUserid(userid);
        Page<KnowledgeCollectionGet> page = knowledgeCollectionService.listOfKnowledgeCollection(search);
        return page;
    }

    /**
     * 收藏知识点，知识点详情页
     *
     * @param knowledgeId
     * @return
     * @throws KnowledgeCollectionServiceException
     */
    @ResponseBody
    @PostMapping("/create")
    public ResponseEntity<?> actionCreate(@SessionAttribute("userid") int userid, @RequestParam(value = "knowledgeId") Long knowledgeId) throws KnowledgeCollectionServiceException {
        knowledgeCollectionService.createKnowledgeCollection(knowledgeId, userid);
        return ResponseEntity.ok().build();
    }

    /**
     * 取消收藏，知识点详情页
     */
    @ResponseBody
    @DeleteMapping("/delete")
    public ResponseEntity<Void> actionDelete(@SessionAttribute("userid") int userid, @RequestParam(value = "knowledgeId") long knowledgeId) throws KnowledgeCollectionServiceException {
        knowledgeCollectionService.deleteKnowledgeCollection(knowledgeId, userid);
        return ResponseEntity.ok().build();
    }

    /**
     * 查看是否收藏，知识点详情页
     *
     * @param knowledgeId
     * @return
     * @throws KnowledgeCollectionServiceException
     */
    @ResponseBody
    @GetMapping("/iscollected")
    public boolean actionIsCollected(@SessionAttribute("userid") int userid, @RequestParam(value = "knowledgeId") Long knowledgeId) throws KnowledgeCollectionServiceException {
        return knowledgeCollectionService.isCollected(knowledgeId, userid);
    }


}
