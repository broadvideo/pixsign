package biz.videoexpress.pixedx.lmsapi.common;

import java.util.ArrayList;
import java.util.List;

import com.broadvideo.pixsignage.util.JsonMapper;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({ "retcode", "message", "data" })
public class BasicResp<T> {

	private int retcode;
	private String message;
	private List<T> data = new ArrayList<T>();

	@JsonProperty("retcode")
	public int getRetcode() {
		return retcode;
	}

	public void setRetcode(int retcode) {
		this.retcode = retcode;
	}

	@JsonProperty(value = "message")
	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	@JsonProperty("data")
	public List<T> getData() {
		return data;
	}

	public void setData(List<T> data) {
		this.data = data;
	}

	public static void main(String[] args) {

		BasicResp<String> resp = new BasicResp<String>();
		JsonMapper jsonMapper = new JsonMapper();
		String jsonStr = jsonMapper.toJson(resp);
		System.out.println(jsonStr);

	}
}
