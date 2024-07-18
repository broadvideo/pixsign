package com.broadvideo.pixsign.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsign.domain.Page;
import com.broadvideo.pixsign.domain.Staff;

public interface PageMapper {
	Page selectByPrimaryKey(@Param(value = "pageid") String pageid);

	Page selectByUuid(@Param(value = "orgid") String orgid, @Param(value = "uuid") String uuid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "reviewflag") String reviewflag, @Param(value = "ratio") String ratio,
			@Param(value = "touchflag") String touchflag, @Param(value = "homeflag") String homeflag,
			@Param(value = "search") String search);

	List<Page> selectList(@Param(value = "orgid") String orgid, @Param(value = "branchid") String branchid,
			@Param(value = "reviewflag") String reviewflag, @Param(value = "ratio") String ratio,
			@Param(value = "touchflag") String touchflag, @Param(value = "homeflag") String homeflag,
			@Param(value = "search") String search, @Param(value = "start") String start,
			@Param(value = "length") String length);

	List<Page> selectExportList();

	Staff selectStaffPage(@Param(value = "staffid") String staffid, @Param(value = "pageid") String pageid);

	int selectStaffCount(@Param(value = "pageid") String pageid, @Param(value = "search") String search);

	List<Staff> selectStaff(@Param(value = "pageid") String pageid, @Param(value = "search") String search,
			@Param(value = "start") String start, @Param(value = "length") String length);

	int selectStaff2SelectCount(@Param(value = "pageid") String pageid, @Param(value = "search") String search);

	List<Staff> selectStaff2Select(@Param(value = "pageid") String pageid, @Param(value = "search") String search,
			@Param(value = "start") String start, @Param(value = "length") String length);

	int addStaff(@Param(value = "pageid") String pageid, @Param(value = "staffid") String staffid);

	int deleteStaff(@Param(value = "pageid") String pageid, @Param(value = "staffid") String staffid);

	int deleteByPrimaryKey(@Param(value = "pageid") String pageid);

	int clearPagezones(@Param(value = "pageid") String pageid);

	int clearSubpages(@Param(value = "pageid") String pageid);

	// int insert(Page record);

	int insertSelective(Page record);

	int updateByPrimaryKeySelective(Page record);

	// int updateByPrimaryKey(Page record);
}