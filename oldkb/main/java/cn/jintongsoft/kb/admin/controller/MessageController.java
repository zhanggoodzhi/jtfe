package cn.jintongsoft.kb.admin.controller;

import cn.jintongsoft.kb.api.MessageService;
import cn.jintongsoft.kb.api.db.MessageGet;
import cn.jintongsoft.kb.api.db.MessageSearch;
import cn.jintongsoft.kb.api.exception.MessageServiceException;
import cn.jintongsoft.kb.api.tool.Page;
import com.alibaba.dubbo.config.annotation.Reference;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

/**
 * Created by Liu on 2017/2/16.
 */
@Controller
@RequestMapping("/message")
@Slf4j
public class MessageController {

    @Reference
    private MessageService messageService;

    /**
     * 是否由未读消息
     *
     * @return
     * @throws MessageServiceException
     */
    @ResponseBody
    @GetMapping("/hasUnread")
    public int actionIsHasUnRead(@SessionAttribute("userid") int userid) throws MessageServiceException {
        return messageService.isHasUnRead(userid);
    }

    /**
     * 点击某知识，消息标记为已读
     *
     * @param messageId
     * @return
     * @throws MessageServiceException
     */
    @ResponseBody
    @PutMapping("/signUnRead")
    public ResponseEntity<?> actionSignUnRead(@RequestParam(value = "messageId") long messageId) throws MessageServiceException {
        messageService.signUnRead(messageId);
        return ResponseEntity.ok().build();
    }

    /**
     * 所有未读知识点标记为已读
     *
     * @return
     * @throws MessageServiceException
     */
    @ResponseBody
    @PutMapping("/signUnRead/all")
    public ResponseEntity<?> actionSignUnRead(@SessionAttribute("userid") int userid) throws MessageServiceException {
        messageService.signUnRead(userid);
        return ResponseEntity.ok().build();
    }

    /**
     * 列出所有的消息
     *
     * @param session
     * @param search
     * @return
     * @throws MessageServiceException
     */
    @ResponseBody
    @GetMapping("/list")
    public Page<MessageGet> actionList(HttpSession session, MessageSearch search) throws MessageServiceException {
        Page<MessageGet> page = messageService.listOfMessage(search);
        return page;
    }

}
