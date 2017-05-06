package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Devicefile;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Mmediadtl;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.persistence.DevicefileMapper;
import com.broadvideo.pixsignage.persistence.ImageMapper;
import com.broadvideo.pixsignage.persistence.MmediadtlMapper;
import com.broadvideo.pixsignage.persistence.VideoMapper;

@Service("devicefileService")
public class DevicefileServiceImpl implements DevicefileService {

	@Autowired
	private DevicefileMapper devicefileMapper;
	@Autowired
	private VideoMapper videoMapper;
	@Autowired
	private ImageMapper imageMapper;
	@Autowired
	private MmediadtlMapper mmediadtlMapper;

	public int selectCount(String deviceid, String objtype, String status) {
		return devicefileMapper.selectCount(deviceid, objtype, status);
	}

	public List<Devicefile> selectList(String deviceid, String objtype, String status, String start, String length) {
		return devicefileMapper.selectList(deviceid, objtype, status, start, length);
	}

	public Devicefile selectByDeviceMedia(String deviceid, String objtype, String objid) {
		return devicefileMapper.selectByDeviceMedia(deviceid, objtype, objid);
	}

	public List<Devicefile> selectDownloading(String deviceid) {
		return devicefileMapper.selectDownloading(deviceid);
	}

	@Transactional
	public void addDevicefile(Devicefile devicefile) {
		if (devicefile.getObjtype().equals(Devicefile.ObjType_Video)) {
			Video video = videoMapper.selectByPrimaryKey("" + devicefile.getObjid());
			if (video != null) {
				devicefile.setSize(video.getSize());
			}
		} else if (devicefile.getObjtype().equals(Devicefile.ObjType_Image)) {
			Image image = imageMapper.selectByPrimaryKey("" + devicefile.getObjid());
			if (image != null) {
				devicefile.setSize(image.getSize());
			}
		} else if (devicefile.getObjtype().equals(Devicefile.ObjType_CropImage)
				|| devicefile.getObjtype().equals(Devicefile.ObjType_CropVideo)) {
			Mmediadtl mmediadtl = mmediadtlMapper.selectByPrimaryKey("" + devicefile.getObjid());
			if (mmediadtl != null) {
				devicefile.setSize(mmediadtl.getSize());
			}
		}
		devicefileMapper.insertSelective(devicefile);
	}

	@Transactional
	public void updateDevicefile(Devicefile devicefile) {
		devicefileMapper.updateByPrimaryKeySelective(devicefile);
	}

	@Transactional
	public void deleteDevicefile(String devicefileid) {
		devicefileMapper.deleteByPrimaryKey(devicefileid);
	}

	@Transactional
	public void clearByDevice(String deviceid) {
		devicefileMapper.clearByDevice(deviceid);
	}

	@Transactional
	public void refreshDevicefiles(String bindtype, String bindid) {
		if (bindtype.equals("1")) {
			// devicefileMapper.deleteDeviceVideoFiles(bindid);
			// devicefileMapper.deleteDeviceImageFiles(bindid);
			// devicefileMapper.insertDeviceVideoFiles(bindid);
			// devicefileMapper.insertDeviceImageFiles(bindid);
		} else if (bindtype.equals("2")) {
			// devicefileMapper.deleteDevicegroupVideoFiles(bindid);
			// devicefileMapper.deleteDevicegroupImageFiles(bindid);
			// devicefileMapper.insertDevicegroupVideoFiles(bindid);
			// devicefileMapper.insertDevicegroupImageFiles(bindid);
		}
	}
}
