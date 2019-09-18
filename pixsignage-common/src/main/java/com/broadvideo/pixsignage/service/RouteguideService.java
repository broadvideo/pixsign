package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Route;
import com.broadvideo.pixsignage.domain.Routeguide;
import com.broadvideo.pixsignage.domain.Routeguidedtl;

public interface RouteguideService {
	public List<Routeguide> selectList();

	public List<Route> selectRouteList();

	public Routeguide selectByCode(String code);

	public Routeguide selectByPrimaryKey(String routeguideid);

	public void addRouteguide(Routeguide routeguide);

	public void updateRouteguide(Routeguide routeguide);

	public void deleteRouteguide(String routeguideid);

	public void zipRouteguide(String routeguideid) throws Exception;

	public boolean validateCode(Routeguide routeguide);
}
