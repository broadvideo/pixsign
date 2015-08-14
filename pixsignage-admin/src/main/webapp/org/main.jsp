<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../common/common1.jsp"%>

<!-- BEGIN PAGE LEVEL STYLES -->
<!-- END PAGE LEVEL STYLES -->

<%@ include file="../common/common2.jsp"%>

<!-- BEGIN PAGE -->
<div class="page-content">
	<!-- BEGIN PAGE HEADER-->
	<div class="row">
		<div class="col-md-12">
			<!-- BEGIN PAGE TITLE & BREADCRUMB-->
			<h3 class="page-title">我的首页</h3>
			<!-- END PAGE TITLE & BREADCRUMB-->
		</div>
	</div>
	<!-- END PAGE HEADER-->
	
	<div class="row ">
		<div class="col-md-12 col-sm-12">
			<span id="ExpireTime"></span>
		</div>
	</div>
	<div class="clearfix"></div>

	<div class="row ">
		<div class="col-md-6 col-sm-6">
			<span id="CurrentDevices"></span><span id="MaxDevices" class="badge badge-danger" style="float: right;"></span>
			<div class="progress">
				<div id="CurrentDevicesProgress" class="progress-bar " role="progressbar" style="width: 0%">
				</div>
			</div>
		</div>

		<div class="col-md-6 col-sm-6">
			<span id="CurrentStorage"></span><span id="MaxStorage" class="badge badge-danger" style="float: right;"></span>
			<div class="progress">
				<div id="CurrentStorageProgress" class="progress-bar " role="progressbar" style="width: 0%">
				</div>
			</div>
		</div>

	</div>
	
	<div class="row ">
		<div class="col-md-6 col-sm-6">
			<div class="portlet box blue">
				<div class="portlet-title">
					<div class="caption"><i class="fa fa-bell-o"></i>最新注册终端</div>
					<div class="actions">
						<a href="device.jsp?CurrentP=20201&ParentP=202" class="btn btn-sm default easy-pie-chart-reload"><i class="m-icon-swapright"></i> 更多</a>
					</div>
				</div>
				<div class="portlet-body">
					<table id="DeviceTable" class="table table-striped">
						<thead></thead>
						<tbody></tbody>
					</table>
				</div>
			</div>
			<!-- END TABLE PORTLET-->
		</div>

		<div class="col-md-6 col-sm-6">
			<div class="portlet box blue">
				<div class="portlet-title">
					<div class="caption"><i class="fa fa-bell-o"></i>最新任务</div>
					<div class="actions">
						<a href="task.jsp?CurrentP=20301&ParentP=203" class="btn btn-sm default easy-pie-chart-reload"><i class="m-icon-swapright"></i> 更多</a>
					</div>
				</div>
				<div class="portlet-body">
					<table id="TaskTable" class="table table-striped">
						<thead></thead>
						<tbody></tbody>
					</table>
				</div>
			</div>
			<!-- END TABLE PORTLET-->
		</div>

	</div>

	<div class="clearfix"></div>
	<div class="row">
		<div class="col-md-6 col-sm-6">
			<div class="portlet solid bordered light-grey">
				<div class="portlet-title">
					<div class="caption"><i class="fa fa-bar-chart-o"></i>媒体上载数量</div>
				</div>
				<div class="portlet-body">
					<div id="MediaStatLoding">
						<img src="../assets/img/loading.gif" alt="loading"/>
					</div>
					<div id="MediaStat" class="display-none">
						<div id="MediaStatPlot" class="chart"></div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="col-md-6 col-sm-6">
			<div class="portlet solid bordered light-grey">
				<div class="portlet-title">
					<div class="caption"><i class="fa fa-bar-chart-o"></i>媒体下载流量</div>
				</div>
				<div class="portlet-body">
					<div id="FileStatLoding">
						<img src="../assets/img/loading.gif" alt="loading"/>
					</div>
					<div id="FileStat" class="display-none">
						<div id="FileStatPlot" class="chart"></div>
					</div>
				</div>
			</div>
		</div>
		
	</div>
</div>
<!-- END PAGE -->


<%@ include file="../common/common3.jsp"%>

<!-- BEGIN PAGE LEVEL PLUGINS -->
<script src="../assets/plugins/flot/jquery.flot.js" type="text/javascript"></script>
<script src="../assets/plugins/flot/jquery.flot.resize.js" type="text/javascript"></script>
<!-- END PAGE LEVEL PLUGINS -->

<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="../assets/scripts/app.js" type="text/javascript"></script>
<script src="../local/scripts/pix-datainit.js"></script>
<script src="../local/scripts/pix-main.js?t=4"></script>
<!-- END PAGE LEVEL SCRIPTS -->  
<script>
var videoflag = <%=((Org)session.getAttribute(SessionConstants.SESSION_ORG)).getVideoflag() %>;
var imageflag = <%=((Org)session.getAttribute(SessionConstants.SESSION_ORG)).getImageflag() %>;

	jQuery(document).ready(function() {    
	   App.init(); // initlayout and core plugins
	   DataInit.init();
	   initLicense();
	   initDeviceTable();
	   initTaskTable();
	   initMediaChart();
	   initFileChart();
	});
</script>

<%@ include file="../common/common4.jsp"%>
