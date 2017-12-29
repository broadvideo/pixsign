package com.broadvideo.pixsignage.service;

import java.util.Iterator;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.stereotype.Service;

import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Privilege;
import com.broadvideo.pixsignage.persistence.PrivilegeMapper;

@Service("privilegeService")
public class PrivilegeServiceImpl implements PrivilegeService {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private PrivilegeMapper privilegeMapper;
	@Autowired
	protected ResourceBundleMessageSource messageSource;

	public Privilege selectByPrimaryKey(String privilegeid) {
		return privilegeMapper.selectByPrimaryKey(privilegeid);
	}

	public List<Privilege> selectSysTreeList() {
		List<Privilege> privilegeList = privilegeMapper.selectSysTreeList();
		buildTree(privilegeList);
		return privilegeList;
	}

	public List<Privilege> selectVspTreeList() {
		List<Privilege> privilegeList = privilegeMapper.selectVspTreeList();
		buildTree(privilegeList);
		return privilegeList;
	}

	public List<Privilege> selectOrgTreeList(Org org) {
		List<Privilege> privilegeList = privilegeMapper.selectOrgTreeList();
		buildOrgTree(org, privilegeList);
		return privilegeList;
	}

	private void buildOrgTree(Org org, List<Privilege> privilegeList) {
		Iterator<Privilege> it = privilegeList.iterator();
		while (it.hasNext()) {
			Privilege p = it.next();
			if (org.getReviewflag().equals(Org.FUNCTION_ENABLED) && p.getPrivilegeid().intValue() == 300
					|| org.getBundleflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 300
					|| org.getBundleflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 303
					|| org.getBundleflag().equals(Org.FUNCTION_DISABLED) && p.getParentid().intValue() == 303
					|| org.getBundleflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30105
					|| org.getBundleflag().equals(Org.FUNCTION_DISABLED)
							&& org.getPageflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30106
					|| org.getBundleflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30107
					|| org.getBundleflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30108
					|| org.getBundleflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30109
					|| org.getBundleflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30110
					|| org.getBundleflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30120
					|| org.getBundleflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30501
					|| org.getPageflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 304
					|| org.getPageflag().equals(Org.FUNCTION_DISABLED) && p.getParentid().intValue() == 304
					|| org.getPageflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30502
					|| org.getReviewflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30309
					|| org.getMscreenflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 306
					|| org.getMscreenflag().equals(Org.FUNCTION_DISABLED) && p.getParentid().intValue() == 306
					|| org.getTouchflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30302
					|| org.getTouchflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30306
					|| org.getCalendarflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 307
					|| org.getCalendarflag().equals(Org.FUNCTION_DISABLED) && p.getParentid().intValue() == 307
					|| org.getMeetingflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 310
					|| org.getMeetingflag().equals(Org.FUNCTION_DISABLED) && p.getParentid().intValue() == 310
					|| org.getFlowrateflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30821
					|| org.getFlowrateflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30822
					|| org.getFlowrateflag().equals("1") && p.getPrivilegeid().intValue() == 30822
					|| org.getFlowrateflag().equals("2") && p.getPrivilegeid().intValue() == 30821
					|| org.getSscreenflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 300
					|| org.getSscreenflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30202
					|| org.getSscreenflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 303
					|| org.getSscreenflag().equals(Org.FUNCTION_DISABLED) && p.getParentid().intValue() == 303
					|| org.getSscreenflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 305
					|| org.getSscreenflag().equals(Org.FUNCTION_DISABLED) && p.getParentid().intValue() == 305
					|| org.getSscreenflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30821
					|| org.getSscreenflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30822
					|| org.getSscreenflag().equals(Org.FUNCTION_DISABLED)
							&& org.getMscreenflag().equals(Org.FUNCTION_DISABLED)
							&& p.getPrivilegeid().intValue() == 301
					|| org.getSscreenflag().equals(Org.FUNCTION_DISABLED)
							&& org.getMscreenflag().equals(Org.FUNCTION_DISABLED)
							&& p.getPrivilegeid().intValue() == 308
					|| org.getDiyflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30111
					|| org.getStreamflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30107
					|| org.getDvbflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30108) {
				logger.info("remove privilege {}", p.getPrivilegeid());
				it.remove();
			} else if (!org.getCode().equals("default")
					&& (p.getPrivilegeid().intValue() == 30205 || p.getPrivilegeid().intValue() == 30405
							|| p.getPrivilegeid().intValue() == 30406 || p.getPrivilegeid().intValue() == 30909)) {
				logger.info("remove privilege {}", p.getPrivilegeid());
				it.remove();
			}
		}

		for (Privilege privilege : privilegeList) {
			privilege.setName(messageSource.getMessage(privilege.getName(), null, LocaleContextHolder.getLocale()));
			buildOrgTree(org, privilege.getChildren());
		}
	}

	private void buildTree(List<Privilege> privilegeList) {
		for (Privilege privilege : privilegeList) {
			privilege.setName(messageSource.getMessage(privilege.getName(), null, LocaleContextHolder.getLocale()));
			buildTree(privilege.getChildren());
		}
	}
}
