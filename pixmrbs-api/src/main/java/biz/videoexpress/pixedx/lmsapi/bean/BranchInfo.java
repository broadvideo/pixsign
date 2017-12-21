package biz.videoexpress.pixedx.lmsapi.bean;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class BranchInfo {
	@JsonProperty("branch_id")
	private Integer branchId;
	private String name;
	@JsonProperty("parent_id")
	private Integer parentId;
	@JsonIgnore
	private List<BranchInfo> children = new ArrayList<BranchInfo>();

	public Integer getBranchId() {
		return branchId;
	}

	public void setBranchId(Integer branchId) {
		this.branchId = branchId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getParentId() {
		return parentId;
	}

	public void setParentId(Integer parentId) {
		this.parentId = parentId;
	}

	public List<BranchInfo> getChildren() {
		return children;
	}

	public void setChildren(List<BranchInfo> children) {
		this.children = children;
	}

}
