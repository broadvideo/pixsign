<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<%@include file="/common/session.jsp"%>

<head>
<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet"/>
<link href="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.css" rel="stylesheet"/>
<link href="${base_ctx}/css/pix.css" rel="stylesheet"/>
</head>

<body>
	<!-- 审核对话框  -->
	<div id="ReviewModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-wide">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					<h4 class="modal-title"><spring:message code="pixsign.page"/></h4>
				</div>
				<div class="modal-body">
				<form id="ReviewForm" class="form-horizontal" data-async data-target="#ReviewModal" method="POST">
						<input type="hidden" name="page.pageid" value="0" />
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.review.result"/></label>
								<div class="col-md-9">
									<div class="col-md-9 radio-list">
										<label class="radio-inline">
											<input type="radio" name="page.reviewflag" value="1" checked> <spring:message code="pixsign.review.passed"/>
										</label>
										<label class="radio-inline">
											<input type="radio" name="page.reviewflag" value="2"> <spring:message code="pixsign.review.rejected"/>
										</label>
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-3 control-label"><spring:message code="pixsign.review.comment"/></label>
								<div class="col-md-9">
									<textarea class="form-control" rows="5" name="page.comment"></textarea>
								</div>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="submit" class="btn blue"><spring:message code="global.submit"/></button>
					<button type="button" class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
				</div>
			</div>
		</div>
	</div>

	<div id="PageModal" class="modal fade modal-scroll" tabindex="-1" role="dialog" data-backdrop="static">
		<div class="modal-dialog modal-full">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-12 col-sm-12">
							<div class="portlet box purple">
								<div class="portlet-title">
									<div class="caption"><i class="fa fa-calendar"></i><spring:message code="pixsign.page"/></div>
								</div>
								<div class="portlet-body form">
									<div class="row">
										<div id="PageCol1">
											<div id="PageDiv" pageid="0"></div>
										</div>
										<div id="PageCol2">
											<label class="page-title font-red-sunglo pagezone-title"></label>
											<h3 class="pagezone-content">http://</h3>
											<div class="pagezone-dtl table-responsive">
												<table id="PagezonedtlTable" class="table table-condensed table-hover">
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
				<div class="modal-footer">
					<button class="btn default" data-dismiss="modal"><spring:message code="global.close"/></button>
				</div>
			</div>
		</div>
	</div>
		
	<div class="page-content-wrapper">
		<div class="page-content">
			<!-- BEGIN PAGE HEADER-->
			<h3 class="page-title"><spring:message code="menu.pagereview"/></h3>
			<div class="page-bar">
				<ul class="page-breadcrumb">
					<li><i class="fa fa-home"></i><a href="../../<%=mainpage%>">Home</a><i
						class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.review"/></a><i class="fa fa-angle-right"></i>
					</li>
					<li><a href="#"><spring:message code="menu.pagereview"/></a>
					</li>
				</ul>
			</div>
		
			<div class="row">
				<div class="col-md-12">
					<div class="portlet box blue">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-cloud"></i><spring:message code="pixsign.page"/></div>
							<div class="tools">
								<a href="javascript:;" onClick="ReviewModule.refresh();" class="reload"></a>
							</div>
						</div>
						<div class="portlet-body">
							<table id="PageTable" class="table table-striped table-bordered table-hover">
								<thead></thead>
								<tbody></tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			<div id="snapshot_div" style="position:relative; top:65px; display:none;"></div>
		</div>
	</div>
</body>

<div id="SiteMethJavaScript">
<!-- BEGIN PAGE LEVEL PLUGINS -->
<script src="${static_ctx}/global/plugins/select2/select2.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/jquery.dataTables.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/data-tables/DT_bootstrap.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/dist/jquery.validate.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-validation/localization/messages_${locale}.js?t=2" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-loadJSON/jquery.loadJSON.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-json/jquery.json-2.4.js" type="text/javascript"></script>

<script src="${static_ctx}/global/plugins/fancybox/source/jquery.fancybox.pack.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/html2canvas.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jwplayer/jwplayer.js"></script>
<script src="${static_ctx}/global/plugins/jwplayer/jwpsrv.js"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="${static_ctx}/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${static_ctx}/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${base_ctx}/scripts/lang/${locale}.js?t=${timestamp}" type="text/javascript"></script>
<script src="${base_ctx}/scripts/common/pix.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/page/page-preview.js?t=${timestamp}"></script>
<script src="${base_ctx}/scripts/org/page/review.js?t=${timestamp}"></script>
<script>
jQuery(document).ready(function() {    
	Metronic.init();
	Layout.init();
	PixData.init('${locale}');
	ReviewModule.init();
});

</script>
<!-- END PAGE LEVEL SCRIPTS -->
</div>

</html>
