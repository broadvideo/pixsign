package com.broadvideo.signage.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.signage.domain.Device;
import com.broadvideo.signage.domain.Schedule;
import com.broadvideo.signage.persistence.DeviceMapper;
import com.broadvideo.signage.persistence.ScheduleMapper;

@Service("scheduleService")
public class ScheduleServiceImpl implements ScheduleService {

	@Autowired
	private ScheduleMapper scheduleMapper ;
	@Autowired
	private DeviceMapper deviceMapper;
	
	@Autowired
	private SchedulefileService schedulefileService;
	@Autowired
	private DevicefileService devicefileService;
	
	public List<Schedule> selectListToSyncByDevice(String deviceid) {
		return scheduleMapper.selectListToSyncByDevice(deviceid);
	}
	
	public List<Schedule> selectByDevice(String deviceid) {
		return scheduleMapper.selectByDevice(deviceid);
	}
	
	public int selectCountByTask(String taskid) {
		return scheduleMapper.selectCountByTask(taskid);
	}
	
	public List<Schedule> selectByTask(String taskid, String start, String length) {
		return scheduleMapper.selectByTask(taskid, start, length);
	}
	
	public void addSchedule(Schedule schedule) {
		scheduleMapper.insert(schedule);
	}
	
	public void updateSchedule(Schedule schedule) {
		scheduleMapper.updateByPrimaryKeySelective(schedule);
	}
	
	public void deleteSchedule(String[] ids) {
		String s = "";
		if (ids.length > 0) s = ids[0];
		for (int i=1; i<ids.length; i++) {
			s += "," + ids[i];
		}
		scheduleMapper.deleteByKeys(s);
	}
	
	@Transactional
	public void batchAdd(List<Schedule> schedules) {
		HashMap<String, Schedule> scheduleHash = new HashMap<String, Schedule>();
		for (int i=0; i<schedules.size(); i++) {
			Schedule schedule = schedules.get(i);
			int deviceid = schedule.getDeviceid();
			int devicegroupid = schedule.getDevicegroupid();
			if (deviceid > 0) {
				if (scheduleHash.get("" + deviceid) == null) {
					scheduleHash.put("" + deviceid, schedule);
				}
			} else if (devicegroupid > 0) {
				List<Device> devices = deviceMapper.selectByDeviceGroup(""+devicegroupid);
				for (int j=0; j<devices.size(); j++) {
					if (scheduleHash.get("" + devices.get(j).getDeviceid()) == null) {
						Schedule newSchedule = new Schedule();
						newSchedule.setDeviceid(devices.get(j).getDeviceid());
						newSchedule.setLayoutid(schedule.getLayoutid());
						newSchedule.setFromdate(schedule.getFromdate());
						newSchedule.setTodate(schedule.getTodate());
						newSchedule.setPriority(schedule.getPriority());
						newSchedule.setSyncstatus("0");
						newSchedule.setStatus("1");
						newSchedule.setComplete(0);
						scheduleHash.put("" + deviceid, newSchedule);
					}
				}
			}
		}
		
		for (Map.Entry<String, Schedule> entry : scheduleHash.entrySet()) {  
			Schedule schedule = entry.getValue();
			if (schedule.getDeviceid() > 0) {
				if (schedule.getType().equals("2")) {
					scheduleMapper.updateStatusByDevice(""+schedule.getDeviceid(), "0");
				}
				scheduleMapper.insert(schedule);
				schedulefileService.insertSchedulefileBySchedule(schedule);
				
				Device device = new Device();
				device.setDeviceid(schedule.getDeviceid());
				device.setSchedulestatus("1");
				deviceMapper.updateByPrimaryKeySelective(device);
				devicefileService.updateDevicefileByDevice(""+schedule.getDeviceid());
			}
		}
	}

}
