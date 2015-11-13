package com.broadvideo.pixsignage.util;

import org.apache.log4j.Logger;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;

import com.broadvideo.pixsignage.common.CommonConfig;

public class ActiveMQUtil {

	private static Logger log = Logger.getLogger(ActiveMQUtil.class);
	private static MqttClient mqttClient;

	public synchronized static void publish(String topic, String message) throws Exception {
		if (CommonConfig.CONFIG_SERVER_IP == null) {
			throw new Exception("ActiveMQ ip not configured");
		}
		if (mqttClient == null) {
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
		} else if (!mqttClient.isConnected()) {
			MqttConnectOptions connOpts = new MqttConnectOptions();
			connOpts.setCleanSession(true);
			mqttClient.connect(connOpts);
			log.info("ActiveMQ reconnected: " + mqttClient.isConnected());
		}

		if (mqttClient.isConnected()) {
			MqttMessage mqttMessage = new MqttMessage(message.getBytes("utf-8"));
			mqttMessage.setQos(2);
			mqttClient.publish(topic, mqttMessage);
			log.info("ActiveMQ publish ok, topic=" + topic + ", msg=" + message);
		}
	}
}
