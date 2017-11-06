package cn.jintongsoft.kb.admin.controller;

import cn.jintongsoft.kb.api.onto.OntoGrafNode;
import cn.jintongsoft.kb.api.onto.OntoGrafService;
import cn.jintongsoft.kb.api.onto.OntoServiceException;
import com.alibaba.dubbo.config.annotation.Reference;
import org.springframework.web.bind.annotation.*;

/**
 * Created by mike on 2017/4/17.
 */
@RestController
@RequestMapping("onto_graf")
public class OntoGrafController {

    @Reference
    private OntoGrafService ontoGrafService;

    @PostMapping("node")
    public OntoGrafNode getOntoGrafNode(@SessionAttribute("appid") int appid, @RequestParam(value = "uri", defaultValue = "http://www.w3.org/2002/07/owl#Thing") String uri) throws OntoServiceException {
        return ontoGrafService.queryNode(appid, uri);
    }

    @PostMapping("nodes")
    public OntoGrafNode[] getOntoGrafNodes(@SessionAttribute("appid") int appid, @RequestParam(value = "uris") String[] uris) throws OntoServiceException {
        return ontoGrafService.queryNodes(appid, uris);
    }

}
