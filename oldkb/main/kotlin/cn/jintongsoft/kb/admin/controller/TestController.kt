package cn.jintongsoft.kb.admin.controller

import cn.jintongsoft.kb.api.db.KnowledgeGet
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

/**
 * Created by mike on 2017/1/17.
 */
@Controller
class TestController {

    @RequestMapping("/get_json")
    @ResponseBody
    fun get(): KnowledgeGet {
        val result = KnowledgeGet()
        result.knowledgeId = 222L
        result.knowledgeName = "hello"
        return result
    }
}
