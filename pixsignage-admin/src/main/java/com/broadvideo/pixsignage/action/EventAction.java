package com.broadvideo.pixsignage.action;

import java.util.Date;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.domain.Event;
import com.broadvideo.pixsignage.service.EventService;
import com.broadvideo.pixsignage.util.DateUtil;
import com.broadvideo.pixsignage.util.SqlUtil;
import com.broadvideo.pixsignage.util.Struts2Utils;

@SuppressWarnings("serial")
@Scope("request")
@Controller("eventAction")
public class EventAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());
	private Event event;
	@Resource(name = "vipeventService")
	private EventService eventService;

	public String doList() {
		try {
			PageInfo pageInfo = super.initPageInfo();
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			if (event == null) {
				event = new Event();
			}
			event.setSearch(search);
			event.setOrgid(getStaffOrgid());
			PageResult pageResult = this.eventService.getEventList(event, pageInfo);
			this.setiTotalRecords(pageResult.getTotalCount());
			this.setiTotalDisplayRecords(pageResult.getTotalCount());
			this.setAaData(pageResult.getResult());
			return SUCCESS;

		} catch (Exception ex) {
			logger.error("eventAction doList exception, ", ex);
			renderError(RetCodeEnum.EXCEPTION, ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		String starttime = Struts2Utils.getParameter("event.starttime");
		String endtime = Struts2Utils.getParameter("event.endtime");
		if (StringUtils.isBlank(event.getName()) || event.getRoomid() == null || starttime == null || endtime == null) {

			logger.error("doAdd event：缺少参数.");
			renderError(null, "缺少参数.");
			return ERROR;
		}
		event.setStarttime(DateUtil.getDate(starttime, "yyyy-MM-dd HH:mm"));
		event.setEndtime(DateUtil.getDate(endtime, "yyyy-MM-dd HH:mm"));
		event.setCreatestaffid(getStaffid());
		event.setOrgid(getStaffOrgid());
		eventService.addEvent(event);
		return SUCCESS;
	}

	public String doUpdate() {
		try {
			String starttime = Struts2Utils.getParameter("event.starttime");
			String endtime = Struts2Utils.getParameter("event.endtime");
			if (event.getEventid() == null || starttime == null || endtime == null) {
				logger.error("doUpdate event：缺少参数.");
				renderError(null, "缺少参数.");
				return ERROR;
			}
			if (StringUtils.isNotBlank(starttime)) {
				event.setStarttime(DateUtil.getDate(starttime, "yyyy-MM-dd HH:mm"));
			}
			if (StringUtils.isNotBlank(endtime)) {
				event.setEndtime(DateUtil.getDate(endtime, "yyyy-MM-dd HH:mm"));
			}
			event.setUpdatetime(new Date());
			event.setUpdatestaffid(getStaffid());
			event.setOrgid(getStaffOrgid());
			eventService.updateEvent(event);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doUpdate exception", ex);
			renderError(ex, null);
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			event.setUpdatestaffid(getStaffid());
			event.setOrgid(getStaffOrgid());
			eventService.deleteEvent(event);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("doDelete exception", ex);
			renderError(ex, null);
			return ERROR;
		}
	}

	public Event getEvent() {
		return event;
	}

	public void setEvent(Event event) {
		this.event = event;
	}






}
