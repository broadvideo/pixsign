package com.broadvideo.pixsignage.service;

import java.io.File;
import java.util.List;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Devicegrid;
import com.broadvideo.pixsignage.domain.Gridlayout;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.DevicegridMapper;
import com.broadvideo.pixsignage.persistence.GridlayoutMapper;

@Service("devicegridService")
public class DevicegridServiceImpl implements DevicegridService {

	@Autowired
	private DevicegridMapper devicegridMapper;
	@Autowired
	private GridlayoutMapper gridlayoutMapper;
	@Autowired
	private DeviceMapper deviceMapper;

	public Devicegrid selectByPrimaryKey(String devicegridid) {
		return devicegridMapper.selectByPrimaryKey(devicegridid);
	}

	public int selectCount(String orgid, String branchid, String gridlayoutcode, String devicegroupid, String search) {
		return devicegridMapper.selectCount(orgid, branchid, gridlayoutcode, devicegroupid, search);
	}

	public List<Devicegrid> selectList(String orgid, String branchid, String gridlayoutcode, String devicegroupid,
			String search, String start, String length) {
		return devicegridMapper.selectList(orgid, branchid, gridlayoutcode, devicegroupid, search, start, length);
	}

	@Transactional
	public void design(Devicegrid devicegrid) throws Exception {
		devicegridMapper.unbindDevices("" + devicegrid.getDevicegridid());
		List<Device> devices = devicegrid.getDevices();
		for (Device device : devices) {
			deviceMapper.updateByPrimaryKeySelective(device);
		}

		String snapshotdtl = devicegrid.getSnapshotdtl();
		if (snapshotdtl.startsWith("data:image/png;base64,")) {
			snapshotdtl = snapshotdtl.substring(22);
		}
		String snapshotFilePath = "/devicegrid/" + devicegrid.getDevicegridid() + "/snapshot/"
				+ devicegrid.getDevicegridid() + ".png";
		File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
		FileUtils.writeByteArrayToFile(snapshotFile, Base64.decodeBase64(snapshotdtl), false);
		devicegrid.setSnapshot(snapshotFilePath);
		devicegridMapper.updateByPrimaryKeySelective(devicegrid);
	}

	@Transactional
	public void addDevicegrid(Devicegrid devicegrid) throws Exception {
		Gridlayout gridlayout = gridlayoutMapper.selectByCode(devicegrid.getGridlayoutcode());
		devicegrid.setXcount(gridlayout.getXcount());
		devicegrid.setYcount(gridlayout.getYcount());
		devicegrid.setRatio(gridlayout.getRatio());
		devicegrid.setWidth(gridlayout.getWidth());
		devicegrid.setHeight(gridlayout.getHeight());
		devicegridMapper.insertSelective(devicegrid);

		String snapshotdtl = devicegrid.getSnapshotdtl();
		if (snapshotdtl.startsWith("data:image/png;base64,")) {
			snapshotdtl = snapshotdtl.substring(22);
		}
		String snapshotFilePath = "/devicegrid/" + devicegrid.getDevicegridid() + "/snapshot/"
				+ devicegrid.getDevicegridid() + ".png";
		File snapshotFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + snapshotFilePath);
		FileUtils.writeByteArrayToFile(snapshotFile, Base64.decodeBase64(snapshotdtl), false);
		devicegrid.setSnapshot(snapshotFilePath);
		devicegridMapper.updateByPrimaryKeySelective(devicegrid);
	}

	@Transactional
	public void updateDevicegrid(Devicegrid devicegrid) {
		devicegridMapper.updateByPrimaryKeySelective(devicegrid);
	}

	@Transactional
	public void deleteDevicegrid(String devicegridid) {
		devicegridMapper.unbindDevices(devicegridid);
		devicegridMapper.deleteByPrimaryKey(devicegridid);
	}

}
