package cn.jintongsoft.kb.admin.controller;

import cn.jintongsoft.kb.api.LabelService;
import cn.jintongsoft.kb.api.db.LabelGet;
import cn.jintongsoft.kb.api.db.LabelPut;
import cn.jintongsoft.kb.api.exception.LabelServiceException;
import com.alibaba.dubbo.config.annotation.Reference;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by Administrator on 2017/1/24.
 */
@Controller
@RequestMapping("/api/label")
@Slf4j
public class LabelController {

    @Reference
    private LabelService labelService;

    /**
     * 获取所有标签
     */
    @ResponseBody
    @GetMapping("/list")
    public List<LabelGet> actionList(@SessionAttribute("appid") int appid) throws LabelServiceException {
        List<LabelGet> list = labelService.listOfLabels(appid);
        return list;
    }

    /**
     * 新增标签
     */
    @ResponseBody
    @PostMapping("/create")
    @PreAuthorize("hasRole('MANIPULATION_LABEL_DATA')")
    public LabelGet actionCreate(@RequestParam(value = "name") String name, @SessionAttribute("appid") int appid) throws LabelServiceException {
        LabelGet get = labelService.createLabel(name, appid);
        return get;
    }

    /**
     * 更新标签
     */
    @ResponseBody
    @PutMapping("/update")
    @PreAuthorize("hasRole('MANIPULATION_LABEL_DATA')")
    public LabelPut actionUpdate(@RequestBody LabelPut put) throws LabelServiceException {
        labelService.updateLabel(put);
        return put;
    }

    /**
     * 删除标签
     */
    @ResponseBody
    @DeleteMapping("/delete")
    @PreAuthorize("hasRole('MANIPULATION_LABEL_DATA')")
    public ResponseEntity<?> actionDelete(@RequestParam(value = "labelId", required = true) long labelId) throws LabelServiceException {
        LabelGet labelGet=labelService.getLabel(labelId);
        labelService.deleteLabel(labelId);
        return  ResponseEntity.ok(labelGet);
    }
}
