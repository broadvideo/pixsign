package com.broadvideo.pixsignage.quartz;

import java.util.Calendar;
import java.util.List;

import javax.ws.rs.core.MediaType;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Vchannel;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.persistence.VchannelMapper;
import com.broadvideo.pixsignage.persistence.VchannelscheduleMapper;
import com.broadvideo.pixsignage.service.VchannelscheduleService;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;

public class VCSSTask {
	private static final Logger log = Logger.getLogger(VCSSTask.class);

	private static boolean workflag = false;

	@Autowired
	private MsgeventMapper msgeventMapper;
	@Autowired
	private VchannelMapper vchannelMapper;
	@Autowired
	private VchannelscheduleMapper vchannelscheduleMapper;
	@Autowired
	private VchannelscheduleService vchannelscheduleService;

	public void work() {
		try {
			if (workflag) {
				return;
			}
			workflag = true;

			List<Msgevent> msgeventList = msgeventMapper.selectList(Msgevent.MsgType_VChannel_Schedule_VCSS,
					Msgevent.ObjType_1_VChannel, null, Msgevent.Status_Sent, null, null);
			String today = CommonConstants.DateFormat_Date.format(Calendar.getInstance().getTime());
			for (Msgevent scheduleEvent : msgeventList) {
				if (!CommonConstants.DateFormat_Date.format(scheduleEvent.getSendtime()).equals(today)) {
					// Resend schedule message as a new day
					scheduleEvent.setStatus(Msgevent.Status_Wait);
					msgeventMapper.updateByPrimaryKeySelective(scheduleEvent);
				}
			}

			// Send vchannel message
			Msgevent channelEvent = msgeventMapper.selectVchannelVCSSEvent();
			if (channelEvent != null && channelEvent.getStatus().equals(Msgevent.Status_Wait)) {
				sendChannelMsg(channelEvent);
			}

			// Send vchannel schedule message
			msgeventList = msgeventMapper.selectList(Msgevent.MsgType_VChannel_Schedule_VCSS,
					Msgevent.ObjType_1_VChannel, null, Msgevent.Status_Wait, null, null);
			for (Msgevent scheduleEvent : msgeventList) {
				sendScheduleMsg(scheduleEvent);
			}
		} catch (Exception e) {
			log.error("VCSS Quartz Task error: " + e.getMessage());
		}
		workflag = false;
	}

	private void sendChannelMsg(Msgevent msgevent) {
		JSONObject msgJson = new JSONObject();
		JSONArray channelJsonArray = new JSONArray();
		msgJson.put("vchannels", channelJsonArray);
		List<Vchannel> vchannelList = vchannelMapper.selectList(null, null, null, null);
		for (Vchannel vchannel : vchannelList) {
			JSONObject vchannelJson = new JSONObject();
			channelJsonArray.put(vchannelJson);
			vchannelJson.put("vchannel_uuid", vchannel.getUuid());
			vchannelJson.put("name", vchannel.getName());
			vchannelJson.put("url_postfix", "" + vchannel.getVchannelid());
			if (vchannel.getBackupvideo() != null) {
				vchannelJson.put("backup_file",
						CommonConfig.CONFIG_PIXDATA_HOME + vchannel.getBackupvideo().getFilepath());
			}
		}

		String url = CommonConfig.CONFIG_VCSS_SERVER + "vchannels";
		log.info("Send vchannels message to VCSS: " + msgJson.toString());
		Client c = Client.create();
		WebResource r = c.resource(url);
		String s = r.type(MediaType.APPLICATION_JSON_TYPE).accept(MediaType.APPLICATION_JSON_TYPE).post(String.class,
				msgJson.toString());
		log.info("Get vchannels response from VCSS: " + s);

		msgevent.setStatus(Msgevent.Status_Sent);
		msgevent.setSendtime(Calendar.getInstance().getTime());
		msgeventMapper.updateByPrimaryKeySelective(msgevent);
	}

	private void sendScheduleMsg(Msgevent msgevent) {
		Vchannel vchannel = vchannelMapper.selectByPrimaryKey("" + msgevent.getObjid1());
		if (vchannel != null && vchannel.getStatus().equals("1")) {
			JSONObject msgJson = vchannelscheduleService.generateVchannelScheduleJson("" + msgevent.getObjid1());
			String url = CommonConfig.CONFIG_VCSS_SERVER + "schedules";
			log.info("Send schedules message to VCSS: " + msgJson.toString());
			Client c = Client.create();
			WebResource r = c.resource(url);
			String s = r.type(MediaType.APPLICATION_JSON_TYPE).accept(MediaType.APPLICATION_JSON_TYPE)
					.post(String.class, msgJson.toString());
			log.info("Get schedules response from VCSS: " + s);
		}

		msgevent.setStatus(Msgevent.Status_Sent);
		msgevent.setSendtime(Calendar.getInstance().getTime());
		msgeventMapper.updateByPrimaryKeySelective(msgevent);
	}
}
