<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common/common1.jsp"%>

<!-- BEGIN PAGE LEVEL STYLES -->
<link rel="stylesheet" type="text/css" href="/pixsignage-static/plugins/fullcalendar/fullcalendar/fullcalendar.css" />
<link rel="stylesheet" type="text/css" href="/pixsignage-static/plugins/bootstrap-datetimepicker/css/datetimepicker.css" />
<!-- END PAGE LEVEL STYLES -->

<%@ include file="../common/common2.jsp"%>

<!-- BEGIN PAGE -->
<div class="page-content">

	<!-- 播放计划编辑对话框  -->
	<div id="MyEditModal" class="modal fade modal-scroll" role="dialog" data-backdrop="static">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title">播放计划</h4>
				</div>
				<div class="modal-body">
					<form id="MyEditForm" class="form-horizontal" data-async data-target="#MyEditModal" method="POST">
						<input type="hidden" name="schedule.scheduleid" value="0" />
						<input type="hidden" name="schedule.deviceid" value="0" />
						<input type="hidden" name="schedule.priority" value="0" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">布局<span class="required">*</span></label>
								<div class="col-md-9">
									<input type="hidden" id="LayoutSelect" class="form-control select2" name="schedule.layoutid" />
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">开始时间<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-group date form_datetime">                                       
										<input type="text" size="16" readonly class="form-control" name="schedule.fromdate">
										<span class="input-group-btn">
											<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
										</span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">结束时间<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-group date form_datetime">                                       
										<input type="text" size="16" readonly class="form-control" name="schedule.todate">
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
					<button type="submit" class="btn blue">提交</button>
					<button type="button" class="btn default" data-dismiss="modal">关闭</button>
				</div>
			</div>
		</div>
	</div>
	<!-- END END MODAL FORM-->

	<!-- BEGIN PAGE HEADER-->
	<div class="row">
		<div class="col-md-12">
			<!-- BEGIN PAGE TITLE & BREADCRUMB-->
			<h3 class="page-title">播放计划</h3>
			<ul class="page-breadcrumb breadcrumb">
				<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
					class="fa fa-angle-right"></i>
				</li>
				<li><a href="#">播出管理</a><i class="fa fa-angle-right"></i>
				</li>
				<li><a href="#">播放计划</a>
				</li>
			</ul>
			<!-- END PAGE TITLE & BREADCRUMB-->
		</div>
	</div>
	<!-- END PAGE HEADER-->

	<!-- BEGIN PAGE CONTENT-->
	<div class="row">
		<div class="col-md-12">
			<div class="portlet box blue calendar">
				<div class="portlet-title">
					<div class="caption"><i class="fa fa-calendar"></i>播放计划</div>
				</div>
				<div class="portlet-body light-grey">
					<div class="row">
						<div class="col-md-3 col-sm-12">
							<!-- BEGIN DRAGGABLE EVENTS PORTLET-->    
							<h3 class="event-form-title">请选择终端</h3>
							<input type="hidden" id="DeviceSelect" class="form-control select2">
							<!-- END DRAGGABLE EVENTS PORTLET-->            
						</div>
						<div class="col-md-9 col-sm-9">
							<div id="calendar" class="has-toolbar"></div>
						</div>
					</div>
					<!-- END CALENDAR PORTLET-->
				</div>
			</div>
		</div>
	</div>
	<!-- END PAGE CONTENT-->

</div>
<!-- END PAGE -->


<%@ include file="../common/common3.jsp"%>

<!-- BEGIN PAGE LEVEL PLUGINS -->
<script src="/pixsignage-static/plugins/fullcalendar/fullcalendar/fullcalendar.min.js"></script>
<script type="text/javascript" src="/pixsignage-static/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js"></script>
<script type="text/javascript" src="/pixsignage-static/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="/pixsignage-static/scripts/app.js" type="text/javascript"></script>
<script src="../local/scripts/pix-datainit.js"></script>
<script src="../local/scripts/pix-schedule.js?t=3" type="text/javascript"></script>
<!-- END PAGE LEVEL SCRIPTS -->  
<script>
	jQuery(document).ready(function() {    
	   App.init(); // initlayout and core plugins
	   DataInit.init();
	   initSchedules();
	   initMyEditModal();
	});
</script>

<%@ include file="../common/common4.jsp"%>
