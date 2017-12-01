package com.broadvideo.pixsignage.service;

import java.util.LinkedList;

import org.apache.commons.lang3.math.NumberUtils;
import org.dom4j.Document;
import org.dom4j.Element;

import com.broadvideo.pixsignage.common.DoorConst;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.common.WxmpMessageTips;
import com.broadvideo.pixsignage.vo.TerminalBinding;

public class WxmpTextMsgTypeHandler extends WxmpMsgTypeHandler {
	private LinkedList msgIds = new LinkedList<Long>();
	private Integer MAX_CAPACITY_SIZE = 100;

	public WxmpTextMsgTypeHandler() {
		this.setMsgType("text");
	}

	@Override
	public String handle(String requestBody, Integer orgid) {

		Document doc = null;
		try {
			doc = this.getDocument(requestBody);
		} catch (Exception e) {
			throw new ServiceException("Parse xml data error：" + e.getMessage());
		}
		Element root = doc.getRootElement();
		final String msgType = root.selectSingleNode("/xml/MsgType").getText();
		final String fromUserName = root.selectSingleNode("/xml/FromUserName").getText();
		final String toUserName = root.selectSingleNode("/xml/ToUserName").getText();
		final String content = root.selectSingleNode("/xml/Content").getText().trim();
		final long msgId = NumberUtils.toLong(root.selectSingleNode("/xml/MsgId").getText().trim());
		logger.info("Receive msgId:{} content:{}", msgId, content);
		synchronized (msgIds) {
			if (msgIds.contains(msgId)) {
				return buildEmptyReplyMsg();
			}
			if (msgIds.size() >= MAX_CAPACITY_SIZE) {
				msgIds.removeFirst();
			}
			msgIds.add(msgId);
		}
		logger.info("Check user binding...");
		TerminalBinding binding = ServiceFactory.getBean(SmartdoorkeeperService.class).getBinding(fromUserName);
		if (binding == null) {
			logger.error("wxuser({}) no binding record found.");
			return buildReplyMsg(toUserName, fromUserName, WxmpMessageTips.DOOR_NOBINDING_TIP);// buildEmptyReplyMsg();
		}
		logger.info("Wxmp({}) receive user({}) msg:{}", new Object[] { toUserName, fromUserName, content });
		if (DoorConst.DoorType.UP.getVal().equals(content) || DoorConst.DoorType.DOWN.getVal().equals(content)) {
			logger.info("do open door logic");
			boolean flag = ServiceFactory.getBean(SmartdoorkeeperService.class)
					.authorizeOpenDoor(fromUserName, content);
			if (flag) {
				logger.info("Authorize open terminal({}) door({})  for wxuserid({})", binding.getTerminalid(), content,
						fromUserName);
				return buildEmptyReplyMsg(); // buildReplyMsg(toUserName,
												// fromUserName, "开门成功!");
			} else {
				logger.error("Authorize open terminal({}) door({}) fail for wxuserid({})", binding.getTerminalid(),
						content, fromUserName);
				return buildEmptyReplyMsg();
			}

		} else {
			logger.error("Receive invliad content({})", content);
			return buildReplyMsg(toUserName, fromUserName, WxmpMessageTips.DOOR_INVLIAD_INPUT_TIP);

		}
	}

}
