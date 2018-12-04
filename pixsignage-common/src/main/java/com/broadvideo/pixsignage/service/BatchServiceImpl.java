package com.broadvideo.pixsignage.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.domain.Batch;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Model;
import com.broadvideo.pixsignage.persistence.BatchMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.ModelMapper;

@Service("batchService")
public class BatchServiceImpl implements BatchService {

	@Autowired
	private BatchMapper batchMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private ModelMapper modelMapper;

	public Batch selectByPrimaryKey(String batchid) {
		return batchMapper.selectByPrimaryKey(batchid);
	}

	public int selectCount(String search) {
		return batchMapper.selectCount(search);
	}

	public List<Batch> selectList(String search, String start, String length) {
		return batchMapper.selectList(search, start, length);
	}

	@Transactional
	public void addBatch(Batch batch) {
		Model model = modelMapper.selectByPrimaryKey("" + batch.getModelid());
		batchMapper.insertSelective(batch);

		List<Device> devices = new ArrayList<Device>();
		for (int i = 0; i < batch.getAmount(); i++) {
			String terminalid = "" + (model.getCurrentdeviceidx() + i + 1);
			int k = 5 - terminalid.length();
			for (int j = 0; j < k; j++) {
				terminalid = "0" + terminalid;
			}
			terminalid = model.getModel() + terminalid;
			Device device = new Device();
			device.setOrgid(0);
			device.setBranchid(0);
			device.setBatchid(batch.getBatchid());
			device.setModelid(batch.getModelid());
			device.setTerminalid(terminalid);
			device.setName(terminalid);
			device.setStatus("0");
			devices.add(device);
		}
		if (devices.size() > 0) {
			deviceMapper.insertList(devices);
		}
	}

}
