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
		String bundleflag = org.getBundleflag();
		String pageflag = org.getPageflag();
		String sscreenflag = org.getSscreenflag();
		String mscreenflag = org.getMscreenflag();
		String reviewflag = org.getReviewflag();
		String touchflag = org.getTouchflag();
		String streamflag = org.getStreamflag();
		String dvbflag = org.getDvbflag();
		String widgetflag = org.getWidgetflag();
		String rssflag = org.getRssflag();
		String diyflag = org.getDiyflag();
		String flowrateflag = org.getFlowrateflag();
		String schoolflag = org.getSchoolflag();
		String advertflag = org.getAdvertflag();
		String vipflag = org.getVipflag();
		String estateflag = org.getEstateflag();
		String bundleplanflag = org.getBundleplanflag();
		String pageplanflag = org.getPageplanflag();
		String massageflag = org.getMassageflag();
		String dscreenflag = org.getDscreenflag();
		String cloudiaflag = org.getCloudiaflag();

		String maxdetail = org.getMaxdetail();
		String[] maxs = maxdetail.split(",");
		int[] maxdevices = new int[13];
		for (int i = 0; i < maxdevices.length; i++) {
			maxdevices[i] = maxs.length > i ? Integer.parseInt(maxs[i]) : 0;
		}

		while (it.hasNext()) {
			Privilege p = it.next();
			if (bundleflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 300
					|| sscreenflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 300
					|| reviewflag.equals(Org.FUNCTION_ENABLED) && p.getPrivilegeid().intValue() == 300
					|| massageflag.equals(Org.FUNCTION_ENABLED) && p.getPrivilegeid().intValue() == 300
					|| bundleflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30105
					|| bundleflag.equals(Org.FUNCTION_DISABLED) && pageflag.equals(Org.FUNCTION_DISABLED)
							&& p.getPrivilegeid().intValue() == 30106
					|| bundleflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30107
					|| streamflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30107
					|| bundleflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30108
					|| dvbflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30108
					|| bundleflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30109
					|| widgetflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30109
					|| bundleflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30110
					|| rssflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30110
					|| diyflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30111
					|| bundleflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30120
					|| estateflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30130
					|| sscreenflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30202
					|| bundleflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 303
					|| bundleflag.equals(Org.FUNCTION_DISABLED) && p.getParentid().intValue() == 303
					|| sscreenflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 303
					|| sscreenflag.equals(Org.FUNCTION_DISABLED) && p.getParentid().intValue() == 303
					|| touchflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30302
					|| touchflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30306
					|| bundleflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30309
					|| reviewflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30309
					|| pageflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 304
					|| pageflag.equals(Org.FUNCTION_DISABLED) && p.getParentid().intValue() == 304
					|| touchflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30402
					|| touchflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30406
					|| pageflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30409
					|| reviewflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30409
					|| sscreenflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 305
					|| sscreenflag.equals(Org.FUNCTION_DISABLED) && p.getParentid().intValue() == 305
					|| bundleflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30501
					|| bundleplanflag.equals("1") && p.getPrivilegeid().intValue() == 30501
					|| bundleflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30502
					|| bundleplanflag.equals("1") && p.getPrivilegeid().intValue() == 30502
					|| !dscreenflag.equals("2") && p.getPrivilegeid().intValue() == 30502
					|| bundleflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30503
					|| bundleplanflag.equals("0") && p.getPrivilegeid().intValue() == 30503
					|| bundleflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30504
					|| bundleplanflag.equals("0") && p.getPrivilegeid().intValue() == 30504
					|| pageflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30505
					|| pageplanflag.equals("1") && p.getPrivilegeid().intValue() == 30505
					|| p.getPrivilegeid().intValue() == 30505
					|| pageflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30506
					|| pageplanflag.equals("0") && p.getPrivilegeid().intValue() == 30506
					|| mscreenflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 306
					|| mscreenflag.equals(Org.FUNCTION_DISABLED) && p.getParentid().intValue() == 306
					|| !flowrateflag.equals("1") && p.getPrivilegeid().intValue() == 30821
					|| !flowrateflag.equals("2") && p.getPrivilegeid().intValue() == 30822
					|| !flowrateflag.equals("2") && p.getPrivilegeid().intValue() == 30823
					|| schoolflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 307
					|| schoolflag.equals(Org.FUNCTION_DISABLED) && p.getParentid().intValue() == 307
					|| advertflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 320
					|| advertflag.equals(Org.FUNCTION_DISABLED) && p.getParentid().intValue() == 320
					|| vipflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 311
					|| vipflag.equals(Org.FUNCTION_DISABLED) && p.getParentid().intValue() == 311
					|| cloudiaflag.equals(Org.FUNCTION_DISABLED) && p.getPrivilegeid().intValue() == 30112
					|| p.getPrivilegeid().intValue() == 312 || p.getParentid().intValue() == 312
					|| !org.getCode().equals("jkcd") && !org.getCode().equals("zls")
							&& p.getPrivilegeid().intValue() == 313) {
				logger.info("remove privilege {}", p.getPrivilegeid());
				it.remove();
			} else if (maxdevices[0] == 0 && p.getPrivilegeid().intValue() == 30211
					|| maxdevices[1] == 0 && p.getPrivilegeid().intValue() == 30212
					|| maxdevices[2] == 0 && p.getPrivilegeid().intValue() == 30213
					|| maxdevices[3] == 0 && p.getPrivilegeid().intValue() == 30214
					|| maxdevices[4] == 0 && p.getPrivilegeid().intValue() == 30215
					|| maxdevices[5] == 0 && p.getPrivilegeid().intValue() == 30216
					|| maxdevices[6] == 0 && p.getPrivilegeid().intValue() == 30217
					|| maxdevices[8] == 0 && p.getPrivilegeid().intValue() == 30219
					|| maxdevices[9] == 0 && p.getPrivilegeid().intValue() == 30220
					|| maxdevices[10] == 0 && p.getPrivilegeid().intValue() == 30221
					|| maxdevices[11] == 0 && p.getPrivilegeid().intValue() == 30222
					|| maxdevices[12] == 0 && p.getPrivilegeid().intValue() == 30223) {
				logger.info("remove privilege {}", p.getPrivilegeid());
				it.remove();
			} else if ((maxdevices[8] == 0 && maxdevices[10] == 0) && p.getPrivilegeid().intValue() == 30500) {
				logger.info("remove privilege {}", p.getPrivilegeid());
				it.remove();
			} else if ((maxdevices[0] == 0 && maxdevices[1] == 0 && maxdevices[5] == 0 && maxdevices[6] == 0
					&& maxdevices[9] == 0 && maxdevices[12] == 0)
					&& (p.getPrivilegeid().intValue() == 30240 || p.getPrivilegeid().intValue() == 30802)) {
				logger.info("remove privilege {}", p.getPrivilegeid());
				it.remove();
			} else if (!org.getCode().equals("default")
					&& (p.getPrivilegeid().intValue() == 30251 || p.getPrivilegeid().intValue() == 30909)) {
				logger.info("remove privilege {}", p.getPrivilegeid());
				it.remove();
			}
		}

		for (Privilege privilege : privilegeList) {
			String name = messageSource.getMessage(privilege.getName(), null, privilege.getName(),
					LocaleContextHolder.getLocale());
			privilege.setName(name);
			buildOrgTree(org, privilege.getChildren());
		}
	}

	private void buildTree(List<Privilege> privilegeList) {
		for (Privilege privilege : privilegeList) {
			privilege.setName(messageSource.getMessage(privilege.getName(), null, privilege.getName(),
					LocaleContextHolder.getLocale()));
			buildTree(privilege.getChildren());
		}
	}
}
