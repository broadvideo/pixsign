package com.broadvideo.signage.service;

import java.util.List;

import com.broadvideo.signage.domain.Tpllayout;

public interface TpllayoutService {
	public List<Tpllayout> selectList(String type);
	public Tpllayout selectByPrimaryKey(String tpllayoutid);

	public void addTpllayout(Tpllayout tpllayout);
	public void updateTpllayout(Tpllayout tpllayout);
	public void updateTpllayoutWithRegion(Tpllayout tpllayout);
	public void deleteTpllayout(String[] ids);
}
