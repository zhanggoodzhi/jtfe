package cn.jintongsoft.kb.admin.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by Administrator on 2017/1/22.
 */
@Controller
@RequestMapping("/configuration")
@Slf4j
public class ConfigurationController {

    @RequestMapping("/**")
    public String actionIndex() {
        return "index";
    }
}
