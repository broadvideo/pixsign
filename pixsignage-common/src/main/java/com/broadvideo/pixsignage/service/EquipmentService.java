package com.broadvideo.pixsignage.service;

import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.domain.Equipment;

public interface EquipmentService {

	PageResult getEquipmentList(String search, Integer meetingroomid, PageInfo pageinfo, Integer orgid);

	Integer addEquipment(Equipment equipment);

	void updateEquipment(Equipment equipment);

	void deleteEquipment(Equipment equipment);

	boolean validateNameCode(Equipment equipment);

	void assignEquipment(Equipment equipment);


}
