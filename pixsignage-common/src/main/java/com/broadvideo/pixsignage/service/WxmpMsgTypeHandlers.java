package com.broadvideo.pixsignage.service;

import java.util.HashMap;
import java.util.Map;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.broadvideo.pixsignage.common.ServiceException;

public class WxmpMsgTypeHandlers {

	private static Map<String, WxmpMsgTypeHandler> handlers = new HashMap<String, WxmpMsgTypeHandler>();
    static{
    	WxmpMsgTypeHandler textHandler=new WxmpTextMsgTypeHandler();
		WxmpMsgTypeHandler eventHandler = new WxmpEventMsgTypeHandler();
		handlers.put(textHandler.getMsgType(), textHandler);
		handlers.put(eventHandler.getMsgType(), eventHandler);
    }

	public static String doHandle(String requestBody, Integer orgid) {
		Document doc = null;
		try {
			doc = DocumentHelper.parseText(requestBody);
		} catch (DocumentException e) {
			throw new ServiceException("parse xml data error.", e);
		}
		Element root = doc.getRootElement();
		String msgType = root.selectSingleNode("/xml/MsgType").getText().trim();
		return handlers.get(msgType).handle(requestBody, orgid);

	
	}



}
