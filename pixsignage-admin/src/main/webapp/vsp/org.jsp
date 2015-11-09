<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%
response.setHeader("Cache-Control","no-store");
response.setHeader("Pragrma","no-cache");
response.setDateHeader("Expires",0);
%>
<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!--> <html lang="en" class="no-js"> <!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
<meta charset="utf-8" />
<title>Pix Signage</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="Cache-Control" content="no-cache, must-revalidate">
<meta http-equiv="expires" content="0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="width=device-width, initial-scale=1.0" name="viewport" />
<meta content="" name="description" />
<meta content="" name="author" />
<meta name="MobileOptimized" content="320">
<!-- BEGIN GLOBAL MANDATORY STYLES -->
<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css"/>
<link href="/pixsignage-static/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
<link href="/pixsignage-static/global/plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css" />
<link href="/pixsignage-static/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<link href="/pixsignage-static/global/plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css" />
<link href="/pixsignage-static/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css" rel="stylesheet" type="text/css"/>
<!-- END GLOBAL MANDATORY STYLES -->

<!-- BEGIN PAGE LEVEL STYLES -->
<link href="/pixsignage-static/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="/pixsignage-static/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>

<link href="/pixsignage-static/global/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet"/>
<link href="/pixsignage-static/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css" rel="stylesheet"/>

<link href="../local/css/pix.css" rel="stylesheet"/>
<!-- END PAGE LEVEL STYLES -->

<%@ include file="../common/common2.jsp"%>

		<div class="page-content-wrapper">
			<div class="page-content">
				<div id="MyEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
					<div class="modal-dialog modal-lg">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
								<h4 class="modal-title">企业</h4>
							</div>
							<div class="modal-body">
								<form id="MyEditForm" class="form-horizontal" method="POST">
									<input type="hidden" name="org.orgid" value="0" /> <input type="hidden" name="org.status" value="1" />
									<div class="form-body">
										<div class="form-group">
											<label class="col-md-3 control-label">企业名称<span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="org.name" placeholder="请输入企业名称" />
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label">企业编码<span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="org.code" placeholder="请输入企业编码" />
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label">类型<span class="required">*</span></label>
											<div class="col-md-9 radio-list">
												<label class="radio-inline">
													<input type="radio" name="org.orgtype" value="1" checked> 通用版
												</label>
												<label class="radio-inline">
													<input type="radio" name="org.orgtype" value="3" > PIDS
												</label>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label">媒体范围</label>
											<div class="col-md-9 checkbox-list">
												<label class="checkbox-inline">
													<input type="checkbox" name="org.videoflag" value="1" checked>视频
												</label>
												<label class="checkbox-inline">
													<input type="checkbox" name="org.imageflag" value="1" checked>图片
												</label>
												<label class="checkbox-inline">
													<input type="checkbox" name="org.textflag" value="1" checked>文本
												</label>
												<label class="checkbox-inline">
													<input type="checkbox" name="org.streamflag" value="1" checked>视频流
												</label>
												<label class="checkbox-inline">
													<input type="checkbox" name="org.dvbflag" value="1" checked>数字频道
												</label>
												<label class="checkbox-inline">
													<input type="checkbox" name="org.widgetflag" value="1" checked>Widget
												</label>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label">生效时限<span class="required">*</span></label>
											<div class="col-md-9 radio-list">
												<label class="radio-inline">
													<input type="radio" name="org.expireflag" value="0" checked> 永不过期
												</label>
												<label class="radio-inline">
													<input type="radio" name="org.expireflag" value="1" > 过期
												</label>
											</div>
										</div>
										<div class="form-group expiretime">
											<label class="col-md-3 control-label"></label>
											<div class="col-md-9">
												<div class="input-group date form_datetime">                                       
													<input type="text" size="16" readonly class="form-control" name="org.expiretime" value="2037-01-01">
													<span class="input-group-btn">
													<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
													</span>
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label">最大终端数<span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="org.maxdevices" placeholder="请输入最大终端数" />
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label">最大存储容量(MB)<span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="org.maxstorage" placeholder="请输入最大存储容量" />
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label">版权说明</label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="org.copyright" />
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label">描述</label>
											<div class="col-md-9">
												<textarea class="form-control" rows="4" name="org.description"></textarea>
											</div>
										</div>
									</div>
								</form>
							</div>
							<div class="modal-footer">
								<button type="submit" class="btn blue">提交</button>
								<button type="button" class="btn default" data-dismiss="modal">关闭</button>
							</div>
						</div>
						<!-- /.modal-content -->
					</div>
					<!-- /.modal-dialog -->
				</div>
				<!-- /.modal -->
				<!-- END END MODAL FORM-->
			
				<!-- BEGIN PAGE HEADER-->
				<h3 class="page-title">企业管理</h3>
				<div class="page-bar">
					<ul class="page-breadcrumb">
						<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
						</li>
						<li><a href="#">运营管理</a><i class="fa fa-angle-right"></i>
						</li>
						<li><a href="#">企业管理</a>
						</li>
					</ul>
				</div>
				<!-- END PAGE HEADER-->
			
				<!-- BEGIN PAGE CONTENT-->
				<div class="row">
					<div class="col-md-12">
						<div class="portlet box blue">
							<div class="portlet-title">
								<div class="caption"><i class="fa fa-cloud"></i>企业</div>
								<div class="tools">
									<a href="javascript:;" onClick="$('#MyTable').dataTable()._fnAjaxUpdate();" class="reload"></a>
								</div>
							</div>
							<div class="portlet-body">
								<div class="table-toolbar">
									<div class="btn-group">
										<button privilegeid="101010" class="btn green pix-add">新增 <i class="fa fa-plus"></i></button>
									</div>
								</div>
								<table id="MyTable" class="table table-striped table-bordered table-hover">
									<thead></thead>
									<tbody></tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<!-- END PAGE CONTENT -->
			</div>
		</div>

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

<!-- BEGIN PAGE LEVEL PLUGINS -->
<script src="/pixsignage-static/global/plugins/select2/select2.min.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/data-tables/jquery.dataTables.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/data-tables/DT_bootstrap.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/jquery-validation/dist/jquery.validate.min.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/jquery-validation/localization/messages_zh.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/jquery-loadJSON/jquery.loadJSON.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/jquery-json/jquery.json-2.4.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js" type="text/javascript"></script>
<script src="/pixsignage-static/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="/pixsignage-static/global/scripts/metronic.js" type="text/javascript"></script>
<script src="/pixsignage-static/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="../local/scripts/pix-datainit.js"></script>
<script src="../local/scripts/pix-org.js?t=2"></script>
<script>
var MaxOrgs = <%=com.broadvideo.pixsignage.common.CommonConfig.LICENSE_MaxOrgs%>;
var MaxDevicesPerSigOrg = <%=com.broadvideo.pixsignage.common.CommonConfig.LICENSE_MaxDevicesPerSigOrg%>;
var MaxStoragePerSigOrg = <%=com.broadvideo.pixsignage.common.CommonConfig.LICENSE_MaxStoragePerSigOrg%>;

jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	DataInit.init();
	initMyTable();
	initMyEditModal();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->

</body>
</html>
