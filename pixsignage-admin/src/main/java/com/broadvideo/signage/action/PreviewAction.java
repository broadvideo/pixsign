package com.broadvideo.signage.action;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.broadvideo.signage.domain.Regiondtl;
import com.broadvideo.signage.service.LayoutService;

@Scope("request")
@Controller("previewAction")
public class PreviewAction extends BaseAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -6524864070282048143L;

	private static final Logger log = Logger.getLogger(PreviewAction.class);

	@Autowired
	private LayoutService layoutService;
	
	public String getXlf() throws IOException {
		String layoutid = getParameter("layoutid");
		
		HttpServletResponse response = getHttpServletResponse();
		response.setContentType("text/xml;charset=utf-8");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache");
		PrintWriter out = response.getWriter();
		
		String xml = layoutService.selectPreviewXlf("" + layoutid);
		StringBuffer sb = new StringBuffer(xml);
		out.print(sb.toString());
		out.flush();
		out.close();
		return null;
	}

	public String getText() throws IOException {
		String regiondtlid = getParameter("textid");
		if (regiondtlid != null && regiondtlid.startsWith("text")) {
			regiondtlid = regiondtlid.substring(4);
		}
		String width = getParameter("width");
		String height = getParameter("height");
		
		Regiondtl regiondtl = layoutService.selectRegiondtl(regiondtlid);
		if (regiondtl != null) {
			HttpServletRequest request = getHttpServletRequest();
			request.setAttribute("color", regiondtl.getColor());
			if (regiondtl.getDirection().equalsIgnoreCase("1")) {
				request.setAttribute("direction", "none");
			} else if (regiondtl.getDirection().equalsIgnoreCase("2")) {
				request.setAttribute("direction", "up");
			} else if (regiondtl.getDirection().equalsIgnoreCase("3")) {
				request.setAttribute("direction", "down");
			} else if (regiondtl.getDirection().equalsIgnoreCase("4")) {
				request.setAttribute("direction", "left");
			} else if (regiondtl.getDirection().equalsIgnoreCase("5")) {
				request.setAttribute("direction", "right");
			} 
			request.setAttribute("opacity", regiondtl.getOpacity());
			request.setAttribute("raw", regiondtl.getRaw());
			request.setAttribute("size", regiondtl.getSize());
			request.setAttribute("speed", regiondtl.getSpeed());
			request.setAttribute("width", width);
			request.setAttribute("height", height);
		}

		return SUCCESS;
	}
}
