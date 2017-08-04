package com.broadvideo.pixsignage.task;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsignage.domain.Branch;
import com.broadvideo.pixsignage.persistence.BranchMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.util.TaodianUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class TaodianTask {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private static boolean workflag = false;

	@Autowired
	private BranchMapper branchMapper;
	@Autowired
	private DeviceMapper deviceMapper;

	public void work() {
		try {
			if (workflag) {
				return;
			}
			workflag = true;
			logger.info("Start TaodianTask.");
			sendTaodianMsg();
		} catch (Exception e) {
			logger.error("TaodianTask Quartz Task error: {}", e.getMessage());
		}
		workflag = false;
	}

	private void sendTaodianMsg() throws Exception {
		TaodianUtil util = new TaodianUtil("http://120.26.131.108:8080/TDBI/HttpService/getBrandInfo");

		List<Branch> branches = branchMapper.selectTaodianList();
		for (Branch branch : branches) {
			logger.info("refresh branch {} brands from taodian.", branch.getCode());
			util.getbrands(branch.getCode());
			String tags = "";
			if (util.getResponseCode() == TaodianUtil.SUCCESS) {
				JSONObject responseJson = util.getResponseJson();
				JSONArray brandJsons = responseJson.getJSONArray("brands");
				for (int i = 0; i < brandJsons.size() && i < 5; i++) {
					JSONObject brandJson = brandJsons.getJSONObject(i);
					String name = brandJson.getString("name");
					int amount = brandJson.getInt("amount");
					if (i > 0) {
						tags += ",";
					}
					tags += name;
				}
			}
			deviceMapper.updateTags("" + branch.getBranchid(), tags);
		}
	}

}
