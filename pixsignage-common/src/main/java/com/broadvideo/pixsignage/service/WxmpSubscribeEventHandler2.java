package com.broadvideo.pixsignage.service;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.dom4j.Document;
import org.dom4j.Element;

import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.common.WxmpMessageTips;

/**
 * smartbox智能柜新版本Handler
 * 
 * msgtype:event event:subscribe订阅类型
 * 
 * @author charles
 *
 */
public class WxmpSubscribeEventHandler2 extends WxmpEventMsgTypeHandler {

	public WxmpSubscribeEventHandler2() {
		this.setEvent("subscribe");
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
		final Integer createTime = NumberUtils.toInt(root.selectSingleNode("/xml/CreateTime").getText());
		final String event = root.selectSingleNode("/xml/Event").getText();
		final String eventKey = root.selectSingleNode("/xml/EventKey").getText();
		if (StringUtils.isBlank(eventKey)) {
			logger.info("关注二维码，没有传递场景值，返回欢迎提示");
			return buildReplyMsg(toUserName, fromUserName, WxmpMessageTips.QRCODE_SUBSCRIBE_TIP);
		}
		String[] eventKeySplits = eventKey.split("_");
		if (eventKeySplits.length < 2 || StringUtils.isBlank(eventKeySplits[1])) {
			logger.info("关注二维码，场景值为空，返回欢迎提示");
			return buildReplyMsg(toUserName, fromUserName, WxmpMessageTips.QRCODE_SUBSCRIBE_TIP);
		}
		String terminalid = eventKeySplits[1];
		ServiceFactory.getBean(SmartdoorkeeperService.class).bind(terminalid, fromUserName, toUserName, event,
				createTime * 1000L, orgid);
		logger.info("用户({})关注了公众号({}) eventkey({})", new Object[] { fromUserName, toUserName, eventKey });
		String replyMsg = buildReplyMsg(toUserName, fromUserName, WxmpMessageTips.QRCODE_SUBSCRIBE_SCENE_TIP2);
		logger.info("订阅成功，发送回复信息给用户({})", fromUserName);
		return replyMsg;
	}

}
