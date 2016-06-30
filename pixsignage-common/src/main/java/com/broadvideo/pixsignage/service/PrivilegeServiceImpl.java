package com.broadvideo.pixsignage.service;

import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.stereotype.Service;

import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Privilege;
import com.broadvideo.pixsignage.persistence.PrivilegeMapper;

@Service("privilegeService")
public class PrivilegeServiceImpl implements PrivilegeService {

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
		if (org.getReviewflag().equals(Org.REVIEW_DISABLED)) {
			Iterator<Privilege> it = privilegeList.iterator();
			while (it.hasNext()) {
				Privilege p = it.next();
				// Remove REVIEW privilege
				if (p.getPrivilegeid() == 305 || p.getParentid() == 305) {
					it.remove();
				}
			}
		}
		buildTree(privilegeList);
		return privilegeList;
	}

	private void buildTree(List<Privilege> privilegeList) {
		for (Privilege privilege : privilegeList) {
			privilege.setName(messageSource.getMessage(privilege.getName(), null, LocaleContextHolder.getLocale()));
			buildTree(privilege.getChildren());
		}
	}
}
