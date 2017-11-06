package cn.jintongsoft.kb.admin.tool;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Created by Liu on 2017/2/4.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Result implements Serializable {
    private static final long serialVersionUID = 1L;
    private boolean success;
    private String error;
    private String message;

    private Object data;

    public static Result success(Object data){
        return new Result(true, null,null, data);
    }

    public static Result success(){
        return new Result(true, null, null, null);
    }

    public static Result error(){
        return new Result(false, "系统错误","系统错误",null);
    }

    public static Result error(String error){
        return new Result(false, error, error,null);
    }

    public static Result error(String error, String message){
        return new Result(false, error, message,null);
    }

}
