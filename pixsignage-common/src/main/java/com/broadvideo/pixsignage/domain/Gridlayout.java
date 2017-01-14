package com.broadvideo.pixsignage.domain;

public class Gridlayout {
	private Integer gridlayoutid;

	private String gridlayoutcode;

	private Integer xcount;

	private Integer ycount;

	private String ratio;

	private Integer width;

	private Integer height;

	public Integer getGridlayoutid() {
		return gridlayoutid;
	}

	public void setGridlayoutid(Integer gridlayoutid) {
		this.gridlayoutid = gridlayoutid;
	}

	public String getGridlayoutcode() {
		return gridlayoutcode;
	}

	public void setGridlayoutcode(String gridlayoutcode) {
		this.gridlayoutcode = gridlayoutcode == null ? null : gridlayoutcode.trim();
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

	public String getRatio() {
		return ratio;
	}

	public void setRatio(String ratio) {
		this.ratio = ratio == null ? null : ratio.trim();
	}

	public Integer getWidth() {
		return width;
	}

	public void setWidth(Integer width) {
		this.width = width;
	}

	public Integer getHeight() {
		return height;
	}

	public void setHeight(Integer height) {
		this.height = height;
	}
}