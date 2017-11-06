package cn.jintongsoft.kb.admin.controller;

import cn.jintongsoft.kb.admin.bean.Move;
import cn.jintongsoft.kb.api.KnowledgeDirectoryService;
import cn.jintongsoft.kb.api.KnowledgeService;
import cn.jintongsoft.kb.api.db.*;
import cn.jintongsoft.kb.api.exception.KnowledgeDirectoryServiceException;
import cn.jintongsoft.kb.api.exception.KnowledgeServiceException;
import com.alibaba.dubbo.config.annotation.Reference;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;

@Controller
@RequestMapping("/api/directory")
@Slf4j
public class DirectoryController {

    @Reference
    private KnowledgeDirectoryService directoryService;

    @Reference
    private KnowledgeService knowledgeService;


    /**
     * 添加目录
     * <p>
     * param name
     * param parent
     *
     * @throws KnowledgeDirectoryServiceException
     */
    @ResponseBody
    @PostMapping("/add")
    @PreAuthorize("hasRole('MANIPULATION_KNOWLEDGE_DIRECTORY_DATA')")
    public KnowledgeDirectoryGet actionAdd(@RequestBody KnowledgeDirectoryPost data)
        throws KnowledgeDirectoryServiceException {
        KnowledgeDirectoryGet directory = directoryService.createDirectory(data);
        return directory;
    }

    /**
     * 重命名
     * <p>
     * param id
     * param name
     *
     * @throws KnowledgeDirectoryServiceException
     */
    @ResponseBody
    @PutMapping("/rename")
    @PreAuthorize("hasRole('MANIPULATION_KNOWLEDGE_DIRECTORY_DATA')")
    public KnowledgeDirectoryGet actionRename(@RequestBody KnowledgeDirectoryPut data)
        throws KnowledgeDirectoryServiceException {
        KnowledgeDirectoryGet directory = directoryService.updateDirectory(data);
        return directory;
    }

    /**
     * 移动目录
     * <p>
     * param id
     * param parent
     *
     * @throws KnowledgeDirectoryServiceException
     */
    @ResponseBody
    @PutMapping("/movedir")
    @PreAuthorize("hasRole('MANIPULATION_KNOWLEDGE_DIRECTORY_DATA')")
    public ResponseEntity<?> actionMoveDir(HttpSession session,
                                           @RequestBody Move move)
        throws KnowledgeDirectoryServiceException {
        directoryService.moveDirctory(move.getId(), move.getParent());
        return ResponseEntity.ok().build();
    }

    /**
     * 移动知识点
     * <p>
     * param docid
     * param dirid
     *
     * @throws KnowledgeServiceException
     */
    @ResponseBody
    @PutMapping("/movedoc")
    @PreAuthorize("hasRole('MANIPULATION_KNOWLEDGE_DATA')")
    public ResponseEntity<?> actionMoveDoc(@SessionAttribute("appid") int appid, @SessionAttribute("userid") int userid,
                                           @RequestBody Move move) throws KnowledgeServiceException {
        knowledgeService.moveKnowledge(move.getId(), move.getParent(), userid);
        return ResponseEntity.ok().build();
    }

    /**
     * 删除目录
     *
     * @param session
     * @param directoryId
     * @return
     * @throws KnowledgeDirectoryServiceException
     */
    @ResponseBody
    @DeleteMapping("/delete")
    @PreAuthorize("hasRole('MANIPULATION_KNOWLEDGE_DIRECTORY_DATA')")
    public String actionDelete(HttpSession session,
                               @RequestParam(value = "directoryId", required = true) Long directoryId)
        throws KnowledgeDirectoryServiceException {
        directoryService.deleteDirectory(directoryId);
        return "{}";
    }

    /**
     * 查询分类类别列表
     *
     * @param directoryId
     * @return
     * @throws KnowledgeDirectoryServiceException
     */
    @ResponseBody
    @GetMapping("/template/list")
    public List<DirectoryTemplateGet> actionListDirectoryTemplate(
        @RequestParam(value = "directoryId", required = false) Long directoryId, @SessionAttribute("appid") int appid) throws KnowledgeDirectoryServiceException {
        List<DirectoryTemplateGet> list = directoryService.listOfDirectoryTemplate(directoryId, appid);
        return list;
    }

    /**
     * 添加知识类别，即目录与模板的关系，同时也新增目录
     * <p>
     * param name
     * param parent
     *
     * @throws KnowledgeDirectoryServiceException
     */
    @ResponseBody
    @PostMapping("/template/add")
    @PreAuthorize("hasRole('MANIPULATION_KNOWLEDGE_DIRECTORY_DATA')")
    public DirectoryTemplateGet actionAddDirectoryTemplate(@RequestBody DirectoryTemplatePost data, @SessionAttribute("appid") int appid)
        throws KnowledgeDirectoryServiceException {
        DirectoryTemplateGet directoryTemplate = directoryService.createDirectoryTemplate(data, appid);
        return directoryTemplate;
    }

    /**
     * 更新识类别，即目录与模板的关系
     * <p>
     * param name
     * param parent
     *
     * @throws KnowledgeDirectoryServiceException
     */
    @ResponseBody
    @PutMapping("/template/update")
    @PreAuthorize("hasRole('MANIPULATION_KNOWLEDGE_DIRECTORY_DATA')")
    public DirectoryTemplateGet actionUpdateDirectoryTemplate(@RequestBody DirectoryTemplatePut data)
        throws KnowledgeDirectoryServiceException {
        DirectoryTemplateGet directoryTemplate = directoryService.updateDirectoryTemplate(data);
        return directoryTemplate;
    }

    /**
     * 删除目录与模板的关系
     *
     * @param directoryId
     * @param templateId
     * @return
     * @throws KnowledgeDirectoryServiceException
     */
    @ResponseBody
    @DeleteMapping("/template/delete")
    @PreAuthorize("hasRole('MANIPULATION_KNOWLEDGE_DIRECTORY_DATA')")
    public ResponseEntity<?> actionDeleteDirectoryTemplate(
        @RequestParam(value = "directoryId", required = true) long directoryId,
        @RequestParam(value = "templateId", required = true) long templateId)
        throws KnowledgeDirectoryServiceException {
        directoryService.deleteDirectoryTemplate(directoryId, templateId);
        return ResponseEntity.ok().build();
    }

}
