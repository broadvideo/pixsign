package com.broadvideo.signage.domain;

import java.util.List;

public class Region {
    private Integer regionid;

    private Integer layoutid;
    
    private String code; 

    private Integer height;

    private Integer width;

    private Integer topoffset;

    private Integer leftoffset;

    private Integer zindex;
    
    List<Regiondtl> regiondtls;

    public Integer getRegionid() {
        return regionid;
    }

    public void setRegionid(Integer regionid) {
        this.regionid = regionid;
    }

    public Integer getLayoutid() {
        return layoutid;
    }

    public void setLayoutid(Integer layoutid) {
        this.layoutid = layoutid;
    }

    public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
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

    public Integer getTopoffset() {
        return topoffset;
    }

    public void setTopoffset(Integer topoffset) {
        this.topoffset = topoffset;
    }

    public Integer getLeftoffset() {
        return leftoffset;
    }

    public void setLeftoffset(Integer leftoffset) {
        this.leftoffset = leftoffset;
    }

    public Integer getZindex() {
        return zindex;
    }

    public void setZindex(Integer zindex) {
        this.zindex = zindex;
    }

	public List<Regiondtl> getRegiondtls() {
		return regiondtls;
	}

	public void setRegiondtls(List<Regiondtl> regiondtls) {
		this.regiondtls = regiondtls;
	}
}