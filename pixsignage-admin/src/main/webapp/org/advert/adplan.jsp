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

	<div id="AdplanEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-wide">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="pixsign.adplan"/></h4>
				</div>
				<div class="modal-body">
					<form id="AdplanEditForm" class="form-horizontal" method="POST">
						<input type="hidden" name="adplan.adplanid" value="0" />
						<div class="form-body">
							<div class="form-group hide-update">
								<label class="control-label col-md-3">广告位</label>
								<div class="col-md-9">
									<select class="form-control" name="adplan.adplace" tabindex="-1">
										<option value="1">1</option>
										<option value="2">2</option>
										<option value="3">3</option>
									</select>
								</div>
							</div>
							<div class="form-group hide-update">
								<label class="control-label col-md-3"><spring:message code="pixsign.devicegroup"/></label>
								<div class="col-md-9">
									<input type="hidden" id="DevicegroupSelect" class="form-control select2" name="adplan.devicegroupid" />
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">每秒单价(分)<span class="required">*</span></label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="adplan.unitprice" />
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
			
	<div id="AdplandtlEditModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static" style="z-index: 10051;">
		<div class="modal-dialog modal-wide">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title">广告明细</h4>
				</div>
				<div class="modal-body">
					<form id="AdplandtlEditForm" class="form-horizontal" method="POST">
						<input type="hidden" name="adplandtl.adplandtlid" value="0" />
						<input type="hidden" name="adplandtl.adplanid" value="0" />
						<input type="hidden" name="adplandtl.adplace" value="" />
						<input type="hidden" name="adplandtl.devicegroupid" value="0" />
						<input type="hidden" name="adplandtl.unitprice" value="0" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">广告类型</label>
								<div class="col-md-9 radio-list">
									<label class="radio-inline">
										<input type="radio" name="adplandtl.adtype" value="1" checked> 视频广告
									</label>
									<label class="radio-inline">
										<input type="radio" name="adplandtl.adtype" value="2"> 图片广告
									</label>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3">广告</label>
								<div class="col-md-9">
									<div class="input-group">
										<span class="input-group-btn">
											<button class="btn btn-default" type="button" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"><i class="fa fa-folder-open"/></i></button>
											<ul class="dropdown-menu" role="menu">
												<div class="pre-scrollable foldertree">
												</div>
											</ul>
										</span>
										<input type="hidden" id="AdvertSelect" class="form-control select2" name="adplandtl.adid" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3">循环内次数</label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="adplandtl.times" value="1" />
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label">开始时间</label>
								<div class="col-md-9">
									<div class="input-group date form_datetime">                                       
										<input type="text" size="16" readonly class="form-control" name="adplandtl.starttime" />
										<span class="input-group-btn">
										<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>
										</span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-md-3">连续月数</label>
								<div class="col-md-9">
									<div class="input-icon right">
										<i class="fa"></i> <input type="text" class="form-control" name="adplandtl.months" value="1" />
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
			
	<div id="AdplandtlModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-full">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div class="table-toolbar">
						<div class="btn-group">
							<button class="btn green pix-adplandtl-add">新增明细 <i class="fa fa-plus"></i></button>
						</div>
					</div>
					<table id="AdplandtlTable" class="table table-striped table-bordered table-hover">
						<thead></thead>
						<tbody></tbody>
					</table>
				</div>
				<div class="modal-footer">
					<button class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
				</div>
			</div>
		</div>
	</div>
	
	<div class="page-content-wrapper">
		<div class="page-content">
			<h3 class="page-title"><spring:message code="menu.adplan"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="../../<%=mainpage%>">Home</a><i
							class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.admanage"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.adplan"/></a>
					</li>
				</ul>
			</div>
			
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-video-camera"></i><spring:message code="pixsign.adplan"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="AdplanModule.refresh();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body" id="AdplanPortlet">
							<div class="table-toolbar">
								<div class="btn-group">
									<button class="btn green pix-add"><spring:message code="global.add"/> <i class="fa fa-plus"></i></button>
								</div>
							</div>
							<table id="AdplanTable" class="table table-striped table-bordered table-hover">
								<thead></thead>
								<tbody></tbody>
							</table>
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
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/common/pix.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/advert/adplan.js?t=${timestamp}"></script>
<script>
jQuery(document).ready(function() {
	Metronic.init();
	Layout.init();
	PixData.init('${locale}');
	AdplanModule.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
