package com.broadvideo.pixsignage.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
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
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Equipment;
import com.broadvideo.pixsignage.domain.Meetingroom;
import com.broadvideo.pixsignage.persistence.MeetingroomMapper;
import com.broadvideo.pixsignage.util.UUIDUtils;
import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
@Transactional(rollbackFor = Exception.class)
public class MeetingroomServiceImpl implements MeetingroomService {

	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private MeetingroomMapper meetingroomMapper;
	@Autowired
	private EquipmentService equipmentService;
	@Autowired
	private DeviceService deviceService;

	@Override
	public PageResult getMeetingroomList(String search, Integer locationid, PageInfo page, Integer orgid) {
		RowBounds rowBounds = new RowBounds(page.getStart(), page.getLength());
		List<Meetingroom> dataList = meetingroomMapper.selectList(orgid, search, locationid, rowBounds);
		PageList pageList = (PageList) dataList;
		int totalCount = pageList.getPaginator().getTotalCount();
		return new PageResult(totalCount, dataList, page);
	}

	@Override
	public PageResult getMeetingroomList(Meetingroom meetingroom, PageInfo page) {
		RowBounds rowBounds = new RowBounds(page.getStart(), page.getLength());
		List<Meetingroom> dataList = meetingroomMapper.selectList2(meetingroom, rowBounds);
		PageList pageList = (PageList) dataList;
		int totalCount = pageList.getPaginator().getTotalCount();
		return new PageResult(totalCount, dataList, page);
	}

	@Override
	public Integer addMeetingroom(Meetingroom meetingroom) {
		// 验证Code和会议室名称
		this.validateNameCode(meetingroom);
		// 检查绑定的终端是否被占用
		this.validateBindTerminalId(meetingroom);
		meetingroom.setUuid(UUIDUtils.generateUUID());
		meetingroom.setStatus(GlobalFlag.VALID);
		this.meetingroomMapper.insertSelective(meetingroom);
		return meetingroom.getMeetingroomid();
	}

	@Override
	public void updateMeetingroom(Meetingroom meetingroom) {
		this.validateNameCode(meetingroom);
		// 检查绑定的终端是否被占用
		this.validateBindTerminalId(meetingroom);
		this.meetingroomMapper.updateMeetingroom(meetingroom);

	}

	@Override
	public void deleteMeetingroom(Meetingroom meetingroom) {
		Meetingroom updateMeetingroom = new Meetingroom();
		updateMeetingroom.setMeetingroomid(meetingroom.getMeetingroomid());
		updateMeetingroom.setOrgid(meetingroom.getOrgid());
		updateMeetingroom.setUpdatestaffid(meetingroom.getUpdatestaffid());
		updateMeetingroom.setUpdatetime(new Date());
		updateMeetingroom.setStatus(GlobalFlag.DELETE);
		this.meetingroomMapper.updateMeetingroom(updateMeetingroom);
	}

	@Override
	public boolean validateNameCode(Meetingroom meetingroom) {

		if (StringUtils.isBlank(meetingroom.getCode())) {
			return true;
		}
		logger.info("Check meetingroom(name:{},code:{}) is exists:", meetingroom.getName(), meetingroom.getCode());
		Meetingroom record = new Meetingroom();

		record.setCode(meetingroom.getCode());
		record.setMeetingroomid(meetingroom.getMeetingroomid());
		record.setOrgid(meetingroom.getOrgid());
		int nameExistsCount = this.meetingroomMapper.existNameCode(record);
		if (nameExistsCount > 0) {
			throw new ServiceException(RetCodeEnum.EXCEPTION, "会议室编码已经存在");
		}

		return true;
	}

	public boolean validateBindTerminalId(Meetingroom meetingroom) {
		if (StringUtils.isBlank(meetingroom.getTerminalid())) {
			return true;
		}
		logger.info("Check meetingroom(meetingroomid:{},terminalid{}) is exists:", meetingroom.getMeetingroomid(),
				meetingroom.getTerminalid());
		Meetingroom record = new Meetingroom();
		record.setTerminalid(meetingroom.getTerminalid());
		record.setMeetingroomid(meetingroom.getMeetingroomid());
		record.setOrgid(meetingroom.getOrgid());
		int nameExistsCount = this.meetingroomMapper.existNameCode(record);
		if (nameExistsCount > 0) {
			throw new ServiceException(RetCodeEnum.EXCEPTION, "终端id已经被其他会议室绑定，请绑定其他终端");
		}

		return true;

	}

	@Override
	public void addEquipments(Meetingroom meetingroom, String[] equipmentids) {

		for (String equipmentid : equipmentids) {
			Equipment equipment = new Equipment();
			equipment.setMeetingroomid(meetingroom.getMeetingroomid());
			equipment.setEquipmentid(NumberUtils.toInt(equipmentid));
			equipment.setUpdatestaffid(meetingroom.getUpdatestaffid());
			equipment.setOrgid(meetingroom.getOrgid());
			this.equipmentService.assignEquipment(equipment);
		}
	}

	@Override
	public void deleteEquipments(Meetingroom meetingroom, String[] equipmentids) {

		for (String equipmentid : equipmentids) {
			Equipment equipment = new Equipment();
			equipment.setMeetingroomid(-1);
			equipment.setEquipmentid(NumberUtils.toInt(equipmentid));
			equipment.setUpdatestaffid(meetingroom.getUpdatestaffid());
			equipment.setUpdatetime(new Date());
			equipment.setOrgid(meetingroom.getOrgid());
			this.equipmentService.assignEquipment(equipment);
		}

	}

	@Override
	public List<Device> listUnbindTerminals(Integer orgid) {

		List<Device> allDeviceList = this.deviceService.selectList(orgid + "", null, null, null, null, null, null, null,
				null, null, "0", "999", null);
		List<Meetingroom> bindMeetingrooms = this.meetingroomMapper.selectBindMeetingrooms(orgid);
		List<String> bindTerminalIds = new ArrayList<String>();
		for (Meetingroom meetingroom : bindMeetingrooms) {
			bindTerminalIds.add(meetingroom.getTerminalid());
		}
		List<Device> unBindDeviceList = new ArrayList<Device>();
		for (Device device : allDeviceList) {
			String terminalid = device.getTerminalid();
			if (bindTerminalIds.contains(terminalid)) {
				continue;
			}
			unBindDeviceList.add(device);
		}

		return unBindDeviceList;
	}

}
