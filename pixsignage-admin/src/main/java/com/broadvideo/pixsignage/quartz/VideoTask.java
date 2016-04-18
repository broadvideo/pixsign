package com.broadvideo.pixsignage.quartz;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.persistence.VideoMapper;
import com.broadvideo.pixsignage.util.CommonUtil;

public class VideoTask {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private static boolean workflag = false;

	@Autowired
	private VideoMapper videoMapper;

	public void work() {
		try {
			if (workflag) {
				return;
			}
			workflag = true;

			List<Video> videos = videoMapper.selectList(null, null, null, "0", null, null, null);
			for (Video video : videos) {
				handleVideoPreview(video);
			}
		} catch (Exception e) {
			logger.error("VideoTask Quartz Task error: {}", e.getMessage());
		}
		workflag = false;
	}

	private void handleVideoPreview(Video video) {
		String command = CommonConfig.CONFIG_FFMPEG_HOME + "/ffmpeg -y -i " + CommonConfig.CONFIG_PIXDATA_HOME
				+ video.getFilepath() + " -vcodec libx264 -b:v 400k -s 640x360 -acodec libvo_aacenc -b:a 32k "
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

}
