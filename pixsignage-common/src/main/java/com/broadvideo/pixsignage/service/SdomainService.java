package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Sdomain;

public interface SdomainService {
	public List<Sdomain> selectList();

	public Sdomain selectByCode(String code);

	public Sdomain selectByServername(String servername);
}
