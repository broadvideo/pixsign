package biz.videoexpress.pixedx.lmsapi.resource;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.BeanParam;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import biz.videoexpress.pixedx.lmsapi.bean.BasicPaginationResp;
import biz.videoexpress.pixedx.lmsapi.bean.MeetingReq;
import biz.videoexpress.pixedx.lmsapi.bean.MeetingRoomReq;
import biz.videoexpress.pixedx.lmsapi.bean.Pagination;
import biz.videoexpress.pixedx.lmsapi.common.ApiRetCodeEnum;
import biz.videoexpress.pixedx.lmsapi.common.AppException;
import biz.videoexpress.pixedx.lmsapi.common.BasicResp;

import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.domain.Attendee;
import com.broadvideo.pixsignage.domain.Meeting;
import com.broadvideo.pixsignage.domain.Meetingroom;
import com.broadvideo.pixsignage.service.LocationService;
import com.broadvideo.pixsignage.service.MeetingService;
import com.broadvideo.pixsignage.service.MeetingroomService;
import com.broadvideo.pixsignage.util.DateUtil;
import com.broadvideo.pixsignage.vo.LocationInfo;

@Component
@Path("/meetings")
@Produces(MediaType.APPLICATION_JSON)
public class ResMeetings extends ResBase {

	private Logger logger = LoggerFactory.getLogger(ResMeetings.class);
	@Autowired
	private LocationService locationService;
	@Autowired
	private MeetingroomService meetingroomService;
	@Autowired
	private MeetingService meetingService;
	@GET
	@Path("/meeting_room_categories")
	public Response getMeetingRoomCategories(@Context HttpServletRequest req) {
		BasicResp<LocationInfo> basicResp = new BasicResp<LocationInfo>();

		try {
			List<LocationInfo> locationInfos = this.locationService.getLocationTree(getOrgId(req));
			basicResp.setRetcode(ApiRetCodeEnum.SUCCESS);
			basicResp.setData(locationInfos);
		} catch (Exception e) {

			logger.error("Get course categories exception.", e);
			throw new AppException(ApiRetCodeEnum.EXCEPTION, "Get course categories exception.");
		}
		return Response.status(Status.OK).entity(basicResp).build();

	}
	@GET
	@Path("/meeting_rooms")
	public Response getMeetingRooms(@Context HttpServletRequest req, @BeanParam MeetingRoomReq meetingRoomReq) {
		// UserProfile profile = currentUserProfile(req);
		try {
			Integer orgId = getOrgId(req);
			com.broadvideo.pixsignage.common.PageInfo pageInfo=new com.broadvideo.pixsignage.common.PageInfo();
			pageInfo.setStart(meetingRoomReq.getStart());
			pageInfo.setLength(meetingRoomReq.getLength());
			Meetingroom sMeetingroom = new Meetingroom();
			sMeetingroom.setSearch(meetingRoomReq.getQuery());
			sMeetingroom.setLocationid(meetingRoomReq.getCategoryId());
			sMeetingroom.setPeoples(meetingRoomReq.getPeoples());
			sMeetingroom.setOrgid(orgId);
			sMeetingroom.setTerminalid(meetingRoomReq.getTerminalid());
			PageResult pageResult = meetingroomService.getMeetingroomList(sMeetingroom, pageInfo);
			BasicPaginationResp resp = new BasicPaginationResp();
			Pagination pagination = new Pagination();
			pagination.setStart(meetingRoomReq.getStart());
			pagination.setLength(meetingRoomReq.getLength());
			pagination.setTotal(pageResult.getTotalCount());
			resp.setRetcode(ApiRetCodeEnum.SUCCESS);
			resp.setPagination(pagination);
			List<Meetingroom> meetingrooms = pageResult.getResult();
			List<Map<String, Object>> results = new ArrayList<Map<String, Object>>();
			for (Meetingroom meetingroom : meetingrooms) {
				Map<String, Object> data = new HashMap<String, Object>();
				data.put("meeting_room_id", meetingroom.getMeetingroomid());
				data.put("name", meetingroom.getName());
				data.put("code", meetingroom.getCode());
				data.put("peoples", meetingroom.getPeoples());
				data.put("openflag", meetingroom.getOpenflag());
				data.put("audit_flag", meetingroom.getAuditflag());
				results.add(data);

			}

			resp.setData(results);
			return Response.status(Status.OK).entity(resp).build();

		} catch (Exception e) {

			logger.error("getMeetingRooms exception.", e);
			throw new AppException(ApiRetCodeEnum.EXCEPTION, "getMeetingRooms exception.");
		}

	}


	@GET
	@Path("/")
	public Response getMeetings(@Context HttpServletRequest req, @BeanParam MeetingReq meetingReq) {
		// UserProfile profile = currentUserProfile(req);

		try {
			Integer orgId = getOrgId(req);
			com.broadvideo.pixsignage.common.PageInfo pageInfo = new com.broadvideo.pixsignage.common.PageInfo();
			pageInfo.setStart(meetingReq.getStart());
			pageInfo.setLength(meetingReq.getLength());
			Meeting meeting = new Meeting();
			meeting.setSearch(meetingReq.getQuery());
			if (StringUtils.isNotBlank(meetingReq.getStartTime())) {
				meeting.setStarttime(DateUtil.getDate(meetingReq.getStartTime(), "yyyyMMddHHmm"));
			}
			if (StringUtils.isNotBlank(meetingReq.getEndTime())) {
				meeting.setEndtime(DateUtil.getDate(meetingReq.getEndTime(), "yyyyMMddHHmm"));
			}
			meeting.setMeetingroomid(meetingReq.getMeetingRoomId());
			meeting.setOrgid(orgId);
			meeting.setSearch(meetingReq.getQuery());
			PageResult pageResult = meetingService.getMeetingList(meeting, pageInfo);
			BasicPaginationResp resp = new BasicPaginationResp();
			Pagination pagination = new Pagination();
			pagination.setStart(meetingReq.getStart());
			pagination.setLength(meetingReq.getLength());
			pagination.setTotal(pageResult.getTotalCount());
			resp.setRetcode(ApiRetCodeEnum.SUCCESS);
			resp.setPagination(pagination);
			List<Meeting> meetings = pageResult.getResult();
			List<Map<String, Object>> results = new ArrayList<Map<String, Object>>();
			for (Meeting result : meetings) {
				Map<String, Object> data = new HashMap<String, Object>();
				data.put("meeting_id", result.getMeetingid());
				data.put("meetingroom_id", result.getMeetingroomid());
				data.put("subject", result.getSubject());
				data.put("description", result.getDescription());
				data.put("start_time", DateUtil.getDateStr(result.getStarttime(), "yyyy-MM-dd HH:mm:ss"));
				data.put("end_time", DateUtil.getDateStr(result.getEndtime(), "yyyy-MM-dd HH:mm:ss"));
				data.put("book_user", result.getBookstaffname());
				data.put("book_branch", result.getBookbranchname());
				data.put("qrcode", "");
				data.put("audit_status", result.getAuditstatus());
				List<Attendee> attendees = result.getAttendees();
				List<Map<String, Object>> attendeeMapList = new ArrayList<Map<String, Object>>();
				for (Attendee attendee : attendees) {
					Map<String, Object> attendeeMap = new HashMap<String, Object>();
					attendeeMap.put("attendee_id", attendee.getAttendeeid());
					attendeeMap.put("user_id", attendee.getStaffid());
					attendeeMap.put("name", attendee.getStaffname());
					attendeeMapList.add(attendeeMap);
				}
				data.put("attendees", attendeeMapList);
				results.add(data);

			}

			resp.setData(results);
			return Response.status(Status.OK).entity(resp).build();

		} catch (Exception e) {

			logger.error("getMeetingRooms exception.", e);
			throw new AppException(ApiRetCodeEnum.EXCEPTION, "getMeetingRooms exception.");
		}



	}


}
