package com.broadvideo.pixsignage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.persistence.ImageMapper;

@Service("imageService")
public class ImageServiceImpl implements ImageService {

	@Autowired
	private ImageMapper imageMapper;

	public int selectCount(String orgid, String branchid, String search) {
		return imageMapper.selectCount(orgid, branchid, search);
	}

	public List<Image> selectList(String orgid, String branchid, String search, String start, String length) {
		return imageMapper.selectList(orgid, branchid, search, start, length);
	}

	public Image selectByPrimaryKey(String imageid) {
		return imageMapper.selectByPrimaryKey(imageid);
	}

	@Transactional
	public void addImage(Image image) {
		imageMapper.insertSelective(image);
	}

	@Transactional
	public void updateImage(Image image) {
		imageMapper.updateByPrimaryKeySelective(image);
	}

	@Transactional
	public void deleteImage(String imageid) {
		imageMapper.deleteByPrimaryKey(imageid);
	}

}
