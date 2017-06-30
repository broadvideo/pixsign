package com.broadvideo.pixsignage.action;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.struts2.ServletActionContext;

import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Staff;
import com.opensymphony.xwork2.ActionSupport;

public class BaseAction extends ActionSupport {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7777103733798238906L;

	private String dataid = "";
	private int errorcode = 0;
	private String errormsg = "";
	private Object data = "";

	public String getDataid() {
		return dataid;
	}

	public void setDataid(String dataid) {
		this.dataid = dataid;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

	public int getErrorcode() {
		return errorcode;
	}

	public void setErrorcode(int errorcode) {
		this.errorcode = errorcode;
	}

	public String getErrormsg() {
		return errormsg;
	}

	public void setErrormsg(String errormsg) {
		this.errormsg = errormsg;
	}

	public void renderError(int errorcode, String errormsg) {
		setErrorcode(errorcode);
		setErrormsg(errormsg);
	}

	/**
	 * get http session.
	 * 
	 * @return http session
	 */
	public final HttpSession getSession() {
		return getHttpServletRequest().getSession(true);
	}

	/**
	 * get http request.
	 * 
	 * @return http request
	 */
	public final HttpServletRequest getHttpServletRequest() {
		HttpServletRequest request = ServletActionContext.getRequest();

		return request;
	}

	public final HttpServletResponse getHttpServletResponse() {
		HttpServletResponse response = ServletActionContext.getResponse();

		return response;
	}

	/**
	 * 
	 * @param name
	 * @return
	 */
	public final String getParameter(String name) {
		return getHttpServletRequest().getParameter(name);
	}

	/**
	 * Get the login staff
	 * 
	 * @return
	 */
	public final Staff getLoginStaff() {
		return (Staff) getSession().getAttribute(CommonConstants.SESSION_STAFF);
	}

	public final Integer getStaffid() {
		return getLoginStaff().getStaffid();
	}

	public final Integer getStaffOrgid() {

		return getLoginStaff().getOrgid();

	}
}
