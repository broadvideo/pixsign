package com.broadvideo.pixsignage.service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.apache.commons.lang3.time.DurationFormatUtils;
import org.apache.ibatis.session.RowBounds;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.GlobalFlag;
import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.common.ReflectionUtils;
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
import com.broadvideo.pixsignage.vo.Meetingtime;
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
	private Resource meetingExcel;
	private static Map<String, String> cellValueMap = new HashMap<String, String>();
	static {
		cellValueMap.put("0", "locationname");
		cellValueMap.put("1", "meetingroomname");
		cellValueMap.put("2", "subject");
		cellValueMap.put("3", "description");
		cellValueMap.put("4", "starttime");
		cellValueMap.put("5", "endtime");
		cellValueMap.put("6", "formatduration");
		cellValueMap.put("7", "fee");
		cellValueMap.put("8", "bookstaffname");
		cellValueMap.put("9", "bookbranchname");
		cellValueMap.put("10", "amount");
		cellValueMap.put("11", "signamount");

	}

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
	public PageResult getAuditMeetingList(Meeting meeting, PageInfo page) {
		RowBounds rowBounds = new RowBounds(page.getStart(), page.getLength());
		List<Meeting> dataList = meetingMapper.selectAuditList(meeting, rowBounds);
		PageList pageList = (PageList) dataList;
		int totalCount = pageList.getPaginator().getTotalCount();
		return new PageResult(totalCount, dataList, page);
	}

	@Override
	public synchronized Integer addMeeting(Meeting meeting) {

		String startStr = DateUtil.getDateStr(meeting.getStarttime(), "yyyyMMdd");
		String endStr = DateUtil.getDateStr(meeting.getEndtime(), "yyyyMMdd");
		if (!startStr.equals(endStr)) {
			logger.error("addMeeting failed: starttime:{},endtime:{} not in one day.", meeting.getStarttime(),
					meeting.getEndtime());
			throw new ServiceException("不允许跨天预定会议室！");
		}
		int total = 1;
		int success = 0;
		int fail = 0;
		Integer retmeetingid = null;
		meeting.setPeriodmeetingid(0);
		if (GlobalFlag.YES.equals(meeting.getPeriodflag())) {// 周期会议
			Integer periodMeetingId = this._addMeeting(meeting);
			retmeetingid = periodMeetingId;
			Meeting periodMeeting = this.meetingMapper.selectByPrimaryKey(periodMeetingId);
			List<Meetingtime> meetingtimes = this.buildMeetingtimes(periodMeeting);

			total = meetingtimes.size();
			for (Meetingtime meetingtime : meetingtimes) {

				Meeting subMeeting = periodMeeting;
				try {
					subMeeting.setAttendeeuserids(meeting.getAttendeeuserids());
					subMeeting.setMeetingid(null);
					subMeeting.setPeriodmeetingid(periodMeetingId);
					subMeeting.setCreatetime(new Date());
					subMeeting.setStarttime(meetingtime.getStarttime());
					subMeeting.setEndtime(meetingtime.getEndtime());

					this._addMeeting(subMeeting);
					success++;
				} catch (ServiceException ex) {
					logger.error("Add Sub Period Meeting(name:{},starttime:{},endtime:{}) failed ", new Object[] {
							subMeeting.getSubject(), meeting.getStarttime(), meeting.getEndtime(), ex });
					fail++;
				}
			}
			if (fail == total) {
				throw new ServiceException("会议预定失败.");
			}
			logger.info("Add PeriodMeeting:total:{},success:{},fail:{}", total, success, fail);

		} else {// 非周期会议
			try {
				retmeetingid = this._addMeeting(meeting);
				success++;
			} catch (ServiceException ex) {
				fail++;
				throw ex;
			}

		}

		return retmeetingid;
	}

	private Integer _addMeeting(Meeting meeting) {

		Integer meetingroomid = meeting.getMeetingroomid();
		Meetingroom meetingroom = this.meetingroomMapper.selectByPrimaryKey(meetingroomid);
		if (meeting.getStarttime().getTime() < System.currentTimeMillis()
				|| meeting.getEndtime().getTime() < System.currentTimeMillis()) {
			logger.error("booking time is expired，starttime:{},endtime:{}", meeting.getStarttime(),
					meeting.getEndtime());
			throw new ServiceException("预定时间已经过期.");
		}
		if (meeting.getStarttime().getTime() >= meeting.getEndtime().getTime()) {
			logger.error("starttime({}) is great endtime({})", meeting.getStarttime(), meeting.getEndtime());
			throw new ServiceException("结束时间大于开始时间.");
		}
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
		meeting.setFee(this.getFee(meeting));
		meeting.setAmount(meeting.getAttendeeuserids() == null ? 0 : meeting.getAttendeeuserids().length);
		this.meetingMapper.insertSelective(meeting);
		logger.info("Sync Attendees({}).....", meeting.getAttendeeuserids());
		this.syncAttedees(meeting.getMeetingid(), meeting.getAttendeeuserids());
		return meeting.getMeetingid();
	}

	private List<Meetingtime> buildMeetingtimes(Meeting meeting) {
		List<Meetingtime> dataList = new ArrayList<Meetingtime>();
		Meetingtime meetingtime = new Meetingtime();
		meetingtime.setStarttime(meeting.getStarttime());
		meetingtime.setEndtime(meeting.getEndtime());
		dataList.add(meetingtime);
		if (!GlobalFlag.YES.equals(meeting.getPeriodflag())) {
			return dataList;
		}
		String periodType = meeting.getPeriodtype();
		Date startDate = DateUtil.getFormatDate(meeting.getStarttime(), "yyyy-MM-dd");
		Date endDate = meeting.getPeriodendtime();
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(startDate);
		if (Meeting.EVERYDAY_PERIOD.equals(periodType)) {// 周期为每天
			calendar.add(Calendar.DAY_OF_MONTH, 1);
			while (calendar.getTimeInMillis() <= endDate.getTime()) {
				Meetingtime time = new Meetingtime();
				time.setStarttime(DateUtil.concatDates(calendar.getTime(), "yyyy-MM-dd", meeting.getStarttime(),
						"HH:mm", "yyyy-MM-dd HH:mm"));
				time.setEndtime(DateUtil.concatDates(calendar.getTime(), "yyyy-MM-dd", meeting.getEndtime(), "HH:mm",
						"yyyy-MM-dd HH:mm"));
				dataList.add(time);
				calendar.add(Calendar.DAY_OF_MONTH, 1);
			}
		} else if (Meeting.WORKDAY_PERIOD.equals(periodType)) {// 周期为工作日
			calendar.add(Calendar.DAY_OF_MONTH, 1);
			while (calendar.getTimeInMillis() <= endDate.getTime()) {
				if (DateUtil.isWorkday(calendar.getTime())) {
					Meetingtime time = new Meetingtime();
					time.setStarttime(DateUtil.concatDates(calendar.getTime(), "yyyy-MM-dd", meeting.getStarttime(),
							"HH:mm", "yyyy-MM-dd HH:mm"));
					time.setEndtime(DateUtil.concatDates(calendar.getTime(), "yyyy-MM-dd", meeting.getEndtime(),
							"HH:mm", "yyyy-MM-dd HH:mm"));
					dataList.add(time);
				}
				calendar.add(Calendar.DAY_OF_MONTH, 1);
			}
		} else if (Meeting.WEEK_PERIOD.equals(periodType)) {// 周期为每周星期几
			final int periodDays = 7;
			// 周期为7，进行累加计算
			calendar.add(Calendar.DAY_OF_MONTH, periodDays);
			while (calendar.getTimeInMillis() <= endDate.getTime()) {
				Meetingtime time = new Meetingtime();
				time.setStarttime(DateUtil.concatDates(calendar.getTime(), "yyyy-MM-dd", meeting.getStarttime(),
						"HH:mm", "yyyy-MM-dd HH:mm"));
				time.setEndtime(DateUtil.concatDates(calendar.getTime(), "yyyy-MM-dd", meeting.getEndtime(), "HH:mm",
						"yyyy-MM-dd HH:mm"));
				dataList.add(time);
				calendar.add(Calendar.DAY_OF_MONTH, periodDays);
			}

		} else if (Meeting.MONTH_DAY_PERIOD.equals(periodType)) {// 周期为每个月的几号
			int dayOfMonth = calendar.get(Calendar.DAY_OF_MONTH);
			calendar.add(Calendar.MONTH, 1);
			int totalDays = calendar.getActualMaximum(Calendar.DAY_OF_MONTH);
			if (totalDays < dayOfMonth) {
				dayOfMonth = totalDays;
			}
			calendar.set(Calendar.DAY_OF_MONTH, dayOfMonth);
			while (calendar.getTimeInMillis() <= endDate.getTime()) {
				if (DateUtil.isWorkday(calendar.getTime())) {
					Meetingtime time = new Meetingtime();
					time.setStarttime(DateUtil.concatDates(calendar.getTime(), "yyyy-MM-dd", meeting.getStarttime(),
							"HH:mm", "yyyy-MM-dd HH:mm"));
					time.setEndtime(DateUtil.concatDates(calendar.getTime(), "yyyy-MM-dd", meeting.getEndtime(),
							"HH:mm", "yyyy-MM-dd HH:mm"));
					dataList.add(time);
				}
				calendar.add(Calendar.DAY_OF_MONTH, 1);
				totalDays = calendar.getActualMaximum(Calendar.DAY_OF_MONTH);
				if (totalDays < dayOfMonth) {
					dayOfMonth = totalDays;
				}
				calendar.set(Calendar.DAY_OF_MONTH, dayOfMonth);
			}
		} else if (Meeting.MONTH_DAY_WEEK_PERIOD.equals(periodType)) {// 周期为每个月的第几周的星期几

			throw new ServiceException("No Implemented");

		}

		return dataList;
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
	public synchronized void updateMeeting(Meeting meeting) {
		String startStr = DateUtil.getDateStr(meeting.getStarttime(), "yyyyMMdd");
		String endStr = DateUtil.getDateStr(meeting.getEndtime(), "yyyyMMdd");
		if (!startStr.equals(endStr)) {
			logger.error("updateMeeting failed: starttime:{},endtime:{} not in one day.", meeting.getStarttime(),
					meeting.getEndtime());
			throw new ServiceException("不允许跨天预定会议室！");
		}
		Meeting curMeeting = this.getMeeting(meeting.getMeetingid(), meeting.getOrgid());
		if (!curMeeting.getBookstaffid().equals(meeting.getUpdatestaffid())) {
			throw new ServiceException("非法的删除操作！");
		}
		if (GlobalFlag.YES.equals(curMeeting.getPeriodflag())) {
			String changeScope = meeting.getPeriodChangeScope();

			if ("0".equals(changeScope)) {// 修改当前记录
				curMeeting.setAttendees(meeting.getAttendees());
				curMeeting.setStarttime(meeting.getStarttime());
				curMeeting.setEndtime(meeting.getEndtime());
				curMeeting.setSubject(meeting.getSubject());
				curMeeting.setDescription(meeting.getDescription());
				curMeeting.setServicememo(meeting.getServicememo());
				this._updateMeeting(curMeeting);
			} else if ("1".equals(changeScope)) {// 当前及以后的所有记录

				if (curMeeting.getStarttime().getTime() <= System.currentTimeMillis()) {
					throw new ServiceException("会议时间小于当前时间，不允许修改.");
				}

				// 修改周期参数，基于curMeeting生成会议事件
				Integer periodmeetingid = curMeeting.getPeriodmeetingid() > 0 ? curMeeting.getPeriodmeetingid()
						: curMeeting.getMeetingid();

				// 清除curMeeting时间之后的记录
				List<Meeting> delMeetings = this.meetingMapper.selectMeetingsAfter(meeting.getStarttime(),
						curMeeting.getPeriodmeetingid());
				for (Meeting delMeeting : delMeetings) {
					this.deleteSelfMeeting(delMeeting);
				}
				List<Meetingtime> meetingtimes = this.buildMeetingtimes(meeting);
				for (Meetingtime meetingtime : meetingtimes) {
					Meeting subMeeting = meeting;
					try {
						subMeeting.setMeetingid(null);
						subMeeting.setPeriodmeetingid(periodmeetingid);
						subMeeting.setCreatetime(new Date());
						subMeeting.setStarttime(meetingtime.getStarttime());
						subMeeting.setEndtime(meetingtime.getEndtime());
						this._addMeeting(subMeeting);
					} catch (ServiceException ex) {
						logger.error("Add Sub Period Meeting(name:{},starttime:{},endtime:{}) failed ", new Object[] {
								subMeeting.getSubject(), meeting.getStarttime(), meeting.getEndtime(), ex });
					}
				}

			} else if ("2".equals(changeScope)) { // 所有的记录

				Integer periodmeetingid = curMeeting.getPeriodmeetingid() > 0 ? curMeeting.getPeriodmeetingid()
						: curMeeting.getMeetingid();

				// 清除当前时间之后的数据
				Date curDate = new Date();
				List<Meeting> delMeetings = this.meetingMapper.selectMeetingsAfter(new Date(), periodmeetingid);
				for (Meeting delMeeting : delMeetings) {
					this.deleteMeeting(delMeeting);
				}
				this._updateMeeting(meeting);
				// 生成当前时间之后的数据
				List<Meetingtime> meetingtimes = this.buildMeetingtimes(meeting);

				for (Meetingtime meetingtime : meetingtimes) {
					if (meetingtime.getStarttime().getTime() < curDate.getTime()) {
						continue;
					}
					Meeting subMeeting = meeting;
					try {
						subMeeting.setMeetingid(null);
						subMeeting.setPeriodmeetingid(periodmeetingid);
						subMeeting.setCreatetime(new Date());
						subMeeting.setStarttime(meetingtime.getStarttime());
						subMeeting.setEndtime(meetingtime.getEndtime());
						this._addMeeting(subMeeting);
					} catch (ServiceException se) {
						logger.error("addMeeting failed:", se.getMessage());
					}
				}

			}
		} else {// 非周期会议
			this._updateMeeting(meeting);
		}

	}

	/**
	 * 只允许修改结束时间，起始时间不变
	 * 
	 * @param meeting
	 */
	public void _updateMeeting(Meeting meeting) {

		Meeting curMeeting = this.getMeeting(meeting.getMeetingid(), meeting.getOrgid());
		Meeting params = new Meeting();
		meeting.setMeetingroomid(curMeeting.getMeetingroomid());
		meeting.setPeriodendtime(meeting.getEndtime());
		params.setMeetingroomid(curMeeting.getMeetingroomid());
		params.setOrgid(curMeeting.getOrgid());
		params.setMeetingid(meeting.getMeetingid());
		logger.info("#####update meeting:{},meeting.enddate:{}", meeting.getMeetingid(), meeting.getEndtime());
		params.setStarttime(meeting.getStarttime());
		params.setEndtime(meeting.getEndtime());
		if (GlobalFlag.YES.equals(curMeeting.getPeriodflag())) { // 周期会议，只能修改未开始的
			if (curMeeting.getStarttime().getTime() < System.currentTimeMillis()) {
				throw new ServiceException("会议已经开始，不允许修改.");
			}
		} else {// 非周期会议
			// 检查会议是否结束
			if (meeting.getStarttime().getTime() >= meeting.getEndtime().getTime()) {
				logger.error("meeting({}) starttime({}) great than endtime({})", new Object[] { meeting.getMeetingid(),
						meeting.getStarttime(), meeting.getEndtime() });
				throw new ServiceException("会议开始时间必须小于结束时间.");
			}
			if (meeting.getStarttime().getTime() <= System.currentTimeMillis()
					&& meeting.getEndtime().getTime() <= System.currentTimeMillis()) {
				logger.error("_updateMeeting error:starttime({})  endtime({}) litte than current time.",
						meeting.getStarttime(), meeting.getEndtime());
				throw new ServiceException("会议时间不允许为小于当前时间！");

			}
			// 进行中的会议，只能修改结束时间
			if (curMeeting.getStarttime().getTime() <= System.currentTimeMillis()
					&& System.currentTimeMillis() < curMeeting.getEndtime().getTime()) {// 会议进行中
				logger.error("Meeting(id:{},name:{}) already end,can't modify.", curMeeting.getMeetingid(),
						curMeeting.getSubject());
				// 标记开始时间为原始meeting的starttime
				params.setStarttime(curMeeting.getStarttime());
				meeting.setStarttime(curMeeting.getStarttime());
				if (meeting.getStarttime().getTime() >= meeting.getEndtime().getTime()) {
					throw new ServiceException("结束时间不能小于当前会议开始时间！");
				}

			} else if (curMeeting.getStarttime().getTime() > System.currentTimeMillis()) {// 未开始的

				if (meeting.getStarttime().getTime() <= System.currentTimeMillis()
						|| meeting.getEndtime().getTime() <= System.currentTimeMillis()) {
					throw new ServiceException("预定时间不允许小于当前时间！");
				}
				// 检查起始时间
				params.setStarttime(meeting.getStarttime());
				params.setEndtime(meeting.getEndtime());

			} else if (curMeeting.getEndtime().getTime() <= System.currentTimeMillis()) {

				throw new ServiceException("会议已经结束，不允许修改会议信息.");
			}

		}

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
		meeting.setFee(this.getFee(meeting));

		// 检查会议是否处于审核状态
		if (!Meeting.NONE_FOR_AUDIT.equals(curMeeting.getAuditstatus())) {
			meeting.setAuditstatus(Meeting.WAITING_FOR_AUDIT);
			logger.info("Change meeting({}) auditstatus from {} to {}", new Object[] { curMeeting.getMeetingid(),
					curMeeting.getAuditstatus(), meeting.getAuditstatus() });
		}
		logger.info("#####update meeting:{},meeting.enddate:{}", meeting.getMeetingid(), meeting.getEndtime());
		this.meetingMapper.updateMeeting(meeting);
		this.syncAttedees(meeting.getMeetingid(), meeting.getAttendeeuserids());
	}

	@Override
	public void deleteMeeting(Meeting meeting) {

		Meeting curMeeting = this.meetingMapper.selectByPrimaryKey(meeting.getMeetingid());
		if (curMeeting == null) {
			return;
		}
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
	public void deleteSelfMeeting(Meeting meeting) {
		Meeting curMeeting = this.meetingMapper.selectByPrimaryKey(meeting.getMeetingid());
		if (curMeeting == null) {
			return;
		}
		if (curMeeting.getStarttime().getTime() < System.currentTimeMillis()) {
			throw new ServiceException("删除失败，只允许删除未开始的会议！");
		}
		if (!curMeeting.getCreatestaffid().equals(meeting.getBookstaffid())) {
			throw new ServiceException("非法的删除操作！");
		}
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
		List<Staff> staffs = staffMapper.selectByLoginname(staffswipe.getAccount());
		if (staffs == null || staffs.size() == 0) {
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
			logger.info(
					"staff(staffid:{},name:{}) already signin on time:{}",
					new Object[] { staff.getStaffid(), staff.getName(),
							DateUtil.getDateStr(matchAttendee.getSigntime(), "yyyy-MM-dd HH:mm:ss") });
			return;

		}
		// 插入签到记录
		matchAttendee.setSigntime(staffswipe.getSwipetime());
		this.attendeeMapper.updateByPrimaryKeySelective(matchAttendee);

	}

	@Override
	public byte[] genExportExcel(List<Meeting> meetings, Integer orgid) {
		try {
			Workbook wb = WorkbookFactory.create(meetingExcel.getInputStream());
			ByteArrayOutputStream targetOutput = new ByteArrayOutputStream();

			if (meetings == null || meetings.size() == 0) {
				wb.write(targetOutput);
				return targetOutput.toByteArray();
			}
			Sheet sheet = wb.getSheetAt(0);
			for (int rowIndex = 1; rowIndex <= meetings.size(); rowIndex++) {
				Meeting meeting = meetings.get(rowIndex - 1);
				int signamount = 0;
				for (Attendee attendee : meeting.getAttendees()) {
					if (attendee.getSigntime() != null) {
						signamount++;
					}
				}
				meeting.setSignamount(signamount);
				String formatDuration = DurationFormatUtils.formatDuration(meeting.getDuration() * 1000, "HH:mm");
				meeting.setFormatduration(formatDuration);
				Row row = sheet.getRow(rowIndex);
				if (row == null) {
					row = sheet.createRow(rowIndex);
				}
				for (int cellIndex = 0; cellIndex < cellValueMap.size(); cellIndex++) {
					Cell cell = row.getCell(cellIndex);
					if (cell == null) {
						cell = row.createCell(cellIndex);
					}
					cell.setCellType(CellType.STRING);
					String fieldName = cellValueMap.get(cellIndex + "");
					Object objectValue = ReflectionUtils.getFieldValue(meeting, fieldName);
					String fieldValue = null;
					if (objectValue instanceof Date) {
						fieldValue = DateUtil.getDateStr((Date) objectValue, "yyyy-MM-dd HH:mm");
					} else {
						fieldValue = objectValue == null ? "" : Objects.toString(objectValue);
					}
					cell.setCellValue(fieldValue);
				}
			}
			wb.write(targetOutput);
			return targetOutput.toByteArray();
		} catch (Exception ex) {

			logger.error("genExportExcel exception.", ex);
			throw new ServiceException(RetCodeEnum.EXCEPTION, "导出excel失败：" + ex.getMessage());

		}
	}

	public Resource getMeetingExcel() {
		return meetingExcel;
	}

	public void setMeetingExcel(Resource meetingExcel) {
		this.meetingExcel = meetingExcel;
	}

	private BigDecimal getFee(Meeting meeting) {
		Meetingroom meetingroom = this.meetingroomMapper.selectByPrimaryKey(meeting.getMeetingroomid());
		if (meetingroom.getFeeperhour().compareTo(BigDecimal.ZERO) == 0) {
			logger.info("Meetingroom({}) feeperhour:{}", meetingroom.getMeetingroomid(), meetingroom.getFeeperhour());
			return meetingroom.getFeeperhour();
		}
		int duration = meeting.getDuration();
		int hours = duration / (60 * 60);
		double minutes = (duration - (hours * 60 * 60)) / 60.00;
		double totalHours = hours + minutes / 60;
		BigDecimal fee = meetingroom.getFeeperhour().multiply(new BigDecimal(Double.toString(totalHours)));
		int precision = fee.precision() + (2 - fee.scale());
		MathContext ctx = null;
		try {
			ctx = new MathContext(precision, RoundingMode.HALF_UP);
		} catch (RuntimeException ex) {
			ex.printStackTrace();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		fee = new BigDecimal(fee.doubleValue(), ctx);
		logger.info("meeting(name:{})total fee:{}", meeting.getSubject(), fee);
		return fee;

	}

	@Override
	public List<Map<String, Integer>> getMeetingSummary(Date startDate, Date endDate, Integer orgid) {
		return this.meetingMapper.countMeetingSummary(startDate, endDate, orgid);
	}

	@Override
	public List<Map<String, Integer>> getMeetingroomSummary(Date startDate, Date endDate, Integer orgid) {
		return this.meetingMapper.countMeetingroomUsage(startDate, endDate, orgid);
	}

	@Override
	public void auditMeeting(Meeting meeting) {

		if (!Meeting.REFUSE_FOR_AUDIT.equals(meeting.getAuditstatus())
				&& !Meeting.SUCCESS_FOR_AUDIT.equals(meeting.getAuditstatus())) {
			logger.error("Invalid  auditstatus:{}.", meeting.getAuditstatus());
			throw new ServiceException(RetCodeEnum.EXCEPTION, "无效的审核状态!");
		}

		try {
			Meeting record = this.getMeeting(meeting.getMeetingid(), meeting.getOrgid());
			if (!Meeting.WAITING_FOR_AUDIT.equals(record.getAuditstatus())) {
				logger.error("meeting({})'s auditstatus({}) cannot modify.", record.getSubject(),
						record.getAuditstatus());
				throw new ServiceException(RetCodeEnum.EXCEPTION, "已经审核过了，不允许操作!");

			}
			if (record.getStarttime().getTime() < System.currentTimeMillis()) {
				logger.error("meeting({})'s starttime({}) is out of date.", record.getSubject(), record.getStarttime());
				meeting.setAuditstatus(Meeting.REFUSE_FOR_AUDIT);
			}
			this.meetingMapper.updateMeeting(meeting);
		} catch (Exception ex) {
			logger.error("auditMeeting exception.", ex);
			throw ex;
		}

	}

	public static void main(String[] args) {
		Meetingroom meetingroom = new Meetingroom();
		meetingroom.setFeeperhour(BigDecimal.valueOf(00.00000));

		System.out.println("ZERO EQUALS:" + meetingroom.getFeeperhour().compareTo(BigDecimal.ZERO));
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.MONTH, 0);

		System.out.println(calendar.getActualMaximum(Calendar.DAY_OF_MONTH));

		Meeting src = new Meeting();
		src.setMeetingid(1);
		src.setStarttime(new Date());
		Meeting target = new Meeting();
		BeanUtils.copyProperties(src, target);
		System.out.println("target:" + target);

	}
}
