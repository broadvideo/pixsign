package com.broadvideo.pixsignage.task;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.List;

import org.apache.commons.codec.digest.DigestUtils;
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

			List<Video> videos = videoMapper.selectList(null, null, null, null, "0", null, null, null, null, null);
			for (Video video : videos) {
				parseContent(video);
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
					mmediadtl.setSize(FileUtils.sizeOf(new File(CommonConfig.CONFIG_PIXDATA_HOME + filepath)));
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
				mmediadtl.setSize(FileUtils.sizeOf(new File(CommonConfig.CONFIG_PIXDATA_HOME + filepath)));
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
