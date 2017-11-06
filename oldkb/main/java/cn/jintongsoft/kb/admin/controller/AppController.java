package cn.jintongsoft.kb.admin.controller;

import cn.jintongsoft.kb.admin.AppGet;
import cn.jintongsoft.kb.admin.security.KbUser;
import cn.jintongsoft.kb.admin.tool.Result;
import cn.jintongsoft.kb.api.tool.Page;
import cn.jintongsoft.kb.api.tool.Pageable;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/app")
@Slf4j
public class AppController {

    public static Map<String, Integer> appMap = new HashMap<>();

    @GetMapping("/list")
    @ResponseBody
    public Page<AppGet> list(@SessionAttribute("user") KbUser user) {
        List<AppGet> list = user.getApps();
        Collections.sort(list);
        Page<AppGet> page = new Page<>();
        page.setContent(list);
        page.setTotal(list.size());
        page.setPageable(new Pageable(1, list.size()));
//        App.applist.forEach((key, value) -> {
//            AppGet it = new AppGet(key, value);
//            list.add(it);
//        });
        return page;
    }

    @PostMapping("/submit")
    public String submit(HttpSession session, int appid) {
        session.setAttribute("appid", appid);
        appMap.put("appid", appid);//添加appid至缓存
        log.debug("[appid={}] was selected", appid);
        return "redirect:/user_center/index";
    }

    @RequestMapping("/deny")
    public Object deny(HttpServletRequest request, HttpServletResponse response) throws Exception {
        String origin = request.getParameter("origin");
        if (origin.endsWith("/index")) {
            //一般url末尾需为/index的设定为跳转请求
            return "app/deny/index";
        } else {
            //一般url末尾不为/index的设定为异步请求,比如ajax
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.set("Content-Type", "application/json;charset=utf-8");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).header("Content-Type", "application/json;charset=utf-8").body(Result.error("您没有权限进行该操作"));
        }
    }

}
