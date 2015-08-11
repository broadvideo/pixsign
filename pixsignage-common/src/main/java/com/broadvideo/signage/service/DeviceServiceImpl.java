package com.broadvideo.signage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.broadvideo.signage.domain.Device;
import com.broadvideo.signage.domain.Metroplatform;
import com.broadvideo.signage.domain.Metrostation;
import com.broadvideo.signage.persistence.DeviceMapper;
import com.broadvideo.signage.persistence.MetroplatformMapper;
import com.broadvideo.signage.persistence.MetrostationMapper;

@Service("deviceService")
public class DeviceServiceImpl implements DeviceService {

	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private MetrostationMapper metrostationMapper;
	@Autowired
	private MetroplatformMapper metroplatformMapper;

	public int selectCount(String orgid, String branchid, String metrolineid, String metrostationid, String metrotype,
			String metrodirection, String search) {
		return deviceMapper
				.selectCount(orgid, branchid, metrolineid, metrostationid, metrotype, metrodirection, search);
	}

	public List<Device> selectList(String orgid, String branchid, String metrolineid, String metrostationid,
			String metrotype, String metrodirection, String search, String start, String length) {
		return deviceMapper.selectList(orgid, branchid, metrolineid, metrostationid, metrotype, metrodirection, search,
				start, length);
	}

	public int selectUnregisterCount(String orgid, String search) {
		return deviceMapper.selectUnregisterCount(orgid, search);
	}

	public List<Device> selectUnregisterList(String orgid, String search, String start, String length) {
		return deviceMapper.selectUnregisterList(orgid, search, start, length);
	}

	public Device selectByPrimaryKey(String deviceid) {
		return deviceMapper.selectByPrimaryKey(deviceid);
	}

	public List<Device> selectByDeviceGroup(String devicegroupid) {
		return deviceMapper.selectByDeviceGroup(devicegroupid);
	}

	public List<Device> selectByHardkey(String hardkey) {
		return deviceMapper.selectByHardkey(hardkey);
	}

	public List<Device> selectByTerminalid(String terminalid) {
		return deviceMapper.selectByTerminalid(terminalid);
	}

	public List<Device> selectByOrgtype(String orgtype) {
		return deviceMapper.selectByOrgtype(orgtype);
	}

	public int selectAvailCountByDeviceGroup(int orgid, int branchid, String devicegroupid) {
		return deviceMapper.selectAvailCountByDeviceGroup(orgid, branchid, devicegroupid);
	}

	public List<Device> selectAvailListByDeviceGroup(int orgid, int branchid, String devicegroupid, String start,
			String length) {
		return deviceMapper.selectAvailListByDeviceGroup(orgid, branchid, devicegroupid, start, length);
	}

	public void addDevice(Device device) {
		deviceMapper.insert(device);
	}

	public void updateDevice(Device device) {
		System.out.println(device.getMetrotype());
		System.out.println(device.getMetrolineid());
		System.out.println(device.getMetrostationid());
		System.out.println(device.getMetrodirection());
		if (device.getMetrotype() != null && device.getMetrotype().equals("0") && device.getMetrolineid() != null
				&& device.getMetrostationid() != null) {
			Metrostation station = metrostationMapper.selectByPrimaryKey("" + device.getMetrostationid());
			if (station != null) {
				device.setGroupcode(station.getGroupcode());
				device.setPosition(station.getName());
			}
		}
		if (device.getMetrotype() != null && device.getMetrotype().equals("1") && device.getMetrolineid() != null
				&& device.getMetrostationid() != null && device.getMetrodirection() != null) {
			Metroplatform platform = metroplatformMapper.select("" + device.getMetrolineid(),
					"" + device.getMetrostationid(), device.getMetrodirection());
			if (platform != null) {
				device.setMetroplatformid(platform.getMetroplatformid());
				device.setGroupcode(platform.getGroupcode());
				device.setPosition(platform.getName());
			}
		}
		deviceMapper.updateByPrimaryKeySelective(device);
	}

	public void configDevice(Device device) {
		device.setConfigstatus("1");
		deviceMapper.updateByPrimaryKeySelective(device);
	}

	public void deleteDevice(String[] ids) {
		String s = "";
		if (ids.length > 0)
			s = ids[0];
		for (int i = 1; i < ids.length; i++) {
			s += "," + ids[i];
		}
		deviceMapper.deleteByKeys(s);
	}

	public void updateOnlineflag() {
		deviceMapper.updateOnlineflag();
	}
}
