package com.broadvideo.pixsign.action.signage;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsign.action.BaseDatatableAction;
import com.broadvideo.pixsign.domain.Folder;
import com.broadvideo.pixsign.service.FolderService;
import com.broadvideo.pixsign.service.ImageService;
import com.broadvideo.pixsign.service.VideoService;

@SuppressWarnings("serial")
@Scope("request")
@Controller("folderAction")
public class FolderAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Folder folder;
	private String[] deviceids;

	@Autowired
	private FolderService folderService;
	@Autowired
	private VideoService videoService;
	@Autowired
	private ImageService imageService;

	public String doList() {
		try {
			String branchid = getParameter("branchid");
			if (branchid == null || branchid.equals("")) {
				branchid = "" + getLoginStaff().getBranchid();
			}
			List<Object> aaData = new ArrayList<Object>();
			Folder folder = folderService.selectRoot("" + getLoginStaff().getOrgid(), branchid);
			aaData.add(folder);
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("FolderAction doList exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			folder.setCreatestaffid(getLoginStaff().getStaffid());
			folder.setOrgid(getLoginStaff().getOrgid());
			folderService.addFolder(folder);
			setData(folder);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("FolderAction doAdd exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			folderService.updateFolder(folder);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("FolderAction doUpdate exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			int count1 = videoService.selectCount("" + getLoginStaff().getOrgid(), null, "" + folder.getFolderid(),
					null, null, null, null, null);
			int count2 = imageService.selectCount("" + getLoginStaff().getOrgid(), null, "" + folder.getFolderid(),
					null, null);
			Folder oldFolder = folderService.selectByPrimaryKey("" + folder.getFolderid());
			if (count1 > 0 || count2 > 0) {
				setErrorcode(-1);
				setErrormsg("Cannot delete the folder with images/videos");
				return ERROR;
			} else if (oldFolder.getChildren() != null && oldFolder.getChildren().size() > 0) {
				setErrorcode(-1);
				setErrormsg("Cannot delete the folder with children");
				return ERROR;
			} else {
				folderService.deleteFolder("" + folder.getFolderid());
				return SUCCESS;
			}
		} catch (Exception ex) {
			logger.error("FolderAction doDelete exception", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Folder getFolder() {
		return folder;
	}

	public void setFolder(Folder folder) {
		this.folder = folder;
	}

	public String[] getDeviceids() {
		return deviceids;
	}

	public void setDeviceids(String[] deviceids) {
		this.deviceids = deviceids;
	}
}
