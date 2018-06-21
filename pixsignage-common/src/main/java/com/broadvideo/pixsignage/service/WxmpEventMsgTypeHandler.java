package com.broadvideo.pixsignage.service;

import java.util.LinkedList;

import org.apache.commons.collections4.keyvalue.MultiKey;
import org.apache.commons.collections4.map.MultiKeyMap;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.dom4j.Document;
import org.dom4j.Element;

import com.broadvideo.pixsignage.common.DoorConst;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.Smartbox;
import com.broadvideo.pixsignage.persistence.SmartboxMapper;

/**
 * 用户事件消息类型处理
 * 
 * @author charles
 *
 */
public class WxmpEventMsgTypeHandler extends WxmpMsgTypeHandler {

	private LinkedList<String> eventMsgList = new LinkedList<String>();
	private final int MAX_CAPACITY_SIZE = 100;
	// private static Map<String, WxmpEventMsgTypeHandler> handlerMap = new
	// HashMap<String, WxmpEventMsgTypeHandler>();
	private static MultiKeyMap<MultiKey<String>, WxmpEventMsgTypeHandler> handlerMap = new MultiKeyMap<MultiKey<String>, WxmpEventMsgTypeHandler>();
	static {

		WxmpEventMsgTypeHandler subscribeHandler = new WxmpSubscribeEventHandler();
		WxmpEventMsgTypeHandler subscribeHandler2 = new WxmpSubscribeEventHandler2();
		handlerMap.put(new MultiKey(DoorConst.DoorVersion.VERSION_1.getVal(), subscribeHandler.getEvent()),
				subscribeHandler);
		handlerMap.put(new MultiKey(DoorConst.DoorVersion.VERSION_2.getVal(), subscribeHandler2.getEvent()),
				subscribeHandler2);
		WxmpEventMsgTypeHandler scanHandler = new WxmpScanEventHandler();
		WxmpEventMsgTypeHandler scanHandler2 = new WxmpScanEventHandler2();
		handlerMap.put(new MultiKey(DoorConst.DoorVersion.VERSION_1.getVal(), scanHandler.getEvent()), scanHandler);
		handlerMap.put(new MultiKey(DoorConst.DoorVersion.VERSION_2.getVal(), scanHandler2.getEvent()), scanHandler2);
		WxmpEventMsgTypeHandler unsubscribeHandler = new WxmpUnsubscribeEventHandler();
		handlerMap.put(new MultiKey(DoorConst.DoorVersion.VERSION_1.getVal(), unsubscribeHandler.getEvent()),
				unsubscribeHandler);
		handlerMap.put(new MultiKey(DoorConst.DoorVersion.VERSION_2.getVal(), unsubscribeHandler.getEvent()),
				unsubscribeHandler);
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
		final String eventKey = root.selectSingleNode("/xml/EventKey").getText();
		String terminalid = getTerminalid(eventKey);
		String doorversion = DoorConst.DoorVersion.VERSION_1.getVal();
		if (StringUtils.isNotBlank(terminalid)) {
			Smartbox smartbox = ServiceFactory.getBean(SmartboxMapper.class).selectByTerminalid(terminalid, orgid);
			if (smartbox != null) {
				doorversion = smartbox.getDoorversion();
			}
		}
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

		return handlerMap.get(doorversion, event).handle(requestBody, orgid);

	}

	public String getEvent() {
		return event;
	}

	protected void setEvent(String event) {
		this.event = event;
	}

	protected String getTerminalid(String eventKey) {

		String[] eventKeySplits = eventKey.split("_");
		if (eventKeySplits.length == 1) {

			return eventKey;
		} else if (eventKeySplits.length > 1) {
			logger.info("事件场景值(eventKey:{})", eventKey);
			return eventKeySplits[1];
		}
		return null;

	}

}
