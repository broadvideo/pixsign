package com.broadvideo.signage.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.signage.domain.Tpllayout;
import com.broadvideo.signage.domain.Tplregion;
import com.broadvideo.signage.persistence.TpllayoutMapper;
import com.broadvideo.signage.persistence.TplregionMapper;


@Service("tpllayoutService")
public class TpllayoutServiceImpl implements TpllayoutService {

	@Autowired
	private TpllayoutMapper tpllayoutMapper ;
	@Autowired
	private TplregionMapper tplregionMapper ;
	
	public List<Tpllayout> selectList(String type) {
		return tpllayoutMapper.selectList(type);
	}
	
	public Tpllayout selectByPrimaryKey(String tpllayoutid) {
		return tpllayoutMapper.selectByPrimaryKey(tpllayoutid);
	}

	@Transactional
	public void addTpllayout(Tpllayout tpllayout) {
		if (tpllayout.getRatio().equals("1")) {
			//16:9
			tpllayout.setWidth(1920);
			tpllayout.setHeight(1080);
		} else if (tpllayout.getRatio().equals("2")) {
			//9:16
			tpllayout.setWidth(1080);
			tpllayout.setHeight(1920);
		} else if (tpllayout.getRatio().equals("3")) {
			//4:3
			tpllayout.setWidth(800);
			tpllayout.setHeight(600);
		} else if (tpllayout.getRatio().equals("4")) {
			//3:4
			tpllayout.setWidth(600);
			tpllayout.setHeight(800);
		}
		tpllayoutMapper.insert(tpllayout);

		Tplregion tplregion = new Tplregion();
		tplregion.setTpllayoutid(tpllayout.getTpllayoutid());
		tplregion.setWidth(tpllayout.getWidth());
		tplregion.setHeight(tpllayout.getHeight());
		tplregion.setTopoffset(0);
		tplregion.setLeftoffset(0);
		tplregion.setZindex(0);
		tplregionMapper.insert(tplregion);		
	}
	
	public void updateTpllayout(Tpllayout tpllayout) {
		tpllayoutMapper.updateByPrimaryKeySelective(tpllayout);
	}
	
	@Transactional
	public void updateTpllayoutWithRegion(Tpllayout tpllayout) {
		tpllayoutMapper.updateByPrimaryKeySelective(tpllayout);
		tplregionMapper.deleteByTpllayout(tpllayout.getTpllayoutid());
		for (int i=0; i<tpllayout.getTplregions().size(); i++) {
			Tplregion tplregion = tpllayout.getTplregions().get(i);
			tplregionMapper.insert(tplregion);
		}
	}
	
	@Transactional
	public void deleteTpllayout(String[] ids) {
		String s = "";
		if (ids.length > 0) s = ids[0];
		for (int i=1; i<ids.length; i++) {
			s += "," + ids[i];
		}
		tplregionMapper.deleteByTpllayouts(s);
		tpllayoutMapper.deleteByKeys(s);
	}
}
