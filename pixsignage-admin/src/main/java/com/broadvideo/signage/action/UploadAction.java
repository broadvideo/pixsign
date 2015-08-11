package com.broadvideo.signage.action;

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

import com.broadvideo.signage.common.CommonConfig;
import com.broadvideo.signage.domain.Media;
import com.broadvideo.signage.service.MediaService;
import com.broadvideo.signage.util.CommonUtil;
import com.gif4j.GifEncoder;
import com.gif4j.GifFrame;
import com.gif4j.GifImage;

@Scope("request")
@Controller("uploadAction")
public class UploadAction extends BaseAction {
	/**
	 * 
	 */
	private static final long serialVersionUID = 348607038128364659L;

	private static final Logger log = Logger.getLogger(UploadAction.class);

	private File[] mymedia;
	private String[] mymediaContentType;
	private String[] mymediaFileName;
	private String[] name;
	private String[] type;

	@Autowired
	private MediaService mediaService;

	public void upload() throws Exception {
		log.info("Begin upload action process.");
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

					Media media = new Media();
					media.setOrgid(getLoginStaff().getOrgid());
					media.setBranchid(getLoginStaff().getBranchid());
					media.setType(type[i]);
					media.setName(name[i]);
					media.setFilename(mymediaFileName[i]);
					media.setContenttype(mymediaContentType[i]);
					media.setStatus("9");
					media.setDescription(mymediaFileName[i]);
					media.setPreviewduration(0);
					media.setCreatestaffid(getLoginStaff().getStaffid());
					media.setComplete(0);
					media.setUploadtype("0");
					mediaService.addMedia(media);

					String newFileName = "" + media.getMediaid() + "." + FilenameUtils.getExtension(mymediaFileName[i]);

					File fileToCreate;
					if (type[i].equals("1")) {
						log.info("Upload image: " + newFileName);
						fileToCreate = new File(CommonConfig.CONFIG_IMAGE_HOME, newFileName);
						FileUtils.moveFile(mymedia[i], fileToCreate);
						log.info("Finish image upload: " + newFileName);
						try {
							// Generate thumbnail
							media.setThumbnail(CommonUtil.generateThumbnail(fileToCreate, 120));
							log.info("Finish thumbnail generating.");
						} catch (IOException ex) {
							ex.printStackTrace();
						}
					} else {
						log.info("Upload content: " + newFileName);
						fileToCreate = new File(CommonConfig.CONFIG_VIDEO_HOME, newFileName);
						FileUtils.moveFile(mymedia[i], fileToCreate);
						log.info("Finish content upload: " + newFileName);
						try {
							// Generate preview gif
							String cmd = CommonConfig.CONFIG_FFMPEG_HOME + "/ffmpeg -i " + fileToCreate
									+ " -r 1 -ss 1 -t 15 -f image2 " + CommonConfig.CONFIG_TEMP_HOME + "/"
									+ media.getMediaid() + "-%03d.jpg";
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

							File baseDir = new File(CommonConfig.CONFIG_TEMP_HOME);
							List<String> jpgList = new ArrayList<String>();
							for (int j = 1; j < 999; j++) {
								String jpgName = media.getMediaid() + "-" + String.format("%03d", j) + ".jpg";
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
									BufferedImage img = ImageIO.read(new File(CommonConfig.CONFIG_TEMP_HOME + "/"
											+ jpgList.get(j)));
									gifImage.addGifFrame(new GifFrame(img));
								}
								GifEncoder
										.encode(gifImage,
												new File(CommonConfig.CONFIG_IMAGE_HOME + "/gif/" + media.getMediaid()
														+ ".gif"));
								media.setPreviewduration(jpgList.size() - 1);
							}
							log.info("Finish preview generating.");

							// Generate thumbnail
							File thumbnailFile = null;
							if (jpgList.size() >= 6) {
								thumbnailFile = new File(CommonConfig.CONFIG_TEMP_HOME + "/" + jpgList.get(5));
							} else if (jpgList.size() >= 1) {
								thumbnailFile = new File(CommonConfig.CONFIG_TEMP_HOME + "/"
										+ jpgList.get(jpgList.size() - 1));
							}
							if (thumbnailFile != null) {
								media.setThumbnail(CommonUtil.generateThumbnail(thumbnailFile, 120));
							}

							for (int j = 0; j < jpgList.size(); j++) {
								new File(CommonConfig.CONFIG_TEMP_HOME + "/" + jpgList.get(j)).delete();
							}
							log.info("Finish thumbnail generating.");
						} catch (IOException ex) {
							ex.printStackTrace();
						}

					}

					media.setFilename(newFileName);
					media.setSize(FileUtils.sizeOf(fileToCreate));
					FileInputStream fis = new FileInputStream(fileToCreate);
					media.setMd5(DigestUtils.md5Hex(fis));
					fis.close();
					media.setStatus("1");
					media.setComplete(100);
					mediaService.updateMedia(media);

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

		log.info("Finish upload action process.");
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

	public String[] getType() {
		return type;
	}

	public void setType(String[] type) {
		this.type = type;
	}

}
