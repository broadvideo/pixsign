package com.broadvideo.pixsignage.service;

import java.util.HashMap;
import java.util.List;

import com.broadvideo.pixsignage.domain.Page;
import com.broadvideo.pixsignage.domain.Plan;

import net.sf.json.JSONObject;

public interface PlanService {
	public int selectCount(String orgid, String branchid, String subbranchflag, String plantype, String search);

	public List<Plan> selectList(String orgid, String branchid, String subbranchflag, String plantype, String start,
			String length, String search);

	public List<Plan> selectListByBind(String plantype, String bindtype, String bindid);

	public void addPlan(Plan plan);

	public void updatePlan(Plan plan);

	public void deletePlan(String planid);

	public void syncPlan(String planid) throws Exception;

	public void syncPlan(String bindtype, String bindid) throws Exception;

	public void syncPlan2All(String orgid) throws Exception;

	public void syncPlanByBundle(String bundleid) throws Exception;

	public void syncPlanByPage(String orgid, String pageid) throws Exception;

	public void syncPlanByMediagrid(String mediagridid) throws Exception;

	public JSONObject generateBundlePlanJson(String deviceid);

	public JSONObject generatePlanJson(String deviceid) throws Exception;

	public void handleBatch(Page page, HashMap<String, Object>[] binds);

	public void upgrade2multiplan();
}
