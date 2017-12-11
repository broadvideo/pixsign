package biz.videoexpress.pixedx.lmsapi.bean;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({ "retcode", "message", "token" })
public class UserAuthResp extends SingleObjectResp<UserAuth> {
	@Override
	@JsonProperty("token")
	public UserAuth getData() {
		// TODO Auto-generated method stub
		return super.getData();
	}

}
