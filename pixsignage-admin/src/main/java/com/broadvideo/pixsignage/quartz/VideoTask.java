package com.broadvideo.pixsignage.quartz;

import java.io.File;
import java.io.FileOutputStream;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Image;
import com.broadvideo.pixsignage.domain.Mmedia;
import com.broadvideo.pixsignage.domain.Mmediadtl;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.persistence.ImageMapper;
import com.broadvideo.pixsignage.persistence.MmediaMapper;
import com.broadvideo.pixsignage.persistence.MmediadtlMapper;
import com.broadvideo.pixsignage.persistence.VideoMapper;
import com.broadvideo.pixsignage.service.MediagridService;
import com.broadvideo.pixsignage.util.CommonUtil;
import com.broadvideo.pixsignage.util.ImageUtil;

public class VideoTask {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private static boolean workflag = false;

	@Autowired
	private VideoMapper videoMapper;
	@Autowired
	private ImageMapper imageMapper;
	@Autowired
	private MmediaMapper mmediaMapper;
	@Autowired
	private MmediadtlMapper mmediadtlMapper;

	@Autowired
	private MediagridService mediagridService;

	public void work() {
		try {
			if (workflag) {
				return;
			}
			workflag = true;
			logger.info("Start Video Quartz Task.");

			List<Video> videos = videoMapper.selectList(null, null, null, null, "0", null, null, null);
			for (Video video : videos) {
				handleVideoPreview(video);
			}

			List<Mmedia> mmedias = mmediaMapper.selectList(Mmedia.Status_Waiting);
			for (Mmedia mmedia : mmedias) {
				if (mmedia.getObjtype().equals(Mmedia.ObjType_Video)) {
					handleVideoCrop(mmedia);
				}
				if (mmedia.getObjtype().equals(Mmedia.ObjType_Image)) {
					handleImageCrop(mmedia);
				}
			}
		} catch (Exception e) {
			logger.error("VideoTask Quartz Task error: {}", e.getMessage());
		}
		workflag = false;
	}

	private void handleVideoPreview(Video video) {
		String command = CommonConfig.CONFIG_FFMPEG_CMD + " -y -i " + CommonConfig.CONFIG_PIXDATA_HOME
				+ video.getFilepath()
				+ " -movflags faststart -vcodec libx264 -b:v 400k -s 640x360 -acodec libvo_aacenc -b:a 32k "
				+ CommonConfig.CONFIG_PIXDATA_HOME + "/video/preview/" + video.getVideoid() + ".mp4";
		logger.info("Begin to convert to preview mp4: {}", command);
		int commandResult = CommonUtil.execCommand(command);
		if (commandResult == 0) {
			logger.info("Convert command success, result={}", commandResult);
			video.setPreviewflag("1");
		} else {
			logger.error("Convert command error, result={}", commandResult);
			video.setPreviewflag("2");
		}
		videoMapper.updateByPrimaryKeySelective(video);
	}

	private void handleVideoCrop(Mmedia mmedia) {
		boolean result = true;
		try {
			List<Mmediadtl> mmediadtls = mmediadtlMapper.selectList("" + mmedia.getMmediaid());
			Video video = videoMapper.selectByPrimaryKey("" + mmedia.getObjid());
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/video/" + video.getVideoid()));

			int xcount = mmedia.getXcount();
			int ycount = mmedia.getYcount();
			for (Mmediadtl mmediadtl : mmediadtls) {
				int xpos = mmediadtl.getXpos();
				int ypos = mmediadtl.getYpos();
				String filename = video.getVideoid() + "-" + mmediadtl.getFileidx() + ".mp4";
				String filepath = "/video/" + video.getVideoid() + "/" + filename;
				String command = CommonConfig.CONFIG_FFMPEG_CMD + " -y -i " + CommonConfig.CONFIG_PIXDATA_HOME
						+ video.getFilepath() + " -vf crop=iw/" + xcount + ":ih/" + ycount + ":iw*"
						+ ((float) xpos / (float) xcount) + ":ih*" + ((float) ypos / (float) ycount) + " "
						+ CommonConfig.CONFIG_PIXDATA_HOME + filepath;
				logger.info("Begin to crop video {} to {}: {}", mmedia.getObjid(), mmediadtl.getFileidx(), command);
				int commandResult = CommonUtil.execCommand(command);
				if (commandResult == 0) {
					logger.info("Crop video success, result={}", commandResult);
					mmediadtl.setFilename(filename);
					mmediadtl.setFilepath(filepath);
					mmediadtlMapper.updateByPrimaryKeySelective(mmediadtl);
				} else {
					result = false;
					logger.error("Crop video error, result={}", commandResult);
					break;
				}
			}
		} catch (Exception e) {
			result = false;
			logger.error("handleVideoCrop exception, ", e);
		}
		if (result) {
			mmedia.setStatus(Mmedia.Status_Active);
		} else {
			mmedia.setStatus(Mmedia.Status_Error);
		}
		mmediaMapper.updateByPrimaryKeySelective(mmedia);
		mediagridService.checkStatus();
	}

	private void handleImageCrop(Mmedia mmedia) {
		boolean result = true;
		try {
			List<Mmediadtl> mmediadtls = mmediadtlMapper.selectList("" + mmedia.getMmediaid());
			Image image = imageMapper.selectByPrimaryKey("" + mmedia.getObjid());
			FileUtils.forceMkdir(new File(CommonConfig.CONFIG_PIXDATA_HOME + "/image/" + image.getImageid()));

			int xcount = mmedia.getXcount();
			int ycount = mmedia.getYcount();
			int width = image.getWidth();
			int height = image.getHeight();
			for (Mmediadtl mmediadtl : mmediadtls) {
				int xpos = mmediadtl.getXpos();
				int ypos = mmediadtl.getYpos();
				int x = (int) (width * xpos / xcount);
				int y = (int) (height * ypos / ycount);
				int w = (int) (width / xcount);
				int h = (int) (height / ycount);

				String filename = image.getImageid() + "-" + mmediadtl.getFileidx() + "."
						+ FilenameUtils.getExtension(image.getFilename());
				String filepath = "/image/" + image.getImageid() + "/" + filename;
				FileOutputStream fos = new FileOutputStream(CommonConfig.CONFIG_PIXDATA_HOME + filepath);

				logger.info("Begin to crop image {} to {}", mmedia.getObjid(), mmediadtl.getFileidx());
				ImageUtil imageutil = new ImageUtil();
				imageutil.cutImage(new File(CommonConfig.CONFIG_PIXDATA_HOME + image.getFilepath()), fos, x, y, w, h);
				logger.info("Crop image success");
				mmediadtl.setFilename(filename);
				mmediadtl.setFilepath(filepath);
				mmediadtlMapper.updateByPrimaryKeySelective(mmediadtl);
				fos.close();
			}
		} catch (Exception e) {
			result = false;
			logger.error("handleImageCrop exception, ", e);
		}
		if (result) {
			mmedia.setStatus("1");
		} else {
			mmedia.setStatus("2");
		}
		mmediaMapper.updateByPrimaryKeySelective(mmedia);
		mediagridService.checkStatus();
	}

}
