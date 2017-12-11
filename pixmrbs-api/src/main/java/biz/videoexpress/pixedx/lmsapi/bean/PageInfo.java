package biz.videoexpress.pixedx.lmsapi.bean;

import javax.ws.rs.QueryParam;

public class PageInfo extends QueryField {

	@QueryParam("start")
	private Integer start = 0;
	@QueryParam("length")
	private Integer length;

	public Integer getStart() {
		if (start == null) {

			return 0;
		}

		return start;
	}

	public void setStart(Integer start) {
		this.start = start;
	}

	public Integer getLength() {
		if (length == null || length == 0) {
			return 12;
		}
		return length;
	}

	public void setLength(Integer length) {
		this.length = length;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("PageInfo [start=");
		builder.append(start);
		builder.append(", length=");
		builder.append(length);
		builder.append(", toString()=");
		builder.append(super.toString());
		builder.append("]");
		return builder.toString();
	}

}
