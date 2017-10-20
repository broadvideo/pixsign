<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
</head>

<body>
	<div id="DownloadByDayModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="pixsign.statbyday.export"/></h4>
				</div>
				<div class="modal-body">
					<form id="DownloadByDayForm" class="form-horizontal form-bordered form-row-stripped" method="GET" action="flowlog!downloadbyday.action">
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.statday"/><span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-group date form_datetime">                                       
										<input type="text" size="16" readonly class="form-control" name="day">
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
					<button type="submit" class="btn blue"><spring:message code="global.export"/> </button>
					<button type="button" class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
				</div>
			</div>
		</div>
	</div>

	<div id="DownloadByMonthModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="pixsign.statbymonth.export"/></h4>
				</div>
				<div class="modal-body">
					<form id="DownloadByMonthForm" class="form-horizontal form-bordered form-row-stripped" method="GET" action="flowlog!downloadbymonth.action">
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.statmonth"/><span class="required">*</span></label>
								<div class="col-md-9">
									<input type="hidden" id="MonthSelect1" name="month" class="form-control select2">
								</div>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="submit" class="btn blue"><spring:message code="global.export"/> </button>
					<button type="button" class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
				</div>
			</div>
		</div>
	</div>

	<div id="ChartModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-full">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-12 col-sm-12">
							<div class="portlet solid bordered light-grey">
								<div class="portlet-title">
									<div class="caption">
										<i class="fa fa-bar-chart-o"></i><spring:message code="pixsign.statbyday"/>
									</div>
								</div>
								<div class="portlet-body">
									<div class="row">
										<div class="col-md-3">
											<div class="input-group date form_datetime">                                       
												<input type="text" size="16" readonly class="form-control" name="flowlog.statdate">
												<span class="input-group-btn">
												<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
												</span>
											</div>
										</div>
									</div>
									<div class="row">
										<div class="col-md-6 col-sm-12" id="StatLoding1">
											<img src="${static_ctx}/admin/layout/img/loading.gif" alt="loading" />
										</div>
										<div class="col-md-6 col-sm-12" id="StatByDay1" class="display-none">
											<div id="StatByDayPlot" class="chart"></div>
										</div>
										<div class="col-md-6 col-sm-12" id="StatLoding2">
											<img src="${static_ctx}/admin/layout/img/loading.gif" alt="loading" />
										</div>
										<div class="col-md-3 col-sm-12" id="StatByDay2_1" class="display-none">
											<div id="StatByDayPie1" class="chart"></div>
										</div>
										<div class="col-md-3 col-sm-12" id="StatByDay2_2" class="display-none">
											<div id="StatByDayPie2" class="chart"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
				
						<div class="col-md-12 col-sm-12">
							<div class="portlet solid bordered light-grey">
								<div class="portlet-title">
									<div class="caption">
										<i class="fa fa-bar-chart-o"></i><spring:message code="pixsign.statbymonth"/>
									</div>
								</div>
								<div class="portlet-body">
									<div class="row">
										<div class="col-md-3">
											<div class="btn-group">
												<input type="hidden" id="MonthSelect2" class="form-control select2">
											</div>
										</div>
									</div>
									<div class="row">
										<div class="col-md-6 col-sm-12" id="StatLoding3">
											<img src="${static_ctx}/admin/layout/img/loading.gif" alt="loading" />
										</div>
										<div class="col-md-6 col-sm-12" id="StatByMonth1" class="display-none">
											<div id="StatByMonthPlot" class="chart"></div>
										</div>
										<div class="col-md-6 col-sm-12" id="StatLoding4">
											<img src="${static_ctx}/admin/layout/img/loading.gif" alt="loading" />
										</div>
										<div class="col-md-3 col-sm-12" id="StatByMonth2_1" class="display-none">
											<div id="StatByMonthPie1" class="chart"></div>
										</div>
										<div class="col-md-3 col-sm-12" id="StatByMonth2_2" class="display-none">
											<div id="StatByMonthPie2" class="chart"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

				</div>
				<div class="modal-footer">
					<button class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
				</div>
			</div>
		</div>
	</div>

	<div class="page-content-wrapper">
		<div class="page-content">
			
			<h3 class="page-title"><spring:message code="menu.flowlog"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="../main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.stat"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.flowlog"/></a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-video-camera"></i><spring:message code="pixsign.flowlog"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="FlowlogModule.refresh();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body" id="DevicePortlet">
							<div class="table-toolbar">
								<div class="btn-group">
									<button class="btn green pix-downloadbyday"><spring:message code="pixsign.statbyday.export"/> <i class="fa fa-download"></i></button>
								</div>
								<div class="btn-group">
									<button class="btn green pix-downloadbymonth"><spring:message code="pixsign.statbymonth.export"/> <i class="fa fa-download"></i></button>
								</div>
							</div>
							<div class="row">
								<div class="col-md-2">
									<div class="row"><div class="col-md-12 branchtree"></div></div>
								</div>
								<div class="col-md-10">
									<table id="DeviceTable" class="table table-striped table-bordered table-hover">
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
<script src="${static_ctx}/global/plugins/select2/select2.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/jquery.dataTables.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/DT_bootstrap.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/dist/jquery.validate.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-loadJSON/jquery.loadJSON.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-json/jquery.json-2.4.js" type="text/javascript"></script>

<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.${locale}.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jstree/dist/jstree.min.js" type="text/javascript"></script> 
<script src="${static_ctx}/global/plugins/flot/jquery.flot.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/flot/jquery.flot.resize.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/flot/jquery.flot.pie.min.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/common/pix.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/common/branch-tree.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/stat/flowlog.js?t=${timestamp}"></script>
<script>
jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	PixData.init('${locale}');
	FlowlogModule.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>