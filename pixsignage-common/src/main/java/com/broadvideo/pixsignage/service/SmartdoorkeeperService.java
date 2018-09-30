package com.broadvideo.pixsignage.service;

import java.util.Date;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.commons.collections.keyvalue.MultiKey;
import org.apache.commons.collections.map.MultiKeyMap;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsignage.common.ApiRetCodeEnum;
import com.broadvideo.pixsignage.common.DoorConst;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.common.WxmpMessageTipsFactory;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Smartbox;
import com.broadvideo.pixsignage.persistence.OrgMapper;
import com.broadvideo.pixsignage.persistence.SmartboxMapper;
import com.broadvideo.pixsignage.util.CommonUtil;
import com.broadvideo.pixsignage.vo.TerminalBinding;

public class SmartdoorkeeperService implements InitializingBean {
	private final static Logger logger = LoggerFactory.getLogger(SmartdoorkeeperService.class);
	private final static Object lock = new Object();
	private final Map<String, TerminalBinding> userBindingsMap = new ConcurrentHashMap<String, TerminalBinding>();
	private final Map<String, TerminalBinding> terminalBindingsMap = new ConcurrentHashMap<String, TerminalBinding>();

	private final MultiKeyMap doorUserMap = new MultiKeyMap();
	@Autowired
	private SmartboxService smartboxService;
	@Autowired
	private WxMpService wxmpService;
	@Autowired
	private SmartboxMapper smartboxMapper;
	@Autowired
	private OrgMapper orgMapper;

	private static Thread clearTask = null;

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
	public boolean bind(String terminalid, String wxuserid, String wxmpid, String event, Long eventtime, Integer orgid) {
		synchronized (lock) {
			// 检查微信用户是否已经发送授权开门中
			if (userBindingsMap.containsKey(wxuserid)) {
				TerminalBinding existsBinding = userBindingsMap.get(wxuserid);
				if (DoorConst.DoorAuthorizeState.OPEN.getVal().equals(existsBinding.getAuthorizestate())) {
					logger.error("wxuserid({})already authorized open door,Could not bind.", wxuserid);
					return false;
				}
			}
			TerminalBinding newBinding = new TerminalBinding(terminalid, wxuserid, wxmpid, event, eventtime, orgid);
			Smartbox smartbox = this.smartboxMapper.selectByTerminalid(terminalid, orgid);
			if (smartbox != null) {
				newBinding.setDoorversion(smartbox.getDoorversion());
			} else {
				newBinding.setDoorversion(DoorConst.DoorVersion.VERSION_1.getVal());
			}
			newBinding.setAuthorizestate(DoorConst.DoorAuthorizeState.SUBSCRIBE.getVal());
			userBindingsMap.put(wxuserid, newBinding);
			terminalBindingsMap.put(terminalid, newBinding);
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
		return userBindingsMap.get(wxuserid);

	}

	public TerminalBinding getBindingByTermminalid(String terminalid) {

		return terminalBindingsMap.get(terminalid);

	}

	/**
	 * 根据终端id查询进入用户授权的binding
	 * 
	 * @param terminalid
	 * @return
	 */
	public boolean isAuthorizedBinding(String terminalid, String doorType) {

		return doorUserMap.containsKey(terminalid, doorType);

	}

	public void unbind(String wxuserid) {

		synchronized (lock) {

			TerminalBinding binding = getBinding(wxuserid);
			if (binding != null) {
				try {
					if (binding.getOpentime() != null && binding.getOpenstate() != null) {
						smartboxService.savelog(binding);
					}
				} catch (Exception ex) {
					logger.error("Save door log error.", ex);
				}
				// 移除terminalid、wxuserid、doortype绑定关系
				doorUserMap.remove(binding.getTerminalid(), binding.getDoortype());
				userBindingsMap.remove(wxuserid);
				terminalBindingsMap.remove(binding.getTerminalid());
			}

		}

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
			// 检查wxuserid是否已经在终端上存在授权,则不允许在发送其他的授权开门请求
			if (doorUserMap.containsValue(wxuserid)) {
				logger.info("wxuserid({}) had Authorized open door.", wxuserid);
				return false;
			}
			binding.setAuthorizestate(DoorConst.DoorAuthorizeState.OPEN.getVal());
			binding.setAuthorizeopentime(new Date());
			binding.setDoortype(doorType);
			doorUserMap.put(binding.getTerminalid(), doorType, wxuserid);

		}
		return true;

	}

	/**
	 * 获取终端的开门授权状态
	 * 
	 * @param terminalid
	 * @return
	 */
	public JSONArray getDoorAuthorizeState(String terminalid) {

		JSONArray dataArr = new JSONArray();
		// 上柜门
		String upDoorType = DoorConst.DoorType.UP.getVal();
		dataArr.put(buildDoorState(terminalid, upDoorType, (String) doorUserMap.get(terminalid, upDoorType)));
		// 下柜门
		String downDoorType = DoorConst.DoorType.DOWN.getVal();
		dataArr.put(buildDoorState(terminalid, downDoorType, (String) doorUserMap.get(terminalid, downDoorType)));
		return dataArr;
	}

	private JSONObject buildDoorState(String terminalid, String doorType, String wxuserid) {

		JSONObject resultJson = new JSONObject();
		resultJson.put("door_type", doorType);
		String authorizedVal = null;
		TerminalBinding binding = terminalBindingsMap.get(terminalid);
		if (binding == null) {

			authorizedVal = DoorConst.DoorAuthorizeState.INIT.getVal();

		} else {

			if (DoorConst.DoorVersion.VERSION_1.getVal().equals(binding.getDoorversion())) {

				if (StringUtils.isNotBlank(wxuserid)) {
					authorizedVal = DoorConst.DoorAuthorizeState.OPEN.getVal();
					logger.info("terminalid({}) door({}) authorized by wxuserid({})", new Object[] { terminalid,
							doorType, wxuserid });
				} else {
					authorizedVal = DoorConst.DoorAuthorizeState.INIT.getVal();

				}

			} else if (DoorConst.DoorVersion.VERSION_2.getVal().equals(binding.getDoorversion())) {

				authorizedVal = binding.getAuthorizestate();

			} else {

				authorizedVal = DoorConst.DoorAuthorizeState.INIT.getVal();

			}
		}
		resultJson.put("authorize_state", authorizedVal);

		return resultJson;

	}

	/**
	 * 终端上报开关门状态
	 * 
	 * @param terminalid
	 */
	public void doorStateCallback(String terminalid, String doorType, String actionType, String state) {
		if (!doorUserMap.containsKey(terminalid, doorType)) {
			logger.error("终端上报状态不匹配，terminalid({}) doorType({})未授权开门.", terminalid, doorType);
			throw new ServiceException(ApiRetCodeEnum.TERMINAL_NOAUTH_OPT_DOOR, "终端未授权开门");
		}
		String wxuserid = (String) doorUserMap.get(terminalid, doorType);
		TerminalBinding binding = getBinding(wxuserid);
		if (binding == null) {
			logger.error("wxuserid({})与terminalid({})不存在绑定关系.", wxuserid, terminalid);
			throw new ServiceException(ApiRetCodeEnum.TERMINAL_NOBINDING_USER, "终端未授权开门");
		}
		logger.info("terminalid({}) doorType({}) with actionType({}) and state({})", new Object[] { terminalid,
				doorType, actionType, state });
		// 上报开门状态
		if (DoorConst.ActionType.ACTION_OPEN.getVal().equals(actionType)) {

			if (DoorConst.DoorState.SUCCESS.getVal().equals(binding.getOpenstate())) {
				logger.info("terminalid({}) doorType({}) openstate({}) has already success.", new Object[] {
						terminalid, doorType, binding.getOpenstate() });
				return;
			}
			if (state.equals(binding.getOpenstate())) {
				logger.info("terminalid({}) doorType({}) openstate({}) repeat report.", terminalid, doorType, state);
				return;
			}
			binding.setOpenstate(state);
			binding.setOpentime(new Date());
			if (state.equals(DoorConst.DoorState.FAIL.getVal())) {
				logger.error("terminalid({}) open door({}) fail.", terminalid, doorType);
			} else if (state.equals(DoorConst.DoorState.SUCCESS.getVal())) {
				logger.error("terminalid({}) open door({}) success.send message to user", terminalid, doorType);
				Org org = orgMapper.selectByPrimaryKey(binding.getOrgid() + "");
				wxmpService.sendMessage(wxmpService.getAccessToken(binding.getOrgid(), false).getAccessToken(),
						wxuserid, WxmpMessageTipsFactory.getWxmpMessageTips(org.getCode()).DOOR_OPEN_SUCESS_TIP,
						binding.getOrgid());
			}

		} else if (DoorConst.ActionType.ACTION_CLOSE.getVal().equals(actionType)) {// 上报关门状态
			binding.setClosestate(state);
			binding.setClosetime(new Date());
			logger.info("Close door({}) for terminalid({})", doorType, terminalid);
			unbind(binding.getWxuserid());

		}

	}

	public void doorStateCallback(String terminalid, String doorType, String actionType, String state,
			Integer stocknum, String extra) {

		TerminalBinding binding = getBindingByTermminalid(terminalid);
		if (binding == null) {
			logger.error("terminalid({})不存在绑定关系.", terminalid);
			throw new ServiceException(ApiRetCodeEnum.TERMINAL_NOAUTH_OPT_DOOR, "终端未授权开门");
		}
		// 刷新库存
		Smartbox smartbox = this.smartboxMapper.selectByTerminalid(terminalid, binding.getOrgid());
		smartbox.setStocknum(stocknum);
		smartbox.setQrcodeid("");
		this.smartboxMapper.updateByPrimaryKeySelective(smartbox);
		logger.info("doorStateCallback:terminalid({})  stocknum({}) extra({})",
				new Object[] { terminalid, state, extra });
		// 上报开门状态
		if (DoorConst.DoorState.SUCCESS.getVal().equals(binding.getOpenstate())) {
			logger.info("terminalid({}) doorType({}) openstate({}) has already success.", new Object[] { terminalid,
					doorType, binding.getOpenstate() });
			return;
		}
		if (state.equals(binding.getOpenstate())) {
			logger.info("terminalid({}) doorType({}) openstate({}) repeat report.", terminalid, doorType, state);
			return;
		}
		binding.setStocknum(stocknum);
		binding.setExtra(extra);
		binding.setOpenstate(state);
		binding.setOpentime(new Date());
		if (state.equals(DoorConst.DoorState.FAIL.getVal())) {
			logger.error("doorStateCallback:terminalid({}) open door({}) fail.", terminalid, doorType);
		} else if (state.equals(DoorConst.DoorState.SUCCESS.getVal())) {
			try {
				logger.error("doorStateCallback:terminalid({}) open door({}) success.send message to user", terminalid,
						doorType);
				Org org = orgMapper.selectByPrimaryKey(binding.getOrgid() + "");
				wxmpService.sendMessage(wxmpService.getAccessToken(binding.getOrgid(), false).getAccessToken(),
						binding.getWxuserid(),
						WxmpMessageTipsFactory.getWxmpMessageTips(org.getCode()).DOOR_OPEN_SUCESS_TIP2,
						binding.getOrgid());
			} catch (Exception ex) {
				ex.printStackTrace();
			}
		}
		logger.info("Close door({}) for terminalid({})", doorType, terminalid);
		unbind(binding.getWxuserid());

	}

	@Override
	public void afterPropertiesSet() throws Exception {
		if (clearTask != null) {
			logger.info("clearTask({}) had inited.", clearTask.getName());
			return;

		}
		clearTask = new ClearTimeoutBindingsTask();
		logger.info("Start ClearTimeoutBindingsTask......");
		clearTask.start();

	}

	public static void main(String[] args) {
		MultiKeyMap multiKeyMap = new MultiKeyMap();
		multiKeyMap.put("00001", "0", "wxuser0001");
		multiKeyMap.put("00002", "1", "wxuser0002");
		MultiKey multiKey = new MultiKey("00001", "0");
		System.out.println("key exits:" + multiKeyMap.containsKey(multiKey));
		System.out.println("get value:" + multiKeyMap.get("00001", "0"));
		System.out.println("get value:" + multiKeyMap.get("00001"));

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

						CommonUtil.sleep(5 * 1000L);
						logger.info("no binding records");
						continue;
					}

					Set<String> keySet = userBindingsMap.keySet();
					logger.info("check binding state......");
					for (String key : keySet) {

						logger.info("check wxuserid:{}", key);
						TerminalBinding binding = userBindingsMap.get(key);
						if (System.currentTimeMillis() - binding.getCreatets() >= 2 * 60 * 1000L) {
							logger.info(
									"wxuserid({}) and terminalid({}),createtime({}) binding over 120s,do unbinding... ",
									new Object[] { binding.getWxuserid(), binding.getTerminalid(),
											binding.getCreatets() });
							unbind(key);
						}
					}
					logger.info("check binding  end......,sleep 5s");
					CommonUtil.sleep(5 * 1000L);
				} catch (Exception ex) {
					CommonUtil.sleep(5 * 1000L);
					logger.error("thread unbinding  exception.", ex);
					continue;
				}

			}

		}

	}

}
