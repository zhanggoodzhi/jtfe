package cn.jintongsoft.kb.admin.controller;

import cn.jintongsoft.kb.admin.JinTongResult;
import cn.jintongsoft.kb.admin.tool.RegularExpressionsTool;
import cn.jintongsoft.kb.admin.tool.Result;
import cn.jintongsoft.kb.api.CloudResourceService;
import cn.jintongsoft.kb.api.ResourceService;
import cn.jintongsoft.kb.api.db.*;
import cn.jintongsoft.kb.api.tool.Page;
import com.alibaba.dubbo.config.annotation.Reference;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;

/**
 * Created by Liu on 2017/3/6.
 */
@Controller
@RequestMapping("/resource")
@Slf4j
public class ResourceController {

	@Reference(protocol = "dubbo")
	private ResourceService resourceService;

	@Reference(protocol = "dubbo")
	private CloudResourceService cloudResourceService;

	/**
	 * 资源主页
	 *
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/index")
	public String actionIndex() throws Exception {
		return "resource/index/index";
	}

	/**
	 * 资源列表
	 *
	 * @param search
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@GetMapping("/list")
	public Page<ResourceGet> actionList(@SessionAttribute("appid") int appid, ResourceSearch search) throws Exception {
		// search.setCreatorId(userid);
		Page<ResourceGet> page = cloudResourceService.listOfResource(search, appid);
		return page;
	}

	/**
	 * 素材详细信息
	 *
	 * @param materialId
	 * @param type
	 * @param appid
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@GetMapping("/detail")
	public MaterialGet actionDetail(@SessionAttribute("appid") int appid,
			@RequestParam(value = "materialId") Long materialId, @RequestParam(value = "type") String type)
					throws Exception {
		MaterialGet get = cloudResourceService.getResource(appid, materialId, type);
		return get;
	}

	/**
	 * 创建素材
	 *
	 * @param post
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@PostMapping("/create")
	@PreAuthorize("hasRole('MANIPULATION_MATERIAL_DATA')")
	public JinTongResult actionCreate(@SessionAttribute("appid") int appid, @SessionAttribute("userid") int userid,
			@RequestBody MaterialPost post) throws Exception {
		try {
			if (post.getNonShared() != null) {
				if (post.getNonShared().getLinkUrl() != null) {
					String url = post.getNonShared().getLinkUrl();
					if (!RegularExpressionsTool.validataUrl(url)) {
						return JinTongResult.fail("链接格式不合法！");
					}
				}
			}

			post.setCreatorId(userid);
			ResourceGet get = resourceService.createMaterial(post, appid);
			return JinTongResult.build(1,"操作成功",get);
		} catch (Exception e) {
			log.error("异常：", e);
			return JinTongResult.fail("操作失败");
		}
	}

	/**
	 * 更新素材
	 *
	 * @param put
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@PutMapping("/update")
	@PreAuthorize("hasRole('MANIPULATION_MATERIAL_DATA')")
	public JinTongResult actionUpdate(@RequestBody MaterialPut put) throws Exception {
		ResourceGet get = null;
		try {
			if (put.getNonShared() != null) {
				if (put.getNonShared().getLinkUrl() != null) {
					if (!RegularExpressionsTool.validataUrl(put.getNonShared().getLinkUrl())) {
						return JinTongResult.fail("链接格式不合法！");
					}
				}
			}
			get = resourceService.updateMaterial(put);
            return JinTongResult.build(1,"操作成功",get);
		} catch (Exception e) {
			log.error("异常：", e);
			return JinTongResult.fail("操作失败");
		}
	}

	/**
	 * 删除素材
	 *
	 * @param materialId
	 * @param type
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@DeleteMapping("/delete")
	@PreAuthorize("hasRole('MANIPULATION_MATERIAL_DATA')")
	public ResponseEntity<?> actionDelete(@SessionAttribute("appid") int appid,
			@RequestParam(value = "materialId") Long materialId, @RequestParam(value = "type") String type)
					throws Exception {
		resourceService.deleteMaterial(appid, materialId, type);
		return ResponseEntity.ok().build();
	}

	@RequestMapping("/test/index")
	@PreAuthorize("hasRole('MANIPULATION_MATERIAL_DATA')")
	public String actionTest() throws Exception {
		return "resource/test/index";
	}

	/**
	 * 删除文件
	 *
	 * @param mediaId
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@DeleteMapping("/file/delete")
	@PreAuthorize("hasRole('MANIPULATION_MATERIAL_DATA')")
	public ResponseEntity<?> actionDelete(@RequestParam(value = "mediaId") String mediaId) throws Exception {
		resourceService.deleteFile(mediaId);
		return ResponseEntity.ok().build();
	}

	/**
	 * 批量删除文件
	 *
	 * @param mediaIds
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@DeleteMapping("/file/deleteMore")
	@PreAuthorize("hasRole('MANIPULATION_MATERIAL_DATA')")
	public ResponseEntity<?> actionDeleteMore(@RequestParam(value = "mediaIds") String[] mediaIds) throws Exception {

		for (String mediaId : Arrays.asList(mediaIds)) {
			resourceService.deleteFile(mediaId);
		}
		return ResponseEntity.ok().build();
	}

	/**
	 * 上传文件
	 *
	 * @param file
	 * @param type
	 *            只需要图片音视频的判断 text : 文本 image : 图片 voice : 音频（语音） video : 视频
	 *            music : 音乐 news : 图文 link : 链接
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@PostMapping("/file/upload")
	@PreAuthorize("hasRole('MANIPULATION_MATERIAL_DATA')")
	public ResponseEntity<?> actionUpload(@SessionAttribute("appid") int appid,
			@RequestParam(value = "file") MultipartFile file, @RequestParam(value = "type") String type)
					throws Exception {
		if (file == null)
			throw new Exception("请上传文件");
		String contentType = file.getContentType();
		if (contentType.contains("video") || contentType.contains("ogg")) {
			if (!type.equals("video"))
				throw new Exception("请上传视频文件");
		} else if (contentType.contains("audio")) {
			if (!type.equals("voice") && !type.equals("music"))
				throw new Exception("请上传音频文件");
		} else if (contentType.contains("image")) {
			if (!type.equals("image") && !type.equals("link") && !type.equals("news"))
				throw new Exception("请上传图片文件");
		} else {
			throw new Exception("请上传音视频或图片文件");
		}
		String filename = file.getOriginalFilename();
		byte[] data = file.getBytes();
		System.out.print(data.length);
		FileReference reference = resourceService.uploadFile(data, filename, type, appid);
		return ResponseEntity.ok().body(Result.success(reference));
	}
}
