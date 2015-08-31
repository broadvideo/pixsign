package com.broadvideo.signage.action;

import java.awt.Color;
import java.awt.Font;
import java.awt.Point;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.signage.common.CommonConfig;
import com.broadvideo.signage.domain.Media;
import com.broadvideo.signage.service.MediaService;
import com.broadvideo.signage.util.CommonUtil;
import com.gif4j.GifDecoder;
import com.gif4j.GifEncoder;
import com.gif4j.GifImage;
import com.gif4j.TextPainter;
import com.gif4j.Watermark;

@Scope("request")
@Controller("mediaAction")
public class MediaAction extends BaseDatatableAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 7218739668158862051L;

	private static final Logger log = Logger.getLogger(MediaAction.class);

	private Media media;
	private String[] ids;

	@Autowired
	private MediaService mediaService;

	public String doImageList() {
		return doList("1");
	}

	public String doVideoList() {
		String type = getParameter("type");
		if (type == null || type.equals("")) {
			type = "2";
		}
		return doList(type);
	}

	public String doList(String type) {
		try {
			this.setsEcho(getParameter("sEcho"));
			String start = getParameter("iDisplayStart");
			String length = getParameter("iDisplayLength");
			String branchid = getParameter("branchid");
			String search = getParameter("sSearch");

			if (branchid == null) {
				branchid = "" + getLoginStaff().getBranchid();
			}

			int count = mediaService.selectCount("" + getLoginStaff().getOrgid(), branchid, type, null, search);
			this.setiTotalRecords(count);
			this.setiTotalDisplayRecords(count);

			List<Object> aaData = new ArrayList<Object>();
			List<Media> mediaList = mediaService.selectList("" + getLoginStaff().getOrgid(), branchid, type, null,
					search, start, length);
			for (int i = 0; i < mediaList.size(); i++) {
				aaData.add(mediaList.get(i));
			}
			this.setAaData(aaData);

			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doAdd() {
		try {
			media.setCreatestaffid(getLoginStaff().getStaffid());
			media.setOrgid(getLoginStaff().getOrgid());
			media.setBranchid(getLoginStaff().getBranchid());

			media.setFilename(media.getName());

			mediaService.addMedia(media);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doUpdate() {
		try {
			mediaService.updateMedia(media);
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String doDelete() {
		try {
			if (ids != null) {
				mediaService.deleteMedia(ids);
			}
			return SUCCESS;
		} catch (Exception ex) {
			ex.printStackTrace();
			setErrorcode(-1);
			setErrormsg(ex.getMessage());
			return ERROR;
		}
	}

	public String getThumbnail() throws IOException {
		String mediaid = getParameter("mediaid");
		byte[] bs = new byte[0];
		Media currentmedia = null;

		if (mediaid != null) {
			currentmedia = mediaService.selectWithBLOBsByPrimaryKey(mediaid);
			if (currentmedia != null && currentmedia.getThumbnail() != null) {
				bs = currentmedia.getThumbnail();
			} else {
				bs = CommonUtil.generateThumbnail(new File(CommonConfig.CONFIG_THUMB_DEFAULT), 120);
			}
		}

		if (currentmedia.getUploadtype().equals("1")) {
			ByteArrayInputStream is = new ByteArrayInputStream(bs);
			GifImage gf = GifDecoder.decode(is);
			TextPainter textPainter = new TextPainter(new Font("黑体", Font.ITALIC, 12));
			textPainter.setOutlinePaint(Color.WHITE);
			textPainter.setBackgroundColor(Color.BLUE);
			BufferedImage renderedWatermarkText = textPainter.renderString("PixTrans", true);
			Watermark watermark = new Watermark(renderedWatermarkText, new Point());
			gf = watermark.apply(gf, true);
			ByteArrayOutputStream os = new ByteArrayOutputStream();
			GifEncoder.encode(gf, os);
			bs = os.toByteArray();
		}

		HttpServletResponse response = getHttpServletResponse();
		if (currentmedia != null && currentmedia.getType().equals("1") && currentmedia.getContenttype() != null) {
			response.setContentType(currentmedia.getContenttype());
		} else {
			response.setContentType("image/jpeg");
		}
		OutputStream out = response.getOutputStream();
		out.write(bs);
		out.flush();
		out.close();
		return null;
	}

	public Media getMedia() {
		return media;
	}

	public void setMedia(Media media) {
		this.media = media;
	}

	public String[] getIds() {
		return ids;
	}

	public void setIds(String[] ids) {
		this.ids = ids;
	}

}
