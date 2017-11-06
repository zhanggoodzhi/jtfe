package cn.jintongsoft.kb.admin.controller;

import cn.jintongsoft.kb.admin.tool.Result;
import cn.jintongsoft.kb.api.KnowledgeDirectoryService;
import cn.jintongsoft.kb.api.KnowledgeTemplateService;
import cn.jintongsoft.kb.api.RolePrivilegeService;
import com.alibaba.dubbo.config.annotation.Reference;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.InputStream;

/**
 * Created by Administrator on 2017/1/22.
 */
@Controller
@RequestMapping("/api/configuration")
@Slf4j
public class ConfigurationRestController {

    @Reference
    private RolePrivilegeService rolePrivilegeService;

    @Reference
    private KnowledgeDirectoryService directoryService;

    @Reference
    private KnowledgeTemplateService templateService;

    @ResponseBody
    @PostMapping("/upload")
    public ResponseEntity<?> actionUpload(HttpServletRequest request, @RequestParam(value = "uploadfile") MultipartFile uploadfile) throws Exception {
        String filename = uploadfile.getOriginalFilename();
        String suffix = filename.substring(filename.lastIndexOf("."));
        if (!suffix.equals("onto")) {
            throw new Exception("请上传owl文件");
        }
        InputStream inputStream = uploadfile.getInputStream();
        byte[] data = uploadfile.getBytes();
        File temp = File.createTempFile("OWL", ".onto");
        //保证Service、admin在同一台机器上
        FileUtils.writeByteArrayToFile(temp, data);
        return ResponseEntity.ok().body(Result.success());
    }
}
