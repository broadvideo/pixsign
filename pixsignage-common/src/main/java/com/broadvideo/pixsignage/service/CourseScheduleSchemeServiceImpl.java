package com.broadvideo.pixsignage.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.session.RowBounds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.GlobalFlag;
import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PageResult;
import com.broadvideo.pixsignage.common.PeriodType;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.Courseschedulescheme;
import com.broadvideo.pixsignage.domain.Periodtimedtl;
import com.broadvideo.pixsignage.persistence.CoursescheduleschemeMapper;
import com.broadvideo.pixsignage.persistence.PeriodtimedtlMapper;
import com.broadvideo.pixsignage.util.DateUtil;
import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
@Transactional(rollbackFor = Exception.class)
public class CourseScheduleSchemeServiceImpl implements CourseScheduleSchemeService {

	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private CoursescheduleschemeMapper schemeMapper;
	@Autowired
	private PeriodtimedtlMapper periodTimeDtlMapper;

	@Override
	public Integer addScheme(Courseschedulescheme scheduleScheme) {

		if (this.hasNameExists(null, scheduleScheme.getName(), scheduleScheme.getOrgid())) {
			logger.error("scheduleScheme.name={} is exists.", scheduleScheme.getName());
			throw new ServiceException("addScheme:name:" + scheduleScheme.getName() + " has exists.");
		}
		Courseschedulescheme saveScheduleScheme = new Courseschedulescheme();
		saveScheduleScheme.setName(scheduleScheme.getName());
		saveScheduleScheme.setMorningperiods(scheduleScheme.getMorningperiods());
		saveScheduleScheme.setAfternoonperiods(scheduleScheme.getAfternoonperiods());
		saveScheduleScheme.setNightperiods(scheduleScheme.getNightperiods());
		saveScheduleScheme.setWorkdays(scheduleScheme.getWorkdays());
		saveScheduleScheme.setEnableflag(GlobalFlag.NO);
		saveScheduleScheme.setOrgid(scheduleScheme.getOrgid());
		saveScheduleScheme.setCreatepsnid(scheduleScheme.getCreatepsnid());
		saveScheduleScheme.setDescription(scheduleScheme.getDescription());
		saveScheduleScheme.setCreatetime(new Date());
		this.schemeMapper.insertSelective(saveScheduleScheme);

		return saveScheduleScheme.getCoursescheduleschemeid();
	}

	@Override
	public PageResult<Courseschedulescheme> getSchemes(String searchKey, PageInfo page, Integer orgId) {

		RowBounds rowBounds = new RowBounds(page.getStart(), page.getLength());
		List<Courseschedulescheme> dataList = schemeMapper.selectCoursescheduleschemes(searchKey, orgId, rowBounds);
		PageList pageList = (PageList) dataList;
		int totalCount = pageList.getPaginator().getTotalCount();
		return new PageResult<Courseschedulescheme>(totalCount, dataList, page);

	}

	@Override
	public Courseschedulescheme loadScheme(Integer id, Integer orgId) {

		Courseschedulescheme scheme = schemeMapper.selectCourseschedulescheme(id, orgId);
		int dtlTotal = this.countSchemeDtl(id, scheme.getOrgid());

		if (dtlTotal > 0) {
			scheme.setPeriodinitflag(true);
		} else {
			scheme.setPeriodinitflag(false);
		}
		return scheme;

	}

	@Override
	public Courseschedulescheme loadSchemeByName(String name, Integer orgId) throws ServiceException {
		return this.schemeMapper.selectByName(name, orgId);
	}

	@Override
	public void updateScheme(Courseschedulescheme scheme) {
		if (this.hasNameExists(null, scheme.getName(), scheme.getOrgid())) {
			logger.error("scheme.name={} is exists.", scheme.getName());
			throw new ServiceException("updateScheme:name:" + scheme.getName() + " has exists.");
		}
		Courseschedulescheme uScheme = new Courseschedulescheme();
		uScheme.setName(scheme.getName());
		if (StringUtils.isBlank(scheme.getDescription())) {
			uScheme.setDescription("");
		} else {
			uScheme.setDescription(scheme.getDescription());
		}
		uScheme.setWorkdays(scheme.getWorkdays());
		int total = this.countSchemeDtl(scheme.getCoursescheduleschemeid(), scheme.getOrgid());
		if (total == 0) {
			uScheme.setMorningperiods(scheme.getMorningperiods());
			uScheme.setAfternoonperiods(scheme.getAfternoonperiods());
			uScheme.setNightperiods(scheme.getNightperiods());
		}
		uScheme.setUpdatepsnid(scheme.getUpdatepsnid());
		uScheme.setUpdatetime(new Date());
		uScheme.setOrgid(scheme.getOrgid());
		uScheme.setCoursescheduleschemeid(scheme.getCoursescheduleschemeid());
		schemeMapper.updateByPrimaryKeySelective(uScheme);


	}

	@Override
	public void changeSchemeFlag(Integer id, String enableFlag, Integer psnId, Integer orgId) {
		Courseschedulescheme scheduleScheme = loadScheme(id, orgId);
		if (scheduleScheme == null) {
			throw new ServiceException("No record found!");
		}

		if (enableFlag.equals(scheduleScheme.getEnableflag())) {
			logger.info("enableFlag:{} equals expected:{}", scheduleScheme.getEnableflag(), enableFlag);
			return;
		}
		if (enableFlag.equals(GlobalFlag.YES)) {
			int dtlTotal = this.countSchemeDtl(id, scheduleScheme.getOrgid());
			if (dtlTotal <= 0) {
				throw new ServiceException("课表方案时间配置缺少！");
			}

		}
		// 设置其他的课表方案为停用状态：
		schemeMapper.disableCoursescheduleschemes(id, psnId, orgId);
		// 设置当前的课表方案为启用状态
		Courseschedulescheme uScheme = new Courseschedulescheme();
		uScheme.setCoursescheduleschemeid(id);
		uScheme.setEnableflag(enableFlag);
		uScheme.setUpdatepsnid(psnId);
		uScheme.setUpdatetime(new Date());
		uScheme.setOrgid(orgId);
		schemeMapper.updateByPrimaryKeySelective(uScheme);

	}

	@Override
	public void deleteSchemes(List<Integer> ids, Integer optPsnId, Integer orgId) {
		this.schemeMapper.batchDeleteCoursescheduleschemes(ids, orgId);

	}

	@Override
	public synchronized void addPeriodTimeDtls(Courseschedulescheme newScheduleScheme, Integer optPsnId, Integer orgId) {
		Integer scheduleSchemeId = newScheduleScheme.getCoursescheduleschemeid();
		Courseschedulescheme scheme = this.loadScheme(scheduleSchemeId, orgId);
		// 检查课表的period是否匹配
		if (!scheme.getMorningperiods().equals(newScheduleScheme.getMorningperiodtimedtls().size())
				|| !scheme.getAfternoonperiods().equals(newScheduleScheme.getAfternoonperiodtimedtls().size())
				|| !scheme.getNightperiods().equals(newScheduleScheme.getNightperiodtimedtls().size())) {
			logger.error("submit scheme.id={}的periods not match orginal defined!", scheduleSchemeId);
			throw new ServiceException("Submit data is invalid.");
		}
		if (scheme.isPeriodinitflag()) {
			logger.info("Add failure,peroidtime has exists.");
			return;
		}
		this.addPeriodTimeDtl(scheduleSchemeId, PeriodType.MORNING, newScheduleScheme.getMorningperiodtimedtls(),
				optPsnId, orgId);
		this.addPeriodTimeDtl(scheduleSchemeId, PeriodType.AFTERNOON, newScheduleScheme.getAfternoonperiodtimedtls(),
				optPsnId, orgId);
		this.addPeriodTimeDtl(scheduleSchemeId, PeriodType.NIGHT, newScheduleScheme.getNightperiodtimedtls(), optPsnId,
				orgId);


	}

	private void addPeriodTimeDtl(Integer scheduleSchemeId, String type, List<Periodtimedtl> dtls,
			Integer psnId,
			Integer orgId) {

		for (Periodtimedtl dtl : dtls) {
			Periodtimedtl newPeriodTimeDtl = new Periodtimedtl();
			newPeriodTimeDtl.setCoursescheduleschemeid(scheduleSchemeId);
			newPeriodTimeDtl.setType(type);
			newPeriodTimeDtl.setPeriodname("");
			newPeriodTimeDtl.setPeriodnum(dtl.getPeriodnum());
			try {
			newPeriodTimeDtl.setShortstarttime(DateUtil.formatShorttime(dtl.getShortstarttime(), null));
			newPeriodTimeDtl.setShortendtime(DateUtil.formatShorttime(dtl.getShortendtime(), null));
			} catch (Exception ex) {
				ex.printStackTrace();
				throw new ServiceException(ex);
			}
			newPeriodTimeDtl.setCreatetime(new Date());
			newPeriodTimeDtl.setCreatepsnid(psnId);
			newPeriodTimeDtl.setOrgid(orgId);
			newPeriodTimeDtl.setDuration(-1);
			this.periodTimeDtlMapper.insertSelective(newPeriodTimeDtl);
		}

	}





	@Override
	public void updatePeriodTimeDtls(Courseschedulescheme modifyScheme, Integer optPsnId, Integer orgId) {
		Integer scheduleSchemeId = modifyScheme.getCoursescheduleschemeid();
		Courseschedulescheme scheme = loadScheme(scheduleSchemeId, orgId);
		// 检查课表的period是否匹配
		if (!scheme.getMorningperiods().equals(modifyScheme.getMorningperiodtimedtls().size())
				|| !scheme.getAfternoonperiods().equals(modifyScheme.getAfternoonperiodtimedtls().size())
				|| !scheme.getNightperiods().equals(modifyScheme.getNightperiodtimedtls().size())) {
			logger.error("submit scheme.id={}的periods not match orginal defined!", scheduleSchemeId);
			throw new ServiceException("Submit data is invalid.");
		}
		List<Periodtimedtl> dtls = new ArrayList<Periodtimedtl>();
		dtls.addAll(modifyScheme.getMorningperiodtimedtls());
		dtls.addAll(modifyScheme.getAfternoonperiodtimedtls());
		dtls.addAll(modifyScheme.getNightperiodtimedtls());
		for (Periodtimedtl dtl : dtls) {
			Periodtimedtl record = new Periodtimedtl();
			try {
				record.setShortstarttime(DateUtil.formatShorttime(dtl.getShortstarttime(), null));
				record.setShortendtime(DateUtil.formatShorttime(dtl.getShortendtime(), null));
			} catch (Exception e) {
				logger.error("convet shorttime exception.", e);
				throw new ServiceException("convert shorttime exception. ", e);
			}
			record.setUpdatepsnid(optPsnId);
			record.setUpdatetime(new Date());
			record.setPeriodtimedtlid(dtl.getPeriodtimedtlid());
			record.setOrgid(orgId);
			this.periodTimeDtlMapper.updateByPrimaryKeySelective(record);
			}



	}

	@Override
	public Courseschedulescheme getSchemeDtl(Integer id, Integer orgId) {

		Courseschedulescheme scheme = schemeMapper.selectCourseschedulescheme(id, orgId);
		List<Periodtimedtl> dtls = this.periodTimeDtlMapper.selectPeriodTimeDtls(id, orgId);
		Collections.sort(dtls,new Comparator<Periodtimedtl>() {

			@Override
			public int compare(Periodtimedtl o1, Periodtimedtl o2) {
				if (o1.getPeriodnum().intValue() < o2.getPeriodnum().intValue()) {
                	  return -1;
				} else if (o1.getPeriodnum().intValue() > o2.getPeriodnum().intValue()) {
                	  return 1;
                  }else{
				      return 0;
                  }
			}
		});
		if(dtls!=null){
			for(Periodtimedtl dtl :dtls){
				
				if(PeriodType.MORNING.equals(dtl.getType())){
					
					scheme.getMorningperiodtimedtls().add(dtl);
					
				} else if (PeriodType.AFTERNOON.equals(dtl.getType())) {

					scheme.getAfternoonperiodtimedtls().add(dtl);
				} else if (PeriodType.NIGHT.equals(dtl.getType())) {
					scheme.getNightperiodtimedtls().add(dtl);
				}
				
				
				
			}
			
			
		}

		return scheme;
	}

	@Override
	public Courseschedulescheme getEnableScheme(Integer orgId) {

		return this.schemeMapper.selectEnableCourseschedulescheme(orgId);

	}

	@Override
	public int countSchemeDtl(Integer id, Integer orgId) {
		return periodTimeDtlMapper.countPeriodDtlsBy(id, orgId);
	}

	private boolean hasNameExists(Integer excludeId, String name, Integer orgId) {

		return this.schemeMapper.countBy(excludeId, name, orgId) > 0;
	}



}
