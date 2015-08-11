package com.broadvideo.signage.domain;

import java.util.Date;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class Layout {
    private Integer layoutid;

    private Integer orgid;

    private Integer branchid;

    private String name;
    
    private String type;

    private Integer height;

    private Integer width;

    private Integer bgmediaid;

    private String bgcolor;

    private String status;

    private String description;
    
    private Integer mediaid;

    private Date createtime;

    private Integer createstaffid;

    private String xml;
    
    private int xmlsize;
    
    private String xmlmd5;
    
    private Media bgmedia;
    
    private List<Region> regions;

    private Staff createstaff;

    public Integer getLayoutid() {
        return layoutid;
    }

    public void setLayoutid(Integer layoutid) {
        this.layoutid = layoutid;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getBgmediaid() {
        return bgmediaid;
    }

    public void setBgmediaid(Integer bgmediaid) {
        this.bgmediaid = bgmediaid;
    }

    public String getBgcolor() {
        return bgcolor;
    }

    public void setBgcolor(String bgcolor) {
        this.bgcolor = bgcolor == null ? null : bgcolor.trim();
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

    public Integer getMediaid() {
		return mediaid;
	}

	public void setMediaid(Integer mediaid) {
		this.mediaid = mediaid;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
    public Date getCreatetime() {
        return createtime;
    }

    @JSON(format="yyyy-MM-dd HH:mm:ss")
    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }

    public Integer getCreatestaffid() {
        return createstaffid;
    }

    public void setCreatestaffid(Integer createstaffid) {
        this.createstaffid = createstaffid;
    }

    public String getXml() {
        return xml;
    }

    public void setXml(String xml) {
        this.xml = xml == null ? null : xml.trim();
    }

	public int getXmlsize() {
		return xmlsize;
	}

	public void setXmlsize(int xmlsize) {
		this.xmlsize = xmlsize;
	}

	public String getXmlmd5() {
		return xmlmd5;
	}

	public void setXmlmd5(String xmlmd5) {
		this.xmlmd5 = xmlmd5;
	}

	public List<Region> getRegions() {
		return regions;
	}

	public void setRegions(List<Region> regions) {
		this.regions = regions;
	}

	public Media getBgmedia() {
		return bgmedia;
	}

	public void setBgmedia(Media bgmedia) {
		this.bgmedia = bgmedia;
	}

	public Staff getCreatestaff() {
		return createstaff;
	}

	public void setCreatestaff(Staff createstaff) {
		this.createstaff = createstaff;
	}
}