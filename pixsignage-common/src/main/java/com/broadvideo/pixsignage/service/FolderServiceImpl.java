package com.broadvideo.pixsignage.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Folder;
import com.broadvideo.pixsignage.persistence.FolderMapper;

@Service("folderService")
public class FolderServiceImpl implements FolderService {

	@Autowired
	private FolderMapper folderMapper;

	public Folder selectByPrimaryKey(String folderid) {
		return folderMapper.selectByPrimaryKey(folderid);
	}

	public Folder selectRoot(String orgid, String branchid) {
		return folderMapper.selectRoot(orgid, branchid);
	}

	@Transactional
	public void addFolder(Folder folder) {
		folderMapper.insertSelective(folder);
	}

	@Transactional
	public void updateFolder(Folder folder) {
		folderMapper.updateByPrimaryKeySelective(folder);
	}

	@Transactional
	public void deleteFolder(String folderid) {
		folderMapper.deleteByPrimaryKey(folderid);
	}
}
