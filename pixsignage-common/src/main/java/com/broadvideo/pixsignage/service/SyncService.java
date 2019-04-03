package com.broadvideo.pixsignage.service;

public interface SyncService {
	public void sync(String bindtype, String bindid, boolean isMQ) throws Exception;

	public void syncPlan(String planid) throws Exception;

	public void syncByBundle(String orgid, String bundleid) throws Exception;

	public void syncByPage(String orgid, String pageid) throws Exception;

	public void syncByMediagrid(String mediagridid) throws Exception;

	public void syncByMedialist(String medialistid) throws Exception;
}
