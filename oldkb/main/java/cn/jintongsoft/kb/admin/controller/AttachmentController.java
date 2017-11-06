package cn.jintongsoft.kb.admin.controller;

import cn.jintongsoft.kb.admin.bean.AttachMsg;
import cn.jintongsoft.kb.admin.tool.FileHeader;
import cn.jintongsoft.kb.admin.tool.OpenOfficeDocumentConverterWithFormat;
import cn.jintongsoft.kb.admin.tool.PoiTool;
import cn.jintongsoft.kb.admin.tool.Result;
import cn.jintongsoft.kb.api.AttachmentService;
import cn.jintongsoft.kb.api.db.AttachmentGet;
import cn.jintongsoft.kb.api.db.AttachmentPost;
import cn.jintongsoft.kb.api.db.AttachmentSearch;
import cn.jintongsoft.kb.api.exception.KnowledgeAttachmentServiceException;
import cn.jintongsoft.kb.api.tool.MaterialGroup;
import cn.jintongsoft.kb.api.tool.Page;
import com.alibaba.dubbo.config.annotation.Reference;
import com.artofsolving.jodconverter.DefaultDocumentFormatRegistry;
import com.artofsolving.jodconverter.DocumentFormatRegistry;
import com.artofsolving.jodconverter.openoffice.connection.OpenOfficeConnection;
import com.artofsolving.jodconverter.openoffice.connection.SocketOpenOfficeConnection;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Administrator
 */
@Controller
@RequestMapping("/api/attach")
@Slf4j
public class AttachmentController {

    private final static String DOCPATH = "/data/kbs/%s/";

    @Reference(protocol = "dubbo")
    private AttachmentService attachmentService;

    /**
     * @param type
     * @param filename
     * @param attachid
     * @return
     */
    @ResponseBody
    @GetMapping("/download")
    public ResponseEntity<?> actionDownload(@RequestParam(value = "type", required = true) int type,
                                            @RequestParam(value = "filename", required = true) String filename,
                                            @RequestParam(value = "attachid", required = true) String attachid) {
    	// 文档类型type: 1:document 2:audio 3:video 4:image
        try {

            String contentType = null;
            String filetype = getTypeStr(type);
            boolean isConvertOffice = false;
            switch (filetype) {
                case "voice":
                    contentType = "audio/mp3";
                    break;
                case "video":
                    contentType = "video/mpeg4";
                    break;
                case "image":
                    contentType = "image/png";
                    break;
                case "document":
                    contentType = "application/pdf";
                    if(filename.endsWith(".ppt") || filename.endsWith(".pptx") || filename.endsWith(".xls") || filename.endsWith(".xlsx") ||
                        filename.endsWith(".doc") || filename.endsWith(".docx") || filename.endsWith(".txt")) {
                        isConvertOffice = true;
                    }
                    break;
                default:
                    contentType = "application/octet-stream";
            }
            byte[] data = null;
            String suffix = filename.substring(filename.lastIndexOf("."));
            File sourcefile = new File(String.format(DOCPATH, filetype), attachid + suffix);
            if (!sourcefile.exists()) {
                throw new Exception("文件不存在");
            }
            if (isConvertOffice) {
                File temp = File.createTempFile("pdf" + attachid, ".pdf");
                officeToPDFOnServiceStarted(sourcefile, temp, filename);
                data = FileUtils.readFileToByteArray(temp);
                temp.deleteOnExit();
            } else {
                data = FileUtils.readFileToByteArray(sourcefile);
            }
            filename = filename + ".pdf";
            ResponseEntity<byte[]> entity = ResponseEntity.status(200).header("Content-Type", contentType).body(data);
            return entity;
        } catch (Exception e) {
            log.error("error:", e);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 1:document 2:audio 3:video 4:image
     *
     * @param request
     * @param files
     * @return
     * @throws Exception
     */
    @ResponseBody
    @PostMapping("/upload")
    public ResponseEntity<?> actionUpload(@SessionAttribute("appid") int appid,
                                          @RequestParam(value = "files") MultipartFile[] files)
        throws Exception {
        if (files == null) throw new Exception("请上传文件");
        int length = files.length;
        log.debug("length=[{}]", length);
        List<AttachMsg> filepathlist = new ArrayList<>();
        for (int i = 0; i < length; i++) {
            MultipartFile fileUpload = files[i];
            String typeStr = null;
            int type = 0;
            String filename = fileUpload.getOriginalFilename();
            String suffix = filename.substring(filename.lastIndexOf("."));
            String contentType = fileUpload.getContentType();
            log.debug("contentType=[{}]", contentType);
            byte[] data = fileUpload.getBytes();
            boolean iscorrect = true;// 文本文件是否匹配
            if (contentType.contains("video") || contentType.contains("ogg")) {
                typeStr = "video";
                type = 3;
            } else if (contentType.contains("audio")) {
                typeStr = "audio";
                type = 2;
            } else if (contentType.contains("image")) {
                typeStr = "image";
                type = 4;
            } else if (contentType.contains("pdf")) {
                typeStr = "document";
                type = 1;
                iscorrect = isCorrectFile(data, false, suffix);
            } else if (contentType.contains("msword") || contentType.contains("officedocument.wordprocessingml.document")) {
                typeStr = "document";
                type = 1;
                iscorrect = isCorrectFile(data, true, suffix);
            } else if (contentType.contains("ms-excel") || contentType.contains("xls")
                || contentType.contains("officedocument.spreadsheetml.sheet")) {
                typeStr = "document";
                type = 1;
                iscorrect = isCorrectFile(data, true, suffix);
            } else if (contentType.contains("ms-powerpoint") || contentType.contains("ppt")
                || contentType.contains("officedocument.presentationml.presentation")) {
                typeStr = "document";
                type = 1;
                iscorrect = isCorrectFile(data, true, suffix);
            } else if (contentType.contains("text/plain")) {
                typeStr = "document";
                type = 1;
            } else {
                throw new Exception("文件格式错误");
            }

            if (!iscorrect) {
                throw new Exception("文件后缀名与文件实际类型不匹配");
            }
            String mediaid =  DigestUtils.md5DigestAsHex(data);
            AttachmentPost post = new AttachmentPost();
            post.setType(type);
            post.setMediaid(mediaid);
            post.setFilesize(fileUpload.getSize());
            post.setFileext(suffix);
            post.setFilename(filename);
            post.setAppid(appid);
            post.setGroup(MaterialGroup.KNOWLEDGE);
            AttachmentGet get = attachmentService.createAttachment(post);
            String attachid = get.getMediaid();

            String path = String.format(DOCPATH, typeStr);
            String url = "docfile/download?type=" + typeStr + "&filename=" + URLEncoder.encode(filename, "UTF-8")
                + "&attachid=" + attachid;

            File file = new File(path, attachid + suffix);
            if (typeStr.equals("txt")) {
                PoiTool.copyTxtEncodeUTF8(fileUpload, file);
            } else {
                FileUtils.writeByteArrayToFile(file, data);
            }
            AttachMsg msg = new AttachMsg();
            msg.setId(get.getId());
            msg.setFilename(filename);
            msg.setUrl(url);
            msg.setContentType(contentType);
            msg.setType(get.getType());
            msg.setTypeStr(typeStr);
            msg.setSize(get.getFilesize());
            filepathlist.add(msg);
        }
        return ResponseEntity.ok().body(Result.success(filepathlist));
    }

    @ResponseBody
    @DeleteMapping("/delete")
    @PreAuthorize("hasRole('MANIPULATION_KNOWLEDGE_ATTACHMENT_DATA')")
    public ResponseEntity<?> actionDelete(HttpServletRequest request, @RequestParam(value = "ids") String ids) throws KnowledgeAttachmentServiceException {
        attachmentService.deleteByIdIn(ids);
        return ResponseEntity.ok().build();
    }


    @ResponseBody
    @DeleteMapping("/noexist/del")
    @PreAuthorize("hasRole('MANIPULATION_KNOWLEDGE_ATTACHMENT_DATA')")
    public ResponseEntity<?> actionDelete(@RequestParam(value = "id") Long id)
        throws KnowledgeAttachmentServiceException {
        attachmentService.deleteAttachment(id);
        return ResponseEntity.ok().build();
    }


    @ResponseBody
    @GetMapping("/textfile")
    public ResponseEntity<?> actionTextFile(@RequestParam(value = "type", required = true) int type,
                                            @RequestParam(value = "suffix", required = true) String suffix,
                                            @RequestParam(value = "attachid", required = true) Long attachid,
                                            @RequestParam(value = "encoding", defaultValue = "false") Boolean encoding) throws Exception {
        String typestr = getTypeStr(type);
        String contentType = "text/plain";
        File sourcefile = new File(String.format(DOCPATH, typestr), attachid + "." + suffix);
        if (!sourcefile.exists()) {
            throw new Exception("文件不存在");
        }
        byte[] data = PoiTool.getText(sourcefile, suffix, encoding);
        ResponseEntity<byte[]> entity = ResponseEntity.status(200).header("Content-Type", contentType).body(data);
        return entity;
    }

	@ResponseBody
	@GetMapping("/listfile")
	public Page<AttachmentGet> actionListFile(
			@RequestParam(value = "types", required = false) String types,
            @RequestParam(value = "filename", required = false) String filename,
            @RequestParam(value = "startDay", required = false) String startDay,
            @RequestParam(value = "endDay", required = false) String endDay,
			@RequestParam(value = "appid", required = false) Integer appid,
			@RequestParam(value = "page", defaultValue = "1") int page,
			@RequestParam(value = "size", defaultValue = "10") int size,
            @SessionAttribute("appid") int thisAppid) throws KnowledgeAttachmentServiceException {
		if (appid == null) appid = thisAppid ;
        AttachmentSearch search = new AttachmentSearch();
        search.setGroup(MaterialGroup.KNOWLEDGE);
        search.setAppid(appid);
        search.setFilename(filename);
        search.setTypes(types);
        search.setPage(page);
        search.setSize(size);
        search.setStartDay(startDay);
        search.setEndDay(endDay);
		Page<AttachmentGet> attachs = attachmentService.listOfAttachment(search);
		return attachs;
	}

    /**
     * 需要开启服务
     */
    private File officeToPDFOnServiceStarted(File inputFile, File outputFile, String inputfilename) {
        OpenOfficeConnection connection = new SocketOpenOfficeConnection(8100);
        try {
            DocumentFormatRegistry registry = new DefaultDocumentFormatRegistry();
            connection.connect();
            OpenOfficeDocumentConverterWithFormat converter = new OpenOfficeDocumentConverterWithFormat(connection,
                registry);
            converter.convertWithName(inputFile, inputfilename, outputFile, outputFile.getName());
            return outputFile;
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (connection != null) {
                    connection.disconnect();
                    connection = null;
                }
            } catch (Exception e) {
            }
        }
        return null;
    }

    /**
     * @param b        文件字节数组
     * @param isOffice 是否为office文档
     * @param suffix   上传的文件名后缀
     * @return
     */
    private boolean isCorrectFile(byte[] b, boolean isOffice, String suffix) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 16; i++) {// 取前十六位
            String hex = Integer.toHexString(b[i] & 0xFF);
            sb.append(b[i] < 16 && b[i] >= 0 ? ("0" + hex) : hex);
        }
        String filetype = sb.toString().toUpperCase();
        int len = suffix.length();// 文件名后缀长度，包括"."
        boolean result = false;
        if (isOffice) {
            if (len == 5) {// docx,xlsx,pptx office 2007
                result = filetype.startsWith(FileHeader.MSOFFICE2007);
            } else {// ppt,doc, xls office 2003
                result = filetype.startsWith(FileHeader.MSOFFICE2003);
            }
        } else {
            result = filetype.startsWith(FileHeader.PDF);
        }
        return result;
    }

    private static String getTypeStr(int type) {
        String typestr = null;
        switch (type) {
            case 4:
                typestr = "image";
                break;
            case 1:
                typestr = "document";
                break;
            case 2:
                typestr = "audio";
                break;
            case 3:
                typestr = "video";
                break;
            default:
                typestr = null;
                break;
        }
        return typestr;
    }
}
