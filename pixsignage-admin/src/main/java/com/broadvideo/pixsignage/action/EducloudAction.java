package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Privilege;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.persistence.OrgMapper;
import com.broadvideo.pixsignage.persistence.StaffMapper;
import com.broadvideo.pixsignage.service.PrivilegeService;
import com.broadvideo.pixsignage.util.EduCloudUtil;
import com.opensymphony.xwork2.ActionContext;

import net.sf.json.JSONObject;

@SuppressWarnings("serial")
@Scope("request")
@Controller("educloudAction")
public class EducloudAction extends BaseAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private ConfigMapper configMapper;
	@Autowired
	private OrgMapper orgMapper;
	@Autowired
	private StaffMapper staffMapper;
	@Autowired
	private PrivilegeService privilegeService;

	public String doInit() throws Exception {
		String callback = "http://" + configMapper.selectValueByCode("ServerIP") + ":"
				+ configMapper.selectValueByCode("ServerPort") + "/pixsignage/org/educloudcallback.action";
		String authUrl = EduCloudUtil.buildSSOAuthUrl(callback);
		this.getHttpServletResponse().sendRedirect(authUrl);
		return SUCCESS;
	}

	public String doCallback() throws Exception {
		ActionContext context = ActionContext.getContext();
		HttpSession session = this.getSession();
		String accessToken = this.getParameter("access_token");
		try {
			String userInfo = EduCloudUtil.getUserInfo(accessToken);
			if (userInfo.length() > 0) {
				JSONObject userJson = JSONObject.fromObject(userInfo);
				session.setAttribute(CommonConstants.SESSION_EDUCLOUD_UID, userJson.getString("identityId"));
				session.setAttribute("accessToken", accessToken);
				session.setAttribute("userInfo", userInfo);

				String idtype = userJson.getString("identityType");
				String uid = userJson.getString("identityId");
				String username = userJson.getString("userName");
				String nickname = userJson.getString("nickName");
				if (!idtype.equals("2")) {
					logger.error("Educloud user is not admin, identityType={}", idtype);
					context.put("message", "非管理员，无权访问此页面");
					// this.getHttpServletResponse().sendRedirect("/pixsignage/error.jsp");
					return ERROR;
				}
				String code = userJson.getString("orgCode");
				Org org = orgMapper.selectByCode(code);
				if (org == null) {
					logger.error("Educloud org not found, code={}", code);
					context.put("message", "不存在的组织代码" + code + ", 请联系管理员");
					// this.getHttpServletResponse().sendRedirect("/pixsignage/error.jsp");
					return ERROR;
				}
				Staff staff = staffMapper.selectBySource("2", uid);
				if (staff == null) {
					staff = new Staff();
					staff.setSourcetype("2");
					staff.setSourceid(uid);
					staff.setOrgid(org.getOrgid());
					staff.setBranchid(org.getTopbranchid());
					staff.setLoginname(username);
					staff.setPassword("");
					staff.setName(nickname);
					staff.setStatus("1");
					staff.setDescription("");
					staff.setSubsystem(CommonConstants.SUBSYSTEM_ORG);
					staff.setCreatestaffid(org.getCreatestaffid());
					staffMapper.insertSelective(staff);
					Privilege privilege = privilegeService.selectByPrimaryKey(CommonConstants.PRIVILEGE_SUPER);
					ArrayList<Privilege> privileges = new ArrayList<Privilege>();
					privileges.add(privilege);
					staffMapper.assignStaffPrivileges(staff, privileges);
					staff = staffMapper.selectByPrimaryKey("" + staff.getStaffid());
				}
				String token = UUID.randomUUID().toString().replaceAll("-", "");
				session.setAttribute(CommonConstants.SESSION_TOKEN, token);
				session.setAttribute(CommonConstants.SESSION_STAFF, staff);
				session.setAttribute(CommonConstants.SESSION_SUBSYSTEM, staff.getSubsystem());
				List<Privilege> pList = privilegeService.selectOrgTreeList(staff.getOrg());
				session.setAttribute(CommonConstants.SESSION_PRIVILEGES, pList);
				session.setAttribute(CommonConstants.SESSION_ORG, staff.getOrg());
				// this.getHttpServletResponse().sendRedirect("/pixsignage/org/main.jsp");
				return SUCCESS;
			} else {
				logger.error("EduCloudCallBackServlet userinfo is null");
				context.put("message", "无法获取用户信息");
				// this.getHttpServletResponse().sendRedirect("/pixsignage/error.jsp");
				return ERROR;
			}
		} catch (Exception e) {
			logger.error("EduCloudCallBackServlet exception, ", e);
			context.put("message", "系统异常，请联系管理员");
			// this.getHttpServletResponse().sendRedirect("/pixsignage/error.jsp");
			return ERROR;
		}
	}

}
