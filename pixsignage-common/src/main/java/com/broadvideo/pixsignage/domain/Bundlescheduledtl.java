package com.broadvideo.pixsignage.domain;

public class Bundlescheduledtl {
	private Integer bundlescheduledtlid;

	private Integer bundlescheduleid;

	private Integer bundleid;

	private Integer sequence;

	private Bundle bundle;

	public Integer getBundlescheduledtlid() {
		return bundlescheduledtlid;
	}

	public void setBundlescheduledtlid(Integer bundlescheduledtlid) {
		this.bundlescheduledtlid = bundlescheduledtlid;
	}

	public Integer getBundlescheduleid() {
		return bundlescheduleid;
	}

	public void setBundlescheduleid(Integer bundlescheduleid) {
		this.bundlescheduleid = bundlescheduleid;
	}

	public Integer getBundleid() {
		return bundleid;
	}

	public void setBundleid(Integer bundleid) {
		this.bundleid = bundleid;
	}

	public Integer getSequence() {
		return sequence;
	}

	public void setSequence(Integer sequence) {
		this.sequence = sequence;
	}

	public Bundle getBundle() {
		return bundle;
	}

	public void setBundle(Bundle bundle) {
		this.bundle = bundle;
	}
}