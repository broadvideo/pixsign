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
		List<Privilege> privilegeList = privilegeMapper.selectOrgTreeList(org.getOrgtype());
		buildOrgTree(org, privilegeList);
		return privilegeList;
	}

	private void buildOrgTree(Org org, List<Privilege> privilegeList) {
		Iterator<Privilege> it = privilegeList.iterator();
		while (it.hasNext()) {
			Privilege p = it.next();
			if (org.getReviewflag().equals(Org.FUNCTION_ENABLED) && p.getPrivilegeid().intValue() == 300
					|| org.getReviewflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 305
					|| org.getReviewflag().equals(Org.FUNCTION_DISABLED) && p.getParentid().intValue() == 305
					|| org.getTouchflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30303
					|| org.getStreamflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30106
					|| org.getDvbflag().equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30107) {
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
