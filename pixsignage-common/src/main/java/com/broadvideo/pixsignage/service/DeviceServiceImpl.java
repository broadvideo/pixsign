package com.broadvideo.pixsignage.service;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.persistence.OrgMapper;
import com.broadvideo.pixsignage.util.ActiveMQUtil;

@Service("deviceService")
public class DeviceServiceImpl implements DeviceService {

	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private MsgeventMapper msgeventMapper;
	@Autowired
	private OrgMapper orgMapper;

	public int selectCount(String orgid, String branchid, String status, String devicegroupid, String search) {
		return deviceMapper.selectCount(orgid, branchid, status, devicegroupid, search);
	}

	public List<Device> selectList(String orgid, String branchid, String status, String devicegroupid, String search,
			String start, String length, String order) {
		return deviceMapper.selectList(orgid, branchid, status, devicegroupid, search, start, length, order);
	}

	public Device selectByPrimaryKey(String deviceid) {
		return deviceMapper.selectByPrimaryKey(deviceid);
	}

	public Device selectByHardkey(String hardkey) {
		return deviceMapper.selectByHardkey(hardkey);
	}

	public Device selectByTerminalid(String terminalid) {
		return deviceMapper.selectByTerminalid(terminalid);
	}

	public List<Device> selectByOrgtype(String orgtype) {
		return deviceMapper.selectByOrgtype(orgtype);
	}

	@Transactional
	public void addDevice(Device device) {
		deviceMapper.insertSelective(device);
	}

	@Transactional
	public void updateDevice(Device device) {
		deviceMapper.updateByPrimaryKey(device);
	}

	@Transactional
	public void updateDeviceSelective(Device device) {
		deviceMapper.updateByPrimaryKeySelective(device);
		deviceMapper.checkDevicegroup();
	}

	@Transactional
	public void deleteDevice(String deviceid) {
		deviceMapper.deleteByPrimaryKey(deviceid);
	}

	@Transactional
	public void updateOnlineflag() {
		deviceMapper.updateOnlineflag();
	}

	@Transactional
	public void configall(String orgid) throws Exception {
		Org org = orgMapper.selectByPrimaryKey(orgid);
		List<Device> devices = deviceMapper.selectList(orgid, null, "1", null, null, null, null, "deviceid");
		for (Device device : devices) {
			Msgevent msgevent = new Msgevent();
			msgevent.setMsgtype(Msgevent.MsgType_Device_Config);
			msgevent.setObjtype1(Msgevent.ObjType_1_Device);
			msgevent.setObjid1(device.getDeviceid());
			msgevent.setObjtype2(Msgevent.ObjType_2_None);
			msgevent.setObjid2(0);
			msgevent.setStatus(Msgevent.Status_Wait);
			msgeventMapper.deleteByDtl(Msgevent.MsgType_Device_Config, Msgevent.ObjType_1_Device,
					"" + device.getDeviceid(), null, null, null);
			msgeventMapper.insertSelective(msgevent);

			JSONObject msgJson = new JSONObject().put("msg_id", msgevent.getMsgeventid()).put("msg_type", "CONFIG");
			JSONObject msgBodyJson = new JSONObject();
			msgJson.put("msg_body", msgBodyJson);
			msgBodyJson.put("msg_server", CommonConfig.CONFIG_SERVER_IP + ":1883");
			JSONArray topicJsonArray = new JSONArray();
			msgBodyJson.put("msg_topic", topicJsonArray);
			topicJsonArray.put("device-" + device.getDeviceid());
			if (device.getDevicegroup() != null) {
				topicJsonArray.put("group-" + device.getDevicegroup().getDevicegroupid());
			}

			if (org.getBackupvideo() != null) {
				JSONObject backupvideoJson = new JSONObject();
				// backupvideoJson.put("type", "video");
				backupvideoJson.put("id", org.getBackupvideoid());
				backupvideoJson.put("url", "http://" + CommonConfig.CONFIG_SERVER_IP + ":"
						+ CommonConfig.CONFIG_SERVER_PORT + "/pixsigdata" + org.getBackupvideo().getFilepath());
				backupvideoJson.put("file", org.getBackupvideo().getFilename());
				backupvideoJson.put("size", org.getBackupvideo().getSize());
				msgBodyJson.put("backup_media", backupvideoJson);
			}

			msgBodyJson.put("power_flag", Integer.parseInt(org.getPowerflag()));
			if (org.getPowerflag().equals("1")) {
				msgBodyJson.put("power_on_time",
						new SimpleDateFormat(CommonConstants.DateFormat_Time).format(org.getPoweron()));
				msgBodyJson.put("power_off_time",
						new SimpleDateFormat(CommonConstants.DateFormat_Time).format(org.getPoweroff()));
			}

			msgBodyJson.put("password", org.getDevicepass());

			String topic = "device-" + device.getDeviceid();
			ActiveMQUtil.publish(topic, msgJson.toString());
			msgevent.setStatus(Msgevent.Status_Sent);
			msgevent.setSendtime(Calendar.getInstance().getTime());
			msgeventMapper.updateByPrimaryKeySelective(msgevent);
		}
	}

	@Transactional
	public void config(String deviceid) throws Exception {
		Device device = deviceMapper.selectByPrimaryKey(deviceid);
		Msgevent msgevent = new Msgevent();
		msgevent.setMsgtype(Msgevent.MsgType_Device_Config);
		msgevent.setObjtype1(Msgevent.ObjType_1_Device);
		msgevent.setObjid1(Integer.parseInt(deviceid));
		msgevent.setObjtype2(Msgevent.ObjType_2_None);
		msgevent.setObjid2(0);
		msgevent.setStatus(Msgevent.Status_Wait);
		msgeventMapper.deleteByDtl(Msgevent.MsgType_Device_Config, Msgevent.ObjType_1_Device, deviceid, null, null,
				null);
		msgeventMapper.insertSelective(msgevent);

		JSONObject msgJson = new JSONObject().put("msg_id", msgevent.getMsgeventid()).put("msg_type", "CONFIG");
		JSONObject msgBodyJson = new JSONObject();
		msgJson.put("msg_body", msgBodyJson);
		msgBodyJson.put("msg_server", CommonConfig.CONFIG_SERVER_IP + ":1883");
		JSONArray topicJsonArray = new JSONArray();
		msgBodyJson.put("msg_topic", topicJsonArray);
		topicJsonArray.put("device-" + deviceid);
		if (device.getDevicegroup() != null) {
			topicJsonArray.put("group-" + device.getDevicegroup().getDevicegroupid());
		}

		Org org = orgMapper.selectByPrimaryKey("" + device.getOrgid());
		if (org.getBackupvideo() != null) {
			JSONObject backupvideoJson = new JSONObject();
			// backupvideoJson.put("type", "video");
			backupvideoJson.put("id", org.getBackupvideoid());
			backupvideoJson.put("url", "http://" + CommonConfig.CONFIG_SERVER_IP + ":" + CommonConfig.CONFIG_SERVER_PORT
					+ "/pixsigdata" + org.getBackupvideo().getFilepath());
			backupvideoJson.put("file", org.getBackupvideo().getFilename());
			backupvideoJson.put("size", org.getBackupvideo().getSize());
			msgBodyJson.put("backup_media", backupvideoJson);
		}

		msgBodyJson.put("power_flag", Integer.parseInt(org.getPowerflag()));
		if (org.getPowerflag().equals("1")) {
			msgBodyJson.put("power_on_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(org.getPoweron()));
			msgBodyJson.put("power_off_time",
					new SimpleDateFormat(CommonConstants.DateFormat_Time).format(org.getPoweroff()));
		}

		msgBodyJson.put("password", org.getDevicepass());

		String topic = "device-" + deviceid;
		ActiveMQUtil.publish(topic, msgJson.toString());
		msgevent.setStatus(Msgevent.Status_Sent);
		msgevent.setSendtime(Calendar.getInstance().getTime());
		msgeventMapper.updateByPrimaryKeySelective(msgevent);
	}

	@Transactional
	public void reboot(String deviceid) throws Exception {
		Msgevent msgevent = new Msgevent();
		msgevent.setMsgtype(Msgevent.MsgType_Device_Reboot);
		msgevent.setObjtype1(Msgevent.ObjType_1_Device);
		msgevent.setObjid1(Integer.parseInt(deviceid));
		msgevent.setObjtype2(Msgevent.ObjType_2_None);
		msgevent.setObjid2(0);
		msgevent.setStatus(Msgevent.Status_Wait);
		msgeventMapper.deleteByDtl(Msgevent.MsgType_Device_Reboot, Msgevent.ObjType_1_Device, deviceid, null, null,
				null);
		msgeventMapper.insertSelective(msgevent);

		JSONObject msgJson = new JSONObject().put("msg_id", msgevent.getMsgeventid()).put("msg_type", "REBOOT");
		JSONObject msgBodyJson = new JSONObject();
		msgJson.put("msg_body", msgBodyJson);

		String topic = "device-" + deviceid;
		ActiveMQUtil.publish(topic, msgJson.toString());
		msgevent.setStatus(Msgevent.Status_Sent);
		msgevent.setSendtime(Calendar.getInstance().getTime());
		msgeventMapper.updateByPrimaryKeySelective(msgevent);
	}
}
