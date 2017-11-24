package com.broadvideo.pixsignage.service;

/**
 * 事件处理
 * 
 * @author charles
 *
 */
public abstract class WxmpEventHandler {

	private String event;

	public String handle(String requestBody) {

		return null;
	}

	public String getEvent() {
		return event;
	}

	public void setEvent(String event) {
		this.event = event;
	}

}
