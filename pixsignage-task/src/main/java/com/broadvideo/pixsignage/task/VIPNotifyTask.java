package com.broadvideo.pixsignage.task;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.broadvideo.pixsignage.domain.Attendancelog;
import com.broadvideo.pixsignage.domain.Config;
import com.broadvideo.pixsignage.domain.Person;
import com.broadvideo.pixsignage.persistence.AttendancelogMapper;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.util.CommonUtils;
import com.broadvideo.pixsignage.util.DateUtil;
import com.gexin.rp.sdk.base.IPushResult;
import com.gexin.rp.sdk.base.impl.AppMessage;
import com.gexin.rp.sdk.http.IGtPush;
import com.gexin.rp.sdk.template.NotificationTemplate;
import com.gexin.rp.sdk.template.TransmissionTemplate;
import com.gexin.rp.sdk.template.style.Style0;

@Service("vipNotifyTask")
public class VIPNotifyTask extends Thread {
	private Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private ConfigMapper configMapper;
	@Autowired
	private AttendancelogMapper attendancelogMapper;
	private long lastnotifyts = -1L;
	private static String appId = "lgsVT8e6Cj6M2G7GzR0Kb5";
	private static String appKey = "u8I6wo8ELT9CQ9E80AtN15";
	private static String masterSecret = "7hruafPsDsActjLb6Go4q";

	public void run() {
		logger.info("Start VIP notify task.");
		lastnotifyts = System.currentTimeMillis();
		while (true) {
			try {
				List<Attendancelog> attendancelogList = attendancelogMapper.selectList2(new Date(lastnotifyts));
				if (attendancelogList != null && attendancelogList.size() > 0) {
					logger.info("attendancelogList({}) not null,do notify:", attendancelogList.size());
					IGtPush push = new IGtPush("http://sdk.open.api.igexin.com/apiex.htm", appKey, masterSecret);
					for (Attendancelog attendancelog : attendancelogList) {
						long signts = attendancelog.getSigntime().getTime();
						List<String> appIds = new ArrayList<String>();
						appIds.add(appId);
						// 定义"AppMessage"类型消息对象，设置消息内容模板、发送的目标App列表、是否支持离线发送、以及离线消息有效期(单位毫秒)
						AppMessage message = new AppMessage();
						message.setData(buildTransmissionTemplate(attendancelog.getPersonname(),
								buildContent(attendancelog)));
						message.setAppIdList(appIds);
						message.setOffline(true);
						message.setOfflineExpireTime(1000 * 600);
						IPushResult ret = push.pushMessageToApp(message);
						logger.info("Notify vip({}) return result:{}", attendancelog.getPersonname(), ret.getResponse()
								.toString());
						lastnotifyts = signts;
					}

				}
				Thread.sleep(1000 * 2L);

			} catch (Exception ex) {
				logger.error("VIP notify  Task error: {}", ex);
				CommonUtils.sleep(2 * 1000L);
			}
		}
	}

	private String buildContent(Attendancelog attendancelog) {
		JSONObject dataJson = new JSONObject();
		dataJson.put("event_id", attendancelog.getEventid());
		dataJson.put("event_name", attendancelog.getEventname());
		dataJson.put("terminal_id", attendancelog.getTerminalid());
		dataJson.put("terminal_name", attendancelog.getTerminalid());
		dataJson.put("room_id", attendancelog.getRoomid());
		dataJson.put("room_name", attendancelog.getRoomname());
		dataJson.put("person_id", attendancelog.getPersonid());
		dataJson.put("person_name", attendancelog.getPersonname());
		Config config = configMapper.selectByCode("ServerIP");
		String avatar = "http://" + config.getValue() + "/pixsigdata" + attendancelog.getPerson().getAvatar();
		dataJson.put("avatar", avatar);
		dataJson.put("sign_type", attendancelog.getSigntype());
		dataJson.put("sign_time", DateUtil.getDateStr(attendancelog.getSigntime(), "yyyy-MM-dd HH:mm:ss"));
		dataJson.put("state", "0");
		return dataJson.toString();

	}

	private static TransmissionTemplate buildTransmissionTemplate(String personname, String content) {

		TransmissionTemplate template = new TransmissionTemplate();
		template.setAppId(appId);
		template.setAppkey(appKey);
		// 透传消息设置，1为强制启动应用，客户端接收到消息后就会立即启动应用；2为等待应用启动
		template.setTransmissionType(2);
		template.setTransmissionContent(content);
		// 设置定时展示时间
		// template.setDuration("2015-01-16 11:40:00", "2015-01-16 12:24:00");
		return template;
	}

	private static NotificationTemplate buildTemplate(String personname, String content) {
		NotificationTemplate template = new NotificationTemplate();
		// 设置APPID与APPKEY
		template.setAppId(appId);
		template.setAppkey(appKey);
		// 透传消息设置，1为强制启动应用，客户端接收到消息后就会立即启动应用；2为等待应用启动
		template.setTransmissionType(1);
		template.setTransmissionContent(content);
		Style0 style = new Style0();
		// 设置通知栏标题与内容
		style.setTitle("VIP通知");
		style.setText("识别到VIP客户(" + personname + ")进入");
		// 配置通知栏图标
		style.setLogo("icon.png");
		// 配置通知栏网络图标
		style.setLogoUrl("");
		// 设置通知是否响铃，震动，或者可清除
		style.setRing(true);
		style.setVibrate(true);
		style.setClearable(true);
		template.setStyle(style);
		return template;
	}

	public static void main(String[] args) {

		VIPNotifyTask task = new VIPNotifyTask();
		IGtPush push = new IGtPush("http://sdk.open.api.igexin.com/apiex.htm", appKey, masterSecret);
		List<String> appIds = new ArrayList<String>();
		appIds.add(appId);
		// 定义"AppMessage"类型消息对象，设置消息内容模板、发送的目标App列表、是否支持离线发送、以及离线消息有效期(单位毫秒)
		AppMessage message = new AppMessage();
		Attendancelog attendancelog = new Attendancelog();
		Person person=new Person();
		person.setName("张国栋");
		person.setAvatar("/image/avatar/00001/1.jpg");
	    attendancelog.setPerson(person);
	    attendancelog.setEventid(1);
	    attendancelog.setEventname("VIP客户识别事件");
	    attendancelog.setPersonname(person.getName());
	    attendancelog.setSigntype("1");
	    attendancelog.setSigntime(new Date());
	    attendancelog.setRoomid(1);
	    attendancelog.setRoomname("VIP休息室");
		attendancelog.setTerminalid("00001");
		attendancelog.setTerminalname("00001");
		message.setData(buildTransmissionTemplate("张三", task.buildContent(attendancelog)));
		message.setAppIdList(appIds);
		message.setOffline(true);
		message.setOfflineExpireTime(1000 * 600);
		IPushResult ret = push.pushMessageToApp(message);
		System.out.println("Notify vip return result:" + ret.getResponse().toString());

	}

}
