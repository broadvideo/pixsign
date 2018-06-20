package com.broadvideo.pixsignage.service;

import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.session.RowBounds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.GlobalFlag;
import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.Smartbox;
import com.broadvideo.pixsignage.domain.Smartboxlog;
import com.broadvideo.pixsignage.persistence.SmartboxMapper;
import com.broadvideo.pixsignage.persistence.SmartboxlogMapper;
import com.broadvideo.pixsignage.vo.TerminalBinding;
import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
@Transactional(rollbackFor = Exception.class)
public class SmartboxServiceImpl implements SmartboxService {

	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private SmartboxMapper smartboxMapper;
	@Autowired
	private SmartboxlogMapper smartboxlogMapper;

	@Override
	public PageResult getSmartboxList(String search, Integer orgid, PageInfo page) {
		RowBounds rowBounds = new RowBounds(page.getStart(), page.getLength());
		List<Smartbox> dataList = smartboxMapper.selectList(search, orgid, rowBounds);
		PageList pageList = (PageList) dataList;
		int totalCount = pageList.getPaginator().getTotalCount();
		return new PageResult(totalCount, dataList, page);
	}

	@Override
	public synchronized Integer addSmartbox(Smartbox smartbox) {

		if (StringUtils.isNotBlank(smartbox.getTerminalid())) {
			Smartbox record = this.smartboxMapper.selectByTerminalid(smartbox.getTerminalid(), smartbox.getOrgid());
			if (record != null) {
				logger.error("addSmartbox fail:terminalid:{} has bind.", smartbox.getTerminalid());
				throw new ServiceException(String.format("终端id:%s已经被占用了!", smartbox.getTerminalid()));
			}
		}
		smartbox.setStatus(GlobalFlag.VALID);
		this.smartboxMapper.insertSelective(smartbox);
		return smartbox.getSmartboxid();
	}

	@Override
	public synchronized void updateSmartbox(Smartbox smartbox) {
		if (StringUtils.isNotBlank(smartbox.getTerminalid())) {
			Smartbox record = this.smartboxMapper.selectByTerminalid(smartbox.getTerminalid(), smartbox.getOrgid());
			if (record != null && !smartbox.getSmartboxid().equals(record.getSmartboxid())) {
				logger.error("addSmartbox fail:terminalid:{} has bind.", smartbox.getTerminalid());
				throw new ServiceException(String.format("终端id:%s已经被占用了!", smartbox.getTerminalid()));
			}
		}
		this.smartboxMapper.updateByPrimaryKeySelective(smartbox);

	}

	@Override
	public void deleteSmartbox(Integer smartboxid, Integer orgid) {

		Smartbox smartbox = this.smartboxMapper.selectByPrimaryKey(smartboxid);
		if (smartbox == null || !orgid.equals(smartbox.getOrgid())) {
			logger.error("deleteSmartbox fail.");
			return;
		}
		smartbox.setStatus(GlobalFlag.DELETE);
		this.smartboxMapper.updateByPrimaryKeySelective(smartbox);

	}

	@Override
	public void savelog(TerminalBinding binding) {

		try {
			Smartboxlog smartboxlog = (Smartboxlog) binding;
			Smartbox smartbox = this.smartboxMapper.selectByTerminalid(binding.getTerminalid(), binding.getOrgid());
			if (smartbox != null) {
				smartboxlog.setSmartboxid(smartbox.getSmartboxid());
			}
			smartboxlog.setCreatetime(new Date());
			smartboxlogMapper.insertSelective(smartboxlog);
		} catch (Exception ex) {

			logger.error("Save smartboxlog exception.", ex);
		}

	}
}
