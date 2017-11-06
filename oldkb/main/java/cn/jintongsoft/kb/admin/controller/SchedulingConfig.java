package cn.jintongsoft.kb.admin.controller;

import cn.jintongsoft.kb.api.KnowledgeDirectoryService;
import cn.jintongsoft.kb.api.KnowledgeService;
import cn.jintongsoft.kb.api.KnowledgeSolrService;
import cn.jintongsoft.kb.api.KnowledgeStatisticsService;
import cn.jintongsoft.kb.api.exception.KnowledgeDirectoryServiceException;
import cn.jintongsoft.kb.api.exception.KnowledgeServiceException;
import cn.jintongsoft.kb.api.exception.StatisticServiceException;
import com.alibaba.dubbo.config.annotation.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * 定时任务配置类 Created by chenxian on 2017/2/21.
 */
//@Component
public class SchedulingConfig {
	@Reference
	KnowledgeStatisticsService knowledgeStatisticsService;

	@Reference
	KnowledgeService knowledgeService;

	@Reference
	private KnowledgeDirectoryService directoryService;

	@Reference
	private KnowledgeSolrService knowledgeSolrService;

	private final Logger logger = LoggerFactory.getLogger(getClass());

	private static int solrNum = 0;
    private static int solrHotNum = 0;

	/**
	 * 知识统计scheduler
	 *
	 * @throws StatisticServiceException
	 */
	@Scheduled(cron = "0 59 23 * * ?") // 每天23:59执行一次
	// @Scheduled(cron = "*/5 * * * * ?") // 每5秒执行一次
	public void scheduler() throws StatisticServiceException {
		if (AppController.appMap.get("appid") != null) {
			int appid = AppController.appMap.get("appid");
			knowledgeStatisticsService.scheduler(appid);
			logger.debug("[{}]", appid);
		}
	}

	/**
	 * solr定时创建
	 *
	 * @throws KnowledgeServiceException
	 */
	// @Scheduled(cron = "0 0 0,13,18,21 * * ? ") // 每秒执行一次
	@Scheduled(cron = "*/5 * * * * ?") // 每5秒执行一次
	public void solrScheduler() throws KnowledgeServiceException {
		if (AppController.appMap.get("appid") != null && solrNum != AppController.appMap.get("appid")) {
			int appid = AppController.appMap.get("appid");
			try {
//				knowledgeSolrService.deleteAllSolrIndex(appid);
//				knowledgeSolrService.deleteAllHotIndex(appid);
				knowledgeSolrService.createSolrIndex(appid);
				solrNum = appid;
                logger.debug("solrNum=[{}]", solrNum);
			} catch (Exception e) {
				throw new KnowledgeServiceException("定时刷新solr索引异常", e);
			}
		}
	}

    /**
     * solr hot索引创建
     * @throws KnowledgeServiceException
     */
    @Scheduled(cron = "*/5 * * * * ?") // 每5秒执行一次
    public void solrHotScheduler() throws KnowledgeServiceException {
        if (AppController.appMap.get("appid") != null && solrHotNum != AppController.appMap.get("appid")) {
            int appid = AppController.appMap.get("appid");
            try {
                knowledgeSolrService.createHotIndex(appid);
                solrHotNum = appid;
                logger.debug("solrHotNum=[{}]", solrHotNum);
            } catch (Exception e) {
                throw new KnowledgeServiceException("定时刷新热门solr索引异常", e);
            }
        }
    }


	/**
	 * 获取7天内知识点更新
	 *
	 * @throws KnowledgeServiceException
	 */
	// @Scheduled(cron = "0 0 0,13,18,21 * * ? ") // 每秒执行一次
	@Scheduled(cron = "0 0 */1 * * ?") // 每小时执行一次
	public void knowledgeUpdateScheduler() throws KnowledgeDirectoryServiceException {
		if (AppController.appMap.get("appid") != null) {
			int appid = AppController.appMap.get("appid");
			directoryService.knowledgeUpdateScheduler(appid);
		}
	}

	/**
	 * 定时获取7天，目录和知识点热度
	 *
	 * @throws KnowledgeServiceException
	 */
	// @Scheduled(cron = "*/5 * * * * ?") // 每5秒执行一次
	@Scheduled(cron = "0 0 */6 * * ?") // 每6小时执行一次
	public void knowledgeDirectoryScheduler() throws StatisticServiceException {
		if (AppController.appMap.get("appid") != null) {
			int appid = AppController.appMap.get("appid");
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Date date = new Date();
			Date endTime = new Date(date.getTime() + 24 * 60 * 60 * 1000);
			Calendar c = Calendar.getInstance();
			c.add(Calendar.DAY_OF_MONTH, -6);// 关键是这个7天前....
			System.out.println(sdf.format(c.getTime()));
			String startDay = sdf.format(c.getTime());
			Date startTime = null;
			try {
				startTime = sdf.parse(startDay);
			} catch (ParseException e) {
				throw new StatisticServiceException("时间格式转化异常", e);
			}
			knowledgeStatisticsService.setDirectHotmap(startTime, endTime, appid);
			knowledgeStatisticsService.setKnowHotmap(startTime, endTime, appid);
		}
	}
}
