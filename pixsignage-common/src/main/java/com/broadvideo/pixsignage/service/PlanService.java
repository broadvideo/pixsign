package com.broadvideo.pixsignage.service;

import java.util.List;

import org.json.JSONObject;

import com.broadvideo.pixsignage.domain.Plan;

public interface PlanService {
	public int selectCount(String orgid, String branchid, String plantype);

	public List<Plan> selectList(String orgid, String branchid, String plantype, String start, String length);

	public List<Plan> selectListByBind(String plantype, String bindtype, String bindid);

	public void addPlan(Plan plan);

	public void updatePlan(Plan plan);

	public void deletePlan(String planid);

	public void syncPlan(String planid) throws Exception;

	public void syncPlan(String bindtype, String bindid) throws Exception;

	public void syncPlanByMediagrid(String mediagridid) throws Exception;

	public JSONObject generatePlanJson(String deviceid);

	public void upgrade2multiplan();
}
