package com.broadvideo.pixsignage.vo;

public class MpQRCode {
	// ticket，可以通过ticket获取二维码图片地址
	private String ticket;
	// 二维码有效时间
	private Long expireSeconds;
	// 二维码解析后的地址
	private String url;

	public MpQRCode(String ticket, Long expireSeconds, String url) {

		this.ticket = ticket;
		this.expireSeconds = expireSeconds;
		this.url = url;
	}

	public String getTicket() {
		return ticket;
	}

	public void setTicket(String ticket) {
		this.ticket = ticket;
	}

	public Long getExpireSeconds() {
		return expireSeconds;
	}

	public void setExpireSeconds(Long expireSeconds) {
		this.expireSeconds = expireSeconds;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

}
