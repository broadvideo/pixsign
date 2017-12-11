package com.broadvideo.pixsignage.service;

import com.broadvideo.pixsignage.vo.MpAccessToken;
import com.broadvideo.pixsignage.vo.MpQRCode;

public interface WxMpService {
	
	/**
	 * 验证请求签名
	 */
	boolean verifySignature(String signature,String timestamp,String nonce,Integer orgid);

	/**
	 * 获取orgId的公众号的access_token
	 * 
	 * @param orgid
	 * @param refresh
	 *            true:标识强制刷新accesstoken
	 * @return
	 */
	MpAccessToken getAccessToken(Integer orgid, boolean refresh);

	/**
	 * 获取公众号二维码
	 * 
	 * @param scenestr
	 * @param orgid
	 * @return
	 */

	MpQRCode getQRCode(String scenestr, Integer orgid);

	void addSubscribe(String terminalid, String wxuserid, Integer createtime, Integer orgid);
	/**
	 * 给关注用户发送消息
	 */
	void sendMessage(String accessToken, String wxuserid, String content, Integer orgid);


}
