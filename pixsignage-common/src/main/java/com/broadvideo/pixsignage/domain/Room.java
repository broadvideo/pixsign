package com.broadvideo.pixsignage.domain;

import java.beans.Transient;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Room {
    private Integer roomid;

    private String uuid;

    private Integer seqno;

    private Integer type;

    private String name;

    private String description;

    private String source_type;

    private Integer orgid;

    private Date createtime;

    private Integer createstaffid;

    private Date updatetime;

    private Integer updatestaffid;

    private String status;
	private String search;
	private String terminalids;
	private List<Roomterminal> roomterminals = new ArrayList<Roomterminal>();

	public Integer getRoomid() {
        return roomid;
    }

    public void setRoomid(Integer roomid) {
        this.roomid = roomid;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid == null ? null : uuid.trim();
    }

    public Integer getSeqno() {
        return seqno;
    }

    public void setSeqno(Integer seqno) {
        this.seqno = seqno;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }

    public String getSource_type() {
        return source_type;
    }

    public void setSource_type(String source_type) {
        this.source_type = source_type == null ? null : source_type.trim();
    }

    public Integer getOrgid() {
        return orgid;
    }

    public void setOrgid(Integer orgid) {
        this.orgid = orgid;
    }

    public Date getCreatetime() {
        return createtime;
    }

    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }

    public Integer getCreatestaffid() {
        return createstaffid;
    }

    public void setCreatestaffid(Integer createstaffid) {
        this.createstaffid = createstaffid;
    }

    public Date getUpdatetime() {
        return updatetime;
    }

    public void setUpdatetime(Date updatetime) {
        this.updatetime = updatetime;
    }

    public Integer getUpdatestaffid() {
        return updatestaffid;
    }

    public void setUpdatestaffid(Integer updatestaffid) {
        this.updatestaffid = updatestaffid;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status == null ? null : status.trim();
    }

	@Transient
	public String getSearch() {
		return search;
	}

	public void setSearch(String search) {
		this.search = search;
	}

	@Transient
	public String getTerminalids() {
		if (roomterminals != null && roomterminals.size() > 0) {
			StringBuilder sb = new StringBuilder();
			for (int i = 0; i < roomterminals.size(); i++) {
				if (i > 0) {
					sb.append(",");
				}
				sb.append(roomterminals.get(i).getTerminalid());

			}
			return sb.toString();

		}
		return terminalids;
	}


	public void setTerminalids(String terminalids) {
		this.terminalids = terminalids;
	}

	@Transient
	public List<Roomterminal> getRoomterminals() {
		return roomterminals;
	}

	public void setRoomterminals(List<Roomterminal> roomterminals) {
		this.roomterminals = roomterminals;
	}
}