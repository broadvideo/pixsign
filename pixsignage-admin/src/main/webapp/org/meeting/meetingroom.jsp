<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css" rel="stylesheet" type="text/css"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
</head>

<body>
	<div class="page-content-wrapper">
		<div class="page-content">
		
			<div id="EquipmentDtlModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
				<div class="modal-dialog modal-full">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
						</div>
						<div class="modal-body">
							<div class="row">
								<div class="col-md-6">
									<div class="portlet box blue">
										<div class="portlet-title">
											<div class="caption"><i class="fa fa-reorder"></i>未关联设备</div>
										</div>
										<div class="portlet-body">
											<div class="table-toolbar">
												<div class="btn-group pull-right">
													<button class="btn btn-sm blue pix-adddevicegpdtl"><spring:message code="global.add"/> <i class="fa fa-arrow-right"></i></button>
												</div>
											</div>
											<table id="EquipmentTable" class="table table-striped table-bordered table-hover">
												<thead></thead>
												<tbody></tbody>
											</table>
										</div>
									</div>
								</div>
								<div class="col-md-6">
									<div class="portlet box green">
										<div class="portlet-title">
											<div class="caption"><i class="fa fa-picture"></i>已关联设备</div>
										</div>
										<div class="portlet-body">
											<div class="table-toolbar">
												<div class="btn-group">
													<button class="btn btn-sm red pix-deletedevicegpdtl"><i class="fa fa-arrow-left"></i> <spring:message code="global.remove"/></button>
												</div>
											</div>
											<table id="MeetingroomEquipmentTable" class="table table-striped table-bordered table-hover">
												<thead></thead>
												<tbody></tbody>
											</table>
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
			<div id="MyEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
				<div class="modal-dialog modal-wide">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
							<h4 class="modal-title"><spring:message code="menu.meetingroom"/></h4>
						</div>
						<div class="modal-body">
							<form id="MyEditForm" class="form-horizontal" method="POST">
								<input type="hidden" name="meetingroom.meetingroomid" value="0" />
								<div class="form-body">
									  <div class="form-group">
											<label class="col-md-3 control-label">位置<span class="required">*</span></label>
											<div class="col-md-9">
												<div class="pre-scrollable" id="BranchTree"></div>	
												<input type="hidden" name="meetingroom.locationid"/>
											</div>
										</div>
									   <div class="form-group">
											<label class="col-md-3 control-label">绑定终端1</label>
											<div class="col-md-9">
												 <input type="hidden" id="ClassSelect" class="form-control select2" name="meetingroom.terminalid">
											</div>
									    </div>
									    <div class="form-group">
											<label class="col-md-3 control-label">绑定终端2</label>
											<div class="col-md-9">
												 <input type="hidden" id="ClassSelect2" class="form-control select2" name="meetingroom.terminalid2">
											</div>
									    </div>
										<div class="form-group">
											<label class="col-md-3 control-label">名称<span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="meetingroom.name" />
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label">描述</label>
											<div class="col-md-9">
												<div class="input-icon right">
													<textarea class="form-control" rows="3" name="meetingroom.description"></textarea> 
												</div>
											</div>
										</div>
										<div class="form-group" style="display:none;">
											<label class="col-md-3 control-label" >布局</label>
											<div class="col-md-9">
												<div class="input-icon right">
												   <i class="fa"></i> <input type="text" class="form-control" name="meetingroom.layout" />
												</div>
											</div>
										</div>
									
										<div class="form-group">
											<label class="col-md-3 control-label">费用<span class="required">*</span></label>
											<div class="col-md-6">
											    <div class="input-group input-icon right">
										            <input type="text" class="form-control" name="meetingroom.feeperhour" />
										            <span class="input-group-addon">元/每小时</span>
									            </div>
											</div>
											<div class="col-md-3">
									         
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label">人数（容纳）<span class="required">*</span></label>
											<div id="peoples_wrapper_div" class="col-md-9">
												
											</div>
										</div>
									    <div class="form-group">
											<label class="col-md-3 control-label">会议设备</label>
											<div class="col-md-9">
											   <div class="checkbox-list">
													<label class="checkbox-inline">
													<input type="checkbox" name="equipmentflag" value="0000000001"> 投影仪 </label>
													<label class="checkbox-inline">
													<input type="checkbox" name="equipmentflag" value="0000000010"> 视讯设备 </label>
												</div>
											   
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label">可预订<span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
												    <i class="fa"></i> 
												     <input type="checkbox"  id="OpenFlagSwitch" class="make-switch" data-on-color="success" data-on-text="是" data-off-color="default" data-off-text="否" checked>
												      <input type="hidden"  name="meetingroom.openflag"/> 
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="col-md-3 control-label">预定审核<span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
												    <i class="fa"></i> 
												     <input type="checkbox"  id="AuditFlagSwitch" class="make-switch" data-on-color="success" data-on-text="是" data-off-color="default" data-off-text="否">
												      <input type="hidden"  name="meetingroom.auditflag"/> 
												</div>
											</div>
										</div>
								</div>
							</form>
						</div>
						<div class="modal-footer">
							<button type="submit" class="btn blue"><spring:message code="global.submit"/></button>
							<button type="button" class="btn default" data-dismiss="modal"><spring:message code="global.cancel"/></button>
						</div>
					</div>
				</div>
			</div>
			
			<h3 class="page-title"><spring:message code="menu.meetingroom"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="main.jsp">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.mrbm"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.meetingroom"/></a>
					</li>
				</ul>
			</div>
			
					
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-cogs"></i><spring:message code="menu.meetingroom"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="BranchModule.refresh();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body" id="MeetingroomPortlet">
							<div class="row">
								<div class="col-md-2">
									<div class="row"><div class="col-md-12 leftLocationTree"></div></div>
								</div>
								<div class="col-md-10">
									<div class="table-toolbar">
										<div class="btn-group">
											<button class="btn green pix-add"><spring:message code="global.add"/> <i class="fa fa-plus"></i></button>
										</div>
										<div class="btn-group">
										
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

<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/common/pix.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/meeting/meetingroom.js?t=${timestamp}"></script>
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
