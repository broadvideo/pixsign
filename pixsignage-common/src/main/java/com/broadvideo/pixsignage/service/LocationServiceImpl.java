package com.broadvideo.pixsignage.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.GlobalFlag;
import com.broadvideo.pixsignage.common.TreeBuilderUtils;
import com.broadvideo.pixsignage.domain.Location;
import com.broadvideo.pixsignage.persistence.LocationMapper;
import com.broadvideo.pixsignage.util.UUIDUtils;
import com.broadvideo.pixsignage.vo.LocationInfo;

@Service
@Transactional(rollbackFor = Exception.class)
public class LocationServiceImpl implements LocationService {
	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private LocationMapper locationMapper;

	@Override
	public List<LocationInfo> getLocationTree(Integer orgid) {

		List<Location> locations = locationMapper.selectAllLocations(orgid);
		List<LocationInfo> locationInfos = convert(locations);
		Location root = this.selectRootLocation(orgid);
		LocationInfo rootInfo = new LocationInfo();
		rootInfo.setCategoryId(root.getLocationid());
		rootInfo.setName(root.getName());
		TreeBuilderUtils.buildTree(rootInfo, locationInfos, "parentId", "categoryId", "children");
		return rootInfo.getChildren();
	}

	private List<LocationInfo> convert(List<Location> locations) {

		List<LocationInfo> locationInfos = new ArrayList<LocationInfo>();
		for (Location location : locations) {
			LocationInfo locationInfo = new LocationInfo();
			locationInfo.setCategoryId(location.getLocationid());
			locationInfo.setName(location.getName());
			locationInfo.setParentId(location.getParentid());
			locationInfos.add(locationInfo);
		}

		return locationInfos;
	}

	@Override
	public List<Location> selectChildren(Integer parentid, Integer orgid) {
		return locationMapper.selectChildren(parentid, orgid);
	}

	@Override
	public Location selectLocation(Integer locationid, Integer orgid) {

		return locationMapper.selectLocation(locationid, orgid);

	}

	@Override
	public Location selectRootLocation(Integer orgid) {
		List<Location> locations = locationMapper.selectChildren(-1, orgid);
		if (locations == null || locations.size() == 0) {
			logger.error("orgid（{}） no init root location.", orgid);
			return null;
		}

		return locations.get(0);
	}

	@Override
	public Integer addLocation(Location location) {

		Location parent = this.locationMapper.selectByPrimaryKey(location.getParentid());
		location.setUuid(UUIDUtils.generateUUID());
		location.setLevel(parent.getLevel() + 1);
		this.locationMapper.insertSelective(location);
		return location.getLocationid();
	}

	@Override
	public void updateLocation(Location location) {

		this.locationMapper.updateLocation(location);

	}
	@Override
	public void deleteLocation(Location location) {

		Location updateLocation = new Location();
		updateLocation.setLocationid(location.getLocationid());
		updateLocation.setOrgid(location.getOrgid());
		updateLocation.setUpdatetime(new Date());
		updateLocation.setUpdatestaffid(location.getCreatestaffid());
		updateLocation.setStatus(GlobalFlag.DELETE);
		this.locationMapper.updateLocation(updateLocation);


	}

	@Override
	public boolean validateName(Location location, Integer orgid) {

		int count = this.locationMapper.existName(location, orgid);
		if (count > 0) {
			return false;
		}

		return true;
	}

}
