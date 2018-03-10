package com.broadvideo.pixsignage.action;

import java.util.Calendar;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Phonetoken;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.persistence.PhonetokenMapper;
import com.broadvideo.pixsignage.persistence.StaffMapper;
import com.broadvideo.pixsignage.service.OrgService;
import com.broadvideo.pixsignage.util.CommonUtil;
import com.broadvideo.pixsignage.util.HuaweiUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("registerAction")
public class RegisterAction extends BaseAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private StaffMapper staffMapper;
	@Autowired
	private PhonetokenMapper phonetokenMapper;
	@Autowired
	private OrgService orgService;

	public String doValidate() {
		try {
			String vspid = getParameter("vspid");
			String username = getParameter("username");
			String phone = getParameter("phone");
			if (username == null && phone == null) {
				setErrorcode(-1);
				return ERROR;
			}
			if (username != null && username.length() > 0) {
				if (username.equals("root") || username.equals("super") || username.equals("system")
						|| username.equals("admin")) {
					setErrorcode(-1);
					return ERROR;
				}
				Staff staff = staffMapper.select2cByLoginname(vspid, username);
				if (staff == null) {
					return SUCCESS;
				} else {
					setErrorcode(-1);
					return ERROR;
				}
			} else if (phone != null && phone.length() > 0) {
				Staff staff = staffMapper.select2cByPhone(vspid, phone);
				if (staff == null) {
					return SUCCESS;
				} else {
					setErrorcode(-1);
					return ERROR;
				}
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("OrgAction doValidate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doGetVCode() {
		try {
			String phone = getParameter("phone");
			Random r = new Random();
			String vcode = "";
			for (int i = 0; i < 6; i++) {
				int random = r.nextInt(10);
				vcode += random;
			}
			Phonetoken phonetoken = phonetokenMapper.selectByPrimaryKey(phone);
			if (phonetoken == null) {
				phonetoken = new Phonetoken();
				phonetoken.setPhone(phone);
				phonetoken.setToken(vcode);
				phonetoken.setUpdatetime(Calendar.getInstance().getTime());
				phonetokenMapper.insert(phonetoken);
			} else {
				phonetoken.setToken(vcode);
				phonetoken.setUpdatetime(Calendar.getInstance().getTime());
				phonetokenMapper.updateByPrimaryKey(phonetoken);
			}
			HuaweiUtil.smsPublish(phone, vcode);
		} catch (Exception e) {
			logger.error("SMP send error, ", e);
			setErrorcode(-1);
			return ERROR;
		}
		return SUCCESS;
	}

	public String doRegister() {
		String vspid = getParameter("vspid");
		String username = getParameter("username");
		String password = getParameter("password");
		String phone = getParameter("phone");
		String vcode = getParameter("vcode");
		try {
			logger.info("Begin to register a new user, vspid={}, username={}, password={}, phone={}, vocde={}", vspid,
					username, password, phone, vcode);
			Staff staff1 = staffMapper.select2cByLoginname(vspid, username);
			Staff staff2 = staffMapper.select2cByPhone(vspid, phone);
			if (staff1 != null || staff2 != null) {
				logger.info("Failed to register, for conflicted username or phone");
				setErrorcode(-1);
				return ERROR;
			}
			Phonetoken phonetoken = phonetokenMapper.selectByPrimaryKey(phone);
			if (phonetoken == null || !phonetoken.getToken().equals(vcode)) {
				logger.info("Failed to register for token not match");
				setErrorcode(-1);
				return ERROR;
			}
			orgService.addOrg2c(vspid, username, phone, CommonUtil.getPasswordMd5(username, password));
			logger.info("Success to register, vspid={}, username={}, password={}, phone={}, vocde={}", vspid, username,
					password, phone, vcode);
		} catch (Exception e) {
			logger.info("Failed to register. ", e);
			setErrorcode(-1);
			return ERROR;
		}
		return SUCCESS;
	}

}
