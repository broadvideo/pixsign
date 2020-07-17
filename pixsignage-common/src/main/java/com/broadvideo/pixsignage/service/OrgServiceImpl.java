package com.broadvideo.pixsignage.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.pixsignage.common.CommonConstants;
import com.broadvideo.pixsignage.domain.Branch;
import com.broadvideo.pixsignage.domain.Catalog;
import com.broadvideo.pixsignage.domain.Device;
import com.broadvideo.pixsignage.domain.Org;
import com.broadvideo.pixsignage.domain.Privilege;
import com.broadvideo.pixsignage.domain.Staff;
import com.broadvideo.pixsignage.persistence.CatalogMapper;
import com.broadvideo.pixsignage.persistence.DeviceMapper;
import com.broadvideo.pixsignage.persistence.OrgMapper;
import com.broadvideo.pixsignage.persistence.PrivilegeMapper;
import com.broadvideo.pixsignage.persistence.StaffMapper;
import com.broadvideo.pixsignage.persistence.VspMapper;
import com.broadvideo.pixsignage.util.CommonUtil;

@Service("orgService")
public class OrgServiceImpl implements OrgService {

	@Autowired
	private OrgMapper orgMapper;
	@Autowired
	private VspMapper vspMapper;
	@Autowired
	private StaffMapper staffMapper;
	@Autowired
	private PrivilegeMapper privilegeMapper;
	@Autowired
	private DeviceMapper deviceMapper;
	@Autowired
	private CatalogMapper catalogMapper;

	@Autowired
	private BranchService branchService;
	@Autowired
	protected ResourceBundleMessageSource messageSource;

	public List<Org> selectList(String vspid, String orgid) {
		return orgMapper.selectList(vspid, orgid);
	}

	public Org selectByCode(String code) {
		return orgMapper.selectByCode(code);
	}

	public Org selectByPrimaryKey(String orgid) {
		/*
		 * Org org = orgMapper.selectByPrimaryKey(orgid); List<App> appList =
		 * org.getApplist(); if (appList != null) { for (App app : appList) {
		 * app.setDescription( messageSource.getMessage("app." + app.getName(), null,
		 * LocaleContextHolder.getLocale())); }
		 * 
		 * }
		 */
		return orgMapper.selectByPrimaryKey(orgid);
	}

	@Transactional
	public void addOrg(Org org) {
		String maxdetail = org.getMaxdetail();
		String[] maxs = maxdetail.split(",");
		int maxdevices = 0;
		for (int i = 0; i < maxs.length; i++) {
			maxdevices += Integer.parseInt(maxs[i]);
		}
		org.setMaxdevices(maxdevices);
		orgMapper.insertSelective(org);

		Branch branch = new Branch();
		branch.setOrgid(org.getOrgid());
		branch.setParentid(0);
		branch.setName(messageSource.getMessage("global.headquarter", null, LocaleContextHolder.getLocale()));
		branch.setStatus("1");
		branch.setDescription(org.getName() + " "
				+ messageSource.getMessage("global.headquarter", null, LocaleContextHolder.getLocale()));
		branch.setCreatestaffid(org.getCreatestaffid());
		branchService.addBranch(branch);

		int currentdeviceidx = 0;
		List<Device> devices = new ArrayList<Device>();
		for (int type = 1; type <= 15; type++) {
			if (type == 9 || type == 11 || type == 13) {
				continue;
			}
			int max = maxs.length > type - 1 ? Integer.parseInt(maxs[type - 1]) : 0;
			for (int index = 0; index < max; index++) {
				currentdeviceidx++;
				String terminalid = "" + type;
				String orgid = "" + org.getOrgid();
				int k = 3 - orgid.length();
				for (int i = 0; i < k; i++) {
					orgid = "0" + orgid;
				}
				String tid = "" + currentdeviceidx;
				k = 4 - tid.length();
				for (int i = 0; i < k; i++) {
					tid = "0" + tid;
				}
				terminalid = terminalid + orgid + tid;

				// Generate the check digit
				int[] terminalidArr = new int[terminalid.length()];
				for (int i = 0; i < terminalid.length(); i++) {
					terminalidArr[i] = Integer.valueOf(String.valueOf(terminalid.charAt(i)));
				}
				int sum = 0;
				for (int i = 0; i < terminalid.length(); i++) {
					if (i % 2 == 0) {
						sum += terminalidArr[terminalid.length() - i - 1] * 3;
					} else {
						sum += terminalidArr[terminalid.length() - i - 1];
					}
				}
				terminalid = terminalid + ((10 - sum % 10) % 10);

				Device device = new Device();
				device.setOrgid(org.getOrgid());
				device.setBranchid(branch.getBranchid());
				device.setTerminalid(terminalid);
				device.setName(terminalid);
				device.setType("" + type);
				device.setStatus("0");
				devices.add(device);
			}
		}
		if (devices.size() > 0) {
			deviceMapper.insertList(devices);
		}

		org.setCurrentdeviceidx(currentdeviceidx);
		org.setTopbranchid(branch.getBranchid());
		orgMapper.updateByPrimaryKeySelective(org);

		Staff staff = new Staff();
		staff.setOrgid(org.getOrgid());
		staff.setBranchid(branch.getBranchid());
		staff.setLoginname("admin@" + org.getCode());
		staff.setPassword(CommonUtil.getPasswordMd5("admin@" + org.getCode(), "admin@" + org.getCode()));
		staff.setName(org.getName() + " Admin");
		staff.setStatus("1");
		staff.setDescription(org.getName() + " Admin");
		staff.setSubsystem(CommonConstants.SUBSYSTEM_ORG);
		staff.setCreatestaffid(org.getCreatestaffid());
		staffMapper.insertSelective(staff);
		Privilege privilege = privilegeMapper.selectByPrimaryKey(CommonConstants.PRIVILEGE_SUPER);
		ArrayList<Privilege> privileges = new ArrayList<Privilege>();
		privileges.add(privilege);
		staffMapper.assignStaffPrivileges(staff, privileges);

		vspMapper.updateCurrentdevices();
		vspMapper.updateCurrentstorage();

		Catalog catalog1 = new Catalog();
		catalog1.setOrgid(org.getOrgid());
		catalog1.setType("1");
		catalog1.setName("Category 1");
		catalogMapper.insertSelective(catalog1);
		Catalog catalog2 = new Catalog();
		catalog2.setOrgid(org.getOrgid());
		catalog2.setType("2");
		catalog2.setName("Category 2");
		catalogMapper.insertSelective(catalog2);
	}

	@Transactional
	public void updateOrg(Org org) {
		String maxdetail = org.getMaxdetail();
		if (maxdetail != null) {
			String[] maxs = maxdetail.split(",");
			int maxdevices = 0;
			for (int i = 0; i < maxs.length; i++) {
				maxdevices += Integer.parseInt(maxs[i]);
			}
			org.setMaxdevices(maxdevices);

			Org oldOrg = orgMapper.selectByPrimaryKey("" + org.getOrgid());
			int currentdeviceidx = oldOrg.getCurrentdeviceidx();
			List<Device> devices = new ArrayList<Device>();
			for (int type = 1; type <= 15; type++) {
				if (type == 9 || type == 11 || type == 13) {
					continue;
				}
				int max = maxs.length > type - 1 ? Integer.parseInt(maxs[type - 1]) : 0;
				int currentTypeCount = deviceMapper.selectCountByType("" + org.getOrgid(), "" + type, null);
				for (int index = currentTypeCount; index < max; index++) {
					currentdeviceidx++;
					String terminalid = "" + type;
					String orgid = "" + org.getOrgid();
					int k = 3 - orgid.length();
					for (int i = 0; i < k; i++) {
						orgid = "0" + orgid;
					}
					String tid = "" + currentdeviceidx;
					k = 4 - tid.length();
					for (int i = 0; i < k; i++) {
						tid = "0" + tid;
					}
					terminalid = terminalid + orgid + tid;

					// Generate the check digit
					int[] terminalidArr = new int[terminalid.length()];
					for (int i = 0; i < terminalid.length(); i++) {
						terminalidArr[i] = Integer.valueOf(String.valueOf(terminalid.charAt(i)));
					}
					int sum = 0;
					for (int i = 0; i < terminalid.length(); i++) {
						if (i % 2 == 0) {
							sum += terminalidArr[terminalid.length() - i - 1] * 3;
						} else {
							sum += terminalidArr[terminalid.length() - i - 1];
						}
					}
					terminalid = terminalid + ((10 - sum % 10) % 10);

					Device device = new Device();
					device.setOrgid(org.getOrgid());
					device.setBranchid(oldOrg.getTopbranchid());
					device.setTerminalid(terminalid);
					device.setName(terminalid);
					device.setType("" + type);
					device.setStatus("0");
					devices.add(device);
				}
			}
			if (devices.size() > 0) {
				deviceMapper.insertList(devices);
			}
			org.setCurrentdeviceidx(currentdeviceidx);
		}
		orgMapper.updateByPrimaryKeySelective(org);
		vspMapper.updateCurrentdevices();
		vspMapper.updateCurrentstorage();
	}

	@Transactional
	public void addOrg2c(String vspid, String loginname, String phone, String password) {
		Org org = new Org();
		org.setVspid(Integer.parseInt(vspid));
		org.setName(phone);
		org.setCode(phone);
		orgMapper.insertSelective(org);

		Branch branch = new Branch();
		branch.setOrgid(org.getOrgid());
		branch.setParentid(0);
		branch.setName(org.getName());
		branch.setStatus("1");
		branch.setDescription(org.getName());
		branchService.addBranch(branch);
		org.setTopbranchid(branch.getBranchid());
		orgMapper.updateByPrimaryKeySelective(org);

		Staff staff = new Staff();
		staff.setVspid(Integer.parseInt(vspid));
		staff.setSubsystem(CommonConstants.SUBSYSTEM_USR);
		staff.setOrgid(org.getOrgid());
		staff.setBranchid(branch.getBranchid());
		staff.setLoginname(loginname);
		staff.setPhone(phone);
		staff.setName(loginname);
		staff.setPassword(password);
		staffMapper.insertSelective(staff);
	}

	@Transactional
	public void resetPassword(String orgid) {
		Org org = orgMapper.selectByPrimaryKey(orgid);
		List<Staff> staffs = staffMapper.selectByLoginname("admin@" + org.getCode());
		if (staffs.size() > 0) {
			Staff staff = staffs.get(0);
			staff.setPassword(CommonUtil.getPasswordMd5(staff.getLoginname(), staff.getLoginname()));
			staffMapper.updateByPrimaryKeySelective(staff);
		}
	}

	@Transactional
	public void deleteOrg(String orgid) {
		staffMapper.deleteByOrg(orgid);
		orgMapper.deleteByPrimaryKey(orgid);
		vspMapper.updateCurrentdevices();
		vspMapper.updateCurrentstorage();
	}

	public boolean validateName(Org org) {
		List<Org> list = orgMapper.selectByName(org.getName());
		if (list.size() == 0) {
			return true;
		} else {
			return (org.getOrgid().intValue() == list.get(0).getOrgid().intValue());
		}
	}

	public boolean validateCode(Org org) {
		Org oldOrg = orgMapper.selectByCode(org.getCode());
		if (oldOrg == null) {
			return true;
		} else {
			return (org.getOrgid().intValue() == oldOrg.getOrgid().intValue());
		}
	}

	@Transactional
	public void updateCurrentdevices() {
		orgMapper.updateCurrentdevices();
	}

	@Transactional
	public void updateCurrentstorage() {
		orgMapper.updateCurrentstorage();
	}
}
