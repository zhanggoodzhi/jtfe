package cn.jintongsoft.kb.admin.controller;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.alibaba.dubbo.config.annotation.Reference;

import cn.jintongsoft.kb.admin.tool.DateTranslate;
import cn.jintongsoft.kb.admin.tool.ExportToExcel;
import cn.jintongsoft.kb.api.KnowledgeStatisticsService;
import cn.jintongsoft.kb.api.db.DataStatistics;
import cn.jintongsoft.kb.api.db.DateDataStatistics;
import cn.jintongsoft.kb.api.db.DirectoryHeatSearch;
import cn.jintongsoft.kb.api.db.DirectoryHeatStatistics;
import cn.jintongsoft.kb.api.db.KnowledgeHeatSearch;
import cn.jintongsoft.kb.api.db.KnowledgeHeatStatistics;
import lombok.extern.slf4j.Slf4j;


/**
 * Created by Administrator on 2017/1/22.
 */
@Controller
@RequestMapping("/statistics")
@Slf4j
public class StatisticsController {

    @Reference
    private KnowledgeStatisticsService knowledgeStatisticsService;

    /**
     * 获取总数据
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping("/index")
    public String actionIndex(ModelMap model, @SessionAttribute("appid") int appid) throws Exception {
        DataStatistics data = knowledgeStatisticsService.getDataStatistics(appid);
        model.addAttribute("data", data);
        return "statistics/index/index";
    }

    /**
     * 新增折线图
     * @param startDay
     * @param endDay
     * @param type
     *          type = 1:知识新增数
     *          type = 2:评论新增数
     *          type = 3:收藏新增数
     * @return
     * @throws Exception
     */
    @ResponseBody
    @GetMapping("/increment")
    public DateDataStatistics actionGetIncrement(@SessionAttribute("appid") int appid,
    									 @RequestParam(value = "startDay") String startDay,
                                         @RequestParam(value = "endDay") String endDay,
                                         @RequestParam(value = "type") int type) throws Exception {
        Date start = DateTranslate.getStartTimeOfOneDay(startDay);
        Date end = DateTranslate.getStartTimeOfOneDay(endDay);
        log.debug("start=[{}]", start);
        log.debug("end=[{}]", end);
        DateDataStatistics  data = knowledgeStatisticsService.getDateDataStatistics(start, end, type, appid);
        log.debug("data=[{}]", data);
        return data;
    }

    /**
     * 获取日期与该日内新增的知识（或评论或收藏）（前10）
     * @param search
     * @return
     * @throws Exception
     */
    @ResponseBody
    @GetMapping("/knowledge/hot/list")
    public List<KnowledgeHeatStatistics> actionKnowledgeHotList(@SessionAttribute("appid") int appid,
    		KnowledgeHeatSearch search) throws Exception {
        List<KnowledgeHeatStatistics> list = knowledgeStatisticsService.getKnowledgeHeatStatistics(search, appid);
        return list;
    }

    /**
     * EXCEL:日期与该日内新增的知识（或评论或收藏）（前10）
     * @param search
     * @return
     * @throws Exception
     */
    @ResponseBody
    @GetMapping("/knowledge/hot/excel")
    public void actionKnowledgeHotExcel(HttpServletResponse response, @SessionAttribute("appid") int appid,
    		KnowledgeHeatSearch search) throws Exception {

        List<KnowledgeHeatStatistics> results = knowledgeStatisticsService.getKnowledgeHeatStatistics(search, appid);
        if(!results.isEmpty()){
            ExportToExcel ex = new ExportToExcel();
            int type = search.getType();
            String excelName = type == 2 ? "知识点评论热度" :"知识点收藏热度" + "（" + search.getStartDay() + "至" + search.getEndDay() + "）";
            try {
                Workbook wb = ex.exportKnowledgeHotExcel(excelName, results);
                String sFileName = excelName + ".xls";
                response.setHeader("Content-Disposition",
                    "attachment;filename=".concat(String.valueOf(URLEncoder.encode(sFileName, "UTF-8"))));
                response.setHeader("Connection", "close");
                response.setHeader("Content-Type", "application/vnd.ms-excel");
                wb.write(response.getOutputStream());
            } catch (UnsupportedEncodingException e) {
                log.error("UnsupportedEncodingException:", e);
            } catch (IOException e) {
                log.error("IOException:", e);
            }
        }
        System.gc();/* 垃圾回收 */
    }

    /**
     * 分类热度
     * @param search
     * @return
     * @throws Exception
     */
    @ResponseBody
    @GetMapping("/directory/hot/list")
    public List<DirectoryHeatStatistics> actionDirectoryHotList(@SessionAttribute("appid") int appid,
    		DirectoryHeatSearch search) throws Exception {
        List<DirectoryHeatStatistics> list = knowledgeStatisticsService.getDirectoryHeatStatistics(search, appid);
        return list;
    }

    @ResponseBody
    @GetMapping("/directory/hot/excel")
    public void actionDirectoryHotExcel(HttpServletResponse response, @SessionAttribute("appid") int appid,
    		DirectoryHeatSearch search) throws Exception {
        List<DirectoryHeatStatistics> results = knowledgeStatisticsService.getDirectoryHeatStatistics(search, appid);
        if(!results.isEmpty()){
            ExportToExcel ex = new ExportToExcel();
            String excelName = "类别热度" + "（" + search.getStartDay() + "至" + search.getEndDay() + "）";;
            try {
                Workbook wb = ex.exportDirectoryHotExcel(excelName, results);
                String sFileName = excelName + ".xls";
                response.setHeader("Content-Disposition",
                    "attachment;filename=".concat(String.valueOf(URLEncoder.encode(sFileName, "UTF-8"))));
                response.setHeader("Connection", "close");
                response.setHeader("Content-Type", "application/vnd.ms-excel");
                wb.write(response.getOutputStream());
            } catch (UnsupportedEncodingException e) {
                log.error("*UnsupportedEncodingException*", e);
            } catch (IOException e) {
                log.error("*IOException*", e);
            }
        }
        System.gc();/* 垃圾回收 */
    }





}
