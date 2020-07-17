<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css" rel="stylesheet"/>

<link href="${base_ctx}/youwang/css/custom.css" rel="stylesheet" type="text/css"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
</head>

<body>
	<div id="AllModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.playlog"/></div>
						</div>
						<div class="portlet-body">
							<div class="row">
							</div>
							<table id="AllTable" class="table table-condensed table-hover">
								<thead></thead>
								<tbody></tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
				</div>
			</div>
		</div>
	</div>

	<div id="PlaylogModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-full">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-reorder"></i><spring:message code="pixsign.playlog"/></div>
						</div>
						<div class="portlet-body">
							<div class="row">
								<!-- 
								<div class="col-md-3 stat-hour">
									<div class="input-group date form_datetime_hour">                                       
										<input type="text" size="16" readonly class="form-control" name="playlog.stathour">
										<span class="input-group-btn">
										<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
										</span>
									</div>
								</div>
								 -->
								<div class="col-md-3 stat-day">
									<div class="input-group date form_datetime_day">                                       
										<input type="text" size="16" readonly class="form-control" name="playlog.statday">
										<span class="input-group-btn">
										<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
										</span>
									</div>
								</div>
								<div class="col-md-3 stat-month">
									<div class="btn-group">
										<input type="hidden" id="MonthSelect" class="form-control select2">
									</div>
								</div>
								<div class="col-md-3 stat-period">
									<div class="input-group date form_datetime_day">                                       
										<input type="text" size="16" readonly class="form-control" name="playlog.statfrom">
										<span class="input-group-btn">
										<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
										</span>
									</div>
								</div>
								<div class="col-md-3 stat-period">
									<div class="input-group date form_datetime_day">                                       
										<input type="text" size="16" readonly class="form-control" name="playlog.statto">
										<span class="input-group-btn">
										<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
										</span>
									</div>
								</div>
								<div class="col-md-3">
									<div class="btn-group">
										<a href="" class="btn green pix-download"><spring:message code="global.export"/> <i class="fa fa-download"></i></a>
									</div>
								</div>
							</div>
							<table id="PlaylogTable" class="table table-condensed table-hover">
								<thead></thead>
								<tbody></tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
				</div>
			</div>
		</div>
	</div>
			
	<div class="row main-content">
		<div class="row colorful-tab">
			<div class="tab-item col-md-2">
				<a href="onlinelog.jsp">
					<p class="text-center tab-label is-orange">
						<i class="glyphicon glyphicon-picture"></i> <spring:message code="menu.onlinelog"/>
					</p>
				</a>
			</div>
			<div class="tab-item col-md-2 selected">
				<a href="playlog.jsp">
					<p class="text-center tab-label is-blue">
						<i class="glyphicon glyphicon-film"></i> <spring:message code="menu.playlog"/>
					</p>
				</a>
			</div>
		</div>
		<div class="row content-bar">
			<div class="pull-right">
				<button class="btn blue pix-statall"><spring:message code="pixsign.statall"/> <i class="fa fa-download"></i></button>
			</div>
		</div>
		<div class="row content-list">
			<table id="DeviceTable" class="table table-striped table-bordered table-hover">
				<thead></thead>
				<tbody></tbody>
			</table>
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
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/common/pix.js?t=${timestamp}"></script>
<script src="${base_ctx}/youwang/scripts/playlog.js?t=${timestamp}"></script>
<!-- END PAGE LEVEL SCRIPTS -->
<script>
jQuery(document).ready(function() {
	Metronic.init();
	PixData.init('${locale}');
    $('.colorful-menu').find('.menu-item').removeClass('selected');
    $('#Menu6').addClass('selected');

    PlaylogModule.init();
})
</script>
</div>

</html>
