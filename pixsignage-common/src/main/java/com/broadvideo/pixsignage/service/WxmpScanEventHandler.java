package com.broadvideo.pixsignage.service;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.dom4j.Document;
import org.dom4j.Element;

import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.common.WxmpMessageTips;

/**
 * 已经关注公众号的，扫码事件 msgtype:event event:scan订阅类型
 * 
 * @author charles
 *
 */
public class WxmpScanEventHandler extends WxmpEventMsgTypeHandler {

	public WxmpScanEventHandler() {
		this.setEvent("SCAN");
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
		final String eventKey = root.selectSingleNode("/xml/EventKey").getText();
		final Integer createTime = NumberUtils.toInt(root.selectSingleNode("/xml/CreateTime").getText());
		if (StringUtils.isBlank(eventKey)) {
			logger.info("没有传递场景值，不返回提示消息");
			return buildEmptyReplyMsg(); // buildReplyMsg(toUserName,
											// fromUserName, "");
		}
		boolean isBind = ServiceFactory.getBean(SmartdoorkeeperService.class).bind(eventKey, fromUserName, toUserName,
				event,
				createTime * 1000L, orgid);
		String replyMsg = null;
		if (isBind) {
			replyMsg = buildReplyMsg(toUserName, fromUserName, WxmpMessageTips.QRCODE_SUBSCRIBE_SCENE_TIP);
		logger.info("订阅成功，发送回复信息给用户({})", fromUserName);
		} else {
			replyMsg = this.buildEmptyReplyMsg();
			logger.info("绑定失败!");
		}
		return replyMsg;

	}


}
