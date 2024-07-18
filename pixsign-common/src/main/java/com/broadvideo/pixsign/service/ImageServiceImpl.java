package com.broadvideo.pixsign.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsign.domain.Devicefile;
import com.broadvideo.pixsign.domain.Image;
import com.broadvideo.pixsign.persistence.DevicefileMapper;
import com.broadvideo.pixsign.persistence.ImageMapper;

@Service("imageService")
public class ImageServiceImpl implements ImageService {

	@Autowired
	private ImageMapper imageMapper;
	@Autowired
	private DevicefileMapper devicefileMapper;

	public int selectCount(String orgid, String branchid, String folderid, String adflag, String search) {
		return imageMapper.selectCount(orgid, branchid, folderid, adflag, search);
	}

	public List<Image> selectList(String orgid, String branchid, String folderid, String adflag, String search,
			String start, String length) {
		return imageMapper.selectList(orgid, branchid, folderid, adflag, search, start, length);
	}

	public Image selectByPrimaryKey(String imageid) {
		return imageMapper.selectByPrimaryKey(imageid);
	}

	@Transactional
	public void addImage(Image image) {
		if (image.getUuid() == null) {
			image.setUuid(UUID.randomUUID().toString().replace("-", ""));
		}
		imageMapper.insertSelective(image);
	}

	@Transactional
	public void updateImage(Image image) {
		imageMapper.updateByPrimaryKeySelective(image);
	}

	@Transactional
	public void deleteImage(String imageid) {
		devicefileMapper.clearByMedia(Devicefile.ObjType_Image, imageid);
		imageMapper.deleteByPrimaryKey(imageid);
	}

}
