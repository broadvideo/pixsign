package com.broadvideo.pixsignage.task;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.broadvideo.pixsignage.common.TreeBuilderUtils;
import com.broadvideo.pixsignage.domain.Branch;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.persistence.StaffMapper;
import com.broadvideo.pixsignage.service.BranchService;
import com.broadvideo.pixsignage.service.ConfigService;
import com.broadvideo.pixsignage.service.OrgService;
import com.broadvideo.pixsignage.service.StaffService;
import com.broadvideo.pixsignage.util.HttpClientUtils;
import com.broadvideo.pixsignage.util.HttpClientUtils.SimpleHttpResponse;

/**
 * 招商证券部门信息同步任务
 * 
 * @author charles
 *
 */
public class CmsOrgUserSyncTask {
	private Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private ConfigService configService;
	@Autowired
	private OrgService orgService;
	@Autowired
	private BranchService branchService;
	@Autowired
	private StaffService staffService;
	@Autowired
	private StaffMapper staffMapper;
	public static Map<String, String> serverMap = new HashMap<String, String>();
	static{
		serverMap.put("development", "http://192.168.2.102:8080");
		serverMap.put("test", "http://172.253.40.250:8081");
		serverMap.put("product", "http://172.253.40.250:8081");
	}
	private static boolean workflag = false;



	public void work() {
		try {
			if (workflag) {
				return;
			}
			workflag = true;
			logger.info("cms:Fetch branch list");
			String branchServiceUrl = this.buildServiceUrl("/oaBase/org/list");
			SimpleHttpResponse resp = HttpClientUtils.doGet(branchServiceUrl, null, null);
			List<Integer> syncbranchIds = new ArrayList<Integer>();
			final Org org = orgService.selectByCode("default");
			final int statusCode = resp.getStatusCode();
			if (statusCode >= 200 && statusCode <= 300) {
				logger.info("cms: get branch list resp body:{}", resp.getBody());
				if (StringUtils.isBlank(resp.getBody())) {
					logger.info("Branch list return null:", resp.getBody());
					return;
				}
				JSONArray branchArr = new JSONArray(resp.getBody());
				List<Branch> syncBranchList = new ArrayList<Branch>();
				Branch top = null;
				for (int i = 0; i < branchArr.length(); i++) {
					JSONObject branchJson = branchArr.getJSONObject(i);
					String fullOrgName = branchJson.optString("fullOrgName");
					String grade = branchJson.optString("grade");
					String orgId = branchJson.optString("orgId");
					String upOrgId = branchJson.optString("upOrgId");
					String orgName = branchJson.optString("orgName");
					String orgNum = branchJson.optString("orgNum");
					Branch branch = new Branch();
					branch.setUuid(orgId);
					branch.setName(orgName);
					branch.setCode(orgNum);
					branch.setParentuuid(upOrgId);
					if (StringUtils.isBlank(upOrgId)) {
						logger.info("cms:find root node({}-{})", orgId, orgName);
						top = branch;
					} else {
						syncBranchList.add(branch);
					}

				}
				if (top == null) {
					logger.error("cms:Not found root node.");
					return;
				}
				TreeBuilderUtils.buildTree(top, syncBranchList, "parentuuid", "uuid", "children");
				Branch root = this.branchService.selectRoot(org.getOrgid() + "").get(0);
				logger.info("sync Branch ......");
				this.syncBranch(syncbranchIds, top, root.getParentid(), org.getOrgid());
				logger.info("Clear invalid branch.....");
				List<Branch> branchList = this.branchService.selectOrgBranchList(org.getOrgid() + "");
				for (Branch branch : branchList) {
					if (StringUtils.isBlank(branch.getUuid())) {
						continue;
					}
					if (syncbranchIds.contains(branch.getBranchid())) {
						logger.info("Exists branch(uuid:{},name:{}) ", branch.getUuid(), branch.getName());
						continue;
					} else {
						logger.info("Delete branch(uuid:{},name:{})", branch.getUuid(), branch.getName());
						this.branchService.deleteBranch(org, branch.getBranchid() + "");
					}
				}

			} else {
				logger.error("Response with error statusCode({})", statusCode);
				return;
			}

			logger.info("cms:Fetch branch staffs....");
			String staffServiceUrl = this.buildServiceUrl("/oaBase/user/byOrgId");
			for (Integer branchId : syncbranchIds) {
				logger.info("cms:Fetch staff under branch({})", branchId);
				Branch selBranch = branchService.selectByPrimaryKey(branchId + "");

				SimpleHttpResponse staffResp = HttpClientUtils.doGet(
						staffServiceUrl + "?" + java.net.URLEncoder.encode("\"" + selBranch.getUuid() + "\"", "UTF-8"),
						null,
						null);
				List<Integer> syncStaffIds = new ArrayList<Integer>();
				if (statusCode >= 200 && statusCode <= 300) {
					logger.info("cms: get branch staffs  resp body:{}", staffResp.getBody());
					if (StringUtils.isBlank(staffResp.getBody())) {
						continue;
					}

					JSONArray staffArr = new JSONArray(staffResp.getBody());
					for (int j = 0; j < staffArr.length(); j++) {
						JSONObject staffJson = staffArr.getJSONObject(j);
						Staff staff = new Staff();
						staff.setUuid(staffJson.getString("userId"));
						staff.setName(staffJson.getString("chsName"));
						staff.setLoginname(staffJson.getString("accountName"));
						staff.setEmail(staffJson.getString("email"));
						staff.setBranchid(branchId);
						Integer staffid = staffService.syncStaff(staff, selBranch.getOrgid());
						syncStaffIds.add(staffid);
					}
					logger.info("cms:clear  branch(uuid:{},name:{}) invalid staffs", selBranch.getUuid(),
							selBranch.getName());
					List<Staff> staffList = this.staffMapper.selectBranchStaffs(branchId + "", org.getOrgid() + "");
					for (Staff staff : staffList) {
						if (StringUtils.isBlank(staff.getUuid())) {
							continue;
						}
						if (syncStaffIds.contains(staff.getStaffid())) {
							logger.info("staff(uuid:{},name:{}) has exits.", staff.getUuid(), staff.getName());
							continue;
						}else{
							logger.info("Delete staff(uuid:{},name:{}) ", staff.getUuid(), staff.getName());
							this.staffService.deleteStaff(staff.getStaffid() + "");
						}
					}

				}

			}
			


			logger.info("cms:end Quartz Task.");

		} catch (Exception e) {
			logger.error("Task error: {}", e.getMessage());
		} finally {
			workflag = false;

		}
	}

	private void syncBranch(List<Integer> branchIds, Branch top, Integer parentId, Integer orgid) {
		top.setParentid(parentId);
		Integer subParentId = this.branchService.syncBranch(top, orgid);
		branchIds.add(subParentId);
		if (top.getChildren() == null || top.getChildren().size() == 0) {
			return;
		}
		for (Branch branch : top.getChildren()) {

			syncBranch(branchIds, branch, subParentId, orgid);
		}

	}

	private String buildServiceUrl(String serviceName) {
		String runEnv = configService.selectValueByCode("RunEnv");
		String serverUrl = serverMap.get(runEnv);
		logger.info("cms fetch serverUrl({}) from key({})", serverUrl, runEnv);
		StringBuilder urlBuilder = new StringBuilder(serverUrl);
		urlBuilder.append(serviceName);
		logger.info("cms:get service url({})", urlBuilder.toString());
		return urlBuilder.toString();
	}



}
