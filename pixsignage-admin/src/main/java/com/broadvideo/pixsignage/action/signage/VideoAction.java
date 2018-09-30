package com.broadvideo.pixsignage.action.signage;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;
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

import com.broadvideo.pixsignage.action.BaseDatatableAction;
import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.persistence.FolderMapper;
import com.broadvideo.pixsignage.service.VideoService;
import com.broadvideo.pixsignage.util.CommonUtil;
import com.broadvideo.pixsignage.util.SqlUtil;

@SuppressWarnings("serial")
@Scope("request")
@Controller("videoAction")
public class VideoAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Video video;

	private File[] mymedia;
	private String[] mymediaContentType;
	private String[] mymediaFileName;
	private String[] names;
	private String[] branchids;
	private String[] folderids;
	private String[] adflags;

	@Autowired
	private FolderMapper folderMapper;
	@Autowired
	private VideoService videoService;

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
					logger.info("Upload one video, file={}", mymediaFileName[i]);
					if (names[i] == null || names[i].equals("")) {
						names[i] = mymediaFileName[i];
					}
					jsonItem.put("name", names[i]);
					jsonItem.put("filename", mymediaFileName[i]);
					jsonItem.put("size", FileUtils.sizeOf(mymedia[i]));

					Video video = new Video();
					video.setOrgid(getLoginStaff().getOrgid());
					video.setBranchid(getLoginStaff().getBranchid());
					video.setType(Video.TYPE_INTERNAL);
					if (branchids == null) {
						int branchid = getLoginStaff().getOrg().getTopbranchid();
						int folderid = folderMapper.selectRoot("" + getLoginStaff().getOrgid(), "" + branchid)
								.getFolderid();
						video.setBranchid(branchid);
						video.setFolderid(folderid);
					} else {
						video.setBranchid(Integer.parseInt(branchids[i]));
						video.setFolderid(Integer.parseInt(folderids[i]));
					}
					video.setAdflag(adflags[i]);
					video.setName(names[i]);
					video.setOname(mymediaFileName[i]);
					video.setFilename(mymediaFileName[i]);
					video.setStatus("9");
					video.setDescription(mymediaFileName[i]);
					video.setCreatestaffid(getLoginStaff().getStaffid());
					video.setProgress(0);
					videoService.addVideo(video);

					String format = FilenameUtils.getExtension(mymediaFileName[i]).toLowerCase();
					String newFileName = "" + video.getVideoid() + "." + format;

					File fileToCreate;

					logger.info("copy video to {}", newFileName);
					fileToCreate = new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video/upload", newFileName);
					if (fileToCreate.exists()) {
						fileToCreate.delete();
					}
					FileUtils.moveFile(mymedia[i], fileToCreate);
					logger.info("Finish content upload: " + newFileName);

					video.setFilepath("/video/upload/" + newFileName);
					video.setFilename(newFileName);
					video.setFormat(format);
					try {
						// Generate preview gif
						FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video/snapshot"));
						String command = CommonConfig.CONFIG_FFMPEG_CMD + " -i " + fileToCreate
								+ " -y -f image2 -ss 5 -vframes 1 " + CommonConfig.CONFIG_PIXDATA_HOME
								+ "/video/snapshot/" + video.getVideoid() + ".jpg";
						logger.info("Begin to generate preview and thumbnail: " + command);
						CommonUtil.execCommand(command);
						File destFile = new File(
								CommonConfig.CONFIG_PIXDATA_HOME + "/video/snapshot/" + video.getVideoid() + ".jpg");
						if (!destFile.exists()) {
							command = CommonConfig.CONFIG_FFMPEG_CMD + " -i " + fileToCreate
									+ " -y -f image2 -ss 1 -vframes 1 " + CommonConfig.CONFIG_PIXDATA_HOME
									+ "/video/snapshot/" + video.getVideoid() + ".jpg";
							CommonUtil.execCommand(command);
						}
						if (destFile.exists()) {
							BufferedImage img = ImageIO.read(destFile);
							video.setWidth(img.getWidth());
							video.setHeight(img.getHeight());
							video.setThumbnail("/video/snapshot/" + video.getVideoid() + ".jpg");
							logger.info("Finish thumbnail generating.");
						} else {
							logger.info("Failed to generate thumbnail.");
						}

					} catch (IOException ex) {
						logger.info("Video parse error, file={}", mymediaFileName[i], ex);
					}

					video.setSize(FileUtils.sizeOf(fileToCreate));
					FileInputStream fis = new FileInputStream(fileToCreate);
					video.setMd5(DigestUtils.md5Hex(fis));
					fis.close();
					video.setStatus("1");
					video.setProgress(100);
					videoService.updateVideo(video);

					jsonItem.put("name", names[i]);
					jsonItem.put("filename", newFileName);
				} catch (Exception e) {
					logger.error("VideoAction doUpload exception, ", e);
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
			String type = getParameter("type");
			String format = getParameter("format");
			String branchid = getParameter("branchid");
			if (branchid == null || branchid.equals("")) {
				branchid = "" + getLoginStaff().getBranchid();
			}
			String folderid = getParameter("folderid");
			if (folderid == null || folderid.equals("")) {
				folderid = "" + getLoginStaff().getBranch().getTopfolderid();
			}
			String adflag = getParameter("adflag");
			if (adflag == null || adflag.equals("")) {
				adflag = "0";
			}

			int count = videoService.selectCount("" + getLoginStaff().getOrgid(), branchid, folderid, type, null,
					format, adflag, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Video> videoList = videoService.selectList("" + getLoginStaff().getOrgid(), branchid, folderid, type,
					null, format, adflag, search, start, length);
			for (Video video : videoList) {
				if (video.getWidth().intValue() == 0 || video.getHeight().intValue() == 0) {
					File f = new File(CommonConfig.CONFIG_PIXDATA_HOME + video.getThumbnail());
					if (f.exists()) {
						BufferedImage img = ImageIO.read(f);
						video.setWidth(img.getWidth());
						video.setHeight(img.getHeight());
						videoService.updateVideo(video);
					}
				}
				aaData.add(video);
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("VideoAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			video.setCreatestaffid(getLoginStaff().getStaffid());
			video.setOrgid(getLoginStaff().getOrgid());
			video.setBranchid(getLoginStaff().getBranchid());
			videoService.addVideo(video);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("VideoAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			videoService.updateVideo(video);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("VideoAction doUpdate exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			videoService.deleteVideo("" + video.getVideoid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("VideoAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Video getVideo() {
		return video;
	}

	public void setVideo(Video video) {
		this.video = video;
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

	public String[] getFolderids() {
		return folderids;
	}

	public void setFolderids(String[] folderids) {
		this.folderids = folderids;
	}

	public String[] getAdflags() {
		return adflags;
	}

	public void setAdflags(String[] adflags) {
		this.adflags = adflags;
	}

}
