package com.broadvideo.pixsignage.service;

import java.util.List;

import com.broadvideo.pixsignage.domain.Location;
import com.broadvideo.pixsignage.vo.LocationInfo;

public interface LocationService {

	List<LocationInfo> getLocationTree(Integer orgid);
	List<Location> selectChildren(Integer parentid, Integer orgid);

	Location selectLocation(Integer locationid, Integer orgid);

	Location selectRootLocation(Integer orgid);

	Integer addLocation(Location location);

	void updateLocation(Location location);

	void deleteLocation(Location location);

	boolean validateName(Location location, Integer orgid);

}
