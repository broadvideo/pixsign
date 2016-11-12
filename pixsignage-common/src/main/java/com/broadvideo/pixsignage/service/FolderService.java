package com.broadvideo.pixsignage.service;

import com.broadvideo.pixsignage.domain.Folder;

public interface FolderService {
	public Folder selectByPrimaryKey(String folderid);

	public Folder selectRoot(String orgid, String branchid);

	public void addFolder(Folder folder);

	public void updateFolder(Folder folder);

	public void deleteFolder(String folderid);
}
