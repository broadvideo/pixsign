package biz.videoexpress.pixedx.lmsapi.resource;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import biz.videoexpress.pixedx.lmsapi.bean.BranchInfo;
import biz.videoexpress.pixedx.lmsapi.common.ApiRetCodeEnum;
import biz.videoexpress.pixedx.lmsapi.common.AppException;
import biz.videoexpress.pixedx.lmsapi.common.BasicResp;
import biz.videoexpress.pixedx.lmsapi.common.UserProfile;

import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.common.TreeBuilderUtils;
import com.broadvideo.pixsignage.domain.Branch;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.service.BranchService;
import com.broadvideo.pixsignage.service.StaffService;

@Component
@Path("/branches")
@Produces(MediaType.APPLICATION_JSON)
public class ResBranches extends ResBase {

	private Logger logger = LoggerFactory.getLogger(ResBranches.class);
	@Autowired
	private BranchService branchService;
	@Autowired
	private StaffService staffService;

	@GET
	@Path("/")
	public Response getBranchList(@Context HttpServletRequest req) {
		BasicResp<BranchInfo> basicResp = new BasicResp<BranchInfo>();
		UserProfile profile = currentUserProfile(req);
		try {
			List<Branch> rootList = this.branchService.selectRoot(profile.getOrgId().toString());
			Branch root = rootList.get(0);
			List<Branch> branchList = this.branchService.selectOrgBranchList(profile.getOrgId().toString());
			List<BranchInfo> branchInfoList = new ArrayList<BranchInfo>();
			for (Branch branch : branchList) {
				BranchInfo branchInfo = new BranchInfo();
				branchInfo.setBranchId(branch.getBranchid());
				branchInfo.setName(branch.getName());
				branchInfo.setParentId(branch.getParentid());
				branchInfoList.add(branchInfo);
			}
			BranchInfo rootBranchInfo = new BranchInfo();
			rootBranchInfo.setBranchId(root.getBranchid());
			rootBranchInfo.setName(rootBranchInfo.getName());
			TreeBuilderUtils.buildTree(rootBranchInfo, branchInfoList, "parentId", "branchId", "children");
			basicResp.setData(rootBranchInfo.getChildren());
			return Response.status(Status.OK).entity(basicResp).build();

		} catch (Exception e) {

			logger.error("Get course categories exception.", e);
			throw new AppException(ApiRetCodeEnum.EXCEPTION, "Get course categories exception.");
		}

	}

	@GET
	@Path("/{branch_id}/users")
	public Response getBranchUsers(@Context HttpServletRequest req, @PathParam("branch_id") Integer branchId) {
		BasicResp basicResp = new BasicResp();
		UserProfile profile = currentUserProfile(req);
		try {
			
			List<Staff> staffList = staffService.selectList(CommonConstants.SUBSYSTEM_ORG, null, profile.getOrgId()
					+ "", branchId + "", null,
					"0", "200");
			List<Map<String, Object>> dataList = new ArrayList<Map<String, Object>>();
			for (Staff staff : staffList) {
				Map<String, Object> dataMap = new HashMap<String, Object>();
				dataMap.put("name", staff.getName());
				dataMap.put("user_id", staff.getStaffid());
				dataList.add(dataMap);
			}
			basicResp.setData(dataList);

			return Response.status(Status.OK).entity(basicResp).build();

		} catch (Exception e) {

			logger.error("Get course categories exception.", e);
			throw new AppException(ApiRetCodeEnum.EXCEPTION, "Get course categories exception.");
		}

	}


}
