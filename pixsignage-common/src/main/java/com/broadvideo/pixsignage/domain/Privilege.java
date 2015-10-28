package com.broadvideo.pixsignage.domain;

import java.util.Date;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class Privilege {
	private Integer privilegeid;

	private String subsystem;

	private Integer parentid;

	private String name;

	private String menuurl;

	private String icon;

	private String type;

	private String orgtype;

	private String temporgtype;

	private Integer sequence;

	private Date createtime;

	private Privilege parent;

	private List<Privilege> children;

	public Integer getPrivilegeid() {
		return privilegeid;
	}

	public void setPrivilegeid(Integer privilegeid) {
		this.privilegeid = privilegeid;
	}

	public String getSubsystem() {
		return subsystem;
	}

	public void setSubsystem(String subsystem) {
		this.subsystem = subsystem == null ? null : subsystem.trim();
	}

	public Integer getParentid() {
		return parentid;
	}

	public void setParentid(Integer parentid) {
		this.parentid = parentid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name == null ? null : name.trim();
	}

	public String getMenuurl() {
		return menuurl;
	}

	public void setMenuurl(String menuurl) {
		this.menuurl = menuurl == null ? null : menuurl.trim();
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon == null ? null : icon.trim();
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type == null ? null : type.trim();
	}

	public String getOrgtype() {
		return orgtype;
	}

	public void setOrgtype(String orgtype) {
		this.orgtype = orgtype == null ? null : orgtype.trim();
	}

	public String getTemporgtype() {
		return temporgtype;
	}

	public void setTemporgtype(String temporgtype) {
		this.temporgtype = temporgtype;
	}

	public Integer getSequence() {
		return sequence;
	}

	public void setSequence(Integer sequence) {
		this.sequence = sequence;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Date getCreatetime() {
		return createtime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public Privilege getParent() {
		return parent;
	}

	public void setParent(Privilege parent) {
		this.parent = parent;
	}

	public List<Privilege> getChildren() {
		return children;
	}

	public void setChildren(List<Privilege> children) {
		this.children = children;
	}
}