package cn.jintongsoft.kb.admin.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;

/**
 * Created by Administrator on 2017/1/22.
 */
@Controller
@RequestMapping("/framework")
@Slf4j
public class FrameworkController {

    @RequestMapping("/index")
    public String actionIndex(ModelMap model, HttpSession session) throws Exception {
        return "framework/index/index";
    }
}
