package com.broadvideo.pixsignage.service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsignage.common.ApiRetCodeEnum;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.Wxappinfo;
import com.broadvideo.pixsignage.persistence.WxappinfoMapper;
import com.broadvideo.pixsignage.util.CommonUtils;
import com.broadvideo.pixsignage.util.EncryptUtils;
import com.broadvideo.pixsignage.util.HttpClientUtils;
import com.broadvideo.pixsignage.util.HttpClientUtils.SimpleHttpResponse;
import com.broadvideo.pixsignage.vo.MpAccessToken;
import com.broadvideo.pixsignage.vo.MpQRCode;

public class WxMpServiceImpl implements WxMpService, InitializingBean {
	private final static Logger logger = LoggerFactory.getLogger(WxMpServiceImpl.class);
	private final static String ERRCODE = "errcode";
	private final static String ERRMSG = "errmsg";
	private static Map<Integer, MpAccessToken> mpAccessTokenMap = new ConcurrentHashMap<Integer, MpAccessToken>();
	@Autowired
	private WxappinfoMapper wxappinfoMapper;

	@Override
	public boolean verifySignature(String signature, String timestamp, String nonce, Integer orgid) {
		Wxappinfo wxappinfo=wxappinfoMapper.selectWxappinfo(Wxappinfo.WX_MP_TYPE, orgid);
		if(wxappinfo==null){
		   throw new ServiceException(ApiRetCodeEnum.WXMP_NO_CONFIG,"wxmp config not found.");	
		}
		String token = wxappinfo.getToken();
		//将数组按字典排序
		String[] sortedArr = new String[] { token, timestamp, nonce };
		Arrays.sort(sortedArr);
		StringBuilder msg = new StringBuilder();
		for (String str : sortedArr) {
			msg.append(str);
		}
		logger.info("plantext:{}", msg.toString());
		String encrptSign = EncryptUtils.encryptSHA(msg.toString());
		if (encrptSign.equalsIgnoreCase(signature)) {
			logger.info("signature（{}） match success.", signature);
			return true;
		}else{
			logger.info("signature（{}） match fail.", signature);
			return false;
		}
		
	}

	@Override
	public MpAccessToken getAccessToken(Integer orgid, boolean refresh) {

		if (refresh || !mpAccessTokenMap.containsKey(orgid)) {
			logger.info("Pool not exists accessToken for orgid:{},do getAccessToken request.", orgid);
			refreshAccessToken(orgid);
		}
		return mpAccessTokenMap.get(orgid);

	}
	@Override
	public MpQRCode getQRCode(String scenestr, Integer orgid) {

		MpAccessToken accessTokenObj = this.getAccessToken(orgid, false);
		logger.info("orgid({}) fetch access_token:{}", orgid, accessTokenObj.getAccessToken());
		final String createTicketUrl = "https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token="
				+ accessTokenObj.getAccessToken();
		JSONObject postJson = new JSONObject();
		postJson.put("action_name", "QR_LIMIT_STR_SCENE");
		JSONObject actionInfoJson = new JSONObject();
		JSONObject sceneJson = new JSONObject();
		sceneJson.put("scene_str", scenestr);
		actionInfoJson.put("scene", sceneJson);
		postJson.put("action_info", actionInfoJson);

		SimpleHttpResponse response = null;
		try {
			response = HttpClientUtils.doPost(createTicketUrl, postJson.toString());
		} catch (Exception e) {
			logger.error("getQRCode(scenestr:{},orgid:{}) http post exception.", scenestr, orgid);
			throw new ServiceException("getQRCode request execute exception:" + e.getMessage());
		}
		final int statusCode = response.getStatusCode();
		logger.info("createTicketUrl({}) response(code:{},body:{})", createTicketUrl, statusCode, response.getBody());
		this.checkGetAccessTokenResponse(response);
		JSONObject ticketJson = new JSONObject(response.getBody());
		String ticket = ticketJson.getString("ticket");
		Long expireSeconds = ticketJson.getLong("expire_seconds");
		String url = ticketJson.getString("url");
		return new MpQRCode(ticket, expireSeconds, url);
	}

	@Override
	public void sendMessage(String accessToken, String wxuserid, String content) {

		final String sendUrl = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" + accessToken;
        JSONObject bodyJson=new JSONObject();
        bodyJson.put("touser", wxuserid);
		bodyJson.put("msgtype", "text");
        JSONObject textJson=new JSONObject();
        textJson.put("content",content);
        bodyJson.put("text", textJson);
		SimpleHttpResponse response = null;
		try {
			response = HttpClientUtils.doPost(sendUrl, bodyJson.toString());
		} catch (Exception ex) {
			logger.error("getAccessToken request exception.", ex);
			throw new ServiceException("getAccessToken request exception:" + ex.getMessage());
		}
		checkSendMessageResponse(response);
		logger.info("sendMessage({},{},{}) with response:{}",
				new Object[] { accessToken, wxuserid, content, response.getBody() });
		
		
	}

	@Override
	public void addSubscribe(String terminalid, String wxuserid, Integer createtime, Integer orgid) {

	}

	public synchronized void refreshAccessToken(Integer orgid) {

		MpAccessToken mpAccessToken = this.requestAccessToken(orgid);
		mpAccessTokenMap.put(orgid, mpAccessToken);
	}

	private MpAccessToken requestAccessToken(Integer orgid) {

		try {
		logger.info("get wxappinfo: type:{},orgid:{}", Wxappinfo.WX_MP_TYPE, orgid);
		Wxappinfo wxappinfo = wxappinfoMapper.selectWxappinfo(Wxappinfo.WX_MP_TYPE, orgid);
		if (wxappinfo == null) {
			logger.error("wxappinfo(type:{},orgid:{}) not found.", Wxappinfo.WX_MP_TYPE, orgid);
			throw new ServiceException("orgid(" + orgid + ") not config wxappinfo");
		}
		StringBuilder urlBuilder = new StringBuilder(
				"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=");
		urlBuilder.append(wxappinfo.getAppid()).append("&secret=").append(wxappinfo.getAppsecret());
		final String accessTokenUrl = urlBuilder.toString();
		SimpleHttpResponse response = null;
		try {
			response = HttpClientUtils.doGet(accessTokenUrl, null, null);
		} catch (Exception ex) {
			logger.error("getAccessToken request exception.", ex);
			throw new ServiceException("getAccessToken request exception:" + ex.getMessage());
		}
		checkGetAccessTokenResponse(response);
		logger.info("get accessToken({}) with response:{}", accessTokenUrl, response.getBody());
		JSONObject accessTokenJson = new JSONObject(response.getBody());
		MpAccessToken mpAccessToken = new MpAccessToken(accessTokenJson.getString("access_token"),
				accessTokenJson.getLong("expires_in"));
		return mpAccessToken;
		} catch (Exception ex) {

			logger.error("requestAccessToken exception.", ex);
			return null;
		}

	}

	private void checkGetAccessTokenResponse(SimpleHttpResponse response) {
		logger.info("Response with statusCode:{},body:{}", response.getStatusCode(), response.getBody());
		final int statusCode = response.getStatusCode();
		if (statusCode >= 200 && statusCode <= 300) {
			JSONObject respBodyJson = new JSONObject(response.getBody());
			if (respBodyJson.opt(ERRCODE) != null) {
				int errcode = respBodyJson.getInt(ERRCODE);
				String errmsg = respBodyJson.getString(ERRMSG);
				logger.error("Response with errcode:{},erromsg:{}", errcode, errmsg);
				throw new ServiceException("Response with errcode:" + errcode + ",errmsg:" + errmsg);
			}

		} else {
			logger.error("Response with error statusCode({})", statusCode);
			throw new ServiceException("Response with error statusCode:" + statusCode);
		}

	}

	private void checkSendMessageResponse(SimpleHttpResponse response) {
		logger.info("Response with statusCode:{},body:{}", response.getStatusCode(), response.getBody());
		final int statusCode = response.getStatusCode();
		if (statusCode >= 200 && statusCode <= 300) {
			JSONObject respBodyJson = new JSONObject(response.getBody());

			if (respBodyJson.opt(ERRCODE) != null) {
				int errcode = respBodyJson.getInt(ERRCODE);
				String errmsg = respBodyJson.getString(ERRMSG);
				if (errcode == 0) {
					logger.info("send message success.");

				} else {
				logger.error("Response with errcode:{},erromsg:{}", errcode, errmsg);
				throw new ServiceException("Response with errcode:" + errcode + ",errmsg:" + errmsg);
				}
			}

		} else {
			logger.error("Response with error statusCode({})", statusCode);
			throw new ServiceException("Response with error statusCode:" + statusCode);
		}

	}

	@Override
	public void afterPropertiesSet() throws Exception {
		logger.info("Init wx mpaccesstoken....");
		List<Wxappinfo> wxappinfos = this.wxappinfoMapper.selectAllWxappinfo(Wxappinfo.WX_MP_TYPE);
		if (wxappinfos != null && wxappinfos.size() > 0) {
			for (Wxappinfo wxappinfo : wxappinfos) {
				try {
					this.refreshAccessToken(wxappinfo.getOrgid());
				} catch (Exception ex) {
					logger.error("Refresh accessToken exception.", ex);
				}
			}
		}
		logger.info("Start token refresh thread...");
		Thread t1 = new TokenRefreshThread();
		t1.start();
	}

	public class TokenRefreshThread extends Thread {
		public TokenRefreshThread() {
			super("token-refresh-thread");
		}

		@Override
		public void run() {

			while (true) {
				try {
					Set<Integer> orgIdKeys = mpAccessTokenMap.keySet();
					for (Integer orgIdKey : orgIdKeys) {
						logger.info("Check orgid:{} MpAccessToken", orgIdKey);
						MpAccessToken mpAccessToken = mpAccessTokenMap.get(orgIdKey);
						if (mpAccessToken == null
								|| System.currentTimeMillis() - mpAccessToken.getCreatets() > 60 * 60 * 1000L) {

							logger.info("orgId={},MpAccessToken({}) is expired(cur={}),do refresh......", new Object[] {
									orgIdKey, mpAccessToken, System.currentTimeMillis() });
							refreshAccessToken(orgIdKey);
							continue;
						} else {

							logger.info("Print orgId={},MPAccessToken({}) ", orgIdKey, mpAccessToken);
						}

					}
					CommonUtils.sleep(10 * 1000L);

				} catch (Exception ex) {

					logger.error("TokenRefreshThread ocuured exception. ", ex);

				}

			}

		}
	}


}
