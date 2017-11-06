package cn.jintongsoft.kb.admin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.LinkedHashMap;

@SpringBootApplication
@ServletComponentScan
@EnableScheduling
public class KbAdminApp {

    public static final LinkedHashMap<Integer,String> applist=new LinkedHashMap<>();

    public static void main(String[] args) {
        applist.put(242,"央视测试");
        applist.put(303,"金童证券");
        applist.put(304,"金童银行");
        SpringApplication.run(KbAdminApp.class, args);
    }
}
