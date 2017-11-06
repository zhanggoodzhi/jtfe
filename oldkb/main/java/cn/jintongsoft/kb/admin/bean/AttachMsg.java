package cn.jintongsoft.kb.admin.bean;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Created by Administrator on 2017/1/24.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttachMsg implements Serializable{
    @JsonSerialize(using=ToStringSerializer.class)
    private long id;
    private String url;
    private String filename;
    private String contentType;
    private int type;
    private String typeStr;
    private long size;
}
