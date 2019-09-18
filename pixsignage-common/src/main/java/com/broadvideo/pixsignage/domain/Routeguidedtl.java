package com.broadvideo.pixsignage.domain;

public class Routeguidedtl {
    private Integer routeguidedtlid;

    private Integer routeguideid;

    private Integer routeid;

    private String routelines;
    
    private Route route;

    public Integer getRouteguidedtlid() {
        return routeguidedtlid;
    }

    public void setRouteguidedtlid(Integer routeguidedtlid) {
        this.routeguidedtlid = routeguidedtlid;
    }

    public Integer getRouteguideid() {
        return routeguideid;
    }

    public void setRouteguideid(Integer routeguideid) {
        this.routeguideid = routeguideid;
    }

    public Integer getRouteid() {
        return routeid;
    }

    public void setRouteid(Integer routeid) {
        this.routeid = routeid;
    }

    public String getRoutelines() {
        return routelines;
    }

    public void setRoutelines(String routelines) {
        this.routelines = routelines == null ? null : routelines.trim();
    }

	public Route getRoute() {
		return route;
	}

	public void setRoute(Route route) {
		this.route = route;
	}
}