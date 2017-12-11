package biz.videoexpress.pixedx.lmsapi.bean;

import javax.ws.rs.QueryParam;

import com.fasterxml.jackson.annotation.JsonProperty;

public class QueryField {
	@QueryParam("q")
	private String query;

	@JsonProperty("q")
	public String getQuery() {
		return query;
	}

	public void setQuery(String query) {
		this.query = query;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("QueryReq [query=");
		builder.append(query);
		builder.append("]");
		return builder.toString();
	}

}
