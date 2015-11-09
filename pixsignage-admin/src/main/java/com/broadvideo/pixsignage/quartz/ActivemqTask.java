package com.broadvideo.pixsignage.quartz;

import java.util.Calendar;
import java.util.List;

import org.apache.log4j.Logger;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.service.LayoutService;

public class ActivemqTask {
	private static final Logger log = Logger.getLogger(ActivemqTask.class);

	private static boolean workflag = false;
	private static MqttClient mqttClient;

	@Autowired
	private MsgeventMapper msgeventMapper;
	@Autowired
	private LayoutService layoutService;

	public void work() {
		try {
			if (workflag) {
				return;
			}
			workflag = true;

			if (mqttClient == null && CommonConfig.CONFIG_SERVER_IP != null) {
				String broker = "tcp://" + CommonConfig.CONFIG_SERVER_IP + ":1883";
				String clientId = "PixsignageAdmin";
				MemoryPersistence persistence = new MemoryPersistence();
				mqttClient = new MqttClient(broker, clientId, persistence);
				mqttClient.setCallback(new MqttCallback() {
					public void connectionLost(Throwable arg0) {
						log.error("Activemq connection lost");
					}

					public void deliveryComplete(IMqttDeliveryToken arg0) {
						log.info("Activemq delivery complete");
					}

					public void messageArrived(String arg0, MqttMessage arg1) throws Exception {
						log.info("Activemq message arrived");
					}
				});
				MqttConnectOptions connOpts = new MqttConnectOptions();
				connOpts.setKeepAliveInterval(10);
				connOpts.setCleanSession(true);
				log.info("Start to connect to ActiveMQ " + "tcp://" + CommonConfig.CONFIG_SERVER_IP + ":1883");
				mqttClient.connect(connOpts);
			}

			if (!mqttClient.isConnected()) {
				MqttConnectOptions connOpts = new MqttConnectOptions();
				connOpts.setCleanSession(true);
				mqttClient.connect(connOpts);
			}
			log.info("ActiveMQ connected: " + mqttClient.isConnected());

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

	private void handleMsgevent(List<Msgevent> msgeventList) {
		for (Msgevent msgevent : msgeventList) {
			JSONObject msgJson;
			if (msgevent.getMsgtype().equals(Msgevent.MsgType_Layout_Schedule)) {
				msgJson = new JSONObject().put("msg_id", msgevent.getMsgeventid()).put("msg_type", "LAYOUT");
				JSONObject msgBodyJson = layoutService.generateLayoutScheduleJson(msgevent.getObjtype1(),
						"" + msgevent.getObjid1());
				msgJson.put("msg_body", msgBodyJson);
			} else if (msgevent.getMsgtype().equals(Msgevent.MsgType_Region_Schedule)) {
				msgJson = new JSONObject().put("msg_id", msgevent.getMsgeventid()).put("msg_type", "REGION");
				JSONObject msgBodyJson = layoutService.generateRegionScheduleJson(msgevent.getObjtype1(),
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
			try {
				MqttMessage message = new MqttMessage(msgJson.toString().getBytes("utf-8"));
				message.setQos(2);
				mqttClient.publish(topic, message);

				msgevent.setStatus(Msgevent.Status_Sent);
				msgevent.setSendtime(Calendar.getInstance().getTime());
				msgeventMapper.updateByPrimaryKeySelective(msgevent);
				log.error("ActiveMQ publish ok, topic=" + topic + ", msg=" + msgJson.toString());
			} catch (Exception e) {
				log.error("ActiveMQ publish error: " + e.getMessage());
			}
		}
	}
}
