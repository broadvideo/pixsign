package com.broadvideo.pixsignage.persistence;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import com.broadvideo.pixsignage.domain.Equipment;

public interface EquipmentMapper {

	List<Equipment> selectList(@Param(value = "orgid") Integer orgid, @Param(value = "search") String search,
			@Param("meetingroomid") Integer meetingroomid,
			RowBounds rowBounds);
    int deleteByPrimaryKey(Integer equipmentid);

    int insert(Equipment record);

    int insertSelective(Equipment record);

    Equipment selectByPrimaryKey(Integer equipmentid);

    int updateByPrimaryKeySelective(Equipment record);

    int updateByPrimaryKey(Equipment record);

	int existNameCode(Equipment record);

	void updateEquipment(Equipment record);

	void assginEquipment(Equipment record);

}