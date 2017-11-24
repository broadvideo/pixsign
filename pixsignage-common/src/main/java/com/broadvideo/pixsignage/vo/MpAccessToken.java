package com.broadvideo.pixsignage.vo;


public class MpAccessToken {

	private String accessToken;
	// access_token接口调用凭证超时时间，单位（秒）default:7200s
	private Long expiresIn;
	private Long createts;

	public MpAccessToken() {

	}

	public MpAccessToken(String accessToken, Long expiresIn) {
		this.accessToken = accessToken;
		this.expiresIn = expiresIn;
		this.createts = System.currentTimeMillis();

	}

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	public Long getExpiresIn() {
		return expiresIn;
	}

	public void setExpiresIn(Long expiresIn) {
		this.expiresIn = expiresIn;
	}

	public Long getCreatets() {
		return createts;
	}

	public void setCreatets(Long createts) {
		this.createts = createts;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("MPAccessToken [accessToken=").append(accessToken).append(", expiresIn=").append(expiresIn)
				.append(", createts=").append(createts).append("]");
		return builder.toString();
	}

}
