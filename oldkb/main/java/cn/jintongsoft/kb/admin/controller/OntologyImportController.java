package cn.jintongsoft.kb.admin.controller;

import cn.jintongsoft.kb.api.onto.OntologyImportService;
import com.alibaba.dubbo.config.annotation.Reference;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * 本体文件导入
 * Created by wy.wang on 2017/8/8.
 */
@Controller
@RequestMapping("/api/ontology/import")
@Slf4j
public class OntologyImportController {

    @Reference
    private OntologyImportService ontologyImportService;

    @ResponseBody
    @PostMapping()
    public String importOntology(@SessionAttribute("appid") int appid,
            @RequestParam(value = "attach") MultipartFile attach) throws Exception {

        if (attach == null)
            throw new Exception("请上传文件");
        String filename = attach.getOriginalFilename();

        byte[] bytes = attach.getBytes();

        ontologyImportService.Import(appid, bytes, filename);

        return "{\"success\":true}";
    }
}
