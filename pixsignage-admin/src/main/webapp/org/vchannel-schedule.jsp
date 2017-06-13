<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/admin/pages/css/timeline-old.css" rel="stylesheet" type="text/css"/>
<link href="${static_ctx}/global/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css" rel="stylesheet"/>
</head>

<body>
	<div class="page-content-wrapper">
		<div class="page-content">
			
			<div id="ScheduleModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
						</div>
						<div class="modal-body">
							<form id="ScheduleForm" class="form-horizontal" method="POST">
								<div class="form-body">
									<input type="hidden" name="vchannelschedule.vchannelscheduleid" value="0" />
									<input type="hidden" name="vchannelschedule.vchannelid" />
									<div class="form-group">
										<label class="control-label col-md-3"><spring:message code="global.option"/></label>
										<div class="col-md-9 radio-list">
											<label class="radio-inline">
												<input type="radio" name="vchannelschedule.playmode" value="2" checked> <spring:message code="global.daily"/>
											</label>
										</div>
									</div>
									<div class="form-group">
										<label class="col-md-3 control-label"><spring:message code="global.starttime"/><span class="required">*</span></label>
										<div class="col-md-9">
											<div class="input-group date form_time">                                       
												<input type="text" size="16" readonly class="form-control" name="vchannelschedule.starttime">
												<span class="input-group-btn">
												<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
												</span>
											</div>
										</div>
									</div>
									<div class="form-group">
										<label class="col-md-3 control-label"><spring:message code="global.playlist"/><span class="required">*</span></label>
										<div class="col-md-9">
											<input type="hidden" id="PlaylistSelect" class="form-control select2" name="vchannelschedule.playlistid" />
										</div>
									</div>
								</div>
							</form>
						</div>
						<div class="modal-footer">
							<button type="submit" class="btn blue button-submit"><spring:message code="global.submit"/></button>
							<button type="button" class="btn default" data-dismiss="modal"><spring:message code="global.cancel"/></button>
						</div>
					</div>
				</div>
			</div>
			
		
			<h3 class="page-title"><spring:message code="menu.vchannelschedule"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.vstation"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.vchannelschedule"/></a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-desktop"></i><spring:message code="global.vchannelschedule"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="refreshVchannelschedule();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body">
							<div class="row">
								<div id="LeftTab" class="col-md-2 col-sm-2 col-xs-2">
								</div>
								<div class="col-md-10 col-sm-10 col-xs-10">
									<div class="tab-content">
										<div class="tab-pane active">
											<div class="row">
												<div class="col-md12 col-sm-12">
													<a class="btn purple pull-right pix-syncschedule" href="#"><i class="fa fa-rss"></i> <spring:message code="global.syncschedule"/></a>&nbsp;
													<a class="btn green pull-right pix-addschedule" href="#"><i class="fa fa-plus"></i> <spring:message code="global.addschedule"/></a>
												</div>
											</div>
											<br/>
											<div class="row">
												<div class="col-md12 col-sm-12" id="ScheduleDetail">
												</div>
											</div>
										</div>
									</div>
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
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/pix-vchannel-schedule.js?t=${timestamp}"></script>
<script>
jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	DataInit.init('${locale}');
	initVchannels();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
