package com.broadvideo.pixsignage.task;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.listener.MessageListener;

import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.OrgMapper;
import com.ibm.icu.util.Calendar;

public class KafkaConsumerListener implements MessageListener<String, String> {

	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private OrgMapper orgMapper;
	@Autowired
	private DeviceMapper deviceMapper;

	@Override
	public void onMessage(ConsumerRecord<String, String> data) {

		String topic = data.topic();
		logger.info(">>>>>>onMessage: topic:{},data:{}", topic, data.value());
		JSONObject dataJson = new JSONObject(data.value());
		if ("roc2vpn".equals(topic)) { 
			this.handle(dataJson);
		} else {
			// Do nothing
		}

	}

	private void handle(JSONObject dataJson) {
		try {
			JSONObject msgJson = dataJson.getJSONObject("message");
			String type = msgJson.getString("type");
			if ("sync_refence".equals(type)) { 
				String from = dataJson.getString("from");
				JSONObject msgDataJson = msgJson.getJSONObject("data");
				if (msgDataJson.getInt("type") == 1) {
					JSONObject rcuJson = msgDataJson.getJSONObject("rcu");
					String orgCode = rcuJson.getString("tenantCode");
					String hardkey = rcuJson.getString("rcuCode");
					logger.info("To add one new Cloudia device, orgCode={}, hardkey={}", orgCode, hardkey);
					Org org = orgMapper.selectByCode(orgCode);
					if (org == null) {
						logger.error("Org not found, orgCode={}", orgCode);
						return;
					}
					Device device = deviceMapper.selectByHardkey(hardkey);
					if (device != null) {
						logger.error("Device has existed, hardkey={}", hardkey);
						return;
					}
					device = new Device();
					device.setOrgid(org.getOrgid());
					device.setBranchid(org.getTopbranchid());
					device.setName(hardkey);
					device.setTerminalid(hardkey);
					device.setHardkey(hardkey);
					device.setType("13");
					device.setStatus("1");
					device.setActivetime(Calendar.getInstance().getTime());
					deviceMapper.insertSelective(device);
				}
			}
		} catch (Exception e) {
			logger.error("Device error: {}", e);
		}
	}

	public static void main(String[] args) {
		/*
		 * final TimeZone timeZone = TimeZone.getTimeZone("GMT");
		 * TimeZone.setDefault(timeZone); Date curDate = new Date(1563242400000L);
		 * 
		 * System.out.println(curDate); System.currentTimeMillis();
		 */
		/*
		 * Date curDate = DateUtil.getDate("2019-07-16 10:00:00",
		 * "yyyy-MM-dd HH:mm:ss"); System.out.print(curDate.getTime());
		 */

	}

}
