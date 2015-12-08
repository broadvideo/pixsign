package com.broadvideo.pixsignage.quartz;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.imageio.ImageIO;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FileUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Msgevent;
import com.broadvideo.pixsignage.domain.Vchannel;
import com.broadvideo.pixsignage.domain.Video;
import com.broadvideo.pixsignage.persistence.MsgeventMapper;
import com.broadvideo.pixsignage.persistence.VchannelMapper;
import com.broadvideo.pixsignage.persistence.VideoMapper;
import com.broadvideo.pixsignage.util.CommonUtil;
import com.gif4j.GifEncoder;
import com.gif4j.GifFrame;
import com.gif4j.GifImage;

public class PixboxTask {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private static boolean workflag = false;

	@Autowired
	private MsgeventMapper msgeventMapper;
	@Autowired
	private VchannelMapper vchannelMapper;
	@Autowired
	private VideoMapper videoMapper;

	public void work() {
		try {
			if (workflag) {
				return;
			}
			workflag = true;

			// Send vchannel message to pixbox
			Msgevent channelEvent = msgeventMapper.selectVchannelPixboxEvent();
			if (channelEvent != null && channelEvent.getStatus().equals(Msgevent.Status_Wait)) {
				sendChannelMsg(channelEvent);
			}

			// Sync videos from pixbox
			syncVideos();

		} catch (Exception e) {
			logger.error("PixboxTask Quartz Task error: {}", e.getMessage());
		}
		workflag = false;
	}

	private void sendChannelMsg(Msgevent msgevent) throws Exception {
		JSONObject msgJson = new JSONObject();
		JSONArray channelJsonArray = new JSONArray();
		msgJson.put("vchannels", channelJsonArray);
		List<Vchannel> vchannelList = vchannelMapper.selectList(null, null, null, null);
		for (Vchannel vchannel : vchannelList) {
			JSONObject vchannelJson = new JSONObject();
			channelJsonArray.put(vchannelJson);
			vchannelJson.put("vchannel_uuid", vchannel.getUuid());
			vchannelJson.put("name", vchannel.getName());
			vchannelJson.put("url", "rtsp://" + CommonConfig.CONFIG_SERVER_IP + ":13554/" + vchannel.getVchannelid());
			vchannelJson.put("start_time", "00:00:00");
			vchannelJson.put("end_time", "00:00:00");
		}

		String url = CommonConfig.CONFIG_PIXBOX_SERVER + "vchannels";
		logger.info("Send vchannels message to Pixbox: {}", msgJson.toString());
		// Client c = Client.create();
		// WebResource r = c.resource(url);
		// String s =
		// r.type(MediaType.APPLICATION_JSON_TYPE).accept(MediaType.APPLICATION_JSON_TYPE).post(String.class,msgJson.toString());
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			HttpPost httpPost = new HttpPost(url);
			httpPost.addHeader("content-type", "application/json");
			httpPost.setEntity(new StringEntity(msgJson.toString(), "UTF-8"));
			HttpResponse result = httpclient.execute(httpPost);
			String s = EntityUtils.toString(result.getEntity(), "UTF-8");
			httpclient.close();
			logger.info("Get vchannels response from Pixbox: {}", s);
		} finally {
			httpclient.close();
		}

		msgevent.setStatus(Msgevent.Status_Sent);
		msgevent.setSendtime(Calendar.getInstance().getTime());
		msgeventMapper.updateByPrimaryKeySelective(msgevent);
	}

	private void syncVideos() throws Exception {
		String url = CommonConfig.CONFIG_PIXBOX_SERVER + "medias";
		logger.info("Send medias message to Pixbox");
		// Client c = Client.create();
		// WebResource r = c.resource(url);
		// MultivaluedMap<String, String> params = new MultivaluedMapImpl();
		// String s =
		// r.queryParams(params).accept(MediaType.APPLICATION_JSON_TYPE).get(String.class);
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			HttpGet httpGet = new HttpGet(url);
			httpGet.addHeader("content-type", "application/json");
			HttpResponse result = httpclient.execute(httpGet);
			String s = EntityUtils.toString(result.getEntity(), "UTF-8");
			httpclient.close();
			// logger.info("Get medias response from Pixbox: {}", s);
			JSONObject responseJson = new JSONObject(s);
			JSONArray mediaJsonArray = responseJson.getJSONArray("medias");
			if (mediaJsonArray != null) {
				for (int i = 0; i < mediaJsonArray.length(); i++) {
					JSONObject mediaJson = mediaJsonArray.getJSONObject(i);
					String uuid = mediaJson.getString("uuid");
					String name = mediaJson.getString("name");
					String oldFilePath = mediaJson.getString("filepath");
					Video video = videoMapper.selectByUuid(uuid);
					if (video == null) {
						video = new Video();
						video.setOrgid(1);
						video.setBranchid(1);
						video.setName(name);
						video.setUuid(uuid);
						video.setType(Video.TYPE_EXTERNAL);
						video.setStatus("9");
						video.setCreatestaffid(2);
						video.setProgress(0);
						videoMapper.insertSelective(video);
						// }

						// if (video != null && !video.getStatus().equals("1"))
						// {
						try {
							logger.info("Begin handle external video: videoid={}, uuid={}, name={}, filepath={}",
									video.getVideoid(), video.getUuid(), video.getName(), oldFilePath);
							// Generate new mp4
							String newFileName = "" + video.getVideoid() + ".mp4";
							String newFilePath = CommonConfig.CONFIG_PIXDATA_HOME + "/video/external/" + newFileName;
							if (new File(newFilePath).exists()) {
								FileUtils.forceDelete(new File(newFilePath));
							}
							if (oldFilePath.endsWith(".m3u8")) {
								String command = CommonConfig.CONFIG_FFMPEG_HOME + "/ffmpeg -i " + oldFilePath
										+ " -c copy " + newFilePath;
								logger.info("Begin to convert m3u8 to mp4: {}", command);
								int commandResult = CommonUtil.execCommand(command);
								if (commandResult > 0) {
									logger.error("Convert command error, result={}", commandResult);
									continue;
								}
							} else {
								FileUtils.copyFile(new File(oldFilePath), new File(newFilePath));
							}

							// Generate preview gif
							String command = CommonConfig.CONFIG_FFMPEG_HOME + "/ffmpeg -i " + newFilePath
									+ " -r 1 -ss 1 -t 15 -f image2 " + CommonConfig.CONFIG_TEMP_HOME + "/"
									+ video.getVideoid() + "-%03d.jpg";
							logger.info("Begin to generate preview and thumbnail: {}", command);
							CommonUtil.execCommand(command);

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
								GifEncoder.encode(gifImage, new File(CommonConfig.CONFIG_PIXDATA_HOME + "/image/gif/"
										+ video.getVideoid() + ".gif"));
							}
							logger.info("Finish preview generating.");

							// Generate thumbnail
							if (jpgList.size() >= 6) {
								FileUtils.copyFile(new File(CommonConfig.CONFIG_TEMP_HOME + "/" + jpgList.get(5)),
										new File(CommonConfig.CONFIG_PIXDATA_HOME + "/image/snapshot/"
												+ video.getVideoid() + ".jpg"));
								video.setThumbnail("/image/snapshot/" + video.getVideoid() + ".jpg");
							} else if (jpgList.size() >= 1) {
								FileUtils.copyFile(
										new File(CommonConfig.CONFIG_TEMP_HOME + "/" + jpgList.get(jpgList.size() - 1)),
										new File(CommonConfig.CONFIG_PIXDATA_HOME + "/image/snapshot/"
												+ video.getVideoid() + ".jpg"));
								video.setThumbnail("/image/snapshot/" + video.getVideoid() + ".jpg");
							}

							for (int j = 0; j < jpgList.size(); j++) {
								new File(CommonConfig.CONFIG_TEMP_HOME + "/" + jpgList.get(j)).delete();
							}
							logger.info("Finish thumbnail generating.");

							video.setFilepath("/video/external/" + newFileName);
							video.setFilename(newFileName);
							video.setSize(FileUtils.sizeOf(new File(newFilePath)));
							FileInputStream fis = new FileInputStream(new File(newFilePath));
							video.setMd5(DigestUtils.md5Hex(fis));
							fis.close();
							video.setStatus("1");
							video.setProgress(100);
							videoMapper.updateByPrimaryKeySelective(video);
							logger.info("Finish external video: videoid={}, uuid={}, name={}", video.getVideoid(),
									video.getUuid(), video.getName());
						} catch (Exception ex) {
							logger.error("Handle external video error ", ex);
						}
					}
				}
			}
		} finally {
			httpclient.close();
		}
	}

}
