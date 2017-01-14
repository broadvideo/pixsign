package com.broadvideo.pixsignage.quartz;

import java.util.Calendar;
import java.util.List;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.service.BundleService;
import com.broadvideo.pixsignage.util.ActiveMQUtil;

public class ActivemqNormalTask {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private static boolean workflag = false;

	@Autowired
	private MsgeventMapper msgeventMapper;
	@Autowired
	private BundleService bundleService;

	public void work() {
		try {
			if (workflag) {
				return;
			}
			workflag = true;

			List<Msgevent> msgeventList = msgeventMapper.selectList(Msgevent.MsgType_Bundle_Schedule,
					Msgevent.ObjType_1_Device, null, null, Msgevent.Status_Wait);
			handleMsgevent(msgeventList);

			msgeventList = msgeventMapper.selectList(Msgevent.MsgType_Bundle_Schedule, Msgevent.ObjType_1_Devicegroup,
					null, null, Msgevent.Status_Wait);
			handleMsgevent(msgeventList);
		} catch (Exception e) {
			logger.error("ActivemqNormalTask Quartz Task error: {}", e.getMessage());
		}
		workflag = false;
	}

	private void handleMsgevent(List<Msgevent> msgeventList) throws Exception {
		for (Msgevent msgevent : msgeventList) {
			JSONObject msgJson;
			if (msgevent.getMsgtype().equals(Msgevent.MsgType_Bundle_Schedule)) {
				msgJson = new JSONObject().put("msg_id", msgevent.getMsgeventid()).put("msg_type", "BUNDLE");
				JSONObject msgBodyJson = bundleService.generateBundleScheduleJson(msgevent.getObjtype1(),
						"" + msgevent.getObjid1());
				msgJson.put("msg_body", msgBodyJson);
			} else {
				continue;
			}

			String topic = "";
			if (msgevent.getObjtype1().equals(Msgevent.ObjType_1_Device)) {
				topic = "device-" + msgevent.getObjid1();
			} else if (msgevent.getObjtype1().equals(Msgevent.ObjType_1_Devicegroup)) {
				topic = "group-" + msgevent.getObjid1();
			}
			ActiveMQUtil.publish(topic, msgJson.toString());
			msgevent.setStatus(Msgevent.Status_Sent);
			msgevent.setSendtime(Calendar.getInstance().getTime());
			msgeventMapper.updateByPrimaryKeySelective(msgevent);
			logger.error("ActiveMQ publish ok, topic={}, msg={}", topic, msgJson.toString());
		}
	}
}
