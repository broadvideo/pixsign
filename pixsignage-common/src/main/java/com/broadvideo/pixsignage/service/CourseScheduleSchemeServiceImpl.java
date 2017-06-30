package com.broadvideo.pixsignage.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.DateUtil;
import com.broadvideo.pixsignage.common.GlobalFlag;
import com.broadvideo.pixsignage.common.PageInfo;
import com.broadvideo.pixsignage.common.PeriodType;
import com.broadvideo.pixsignage.common.RetCodeEnum;
import com.broadvideo.pixsignage.common.ServiceException;
import com.broadvideo.pixsignage.domain.CourseScheduleScheme;
import com.broadvideo.pixsignage.domain.PeriodTimeDtl;
import com.broadvideo.pixsignage.persistence.CourseScheduleSchemeMapper;
import com.broadvideo.pixsignage.persistence.PeriodTimeDtlMapper;
import com.github.miemiedev.mybatis.paginator.domain.PageBounds;
import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
@Transactional(rollbackFor = Exception.class)
public class CourseScheduleSchemeServiceImpl implements CourseScheduleSchemeService {

	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private CourseScheduleSchemeMapper schemeMapper;
	@Autowired
	private PeriodTimeDtlMapper periodTimeDtlMapper;

	@Override
	public Integer addScheme(CourseScheduleScheme scheduleScheme) {

		CourseScheduleScheme saveScheduleScheme = new CourseScheduleScheme();
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

		return saveScheduleScheme.getId();
	}

	@Override
	public void getSchemes(String searchKey, PageInfo<CourseScheduleScheme> page, Integer orgId) {

			PageBounds pageBounds = new PageBounds(page.getPageNo(), page.getPageSize());
		List<CourseScheduleScheme> dataList = schemeMapper.selectCourseScheduleSchemes(searchKey, orgId,
					pageBounds);
			page.setResult(dataList);
			PageList pageList = (PageList) dataList;
			page.setTotalCount(pageList.getPaginator().getTotalCount());

	}

	@Override
	public CourseScheduleScheme loadScheme(Integer id, Integer orgId) {

		CourseScheduleScheme scheme = schemeMapper.selectCourseScheduleScheme(id, orgId);
		int dtlTotal = this.countSchemeDtl(id, scheme.getOrgid());

		if (dtlTotal > 0) {
			scheme.setPeriodInitFlag(true);
		} else {
			scheme.setPeriodInitFlag(false);
		}
		return scheme;

	}

	@Override
	public void updateScheme(CourseScheduleScheme scheme) {

		CourseScheduleScheme uScheme = new CourseScheduleScheme();
		uScheme.setName(scheme.getName());
		if (StringUtils.isBlank(scheme.getDescription())) {
			uScheme.setDescription("");
		} else {
			uScheme.setDescription(scheme.getDescription());
		}
		uScheme.setWorkdays(scheme.getWorkdays());
		int total = this.countSchemeDtl(scheme.getId(), scheme.getOrgid());
		if (total == 0) {
			uScheme.setMorningperiods(scheme.getMorningperiods());
			uScheme.setAfternoonperiods(scheme.getAfternoonperiods());
			uScheme.setNightperiods(scheme.getNightperiods());
		}
		uScheme.setUpdatepsnid(scheme.getUpdatepsnid());
		uScheme.setUpdatetime(new Date());
		uScheme.setOrgid(scheme.getOrgid());
		uScheme.setId(scheme.getId());
		schemeMapper.updateByPrimaryKeySelective(uScheme);


	}

	@Override
	public void changeSchemeFlag(Integer id, String enableFlag, Integer psnId, Integer orgId) {
		CourseScheduleScheme scheduleScheme = loadScheme(id, orgId);
		if (scheduleScheme == null) {
			throw new ServiceException(RetCodeEnum.EXCEPTION, "No record found!");
		}

		if (enableFlag.equals(scheduleScheme.getEnableflag())) {
			logger.info("enableFlag:{} equals expected:{}", scheduleScheme.getEnableflag(), enableFlag);
			return;
		}
		if (enableFlag.equals(GlobalFlag.YES)) {
			int dtlTotal = this.countSchemeDtl(id, scheduleScheme.getOrgid());
			if (dtlTotal <= 0) {
				throw new ServiceException(RetCodeEnum.NONE_PERIOD_TIME_DTL, "课表方案时间配置缺少！");
			}

		}
		// 设置其他的课表方案为停用状态：
		schemeMapper.disableCourseScheduleSchemes(id, psnId, orgId);
		// 设置当前的课表方案为启用状态
		CourseScheduleScheme uScheme = new CourseScheduleScheme();
		uScheme.setId(id);
		uScheme.setEnableflag(enableFlag);
		uScheme.setUpdatepsnid(psnId);
		uScheme.setUpdatetime(new Date());
		uScheme.setOrgid(orgId);
		schemeMapper.updateByPrimaryKeySelective(uScheme);

	}

	@Override
	public void deleteSchemes(List<Integer> ids, Integer optPsnId, Integer orgId) {
		this.schemeMapper.batchDeleteCourseScheduleSchemes(ids, orgId);

	}

	@Override
	public void addPeriodTimeDtls(CourseScheduleScheme newScheduleScheme, Integer optPsnId, Integer orgId) {
		Integer scheduleSchemeId = newScheduleScheme.getId();
		CourseScheduleScheme scheme = this.loadScheme(scheduleSchemeId, orgId);
		// 检查课表的period是否匹配
		if (!scheme.getMorningperiods().equals(newScheduleScheme.getMorningPeriodTimeDtls().size())
				|| !scheme.getAfternoonperiods().equals(newScheduleScheme.getAfternoonPeriodTimeDtls().size())
				|| !scheme.getNightperiods().equals(newScheduleScheme.getNightPeriodTimeDtls().size())) {
			logger.error("submit scheme.id={}的periods not match orginal defined!", scheduleSchemeId);
			throw new ServiceException(RetCodeEnum.INVALID_ARGS, "Submit data is invalid.");
		}
		this.addPeriodTimeDtl(scheduleSchemeId, PeriodType.MORNING, newScheduleScheme.getMorningPeriodTimeDtls(),
				optPsnId, orgId);
		this.addPeriodTimeDtl(scheduleSchemeId, PeriodType.AFTERNOON, newScheduleScheme.getAfternoonPeriodTimeDtls(),
				optPsnId, orgId);
		this.addPeriodTimeDtl(scheduleSchemeId, PeriodType.NIGHT, newScheduleScheme.getNightPeriodTimeDtls(), optPsnId,
				orgId);


	}

	private void addPeriodTimeDtl(Integer scheduleSchemeId, String type, List<PeriodTimeDtl> dtls, Integer psnId,
			Integer orgId) {

		for (PeriodTimeDtl dtl : dtls) {
			PeriodTimeDtl newPeriodTimeDtl = new PeriodTimeDtl();
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
	public void updatePeriodTimeDtls(CourseScheduleScheme modifyScheme, Integer optPsnId, Integer orgId) {
		Integer scheduleSchemeId = modifyScheme.getId();
		CourseScheduleScheme scheme = loadScheme(scheduleSchemeId, orgId);
		// 检查课表的period是否匹配
		if (!scheme.getMorningperiods().equals(modifyScheme.getMorningPeriodTimeDtls().size())
				|| !scheme.getAfternoonperiods().equals(modifyScheme.getAfternoonPeriodTimeDtls().size())
				|| !scheme.getNightperiods().equals(modifyScheme.getNightPeriodTimeDtls().size())) {
			logger.error("submit scheme.id={}的periods not match orginal defined!", scheduleSchemeId);
			throw new ServiceException(RetCodeEnum.INVALID_ARGS, "Submit data is invalid.");
		}
		List<PeriodTimeDtl> dtls = new ArrayList<PeriodTimeDtl>();
		dtls.addAll(modifyScheme.getMorningPeriodTimeDtls());
		dtls.addAll(modifyScheme.getAfternoonPeriodTimeDtls());
		dtls.addAll(modifyScheme.getNightPeriodTimeDtls());
		for (PeriodTimeDtl dtl : dtls) {
			PeriodTimeDtl record = new PeriodTimeDtl();
			try {
				record.setShortstarttime(DateUtil.formatShorttime(dtl.getShortstarttime(), null));
				record.setShortendtime(DateUtil.formatShorttime(dtl.getShortendtime(), null));
			} catch (Exception e) {
				logger.error("convet shorttime exception.", e);
				throw new ServiceException("convert shorttime exception. ", e);
			}
			record.setUpdatepsnid(optPsnId);
			record.setUpdatetime(new Date());
			record.setId(dtl.getId());
			record.setOrgid(orgId);
			this.periodTimeDtlMapper.updateByPrimaryKeySelective(record);
			}



	}

	@Override
	public CourseScheduleScheme getSchemeDtl(Integer id, Integer orgId) {

		CourseScheduleScheme scheme = schemeMapper.selectCourseScheduleScheme(id, orgId);
		List<PeriodTimeDtl> dtls = this.periodTimeDtlMapper.selectPeriodTimeDtls(id, orgId);
		Collections.sort(dtls,new Comparator<PeriodTimeDtl>() {

			@Override
			public int compare(PeriodTimeDtl o1, PeriodTimeDtl o2) {
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
			for(PeriodTimeDtl dtl :dtls){
				
				if(PeriodType.MORNING.equals(dtl.getType())){
					
					scheme.getMorningPeriodTimeDtls().add(dtl);
					
				} else if (PeriodType.AFTERNOON.equals(dtl.getType())) {

					scheme.getAfternoonPeriodTimeDtls().add(dtl);
				} else if (PeriodType.NIGHT.equals(dtl.getType())) {
					scheme.getNightPeriodTimeDtls().add(dtl);
				}
				
				
				
			}
			
			
		}

		return scheme;
	}

	@Override
	public CourseScheduleScheme getEnableScheme(Integer orgId) {

		return this.schemeMapper.selectEnableCourseScheduleScheme(orgId);

	}

	@Override
	public int countSchemeDtl(Integer id, Integer orgId) {
		return periodTimeDtlMapper.countPeriodDtlsBy(id, orgId);
	}



}
