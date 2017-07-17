package com.broadvideo.pixsignage.action;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.pixsignage.domain.Plan;
import com.broadvideo.pixsignage.service.PlanService;

@SuppressWarnings("serial")
@Scope("request")
@Controller("planAction")
public class PlanAction extends BaseDatatableAction {
	private Logger logger = LoggerFactory.getLogger(getClass());

	private Plan plan;

	@Autowired
	private PlanService planService;

	public String doList() {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String branchid = getParameter("branchid");
			if (branchid == null || branchid.equals("")) {
				branchid = "" + getLoginStaff().getBranchid();
			}
			String plantype = getParameter("plantype");

			List<Object> aaData = new ArrayList<Object>();
			int count = planService.selectCount("" + getLoginStaff().getOrgid(), branchid, plantype);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);
			List<Plan> planList = planService.selectList("" + getLoginStaff().getOrgid(), branchid, plantype, start,
					length);
			for (int i = 0; i < planList.size(); i++) {
				aaData.add(planList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PlanAction doList exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doListByBind() {
		try {
			String plantype = getParameter("plantype");
			String bindtype = getParameter("bindtype");
			String bindid = getParameter("bindid");

			List<Object> aaData = new ArrayList<Object>();
			List<Plan> planList = planService.selectListByBind(plantype, bindtype, bindid);
			for (int i = 0; i < planList.size(); i++) {
				aaData.add(planList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PlanAction doListByBind exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDesign() {
		try {
			if (plan.getPlanid().intValue() == 0) {
				plan.setOrgid(getLoginStaff().getOrgid());
				plan.setBranchid(getLoginStaff().getBranchid());
				planService.addPlan(plan);
			} else {
				planService.updatePlan(plan);
			}
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PlanAction doAdd exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			planService.deletePlan("" + plan.getPlanid());
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PlanAction doDelete exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doSync() {
		try {
			String planid = getParameter("planid");
			planService.syncPlan(planid);
			logger.info("Plan {} sync success", planid);
			return SUCCESS;
		} catch (Exception ex) {
			logger.error("PlanAction doSync exception, ", ex);
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public Plan getPlan() {
		return plan;
	}

	public void setPlan(Plan plan) {
		this.plan = plan;
	}

}
