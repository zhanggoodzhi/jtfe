package cn.jintongsoft.kb.admin.tool;

import net.sf.json.JSONArray;
import net.sf.json.JSONNull;
import net.sf.json.JsonConfig;
import net.sf.json.processors.DefaultValueProcessor;
import net.sf.json.processors.JsonValueProcessor;
import net.sf.json.util.JSONUtils;

import java.util.Arrays;

/**
 * Created by Administrator on 2017/1/25.
 */
public class JsonLongConfig extends JsonConfig{
    public JsonLongConfig(){
        super();
        this.registerJsonValueProcessor(Long.class, new JsonValueProcessor(){
            @Override
            public Object processArrayValue(Object o, JsonConfig jsonConfig) {
                if(o == null) {
                    return null;
                }else{
                    Object[] array = (Object[]) o;
                    return Arrays.toString(array);
                }
            }

            @Override
            public Object processObjectValue(String s, Object o, JsonConfig jsonConfig) {
                if(o == null) {
                    return null;
                } else {
                    if(s.endsWith("id")||s.endsWith("Id")||s.endsWith("ID")){
                        return o + "";
                    }else{
                        return o;
                    }

                }
            }
        });
        this.registerDefaultValueProcessor(Long.class, new DefaultValueProcessor(){
            @Override
            public Object getDefaultValue(Class type) {
                if( JSONUtils.isArray( type ) ){
                    return new JSONArray();
                }else if( JSONUtils.isNumber( type ) ){
                    if( JSONUtils.isDouble( type ) ){
                        return null;
                    }else{
                        return null;
                    }
                }else if( JSONUtils.isBoolean( type ) ){
                    return Boolean.FALSE;
                }else if( JSONUtils.isString( type ) ){
                    return "";
                }
                return JSONNull.getInstance();
            }
        });
    }
}
