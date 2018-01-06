package com.broadvideo.pixsignage.persistence;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.broadvideo.pixsignage.domain.Person;

public interface PersonMapper {
	int deleteByPrimaryKey(@Param("personid") Integer personid, @Param("orgid") Integer orgid);
    int insert(Person record);

    int insertSelective(Person record);

    Person selectByPrimaryKey(Integer personid);

	int selectCount(@Param(value = "orgid") String orgid,
			@Param(value = "search") String search);

	List<Person> selectList(@Param(value = "orgid") String orgid,
			@Param(value = "search") String search, @Param(value = "start") String start,
			@Param(value = "length") String length);

	List<Person> selectChangePersons(@Param(value = "orgid") Integer orgid, @Param("lastupdatetime") Date lastupdatetime);

	int countBy(@Param("excludeid") Integer excludeId, @Param("personno") String personno, @Param("rfid") String rfid,
			@Param("orgid") Integer orgid);
    int updateByPrimaryKeySelective(Person record);

    int updateByPrimaryKey(Person record);
}