package com.broadvideo.pixsignage.service;

import org.dom4j.Document;
import org.dom4j.Element;

import com.broadvideo.pixsignage.common.ServiceException;

/**
 * 已经关注公众号的，扫码事件 msgtype:event event:scan订阅类型
 * 
 * @author charles
 *
 */
public class WxmpUnsubscribeEventHandler extends WxmpEventMsgTypeHandler {

	public WxmpUnsubscribeEventHandler() {
		this.setEvent("unsubscribe");
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
		final String msgType = root.selectSingleNode("/xml/MsgType").getText();
		final String fromUserName = root.selectSingleNode("/xml/FromUserName").getText();
		final String toUserName = root.selectSingleNode("/xml/ToUserName").getText();
		final String event = root.selectSingleNode("/xml/Event").getText();
		logger.info("用户({})取消了关注公众号({})", fromUserName, toUserName);
		ServiceFactory.getBean(SmartdoorkeeperService.class).unbind(fromUserName);
		return buildReplyMsg(toUserName, fromUserName, "success");
	}


}
