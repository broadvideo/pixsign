package com.broadvideo.pixsignage.common;

import java.util.HashMap;
import java.util.Map;

public class WxmpMessageTipsFactory {

	private static Map<String, WxmpMessageTips> orgWxmpMessageTipsMap = new HashMap<String, WxmpMessageTips>();
	static {
		orgWxmpMessageTipsMap.put("zls", new ZlsWxmpMessageTips());
		orgWxmpMessageTipsMap.put("default", new WxmpMessageTips());
	}

	public static WxmpMessageTips getWxmpMessageTips(String orgcode) {

		if (orgWxmpMessageTipsMap.containsKey(orgcode)) {

			return orgWxmpMessageTipsMap.get(orgcode);
		}

		return orgWxmpMessageTipsMap.get("default");
	}

	public static void main(String[] args) {

		System.out.println(getWxmpMessageTips("sdfds").DOOR_INVLIAD_INPUT_TIP);

	}

}
