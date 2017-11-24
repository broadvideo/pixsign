package com.broadvideo.pixsignage.task;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.broadvideo.pixsignage.common.CommonConfig;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Vsp;
import com.broadvideo.pixsignage.persistence.ConfigMapper;
import com.broadvideo.pixsignage.service.OrgService;
import com.broadvideo.pixsignage.service.VspService;
import com.broadvideo.pixsignage.util.CommonUtil;
import com.broadvideo.pixsignage.util.PixOppUtil;

@Service("systemTask")
public class SystemTask extends Thread {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private ConfigMapper configMapper;
	@Autowired
	private VspService vspService;
	@Autowired
	private OrgService orgService;

	public void run() {
		logger.info("Start System Task.");

		while (true) {
			try {
				String key = CommonConfig.SYSTEM_ID;
				CommonConfig.CURRENT_APPVERSION = configMapper.selectValueByCode("APPVersion");
				if (key.length() > 0) {
					String checkcode = CommonUtil.getMd5(key, "pixsign");
					String s = PixOppUtil.refresh("", key, checkcode, CommonConfig.CURRENT_APPVERSION,
							CommonConfig.CURRENT_DBVERSION);
					if (!s.equals("")) {
						JSONObject dataJson = new JSONObject(s).getJSONObject("data");
						if (dataJson != null) {
							String svrurl = dataJson.getString("svrurl");
							if (svrurl.length() > 0) {
								// String shell =
								// "/usr/local/bin/pixsignage-install
								// " + svrurl + " "
								// + CommonConfig.CURRENT_DBVERSION + "
								// pixsignage-db";
								// logger.info("begin to run {}", shell);
								// CommonUtil.execCommand(shell);
							}

							Vsp vsp = vspService.selectByCode("default");
							Org org = orgService.selectByCode("default");

							String name = dataJson.getString("name");
							String vspflag = dataJson.getString("vspflag");

							JSONObject vspJson = dataJson.getJSONObject("vsp");
							String bundleflag1 = vspJson.getString("bundleflag");
							String pageflag1 = vspJson.getString("pageflag");
							String reviewflag1 = vspJson.getString("reviewflag");
							String touchflag1 = vspJson.getString("touchflag");
							String calendarflag1 = vspJson.getString("calendarflag");
							String mscreenflag1 = vspJson.getString("mscreenflag");
							String flowrateflag1 = vspJson.getString("flowrateflag");
							String tagflag1 = vspJson.getString("tagflag");
							String diyflag1 = vspJson.getString("diyflag");
							String meetingflag1 = vspJson.getString("meetingflag");
							String liftflag1 = vspJson.getString("liftflag");
							String streamflag1 = vspJson.getString("streamflag");
							String dvbflag1 = vspJson.getString("dvbflag");
							String videoinflag1 = vspJson.getString("videoinflag");
							int maxdevices1 = vspJson.getInt("maxdevices");
							long maxstorage1 = vspJson.getLong("maxstorage");
							vsp.setBundleflag(bundleflag1);
							vsp.setPageflag(pageflag1);
							vsp.setReviewflag(reviewflag1);
							vsp.setTouchflag(touchflag1);
							vsp.setCalendarflag(calendarflag1);
							vsp.setMscreenflag(mscreenflag1);
							vsp.setFlowrateflag(flowrateflag1);
							vsp.setTagflag(tagflag1);
							vsp.setDiyflag(diyflag1);
							vsp.setMeetingflag(meetingflag1);
							vsp.setLiftflag(liftflag1);
							vsp.setStreamflag(streamflag1);
							vsp.setDvbflag(dvbflag1);
							vsp.setVideoinflag(videoinflag1);
							vsp.setMaxdevices(maxdevices1);
							vsp.setMaxstorage(maxstorage1);

							JSONObject orgJson = dataJson.getJSONObject("org");
							String bundleflag2 = orgJson.getString("bundleflag");
							String pageflag2 = orgJson.getString("pageflag");
							String reviewflag2 = orgJson.getString("reviewflag");
							String touchflag2 = orgJson.getString("touchflag");
							String calendarflag2 = orgJson.getString("calendarflag");
							String sscreenflag2 = orgJson.getString("sscreenflag");
							String mscreenflag2 = orgJson.getString("mscreenflag");
							String flowrateflag2 = orgJson.getString("flowrateflag");
							String tagflag2 = orgJson.getString("tagflag");
							String diyflag2 = orgJson.getString("diyflag");
							String meetingflag2 = orgJson.getString("meetingflag");
							String liftflag2 = orgJson.getString("liftflag");
							String streamflag2 = orgJson.getString("streamflag");
							String dvbflag2 = orgJson.getString("dvbflag");
							String videoinflag2 = orgJson.getString("videoinflag");
							int maxdevices2 = orgJson.getInt("maxdevices");
							int maxdevices12 = orgJson.getInt("maxdevices1");
							int maxdevices22 = orgJson.getInt("maxdevices2");
							long maxstorage2 = orgJson.getLong("maxstorage");
							org.setBundleflag(bundleflag2);
							org.setPageflag(pageflag2);
							org.setReviewflag(reviewflag2);
							org.setTouchflag(touchflag2);
							org.setCalendarflag(calendarflag2);
							org.setSscreenflag(sscreenflag2);
							org.setMscreenflag(mscreenflag2);
							org.setFlowrateflag(flowrateflag2);
							org.setTagflag(tagflag2);
							org.setDiyflag(diyflag2);
							org.setMeetingflag(meetingflag2);
							org.setLiftflag(liftflag2);
							org.setStreamflag(streamflag2);
							org.setDvbflag(dvbflag2);
							org.setVideoinflag(videoinflag2);
							org.setMaxdevices(maxdevices2);
							org.setMaxdevices1(maxdevices12);
							org.setMaxdevices2(maxdevices22);
							org.setMaxstorage(maxstorage2);

							vspService.updateVsp(vsp);
							orgService.updateOrg(org);
						}

					}
					Thread.sleep(600000);
				}
			} catch (Exception ex) {
				logger.error("System Task error: {}", ex);
			}
		}
	}
}
