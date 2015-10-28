package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Image;

public interface ImageService {
	public int selectCount(String orgid, String branchid, String search);

	public List<Image> selectList(String orgid, String branchid, String search, String start, String length);

	public Image selectByPrimaryKey(String imageid);

	public void addImage(Image image);

	public void updateImage(Image image);

	public void deleteImage(String imageid);
}
