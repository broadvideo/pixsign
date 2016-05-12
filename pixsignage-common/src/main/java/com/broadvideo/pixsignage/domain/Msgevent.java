package com.broadvideo.pixsignage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Msgevent {
	public final static String MsgType_Bundle_Schedule = "0";
	public final static String MsgType_Layout_Schedule = "1";
	public final static String MsgType_Region_Schedule = "2";
	public final static String MsgType_VChannel_Info_VCSS = "3";
	public final static String MsgType_VChannel_Schedule_VCSS = "4";
	public final static String MsgType_VChannel_Info_PixBox = "5";
	public final static String MsgType_Device_Config = "6";
	public final static String MsgType_Device_Reboot = "7";

	public final static String ObjType_1_None = "0";
	public final static String ObjType_1_Device = "1";
	public final static String ObjType_1_DeviceGroup = "2";
	public final static String ObjType_1_VChannel = "3";

	public final static String ObjType_2_None = "0";
	public final static String ObjType_2_Region = "1";

	public final static String Status_Wait = "0";
	public final static String Status_Sent = "1";

	private Integer msgeventid;

	private String msgtype;

	private String objtype1;

	private Integer objid1;

	private String objtype2;

	private Integer objid2;

	private String status;

	private String description;

	private Date createtime;

	private Date sendtime;

	public Integer getMsgeventid() {
		return msgeventid;
	}

	public void setMsgeventid(Integer msgeventid) {
		this.msgeventid = msgeventid;
	}

	public String getMsgtype() {
		return msgtype;
	}

	public void setMsgtype(String msgtype) {
		this.msgtype = msgtype == null ? null : msgtype.trim();
	}

	public String getObjtype1() {
		return objtype1;
	}

	public void setObjtype1(String objtype1) {
		this.objtype1 = objtype1 == null ? null : objtype1.trim();
	}

	public Integer getObjid1() {
		return objid1;
	}

	public void setObjid1(Integer objid1) {
		this.objid1 = objid1;
	}

	public String getObjtype2() {
		return objtype2;
	}

	public void setObjtype2(String objtype2) {
		this.objtype2 = objtype2 == null ? null : objtype2.trim();
	}

	public Integer getObjid2() {
		return objid2;
	}

	public void setObjid2(Integer objid2) {
		this.objid2 = objid2;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status == null ? null : status.trim();
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description == null ? null : description.trim();
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getCreatetime() {
		return createtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getSendtime() {
		return sendtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setSendtime(Date sendtime) {
		this.sendtime = sendtime;
	}
}