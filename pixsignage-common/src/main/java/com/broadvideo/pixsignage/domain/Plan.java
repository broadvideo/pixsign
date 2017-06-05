package com.broadvideo.pixsignage.domain;

import java.util.Date;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class Plan {
	public final static String PlanType_Solo = "1";
	public final static String PlanType_Multi = "2";

	private Integer planid;

	private Integer orgid;

	private Integer branchid;

	private String plantype;

	private String gridlayoutcode;

	private Date startdate;

	private Date enddate;

	private Date starttime;

	private Date endtime;

	private Date createtime;

	private List<Plandtl> plandtls;

	private List<Planbind> planbinds;

	public Integer getPlanid() {
		return planid;
	}

	public void setPlanid(Integer planid) {
		this.planid = planid;
	}

	public Integer getOrgid() {
		return orgid;
	}

	public void setOrgid(Integer orgid) {
		this.orgid = orgid;
	}

	public Integer getBranchid() {
		return branchid;
	}

	public void setBranchid(Integer branchid) {
		this.branchid = branchid;
	}

	public String getPlantype() {
		return plantype;
	}

	public void setPlantype(String plantype) {
		this.plantype = plantype == null ? null : plantype.trim();
	}

	public String getGridlayoutcode() {
		return gridlayoutcode;
	}

	public void setGridlayoutcode(String gridlayoutcode) {
		this.gridlayoutcode = gridlayoutcode;
	}

	@JSON(format = "yyyy-MM-dd")
	public Date getStartdate() {
		return startdate;
	}

	@JSON(format = "yyyy-MM-dd")
	public void setStartdate(Date startdate) {
		this.startdate = startdate;
	}

	@JSON(format = "yyyy-MM-dd")
	public Date getEnddate() {
		return enddate;
	}

	@JSON(format = "yyyy-MM-dd")
	public void setEnddate(Date enddate) {
		this.enddate = enddate;
	}

	@JSON(format = "HH:mm:ss")
	public Date getStarttime() {
		return starttime;
	}

	@JSON(format = "HH:mm:ss")
	public void setStarttime(Date starttime) {
		this.starttime = starttime;
	}

	@JSON(format = "HH:mm:ss")
	public Date getEndtime() {
		return endtime;
	}

	@JSON(format = "HH:mm:ss")
	public void setEndtime(Date endtime) {
		this.endtime = endtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getCreatetime() {
		return createtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public List<Plandtl> getPlandtls() {
		return plandtls;
	}

	public void setPlandtls(List<Plandtl> plandtls) {
		this.plandtls = plandtls;
	}

	public List<Planbind> getPlanbinds() {
		return planbinds;
	}

	public void setPlanbinds(List<Planbind> planbinds) {
		this.planbinds = planbinds;
	}
}