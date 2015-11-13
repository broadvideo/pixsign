package com.broadvideo.pixsignage.quartz;

import java.util.Calendar;
import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.service.LayoutscheduleService;
import com.broadvideo.pixsignage.service.RegionscheduleService;
import com.broadvideo.pixsignage.util.ActiveMQUtil;

public class ActivemqTask {
	private static final Logger log = Logger.getLogger(ActivemqTask.class);

	private static boolean workflag = false;

	@Autowired
	private MsgeventMapper msgeventMapper;
	@Autowired
	private LayoutscheduleService layoutscheduleService;
	@Autowired
	private RegionscheduleService regionscheduleService;

	public void work() {
		try {
			if (workflag) {
				return;
			}
			workflag = true;

			List<Msgevent> msgeventList = msgeventMapper.selectList(Msgevent.MsgType_Layout_Schedule,
					Msgevent.ObjType_1_Device, null, Msgevent.Status_Wait, null, null);
			handleMsgevent(msgeventList);

			msgeventList = msgeventMapper.selectList(Msgevent.MsgType_Layout_Schedule, Msgevent.ObjType_1_DeviceGroup,
					null, Msgevent.Status_Wait, null, null);
			handleMsgevent(msgeventList);

			msgeventList = msgeventMapper.selectList(Msgevent.MsgType_Region_Schedule, Msgevent.ObjType_1_Device, null,
					Msgevent.Status_Wait, null, null);
			handleMsgevent(msgeventList);

			msgeventList = msgeventMapper.selectList(Msgevent.MsgType_Region_Schedule, Msgevent.ObjType_1_DeviceGroup,
					null, Msgevent.Status_Wait, null, null);
			handleMsgevent(msgeventList);
		} catch (Exception e) {
			log.error("ActivemqTask Quartz Task error: " + e.getMessage());
		}
		workflag = false;
	}

	private void handleMsgevent(List<Msgevent> msgeventList) throws Exception {
		for (Msgevent msgevent : msgeventList) {
			JSONObject msgJson;
			if (msgevent.getMsgtype().equals(Msgevent.MsgType_Layout_Schedule)) {
				msgJson = new JSONObject().put("msg_id", msgevent.getMsgeventid()).put("msg_type", "LAYOUT");
				JSONObject msgBodyJson = layoutscheduleService.generateLayoutScheduleJson(msgevent.getObjtype1(),
						"" + msgevent.getObjid1());
				msgJson.put("msg_body", msgBodyJson);
			} else if (msgevent.getMsgtype().equals(Msgevent.MsgType_Region_Schedule)) {
				msgJson = new JSONObject().put("msg_id", msgevent.getMsgeventid()).put("msg_type", "REGION");
				JSONObject msgBodyJson = regionscheduleService.generateRegionScheduleJson(msgevent.getObjtype1(),
						"" + msgevent.getObjid1(), "" + msgevent.getObjid2());
				msgJson.put("msg_body", msgBodyJson);
			} else {
				continue;
			}

			String topic = "";
			if (msgevent.getObjtype1().equals(Msgevent.ObjType_1_Device)) {
				topic = "device-" + msgevent.getObjid1();
			} else if (msgevent.getObjtype1().equals(Msgevent.ObjType_1_DeviceGroup)) {
				topic = "group-" + msgevent.getObjid1();
			}
			ActiveMQUtil.publish(topic, msgJson.toString());
			msgevent.setStatus(Msgevent.Status_Sent);
			msgevent.setSendtime(Calendar.getInstance().getTime());
			msgeventMapper.updateByPrimaryKeySelective(msgevent);
			log.error("ActiveMQ publish ok, topic=" + topic + ", msg=" + msgJson.toString());
		}
	}
}
