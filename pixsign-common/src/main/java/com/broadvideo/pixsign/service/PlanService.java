package com.broadvideo.pixsign.service;

import java.util.List;

import com.broadvideo.pixsign.domain.Plan;

import net.sf.json.JSONObject;

public interface PlanService {
	public int selectCount(String orgid, String branchid, String subbranchflag, String plantype, String search);

	public List<Plan> selectList(String orgid, String branchid, String subbranchflag, String plantype, String start,
			String length, String search);

	public List<Plan> selectListByBind(String plantype, String bindtype, String bindid);

	public void addPlan(Plan plan);

	public void updatePlan(Plan plan);

	public void deletePlan(String planid);

	public JSONObject generateBundlePlanJson(String deviceid);

	public JSONObject generatePlanJson(String deviceid) throws Exception;
}
