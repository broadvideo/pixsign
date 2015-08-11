package com.broadvideo.signage.service;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.signage.domain.Device;
import com.broadvideo.signage.domain.Schedule;
import com.broadvideo.signage.domain.Task;
import com.broadvideo.signage.persistence.DeviceMapper;
import com.broadvideo.signage.persistence.LayoutMapper;
import com.broadvideo.signage.persistence.ScheduleMapper;
import com.broadvideo.signage.persistence.TaskMapper;

@Service("taskService")
public class TaskServiceImpl implements TaskService {

	@Autowired
	private TaskMapper taskMapper ;
	@Autowired
	private LayoutMapper layoutMapper ;
	@Autowired
	private ScheduleMapper scheduleMapper ;
	@Autowired
	private DeviceMapper deviceMapper;

	@Autowired
	private SchedulefileService schedulefileService;
	@Autowired
	private DevicefileService devicefileService;
	
	public int selectCount(int orgid, int branchid, String search) {
		return taskMapper.selectCount(orgid, branchid, search);
	}
	
	public List<Task> selectList(int orgid, int branchid, String search, String start, String length) {
		return taskMapper.selectList(orgid, branchid, search, start, length);
	}
	
	@Transactional
	public void addTask(Task task) {
		SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		if (task.getType().equals("2")) {
			task.setFromdate(Calendar.getInstance().getTime());
			if (task.getTodate() == null) {
				try {
					task.setTodate(dateformat.parse("2037-01-01 00:00:00"));
				} catch (Exception ex) { }
			}
		}
		long filesize = 0;
		if (task.getSchedules().size()>0) {
			filesize = layoutMapper.sumMediaSize(""+task.getSchedules().get(0).getLayoutid());
			task.setFilesize(filesize);
		}
		taskMapper.insert(task);
		
		List<Schedule> schedules = task.getSchedules();
		HashMap<String, Schedule> scheduleHash = new HashMap<String, Schedule>();
		for (int i=0; i<schedules.size(); i++) {
			Schedule schedule = schedules.get(i);
			schedule.setTaskid(task.getTaskid());
			schedule.setSyncstatus("0");
			schedule.setStatus("1");
			schedule.setComplete(0);
			schedule.setFilesize(filesize);
			schedule.setFilesizecomplete((long)0);
			schedule.setCreatestaffid(task.getCreatestaffid());
			if (schedule.getType().equals("2")) {
				schedule.setFromdate(task.getFromdate());
				schedule.setTodate(task.getTodate());
			}
			
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
						newSchedule.setTaskid(task.getTaskid());
						newSchedule.setDeviceid(devices.get(j).getDeviceid());
						newSchedule.setLayoutid(schedule.getLayoutid());
						newSchedule.setType(schedule.getType());
						newSchedule.setFromdate(schedule.getFromdate());
						newSchedule.setTodate(schedule.getTodate());
						newSchedule.setPriority(schedule.getPriority());
						newSchedule.setSyncstatus("0");
						newSchedule.setStatus("1");
						newSchedule.setComplete(0);
						newSchedule.setFilesize(filesize);
						newSchedule.setFilesizecomplete((long)0);
						newSchedule.setCreatestaffid(task.getCreatestaffid());
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
	
	public void updateTask(Task task) {
		taskMapper.updateByPrimaryKeySelective(task);
	}
	
	public void deleteTask(String[] ids) {
		String s = "";
		if (ids.length > 0) s = ids[0];
		for (int i=1; i<ids.length; i++) {
			s += "," + ids[i];
		}
		taskMapper.deleteByKeys(s);
	}

}
