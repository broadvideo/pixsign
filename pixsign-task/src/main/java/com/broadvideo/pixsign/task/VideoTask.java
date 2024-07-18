package com.broadvideo.pixsign.task;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.List;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsign.common.CommonConfig;
import com.broadvideo.pixsign.domain.Video;
import com.broadvideo.pixsign.persistence.ImageMapper;
import com.broadvideo.pixsign.persistence.VideoMapper;
import com.broadvideo.pixsign.util.CommonUtil;

public class VideoTask {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private static boolean workflag = false;

	@Autowired
	private VideoMapper videoMapper;
	@Autowired
	private ImageMapper imageMapper;

	public void work() {
		try {
			if (workflag) {
				return;
			}
			workflag = true;
			logger.info("Start Video Quartz Task.");

			List<Video> videos = videoMapper.selectList(null, null, null, null, "0", null, null, null, null, null);
			for (Video video : videos) {
				parseContent(video);
				handleVideoPreview(video);
			}
		} catch (Exception e) {
			logger.error("VideoTask Quartz Task error: {}", e.getMessage());
		}
		workflag = false;
	}

	private int parseContent(Video video) {
		int result = 0;
		try {
			File f = new File(CommonConfig.CONFIG_PIXDATA_HOME + video.getFilepath());
			video.setSize(FileUtils.sizeOf(f));
			FileInputStream fis = new FileInputStream(f);
			video.setMd5(DigestUtils.md5Hex(fis));
			fis.close();

			String command = CommonConfig.CONFIG_FFMPEG_CMD + " -i " + CommonConfig.CONFIG_PIXDATA_HOME
					+ video.getFilepath();
			logger.info("Begin to parse video content: {}", command);
			Process process = Runtime.getRuntime().exec(command);
			VideoStreamGobbler gobbler = new VideoStreamGobbler(process.getErrorStream(), "ERROR");
			gobbler.start();
			result = process.waitFor();
			// video.setDar(gobbler.getDar());
			video.setDuration(gobbler.getDuration());
			// int bitrate = Math.round(video.getFilesize() * 8 /
			// gobbler.getDuration() / 1000);
			// video.setBitrate(bitrate);
		} catch (Exception ioe) {
			result = -1;
			logger.error(ioe.toString());
		}
		return result;
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

}

class VideoStreamGobbler extends Thread {
	private static Logger logger = LoggerFactory.getLogger(VideoStreamGobbler.class);
	boolean execflag = false;
	InputStream is;
	String type;
	OutputStream os;

	float dar;
	int duration;

	VideoStreamGobbler(InputStream is, String type) {
		this(is, type, null);
	}

	VideoStreamGobbler(InputStream is, String type, OutputStream redirect) {
		this.is = is;
		this.type = type;
		this.os = redirect;
		this.dar = (float) 0;
		this.duration = 0;
	}

	public void run() {
		execflag = true;
		InputStreamReader isr = null;
		BufferedReader br = null;
		try {
			isr = new InputStreamReader(is);
			br = new BufferedReader(isr);
			String line = null;
			while ((line = br.readLine()) != null) {
				logger.info("{}> {}", type, line);
				if (line.trim().startsWith("Stream #0:0")) {
					try {
						int index1 = line.indexOf("DAR");
						int index2 = line.indexOf("]", index1);
						int index3 = line.indexOf(",", index1);
						if (index1 > 0 && index2 > index1) {
							String dar = line.substring(index1 + 4, index2);
							String[] ss = dar.split(":");
							if (ss.length == 2) {
								int dar1 = Integer.parseInt(ss[0]);
								int dar2 = Integer.parseInt(ss[1]);
								float f = (float) dar1 / (float) dar2;
								setDar(f);
								logger.info("set movie dar to {}", f);
							}
						} else if (index1 > 0 && index3 > index1) {
							String dar = line.substring(index1 + 4, index3);
							String[] ss = dar.split(":");
							if (ss.length == 2) {
								int dar1 = Integer.parseInt(ss[0]);
								int dar2 = Integer.parseInt(ss[1]);
								float f = (float) dar1 / (float) dar2;
								setDar(f);
								logger.info("set movie dar to {}", f);
							}
						}
					} catch (Exception e) {
						logger.error(e.getMessage());
					}
				} else if (line.trim().startsWith("Duration: ")) {
					int index = line.trim().indexOf(".");
					String s = line.trim().substring(10, index);
					if (s.length() == 8) {
						int hour = Integer.parseInt(s.substring(0, 2));
						int minute = Integer.parseInt(s.substring(3, 5));
						int second = Integer.parseInt(s.substring(6, 8));
						int duration = hour * 3600 + minute * 60 + second;
						setDuration(duration);
						logger.info("set movie duration to {}", duration);
					}
				}
			}
		} catch (IOException ioe) {
			logger.error("", ioe);
		} finally {
			try {
				br.close();
				isr.close();
			} catch (IOException e) {
				logger.error("", e);
			}
		}
		execflag = false;
	}

	public float getDar() {
		while (execflag) {
			try {
				Thread.sleep(100);
			} catch (Exception e) {
			}
		}
		return dar;
	}

	public void setDar(float dar) {
		this.dar = dar;
	}

	public int getDuration() {
		while (execflag) {
			try {
				Thread.sleep(100);
			} catch (Exception e) {
			}
		}
		return duration;
	}

	public void setDuration(int duration) {
		this.duration = duration;
	}
}
