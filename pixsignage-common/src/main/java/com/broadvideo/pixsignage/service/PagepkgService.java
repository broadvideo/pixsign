package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Pagepkg;

public interface PagepkgService {
	public int selectCount(int orgid, String branchid, String search);

	public List<Pagepkg> selectList(int orgid, String branchid, String search, String start, String length);

	public void addPagepkg(Pagepkg pagepkg);

	public void updatePagepkg(Pagepkg pagepkg);

	public void deletePagepkg(String pagepkgid);
}
