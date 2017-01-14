package com.broadvideo.pixsignage.domain;

import java.util.Date;

public class Mmedia {
	public final static String ObjType_Video = "1";
	public final static String ObjType_Image = "2";

	public final static String Status_Waiting = "0";
	public final static String Status_Active = "1";
	public final static String Status_Error = "2";
	public final static String Status_Delete = "9";

	private Integer mmediaid;

	private String objtype;

	private Integer objid;

	private Integer xcount;

	private Integer ycount;

	private String status;

	private Date createtime;

	public Integer getMmediaid() {
		return mmediaid;
	}

	public void setMmediaid(Integer mmediaid) {
		this.mmediaid = mmediaid;
	}

	public String getObjtype() {
		return objtype;
	}

	public void setObjtype(String objtype) {
		this.objtype = objtype == null ? null : objtype.trim();
	}

	public Integer getObjid() {
		return objid;
	}

	public void setObjid(Integer objid) {
		this.objid = objid;
	}

	public Integer getXcount() {
		return xcount;
	}

	public void setXcount(Integer xcount) {
		this.xcount = xcount;
	}

	public Integer getYcount() {
		return ycount;
	}

	public void setYcount(Integer ycount) {
		this.ycount = ycount;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status == null ? null : status.trim();
	}

	public Date getCreatetime() {
		return createtime;
	}

	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}
}