package cn.jintongsoft.kb.admin.tool;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.charset.Charset;

import org.apache.commons.io.FileUtils;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.hslf.extractor.PowerPointExtractor;
import org.apache.poi.hslf.usermodel.HSLFSlideShowImpl;
import org.apache.poi.hssf.extractor.ExcelExtractor;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.extractor.WordExtractor;
import org.apache.poi.xslf.extractor.XSLFPowerPointExtractor;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xssf.extractor.XSSFExcelExtractor;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.web.multipart.MultipartFile;

import com.sun.star.uno.Exception;

/*import info.monitorenter.cpdetector.io.CodepageDetectorProxy;
import info.monitorenter.cpdetector.io.JChardetFacade;
import info.monitorenter.cpdetector.io.ParsingDetector;*/

public class PoiTool {
	public static byte[] getText(File sourcefile, String suffix, boolean encoding) throws Exception, IOException{
		if(sourcefile == null) throw new Exception("File对象不能为空");
		if(sourcefile.isDirectory()) throw new Exception("File对象不能为路径");
		switch(suffix){
		case "txt":
			return analyzeTxt(sourcefile, encoding);
		case "pdf":
			return analyzePDF(sourcefile);
		case "docx":
			return analyzeDocx(sourcefile);
		case "doc":
			return analyzeDoc(sourcefile);
		case "xlsx":
			return analyzeXlsx(sourcefile);
		case "xls":
			return analyzeXls(sourcefile);
		case "pptx":
			return analyzePptx(sourcefile);
		case "ppt":
			return analyzePpt(sourcefile);
		default:
			throw new Exception("不在解析范围内的文件格式");
		}
	}
	
	private static byte[] analyzeTxt(File sourcefile, boolean encoding) throws IOException{
		byte[] data = null;
		BufferedReader reader = null;
		try {
			StringBuilder source = new StringBuilder("");
			String line ="";
			Charset result = null;
			if(encoding){
				//进行字符编码判断
				result = getFileEncode(sourcefile);
			}
			if(result == null) result = Charset.forName("UTF-8");
			reader = new BufferedReader(new InputStreamReader(new FileInputStream(sourcefile), result));
			while((line = reader.readLine()) != null) {
				source.append(line);
			}
			data = FileUtils.readFileToByteArray(sourcefile);
			data =  source.toString().getBytes("utf-8");
		} catch (IOException e) {
			throw e;
		}finally {
			if (reader != null) reader.close();
		}
		return data;
	}
	
	private static byte[] analyzePDF(File sourcefile) throws IOException{
		byte[] data = null;
		PDDocument pdfdoc = null;
		try {
			pdfdoc = PDDocument.load(sourcefile);
			PDFTextStripper stripper = new PDFTextStripper();
			data = stripper.getText(pdfdoc).getBytes("utf-8");
		} catch (IOException e) {
			throw e;
		}finally {
			if (pdfdoc != null) pdfdoc.close();
		}
		return data;
	}
	
	private static byte[] analyzeDocx(File sourcefile) throws IOException{
		byte[] data = null;
		XWPFWordExtractor extractor = null;
		try {
			extractor = new XWPFWordExtractor(new XWPFDocument(new FileInputStream(sourcefile)));
			data = extractor.getText().getBytes("utf-8");
		} catch (IOException e) {
			throw e;
		}finally {
			if(extractor != null) extractor.close();
		}
		return data;
	}
	
	private static byte[] analyzeDoc(File sourcefile) throws IOException{
		byte[] data = null;
		WordExtractor extractor = null;
		try {
			extractor = new WordExtractor(new HWPFDocument(new FileInputStream(sourcefile)));
			data = extractor.getText().getBytes("utf-8");
		} catch(IOException e){
			throw e;
		}finally {
			if(extractor != null) extractor.close();
		}
		return data;
	}
	
	private static byte[] analyzeXlsx(File sourcefile) throws IOException{
		byte[] data = null;
		XSSFExcelExtractor extractor = null;
		try {
			extractor = new XSSFExcelExtractor(new XSSFWorkbook(new FileInputStream(sourcefile)));
			data = extractor.getText().getBytes("utf-8");
		} catch(IOException e){
			throw e;
		}finally {
			if(extractor != null) extractor.close();
		}
		return data;
	}

	private static byte[] analyzeXls(File sourcefile) throws IOException{
		byte[] data = null;
		ExcelExtractor extractor = null;
		try {
			extractor = new ExcelExtractor(new HSSFWorkbook(new FileInputStream(sourcefile)));
			data = extractor.getText().getBytes("utf-8");
		} catch(IOException e){
			throw e;
		}finally {
			if(extractor != null) extractor.close();
		}
		return data;
	}
	
	private static byte[] analyzePptx(File sourcefile) throws IOException{
		byte[] data = null;
		XSLFPowerPointExtractor extractor = null;
		try {
			extractor = new XSLFPowerPointExtractor(new XMLSlideShow(new FileInputStream(sourcefile)));
			data = extractor.getText().getBytes("utf-8");
		} catch(IOException e){
			throw e;
		}finally {
			if(extractor != null) extractor.close();
		}
		return data;
	}
	
	private static byte[] analyzePpt(File sourcefile) throws IOException{
		byte[] data = null;
		PowerPointExtractor extractor = null;
		try {
			extractor = new PowerPointExtractor(new HSLFSlideShowImpl(new FileInputStream(sourcefile)));
			data = extractor.getText().getBytes("utf-8");
		} catch(IOException e){
			throw e;
		}finally {
			if(extractor != null) extractor.close();
		}
		return data;
	}
	
	
	public static void copyTxtEncodeUTF8(MultipartFile fileUpload, File file) throws IOException{
		InputStream input = fileUpload.getInputStream();
		BufferedInputStream in = new BufferedInputStream(input);
		Charset result = getFileEncode(in);
		if(result != null){
			StringBuilder sb = new StringBuilder("");
			String line ="";
			BufferedReader reader = new BufferedReader(new InputStreamReader(in, result));
			BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file), "utf-8"));
			while((line = reader.readLine()) != null) {
				sb.append(line);
			}
			writer.write(sb.toString());
			reader.close();
			writer.flush();
			writer.close();
		}else{
			FileUtils.writeByteArrayToFile(file, fileUpload.getBytes());
		}
		in.close();
	}
	
	private static Charset getFileEncode(InputStream in) throws IllegalArgumentException, IOException {
		return Charset.defaultCharset();
		//return getDetector().detectCodepage(in, in.available());
	}
	
	private static Charset getFileEncode(File file) throws IllegalArgumentException, IOException {
		return Charset.defaultCharset();
		//return getDetector().detectCodepage(file.toURI().toURL());
	}
	
	/*private static CodepageDetectorProxy getDetector(){

		
		 * detector是探测器，它把探测任务交给具体的探测实现类的实例完成。
		 * cpDetector内置了一些常用的探测实现类，这些探测实现类的实例可以通过add方法 加进来，如ParsingDetector、
		 * JChardetFacade、ASCIIDetector、UnicodeDetector。
		 * detector按照“谁最先返回非空的探测结果，就以该结果为准”的原则返回探测到的
		 * 字符集编码。使用需要用到三个第三方JAR包：antlr.jar、chardet.jar和cpdetector.jar
		 * cpDetector是基于统计学原理的，不保证完全正确。
		 
		CodepageDetectorProxy detector = CodepageDetectorProxy.getInstance();
		
		 * ParsingDetector可用于检查HTML、XML等文件或字符流的编码,构造方法中的参数用于
		 * 指示是否显示探测过程的详细信息，为false不显示。
		 
		detector.add(new ParsingDetector(false));
		
		 * JChardetFacade封装了由Mozilla组织提供的JChardet，它可以完成大多数文件的编码
		 * 测定。所以，一般有了这个探测器就可满足大多数项目的要求，如果你还不放心，可以
		 * 再多加几个探测器，比如下面的ASCIIDetector、UnicodeDetector等。
		 
		detector.add(JChardetFacade.getInstance());// 用到antlr.jar、chardet.jar
		// ASCIIDetector用于ASCII编码测定
		//detector.add(ASCIIDetector.getInstance());
		// UnicodeDetector用于Unicode家族编码的测定
		//detector.add(UnicodeDetector.getInstance());
		return detector;
	}*/
}
