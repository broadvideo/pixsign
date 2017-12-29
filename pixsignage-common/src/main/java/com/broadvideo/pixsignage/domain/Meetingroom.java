package com.broadvideo.pixsignage.domain;

import java.math.BigDecimal;
import java.util.Date;

public class Meetingroom {
    private Integer meetingroomid;

    private String uuid;

    private String terminalid;
    private String terminalid2;
    private String terminalid3;
    private String code;

    private String name;

    private String description;

    private Integer locationid;
	private String locationname;

    private String layout;

    private Integer peoples;

    private BigDecimal feeperhour;
    private String equipmentflag;
    private String openflag;
    private String auditflag;

    private String qrcode;

    private Integer orgid;

    private Date createtime;

    private Integer createstaffid;

    private Date updatetime;

    private Integer updatestaffid;

    private String status;
	private String search;

    public Integer getMeetingroomid() {
        return meetingroomid;
    }

    public void setMeetingroomid(Integer meetingroomid) {
        this.meetingroomid = meetingroomid;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid == null ? null : uuid.trim();
    }
    public String getTerminalid() {
        return terminalid;
    }
    public void setTerminalid(String terminalid) {
        this.terminalid = terminalid == null ? null : terminalid.trim();
    }
    public String getTerminalid2() {
        return terminalid2;
    }
    public void setTerminalid2(String terminalid2) {
        this.terminalid2 = terminalid2 == null ? null : terminalid2.trim();
    }
    public String getTerminalid3() {
        return terminalid3;
    }
    public void setTerminalid3(String terminalid3) {
        this.terminalid3 = terminalid3 == null ? null : terminalid3.trim();
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code == null ? null : code.trim();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }

    public Integer getLocationid() {
        return locationid;
    }

    public void setLocationid(Integer locationid) {
        this.locationid = locationid;
    }

	public String getLocationname() {
		return locationname;
	}

	public void setLocationname(String locationname) {
		this.locationname = locationname;
	}

	public String getLayout() {
        return layout;
    }

    public void setLayout(String layout) {
        this.layout = layout == null ? null : layout.trim();
    }

    public Integer getPeoples() {
        return peoples;
    }

    public void setPeoples(Integer peoples) {
        this.peoples = peoples;
    }

    public BigDecimal getFeeperhour() {
        return feeperhour;
    }
    public void setFeeperhour(BigDecimal feeperhour) {
        this.feeperhour = feeperhour;
    }
    public String getEquipmentflag() {
        return equipmentflag;
    }
    public void setEquipmentflag(String equipmentflag) {
        this.equipmentflag = equipmentflag == null ? null : equipmentflag.trim();
    }
    public String getOpenflag() {
        return openflag;
    }

    public void setOpenflag(String openflag) {
        this.openflag = openflag == null ? null : openflag.trim();
    }
    public String getAuditflag() {
        return auditflag;
    }
    public void setAuditflag(String auditflag) {
        this.auditflag = auditflag == null ? null : auditflag.trim();
    }

    public String getQrcode() {
        return qrcode;
    }

    public void setQrcode(String qrcode) {
        this.qrcode = qrcode == null ? null : qrcode.trim();
    }

    public Integer getOrgid() {
        return orgid;
    }

    public void setOrgid(Integer orgid) {
        this.orgid = orgid;
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }

    public Integer getCreatestaffid() {
        return createstaffid;
    }

    public void setCreatestaffid(Integer createstaffid) {
        this.createstaffid = createstaffid;
    }

    public Date getUpdatetime() {
        return updatetime;
    }

    public void setUpdatetime(Date updatetime) {
        this.updatetime = updatetime;
    }

    public Integer getUpdatestaffid() {
        return updatestaffid;
    }

    public void setUpdatestaffid(Integer updatestaffid) {
        this.updatestaffid = updatestaffid;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status == null ? null : status.trim();
    }

	public String getSearch() {
		return search;
	}

	public void setSearch(String search) {
		this.search = search;
	}
}