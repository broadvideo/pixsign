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
	<script src="/pixsignage-static/global/plugins/respond.min.js"></script>
	<script src="/pixsignage-static/global/plugins/excanvas.min.js"></script> 
	<![endif]-->   
<script src="/pixsignage-static/global/plugins/jquery.min.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/jquery-migrate.min.js" type="text/javascript"></script>
<!-- IMPORTANT! Load jquery-ui.min.js before bootstrap.min.js to fix bootstrap tooltip conflict with jquery ui tooltip -->
<script src="/pixsignage-static/global/plugins/jquery-ui/jquery-ui.min.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/jquery.blockui.min.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/jquery.cokie.min.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js" type="text/javascript"></script>
<!-- END CORE PLUGINS -->

<script type="text/javascript" src="/pixsignage-static/global/plugins/select2/select2.min.js"></script>
<script type="text/javascript" src="/pixsignage-static/global/plugins/data-tables/jquery.dataTables.js"></script>
<script type="text/javascript" src="/pixsignage-static/global/plugins/data-tables/DT_bootstrap.js"></script>
<script type="text/javascript" src="/pixsignage-static/global/plugins/jquery-validation/js/jquery.validate.min.js"></script>
<script type="text/javascript" src="/pixsignage-static/global/plugins/jquery-validation/js/localization/messages_zh.js"> </script>
<script type="text/javascript" src="/pixsignage-static/global/plugins/bootbox/bootbox.min.js"></script>
<script type="text/javascript" src="/pixsignage-static/global/plugins/jquery-loadJSON/jquery.loadJSON.js"></script>
<script type="text/javascript" src="/pixsignage-static/global/plugins/jquery-json/jquery.json-2.4.js"></script>
<script type="text/javascript" src="/pixsignage-static/global/plugins/gritter/js/jquery.gritter.js"></script>

<script src="/pixsignage-static/global/scripts/metronic.js" type="text/javascript"></script>
<script src="/pixsignage-static/admin/layout/scripts/layout.js" type="text/javascript"></script>

