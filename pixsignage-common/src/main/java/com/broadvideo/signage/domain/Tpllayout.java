package com.broadvideo.signage.domain;

import java.util.List;

public class Tpllayout {
    private Integer tpllayoutid;

    private String name;
    
    private String type;
    
    private String code;
    
    private String status;

    private Integer height;

    private Integer width;

    private String description;

    private String ratio;

    List<Tplregion> tplregions;

    public Integer getTpllayoutid() {
        return tpllayoutid;
    }

    public void setTpllayoutid(Integer tpllayoutid) {
        this.tpllayoutid = tpllayoutid;
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

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }

    public String getRatio() {
        return ratio;
    }
    
    public void setRatio(String ratio) {
        this.ratio = ratio == null ? null : ratio.trim();
    }

    public List<Tplregion> getTplregions() {
        return tplregions;
    }

    public void setTplregions(List<Tplregion> tplregions) {
        this.tplregions = tplregions;
    }
}
