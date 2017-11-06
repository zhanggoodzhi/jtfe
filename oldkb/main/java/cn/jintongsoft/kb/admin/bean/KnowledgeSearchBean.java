package cn.jintongsoft.kb.admin.bean;

import cn.jintongsoft.kb.admin.tool.DateTranslate;
import cn.jintongsoft.kb.api.db.KnowledgeSearch;
import cn.jintongsoft.kb.api.tool.Pageable;
import lombok.Data;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.web.bind.annotation.RequestParam;

/**
 * Created by Administrator on 2017/1/23.
 */
@Data
public class KnowledgeSearchBean implements Serializable {
    private String keyword;//(模糊查询)，知识点名称关键字，可以为空
    private Integer[] status;//为空，代表所有状态
    private Long templateId;//模板类ID，为空，代表所有类型
    private String startDay;//作为查询创建时间的开始时间,可以为空
    private String endDay;//作为查询创建时间的结束时间,可以为空
    private Long directoryId;//目录（分类）ID
    private Long classifyid;//指定目录查询（仅限该目录，不包括子孙目录）
    private String author;//作者
    private boolean reviewPage;//是否为查询待审核列表
    private Long labelId;//标签查询
    private int page = 1;//分页数据
    private int size = 10;//分页数据

    public KnowledgeSearch getKnowledgeSearch(){
        KnowledgeSearch search = new KnowledgeSearch();
        search.setKeyword(this.keyword);
        search.setTemplateId(this.templateId);
        search.setStartDay(DateTranslate.getStartTimeOfOneDay(startDay));
        search.setEndDay(DateTranslate.getEndTimeOfOneDay(endDay));
        search.setPageable(new Pageable(page, size));
        search.setAuthor(author);
        search.setReviewPage(reviewPage);
        search.setDirectoryId(directoryId);
        search.setClassifyId(classifyid);
        search.setLabelId(labelId);
        if(status!=null){
            search.setStatus(Arrays.asList(status));
        }
        return search;
    }
}
