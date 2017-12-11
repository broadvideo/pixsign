package biz.videoexpress.pixedx.lmsapi.bean;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserAuth {
	private String tokenType;
	private String accessToken;
	private long expiredIn;

	@JsonProperty("token_type")
	public String getTokenType() {
		return tokenType;
	}

	public void setTokenType(String tokenType) {
		this.tokenType = tokenType;
	}

	@JsonProperty("access_token")
	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	@JsonProperty("expired_in")
	public long getExpiredIn() {
		return expiredIn;
	}

	public void setExpiredIn(long expiredIn) {
		this.expiredIn = expiredIn;
	}
}
