package com.broadvideo.pixsignage.common;

import java.io.Serializable;
import java.util.Collections;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 与具体ORM实现无关的分页参数及查询结果封装.
 * 
 * @param <T>
 *            Page中记录的类型.
 * 
 */
public class PageInfo<T> implements Serializable {

	private static final long serialVersionUID = 2468093376898910699L;
	protected final Logger logger = LoggerFactory.getLogger(getClass());

	// 公共变量
	public static final String ASC = "asc";
	public static final String DESC = "desc";
	public static final int MIN_PAGESIZE = 10;
	public static final int MAX_PAGESIZE = Integer.MAX_VALUE;


	// 分页参数
	private Integer pageNo = 1;
	private Integer pageSize = MIN_PAGESIZE;
	private String orderBy = null;
	private String order = null;
	private boolean autoCount = true;
	private Integer lastPage = -1;
	private Integer first = 0;
	private Integer pageCount = 0;
	private Integer totalPages = 0;

	// 返回结果
	protected List<T> result = Collections.emptyList();
	protected Integer totalCount = -1;

	public PageInfo() {
		super();
	}

	public PageInfo(final Integer pageSize) {
		setPageSize(pageSize);
	}

	public PageInfo(final Integer pageSize, final boolean autoCount) {
		setPageSize(pageSize);
		setAutoCount(autoCount);
	}

	// -- 访问查询参数函数 --//
	/**
	 * 获得当前页的页号,序号从1开始,默认为1.
	 */
	public Integer getPageNo() {

		return pageNo;
	}

	public Integer getParamPageNo() {
		return this.pageNo;
	}

	/**
	 * 设置当前页的页号,序号从1开始,低于1时自动调整为1.
	 */
	public void setPageNo(final Integer pageNo) {
		if (pageNo == null || pageNo < 1) {
			this.pageNo = 1;
		} else {
			this.pageNo = pageNo;
		}
	}

	/**
	 * 获得每页的记录数量,默认为10.
	 */
	public Integer getPageSize() {
		return pageSize;
	}

	/**
	 * 设置每页的记录数量,超出MIN_PAGESIZE与MAX_PAGESIZE范围时会自动调整.
	 */
	public void setPageSize(final Integer pageSize) {
		if (pageSize == null) {
			this.pageSize = MIN_PAGESIZE;
		} else {
			this.pageSize = pageSize;
		}
		if (this.pageSize < MIN_PAGESIZE) {
			this.pageSize = MIN_PAGESIZE;
		}
		if (this.pageSize > MAX_PAGESIZE) {
			this.pageSize = MAX_PAGESIZE;
		}
	}

	/**
	 * 根据pageNo和pageSize计算当前页第一条记录在总结果集中的位置,序号从1开始.
	 */
	public Integer getFirst() {
		return ((this.getPageNo() - 1) * pageSize) + 1;
	}

	/**
	 * lqh add 根据pageNo和PageSize计算当前最后一条记录在结果集中的位置，序号从0开始.
	 * 
	 * @return
	 */
	public Integer getEnd() {

		if (totalCount == -1 || totalCount == 0) {
			return 0;
		} else {
			Integer end = getFirst() + pageSize;
			if (end > totalCount)
				return totalCount;
			return Integer.valueOf(end.toString());
		}
	}

	/**
	 * 获得排序字段,无默认值.多个排序字段时用','分隔,仅在Criterion查询时有效.
	 */
	public String getOrderBy() {
		return orderBy;
	}

	/**
	 * 设置排序字段,多个排序字段时用','分隔.
	 */
	public void setOrderBy(final String orderBy) {
		this.orderBy = orderBy;
	}

	/**
	 * 是否已设置排序字段,无默认值.
	 */
	public boolean isOrderBySetted() {
		return (StringUtils.isNotBlank(orderBy) && StringUtils.isNotBlank(order));
	}

	/**
	 * 获得排序方向.
	 */
	public String getOrder() {
		return order;
	}

	/**
	 * 设置排序方式向.
	 * 
	 * @param order
	 *            可选值为desc或asc,多个排序字段时用','分隔.
	 */
	public void setOrder(final String order) {
		// 检查order字符串的合法值
		String[] orders = StringUtils.split(StringUtils.lowerCase(order), ',');
		for (String orderStr : orders) {
			if (!StringUtils.equals(DESC, orderStr) && !StringUtils.equals(ASC, orderStr))
				throw new IllegalArgumentException("排序方向" + orderStr + "不是合法值");
		}

		this.order = StringUtils.lowerCase(order);
	}

	/**
	 * 查询对象时是否自动另外执行count查询获取总记录数, 默认为false.
	 */
	public boolean isAutoCount() {
		return autoCount;
	}

	/**
	 * 查询对象时是否自动另外执行count查询获取总记录数.
	 */
	public void setAutoCount(final boolean autoCount) {
		this.autoCount = autoCount;
	}

	// -- 访问查询结果函数 --//

	/**
	 * 取得页内的记录列表.
	 */
	public List<T> getResult() {
		return result;
	}

	/**
	 * 设置页内的记录列表.
	 */
	public void setResult(final List<T> result) {
		this.result = result;
		if (result != null && result.size() > 0) {
			this.pageCount = result.size();
		}
	}

	/**
	 * 取得总记录数,默认值为-1.
	 */
	public Integer getTotalCount() {
		return totalCount;
	}

	/**
	 * 设置总记录数.
	 */
	public void setTotalCount(final Integer totalCount) {
		this.totalCount = totalCount;
	}

	/**
	 * 根据pageSize与totalCount计算总页数,默认值为-1.
	 */
	public Integer getTotalPages() {
		if (totalCount == null || totalCount < 0)
			return -1;

		Integer count = totalCount / pageSize;
		if (totalCount % pageSize > 0) {
			count++;
		}
		return count;
	}

	public Integer getLastPage() {
		return getTotalPages();
	}

	/**
	 * 是否还有下一页.
	 */
	public boolean isHasNext() {
		return (getTotalPages() > this.getPageNo());
	}

	/**
	 * 取得下页的页号, 序号从1开始. 当前页为尾页时仍返回尾页序号.
	 */
	public Integer getNextPage() {
		int pageNo = this.getPageNo();
		if (isHasNext())
			return pageNo + 1;
		else
			return pageNo;
	}

	/**
	 * 是否还有上一页.
	 */
	public boolean isHasPre() {
		return (pageNo - 1 >= 1);
	}

	/**
	 * 取得上页的页号, 序号从1开始. 当前页为首页时返回首页序号.
	 */
	public Integer getPrePage() {
		if (isHasPre())
			return this.getPageNo() - 1;
		else
			return this.getPageNo();
	}

	public Integer getPageCount() {
		return pageCount;
	}

	public void setPageCount(Integer pageCount) {
		this.pageCount = pageCount;
	}

	public void setTotalPages(Long totalPages) {
		this.totalPages = getTotalPages();
	}
}
