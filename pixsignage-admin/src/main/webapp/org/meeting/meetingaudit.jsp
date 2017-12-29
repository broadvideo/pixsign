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
					
		  <div id="MeetingAuditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
				<div class="modal-dialog modal-wide">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
							<h4 class="modal-title">会议审核</h4>
						</div>
						<div class="modal-body">
							<form id="MeetingAuditForm" class="form-horizontal" method="POST">
								<input type="hidden" name="meeting.meetingid" value="0" />
								<div class="form-body">
									     <div class="form-group">
											<label class="col-md-3 control-label">审核结果<span class="required">*</span></label>
											<div class="col-md-9">
												 <input type="hidden" id="ClassSelect3" class="form-control select2" name="meeting.auditstatus">
											</div>
									    </div>
										<div class="form-group">
											<label class="col-md-3 control-label">说明</label>
											<div class="col-md-9">
												<div class="input-icon right">
													<textarea class="form-control" rows="3" name="meeting.auditresult"></textarea> 
												</div>
											</div>
										</div>
								
								</div>
							</form>
						</div>
						<div class="modal-footer">
							<button type="submit" class="btn blue">提交</button>
							<button type="button" class="btn default" data-dismiss="modal"><spring:message code="global.cancel"/></button>
						</div>
					</div>
				</div>
			</div>
		

			<div id="MyEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
				<div class="modal-dialog modal-wide">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
							<h4 class="modal-title"><spring:message code="menu.meeting"/></h4>
						</div>
						<div class="modal-body">
							<form id="MyEditForm" class="form-horizontal" method="POST">
								<div class="form-body">
										<div class="form-group">
											<label class="col-md-3 control-label">位置</label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="meeting.locationname"  readonly/>
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label">会议室</label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="meeting.meetingroomname"  readonly/>
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label">主题</label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="meeting.subject"  readonly/>
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label">概要</label>
											<div class="col-md-9">
												<div class="input-icon right">
												   <textarea class="form-control" rows="3" name="meeting.description" readonly></textarea> 
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label" >开始时间</label>
											<div class="col-md-9">
												<div class="input-icon right">
												   <i class="fa"></i> <input type="text" class="form-control" name="meeting.starttime" readonly/>
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label">结束时间</label>
											<div class="col-md-9">
												<div class="input-icon right">
												   <i class="fa"></i> <input type="text" class="form-control" name="meeting.endtime" readonly/>
												</div>
											</div>
										</div>
								
										<div class="form-group">
											<label class="col-md-3 control-label">预订人</label>
											<div class="col-md-9">
												<div class="input-icon right">
												   <i class="fa"></i> <input type="text" class="form-control" name="meeting.bookstaffname" readonly/>

												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label">部门</label>
											<div class="col-md-9">
												<div class="input-icon right">
												   <i class="fa"></i> <input type="text" class="form-control" name="meeting.bookbranchname" readonly/>

												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label">参会人员</label>
											<div class="col-md-9">
										
											</div>
										</div>
									<div class="form-group">
											<label class="col-md-3 control-label">&nbsp;</label>
											<div class="col-md-9">
											   <table id="AttendeeTable" class="table table-striped table-bordered table-hover tree">
														<thead></thead>
														<tbody></tbody>
												</table>
											</div>
										</div>
										
									
								
								</div>
							</form>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
						</div>
					</div>
				</div>
			</div>
			
			<h3 class="page-title"><spring:message code="menu.meeting"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.mrbm"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.meetingaudit"/></a>
					</li>
				</ul>
			</div>
			
					
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-cogs"></i><spring:message code="menu.meeting"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="BranchModule.refresh();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body" id="MeetingroomPortlet">
							<div class="row">
								<div class="col-md-12">
									<div class="table-toolbar">
										<div class="btn-group" style="display:none;">
											<button class="btn green pix-search"  >检索<i class="fa fa-plus"></i></button>
										</div>
								
									</div>
									<table id="MeetingroomTable" class="table table-striped table-bordered table-hover tree">
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
	

	
 <div id="peoples_spinner_tpl"  style="display:none">	
		<div id="peoples_spinner" class="input-group input-xsmall" >
				 <input type="text" class="spinner-input form-control" name="meetingroom.peoples" maxlength="3" value="1" readonly>
				<div class="spinner-buttons input-group-btn btn-group-vertical">
					<button type="button" class="btn spinner-up btn-xs blue">
					   <i class="fa fa-angle-up"></i>
					 </button>
					<button type="button" class="btn spinner-down btn-xs blue">
						<i class="fa fa-angle-down"></i>
					</button>
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
<script src="${base_ctx}/scripts/org/meeting/meetingaudit.js?t=${timestamp}"></script>
<script>
var MyBranchid = <%=((Staff)session.getAttribute(CommonConstants.SESSION_STAFF)).getBranchid() %>;

jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	DataInit.init('${locale}');
	var meetingroomModule=new MeetingRoomModule();
	meetingroomModule.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
