package com.broadvideo.pixsignage.action;

import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
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

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.service.VideoService;
import com.broadvideo.pixsignage.util.SqlUtil;
import com.gif4j.GifEncoder;
import com.gif4j.GifFrame;
import com.gif4j.GifImage;

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
					video.setBranchid(Integer.parseInt(branchids[i]));
					video.setFolderid(Integer.parseInt(folderids[i]));
					video.setName(names[i]);
					video.setFilename(mymediaFileName[i]);
					video.setStatus("9");
					video.setDescription(mymediaFileName[i]);
					video.setCreatestaffid(getLoginStaff().getStaffid());
					video.setProgress(0);
					videoService.addVideo(video);

					String newFileName = "" + video.getVideoid() + "." + FilenameUtils.getExtension(mymediaFileName[i]);

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
					try {
						// Generate preview gif
						String cmd = CommonConfig.CONFIG_FFMPEG_HOME + "/ffmpeg -i " + fileToCreate
								+ " -r 1 -ss 1 -t 15 -f image2 " + CommonConfig.CONFIG_TEMP_HOME + "/"
								+ video.getVideoid() + "-%03d.jpg";
						logger.info("Begin to generate preview and thumbnail: " + cmd);
						Process process = Runtime.getRuntime().exec(cmd);
						InputStream fis = process.getInputStream();
						BufferedReader br = new BufferedReader(new InputStreamReader(fis));
						String line;
						while ((line = br.readLine()) != null) {
							System.out.println(line);
						}
						br.close();
						fis.close();

						List<String> jpgList = new ArrayList<String>();
						for (int j = 1; j < 999; j++) {
							String jpgName = video.getVideoid() + "-" + String.format("%03d", j) + ".jpg";
							if (new File(CommonConfig.CONFIG_TEMP_HOME + "/" + jpgName).exists()) {
								jpgList.add(jpgName);
							} else {
								break;
							}
						}

						if (jpgList.size() > 0) {
							GifImage gifImage = new GifImage();
							gifImage.setDefaultDelay(100);
							for (int j = 0; j < jpgList.size(); j++) {
								BufferedImage img = ImageIO
										.read(new File(CommonConfig.CONFIG_TEMP_HOME + "/" + jpgList.get(j)));
								gifImage.addGifFrame(new GifFrame(img));
							}
							GifEncoder.encode(gifImage, new File(
									CommonConfig.CONFIG_PIXDATA_HOME + "/video/gif/" + video.getVideoid() + ".gif"));
							logger.info("Finish preview generating.");

							// Generate thumbnail
							File srcFile = new File(
									CommonConfig.CONFIG_TEMP_HOME + "/" + jpgList.get(jpgList.size() - 1));
							File destFile = new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video/snapshot/"
									+ video.getVideoid() + ".jpg");
							if (jpgList.size() >= 6) {
								srcFile = new File(CommonConfig.CONFIG_TEMP_HOME + "/" + jpgList.get(5));
							}
							FileUtils.copyFile(srcFile, destFile);
							BufferedImage img = ImageIO.read(destFile);
							video.setWidth(img.getWidth());
							video.setHeight(img.getHeight());
							video.setThumbnail("/video/snapshot/" + video.getVideoid() + ".jpg");

							for (int j = 0; j < jpgList.size(); j++) {
								new File(CommonConfig.CONFIG_TEMP_HOME + "/" + jpgList.get(j)).delete();
							}
							logger.info("Finish thumbnail generating.");
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
			String branchid = getParameter("branchid");
			if (branchid == null || branchid.equals("")) {
				branchid = "" + getLoginStaff().getBranchid();
			}
			String folderid = getParameter("folderid");
			if (folderid == null || folderid.equals("")) {
				folderid = "" + getLoginStaff().getBranch().getTopfolderid();
			}

			int count = videoService.selectCount("" + getLoginStaff().getOrgid(), branchid, folderid, type, null,
					search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Video> videoList = videoService.selectList("" + getLoginStaff().getOrgid(), branchid, folderid, type,
					null, search, start, length);
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

}
