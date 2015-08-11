package com.broadvideo.signage.service;

import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.broadvideo.signage.domain.Layout;
import com.broadvideo.signage.domain.Media;
import com.broadvideo.signage.domain.Region;
import com.broadvideo.signage.domain.Regiondtl;
import com.broadvideo.signage.domain.Schedule;
import com.broadvideo.signage.domain.Schedulefile;
import com.broadvideo.signage.persistence.LayoutMapper;
import com.broadvideo.signage.persistence.SchedulefileMapper;

@Service("schedulefileService")
public class SchedulefileServiceImpl implements SchedulefileService {

	@Autowired
	private SchedulefileMapper schedulefileMapper ;
	@Autowired
	private LayoutMapper layoutMapper ;
	
	public int selectCountBySchedule(String scheduleid) {
		return schedulefileMapper.selectCountBySchedule(scheduleid);
	}
	
	public List<Schedulefile> selectBySchedule(String scheduleid, String start, String length) {
		return schedulefileMapper.selectBySchedule(scheduleid, start, length);
	}
	
	public List<Schedulefile> selectByFile(String deviceid, String filetype, String fileid) {
		return schedulefileMapper.selectByFile(deviceid, filetype, fileid);
	}
	
	public List<Schedulefile> selectDownloadingFileBySchedule(String scheduleid) {
		return schedulefileMapper.selectDownloadingFileBySchedule(scheduleid);
	}
	
	public long selectFilesizecompleteBySchedule(String scheduleid) {
		return schedulefileMapper.selectFilesizecompleteBySchedule(scheduleid);
	}

	public void addSchedulefile(Schedulefile schedulefile) {
		schedulefileMapper.insert(schedulefile);
	}
	
	public void updateSchedulefile(Schedulefile schedulefile) {
		schedulefileMapper.updateByPrimaryKeySelective(schedulefile);
	}
	
	public void deleteSchedulefile(String[] ids) {
		String s = "";
		if (ids.length > 0) s = ids[0];
		for (int i=1; i<ids.length; i++) {
			s += "," + ids[i];
		}
		schedulefileMapper.deleteByKeys(s);
	}
	
	@Transactional
	public void insertSchedulefileBySchedule(Schedule schedule) {
		schedulefileMapper.deleteBySchedule("" + schedule.getScheduleid());
		
		Layout layout = layoutMapper.selectByPrimaryKey(""+schedule.getLayoutid());
		
		Schedulefile layoutfile = new Schedulefile();
		layoutfile.setScheduleid(schedule.getScheduleid());
		layoutfile.setDeviceid(schedule.getDeviceid());
		layoutfile.setUploadtype("0");
		layoutfile.setFiletype("0"); //Layout
		layoutfile.setFileid(layout.getLayoutid());
		layoutfile.setFilename(layout.getLayoutid() + ".xlf");
		layoutfile.setFilesize((long)layout.getXmlsize());
		layoutfile.setMd5(layout.getXmlmd5());
		layoutfile.setComplete(0);
		layoutfile.setUpdatetime(Calendar.getInstance().getTime());
		schedulefileMapper.insert(layoutfile);
		
		Map<Integer, Schedulefile> schedulefileHash = new HashMap<Integer, Schedulefile>();
		for (Region region : layout.getRegions()) {
			for (Regiondtl regiondtl : region.getRegiondtls()) {
				Media media = regiondtl.getMedia();
				if (media != null && schedulefileHash.get(media.getMediaid()) == null) {
					Schedulefile schedulefile = new Schedulefile();
					schedulefile.setScheduleid(schedule.getScheduleid());
					schedulefile.setDeviceid(schedule.getDeviceid());
					schedulefile.setFileid(media.getMediaid());
					schedulefile.setFilename(media.getFilename());
					schedulefile.setFilesize(media.getSize());
					schedulefile.setMd5(media.getMd5());
					schedulefile.setComplete(0);
					schedulefile.setUpdatetime(Calendar.getInstance().getTime());
					if (regiondtl.getMediatype().equals("1")) { //Image
						schedulefile.setFiletype("1");
						schedulefile.setUploadtype("0");
					} else if (regiondtl.getMediatype().equals("2")) { //Video
						schedulefile.setFiletype("2");
						schedulefile.setUploadtype(media.getUploadtype());
						schedulefile.setFileuri(media.getUri());
					} else if (regiondtl.getMediatype().equals("5")) { //Movie
						schedulefile.setFiletype("3");
						schedulefile.setUploadtype("2");
					} else if (regiondtl.getMediatype().equals("6")) { //Advert
						schedulefile.setFiletype("4");
						schedulefile.setUploadtype(media.getUploadtype());
					}
					schedulefileMapper.insert(schedulefile);
					schedulefileHash.put(regiondtl.getMedia().getMediaid(), schedulefile);
				}

			}
		}

	}
	
}
