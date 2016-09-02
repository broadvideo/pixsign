package com.broadvideo.pixsignage.service;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Playlistdtl;
import com.broadvideo.pixsignage.domain.Vchannel;
import com.broadvideo.pixsignage.domain.Vchannelschedule;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.persistence.VchannelMapper;
import com.broadvideo.pixsignage.persistence.VchannelscheduleMapper;
import com.broadvideo.pixsignage.util.CommonUtil;

@Service("vchannelscheduleService")
public class VchannelscheduleServiceImpl implements VchannelscheduleService {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private VchannelscheduleMapper vchannelscheduleMapper;
	@Autowired
	private VchannelMapper vchannelMapper;
	@Autowired
	private MsgeventMapper msgeventMapper;

	public List<Vchannelschedule> selectList(String vchannelid) {
		return vchannelscheduleMapper.selectList(vchannelid);
	}

	@Transactional
	public void addVchannelschedule(Vchannelschedule vchannelschedule) {
		if (vchannelschedule.getPlaydate() == null) {
			vchannelscheduleMapper.deleteByDtl("" + vchannelschedule.getVchannelid(), vchannelschedule.getPlaymode(),
					null,
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(vchannelschedule.getStarttime()));
		} else {
			vchannelscheduleMapper.deleteByDtl("" + vchannelschedule.getVchannelid(), vchannelschedule.getPlaymode(),
					new SimpleDateFormat(CommonConstants.DateFormat_Date).format(vchannelschedule.getPlaydate()),
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(vchannelschedule.getStarttime()));
		}
		vchannelscheduleMapper.insertSelective(vchannelschedule);
	}

	@Transactional
	public void updateVchannelschedule(Vchannelschedule vchannelschedule) {
		vchannelscheduleMapper.updateByPrimaryKeySelective(vchannelschedule);
	}

	@Transactional
	public void deleteVchannelschedule(String vchannelscheduleid) {
		vchannelscheduleMapper.deleteByPrimaryKey(vchannelscheduleid);
	}

	@Transactional
	public void syncVchannelschedule(String vchannelid) throws Exception {
		Msgevent msgevent = msgeventMapper.selectVchannelscheduleVCSSEvent(vchannelid);
		if (msgevent != null) {
			msgevent.setStatus(Msgevent.Status_Wait);
			msgeventMapper.updateByPrimaryKeySelective(msgevent);
		} else {
			msgevent = new Msgevent();
			msgevent.setMsgtype(Msgevent.MsgType_VChannel_Schedule_VCSS);
			msgevent.setObjtype1(Msgevent.ObjType_1_VChannel);
			msgevent.setObjid1(Integer.parseInt(vchannelid));
			msgevent.setObjtype2(Msgevent.ObjType_2_None);
			msgevent.setObjid2(0);
			msgevent.setStatus(Msgevent.Status_Wait);
			msgeventMapper.insertSelective(msgevent);
		}

		JSONObject msgJson = generateVchannelScheduleJson(vchannelid);
		String url = CommonConfig.CONFIG_VCSS_SERVER + "schedules";
		logger.info("Send schedules message to VCSS: {}", msgJson.toString());

		RequestConfig defaultRequestConfig = RequestConfig.custom().setSocketTimeout(5000).setConnectTimeout(5000)
				.setConnectionRequestTimeout(30000).build();
		CloseableHttpClient httpclient = HttpClients.custom().setDefaultRequestConfig(defaultRequestConfig).build();
		HttpPost httppost = new HttpPost(url);
		httppost.addHeader(HTTP.CONTENT_TYPE, "application/json");
		httppost.setEntity(new StringEntity(msgJson.toString()));
		CloseableHttpResponse response = httpclient.execute(httppost);
		int status = response.getStatusLine().getStatusCode();
		if (status == 200) {
			String s = EntityUtils.toString(response.getEntity());
			logger.info("Get schedules response from VCSS: {}", s);
			httpclient.close();
		} else {
			logger.error("Get schedules response code from VCSS: {}", status);
			httpclient.close();
		}

		msgevent.setStatus(Msgevent.Status_Sent);
		msgevent.setSendtime(Calendar.getInstance().getTime());
		msgeventMapper.updateByPrimaryKeySelective(msgevent);
	}

	public JSONObject generateVchannelScheduleJson(String vchannelid) {
		Vchannel vchannel = vchannelMapper.selectByPrimaryKey(vchannelid);
		JSONObject msgJson = new JSONObject();
		msgJson.put("vchannel_uuid", vchannel.getUuid());
		JSONArray scheduleJsonArray = new JSONArray();
		msgJson.put("schedules", scheduleJsonArray);

		String today = new SimpleDateFormat(CommonConstants.DateFormat_Date).format(Calendar.getInstance().getTime());
		String tomorrow = new SimpleDateFormat(CommonConstants.DateFormat_Date)
				.format(new Date(Calendar.getInstance().getTimeInMillis() + 24 * 3600 * 1000));
		List<Vchannelschedule> scheduleList = vchannelscheduleMapper.selectList("" + vchannel.getVchannelid());

		// Add the first schedule from 00:00
		if (scheduleList.size() > 0 && !new SimpleDateFormat(CommonConstants.DateFormat_Time)
				.format(scheduleList.get(0).getStarttime()).equals("00:00:00")) {
			JSONObject scheduleJson = new JSONObject();
			scheduleJsonArray.put(scheduleJson);
			String s = today + " 00:00:00";
			Date starttime = CommonUtil.parseDate(s, CommonConstants.DateFormat_Full);
			scheduleJson.put("start_time", s);
			scheduleJson.put("start_time_seconds", (long) (starttime.getTime() / 1000));

			JSONArray playlistJsonArray = new JSONArray();
			scheduleJson.put("playlist", playlistJsonArray);
			for (Playlistdtl playlistdtl : scheduleList.get(scheduleList.size() - 1).getPlaylist().getPlaylistdtls()) {
				JSONObject videoJson = new JSONObject();
				playlistJsonArray.put(videoJson);
				videoJson.put("id", playlistdtl.getVideo().getVideoid());
				videoJson.put("file", CommonConfig.CONFIG_PIXDATA_HOME + playlistdtl.getVideo().getFilepath());
			}
		}
		// Add today schedules
		for (Vchannelschedule schedule : scheduleList) {
			JSONObject scheduleJson = new JSONObject();
			scheduleJsonArray.put(scheduleJson);
			String s = today + " "
					+ new SimpleDateFormat(CommonConstants.DateFormat_Time).format(schedule.getStarttime());
			Date starttime = CommonUtil.parseDate(s, CommonConstants.DateFormat_Full);
			scheduleJson.put("start_time", s);
			scheduleJson.put("start_time_seconds", (long) (starttime.getTime() / 1000));

			JSONArray playlistJsonArray = new JSONArray();
			scheduleJson.put("playlist", playlistJsonArray);
			for (Playlistdtl playlistdtl : schedule.getPlaylist().getPlaylistdtls()) {
				JSONObject videoJson = new JSONObject();
				playlistJsonArray.put(videoJson);
				videoJson.put("id", playlistdtl.getVideo().getVideoid());
				videoJson.put("file", CommonConfig.CONFIG_PIXDATA_HOME + playlistdtl.getVideo().getFilepath());
			}
		}
		// Add tomorrow schedules
		for (Vchannelschedule schedule : scheduleList) {
			JSONObject scheduleJson = new JSONObject();
			scheduleJsonArray.put(scheduleJson);
			String s = tomorrow + " "
					+ new SimpleDateFormat(CommonConstants.DateFormat_Time).format(schedule.getStarttime());
			Date starttime = CommonUtil.parseDate(s, CommonConstants.DateFormat_Full);
			scheduleJson.put("start_time", s);
			scheduleJson.put("start_time_seconds", (long) (starttime.getTime() / 1000));

			JSONArray playlistJsonArray = new JSONArray();
			scheduleJson.put("playlist", playlistJsonArray);
			for (Playlistdtl playlistdtl : schedule.getPlaylist().getPlaylistdtls()) {
				JSONObject videoJson = new JSONObject();
				playlistJsonArray.put(videoJson);
				videoJson.put("id", playlistdtl.getVideo().getVideoid());
				videoJson.put("file", CommonConfig.CONFIG_PIXDATA_HOME + playlistdtl.getVideo().getFilepath());
			}
		}
		return msgJson;
	}

}
