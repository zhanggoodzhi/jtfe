package cn.jintongsoft.kb.admin;

import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * 自定义响应结构
 */
public class JinTongResult {

	private static final String SUCCESS_MSG = "请求成功";
	private static final String FAIL_MSG = "请求失败";
	
	// 定义jackson对象
	private static final ObjectMapper MAPPER = new ObjectMapper();

	// 响应业务状态
	private Integer status;

	// 响应消息
	private String msg;

	// 响应中的数据
	private Object data;

	public static JinTongResult build(Integer status, String msg, Object data) {
		return new JinTongResult(status, msg, data);
	}

	public static JinTongResult success(Object data) {
		return new JinTongResult(data);
	}

	public static JinTongResult success() {
		return JinTongResult.build(1, SUCCESS_MSG);
	}

	public static JinTongResult success(String msg) {
		return JinTongResult.build(1, msg);
	}

	public static JinTongResult fail(String msg) {
		return JinTongResult.build(-1, msg);
	}
	
	public static JinTongResult fail() {
		return JinTongResult.build(-1, FAIL_MSG);
	}

	public JinTongResult() {

	}

	public static JinTongResult build(Integer status, String msg) {
		return new JinTongResult(status, msg, null);
	}

	public JinTongResult(Integer status, String msg, Object data) {
		this.status = status;
		this.msg = msg;
		this.data = data;
	}

	public JinTongResult(Object data) {
		this.status = 1;
		this.msg = "success";
		this.data = data;
	}

	// public Boolean isOK() {
	// return this.status == 200;
	// }

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

	/**
	 * 将json结果集转化为JinTongResult对象
	 * 
	 * @param jsonData
	 *            json数据
	 * @param clazz
	 *            JinTongResult中的object类型
	 * @return
	 */
	public static JinTongResult formatToPojo(String jsonData, Class<?> clazz) {
		try {
			if (clazz == null) {
				return MAPPER.readValue(jsonData, JinTongResult.class);
			}
			JsonNode jsonNode = MAPPER.readTree(jsonData);
			JsonNode data = jsonNode.get("data");
			Object obj = null;
			if (clazz != null) {
				if (data.isObject()) {
					obj = MAPPER.readValue(data.traverse(), clazz);
				} else if (data.isTextual()) {
					obj = MAPPER.readValue(data.asText(), clazz);
				}
			}
			return build(jsonNode.get("status").intValue(), jsonNode.get("msg").asText(), obj);
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * 没有object对象的转化
	 * 
	 * @param json
	 * @return
	 */
	public static JinTongResult format(String json) {
		try {
			return MAPPER.readValue(json, JinTongResult.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * Object是集合转化
	 * 
	 * @param jsonData
	 *            json数据
	 * @param clazz
	 *            集合中的类型
	 * @return
	 */
	public static JinTongResult formatToList(String jsonData, Class<?> clazz) {
		try {
			JsonNode jsonNode = MAPPER.readTree(jsonData);
			JsonNode data = jsonNode.get("data");
			Object obj = null;
			if (data.isArray() && data.size() > 0) {
				obj = MAPPER.readValue(data.traverse(),
						MAPPER.getTypeFactory().constructCollectionType(List.class, clazz));
			}
			return build(jsonNode.get("status").intValue(), jsonNode.get("msg").asText(), obj);
		} catch (Exception e) {
			return null;
		}
	}

}
