package com.broadvideo.signage.domain;

import java.util.Date;

import org.apache.struts2.json.annotations.JSON;

public class Regiondtl {
    private Integer regiondtlid;

    private Integer regionid;

    private String mediatype;

    private Integer mediaid;

    private Integer duration;

    private String raw;

    private String direction;

    private Integer speed;

    private String color;

    private Integer size;

    private Integer opacity;

    private Integer sequence;
    
    private String uri;
    
    private Date fromdate;

    private Date todate;

    private Media media;

    public Integer getRegiondtlid() {
        return regiondtlid;
    }

    public void setRegiondtlid(Integer regiondtlid) {
        this.regiondtlid = regiondtlid;
    }

    public Integer getRegionid() {
        return regionid;
    }

    public void setRegionid(Integer regionid) {
        this.regionid = regionid;
    }

    public String getMediatype() {
        return mediatype;
    }

    public void setMediatype(String mediatype) {
        this.mediatype = mediatype == null ? null : mediatype.trim();
    }

    public Integer getMediaid() {
        return mediaid;
    }

    public void setMediaid(Integer mediaid) {
        this.mediaid = mediaid;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getRaw() {
        return raw;
    }

    public void setRaw(String raw) {
        this.raw = raw == null ? null : raw.trim();
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction == null ? null : direction.trim();
    }

    public Integer getSpeed() {
        return speed;
    }

    public void setSpeed(Integer speed) {
        this.speed = speed;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color == null ? null : color.trim();
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public Integer getOpacity() {
        return opacity;
    }

    public void setOpacity(Integer opacity) {
        this.opacity = opacity;
    }

    public Integer getSequence() {
        return sequence;
    }

    public void setSequence(Integer sequence) {
        this.sequence = sequence;
    }

	public String getUri() {
		return uri;
	}

	public void setUri(String uri) {
		this.uri = uri;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Date getFromdate() {
		return fromdate;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public void setFromdate(Date fromdate) {
		this.fromdate = fromdate;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Date getTodate() {
		return todate;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public void setTodate(Date todate) {
		this.todate = todate;
	}

	public Media getMedia() {
		return media;
	}

	public void setMedia(Media media) {
		this.media = media;
	}
}