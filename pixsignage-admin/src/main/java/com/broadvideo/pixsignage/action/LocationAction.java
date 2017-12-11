package com.broadvideo.pixsignage.action;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang3.math.NumberUtils;
import org.apache.struts2.ServletActionContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Location;
import com.broadvideo.pixsignage.service.LocationService;

@SuppressWarnings("serial")
@Scope("request")
@Controller("locationAction")
public class LocationAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());
	private Location location;
	@Autowired
	private LocationService locationService;

	public String doList() {
		try {
			String parentid = getParameter("parentid");
			List<Object> aaData = new ArrayList<Object>();
			List<Location> locations = locationService.selectChildren(NumberUtils.toInt(parentid),
					getStaffOrgid());
			for (int i = 0; i < locations.size(); i++) {
				aaData.add(locations.get(i));
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doList exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public void doListNode() throws IOException {
		String id = getParameter("id");
		JSONArray locationArray = new JSONArray();
		if (id.equals("#")) {
			Location location = locationService.selectRootLocation(getStaffOrgid());
			JSONObject loctionJson = new JSONObject();
			loctionJson.put("id", location.getLocationid());
			loctionJson.put("parent", "#");
			loctionJson.put("text", location.getName());
			loctionJson.put("location", location);
			if (location.getChildrenCount() == 0) {
				loctionJson.put("children", false);
			} else {
				loctionJson.put("children", true);
			}
			locationArray.add(loctionJson);
		} else {
			List<Location> locations = locationService.selectChildren(NumberUtils.toInt(id), getStaffOrgid());
			for (Location location : locations) {
				JSONObject branchJson = new JSONObject();
				branchJson.put("id", location.getLocationid());
				branchJson.put("parent", id);
				branchJson.put("text", location.getName());
				branchJson.put("branch", location);
				if (location.getChildrenCount() == 0) {
					branchJson.put("children", false);
				} else {
					branchJson.put("children", true);
				}
				locationArray.add(branchJson);
			}
		}

		HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("application/json;charset=UTF-8");
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();
		out.println(locationArray.toString());
		out.flush();
		out.close();
	}

	public String doAdd() {
		try {
			location.setCreatestaffid(getLoginStaff().getStaffid());
			location.setCreatetime(new Date());
			location.setOrgid(getLoginStaff().getOrgid());
			locationService.addLocation(location);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doAdd exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {

			location.setUpdatetime(new Date());
			location.setUpdatestaffid(getLoginStaff().getStaffid());
			location.setOrgid(getStaffOrgid());
			locationService.updateLocation(location);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doUpdate exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			location.setUpdatestaffid(getStaffid());
			location.setOrgid(getStaffOrgid());
			locationService.deleteLocation(location);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doDelete exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doValidate() {
		try {
			if (location.getName() != null) {
				if (locationService.validateName(location, getLoginStaff().getOrgid())) {
					return SUCCESS;
				} else {
					setErrorcode(-1);
					setErrormsg("名称已存在");
					return ERROR;
				}
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doValidate exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}



	public Location getLocation() {
		return location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}


}
