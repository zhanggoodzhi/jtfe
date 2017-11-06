package cn.jintongsoft.kb.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.alibaba.dubbo.config.annotation.Reference;

import cn.jintongsoft.kb.api.KnowledgeService;
import cn.jintongsoft.kb.api.KnowledgeTemplateService;
import cn.jintongsoft.kb.api.db.KnowledgeGet;
import cn.jintongsoft.kb.api.db.KnowledgePost;
import cn.jintongsoft.kb.api.db.KnowledgePut;
import cn.jintongsoft.kb.api.exception.KnowledgeServiceException;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/knowtest")
@Slf4j
public class KnowledgeTestController {
	@Reference
	private KnowledgeService knowledgeService;

	@Reference
	private KnowledgeTemplateService knowledgeTemplateService;

	@RequestMapping("/index")
	public String actionIndex(@SessionAttribute("appid") int appid, ModelMap model) throws KnowledgeServiceException {
		model.addAttribute("list", knowledgeService.listOfKnowledges(appid));
		return "knowtest/index/index";
	}

	@RequestMapping("/detail")
	public String actionDetail( ModelMap model, Long knowledgeId) throws KnowledgeServiceException {
		log.debug("knowledgeId=[{}]", knowledgeId);
		model.addAttribute("knowledge", knowledgeService.getKnowledge(knowledgeId));
		return "knowtest/detail/index";
	}

	@RequestMapping("/edit")
	public String actionEdit(ModelMap model, Long knowledgeId) throws KnowledgeServiceException {
		model.addAttribute("knowledge", knowledgeService.getKnowledge(knowledgeId));
		return "knowtest/edit/index";
	}

	@RequestMapping("/add")
	public String actionAdd(ModelMap model, Long knowledgeTemplateId) {
		model.addAttribute("knowledgeTemplate", knowledgeTemplateService.getKnowledgeTemplate(knowledgeTemplateId));
		return "knowtest/add/index";
	}

	@PostMapping(value = "/create", produces = "application/json; charset=UTF-8")
	@ResponseBody
	public KnowledgeGet create(@RequestBody KnowledgePost data) throws KnowledgeServiceException {
		KnowledgeGet knowledgeGet = knowledgeService.createKnowledge(data);
		log.debug("knowledgeGet=[{}]", knowledgeGet);
		return knowledgeGet;
	}

	@PutMapping("/update")
	public ResponseEntity<Void> update(@RequestBody KnowledgePut data) throws KnowledgeServiceException {
		knowledgeService.updateKnowledge(data);
		return ResponseEntity.ok().build();
	}

	@DeleteMapping("/delete/{knowledgeId}")
    @PreAuthorize("hasRole('MANIPULATION_KNOWLEDGE_DATA')")
	public ResponseEntity<Void> delete(@PathVariable("knowledgeId") Long knowledgeId) throws KnowledgeServiceException {
		knowledgeService.deleteKnowledge(knowledgeId);
		return ResponseEntity.ok().build();
	}
}
