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
import com.broadvideo.pixsignage.persistence.AttendeeMapper;
import com.broadvideo.pixsignage.persistence.MeetingMapper;
import com.broadvideo.pixsignage.util.UUIDUtils;
import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Transactional(rollbackFor = Exception.class)
@Service
public class MeetingServiceImpl implements MeetingService {

	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private MeetingMapper meetingMapper;
	@Autowired
	private AttendeeMapper attendeeMapper;

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

		List<Meeting> existMeetings = this.meetingMapper.selectExistMeetings(meeting);
		if (existMeetings != null && existMeetings.size() > 0) {
			throw new ServiceException(RetCodeEnum.EXCEPTION, "会议室该时间段已经被占用.");
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
		if (attendeeUserIds == null || attendeeUserIds.length == 0) {
			return;
		}	
		this.attendeeMapper.deleteByMeetingid(meetingid);
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
		long duration = (meeting.getEndtime().getTime() - meeting.getStarttime().getTime()) / 1000;
		meeting.setDuration((int) duration);
		this.meetingMapper.updateMeeting(meeting);
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


}
