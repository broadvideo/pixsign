package com.broadvideo.pixsignage.service;

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
import com.broadvideo.pixsignage.domain.Room;
import com.broadvideo.pixsignage.domain.Roomperson;
import com.broadvideo.pixsignage.domain.Roomterminal;
import com.broadvideo.pixsignage.persistence.RoomMapper;
import com.broadvideo.pixsignage.persistence.RoompersonMapper;
import com.broadvideo.pixsignage.persistence.RoomterminalMapper;
import com.broadvideo.pixsignage.util.UUIDUtils;
import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
@Transactional(rollbackFor = Exception.class)
public class RoomServiceImpl implements RoomService {

	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private RoomMapper roomMapper;
	@Autowired
	private RoomterminalMapper roomterminalMapper;
	@Autowired
	private RoompersonMapper roompersonMapper;
	@Autowired
	private DeviceService deviceService;

	@Override
	public PageResult getRoomList(Room room, PageInfo page) {
		RowBounds rowBounds = new RowBounds(page.getStart(), page.getLength());
		List<Room> dataList = roomMapper.selectList(room, rowBounds);
		PageList pageList = (PageList) dataList;
		int totalCount = pageList.getPaginator().getTotalCount();
		return new PageResult(totalCount, dataList, page);
	}

	@Override
	public Integer addRoom(Room room) {
		// 验证Code和会议室名称
		this.validateNameCode(room);
		room.setUuid(UUIDUtils.generateUUID());
		room.setStatus(GlobalFlag.VALID);
		this.roomMapper.insertSelective(room);
		syncRoomTerminals(room, room.getTerminalids());
		syncRoomPersons(room, room.getPersonids());
		return room.getRoomid();
	}

	private void syncRoomPersons(Room room, String personids) {
		this.roompersonMapper.deleteByRoomid(room.getRoomid());
		if (StringUtils.isBlank(personids)) {
			return;
		}
		String[] personidArr = personids.split(",");
		if (personidArr == null || personidArr.length == 0) {
			return;
		}
		for (String personid : personidArr) {
			Roomperson roomperson = new Roomperson();
			roomperson.setRoomid(room.getRoomid());
			roomperson.setPersonid(NumberUtils.toInt(personid));
			this.roompersonMapper.insertSelective(roomperson);
		}

	}
	private void syncRoomTerminals(Room room, String terminalids) {
		this.roomterminalMapper.deleteByRoomid(room.getRoomid());
		if (StringUtils.isBlank(terminalids)) {
			this.deviceService.resetExternalid(room.getUuid());
			return;
		}
		String[] terminalidArr = terminalids.split(",");
		if (terminalidArr == null || terminalidArr.length == 0) {
			return;
		}
		for (String terminalid : terminalidArr) {
			Device device = this.deviceService.selectByTerminalid(terminalid);
			if (device != null && StringUtils.isNotBlank(device.getExternalid())
					&& !room.getUuid().equals(device.getExternalid())) {
				logger.error("terminalid({})已经被占用了.", terminalid);
				throw new ServiceException("terminalid(" + terminalid + ")已经被占用了.");
			}

			Roomterminal roomterminal = new Roomterminal();
			roomterminal.setName(room.getName());
			roomterminal.setRoomid(room.getRoomid());
			roomterminal.setTerminalid(terminalid);
			roomterminal.setCreatetime(new Date());
			this.roomterminalMapper.insertSelective(roomterminal);
			if (room.getUuid().equals(device.getExternalid())) {
				continue;
			}
			device.setExternalid(room.getUuid());
			this.deviceService.updateDevice(device);
		}
	}

	@Override
	public void updateRoom(Room room) {
		this.validateNameCode(room);
		this.roomMapper.updateRoom(room);
		Room record = this.roomMapper.selectByPrimaryKey(room.getRoomid());
		room.setUuid(record.getUuid());
		this.syncRoomPersons(room, room.getPersonids());
		this.syncRoomTerminals(room, room.getTerminalids());

	}

	@Override
	public void deleteRoom(Room room) {
		Room record = this.roomMapper.selectByPrimaryKey(room.getRoomid());
		Room updateRoom = new Room();
		updateRoom.setRoomid(room.getRoomid());
		updateRoom.setOrgid(room.getOrgid());
		updateRoom.setUpdatestaffid(room.getUpdatestaffid());
		updateRoom.setUpdatetime(new Date());
		updateRoom.setStatus(GlobalFlag.DELETE);
		this.roomMapper.updateRoom(updateRoom);
		room.setUuid(record.getUuid());
		room.setTerminalids(null);
		this.syncRoomPersons(room, null);
		this.syncRoomTerminals(room, null);

	}

	@Override
	public boolean validateNameCode(Room room) {


		logger.info("Check room(name:{}) is exists:", room.getName());
		Room record = new Room();
		record.setRoomid(room.getRoomid());
		record.setOrgid(room.getOrgid());
		record.setName(room.getName());
		List<Room> existsRecords = this.roomMapper.selectExists(record);
		if (existsRecords != null && existsRecords.size() > 0) {
			throw new ServiceException(RetCodeEnum.EXCEPTION, "会议室编码已经存在");
		}

		return true;
	}

	@Override
	public List<Device> listUnbindTerminals(Integer orgid) {

		return null;
	}





}
