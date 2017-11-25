package com.broadvideo.pixsignage.service;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;

import org.apache.commons.lang3.math.NumberUtils;
import org.dom4j.Document;
import org.dom4j.Element;

import com.broadvideo.pixsignage.common.ServiceException;

/**
 * 用户事件消息类型处理
 * 
 * @author charles
 *
 */
public class WxmpEventMsgTypeHandler extends WxmpMsgTypeHandler {

	private LinkedList<String> eventMsgList = new LinkedList<String>();
	private final int MAX_CAPACITY_SIZE = 100;
	private static Map<String, WxmpEventMsgTypeHandler> handlerMap = new HashMap<String, WxmpEventMsgTypeHandler>();
	static {
		WxmpEventMsgTypeHandler subscribeHandler = new WxmpSubscribeEventHandler();
		WxmpEventMsgTypeHandler unsubscribeHandler = new WxmpUnsubscribeEventHandler();
		WxmpEventMsgTypeHandler scanHandler = new WxmpScanEventHandler();
		handlerMap.put(subscribeHandler.getEvent(), subscribeHandler);
		handlerMap.put(unsubscribeHandler.getEvent(), unsubscribeHandler);
		handlerMap.put(scanHandler.getEvent(), scanHandler);
	}
	private String event;

	public WxmpEventMsgTypeHandler() {
		this.setMsgType("event");
	}

	@Override
	public String handle(String requestBody, Integer orgid) {
		Document doc = null;
		try {
			doc = getDocument(requestBody);
		} catch (Exception e) {
			throw new ServiceException("Parse xml data error.", e);
		}
		Element root = doc.getRootElement();
		final String event = root.selectSingleNode("/xml/Event").getText();
		final String fromUserName = root.selectSingleNode("/xml/FromUserName").getText();
		final String toUserName = root.selectSingleNode("/xml/ToUserName").getText();
		final Integer createTime = NumberUtils.toInt(root.selectSingleNode("/xml/CreateTime").getText());
		String key = fromUserName + "@" + createTime;
		synchronized (eventMsgList) {
			if (eventMsgList.contains(key)) {
				return buildEmptyReplyMsg(); // buildReplyMsg(toUserName,
												// fromUserName, "");
			}
			if (eventMsgList.size() >= MAX_CAPACITY_SIZE) {
				eventMsgList.removeFirst();
			}
			eventMsgList.add(key);
		}
		return handlerMap.get(event).handle(requestBody, orgid);

	}

	public String getEvent() {
		return event;
	}

	protected void setEvent(String event) {
		this.event = event;
	}

}
