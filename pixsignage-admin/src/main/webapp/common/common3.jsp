<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
	</div>
	<!-- END CONTAINER -->
	<!-- BEGIN FOOTER -->
	<div class="footer">
		<div class="footer-inner">
			<%if (org == null || org.getCopyright() == null || org.getCopyright().equals("")) { %>
			©<%=java.util.Calendar.getInstance().get(java.util.Calendar.YEAR)%>&nbsp;&nbsp;明视迅达(VideoExpress)&nbsp;&nbsp;粤ICP备14037592号-1 <a href="http://www.miitbeian.gov.cn">工业和信息化部备案管理系统</a>
			<%} else { %>
			©<%=org.getCopyright()%>
			<%} %>
		</div>
		<div class="footer-tools">
			<span class="go-top">
			<i class="fa fa-angle-up"></i>
			</span>
		</div>
	</div>
	<!-- END FOOTER -->
	<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->
	<!-- BEGIN CORE PLUGINS -->   
	<!--[if lt IE 9]>
	<script src="/pixsignage-static/plugins/respond.min.js"></script>
	<script src="/pixsignage-static/plugins/excanvas.min.js"></script> 
	<![endif]-->   
	<script src="/pixsignage-static/plugins/jquery-1.10.2.min.js" type="text/javascript"></script>
	<script src="/pixsignage-static/plugins/jquery-migrate-1.2.1.min.js" type="text/javascript"></script>   
	<!-- IMPORTANT! Load jquery-ui-1.10.3.custom.min.js before bootstrap.min.js to fix bootstrap tooltip conflict with jquery ui tooltip -->
	<script src="/pixsignage-static/plugins/jquery-ui/jquery-ui-1.10.3.custom.min.js" type="text/javascript"></script>
	<script src="/pixsignage-static/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
	<script src="/pixsignage-static/plugins/bootstrap-hover-dropdown/twitter-bootstrap-hover-dropdown.min.js" type="text/javascript" ></script>
	<script src="/pixsignage-static/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
	<script src="/pixsignage-static/plugins/jquery.blockui.min.js" type="text/javascript"></script>  
	<script src="/pixsignage-static/plugins/jquery.cookie.min.js" type="text/javascript"></script>
	<script src="/pixsignage-static/plugins/uniform/jquery.uniform.min.js" type="text/javascript" ></script>
	<!-- END CORE PLUGINS -->
	
	<script type="text/javascript" src="/pixsignage-static/plugins/select2/select2.min.js"></script>
	<script type="text/javascript" src="/pixsignage-static/plugins/data-tables/jquery.dataTables.js"></script>
	<script type="text/javascript" src="/pixsignage-static/plugins/data-tables/DT_bootstrap.js"></script>
	<script type="text/javascript" src="/pixsignage-static/plugins/jquery-validation/dist/jquery.validate.min.js"></script>
	<script type="text/javascript" src="/pixsignage-static/plugins/jquery-validation/localization/messages_zh.js"> </script>
	<script type="text/javascript" src="/pixsignage-static/plugins/bootbox/bootbox.js"></script>
	<script type="text/javascript" src="/pixsignage-static/plugins/jquery-loadJSON/jquery.loadJSON.js"></script>
	<script type="text/javascript" src="/pixsignage-static/plugins/jquery-json/jquery.json-2.4.js"></script>
	<script type="text/javascript" src="/pixsignage-static/plugins/gritter/js/jquery.gritter.js"></script>
	
	