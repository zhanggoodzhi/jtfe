//
///**
// * Created by Liu on 2017/4/24.
// */
//
//import cn.jintongsoft.kb.api.AttachmentService;
//import cn.jintongsoft.kb.api.db.AttachmentGet;
//import com.alibaba.dubbo.config.ApplicationConfig;
//import com.alibaba.dubbo.config.ReferenceConfig;
//import com.alibaba.dubbo.config.RegistryConfig;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.apache.commons.io.FileUtils;
//
//import java.io.File;
//import java.util.List;
//
////@SpringBootTest
////@RunWith(SpringRunner.class)
////@ContextConfiguration(classes = KbAdminApp.class)
////@AutoConfigureMockMvc
//public class AttachmentServiceTest {
//
//	private AttachmentService getService() {
//		ApplicationConfig application = new ApplicationConfig();
//		application.setName("kb-db");
//
//		RegistryConfig registry = new RegistryConfig();
//		registry.setAddress("localhost:2181");
//
//		ReferenceConfig<AttachmentService> reference = new ReferenceConfig<>();
//		reference.setApplication(application);
//		reference.setRegistry(registry); // 多个注册中心可以用setRegistries()
//		reference.setInterface(AttachmentService.class);
//
//		AttachmentService attachmentService = reference.get(); // 注意：此代理对象内部封装了所有通讯细节，对象较重，请缓存复用
//		return attachmentService;
//	}
//
//	// @Test
//	public void uploadFile() {
//		File file = new File("/data/testfile/sql.txt");
//		try {
//			AttachmentGet get = getService().upload(file, "text/plain", "");
//			ObjectMapper mapper = new ObjectMapper();
//			String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(get);
//			System.out.println("get=" + json);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}
//
//	// @Test
//	public void updateFile() {
//		File file = new File("/data/testfile/sql2.txt");
//		try {
//			AttachmentGet get = getService().update(file, 6262446818039169024L, "");
//			ObjectMapper mapper = new ObjectMapper();
//			String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(get);
//			System.out.println("get=" + json);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}
//
//	// @Test
//	public void getFile() {
//		try {
//			File source = getService().getFile(6262446818039169024L);
//			String str = FileUtils.readFileToString(source, "utf-8");
//			System.out.println("get=" + str);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}
//
//	// @Test
//	public void getList() {
//		try {
//			List<AttachmentGet> gets = getService().list("6262264904095367168,6262260912619520000,6262232004427776000");
//			ObjectMapper mapper = new ObjectMapper();
//			String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(gets);
//			System.out.println("get=" + json);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}
//
//	// @Test
//	public void delete() {
//		try {
//			Long[] inlist = new Long[] { 6262463889330405376L };
//			getService().deleteByIdIn("6262463889330405376");
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}
//
//}
