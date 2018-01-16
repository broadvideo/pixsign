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
							String feature1 = vspJson.getString("feature");
							int maxdevices1 = vspJson.getInt("maxdevices");
							long maxstorage1 = vspJson.getLong("maxstorage");
							vsp.setFeature(feature1);
							vsp.setMaxdevices(maxdevices1);
							vsp.setMaxstorage(maxstorage1);

							JSONObject orgJson = dataJson.getJSONObject("org");
							String feature2 = orgJson.getString("feature");
							int maxdevices2 = orgJson.getInt("maxdevices");
							int maxdevices12 = orgJson.getInt("maxdevices1");
							int maxdevices22 = orgJson.getInt("maxdevices2");
							long maxstorage2 = orgJson.getLong("maxstorage");
							org.setFeature(feature2);
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
