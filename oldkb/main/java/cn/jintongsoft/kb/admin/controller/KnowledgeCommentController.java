package cn.jintongsoft.kb.admin.controller;

import cn.jintongsoft.cloud.bean.UserGet;
import cn.jintongsoft.cloud.service.AdminUserService;
import cn.jintongsoft.kb.api.KnowledgeCommentService;
import cn.jintongsoft.kb.api.db.KnowledgeCommentBase;
import cn.jintongsoft.kb.api.db.KnowledgeCommentPost;
import cn.jintongsoft.kb.api.db.KnowledgeCommentSearch;
import cn.jintongsoft.kb.api.db.KnowledgeCommentTree;
import cn.jintongsoft.kb.api.exception.KnowledgeCommentServiceException;
import cn.jintongsoft.kb.api.tool.Page;
import cn.jintongsoft.kb.api.tool.Pageable;
import com.alibaba.dubbo.config.annotation.Reference;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Liu on 2017/2/16.
 */
@Controller
@RequestMapping("/api/comment")
@Slf4j
public class KnowledgeCommentController {

    @Reference
    private AdminUserService adminUserService;

    @Reference
    private KnowledgeCommentService knowledgeCommentService;

    /**
     * 知识点详情页评论
     *
     * @param session
     * @param commentId
     * @param knowledgeId
     * @param page
     * @param size
     * @return
     * @throws KnowledgeCommentServiceException
     */
    @ResponseBody
    @GetMapping("/knowledge/comment/list")
    public Page<KnowledgeCommentTree> actionList(HttpSession session,
                                                 @RequestParam(value = "commentId", required = false) Long commentId,
                                                 @RequestParam(value = "knowledgeId", required = false) Long knowledgeId,
                                                 @RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                                 @RequestParam(value = "size", required = false, defaultValue = "10") int size) throws Exception {
        if (commentId == null && knowledgeId == null) {
            throw new KnowledgeCommentServiceException("参数不能都为空");
        }
        Pageable pageable = new Pageable(page, size);
        Page<KnowledgeCommentTree> objects = knowledgeCommentService.listOfKnowledgeComment(commentId, knowledgeId, pageable);
        List<KnowledgeCommentTree> treeList = objects.getData();
        List<Integer> userids = new ArrayList<>();
        Map<String, KnowledgeCommentTree> userTreeMap = new HashMap<>();
        for (KnowledgeCommentTree tree : treeList) {
            long treeid = tree.getCommentId();
            Integer userid = tree.getUserid();
            userids.add(userid);
            userTreeMap.put(userid.toString(), tree);
        }
        List<UserGet> usergets = adminUserService.listOfUser(userids);
        for (UserGet get : usergets) {
            Integer userid = get.getId();
            String username = get.getAlias();//使用用户的别名，而不是使用用户的账号名
            KnowledgeCommentTree tree = userTreeMap.get(userid.toString());
            tree.setUsername(username);
        }
        return objects;
    }

    /**
     * 我的评论
     *
     * @param search
     * @return
     * @throws KnowledgeCommentServiceException
     */
    @ResponseBody
    @GetMapping("/mylist")
    public Page<KnowledgeCommentBase> actionMyList(@SessionAttribute("userid") int userid, KnowledgeCommentSearch search) throws KnowledgeCommentServiceException {
        search.setUserid(userid);
        Page<KnowledgeCommentBase> object = knowledgeCommentService.listOfKnowledgeComment(search);
        //TODO: 2017/3/20  根据userid添加username
        return object;
    }

    /**
     * 知识点详情页 添加评论
     *
     * @param post
     * @return
     * @throws KnowledgeCommentServiceException
     */
    @ResponseBody
    @PostMapping("/create")
    public KnowledgeCommentBase actionCreate(@SessionAttribute("userid") int userid, @RequestBody KnowledgeCommentPost post) throws KnowledgeCommentServiceException {
        post.setUserid(userid);
        KnowledgeCommentBase base = knowledgeCommentService.createKnowledgeComment(post);
        return base;
    }

    /**
     * 删除评论
     *
     * @param commentId
     * @return
     * @throws KnowledgeCommentServiceException
     */
    @ResponseBody
    @DeleteMapping("/delete")
    public ResponseEntity<Void> actionDelete(@RequestParam(value = "commentId", required = true) Long commentId) throws KnowledgeCommentServiceException {
        knowledgeCommentService.deleteKnowledgeComment(commentId);
        return ResponseEntity.ok().build();
    }

}
