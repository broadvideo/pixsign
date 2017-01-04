package com.broadvideo.pixsignage.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Audio;
import com.broadvideo.pixsignage.service.AudioService;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("audioAction")
public class AudioAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Audio audio;

	private File[] mymedia;
	private String[] mymediaContentType;
	private String[] mymediaFileName;
	private String[] names;
	private String[] branchids;

	@Autowired
	private AudioService audioService;

	public void doUpload() throws Exception {
		HttpServletResponse response = getHttpServletResponse();
		response.setContentType("text/html;charset=utf-8");
		PrintWriter writer = response.getWriter();
		JSONObject result = new JSONObject();
		JSONArray jsonArray = new JSONArray();

		result.put("files", jsonArray);

		if (mymedia != null) {
			for (int i = 0; i < mymedia.length; i++) {
				JSONObject jsonItem = new JSONObject();
				try {
					logger.info("Upload one audio, file={}", mymediaFileName[i]);
					if (names[i] == null || names[i].equals("")) {
						names[i] = mymediaFileName[i];
					}
					jsonItem.put("name", names[i]);
					jsonItem.put("filename", mymediaFileName[i]);
					jsonItem.put("size", FileUtils.sizeOf(mymedia[i]));

					Audio audio = new Audio();
					audio.setOrgid(getLoginStaff().getOrgid());
					audio.setBranchid(Integer.parseInt(branchids[i]));
					audio.setName(names[i]);
					audio.setFilename(mymediaFileName[i]);
					audio.setStatus("9");
					audio.setDescription(mymediaFileName[i]);
					audio.setCreatestaffid(getLoginStaff().getStaffid());
					audioService.addAudio(audio);

					String newFileName = "" + audio.getAudioid() + "." + FilenameUtils.getExtension(mymediaFileName[i]);
					String audioFilePath;
					audioFilePath = "/audio/upload/" + newFileName;
					File audioFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + audioFilePath);
					if (audioFile.exists()) {
						audioFile.delete();
					}
					FileUtils.moveFile(mymedia[i], audioFile);

					audio.setFilepath(audioFilePath);
					audio.setFilename(newFileName);
					audio.setSize(FileUtils.sizeOf(audioFile));
					FileInputStream fis = new FileInputStream(audioFile);
					audio.setMd5(DigestUtils.md5Hex(fis));
					fis.close();
					audio.setStatus("1");
					audioService.updateAudio(audio);

					jsonItem.put("name", names[i]);
					jsonItem.put("filename", newFileName);
				} catch (Exception e) {
					logger.info("Audio parse error, file={}", mymediaFileName[i], e);
					addActionError(e.getMessage());
					jsonItem.put("error", e.getMessage());
				}
				jsonArray.put(jsonItem);
			}
		}

		writer.write(result.toString());
		writer.close();
	}

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String search = getParameter("sSearch");
			search = SqlUtil.likeEscapeH(search);
			String branchid = getParameter("branchid");
			if (branchid == null || branchid.equals("")) {
				branchid = "" + getLoginStaff().getBranchid();
			}
			String folderid = getParameter("folderid");
			if (folderid == null || folderid.equals("")) {
				folderid = "" + getLoginStaff().getBranch().getTopfolderid();
			}
			String objtype = getParameter("objtype");
			String objid = getParameter("objid");

			int count = audioService.selectCount("" + getLoginStaff().getOrgid(), branchid, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Audio> audioList = audioService.selectList("" + getLoginStaff().getOrgid(), branchid, search, start,
					length);
			for (Audio audio : audioList) {
				aaData.add(audio);
			}
			this.setAaData(aaData);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("AudioAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			audio.setCreatestaffid(getLoginStaff().getStaffid());
			audio.setOrgid(getLoginStaff().getOrgid());
			audio.setBranchid(getLoginStaff().getBranchid());
			audioService.addAudio(audio);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("AudioAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			audioService.updateAudio(audio);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("AudioAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			audioService.deleteAudio("" + audio.getAudioid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("AudioAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Audio getAudio() {
		return audio;
	}

	public void setAudio(Audio audio) {
		this.audio = audio;
	}

	public File[] getMymedia() {
		return mymedia;
	}

	public void setMymedia(File[] mymedia) {
		this.mymedia = mymedia;
	}

	public String[] getMymediaContentType() {
		return mymediaContentType;
	}

	public void setMymediaContentType(String[] mymediaContentType) {
		this.mymediaContentType = mymediaContentType;
	}

	public String[] getMymediaFileName() {
		return mymediaFileName;
	}

	public void setMymediaFileName(String[] mymediaFileName) {
		this.mymediaFileName = mymediaFileName;
	}

	public String[] getNames() {
		return names;
	}

	public void setNames(String[] names) {
		this.names = names;
	}

	public String[] getBranchids() {
		return branchids;
	}

	public void setBranchids(String[] branchids) {
		this.branchids = branchids;
	}

}
