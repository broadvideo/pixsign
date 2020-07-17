<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css" rel="stylesheet" type="text/css" />
<link href="${static_ctx}/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css" rel="stylesheet" type="text/css"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
</head>

<body>
	<div class="page-content-wrapper">
		<div class="page-content">
		
		  <div id="MySearchModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
				<div class="modal-dialog modal-wide">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
							<h4 class="modal-title">检索</h4>
						</div>
						<div class="modal-body">
							<form id="MySearchForm" class="form-horizontal" method="POST">
								<div class="form-body">
										<div class="form-group">
											<label class="col-md-3 control-label">开始时间</label>
											<div class="col-md-9">
												<div class="input-group date form_datetime">
													<input type="text"  readonly class="form-control"  name="starttime">
													<span class="input-group-btn">
														<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
													</span>
					                        	</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label">结束时间</label>
											<div class="col-md-9">
											    <div class="input-group date form_datetime">
													<input type="text"  readonly class="form-control" name="endtime">
													<span class="input-group-btn">
														<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
													</span>
												</div>
											</div>
										</div>
									
								
								
								</div>
							</form>
						</div>
						<div class="modal-footer">
							<button type="submit" class="btn blue btn-search"  data-dismiss="modal">检索</button>
							<button type="button" class="btn default" data-dismiss="modal"><spring:message code="global.cancel"/></button>
						</div>
					</div>
				</div>
			</div>
			
			<h3 class="page-title"><spring:message code="menu.staffattendance"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.staff2"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.staffattendance"/></a>
					</li>
				</ul>
			</div>
			
					
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-cogs"></i><spring:message code="menu.staffattendance"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="refresh();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body" id="MyPortlet">
							<div class="row">
								<div class="col-md-2" style="display:none;">
								  <%-- 	<div class="row"><div class="col-md-2 leftLocationTree"></div></div> --%>
								</div>
								<div class="col-md-12">
									<div class="table-toolbar">
										<div class="btn-group">
											<button class="btn green pix-search"  >检索<i class="fa fa-plus"></i></button>
										</div>
									</div>
									<table id="MyTable" class="table table-striped table-bordered table-hover tree">
										<thead></thead>
										<tbody></tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	

</body>

<div id="SiteMethJavaScript">
<!-- BEGIN PAGE LEVEL PLUGINS -->
<script src="${static_ctx}/global/plugins/moment/moment.min.js"></script>
<script src="${static_ctx}/global/plugins/select2/select2.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/jquery.dataTables.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/DT_bootstrap.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/dist/jquery.validate.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-loadJSON/jquery.loadJSON.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-json/jquery.json-2.4.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jstree/dist/jstree.min.js" type="text/javascript"></script> 
<script src="${static_ctx}/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/fuelux/js/spinner.min.js" type="text/javascript"></script>	
<script src="${static_ctx}/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.${locale}.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/common/pix.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/event/personattendance.js?t=${timestamp}"></script>
<script>
var MyBranchid = <%=((Staff)session.getAttribute(CommonConstants.SESSION_STAFF)).getBranchid() %>;

jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	DataInit.init('${locale}');
	var attendance=new PersonAttendanceModule();
	attendance.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
