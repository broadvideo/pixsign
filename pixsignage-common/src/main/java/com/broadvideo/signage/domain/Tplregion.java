package com.broadvideo.signage.domain;

public class Tplregion {
    private Integer tplregionid;

    private Integer tpllayoutid;
    
    private String code;

    private Integer height;

    private Integer width;

    private Integer topoffset;

    private Integer leftoffset;

    private Integer zindex;

    public Integer getTplregionid() {
        return tplregionid;
    }

    public void setTplregionid(Integer tplregionid) {
        this.tplregionid = tplregionid;
    }

    public Integer getTpllayoutid() {
        return tpllayoutid;
    }

    public void setTpllayoutid(Integer tpllayoutid) {
        this.tpllayoutid = tpllayoutid;
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
}