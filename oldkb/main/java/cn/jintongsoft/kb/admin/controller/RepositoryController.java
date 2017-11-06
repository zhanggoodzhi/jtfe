package cn.jintongsoft.kb.admin.controller;

import cn.jintongsoft.cloud.bean.UserGet;
import cn.jintongsoft.cloud.service.AdminUserService;
import cn.jintongsoft.kb.admin.bean.KnowledgeSearchBean;
import cn.jintongsoft.kb.admin.tool.JsonLongConfig;
import cn.jintongsoft.kb.api.*;
import cn.jintongsoft.kb.api.db.*;
import cn.jintongsoft.kb.api.exception.*;
import cn.jintongsoft.kb.api.tool.SolrPage;
import cn.jintongsoft.kb.api.tool.Page;
import com.alibaba.dubbo.config.annotation.Reference;
import lombok.extern.slf4j.Slf4j;
import net.sf.json.JSONArray;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/repository")
@Slf4j
public class RepositoryController {

	@Reference
	private KnowledgeService knowledgeService;

	@Reference
	private KnowledgeDirectoryService directoryService;

	@Reference
	private KnowledgeTemplateService templateService;

	@Reference
	private KnowlegeReviewHistoryService reviewHistoryService;

	@Reference
	private KnowledgeModifyHistoryService modifyHistoryService;

	@Reference
	private ReviewOrderService reviewOrderService;

	@Reference
	private LabelService labelService;

	@Reference
	private AdminUserService adminUserService;
    @Reference
    private KnowledgeSolrService knowledgeSolrService;

	/**
	 * 主页:获取APP下所有分类（模板）、用户、路径
	 *
	 * @throws KnowledgeDirectoryServiceException
	 * @throws LabelServiceException
	 */
	@RequestMapping("/index")
	public String actionIndex(ModelMap model, @SessionAttribute("appid") int appid) throws Exception {
		List<KnowledgeDirectoryGet> alldirectory = directoryService.getDirectorys(appid);
		List<KnowledgeTemplateGet> templates = templateService.listOfKnowledgeTemplates(appid);
		List<LabelGet> labels = labelService.listOfLabels(appid);
		JsonLongConfig config = new JsonLongConfig();
		model.addAttribute("templates", JSONArray.fromObject(templates, config));
		model.addAttribute("labels", JSONArray.fromObject(labels, config));
		model.addAttribute("alldirectory", JSONArray.fromObject(alldirectory, config));
		model.addAttribute("title", "知识检索");
		return "repository/index/index";
	}

	/**
	 * 查看当前路径下的知识点(APP下)
	 *
	 * @throws KnowledgeServiceException
	 */
	@ResponseBody
	@GetMapping("/folderlist")
	public Page<KnowledgeSimple> actionFolderList(KnowledgeSearchBean search, @SessionAttribute("appid") int appid)
			throws KnowledgeServiceException {
		KnowledgeSearch input = search.getKnowledgeSearch();
        Page<KnowledgeSimple> result=null;
        if(input.getDirectoryId()!=null)
		result = knowledgeService.listOfKnowledgesByDirectory(input, appid);
        if(input.getDirectoryId()==null)
            result = knowledgeService.listOfKnowledges(input, appid, 0);
		return result;
	}

	/**
	 * 获取目录下所有子一级目录的子孙目录下的所有知识点最近七天更新情况以及更新数量
	 *
	 * @param directoryId
	 *            可以为空
	 * @return
	 * @throws KnowledgeServiceException
	 * @throws KnowledgeDirectoryServiceException
	 */
	@ResponseBody
	@GetMapping("/directorystatus")
	public List<KnowledgeDirectoryStatus> actionDirectoryStatus(@SessionAttribute("appid") int appid,
			@RequestParam(value = "directoryId", required = false) Long directoryId)
					throws KnowledgeServiceException, KnowledgeDirectoryServiceException {
		List<KnowledgeDirectoryStatus> directoryMsgs = directoryService.getDirectoryStatus(directoryId, appid);
		return directoryMsgs;
	}

	/**
	 * 知识点列表
	 * <p>
	 * param KnowledgeSearchBean
	 *
	 * @throws KnowledgeServiceException
	 */
	@ResponseBody
	@GetMapping("/list")
	public Page<KnowledgeSimple> actionList(@SessionAttribute("appid") int appid,
			@SessionAttribute("userid") int userid, KnowledgeSearchBean search) throws KnowledgeServiceException {
		KnowledgeSearch input = search.getKnowledgeSearch();
		Page<KnowledgeSimple> result = knowledgeService.listOfKnowledges(input, appid, userid);
		return result;
	}

	@ResponseBody
	@GetMapping("/mylist")
	public Page<MyKnowledge> actionMyList(@SessionAttribute("appid") int appid,@SessionAttribute("userid") int userid, MyKnowledgeSearch search)
			throws KnowledgeServiceException {
		Page<MyKnowledge> result = knowledgeService.listOfMyKnowledges(search, appid,userid);
		return result;
	}

	/**
	 * 知识点列表 solr
	 *
	 * @throws KnowledgeServiceException
	 */
	@ResponseBody
	@GetMapping("/solr")
	public KnowledgeSolrPageOutput actionSolr(@SessionAttribute("appid") int appid, KnowledgeSolrInput input)
        throws  KnowledgeSolrServiceException {
		input.setAppid(appid);
//		SolrPage output = knowledgeSolrService.getKnowledgeFromSolr(input);
		KnowledgeSolrPageOutput output = knowledgeSolrService.getKnowledgeByAll(input);
		return output;
	}

	/**
	 * 显示知识点详情，分类、标签、附件，最近的审核记录，新建未审核的知识点不会有审核记录的 详情以及更新、修改时调用 status
	 * 1：待提交，2：审核中，3：已发布，4：被驳回，5：已归档
	 *
	 *            true:进行审核
	 * @throws Exception
	 */
	@ResponseBody
	@GetMapping("/detail")
	public Map<String, Object> actionDetail(@SessionAttribute("appid") int appid,
			@SessionAttribute("userid") int userid,
			@RequestParam(value = "knowledgeId", required = false) Long knowledgeId,
			@RequestParam(value = "logicid", required = false) Long logicid,
			@RequestParam(value = "version", required = false) Integer version) throws Exception {
		KnowledgeDetail knowledge = null;
		if (knowledgeId != null) {
			knowledge = knowledgeService.getKnowledgeDetail(knowledgeId);
			logicid = knowledge.getLogicid();
			version = knowledge.getVersion();
		} else if (logicid != null && version != null) {
			knowledge = knowledgeService.getKnowledgeDetail(logicid, version);
		} else {
			throw new Exception("参数错误");
		}
		int status = knowledge.getStatus();
		// 发布状态下，检查同一逻辑ID下，是否存在草稿、待审以及驳回的知识
		// 一般如果存在升级的未通过的知识版本，就不允许用户进行版本升级操作
		boolean isoperate = true;// 允许升级
		if (status == 3) {
			boolean hasUnPublished = knowledgeService.isHasUnPublished(logicid);
			if (hasUnPublished)
				isoperate = false;// 存在未通过的知识，不允许进行版本升级操作
		}
		Map<String, Object> result = new HashMap<>();
		if (status == 4) {
			KnowledgeReviewHistoryGet reviewhistory = reviewHistoryService.getReviewHistoryGet(logicid, version,
					status);
			result.put("reviewhistory", reviewhistory);
		}
		boolean isreview = false;// 是否可以进行审核，默认不可以
		Integer currentReviewerId = knowledge.getReviewerId();
		if (currentReviewerId != null && userid == currentReviewerId && status == 2) {
			isreview = true;
		}
		List<ReviewOrderGet> list = reviewOrderService.listReviewOrder(appid);
		for (ReviewOrderGet reviewOrderGet : list) {
			UserGet user = adminUserService.getUser(reviewOrderGet.getUserid());
			reviewOrderGet.setUsername(user.getName());
		}
		// reviewOrderGet.setUsername();
		boolean isAfterCurrentReviewer = false;// 是否为当前审核者后面的人
		if (status != 1 && currentReviewerId != null) {
			for (ReviewOrderGet get : list) {
				int reviewerId = get.getUserid();
				if (reviewerId != currentReviewerId) {
					if (isAfterCurrentReviewer) {
						get.setResult(1);// Result == 1 还未轮的审核
					} else {
						get.setResult(3);// Result == 3 通过
					}
				} else {
					if (status == 2) {// status == 2审核中
						get.setResult(2);// Result == 2轮到某人审核
					} else if (status == 4) {// status == 4被驳回
						get.setResult(4);// Result == 4被驳回
					} else {// 发布或归档
						get.setResult(3);
					}
					isAfterCurrentReviewer = true;
				}
			}
		}
		result.put("reviewlist", list);
		result.put("isreview", isreview);
		result.put("knowledge", knowledge);
		result.put("isoperate", isoperate);
		return result;
	}

	/**
	 * 新增知识点
	 *
	 * @throws KnowledgeServiceException
	 */
	@ResponseBody
	@PostMapping("/create")
	@PreAuthorize("hasRole('MANIPULATION_KNOWLEDGE_DATA')")
	public Long actionCreate(@SessionAttribute("userid") int userid, @RequestBody KnowledgeCreate knowledge)
			throws KnowledgeServiceException {
		knowledge.setAuthorId(userid);
		Long knowledgeId = knowledgeService.createKnowledge(knowledge);
		return knowledgeId;
	}

	/**
	 * 升级知识点
	 *
	 * @throws KnowledgeServiceException
	 */
	@ResponseBody
	@PostMapping("/upgrade")
	@PreAuthorize("hasRole('MANIPULATION_KNOWLEDGE_DATA')")
	public Long actionUpgrade(@SessionAttribute("userid") int userid, @RequestBody KnowledgeUpgrade upgrade)
			throws KnowledgeServiceException {
		upgrade.setAuthorId(userid);
		Long knowledgeId = knowledgeService.upgradeKnowledge(upgrade);
		return knowledgeId;
	}

	/**
	 * 修改知识点
	 *
	 * @throws KnowledgeServiceException
	 */
	@ResponseBody
	@PutMapping("/update")
	@PreAuthorize("hasRole('MANIPULATION_KNOWLEDGE_DATA')")
	public Long actionUpdate(@RequestBody KnowledgeUpdate update) throws KnowledgeServiceException {
		log.debug("fields=[{}]", update.getFields());
		Long knowledgeId = knowledgeService.updateKnowledge(update);
		return knowledgeId;
	}

	/**
	 * 审核记录
	 *
	 * @throws KnowledgeReviewHistoryServiceException
	 */
	@ResponseBody
	@GetMapping("/reviewhistory")
	public List<KnowledgeReviewHistoryGet> actionReviewHistory(
			@RequestParam(value = "logicid", required = true) Long logicid)
					throws KnowledgeReviewHistoryServiceException {
		List<KnowledgeReviewHistoryGet> reviewHistorys = reviewHistoryService.listOfReviewHistory(logicid);
		return reviewHistorys;
	}

	/**
	 * 版本记录
	 *
	 * @throws KnowledgeServiceException
	 */
	@ResponseBody
	@GetMapping("/versionhistory")
	public List<KnowledgeRecord> actionVersionHistory(@RequestParam(value = "logicid", required = true) Long logicid)
			throws KnowledgeServiceException {
		List<KnowledgeRecord> knowledgeList = knowledgeService.listOfKnowledges(logicid);
		return knowledgeList;
	}

	/**
	 * 变更记录
	 *
	 * @throws KnowledgeModifyHistoryServiceException
	 */
	@ResponseBody
	@GetMapping(value = "/modifyhistory")
	public List<KnowledgeModifyHistoryGet> actionModifyHistory(
			@RequestParam(value = "logicid", required = true) Long logicid)
					throws KnowledgeModifyHistoryServiceException {
		List<KnowledgeModifyHistoryGet> modifyHistorys = modifyHistoryService.listOfModifyHistory(logicid);
		return modifyHistorys;
	}

	/**
	 * 还原知识点，其余版本归档
	 *
	 * @throws KnowledgeServiceException
	 */
	@ResponseBody
	@PutMapping("/revert/{knowledgeId}")
	@PreAuthorize("hasRole('MANIPULATION_KNOWLEDGE_DATA')")
	public ResponseEntity<?> actionRevert(@SessionAttribute("userid") int userid,
			@SessionAttribute(name = "appid") int appid, @PathVariable("knowledgeId") Long knowledgeId)
					throws KnowledgeServiceException {
		knowledgeService.revertKnowledge(appid, knowledgeId, userid);
		return ResponseEntity.ok().build();
	}

	/**
	 * 归档知识点，
	 *
	 * @throws KnowledgeServiceException
	 */
	@ResponseBody
	@PutMapping("/filing/{knowledgeId}")
	@PreAuthorize("hasRole('MANIPULATION_KNOWLEDGE_DATA')")
	public ResponseEntity<?> actionFiling(@SessionAttribute("userid") int userid,
			@SessionAttribute(name = "appid") int appid, @PathVariable("knowledgeId") Long knowledgeId)
					throws KnowledgeServiceException {
		knowledgeService.fillingKnowledge(appid, knowledgeId, userid);
		return ResponseEntity.ok().build();
	}

	/**
	 * 删除知识点
	 *
	 * @throws KnowledgeServiceException
	 */
	@ResponseBody
	@DeleteMapping("/delete")
	@PreAuthorize("hasRole('MANIPULATION_KNOWLEDGE_DATA')")
	public ResponseEntity<?> actionDelete(@RequestParam(value = "knowledgeId") Long knowledgeId)
			throws KnowledgeServiceException {
		knowledgeService.deleteKnowledge(knowledgeId);
		return ResponseEntity.ok().build();
	}

	/**
	 * 批量删除知识点
	 *
	 * @throws KnowledgeServiceException
	 */
	@ResponseBody
	@DeleteMapping(value = "/deletelist")
	@PreAuthorize("hasRole('MANIPULATION_KNOWLEDGE_DATA')")
	public ResponseEntity<?> actionDeleteList(
			@RequestParam(value = "knowledgeIds[]", required = true) List<Long> knowledgeIds)
					throws KnowledgeServiceException {
		knowledgeService.deleteKnowledge(knowledgeIds);
		return ResponseEntity.ok().build();
	}

}
