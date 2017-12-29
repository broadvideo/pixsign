package biz.videoexpress.pixedx.lmsapi.resource;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.BeanParam;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import biz.videoexpress.pixedx.lmsapi.bean.AdjustMeetingReq;
import biz.videoexpress.pixedx.lmsapi.bean.BasicPaginationResp;
import biz.videoexpress.pixedx.lmsapi.bean.BookMeetingReq;
import biz.videoexpress.pixedx.lmsapi.bean.Pagination;
import biz.videoexpress.pixedx.lmsapi.bean.UserAuth;
import biz.videoexpress.pixedx.lmsapi.bean.UserAuthReq;
import biz.videoexpress.pixedx.lmsapi.bean.UserAuthResp;
import biz.videoexpress.pixedx.lmsapi.bean.UserMeetingReq;
import biz.videoexpress.pixedx.lmsapi.bean.UserProfileInfo;
import biz.videoexpress.pixedx.lmsapi.bean.UserProfileResp;
import biz.videoexpress.pixedx.lmsapi.common.ApiRetCodeEnum;
import biz.videoexpress.pixedx.lmsapi.common.AppException;
import biz.videoexpress.pixedx.lmsapi.common.BasicResp;
import biz.videoexpress.pixedx.lmsapi.common.EncryptionUtils;
import biz.videoexpress.pixedx.lmsapi.common.ServiceConstants;
import biz.videoexpress.pixedx.lmsapi.common.UserProfile;

import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.Attendee;
import com.broadvideo.pixsignage.domain.Meeting;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.persistence.StaffMapper;
import com.broadvideo.pixsignage.service.MeetingService;
import com.broadvideo.pixsignage.util.CommonUtil;
import com.broadvideo.pixsignage.util.DateUtil;

@Component
@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
public class ResUsers extends ResBase {

	private Logger logger = LoggerFactory.getLogger(ResUsers.class);
	@Autowired
	private StaffMapper staffMapper;
	@Autowired
	private MeetingService meetingService;

	private String genUserToken(Staff staff) throws ServiceException {
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DAY_OF_WEEK, 7);
		long expiresIn = calendar.getTimeInMillis();
		String plainText = staff.getLoginname() + "|" + expiresIn;
		final String token = EncryptionUtils.encrypt(ServiceConstants.ENCRYPT_KEY, plainText);
		return token;
	}

	public static void main(String[] args) {
		Staff staff = new Staff();
		staff.setLoginname("admin@zszq");
		ResUsers users = new ResUsers();
		System.out.println(users.genUserToken(staff));

	}

	@POST
	@Path("/auth")
	public Response auth(@Context HttpServletRequest req, UserAuthReq userAuthReq) {
		logger.info("About to do user auth, client_id={}, client_secret={}, username={}.",
				new Object[] { userAuthReq.getClientId(), userAuthReq.getClientSecret(), userAuthReq.getUsername() });

		Staff staff = null;
		final String username = userAuthReq.getUsername();
		final String password = userAuthReq.getPassword();
		try {

			staff = staffMapper.login(userAuthReq.getUsername(), CommonUtil.getPasswordMd5(username, password));

		} catch (ServiceException e) {
			logger.error("Login Auth ocurred exception!", e);
			throw new AppException(ApiRetCodeEnum.EXCEPTION, "Do login service ocurred exception!");

		}
		if (staff == null) {
			logger.error("Login failed for username & password not match, username={}, password={}, md5={}",
					new Object[] { username, password, CommonUtil.getPasswordMd5(username, password) });
			throw new ServiceException(ApiRetCodeEnum.EXCEPTION, "用户名或密码不正确.");
		}

		String token = null;
		try {
			token = genUserToken(staff);

		} catch (ServiceException e) {
			e.printStackTrace();
			throw new AppException(ApiRetCodeEnum.EXCEPTION, "Get token ocurred exception!");
		}
		UserAuth userAuth = new UserAuth();
		userAuth.setTokenType("pixmrbs");
		userAuth.setAccessToken(token);
		userAuth.setExpiredIn(-1);
		UserAuthResp resp = new UserAuthResp();
		resp.setRetcode(ApiRetCodeEnum.SUCCESS);
		resp.setData(userAuth);
		return Response.status(Status.OK).entity(resp).build();

	}

	@GET
	@Path("/self/profile")
	public Response selfProfie(@Context HttpServletRequest req) {

		UserProfile profile = currentUserProfile(req);
		UserProfileResp resp = new UserProfileResp();
		UserProfileInfo userProfileInfo = new UserProfileInfo();
		userProfileInfo.setEmail(profile.getEmail());
		userProfileInfo.setUserId(profile.getUserId());
		userProfileInfo.setUsername(profile.getUsername());
		userProfileInfo.setLastLogin(profile.getLastLogin());
		userProfileInfo.setName(profile.getName());
		resp.setRetcode(ApiRetCodeEnum.SUCCESS);
		resp.setData(userProfileInfo);
		return Response.status(Status.OK).entity(resp).build();
	}

	/**
	 * 预定会议
	 * 
	 * @param req
	 * @param asyncResponse
	 */
	@POST
	@Path("/{user_id}/book_meeting")
	public Response bookMeeting(@Context HttpServletRequest req, BookMeetingReq bookMeetingReq) {
		logger.info("entry book meeting.");
		UserProfile profile = currentUserProfile(req);
		if (bookMeetingReq == null || bookMeetingReq.getMeetingRoomId() == null
				|| bookMeetingReq.getStartTime() == null || bookMeetingReq.getEndTime() == null
				|| StringUtils.isBlank(bookMeetingReq.getSubject())) {
			logger.error("Book meeting room:invalid args.");
			throw new AppException(RetCodeEnum.EXCEPTION, "缺少参数");

		}
		try {
			Meeting meeting = new Meeting();
			meeting.setMeetingroomid(bookMeetingReq.getMeetingRoomId());
			meeting.setSubject(bookMeetingReq.getSubject());
			meeting.setDescription(bookMeetingReq.getDescription());
			meeting.setStarttime(DateUtil.getDate(bookMeetingReq.getStartTime(), "yyyy-MM-dd HH:mm"));
			meeting.setEndtime(DateUtil.getDate(bookMeetingReq.getEndTime(), "yyyy-MM-dd HH:mm"));
			meeting.setAttendeeuserids(bookMeetingReq.getAttendeeUserIds());
			meeting.setBookstaffid(profile.getUserId());
			meeting.setBookbranchid(profile.getBranchid());
			meeting.setCreatestaffid(profile.getUserId());
			meeting.setOrgid(profile.getOrgId());
			meeting.setCreatetime(new Date());
			this.meetingService.addMeeting(meeting);
		} catch (ServiceException e) {
			logger.error("bookMeeting exception.", e);
			throw new AppException(e.getCode(), e.getMessage());
		}
		BasicResp resp = new BasicResp();
		resp.setRetcode(ApiRetCodeEnum.SUCCESS);
		return Response.status(Status.OK).entity(resp).build();

	}

	/**
	 * 取消预定会议
	 * 
	 * @param req
	 * @param courseId
	 */
	@DELETE
	@Path("/{user_id}/book_meeting")
	public Response cancelBookMeetingRoom(@Context HttpServletRequest req, @QueryParam("meeting_id") Integer meetingId) {
		logger.info("Cancel book meeting:{}", meetingId);
		UserProfile profile = currentUserProfile(req);
		if (meetingId == null) {
			logger.error("Cancel book meeting  without meeting id:{}", meetingId);
			throw new AppException(RetCodeEnum.EXCEPTION, "meeting_id不能为空");
		}
		Meeting existMeeting = this.meetingService.getMeeting(meetingId, profile.getOrgId());
		if (existMeeting == null) {
			throw new AppException(RetCodeEnum.EXCEPTION, "会议已经取消");
		}
		if (!existMeeting.getBookstaffid().equals(profile.getUserId())) {
			throw new AppException(RetCodeEnum.EXCEPTION, "只有会议预定人才能取消会议");
		}

		try {
			Meeting meeting = new Meeting();
			meeting.setMeetingid(meetingId);
			meeting.setBookstaffid(profile.getUserId());
			meeting.setOrgid(profile.getOrgId());
			this.meetingService.deleteMeeting(meeting);
			BasicResp basicResp = new BasicResp();
			basicResp.setRetcode(ApiRetCodeEnum.SUCCESS);
			return Response.status(Status.OK).entity(basicResp).build();
		} catch (ServiceException ex) {
			throw new AppException(ApiRetCodeEnum.EXCEPTION, ex.getMessage());

		}

	}

	/**
	 * 我的预定
	 * 
	 * @param req
	 * @param userMeetingReq
	 * @return
	 */
	@GET
	@Path("/self/meetings")
	public Response getUserMeetings(@Context HttpServletRequest req, @BeanParam UserMeetingReq userMeetingReq) {
		logger.info("Get user meetings:start={},length={},q={}", new Object[] { userMeetingReq.getStart(),
				userMeetingReq.getLength(), userMeetingReq.getQuery() });
		UserProfile profile = currentUserProfile(req);
		try {
			com.broadvideo.pixsignage.common.PageInfo pageInfo = new com.broadvideo.pixsignage.common.PageInfo();
			pageInfo.setStart(userMeetingReq.getStart());
			pageInfo.setLength(userMeetingReq.getLength());
			Meeting meeting = new Meeting();
			meeting.setSearch(userMeetingReq.getQuery());
			meeting.setBookstaffid(profile.getUserId());
			meeting.setStarttime(userMeetingReq.getStartTime());
			meeting.setEndtime(userMeetingReq.getEndTime());
			meeting.setOrgid(profile.getOrgId());
			meeting.setSearch(userMeetingReq.getQuery());
			meeting.setAttendeeuserids(new Integer[] { profile.getUserId() });
			PageResult pageResult = meetingService.getMeetingList(meeting, pageInfo);
			BasicPaginationResp resp = new BasicPaginationResp();
			Pagination pagination = new Pagination();
			pagination.setStart(userMeetingReq.getStart());
			pagination.setLength(userMeetingReq.getLength());
			pagination.setTotal(pageResult.getTotalCount());
			resp.setRetcode(ApiRetCodeEnum.SUCCESS);
			resp.setPagination(pagination);
			List<Meeting> meetings = pageResult.getResult();
			List<Map<String, Object>> results = new ArrayList<Map<String, Object>>();
			for (Meeting result : meetings) {
				Map<String, Object> data = new HashMap<String, Object>();
				data.put("meeting_id", result.getMeetingid());
				data.put("meeting_room_id", result.getMeetingroomid());
				data.put("meeting_room_name", result.getMeetingroomname());
				data.put("subject", result.getSubject());
				data.put("description", result.getDescription());
				data.put("start_time", DateUtil.getDateStr(result.getStarttime(), "yyyy-MM-dd HH:mm:ss"));
				data.put("end_time", DateUtil.getDateStr(result.getEndtime(), "yyyy-MM-dd HH:mm:ss"));
				data.put("book_user_id", result.getBookstaffid());
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

	@POST
	@Path("/{user_id}/adjust_meeting")
	public Response adjustMeeting(@Context HttpServletRequest req, AdjustMeetingReq adjustMeetingReq) {

		logger.info("Entry adjust meeting.");
		UserProfile profile = currentUserProfile(req);
		if (adjustMeetingReq == null || adjustMeetingReq.getStartTime() == null
				|| adjustMeetingReq.getEndTime() == null || StringUtils.isBlank(adjustMeetingReq.getSubject())) {
			logger.error("adjust meeting room:invalid args.");
			throw new AppException(RetCodeEnum.EXCEPTION, "缺少参数");

		}
		try {
			Meeting meeting = new Meeting();
			meeting.setMeetingid(adjustMeetingReq.getMeetingId());
			meeting.setSubject(adjustMeetingReq.getSubject());
			meeting.setDescription(adjustMeetingReq.getDescription());
			meeting.setStarttime(adjustMeetingReq.getStartTime());
			meeting.setEndtime(adjustMeetingReq.getEndTime());
			meeting.setAttendeeuserids(adjustMeetingReq.getAttendeeUserId());
			meeting.setUpdatestaffid(profile.getUserId());
			meeting.setOrgid(profile.getOrgId());
			meeting.setUpdatetime(new Date());
			this.meetingService.updateMeeting(meeting);
		} catch (ServiceException e) {
			throw new AppException(e.getCode(), e.getMessage());
		}
		BasicResp resp = new BasicResp();
		resp.setRetcode(ApiRetCodeEnum.SUCCESS);
		return Response.status(Status.OK).entity(resp).build();

	}

}
