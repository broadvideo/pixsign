package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Template;

public interface TemplateMapper {
	Template selectByPrimaryKey(@Param(value = "templateid") String templateid);

	Template selectByUuid(@Param(value = "uuid") String uuid);

	int selectCount(@Param(value = "orgid") String orgid, @Param(value = "ratio") String ratio,
			@Param(value = "touchflag") String touchflag, @Param(value = "homeflag") String homeflag,
			@Param(value = "publicflag") String publicflag, @Param(value = "search") String search);

	List<Template> selectList(@Param(value = "orgid") String orgid, @Param(value = "ratio") String ratio,
			@Param(value = "touchflag") String touchflag, @Param(value = "homeflag") String homeflag,
			@Param(value = "publicflag") String publicflag, @Param(value = "search") String search,
			@Param(value = "start") String start, @Param(value = "length") String length);

	int deleteByPrimaryKey(@Param(value = "templateid") String templateid);

	// int insert(Template record);

	int insertSelective(Template record);

	int updateByPrimaryKeySelective(Template record);

	// int updateByPrimaryKey(Template record);
}