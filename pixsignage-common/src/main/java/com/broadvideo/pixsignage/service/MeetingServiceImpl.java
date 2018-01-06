package com.broadvideo.pixsignage.service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
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
	public Integer addMeeting(Meeting meeting) {

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
		params.setMeetingid(meeting.getMeetingid());
		// 不允许修改开始时间
		params.setStarttime(curMeeting.getStarttime());
		params.setEndtime(meeting.getEndtime());
		if (curMeeting.getEndtime().getTime() <= System.currentTimeMillis()) {
			logger.error("Meeting(id:{},name:{}) already end,can't modify.", curMeeting.getMeetingid(),
					curMeeting.getSubject());
			throw new ServiceException("会议已经结束，不允许修改会议信息.");
		}
		if (meeting.getStarttime().getTime() >= meeting.getEndtime().getTime()) {
			logger.error("meeting({}) starttime({}) great than endtime({})", new Object[] { meeting.getMeetingid(),
					meeting.getStarttime(), meeting.getEndtime() });
			throw new ServiceException("会议开始时间必须小于结束时间.");

		}
		if (meeting.getEndtime().getTime() < System.currentTimeMillis()) {
			logger.error("modify meeting({}) endtime({}) is less than current time.", meeting.getMeetingid(),
					meeting.getEndtime());
			throw new ServiceException("会议结束时间必须大于当前时间.");
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
		this.syncAttedees(meeting.getMeetingid(), meeting.getAttendeeuserids());
		long duration = (meeting.getEndtime().getTime() - meeting.getStarttime().getTime()) / 1000;
		meeting.setDuration((int) duration);
		meeting.setFee(this.getFee(meeting));

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
		int duration = meeting.getDuration();
		int hours = duration / (60 * 60);
		double minutes = (duration - (hours * 60 * 60)) / 60.00;
		double totalHours = hours + minutes / 60;
		BigDecimal fee = meetingroom.getFeeperhour().multiply(new BigDecimal(Double.toString(totalHours)));
		int precision = fee.precision() + (2 - fee.scale());
		MathContext ctx = new MathContext(precision, RoundingMode.HALF_UP);
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
		Meeting meeting = new Meeting();
		meeting.setSubject("subject");
		ReflectionUtils.setFieldValue(meeting, "description", "description");
		System.out.println("meeting.description:" + meeting.getDescription());
		String formatDuration = DurationFormatUtils.formatDuration(3600 * 1000, "HH小时mm分", true);
		System.out.println("formatDuration:" + formatDuration);

	}
}
