package com.broadvideo.pixsignage.service;

import java.util.LinkedList;
import java.util.List;

import org.apache.commons.lang3.math.NumberUtils;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.Node;

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
			// return buildReplyMsg(toUserName, fromUserName,
			// WxmpMessageTips.DOOR_NOBINDING_TIP);// buildEmptyReplyMsg();
			return buildEmptyReplyMsg();

		}
		if (DoorConst.DoorVersion.VERSION_2.equals(binding.getDoorversion())) {
			return buildEmptyReplyMsg();
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

	public static void main(String[] args) {

		String xmlData = "<?xml version=\"1.0\" encoding=\"utf-8\" ?><string xmlns=\"http://cmschina.com.cn/\"><NewDataSet><Table><OrgID>OR10000000</OrgID><ADAccountName>zszq</ADAccountName><OrgName>招商证券</OrgName><AdOuPath>OU=招商证券</AdOuPath><ADGrpName>招商证券</ADGrpName><CreatedDate>2009-08-26T13:59:44.213+08:00</CreatedDate><LastUpdateDate>2009-08-26T13:59:44.213+08:00</LastUpdateDate><AutoGrpName>招商证券</AutoGrpName><NodeRelativeNum>100</NodeRelativeNum><DynGrpNum>100</DynGrpNum><ShortName>招商证券</ShortName><Remark /><OrgLayer>0</OrgLayer><Column1>0</Column1><Column2>cmschina</Column2><Column6>12</Column6><Column10>0</Column10><IsUserOrg>False</IsUserOrg></Table></NewDataSet></string>";
		Document doc;
		try {
			xmlData = xmlData.replaceAll("xmlns=\".+?\"", "");
			doc = DocumentHelper.parseText(xmlData);
			Element root = doc.getRootElement();
			List<Element> nodes = root.selectNodes("//NewDataSet/Table");
			System.out.println("doc.asXml:" + doc.asXML());
			for (Node node : nodes) {
				Element ele = (Element) node;
				String orgId = ele.element("OrgID").getTextTrim();
				System.out.println(orgId);

			}
		} catch (DocumentException e) {
			e.printStackTrace();
		}

	}

}
