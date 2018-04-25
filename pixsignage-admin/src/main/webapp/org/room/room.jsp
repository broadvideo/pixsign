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

			<div id="MyEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
				<div class="modal-dialog modal-wide">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
							<h4 class="modal-title"><spring:message code="menu.viproom"/></h4>
						</div>
						<div class="modal-body">
							<form id="MyEditForm" class="form-horizontal" method="POST">
								<input type="hidden" name="room.roomid" />
								<div class="form-body">
								       <div class="form-group">
											<label class="col-md-3 control-label">绑定终端</label>
											<div class="col-md-9">
												 <input type="hidden" id="ClassSelect" class="form-control select2" name="room.terminalids">
											</div>
									    </div>
										<div class="form-group">
											<label class="col-md-3 control-label">名称<span class="required">*</span></label>
											<div class="col-md-9">
												<div class="input-icon right">
													<i class="fa"></i> <input type="text" class="form-control" name="room.name" />
												</div>
											</div>
										</div>
										
										<div class="form-group">
											<label class="col-md-3 control-label">描述</label>
											<div class="col-md-9">
												<div class="input-icon right">
													<textarea class="form-control" rows="3" name="room.description"></textarea> 
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
			
			<h3 class="page-title"><spring:message code="menu.viproom"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="../../<%=mainpage%>">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.vip"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.viproom"/></a>
					</li>
				</ul>
			</div>
			
					
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-cogs"></i><spring:message code="menu.viproom"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="BranchModule.refresh();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body" id="MeetingroomPortlet">
							<div class="row">
								<div class="col-md-12">
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

<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/pix-datainit.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/common/pix.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/room/room.js?t=${timestamp}"></script>
<script>
var MyBranchid = <%=((Staff)session.getAttribute(CommonConstants.SESSION_STAFF)).getBranchid() %>;

jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	DataInit.init('${locale}');
	RoomModule.init(1);
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
