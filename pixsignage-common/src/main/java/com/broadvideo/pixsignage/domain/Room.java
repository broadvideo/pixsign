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

    private String sourcetype;

    private String roompersonflag;
    private Integer orgid;

    private Date createtime;

    private Integer createstaffid;

    private Date updatetime;

    private Integer updatestaffid;

    private String status;
	private String search;
	private String terminalids;
	private List<Roomterminal> roomterminals = new ArrayList<Roomterminal>();
	private List<Roomperson> roompersons = new ArrayList<Roomperson>();
	private String personids;

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

    public String getSourcetype() {
        return sourcetype;
    }

    public void setSourcetype(String sourcetype) {
        this.sourcetype = sourcetype == null ? null : sourcetype.trim();
    }

    public String getRoompersonflag() {
        return roompersonflag;
    }
    public void setRoompersonflag(String roompersonflag) {
        this.roompersonflag = roompersonflag == null ? null : roompersonflag.trim();
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

	@Transient
	public String getPersonids() {
		if (roompersons != null && roompersons.size() > 0) {
			StringBuilder sb = new StringBuilder();
			for (int i = 0; i < roompersons.size(); i++) {
				if (i > 0) {
					sb.append(",");
				}
				sb.append(roompersons.get(i).getPersonid());

			}
			return sb.toString();

		}
		return personids;
	}

	public void setPersonids(String personids) {
		this.personids = personids;
	}

	@Transient
	public List<Roomperson> getRoompersons() {
		return roompersons;
	}

	public void setRoompersons(List<Roomperson> roompersons) {
		this.roompersons = roompersons;
	}
}