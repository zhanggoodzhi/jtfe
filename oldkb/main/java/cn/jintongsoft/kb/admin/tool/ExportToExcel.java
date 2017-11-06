package cn.jintongsoft.kb.admin.tool;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;

import cn.jintongsoft.kb.api.db.DirectoryHeatStatistics;
import cn.jintongsoft.kb.api.db.KnowledgeHeatStatistics;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFClientAnchor;
import org.apache.poi.hssf.usermodel.HSSFComment;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFPatriarch;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Drawing;
import org.apache.poi.ss.usermodel.Picture;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.util.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;



public class ExportToExcel {
	private static  Logger logger = LoggerFactory.getLogger(ExportToExcel.class);

//	public HSSFWorkbook exportOrderExcel(List<Order> list, List<OrderComplainSimpleDTO> complains) {
//		Map<String, Integer> ordermap = new HashMap<>(list.size());
//		for (OrderComplainSimpleDTO dto : complains) {
//			ordermap.put(dto.getOrderid().toString(), dto.getComplainStatus());
//		}
//		HSSFWorkbook workbook = new HSSFWorkbook();
//		// 获取参数个数作为excel列数
//		int columeCount = 8;
//		// 获取List size作为excel行数
//		// int rowCount = list.size();
//		HSSFSheet sheet = workbook.createSheet("orderInfo");
//		HSSFRow headRow = sheet.createRow(0);
//		String[] titleArray = { "id", "化身", "玩家", "时长", "金额", "下单时间", "状态", "投诉情况" };
//		for (int m = 0; m <= columeCount - 1; m++) {
//			HSSFCell cell = headRow.createCell(m);
//			cell.setCellType(HSSFCell.CELL_TYPE_STRING);
//			sheet.setColumnWidth(m, 6000);
//			HSSFCellStyle style = workbook.createCellStyle();
//			HSSFFont font = workbook.createFont();
//			font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
//			short color = HSSFColor.RED.index;
//			font.setColor(color);
//			style.setFont(font);
//			// 填写数据
//			cell.setCellStyle(style);
//			cell.setCellValue(titleArray[m]);
//
//		}
//		int index = 0;
//		// 写入数据
//		for (Order entity : list) {
//			// logger.info("写入一行");
//			HSSFRow row = sheet.createRow(index + 1);
//			for (int n = 0; n <= columeCount - 1; n++)
//				row.createCell(n);
//			row.getCell(0).setCellValue(entity.getId());
//			row.getCell(1).setCellValue(entity.getAvatarUserRegister().getName());
//			row.getCell(2).setCellValue(entity.getPlayerUserRegister().getName());
//			row.getCell(3).setCellValue(entity.getMinutes());
//			row.getCell(4).setCellValue(entity.getQuantity());
//			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//			row.getCell(5).setCellValue(formatter.format(entity.getCreateTime()));
//			row.getCell(6).setCellValue(entity.getStatusName());
//
//			Integer status = ordermap.get(entity.getId().toString());
//			if (status == null)
//				row.getCell(7).setCellValue("无");
//			else
//				row.getCell(7).setCellValue(LookupHelper.item("order_complain_status", status));
//			index++;
//		}
//		return workbook;
//	}o

    public Workbook exportKnowledgeHotExcel(String title, List<KnowledgeHeatStatistics> dataset) {
        String headers[] = { "排名", "知识点", "热度"};
        Workbook workbook = new HSSFWorkbook();
		HSSFSheet sheet = this.setExcel(workbook, headers, title);
        for (int i = 0; i < dataset.size(); i++) {
            // 创建一行
            HSSFRow row = sheet.createRow(i + 1);
            // 得到要插入的每一条记录
            KnowledgeHeatStatistics heatStatistics = dataset.get(i);

            HSSFCell index = row.createCell(0);
            index.setCellValue(heatStatistics.getIndex());
            HSSFCell knowledgeName = row.createCell(1);
            knowledgeName.setCellValue(heatStatistics.getKnowledgeName());
            HSSFCell heat = row.createCell(2);
            heat.setCellValue(heatStatistics.getHeat());
        }
        return workbook;
    }

    public Workbook exportDirectoryHotExcel(String title, List<DirectoryHeatStatistics> dataset) {
        String headers[] = { "排名", "知识点", "热度"};
        Workbook workbook = new HSSFWorkbook();
        HSSFSheet sheet = this.setExcel(workbook, headers, title);
        for (int i = 0; i < dataset.size(); i++) {
            // 创建一行
            HSSFRow row = sheet.createRow(i + 1);
            // 得到要插入的每一条记录
            DirectoryHeatStatistics heatStatistics = dataset.get(i);

            HSSFCell index = row.createCell(0);
            index.setCellValue(heatStatistics.getIndex());
            HSSFCell directoryName = row.createCell(1);
            directoryName.setCellValue(heatStatistics.getDirectoryName());
            HSSFCell count = row.createCell(2);
            count.setCellValue(heatStatistics.getCount());
        }
        return workbook;
    }


//
//	public Workbook exportAvatarExcel(String title, List<AvatarVO> dataset, boolean isURL) {
//		String headers[] = { "ID", "头像", "角色昵称", "性别", "角色类别", "创建时间", "状态", "创建者" };
//		Workbook workbook = new HSSFWorkbook();
//		HSSFSheet sheet = this.setExcel2(workbook, headers, title);
//		HSSFCellStyle dateStyle = createCellDateStyle(workbook);
//		HSSFPatriarch patriarch = sheet.createDrawingPatriarch();
//		for (int i = 0; i < dataset.size(); i++) {
//			// 创建一行
//			HSSFRow row = sheet.createRow(i + 1);
//			// 得到要插入的每一条记录
//			row.setHeight((short) 1500);
//			AvatarVO data = dataset.get(i);
//
//			HSSFCell aid = row.createCell(0);
//			aid.setCellValue(data.getId());
//
//			HSSFCell headUrl = row.createCell(1);
//			headUrl.setCellValue(data.getHeadIconUrl());
//			HSSFClientAnchor anchor = new HSSFClientAnchor(0, 0, 0, 0, (short) 1, i+1, (short) 2, i+2);
//			byte[] bytes = getImage(data.getHeadIcon(), isURL);
//			patriarch.createPicture(anchor, workbook.addPicture(bytes, HSSFWorkbook.PICTURE_TYPE_PNG));
//
//			HSSFCell name = row.createCell(2);
//			name.setCellValue(data.getName());
//
//			HSSFCell gendarName = row.createCell(3);
//			gendarName.setCellValue(data.getPrototype().getGenderName());
//
//			HSSFCell prototypeName = row.createCell(4);
//			prototypeName.setCellValue(data.getPrototype().getName());
//
//			HSSFCell createtime = row.createCell(5);
//			createtime.setCellValue(data.getCreateTime());
//			createtime.setCellStyle(dateStyle);
//
//			HSSFCell onlineName = row.createCell(6);
//			onlineName.setCellValue(data.getOnlineName());
//
//			HSSFCell actorname = row.createCell(7);
//			actorname.setCellValue(data.getActor().getName());
//
//		}
//		return workbook;
//	}

	// 日期样式
	private HSSFCellStyle createCellDateStyle(Workbook workbook) {
		// 生成一个样式
		HSSFCellStyle style = (HSSFCellStyle) workbook.createCellStyle();
		HSSFDataFormat format = (HSSFDataFormat) workbook.createDataFormat();
		style.setDataFormat(format.getFormat("yyyy/m/d"));
		return style;
	}


	/*private byte[] getImage(String head, boolean isURL) {
		String headpath = Constant.Path.PARENT_PORTRAIT;
		String headIconDefault = Constant.DEFAULT_NAME;
		InputStream is = null;
		byte[] bytes = null;
		try {
			if(isURL){
				URL url = new URL(AppConfig.head(head));
				URLConnection con = url.openConnection();
				is = con.getInputStream();
				bytes = IOUtils.toByteArray(is);
			}else{
				 is = new FileInputStream(new File(headpath,head + ".jpg"));
				 bytes = IOUtils.toByteArray(is);
			}
		} catch (Exception e) {
			logger.debug("图片获取失败[{}]", e);
			try {
				is = new FileInputStream(new File(headpath, headIconDefault + ".jpg"));
				bytes = IOUtils.toByteArray(is);
			} catch (Exception e2) {
				logger.error("图片获取失败", e2);
			}

		}finally {
			if(is != null){
				try {
					is.close();
				} catch (IOException e) {
					logger.error("IOException:", e);
				}
			}
		}*/

		/*
		byte[] bs = new byte[1024];
		int len;
		OutputStream os = new FileOutputStream(new File("/", filename));
		while ((len = is.read(bs)) != -1) {
			os.write(bs, 0, len);
		}
		os.close();*/

		//return bytes;
	//}



	private HSSFSheet setExcel2(Workbook workbook, String[] headers, String title) {

		// 生成一个表格
		HSSFSheet sheet = (HSSFSheet) workbook.createSheet(title);
		sheet.setHorizontallyCenter(true);//设置打印页面为水平居中
        sheet.setVerticallyCenter(true);//设置打印页面为垂直居中
		// 设置表格默认列宽度为15个字节
		sheet.setDefaultColumnWidth(15);
		// 设置注释内容
		int CountColumnNum = headers.length;
		HSSFRow firstrow = sheet.createRow(0); // 下标为0的行开始
		HSSFCell[] firstcell = new HSSFCell[headers.length];
		for (int j = 0; j < CountColumnNum; j++) {
			firstcell[j] = firstrow.createCell(j);
			firstcell[j].setCellValue(new HSSFRichTextString(headers[j]));
			// 需要保证该位置数据为日期
			// if(j == 5) firstcell[j].setCellStyle(style);
		}
		return sheet;
	}

	private HSSFSheet setExcel(Workbook workbook, String[] headers, String title) {

		// 生成一个样式
		HSSFCellStyle style = (HSSFCellStyle) workbook.createCellStyle();
		// 设置这些样式
		style.setFillForegroundColor(HSSFColor.WHITE.index);
		style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
		style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
		style.setBorderRight(HSSFCellStyle.BORDER_THIN);
		style.setBorderTop(HSSFCellStyle.BORDER_THIN);
		style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		// 生成一个字体
		HSSFFont font = (HSSFFont) workbook.createFont();
		// font.setColor(HSSFColor.VIOLET.index);
		font.setFontHeightInPoints((short) 10);
		// font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
		// 把字体应用到当前的样式
		style.setFont(font);
		// 生成并设置另一个样式
		/*
		 * HSSFCellStyle style2 = (HSSFCellStyle) workbook.createCellStyle();
		 * style2.setFillForegroundColor(HSSFColor.LIGHT_YELLOW.index);
		 * style2.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
		 * style2.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		 * style2.setBorderLeft(HSSFCellStyle.BORDER_THIN);
		 * style2.setBorderRight(HSSFCellStyle.BORDER_THIN);
		 * style2.setBorderTop(HSSFCellStyle.BORDER_THIN);
		 * style2.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		 * style2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER); //
		 * 生成另一个字体 HSSFFont font2 = (HSSFFont) workbook.createFont();
		 * font2.setBoldweight(HSSFFont.BOLDWEIGHT_NORMAL); // 把字体应用到当前的样式
		 * style2.setFont(font2);
		 */
		// 生成一个表格
		HSSFSheet sheet = (HSSFSheet) workbook.createSheet(title);
		// 设置表格默认列宽度为15个字节
		sheet.setDefaultColumnWidth(15);
		// 声明一个画图的顶级管理器
		HSSFPatriarch patriarch = sheet.createDrawingPatriarch();
		// 定义注释的大小和位置,详见文档
		@SuppressWarnings("unused")
		HSSFComment comment = patriarch.createComment(new HSSFClientAnchor(0, 0, 0, 0, (short) 4, 2, (short) 6, 5));
		HSSFDataFormat format = (HSSFDataFormat) workbook.createDataFormat();
		style.setDataFormat(format.getFormat("yyyy/m/d"));

		// 设置注释内容
		int CountColumnNum = headers.length;
		HSSFRow firstrow = sheet.createRow(0); // 下标为0的行开始
		HSSFCell[] firstcell = new HSSFCell[headers.length];
		for (int j = 0; j < CountColumnNum; j++) {
			firstcell[j] = firstrow.createCell(j);
			firstcell[j].setCellValue(new HSSFRichTextString(headers[j]));
		}
		return sheet;
	}


	// 图片
	@SuppressWarnings("unused")
	private void test(Workbook workbook, HSSFSheet sheet, String path) throws IOException {

		ByteArrayOutputStream byteArrayOut = new ByteArrayOutputStream();
		BufferedImage bufferImg = ImageIO.read(new File(path));
		ImageIO.write(bufferImg, "png", byteArrayOut);
		// 生成一个样式
		HSSFPatriarch patriarch = sheet.createDrawingPatriarch();
		HSSFClientAnchor anchor = new HSSFClientAnchor(0, 150, 1000, 210, (short) 0, 0, (short) 1, 1);
		patriarch.createPicture(anchor, workbook.addPicture(byteArrayOut.toByteArray(), HSSFWorkbook.PICTURE_TYPE_PNG));
	}

	@SuppressWarnings("unused")
	private void test(Workbook wb) throws IOException{
		//create a new workbook
	   // Workbook wb = new XSSFWorkbook(); //or new HSSFWorkbook();

	    //add picture data to this workbook.
	    InputStream is = new FileInputStream("image1.jpeg");
	    byte[] bytes = IOUtils.toByteArray(is);
	    int pictureIdx = wb.addPicture(bytes, Workbook.PICTURE_TYPE_JPEG);
	    is.close();

	    CreationHelper helper = wb.getCreationHelper();

	    //create sheet
	    Sheet sheet = wb.createSheet();

	    // Create the drawing patriarch.  This is the top level container for all shapes.
	    Drawing drawing = sheet.createDrawingPatriarch();

	    //add a picture shape
	    ClientAnchor anchor = helper.createClientAnchor();
	    //set top-left corner of the picture,
	    //subsequent call of Picture#resize() will operate relative to it
	    anchor.setCol1(3);
	    anchor.setRow1(2);
	    Picture pict = drawing.createPicture(anchor, pictureIdx);

	    //auto-size picture relative to its top-left corner
	    pict.resize();

	}
}
