package biz.videoexpress.pixedx.lmsapi.resource;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import biz.videoexpress.pixedx.lmsapi.common.ApiRetCodeEnum;
import biz.videoexpress.pixedx.lmsapi.common.AppException;
import biz.videoexpress.pixedx.lmsapi.common.EncryptionUtils;
import biz.videoexpress.pixedx.lmsapi.common.ServiceConstants;
import biz.videoexpress.pixedx.lmsapi.common.UserProfile;
import biz.videoexpress.pixedx.lmsapi.service.UsersCache;

import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.persistence.StaffMapper;

public class ResBase {

	public static final String Authorization = "Authorization";
	private static Logger LOG = LoggerFactory.getLogger(ResBase.class);
	@Resource
	protected UsersCache userCache;
	@Autowired
	protected StaffMapper staffMapper;

	public ResBase() {
		LOG.info("Resource " + this.getClass().getName() + " initialized.");
	}

	public static Integer getOrgId(HttpServletRequest req) {

		return (Integer) req.getSession().getServletContext().getAttribute("orgid");

	}

	/**
	 * 从缓存中获取当前登录用户的Profile，找不到则从Openedx中获取用户Profile
	 * 
	 * @param req
	 * @return
	 */
	public UserProfile currentUserProfile(HttpServletRequest req) {
		String auth = req.getHeader(Authorization);
		if (auth == null) {

			throw new AppException(ApiRetCodeEnum.NOT_LOGIN, "User not login");
		}
		UserProfile userProfile = userCache.getUser(auth);

		if (userProfile == null) {
			LOG.info("Can't get user from cache, do load");
			String[] authArr = auth.split("\\s+");
			String token = authArr[1];
			String plainToken = null;
			try {
				plainToken = EncryptionUtils.decrypt(ServiceConstants.ENCRYPT_KEY, token);
			} catch (Exception ex) {
				ex.printStackTrace();
				throw new AppException(ApiRetCodeEnum.INVALID_TOKEN, "Token is invalid");

			}
			String[] decodeArr = plainToken.split("\\|");
			String loginName = decodeArr[0];
			long expireIn = Long.parseLong(decodeArr[1]);
			if (System.currentTimeMillis() >= expireIn) {
				LOG.error("AccessToken is expired!");
				// throw new AppException(ApiRetCodeEnum.INVALID_TOKEN,
				// "AccessToken is expired");
			}
			Staff staff = null;
			try {
				List<Staff> staffs = staffMapper.selectByLoginname(loginName);
				if (staffs != null && staffs.size() > 0) {
					staff = staffs.get(0);
				}
			} catch (ServiceException e) {
				throw new AppException(ApiRetCodeEnum.EXCEPTION, "Load user excepton.");
			}
			if (staff == null) {
				throw new AppException(ApiRetCodeEnum.INVALID_TOKEN, "User can not found.");

			}
			userProfile = initUserProfile(req, staff);

		}

		return userProfile;
	}

	public UserProfile getUserProfile(HttpServletRequest req) {
		String auth = req.getHeader(Authorization);
		if (auth == null) {
			return null;
		}
		UserProfile userProfile = userCache.getUser(auth);

		if (userProfile == null) {
			LOG.info("Can't get user from cache, do load");
			String[] authArr = auth.split("\\s");
			String token = authArr[1];
			String plainToken = EncryptionUtils.decrypt(ServiceConstants.ENCRYPT_KEY, token);
			String[] decodeArr = plainToken.split("\\|");
			String loginName = decodeArr[0];
			long expireIn = Long.parseLong(decodeArr[1]);
			// if (System.currentTimeMillis() >= expireIn) {
			// LOG.error("AccessToken is expired!");

			// return null;
			// }
			Staff staff = null;
			try {
				List<Staff> staffs = this.staffMapper.selectByLoginname(loginName);
				if (staffs != null && staffs.size() > 0) {
					staff = staffs.get(0);
				}
			} catch (ServiceException e) {

				return null;
			}
			if (staff == null) {

				return null;

			}
			userProfile = initUserProfile(req, staff);

		}

		return userProfile;
	}

	public UserProfile initUserProfile(HttpServletRequest req, Staff staff) {
		String authHeader = req.getHeader(Authorization);
		UserProfile userProfile = new UserProfile();
		userProfile.setUsername(staff.getLoginname());
		userProfile.setUserId(staff.getStaffid());
		userProfile.setOrgId(staff.getOrgid());
		userProfile.setBranchid(staff.getBranchid());
		userProfile.setEmail("");
		userProfile.setAccessToken("");
		userProfile.setLastLogin(staff.getLogintime() != null ? staff.getLogintime().getTime() : null);
		userProfile.setName(staff.getName());
		userCache.addUser(authHeader, userProfile);
		return userProfile;

	}

}
