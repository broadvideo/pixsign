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
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.service.VideoService;
import com.gif4j.GifEncoder;
import com.gif4j.GifFrame;
import com.gif4j.GifImage;

@Scope("request")
@Controller("videoAction")
public class VideoAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -5985696994115314080L;

	private static final Logger log = Logger.getLogger(VideoAction.class);

	private Video video;

	private File[] mymedia;
	private String[] mymediaContentType;
	private String[] mymediaFileName;
	private String[] name;

	@Autowired
	private VideoService videoService;

	public void doUpload() throws Exception {
		log.info("Begin video upload action process.");
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
					if (name[i] == null || name[i].equals("")) {
						name[i] = mymediaFileName[i];
					}
					jsonItem.put("name", name[i]);
					jsonItem.put("filename", mymediaFileName[i]);
					jsonItem.put("size", FileUtils.sizeOf(mymedia[i]));

					Video video = new Video();
					video.setOrgid(getLoginStaff().getOrgid());
					video.setBranchid(getLoginStaff().getBranchid());
					video.setType(Video.TYPE_INTERNAL);
					video.setName(name[i]);
					video.setFilename(mymediaFileName[i]);
					video.setStatus("9");
					video.setDescription(mymediaFileName[i]);
					video.setCreatestaffid(getLoginStaff().getStaffid());
					video.setProgress(0);
					videoService.addVideo(video);

					String newFileName = "" + video.getVideoid() + "." + FilenameUtils.getExtension(mymediaFileName[i]);

					File fileToCreate;

					log.info("Upload content: " + newFileName);
					fileToCreate = new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video/upload", newFileName);
					if (fileToCreate.exists()) {
						fileToCreate.delete();
					}
					FileUtils.moveFile(mymedia[i], fileToCreate);
					log.info("Finish content upload: " + newFileName);

					video.setFilename("/video/upload/" + newFileName);
					try {
						// Generate preview gif
						String cmd = CommonConfig.CONFIG_FFMPEG_HOME + "/ffmpeg -i " + fileToCreate
								+ " -r 1 -ss 1 -t 15 -f image2 " + CommonConfig.CONFIG_TEMP_HOME + "/"
								+ video.getVideoid() + "-%03d.jpg";
						log.info("Begin to generate preview and thumbnail: " + cmd);
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
									CommonConfig.CONFIG_PIXDATA_HOME + "/image/gif/" + video.getVideoid() + ".gif"));
						}
						log.info("Finish preview generating.");

						// Generate thumbnail
						if (jpgList.size() >= 6) {
							FileUtils.copyFile(new File(CommonConfig.CONFIG_TEMP_HOME + "/" + jpgList.get(5)),
									new File(CommonConfig.CONFIG_PIXDATA_HOME + "/image/snapshot/" + video.getVideoid()
											+ ".jpg"));
							video.setThumbnail("/image/snapshot/" + video.getVideoid() + ".jpg");
						} else if (jpgList.size() >= 1) {
							FileUtils.copyFile(
									new File(CommonConfig.CONFIG_TEMP_HOME + "/" + jpgList.get(jpgList.size() - 1)),
									new File(CommonConfig.CONFIG_PIXDATA_HOME + "/image/snapshot/" + video.getVideoid()
											+ ".jpg"));
							video.setThumbnail("/image/snapshot/" + video.getVideoid() + ".jpg");
						}

						for (int j = 0; j < jpgList.size(); j++) {
							new File(CommonConfig.CONFIG_TEMP_HOME + "/" + jpgList.get(j)).delete();
						}
						log.info("Finish thumbnail generating.");
					} catch (IOException ex) {
						ex.printStackTrace();
					}

					video.setSize(FileUtils.sizeOf(fileToCreate));
					FileInputStream fis = new FileInputStream(fileToCreate);
					video.setMd5(DigestUtils.md5Hex(fis));
					fis.close();
					video.setStatus("1");
					video.setProgress(100);
					videoService.updateVideo(video);

					jsonItem.put("name", name[i]);
					jsonItem.put("filename", newFileName);
				} catch (Exception e) {
					e.printStackTrace();
					addActionError(e.getMessage());
					jsonItem.put("error", e.getMessage());
				}
				jsonArray.put(jsonItem);
			}
		}

		writer.write(result.toString());
		writer.close();

		log.info("Finish video upload action process.");
	}

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String branchid = getParameter("branchid");
			String search = getParameter("sSearch");
			String type = getParameter("type");

			if (branchid == null) {
				branchid = "" + getLoginStaff().getBranchid();
			}

			int count = videoService.selectCount("" + getLoginStaff().getOrgid(), branchid, type, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Video> videoList = videoService.selectList("" + getLoginStaff().getOrgid(), branchid, type, search,
					start, length);
			for (int i = 0; i < videoList.size(); i++) {
				aaData.add(videoList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
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

			video.setFilename(video.getName());

			videoService.addVideo(video);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
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
			ex.printStackTrace();
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
			ex.printStackTrace();
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

	public String[] getName() {
		return name;
	}

	public void setName(String[] name) {
		this.name = name;
	}

}
