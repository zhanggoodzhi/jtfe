//package cn.jintongsoft.kb.admin.controller;
//
//import cn.jintongsoft.kb.api.ReasonerService;
//import cn.jintongsoft.kb.api.sparql.Solution;
//import com.alibaba.dubbo.config.annotation.Reference;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.ResponseBody;
//
//import java.util.List;
//
///**
// * Created by guyanxuan on 2017/8/14.
// */
//
//@Controller
//@RequestMapping("/reasoner")
//@Slf4j
//public class ReasonerController {
//
//    @Reference
//    private ReasonerService reasonerService;
//
//    @GetMapping("/listResults")
//    @ResponseBody
//    public String getInferredResults() {
//
//        String queryString = "SELECT ?name ?info WHERE " +
//            "{ ?x <http://kb.jintongsoft.cn/data/301/property/403848fa9c0141f3b1ba1a624d5c02ad> \"刘德华\" . " +
//            "?x <http://kb.jintongsoft.cn/data/301/property/670a8b54f7a54a5293e78dbb6ed8004c> ?daughter . " +
//            "?daughter <http://kb.jintongsoft.cn/data/301/property/403848fa9c0141f3b1ba1a624d5c02ad> ?name . " +
//            "?daughter }";
//
//
//        List<Solution> solutionList = reasonerService.executeQueryWithInference(301, queryString);
//
//        reasonerService.printTestInfo(solutionList); //Test
//        return "ok";
//    }
//}
