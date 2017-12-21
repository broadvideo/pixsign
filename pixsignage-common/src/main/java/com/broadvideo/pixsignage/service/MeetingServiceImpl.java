package com.broadvideo.pixsignage.service;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.session.RowBounds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.GlobalFlag;
import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.Attendee;
import com.broadvideo.pixsignage.domain.Meeting;
import com.broadvideo.pixsignage.domain.Meetingroom;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.persistence.AttendeeMapper;
import com.broadvideo.pixsignage.persistence.MeetingMapper;
import com.broadvideo.pixsignage.persistence.MeetingroomMapper;
import com.broadvideo.pixsignage.persistence.StaffMapper;
import com.broadvideo.pixsignage.util.DateUtil;
import com.broadvideo.pixsignage.util.UUIDUtils;
import com.broadvideo.pixsignage.vo.StaffSwipe;
import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Transactional(rollbackFor = Exception.class)
@Service
public class MeetingServiceImpl implements MeetingService {

	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private MeetingMapper meetingMapper;
	@Autowired
	private AttendeeMapper attendeeMapper;
	@Autowired
	private MeetingroomMapper meetingroomMapper;
	@Autowired
	private StaffMapper staffMapper;

	@Override
	public Meeting getMeeting(Integer meetingid, Integer orgid) {

		Meeting meeting = meetingMapper.selectByPrimaryKey(meetingid);
		if (meeting != null && GlobalFlag.VALID.equals(meeting.getStatus()) && orgid.equals(meeting.getOrgid())) {
			return meeting;
		} else {

			return null;
		}
	}
	@Override
	public PageResult getMeetingList(String search, Integer locationid, PageInfo page, Integer orgid) {
		RowBounds rowBounds = new RowBounds(page.getStart(), page.getLength());
		List<Meeting> dataList = meetingMapper.selectList(orgid, search, locationid, rowBounds);
		PageList pageList = (PageList) dataList;
		int totalCount = pageList.getPaginator().getTotalCount();
		return new PageResult(totalCount, dataList, page);
	}

	@Override
	public PageResult getMeetingList(Meeting meeting, PageInfo page) {
		RowBounds rowBounds = new RowBounds(page.getStart(), page.getLength());
		List<Meeting> dataList = meetingMapper.selectList2(meeting, rowBounds);
		PageList pageList = (PageList) dataList;
		int totalCount = pageList.getPaginator().getTotalCount();
		return new PageResult(totalCount, dataList, page);
	}
	@Override
	public Integer addMeeting(Meeting meeting) {

		Integer meetingroomid = meeting.getMeetingroomid();
		Meetingroom meetingroom = this.meetingroomMapper.selectByPrimaryKey(meetingroomid);
		if (meetingroom == null) {
			logger.error("meetingroom({}) is null.", meetingroomid);
			throw new ServiceException(RetCodeEnum.EXCEPTION, "会议室不存在.");
		}

		if (GlobalFlag.NO.equals(meetingroom.getOpenflag())) {
			logger.error("meetingroom({}) is null or not open for book.", meetingroomid);
			throw new ServiceException(RetCodeEnum.EXCEPTION, "会议室不接受预定.");

		}
		List<Meeting> existMeetings = this.meetingMapper.selectExistMeetings(meeting);
		if (existMeetings != null && existMeetings.size() > 0) {
			throw new ServiceException(RetCodeEnum.EXCEPTION, "会议室该时间段已经被占用.");
		}
		if (GlobalFlag.YES.equals(meetingroom.getAuditflag())) {
			logger.info("book meetingroom({},{}) needed audit.", meetingroom.getMeetingroomid(), meetingroom.getName());
			meeting.setAuditstatus(Meeting.WAITING_FOR_AUDIT);
		} else {
			meeting.setAuditstatus(Meeting.NONE_FOR_AUDIT);
		}
		meeting.setUuid(UUIDUtils.generateUUID());
		meeting.setStatus(GlobalFlag.VALID);
		long duration = (meeting.getEndtime().getTime() - meeting.getStarttime().getTime()) / 1000;
		meeting.setDuration((int) duration);
		meeting.setAmount(meeting.getAttendeeuserids() == null ? 0 : meeting.getAttendeeuserids().length);
		this.meetingMapper.insertSelective(meeting);

		this.syncAttedees(meeting.getMeetingid(), meeting.getAttendeeuserids());
		return meeting.getMeetingid();
	}

	private void syncAttedees(Integer meetingid, Integer[] attendeeUserIds) {

		this.attendeeMapper.deleteByMeetingid(meetingid);
		if (attendeeUserIds == null || attendeeUserIds.length == 0) {
			return;
		}	
		for (Integer attendeeUserId : attendeeUserIds) {
			Attendee attendee = new Attendee();
			attendee.setMeetingid(meetingid);
			attendee.setStaffid(attendeeUserId);
			attendee.setCreatetime(new Date());
			this.attendeeMapper.insertSelective(attendee);
			
		}
	

	}

	@Override
	public void updateMeeting(Meeting meeting) {

		Meeting curMeeting = this.getMeeting(meeting.getMeetingid(), meeting.getOrgid());
		Meeting params = new Meeting();
		params.setMeetingroomid(curMeeting.getMeetingroomid());
		params.setOrgid(curMeeting.getOrgid());
		params.setStarttime(meeting.getStarttime());
		params.setEndtime(meeting.getEndtime());
		params.setMeetingid(meeting.getMeetingid());
		List<Meeting> existMeetings = this.meetingMapper.selectExistMeetings(params);
		if (existMeetings != null && existMeetings.size() > 0) {
			logger.error("Update Meeting(id:{}) fail:times in use.", meeting.getMeetingid());
			throw new ServiceException("会议室该时间段已经被占用.");
		}
		if (meeting.getAttendeeuserids() == null || meeting.getAttendeeuserids().length == 0) {
			meeting.setAmount(0);
		} else {
			meeting.setAmount(meeting.getAttendeeuserids().length);
		}
		this.syncAttedees(meeting.getMeetingid(), meeting.getAttendeeuserids());
		long duration = (meeting.getEndtime().getTime() - meeting.getStarttime().getTime()) / 1000;
		meeting.setDuration((int) duration);

		// 检查会议是否处于审核状态
		if (!Meeting.NONE_FOR_AUDIT.equals(curMeeting.getAuditstatus())) {
			meeting.setAuditstatus(Meeting.WAITING_FOR_AUDIT);
			logger.info("Change meeting({}) auditstatus from {} to {}", new Object[] { curMeeting.getMeetingid(),
					curMeeting.getAuditstatus(), meeting.getAuditstatus() });
		}
		this.meetingMapper.updateMeeting(meeting);
		this.syncAttedees(meeting.getMeetingid(), meeting.getAttendeeuserids());

	}

	@Override
	public void deleteMeeting(Meeting meeting) {
		Meeting deleteMeeting = new Meeting();
		deleteMeeting.setMeetingid(meeting.getMeetingid());
		deleteMeeting.setOrgid(meeting.getOrgid());
		deleteMeeting.setStatus(GlobalFlag.DELETE);
		deleteMeeting.setUpdatestaffid(meeting.getUpdatestaffid());
		deleteMeeting.setUpdatetime(new Date());
		this.meetingMapper.updateMeeting(deleteMeeting);
		this.attendeeMapper.deleteByMeetingid(meeting.getMeetingid());


	}

	@Override
	public List<Attendee> getMeetingAttendees(Integer meetingid, Integer orgid) {
		return attendeeMapper.selectMeetingAttendees(meetingid);
	}

	@Override
	public void syncMeetingSignin(StaffSwipe staffswipe, Integer orgid) {
		// 查询门禁绑定的会议室,code关联apid
		Meetingroom meetingroom = this.meetingroomMapper.selectByCode(staffswipe.getApid() + "", orgid);
		if (meetingroom == null) {
			logger.error("swipe(apid:{}) not bind meetingroom.code", staffswipe.getApid());
			return;
		}
		// 检查记录是否已经处理了
		if ("1".equals(staffswipe.getNtag())) {
			logger.error("apid:{},nTag:{} is read", staffswipe.getApid(), staffswipe.getNtag());
			return;
		}
		// 根据账号查询员工
		List<Staff> staffs=staffMapper.selectByLoginname(staffswipe.getAccount());
		if(staffs==null || staffs.size()==0){
			logger.error("swipe account({}) not found staff.", staffswipe.getAccount());
			return;
		}
		Staff staff = staffs.get(0);
		// 查找指定时间的会议
		Date signtime = staffswipe.getSwipetime();
		Meeting meeting = this.meetingMapper.selectMatchMeeting(meetingroom.getMeetingroomid(), signtime);
		if (meeting == null) {
			logger.info("No meeting found for meetingroomid:{},signtime:{}", meetingroom.getMeetingroomid(), signtime);
			return;
		}

		// 检查刷卡人员是否是会议参与者
		List<Attendee> attendeeList = this.getMeetingAttendees(meeting.getMeetingid(), orgid);
		Attendee matchAttendee = null;
		for (Attendee attendee : attendeeList) {
			if (attendee.getStaffid().equals(staff.getStaffid())) {
				matchAttendee = attendee;
				break;
			}
		}
		if (matchAttendee == null) {
			logger.error("staff(staffid:{},name:{}) is not in attendee.", staff.getStaffid(), staff.getName());
			return;
		}
		// 检查参会这是否已经签到过
		if (matchAttendee.getSigntime() != null) {
			logger.info("staff(staffid:{},name:{}) already signin on time:{}",
					new Object[] { staff.getStaffid(), staff.getName(),
							DateUtil.getDateStr(matchAttendee.getSigntime(), "yyyy-MM-dd HH:mm:ss") });
			return;

		}
		// 插入签到记录
		matchAttendee.setSigntime(staffswipe.getSwipetime());
		this.attendeeMapper.updateByPrimaryKeySelective(matchAttendee);



	}


}
