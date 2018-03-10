package com.broadvideo.pixsignage.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.smn.client.DefaultSmnClient;
import com.smn.client.SmnClient;
import com.smn.request.sms.SmsPublishRequest;
import com.smn.response.sms.SmsPublishResponse;

public class HuaweiUtil {

	private static Logger logger = LoggerFactory.getLogger(HuaweiUtil.class);

	private static SmnClient smnClient = new DefaultSmnClient("broadvideo", "broadvideo", "Roundstone2018",
			"cn-north-1");

	public static void smsPublish(String endpoint, String token) throws Exception {
		String signid = "bd9b25e23c684407b58a12723c17625f";
		String message = "您的验证码是:" + token + "，请查收";
		SmsPublishRequest smnRequest = new SmsPublishRequest();
		logger.info("Begin to send SMS to {}: {}", endpoint, message);
		smnRequest.setEndpoint(endpoint).setMessage(message).setSignId(signid);
		SmsPublishResponse res = smnClient.sendRequest(smnRequest);
		logger.info("SMS result: httpCode={}, message_id={}, request_id={}, errormessage={}", res.getHttpCode(),
				res.getMessageId(), res.getRequestId(), res.getMessage());
	}

}