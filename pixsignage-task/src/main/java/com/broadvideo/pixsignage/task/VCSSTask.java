package com.broadvideo.pixsignage.task;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Vchannel;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.persistence.VchannelMapper;
import com.broadvideo.pixsignage.service.VchannelscheduleService;

public class VCSSTask {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private static boolean workflag = false;

	@Autowired
	private MsgeventMapper msgeventMapper;
	@Autowired
	private VchannelMapper vchannelMapper;
	@Autowired
	private VchannelscheduleService vchannelscheduleService;

	public void work() {
		try {
			if (workflag) {
				return;
			}
			workflag = true;

			List<Msgevent> msgeventList = msgeventMapper.selectList(Msgevent.MsgType_VChannel_Schedule_VCSS,
					Msgevent.ObjType_1_VChannel, null, null, Msgevent.Status_Sent);
			String today = new SimpleDateFormat(CommonConstants.DateFormat_Date)
					.format(Calendar.getInstance().getTime());
			for (Msgevent scheduleEvent : msgeventList) {
				if (!new SimpleDateFormat(CommonConstants.DateFormat_Date).format(scheduleEvent.getSendtime())
						.equals(today)) {
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
					Msgevent.ObjType_1_VChannel, null, null, Msgevent.Status_Wait);
			for (Msgevent scheduleEvent : msgeventList) {
				sendScheduleMsg(scheduleEvent);
			}
		} catch (Exception e) {
			logger.error("VCSS Quartz Task error: {}", e.getMessage());
		}
		workflag = false;
	}

	private void sendChannelMsg(Msgevent msgevent) throws Exception {
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
		logger.info("Send vchannels message to VCSS: {}", msgJson.toString());
		// Client c = Client.create();
		// WebResource r = c.resource(url);
		// String s =
		// r.type(MediaType.APPLICATION_JSON_TYPE).accept(MediaType.APPLICATION_JSON_TYPE).post(String.class,
		// msgJson.toString());
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			HttpPost httpPost = new HttpPost(url);
			httpPost.addHeader("content-type", "application/json");
			httpPost.setEntity(new StringEntity(msgJson.toString(), "UTF-8"));
			HttpResponse result = httpclient.execute(httpPost);
			String s = EntityUtils.toString(result.getEntity(), "UTF-8");
			logger.info("Get vchannels response from VCSS: {}", s);
		} finally {
			httpclient.close();
		}
		msgevent.setStatus(Msgevent.Status_Sent);
		msgevent.setSendtime(Calendar.getInstance().getTime());
		msgeventMapper.updateByPrimaryKeySelective(msgevent);
	}

	private void sendScheduleMsg(Msgevent msgevent) throws Exception {
		Vchannel vchannel = vchannelMapper.selectByPrimaryKey("" + msgevent.getObjid1());
		if (vchannel != null && vchannel.getStatus().equals("1")) {
			JSONObject msgJson = vchannelscheduleService.generateVchannelScheduleJson("" + msgevent.getObjid1());
			String url = CommonConfig.CONFIG_VCSS_SERVER + "schedules";
			logger.info("Send schedules message to VCSS: {}", msgJson.toString());
			// Client c = Client.create();
			// WebResource r = c.resource(url);
			// String s =
			// r.type(MediaType.APPLICATION_JSON_TYPE).accept(MediaType.APPLICATION_JSON_TYPE).post(String.class,
			// msgJson.toString());
			CloseableHttpClient httpclient = HttpClients.createDefault();
			try {
				HttpPost httpPost = new HttpPost(url);
				httpPost.addHeader("content-type", "application/json");
				httpPost.setEntity(new StringEntity(msgJson.toString(), "UTF-8"));
				HttpResponse result = httpclient.execute(httpPost);
				String s = EntityUtils.toString(result.getEntity(), "UTF-8");
				logger.info("Get schedules response from VCSS: {}", s);
			} finally {
				httpclient.close();
			}
		}

		msgevent.setStatus(Msgevent.Status_Sent);
		msgevent.setSendtime(Calendar.getInstance().getTime());
		msgeventMapper.updateByPrimaryKeySelective(msgevent);
	}
}
