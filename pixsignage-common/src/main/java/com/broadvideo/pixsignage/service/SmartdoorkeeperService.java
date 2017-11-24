package com.broadvideo.pixsignage.service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsignage.common.ApiRetCodeEnum;
import com.broadvideo.pixsignage.common.DoorConst;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.util.CommonUtils;
import com.broadvideo.pixsignage.vo.TerminalBinding;

public class SmartdoorkeeperService implements InitializingBean {
	private final static Logger logger = LoggerFactory.getLogger(SmartdoorkeeperService.class);
	private final static Object lock = new Object();
	private final Map<String, TerminalBinding> userBindingsMap = new HashMap<String, TerminalBinding>();
	private final Map<String, String> terminalUserMap = new HashMap<String, String>();
	@Autowired
	private SmartdoorService smartdoorService;
	private Thread clearTask = null;

	/**
	 * 关注公众号触发binding
	 * 
	 * @param wxuserid
	 * @param terminalid
	 * @param wxmpid
	 * @param event
	 * @param eventtime
	 * @param orgid
	 * @return
	 */
	public boolean bind(String terminalid, String wxuserid, String wxmpid, String event, Long eventtime,
			Integer orgid) {
		synchronized (lock) {
			TerminalBinding newBinding = new TerminalBinding(terminalid, wxuserid, wxmpid, event, eventtime, orgid);
			newBinding.setAuthorizestate(DoorConst.DoorAuthorizeState.SUBSCRIBE.getVal());
			userBindingsMap.put(wxuserid, newBinding);
		}
		return true;

	}

	/**
	 * 根据微信用户id获取终端binding
	 * 
	 * @param wxuserid
	 * @return
	 */
	public TerminalBinding getBinding(String wxuserid) {

		synchronized (lock) {
			return userBindingsMap.get(wxuserid);

		}

	}

	/**
	 * 根据终端id查询进入用户授权的binding
	 * 
	 * @param terminalid
	 * @return
	 */
	public TerminalBinding getAuthorizedBinding(String terminalid) {

		synchronized (lock) {
			String wxuserid = terminalUserMap.get(terminalid);
			return getBinding(wxuserid);
		}

	}

	public void unbind(String wxuserid) {

		synchronized (lock) {

			TerminalBinding binding = getBinding(wxuserid);
			if (binding != null) {
				try {
					smartdoorService.saveDoorlog(binding);
				} catch (Exception ex) {
					logger.error("Save door log error.", ex);
				}
				terminalUserMap.remove(binding.getTerminalid());
				userBindingsMap.remove(wxuserid);

			}


		}

	}

	/**
	 * 获取终端的开门授权状态
	 * 
	 * @param terminalid
	 * @return
	 */
	public JSONObject getDoorAuthorizeState(String terminalid) {
		JSONObject resultJson = new JSONObject();
		if (!terminalUserMap.containsKey(terminalid)) {
			logger.info("terminalid({}) has not authorized.");
			resultJson.put("authorize_state", DoorConst.DoorAuthorizeState.INIT.getVal());
			return resultJson;
		}
		String wxuserid= terminalUserMap.get(terminalid);
		TerminalBinding binding=getBinding(wxuserid);
		logger.info("wxuserid（{}）,terminalid({})current authorizestate({})", new Object[] { wxuserid, terminalid,
				binding.getAuthorizestate() });
		JSONObject doorJson = new JSONObject();
		doorJson.put("authorize_state", binding.getAuthorizestate());
		doorJson.put("door_type", binding.getDoortype());
		doorJson.put("state", DoorConst.DoorState.SUCCESS.getVal());
		resultJson.put("door_action", doorJson);
		return resultJson;
	}

	/**
	 * 用户通过公众号发送授权终端开门
	 * 
	 * @param wxuserid
	 * @param terminalid
	 * @param doorType
	 */
	public boolean authorizeOpenDoor(String wxuserid, String doorType) {
		synchronized (lock) {
			TerminalBinding binding = getBinding(wxuserid);
			if (binding == null) {
				logger.error("No binding for wxuserid({})", wxuserid);
				return false;
			}
			if (terminalUserMap.containsKey(binding.getTerminalid())) {
				logger.error("openDoor fail.terminalid({}) already authorize open by wxuserid({})",
						binding.getTerminalid(),
						wxuserid);
				return false;
			}
			binding.setAuthorizestate(DoorConst.DoorAuthorizeState.OPEN.getVal());
			binding.setDoortype(doorType);
			terminalUserMap.put(binding.getTerminalid(), wxuserid);

		}
		return true;

	}

	/**
	 * 终端上报开关门状态
	 * 
	 * @param terminalid
	 */
	public void doorStateCallback(String terminalid, String actionType, String state) {
		if (!terminalUserMap.containsKey(terminalid)) {
			logger.error("开门状态不满足，terminalid({})未授权开门.");
			throw new ServiceException(ApiRetCodeEnum.TERMINAL_NOAUTH_OPT_DOOR, "终端未授权开门");
		}
		String wxuserid = terminalUserMap.get(terminalid);
		TerminalBinding binding = getBinding(wxuserid);
		if (binding == null) {
			logger.error("wxuserid({})与terminalid({})不存在绑定关系.", wxuserid, terminalid);
			throw new ServiceException(ApiRetCodeEnum.TERMINAL_NOBINDING_USER, "终端未授权开门");
		}
		logger.info("terminalid({}) with actionType({}) and state({})", new Object[] { terminalid, actionType, state });
		if (DoorConst.ActionType.ACTION_OPEN.getVal().equals(actionType)) {
			binding.setOpenstate(state);
			binding.setOpentime(new Date());
		} else if (DoorConst.ActionType.ACTION_CLOSE.getVal().equals(actionType)) {
			binding.setClosestate(state);
			binding.setClosetime(new Date());
			logger.info("Close door for terminalid({})", terminalid);
			unbind(binding.getWxuserid());

		}
		



	}

	@Override
	public void afterPropertiesSet() throws Exception {

		clearTask = new ClearTimeoutBindingsTask();
		logger.info("Start ClearTimeoutBindingsTask......");
		clearTask.start();
	}


	public class ClearTimeoutBindingsTask extends Thread {

		private final Logger logger = LoggerFactory.getLogger(getClass());

		public ClearTimeoutBindingsTask() {

			super("ClearTimeoutBindingsTask");
		}

		@Override
		public void run() {

			while (true) {
				try {
					if (userBindingsMap == null || userBindingsMap.size() == 0) {

						CommonUtils.sleep(2 * 1000L);
						logger.info("no binding records");
						continue;
					}

					Set<String> keySet = userBindingsMap.keySet();
					logger.info("check terminal state......");
					for (String key : keySet) {

						logger.info("check terminalid:{}", key);
						TerminalBinding binding = userBindingsMap.get(key);
						long createtime = binding.getCreatets();
						if (System.currentTimeMillis() - createtime >= 5 * 60 * 1000L) {
							logger.info("terminalid={},createtime={} binding over 30s,do unbinding... ",
									binding.getTerminalid(), binding.getCreatetime());
							unbind(key);
						}
					}
					logger.info("check terminal  end......,sleep 5s");
					CommonUtils.sleep(5 * 1000L);
				} catch (Exception ex) {
					CommonUtils.sleep(2 * 1000L);
					logger.error("thread unbinding  exception.", ex);
					continue;
				}

			}

		}

	}

}
