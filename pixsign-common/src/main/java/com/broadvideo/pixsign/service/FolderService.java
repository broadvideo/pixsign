package com.broadvideo.pixsign.service;

import com.broadvideo.pixsign.domain.Folder;

public interface FolderService {
	public Folder selectByPrimaryKey(String folderid);

	public Folder selectRoot(String orgid, String branchid);

	public void addFolder(Folder folder);

	public void updateFolder(Folder folder);

	public void deleteFolder(String folderid);
}
