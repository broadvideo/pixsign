package com.broadvideo.pixsignage.service;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.session.RowBounds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.GlobalFlag;
import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.Equipment;
import com.broadvideo.pixsignage.persistence.EquipmentMapper;
import com.broadvideo.pixsignage.util.UUIDUtils;
import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Transactional(rollbackFor = Exception.class)
@Service
public class EquipmentServiceImpl implements EquipmentService {

	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private EquipmentMapper equipmentMapper;
	@Override
	public PageResult getEquipmentList(String search, Integer meetingroomid, PageInfo pageinfo, Integer orgid) {
		RowBounds rowBounds = new RowBounds(pageinfo.getStart(), pageinfo.getLength());
		List<Equipment> dataList = equipmentMapper.selectList(orgid, search, meetingroomid,
				rowBounds);
		PageList pageList = (PageList) dataList;
		int totalCount = pageList.getPaginator().getTotalCount();
		return new PageResult(totalCount, dataList, pageinfo);
	}

	@Override
	public Integer addEquipment(Equipment equipment) {
		this.validateNameCode(equipment);
		equipment.setUuid(UUIDUtils.generateUUID());
		equipment.setCreatetime(new Date());
		equipment.setStatus(GlobalFlag.VALID);
		this.equipmentMapper.insertSelective(equipment);
		return equipment.getEquipmentid();
	}

	@Override
	public void updateEquipment(Equipment equipment) {
		this.validateNameCode(equipment);
		equipment.setUpdatetime(new Date());
		equipment.setStatus(GlobalFlag.VALID);
		this.equipmentMapper.updateEquipment(equipment);

	}

	@Override
	public void deleteEquipment(Equipment equipment) {

		equipment.setStatus(GlobalFlag.DELETE);
		equipment.setUpdatetime(new Date());
		this.equipmentMapper.updateEquipment(equipment);

	}

	@Override
	public boolean validateNameCode(Equipment equipment) {
		Equipment search = new Equipment();
		search.setOrgid(equipment.getOrgid());
		search.setEquipmentid(equipment.getEquipmentid());
		search.setName(equipment.getName());
		// search.setCode(equipment.getCode());
		int exists = this.equipmentMapper.existNameCode(search);
		if (exists > 0) {
			logger.info("Name({}) or Code({}) exists.", equipment.getName(), equipment.getCode());
			throw new ServiceException(RetCodeEnum.EXCEPTION, "名称已经存在");
		}
		return true;
	}

	@Override
	public void assignEquipment(Equipment equipment) {
		this.equipmentMapper.assginEquipment(equipment);
	}

}
