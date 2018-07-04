package com.broadvideo.pixsignage.service;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.dom4j.Document;
import org.dom4j.Element;

import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.common.WxmpMessageTips;
import com.broadvideo.pixsignage.domain.Smartbox;
import com.broadvideo.pixsignage.persistence.SmartboxMapper;

/**
 * smartbox智能柜新版本Handler
 * 
 * 已经关注公众号的，扫码事件 msgtype:event event:scan订阅类型
 * 
 * @author charles
 *
 */
public class WxmpScanEventHandler2 extends WxmpEventMsgTypeHandler {

	public WxmpScanEventHandler2() {
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
			logger.error("WxmpScanEventHandler2.handle:evenkey({}) is empty.", eventKey);
			return buildEmptyReplyMsg(); // buildReplyMsg(toUserName,
											// fromUserName, "");
		}
		String[] eventKeySplits = eventKey.split("_");
		String terminalid = eventKeySplits[0];
		String qrcodeid = eventKeySplits[1];
		Smartbox smartbox = ServiceFactory.getBean(SmartboxMapper.class).selectByTerminalid(terminalid, orgid);
		if (smartbox == null) {
			logger.error("WxmpScanEventHandler2.handle:terminalid({}) not bind smartbox.", terminalid);
			return this.buildEmptyReplyMsg();

		}
		if (StringUtils.isBlank(qrcodeid) || !qrcodeid.equals(smartbox.getQrcodeid())) {
			logger.error(
					"WxmpScanEventHandler2.handle: qrcodeid({}) extract from qrcode not equal to smartbox.qrcodeid({})",
					qrcodeid, smartbox.getQrcodeid());
			return buildReplyMsg(toUserName, fromUserName, WxmpMessageTips.QRCODE_OUT_OF_DATE);
		}

		boolean isBind = ServiceFactory.getBean(SmartdoorkeeperService.class).bind(terminalid, fromUserName,
				toUserName, event, createTime * 1000L, orgid);
		String replyMsg = null;
		if (isBind) {
			replyMsg = buildReplyMsg(toUserName, fromUserName, WxmpMessageTips.QRCODE_SUBSCRIBE_SCENE_TIP2);
			logger.info("WxmpScanEventHandler2.handle:({}) Subscribe success.", fromUserName);
		} else {
			replyMsg = this.buildEmptyReplyMsg();
			logger.error("Bind fail");
		}
		return replyMsg;

	}

}
