package com.broadvideo.pixsignage.service;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.broadvideo.pixsignage.common.ServiceException;

public abstract class WxmpMsgTypeHandler {
	protected final Logger logger = LoggerFactory.getLogger(getClass());
	private String msgType = null;

	public String handle(String requestBody, Integer orgid) {

		throw new ServiceException("No impliment!");
	}

	public Document getDocument(String xmlData) throws Exception {
		Document doc = null;
		try {
			doc = DocumentHelper.parseText(xmlData);
			return doc;

		} catch (DocumentException e) {
			e.printStackTrace();
			throw new Exception("parse xml exception.", e);
		}

	}

	public String buildReplyMsg(String fromUser, String toUser, String content) {
		StringBuilder msgBuilder = new StringBuilder();
		msgBuilder.append("<xml>");
		msgBuilder.append("<ToUserName><![CDATA[" + toUser + "]]></ToUserName>");
		msgBuilder.append("<FromUserName><![CDATA[" + fromUser + "]]></FromUserName>");
		msgBuilder.append("<CreateTime>" + System.currentTimeMillis() / 1000 + "</CreateTime>");
		msgBuilder.append("<MsgType><![CDATA[" + this.getMsgType() + "]]></MsgType>");
		msgBuilder.append("<Content><![CDATA[" + content + "]]></Content>");
		msgBuilder.append("</xml>");
		logger.info("Build reply msg:{}", msgBuilder.toString());
		return msgBuilder.toString();
	}
	public String getMsgType() {
		return msgType;
	}

	public void setMsgType(String msgType) {
		this.msgType = msgType;
	}

}
