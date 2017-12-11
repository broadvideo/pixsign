package biz.videoexpress.pixedx.lmsapi.bean;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({ "retcode", "message", "profile" })
public class UserProfileResp extends SingleObjectResp<UserProfileInfo> {

	@Override
	@JsonProperty("profile")
	public UserProfileInfo getData() {
		// TODO Auto-generated method stub
		return super.getData();
	}

}
