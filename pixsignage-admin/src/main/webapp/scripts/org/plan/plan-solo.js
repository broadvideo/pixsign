var PlanModule = function () {
	var _submitflag = false;
	var CurrentPlan;
	var CurrentPlanid;
	var CurrentPlandtl;
	var CurrentPlandtls;
	var CurrentPlanbinds;
	this.PlanTree = new BranchTree($('#PlanPortlet'));
	
	var timestamp = new Date().getTime();

	var init = function () {
		initPlanTable();
		initPlanEvent();
		initPlanWizard();
	};

	var refresh = function () {
		$('#PlanTable').dataTable()._fnAjaxUpdate();
	};
	
	var initPlanTable = function () {
		$('#PlanTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 10, 25, 50, 100 ],
							[ 10, 25, 50, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'plan!list.action',
			'aoColumns' : [ {'sTitle' : common.view.playtime, 'mData' : 'planid', 'bSortable' : false, 'sWidth' : '20%' }, 
			                {'sTitle' : common.view.detail, 'mData' : 'planid', 'bSortable' : false, 'sWidth' : '40%' },
							{'sTitle' : common.view.device, 'mData' : 'planid', 'bSortable' : false, 'sWidth' : '35%' },
							{'sTitle' : '', 'mData' : 'planid', 'bSortable' : false, 'sWidth' : '10%' }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				var playtimehtml = '';
				playtimehtml += '<span><h4><b>Plan-' + aData.planid + '</b></h4></span><hr/>';
				if (aData.startdate == '1970-01-01') {
					playtimehtml += common.view.unlimited;
				} else {
					playtimehtml += aData.startdate;
				}
				playtimehtml += ' ~ ';
				if (aData.enddate == '2037-01-01') {
					playtimehtml += common.view.unlimited;
				} else {
					playtimehtml += aData.enddate;
				}
				playtimehtml += '<br/>';
				if (aData.starttime == '00:00:00' && aData.endtime == '00:00:00') {
					playtimehtml += common.view.fulltime;
				} else {
					playtimehtml += aData.starttime + ' ~ ' + aData.endtime;
				}
				$('td:eq(0)', nRow).html(playtimehtml);

				var planhtml = '';
				if (aData.plandtls.length > 0) {
					for (var i=0; i<aData.plandtls.length; i++) {
						var plandtl = aData.plandtls[i];
						var name;
						var thumbwidth;
						if (i % 4 == 0) {
							planhtml += '<div class="row" >';
						}
						planhtml += '<div class="col-md-3 col-xs-3">';

						planhtml += '<a href="javascript:;" data-index="' + iDisplayIndex + '" plandtl-index="' + i + '" class="fancybox">';
						planhtml += '<div class="thumbs">';

						if (plandtl.objtype == 1) {
							name = plandtl.bundle.name;
							thumbwidth = plandtl.bundle.width > plandtl.bundle.height? 100 : 100*plandtl.bundle.width/plandtl.bundle.height;
							planhtml += '<img src="/pixsigdata' + plandtl.bundle.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" />';
						} else if (plandtl.objtype == 2) {
							name = plandtl.page.name;
							thumbwidth = plandtl.page.width > plandtl.page.height? 100 : 100*plandtl.page.width/plandtl.page.height;
							planhtml += '<img src="/pixsigdata' + plandtl.page.snapshot + '" class="imgthumb" width="' + thumbwidth + '%" />';
						}
						planhtml += '</div>';
						planhtml += '</a>';
						planhtml += '<h6 class="pixtitle">' + name + '</h6>';
						if (plandtl.duration > 0) {
							planhtml += '<h6 class="pixtitle">' + PixData.transferIntToTime(plandtl.duration) + '</h6>';
						}
						if (plandtl.maxtimes > 0) {
							planhtml += '<h6 class="pixtitle">' + plandtl.maxtimes + '</h6>';
						}
						planhtml += '</div>';
						if ((i+1) % 4 == 0 || (i+1) == aData.plandtls.length) {
							planhtml += '</div>';
						}
					}
				} else {
					planhtml = '';
				}
				$('td:eq(1)', nRow).html(planhtml);
				
				var devicehtml = '';
				var devicegrouphtml = '';
				for (var i=0; i<aData.planbinds.length; i++) {
					var planbind = aData.planbinds[i];
					if (planbind.bindtype == 1) {
						devicehtml += planbind.device.terminalid + ' ';
					} else if (planbind.bindtype == 2) {
						devicegrouphtml += planbind.devicegroup.name + ' ';
					}
				}
				if (devicehtml != '') {
					devicehtml = common.view.device + ': ' + devicehtml + '<br/>';
				}
				if (devicegrouphtml != '') {
					devicegrouphtml = common.view.devicegroup + ': ' + devicegrouphtml;
				}
				$('td:eq(2)', nRow).html(devicehtml + devicegrouphtml);
			
				var buttonhtml = '';
				buttonhtml += '<div class="util-btn-margin-bottom-5">';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>';
				buttonhtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
				buttonhtml += '</div>';
				$('td:eq(3)', nRow).html(buttonhtml);

				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				$('#PlanTable .thumbs').each(function(i) {
					$(this).width($(this).parent().closest('div').width());
					$(this).height($(this).parent().closest('div').width());
				});
				refreshFancybox();
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':PlanTree.branchid });
				aoData.push({'name':'plantype','value':1 });
			}
		});
		$('#PlanTable_wrapper').addClass('form-inline');
		$('#PlanTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#PlanTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#PlanTable_wrapper .dataTables_length select').select2();
		$('#PlanTable').css('width', '100%').css('table-layout', 'fixed');

		function refreshFancybox() {
			$('.fancybox').each(function(index,item) {
				$(this).click(function() {
					var data_index = $(this).attr('data-index');
					var plandtl_index = $(this).attr('plandtl-index');
					var plan = $('#PlanTable').dataTable().fnGetData(data_index);
					var plandtl = plan.plandtls[plandtl_index];

					if (plandtl.objtype == 1) {
						$.ajax({
							type : 'GET',
							url : 'bundle!get.action',
							data : {bundleid: plandtl.objid},
							success : function(data, status) {
								if (data.errorcode == 0) {
									$.fancybox({
										openEffect	: 'none',
										closeEffect	: 'none',
										closeBtn : false,
								        padding : 0,
								        content: '<div id="BundlePreview"></div>',
								    });
									redrawBundlePreview($('#BundlePreview'), data.bundle, 800, 1);
								} else {
									bootbox.alert(common.tips.error + data.errormsg);
								}
							},
							error : function() {
								console.log('failue');
							}
						});
					} else if (plandtl.objtype == 2) {
						$.ajax({
							type : 'GET',
							url : 'page!get.action',
							data : {pageid: plandtl.objid},
							success : function(data, status) {
								if (data.errorcode == 0) {
									$.fancybox({
										openEffect	: 'none',
										closeEffect	: 'none',
										closeBtn : false,
								        padding : 0,
								        content: '<div id="PagePreview"></div>',
								    });
									PagePreviewModule.preview($('#PagePreview'), data.page, 800);
								} else {
									bootbox.alert(common.tips.error + data.errormsg);
								}
							},
							error : function() {
								console.log('failue');
							}
						});
					}
					return false;
				})
			});
		}
	};
	
	var initPlanEvent = function () {
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			CurrentPlan = $('#PlanTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'plan!delete.action',
						cache: false,
						data : {
							'plan.planid': CurrentPlan.planid
						},
						success : function(data, status) {
							if (data.errorcode == 0) {
								refresh();
							} else {
								bootbox.alert(common.tips.error + data.errormsg);
							}
						},
						error : function() {
							console.log('failue');
						}
					});				
				}
			 });
		});

		$('body').on('click', '.pix-sync', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			CurrentPlan = $('#PlanTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.sync, function(result) {
				if (result == true) {
					$.ajax({
						type : 'GET',
						url : 'plan!sync.action',
						cache: false,
						data : { planid: CurrentPlan.planid },
						dataType : 'json',
						contentType : 'application/json;charset=utf-8',
						beforeSend: function ( xhr ) {
							Metronic.startPageLoading({animate: true});
						},
						success : function(data, status) {
							Metronic.stopPageLoading();
							if (data.errorcode == 0) {
								bootbox.alert(common.tips.success);
							} else {
								bootbox.alert(common.tips.error + data.errormsg);
							}
						},
						error : function() {
							Metronic.stopPageLoading();
							console.log('failue');
						}
					});				
				}
			});
		});
	};

	var initPlanWizard = function () {
		$('body').on('click', '.pix-add', function(event) {
			CurrentPlan = {};
			CurrentPlandtls = [];
			CurrentPlanbinds = [];
			CurrentPlanid = 0;
			CurrentPlan.planid = 0;
			CurrentPlan.plantype = 1;
			CurrentPlan.startdate = '1970-01-01';
			CurrentPlan.enddate = '2037-01-01';
			CurrentPlan.starttime = '00:00:00';
			CurrentPlan.endtime = '00:00:00';
			initWizard();
			$('#PlanModal').modal();
		});

		$('body').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			CurrentPlan = $('#PlanTable').dataTable().fnGetData(index);
			CurrentPlandtls = CurrentPlan.plandtls;
			CurrentPlanbinds = CurrentPlan.planbinds;
			initWizard();
			$('#PlanModal').modal();
		});

		//Bundle table初始化
		$('#BundleTable thead').css('display', 'none');
		$('#BundleTable tbody').css('display', 'none');	
		var bundlehtml = '';
		$('#BundleTable').dataTable({
			'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 12, 30, 48, 96 ],
							  [ 12, 30, 48, 96 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'bundle!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.operation, 'mData' : 'bundleid', 'bSortable' : false }],
			'iDisplayLength' : 12,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnPreDrawCallback': function (oSettings) {
				if ($('#BundleContainer').length < 1) {
					$('#BundleTable').append('<div id="BundleContainer"></div>');
				}
				$('#BundleContainer').html(''); 
				return true;
			},
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				if (iDisplayIndex % 6 == 0) {
					bundlehtml = '';
					bundlehtml += '<div class="row" >';
				}
				bundlehtml += '<div class="col-md-2 col-xs-2">';
				
				bundlehtml += '<div id="ThumbContainer" style="position:relative">';
				bundlehtml += '<div id="BundleThumb" class="thumbs">';
				if (aData.snapshot != null) {
					var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
					bundlehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				} else {
					bundlehtml += '<img src="/pixsignage/img/blank.png" class="imgthumb" width="100%" />';
				}
				bundlehtml += '<div class="mask">';
				bundlehtml += '<div>';
				bundlehtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
				bundlehtml += '<a class="btn default btn-sm green pix-plandtl-bundle-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
				bundlehtml += '</div>';
				bundlehtml += '</div>';
				bundlehtml += '</div>';

				bundlehtml += '</div>';

				bundlehtml += '</div>';
				if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#BundleTable').dataTable().fnGetData().length) {
					bundlehtml += '</div>';
					if ((iDisplayIndex+1) != $('#BundleTable').dataTable().fnGetData().length) {
						bundlehtml += '<hr/>';
					}
					$('#BundleContainer').append(bundlehtml);
				}
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				$('#BundleContainer .thumbs').each(function(i) {
					$(this).width($(this).parent().width());
					$(this).height($(this).parent().width());
				});
				$('#BundleContainer .mask').each(function(i) {
					$(this).width($(this).parent().parent().width() + 2);
					$(this).height($(this).parent().parent().width() + 2);
				});
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'touchflag','value':'0' });
			}
		});
		$('#BundleTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
		$('#BundleTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
		$('#BundleTable').css('width', '100%');

		//Touchbundle table初始化
		$('#TouchbundleTable thead').css('display', 'none');
		$('#TouchbundleTable tbody').css('display', 'none');	
		var touchbundlehtml = '';
		$('#TouchbundleTable').dataTable({
			'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 12, 30, 48, 96 ],
							  [ 12, 30, 48, 96 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'bundle!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.operation, 'mData' : 'bundleid', 'bSortable' : false }],
			'iDisplayLength' : 12,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnPreDrawCallback': function (oSettings) {
				if ($('#TouchbundleContainer').length < 1) {
					$('#TouchbundleTable').append('<div id="TouchbundleContainer"></div>');
				}
				$('#TouchbundleContainer').html(''); 
				return true;
			},
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				if (iDisplayIndex % 6 == 0) {
					touchbundlehtml = '';
					touchbundlehtml += '<div class="row" >';
				}
				touchbundlehtml += '<div class="col-md-2 col-xs-2">';
				
				touchbundlehtml += '<div id="ThumbContainer" style="position:relative">';
				touchbundlehtml += '<div id="TouchbundleThumb" class="thumbs">';
				if (aData.snapshot != null) {
					var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
					touchbundlehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				} else {
					touchbundlehtml += '<img src="/pixsignage/img/blank.png" class="imgthumb" width="100%" />';
				}
				touchbundlehtml += '<div class="mask">';
				touchbundlehtml += '<div>';
				touchbundlehtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
				touchbundlehtml += '<a class="btn default btn-sm green pix-plandtl-touchbundle-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
				touchbundlehtml += '</div>';
				touchbundlehtml += '</div>';
				touchbundlehtml += '</div>';

				touchbundlehtml += '</div>';

				touchbundlehtml += '</div>';
				if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#TouchbundleTable').dataTable().fnGetData().length) {
					touchbundlehtml += '</div>';
					if ((iDisplayIndex+1) != $('#TouchbundleTable').dataTable().fnGetData().length) {
						touchbundlehtml += '<hr/>';
					}
					$('#TouchbundleContainer').append(touchbundlehtml);
				}
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				$('#TouchbundleContainer .thumbs').each(function(i) {
					$(this).height($(this).parent().width());
				});
				$('#TouchbundleContainer .mask').each(function(i) {
					$(this).height($(this).parent().parent().width() + 2);
				});
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'touchflag','value':'1' });
				aoData.push({'name':'homeflag','value':'1' });
			}
		});
		$('#TouchbundleTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
		$('#TouchbundleTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
		$('#TouchbundleTable').css('width', '100%');

		//Page table初始化
		var PageTree = new BranchTree($('#PageDiv'));
		$('#PageTable thead').css('display', 'none');
		$('#PageTable tbody').css('display', 'none');	
		var pagehtml = '';
		$('#PageTable').dataTable({
			'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 12, 30, 48, 96 ],
							  [ 12, 30, 48, 96 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'page!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.operation, 'mData' : 'pageid', 'bSortable' : false }],
			'iDisplayLength' : 12,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnPreDrawCallback': function (oSettings) {
				if ($('#PageContainer').length < 1) {
					$('#PageTable').append('<div id="PageContainer"></div>');
				}
				$('#PageContainer').html(''); 
				return true;
			},
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				if (iDisplayIndex % 6 == 0) {
					pagehtml = '';
					pagehtml += '<div class="row" >';
				}
				pagehtml += '<div class="col-md-2 col-xs-2">';
				
				pagehtml += '<div id="ThumbContainer" style="position:relative">';
				pagehtml += '<div id="PageThumb" class="thumbs">';
				if (aData.snapshot != null) {
					var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
					pagehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				} else {
					pagehtml += '<img src="/pixsignage/img/blank.png" class="imgthumb" width="100%" />';
				}
				pagehtml += '<div class="mask">';
				pagehtml += '<div>';
				pagehtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
				pagehtml += '<a class="btn default btn-sm green pix-plandtl-page-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
				pagehtml += '</div>';
				pagehtml += '</div>';
				pagehtml += '</div>';

				pagehtml += '</div>';

				pagehtml += '</div>';
				if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#PageTable').dataTable().fnGetData().length) {
					pagehtml += '</div>';
					if ((iDisplayIndex+1) != $('#PageTable').dataTable().fnGetData().length) {
						pagehtml += '<hr/>';
					}
					$('#PageContainer').append(pagehtml);
				}
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				$('#PageContainer .thumbs').each(function(i) {
					console.log($(this).parent().width());
					$(this).width($(this).parent().width());
					$(this).height($(this).parent().width());
				});
				$('#PageContainer .mask').each(function(i) {
					$(this).width($(this).parent().parent().width() + 2);
					$(this).height($(this).parent().parent().width() + 2);
				});
			},
			'fnServerParams': function(aoData) {
				aoData.push({'name':'branchid','value':PageTree.branchid });
				aoData.push({'name':'touchflag','value':'0' });
			}
		});
		$('#PageTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
		$('#PageTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
		$('#PageTable').css('width', '100%');

		//Touchpage table初始化
		var TouchpageTree = new BranchTree($('#TouchpageDiv'));
		$('#TouchpageTable thead').css('display', 'none');
		$('#TouchpageTable tbody').css('display', 'none');	
		var touchpagehtml = '';
		$('#TouchpageTable').dataTable({
			'sDom' : '<"row"<"col-md-1 col-sm-1"><"col-md-11 col-sm-11"f>r>t<"row"<"col-md-12 col-sm-12"i><"col-md-12 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 12, 30, 48, 96 ],
							  [ 12, 30, 48, 96 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'page!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.operation, 'mData' : 'pageid', 'bSortable' : false }],
			'iDisplayLength' : 12,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnPreDrawCallback': function (oSettings) {
				if ($('#TouchpageContainer').length < 1) {
					$('#TouchpageTable').append('<div id="TouchpageContainer"></div>');
				}
				$('#TouchpageContainer').html(''); 
				return true;
			},
			'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
				if (iDisplayIndex % 6 == 0) {
					touchpagehtml = '';
					touchpagehtml += '<div class="row" >';
				}
				touchpagehtml += '<div class="col-md-2 col-xs-2">';
				
				touchpagehtml += '<div id="ThumbContainer" style="position:relative">';
				touchpagehtml += '<div id="TouchpageThumb" class="thumbs">';
				if (aData.snapshot != null) {
					var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
					touchpagehtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + timestamp + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
				} else {
					touchpagehtml += '<img src="/pixsignage/img/blank.png" class="imgthumb" width="100%" />';
				}
				touchpagehtml += '<div class="mask">';
				touchpagehtml += '<div>';
				touchpagehtml += '<h6 class="pixtitle" style="color:white;">' + aData.name + '</h6>';
				touchpagehtml += '<a class="btn default btn-sm green pix-plandtl-touchpage-add" href="javascript:;" data-id="' + iDisplayIndex + '"><i class="fa fa-plus"></i></a>';
				touchpagehtml += '</div>';
				touchpagehtml += '</div>';
				touchpagehtml += '</div>';

				touchpagehtml += '</div>';

				touchpagehtml += '</div>';
				if ((iDisplayIndex+1) % 6 == 0 || (iDisplayIndex+1) == $('#TouchpageTable').dataTable().fnGetData().length) {
					touchpagehtml += '</div>';
					if ((iDisplayIndex+1) != $('#TouchpageTable').dataTable().fnGetData().length) {
						touchpagehtml += '<hr/>';
					}
					$('#TouchpageContainer').append(touchpagehtml);
				}
				return nRow;
			},
			'fnDrawCallback': function(oSettings, json) {
				$('#TouchpageContainer .thumbs').each(function(i) {
					console.log($(this).parent().width());
					$(this).width($(this).parent().width());
					$(this).height($(this).parent().width());
				});
				$('#TouchpageContainer .mask').each(function(i) {
					$(this).width($(this).parent().parent().width() + 2);
					$(this).height($(this).parent().parent().width() + 2);
				});
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':TouchpageTree.branchid });
				aoData.push({'name':'touchflag','value':'1' });
				aoData.push({'name':'homeflag','value':'1' });
			}
		});
		$('#TouchpageTable_wrapper .dataTables_filter input').addClass("form-control input-medium"); 
		$('#TouchpageTable_wrapper .dataTables_length select').addClass("form-control input-small"); 
		$('#TouchpageTable').css('width', '100%');

		//SelectedDtlTable初始化
		$('#SelectedDtlTable').dataTable({
			'sDom' : 't',
			'iDisplayLength' : -1,
			'aoColumns' : [ {'sTitle' : '', 'bSortable' : false, 'sWidth' : '40px' }, 
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '80px' }, 
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '60px' }, 
							{'sTitle' : '', 'bSortable' : false, 'sClass': 'autowrap' }, 
							{'sTitle' : common.view.duration, 'bSortable' : false, 'sWidth' : '60px' },
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '30px' },
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '30px' }],
			'aoColumnDefs': [{'bSortable': false, 'aTargets': [ 0 ] }],
			'oLanguage' : { 'sZeroRecords' : common.view.empty,
							'sEmptyTable' : common.view.empty }, 
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(5)', nRow).html('<button index="' + iDisplayIndex + '" class="btn blue btn-xs pix-plandtl-update"><i class="fa fa-edit"></i></button>');
				$('td:eq(6)', nRow).html('<button index="' + iDisplayIndex + '" class="btn red btn-xs pix-plandtl-delete"><i class="fa fa-trash-o"></i></button>');
				return nRow;
			}
		});

		var DeviceTree = new BranchTree($('#DeviceTab'));
		$('#DeviceTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 20, 40, 60, 100 ],
							[ 20, 40, 60, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'device!list.action',
			'aoColumns' : [ {'sTitle' : common.view.terminalid, 'mData' : 'terminalid', 'bSortable' : false }, 
							{'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
							{'sTitle' : common.view.branch, 'mData' : 'branchid', 'bSortable' : false }, 
							{'sTitle' : '', 'mData' : 'deviceid', 'bSortable' : false }],
			'iDisplayLength' : 20,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(2)', nRow).html(aData.branch.name);
				$('td:eq(3)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-planbind-device-add">' + common.view.add + '</button>');
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':DeviceTree.branchid });
				aoData.push({'name':'devicegroupid','value':'0' });
			}
		});
		$('#DeviceTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#DeviceTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#DeviceTable').css('width', '100%');

		var DevicegroupTree = new BranchTree($('#DevicegroupTab'));
		$('#DevicegroupTable').dataTable({
			'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
			'aLengthMenu' : [ [ 20, 40, 60, 100 ],
							[ 20, 40, 60, 100 ] 
							],
			'bProcessing' : true,
			'bServerSide' : true,
			'sAjaxSource' : 'devicegroup!list.action',
			'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false, 'sWidth' : '10%' }, 
							{'sTitle' : common.view.detail, 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '80%' },
							{'sTitle' : '', 'mData' : 'devicegroupid', 'bSortable' : false, 'sWidth' : '10%' }],
			'iDisplayLength' : 10,
			'sPaginationType' : 'bootstrap',
			'oLanguage' : PixData.tableLanguage,
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				var listhtml = '';
				for (var i=0; i<aData.devices.length; i++) {
					listhtml += aData.devices[i].terminalid + ' ';
				}
				$('td:eq(1)', nRow).html(listhtml);
				$('td:eq(2)', nRow).html('<button data-id="' + iDisplayIndex + '" class="btn blue btn-xs pix-planbind-devicegroup-add">' + common.view.add + '</button>');
				return nRow;
			},
			'fnServerParams': function(aoData) { 
				aoData.push({'name':'branchid','value':DevicegroupTree.branchid });
				aoData.push({'name':'type','value':'1' });
			}
		});
		$('#DevicegroupTable_wrapper .dataTables_filter input').addClass('form-control input-small');
		$('#DevicegroupTable_wrapper .dataTables_length select').addClass('form-control input-small');
		$('#DevicegroupTable').css('width', '100%');

		//SelectedBindTable初始化
		$('#SelectedBindTable').dataTable({
			'sDom' : 't',
			'iDisplayLength' : -1,
			'aoColumns' : [ {'sTitle' : '', 'bSortable' : false, 'sWidth' : '40px' }, 
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '80px' }, 
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '80px' }, 
							{'sTitle' : '', 'bSortable' : false, 'sWidth' : '30px' }],
			'aoColumnDefs': [{'bSortable': false, 'aTargets': [ 0 ] }],
			'oLanguage' : { 'sZeroRecords' : common.view.empty,
							'sEmptyTable' : common.view.empty }, 
			'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
				$('td:eq(3)', nRow).html('<button index="' + iDisplayIndex + '" class="btn red btn-xs pix-planbind-delete"><i class="fa fa-trash-o"></i></button>');
				return nRow;
			}
		});

		$('#nav_tab1').click(function(event) {
			$('#BundleDiv').css('display', '');
			$('#TouchbundleDiv').css('display', 'none');
			$('#PageDiv').css('display', 'none');
			$('#TouchpageDiv').css('display', 'none');
			$('#BundleTable').dataTable()._fnAjaxUpdate();
		});
		$('#nav_tab2').click(function(event) {
			$('#BundleDiv').css('display', 'none');
			$('#TouchbundleDiv').css('display', '');
			$('#PageDiv').css('display', 'none');
			$('#TouchpageDiv').css('display', 'none');
			$('#TouchbundleTable').dataTable()._fnAjaxUpdate();
		});
		$('#nav_tab3').click(function(event) {
			$('#BundleDiv').css('display', 'none');
			$('#TouchbundleDiv').css('display', 'none');
			$('#PageDiv').css('display', '');
			$('#TouchpageDiv').css('display', 'none');
			$('#PageTable').dataTable()._fnAjaxUpdate();
		});
		$('#nav_tab4').click(function(event) {
			$('#BundleDiv').css('display', 'none');
			$('#TouchbundleDiv').css('display', 'none');
			$('#PageDiv').css('display', 'none');
			$('#TouchpageDiv').css('display', '');
			$('#TouchpageTable').dataTable()._fnAjaxUpdate();
		});

		//增加Bundle到SelectedDtlTable
		$('body').on('click', '.pix-plandtl-bundle-add', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			var data = $('#BundleTable').dataTable().fnGetData(rowIndex);
			var plandtl = {};
			plandtl.plandtlid = 0;
			plandtl.planid = CurrentPlan.planid;
			plandtl.objtype = 1;
			plandtl.objid = data.bundleid;
			plandtl.bundle = data;
			plandtl.sequence = CurrentPlandtls.length + 1;
			plandtl.maxtimes = 0;
			plandtl.duration = 0;
			CurrentPlandtls.push(plandtl);
			refreshSelectedDtlTable();
		});
		//增加Touchbundle到SelectedDtlTable
		$('body').on('click', '.pix-plandtl-touchbundle-add', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			var data = $('#TouchbundleTable').dataTable().fnGetData(rowIndex);
			var plandtl = {};
			plandtl.plandtlid = 0;
			plandtl.planid = CurrentPlan.planid;
			plandtl.objtype = 1;
			plandtl.objid = data.bundleid;
			plandtl.bundle = data;
			plandtl.sequence = CurrentPlandtls.length + 1;
			plandtl.maxtimes = 0;
			plandtl.duration = 0;
			CurrentPlandtls.push(plandtl);
			refreshSelectedDtlTable();
		});
		//增加Page到SelectedDtlTable
		$('body').on('click', '.pix-plandtl-page-add', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			var data = $('#PageTable').dataTable().fnGetData(rowIndex);
			var plandtl = {};
			plandtl.plandtlid = 0;
			plandtl.planid = CurrentPlan.planid;
			plandtl.objtype = 2;
			plandtl.objid = data.pageid;
			plandtl.page = data;
			plandtl.sequence = CurrentPlandtls.length + 1;
			plandtl.maxtimes = 0;
			plandtl.duration = 60;
			CurrentPlandtls.push(plandtl);
			refreshSelectedDtlTable();
		});
		//增加Touchpage到SelectedDtlTable
		$('body').on('click', '.pix-plandtl-touchpage-add', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			var data = $('#TouchpageTable').dataTable().fnGetData(rowIndex);
			var plandtl = {};
			plandtl.plandtlid = 0;
			plandtl.planid = CurrentPlan.planid;
			plandtl.objtype = 2;
			plandtl.objid = data.pageid;
			plandtl.page = data;
			plandtl.sequence = CurrentPlandtls.length + 1;
			plandtl.maxtimes = 0;
			plandtl.duration = 60;
			CurrentPlandtls.push(plandtl);
			refreshSelectedDtlTable();
		});
		$('body').on('click', '.pix-plandtl-update', function(event) {
			var index = $(event.target).attr('index');
			if (index == undefined) {
				index = $(event.target).parent().attr('index');
			}
			CurrentPlandtl = CurrentPlandtls[index];
			var formHandler = new FormHandler($('#PlandtlForm'));
			formHandler.validateOption.rules = {};
			if (CurrentPlandtl.duration == 0) {
				$('#PlandtlForm .plandtl-duration').css('display', 'none');
			} else {
				formHandler.validateOption.rules['duration'] = {};
				formHandler.validateOption.rules['duration']['required'] = true;
				formHandler.validateOption.rules['duration']['number'] = true;
				$('#PlandtlForm .plandtl-duration').css('display', '');
			}
			$('#PlandtlForm').validate(formHandler.validateOption);

			$('#PlandtlForm input[name=duration]').val(CurrentPlandtl.duration);
			$('#PlandtlModal').modal();
		});
		$('[type=submit]', $('#PlandtlModal')).on('click', function(event) {
			if ($('#PlandtlForm').valid()) {
				CurrentPlandtl.duration = $('#PlandtlForm input[name=duration]').val();
				$('#PlandtlModal').modal('hide');
				refreshSelectedDtlTable();
			}
		});
		//删除SelectedDtlTable
		$('body').on('click', '.pix-plandtl-delete', function(event) {
			var index = $(event.target).attr('index');
			if (index == undefined) {
				index = $(event.target).parent().attr('index');
			}
			for (var i=index; i<CurrentPlandtls.length; i++) {
				CurrentPlandtls[i].sequence = i;
			}
			CurrentPlandtls.splice(index, 1);
			refreshSelectedDtlTable();
		});

		$('#nav_dtab1').click(function(event) {
			$('#DeviceDiv').css('display', '');
			$('#DevicegroupDiv').css('display', 'none');
			$('#DeviceTable').dataTable()._fnAjaxUpdate();
		});
		$('#nav_dtab2').click(function(event) {
			$('#DeviceDiv').css('display', 'none');
			$('#DevicegroupDiv').css('display', '');
			$('#DevicegroupTable').dataTable()._fnAjaxUpdate();
		});
		//增加Device到SelectedBindTable
		$('body').on('click', '.pix-planbind-device-add', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			var data = $('#DeviceTable').dataTable().fnGetData(rowIndex);
			if (CurrentPlanbinds.filter(function (el) {
				return el.bindtype == 1 && el.bindid == data.deviceid;
			}).length > 0) {
				return;
			}
			var planbind = {};
			planbind.planbindid = 0;
			planbind.planid = CurrentPlan.planid;
			planbind.bindtype = 1;
			planbind.bindid = data.deviceid;
			planbind.device = data;
			CurrentPlanbinds.push(planbind);
			refreshSelectedBindTable();
		});
		//增加Devicegroup到SelectedBindTable
		$('body').on('click', '.pix-planbind-devicegroup-add', function(event) {
			var rowIndex = $(event.target).attr("data-id");
			if (rowIndex == undefined) {
				rowIndex = $(event.target).parent().attr('data-id');
			}
			var data = $('#DevicegroupTable').dataTable().fnGetData(rowIndex);
			if (CurrentPlanbinds.filter(function (el) {
				return el.bindtype == 2 && el.bindid == data.devicegroupid;
			}).length > 0) {
				return;
			}

			var planbind = {};
			planbind.planbindid = 0;
			planbind.planid = CurrentPlan.planid;
			planbind.bindtype = 2;
			planbind.bindid = data.devicegroupid;
			planbind.devicegroup = data;
			CurrentPlanbinds.push(planbind);
			refreshSelectedBindTable();
		});
		//删除SelectedBindTable
		$('body').on('click', '.pix-planbind-delete', function(event) {
			var index = $(event.target).attr('index');
			if (index == undefined) {
				index = $(event.target).parent().attr('index');
			}
			CurrentPlanbinds.splice(index, 1);
			refreshSelectedBindTable();
		});

		function initWizard() {
			initTab1();
			initTab2();
			initTab3();
			initData1();
			
			var handleTitle = function(tab, navigation, index) {
				var total = navigation.find('li').length;
				var current = index + 1;
				$('.step-title', $('#MyWizard')).text('Step ' + (index + 1) + ' of ' + total);
				jQuery('li', $('#MyWizard')).removeClass('done');
				var li_list = navigation.find('li');
				for (var i = 0; i < index; i++) {
					jQuery(li_list[i]).addClass('done');
				}
				if (current == 1) {
					$('#MyWizard').find('.button-previous').hide();
				} else {
					$('#MyWizard').find('.button-previous').show();
				}
				if (current >= total) {
					$('#MyWizard').find('.button-next').hide();
					$('#MyWizard').find('.button-submit').show();
				} else {
					$('#MyWizard').find('.button-next').show();
					$('#MyWizard').find('.button-submit').hide();
				}
				Metronic.scrollTo($('.page-title'));
				$('.form-group').removeClass('has-error');
			};

			// default form wizard
			$('#MyWizard').bootstrapWizard({
				'nextSelector': '.button-next',
				'previousSelector': '.button-previous',
				onTabClick: function (tab, navigation, index, clickedIndex) {
					if ((clickedIndex-index)>1) {
						return false;
					}
					if (index == 0 && clickedIndex == 1) {
						if (validPlanOption()) {
							initData2();
						} else {
							return false;
						}
					} else if (index == 1 && clickedIndex == 2) {
						if (validPlandtl()) {
							initData3();
						} else {
							return false;
						}
					} 
				},
				onNext: function (tab, navigation, index) {
					if (index == 1) {
						if (validPlanOption()) {
							initData2();
						} else {
							return false;
						}
					} else if (index == 2) {
						if (validPlandtl()) {
							initData3();
						} else {
							return false;
						}
					}
				},
				onPrevious: function (tab, navigation, index) {
				},
				onTabShow: function (tab, navigation, index) {
					handleTitle(tab, navigation, index);
					if (index == 1) {
						$('#BundleTable').dataTable()._fnAjaxUpdate();
						$('#PageTable').dataTable()._fnAjaxUpdate();
					} else if (index == 2) {
					}
				}
			});

			$('#MyWizard').find('.button-previous').hide();
			$('#MyWizard .button-submit').click(function () {
				if (validPlanbind()) {
					submitData();
				}
			}).hide();
			
			$('#MyWizard').bootstrapWizard('first');
		}

		function initTab1() {
			$('input[name="plan.startdate.unlimited"]').click(function(e) {
				if ($('input[name="plan.startdate.unlimited"]').attr('checked')) {
					$('input[name="plan.startdate"]').parent().css('display', 'none');
				} else {
					$('input[name="plan.startdate"]').parent().css('display', '');
					$('input[name="plan.startdate"]').val(new Date().format('yyyy') + '-' + new Date().format('MM') + '-' + new Date().format('dd'));
				}
			});  
			$('input[name="plan.enddate.unlimited"]').click(function(e) {
				if ($('input[name="plan.enddate.unlimited"]').attr('checked')) {
					$('input[name="plan.enddate"]').parent().css('display', 'none');
				} else {
					$('input[name="plan.enddate"]').parent().css('display', '');
					$('input[name="plan.enddate"]').val(new Date().format('yyyy') + '-' + new Date().format('MM') + '-' + new Date().format('dd'));
				}
			});  
			$('input[name="plan.fulltime"]').click(function(e) {
				if ($('input[name="plan.fulltime"]').attr('checked')) {
					$('input[name="plan.starttime"]').parent().css('display', 'none');
					$('input[name="plan.endtime"]').parent().css('display', 'none');
				} else {
					$('input[name="plan.starttime"]').parent().css('display', '');
					$('input[name="plan.endtime"]').parent().css('display', '');
					$('input[name="plan.starttime"]').val('00:00:00');
					$('input[name="plan.endtime"]').val('00:00:00');
				}
			});  
		}

		function initData1() {
			var formdata = new Object();
			for (var name in CurrentPlan) {
				formdata['plan.' + name] = CurrentPlan[name];
			}
			$('#PlanOptionForm').loadJSON(formdata);
			if (CurrentPlan.startdate == '1970-01-01') {
				$('input[name="plan.startdate.unlimited"]').attr('checked', 'checked');
				$('input[name="plan.startdate.unlimited"]').parent().addClass('checked');
				$('input[name="plan.startdate"]').parent().css('display', 'none');
			} else {
				$('input[name="plan.startdate.unlimited"]').removeAttr('checked');
				$('input[name="plan.startdate.unlimited"]').parent().removeClass('checked');
				$('input[name="plan.startdate"]').parent().css('display', '');
				$('input[name="plan.startdate"]').val(CurrentPlan.startdate);
			}
			if (CurrentPlan.enddate == '2037-01-01') {
				$('input[name="plan.enddate.unlimited"]').attr('checked', 'checked');
				$('input[name="plan.enddate.unlimited"]').parent().addClass('checked');
				$('input[name="plan.enddate"]').parent().css('display', 'none');
			} else {
				$('input[name="plan.enddate.unlimited"]').removeAttr('checked');
				$('input[name="plan.enddate.unlimited"]').parent().removeClass('checked');
				$('input[name="plan.enddate"]').parent().css('display', '');
				$('input[name="plan.enddate"]').val(CurrentPlan.enddate);
			}
			if (CurrentPlan.starttime == '00:00:00' && CurrentPlan.endtime == '00:00:00') {
				$('input[name="plan.fulltime"]').attr('checked', 'checked');
				$('input[name="plan.fulltime"]').parent().addClass('checked');
				$('input[name="plan.starttime"]').parent().css('display', 'none');
				$('input[name="plan.endtime"]').parent().css('display', 'none');
			} else {
				$('input[name="plan.fulltime"]').removeAttr('checked');
				$('input[name="plan.fulltime"]').parent().removeClass('checked');
				$('input[name="plan.starttime"]').parent().css('display', '');
				$('input[name="plan.endtime"]').parent().css('display', '');
				$('input[name="plan.starttime"]').val(CurrentPlan.starttime);
				$('input[name="plan.endtime"]').val(CurrentPlan.endtime);
			}
		}

		function initTab2() {
		}

		function initData2() {
			$('.bundle-ctrl').css('display', BundleCtrl?'':'none');
			$('.page-ctrl').css('display', PageCtrl?'':'none');
			if (BundleCtrl) {
				$('#nav_tab1').addClass('active');
				$('#BundleDiv').css('display', '');
				$('#PageDiv').css('display', 'none');
				$('#BundleTable').dataTable()._fnAjaxUpdate();
			} else if (PageCtrl) {
				$('#nav_tab3').addClass('active');
				$('#PageDiv').css('display', '');
				$('#BundleDiv').css('display', 'none');
				$('#PageTable').dataTable()._fnAjaxUpdate();
			}
			if (!TouchCtrl) {
				$('.touch-ctrl').css('display', 'none');
			}
			refreshSelectedDtlTable();
		}

		function initTab3() {
		}

		function initData3() {
			$('#DeviceTable').dataTable()._fnAjaxUpdate();
			$('#DevicegroupTable').dataTable()._fnAjaxUpdate();
			refreshSelectedBindTable();
		}

		function submitData() {
			if (_submitflag) {
				return;
			}
			_submitflag = true;
			Metronic.blockUI({
				zIndex: 20000,
				animate: true
			});
			
			for (var i=0; i<CurrentPlandtls.length; i++) {
				CurrentPlandtls[i].bundle = undefined;
				CurrentPlandtls[i].page = undefined;
			}
			for (var i=0; i<CurrentPlanbinds.length; i++) {
				CurrentPlanbinds[i].device = undefined;
				CurrentPlanbinds[i].devicegroup = undefined;
			}
			CurrentPlan.plandtls = CurrentPlandtls;
			CurrentPlan.planbinds = CurrentPlanbinds;
			
			$.ajax({
				type : 'POST',
				url : 'plan!design.action',
				data : '{"plan":' + $.toJSON(CurrentPlan) + '}',
				dataType : 'json',
				contentType : 'application/json;charset=utf-8',
				success : function(data, status) {
					_submitflag = false;
					Metronic.unblockUI();
					$('#PlanModal').modal('hide');
					if (data.errorcode == 0) {
						bootbox.alert(common.tips.success);
						$('#PlanTable').dataTable()._fnAjaxUpdate();
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					_submitflag = false;
					Metronic.unblockUI();
					$('#PlanModal').modal('hide');
					console.log('failue');
				}
			});
		}

		function validPlanOption() {
			if (CurrentPlan.planid == 0) {
				CurrentPlan.gridlayoutcode = $('input[name="plan.gridlayoutcode"]:checked').val();
				CurrentPlandtls = [];
				CurrentPlanbinds = [];
			}
			if ($('input[name="plan.startdate.unlimited"]').attr('checked')) {
				CurrentPlan.startdate = '1970-01-01';
			} else {
				CurrentPlan.startdate = $('input[name="plan.startdate"]').val();
			}
			if ($('input[name="plan.enddate.unlimited"]').attr('checked')) {
				CurrentPlan.enddate = '2037-01-01';
			} else {
				CurrentPlan.enddate = $('input[name="plan.enddate"]').val();
			}
			if ($('input[name="plan.fulltime"]').attr('checked')) {
				CurrentPlan.starttime = '00:00:00';
				CurrentPlan.endtime = '00:00:00';
			} else {
				CurrentPlan.starttime = $('input[name="plan.starttime"]').val();
				CurrentPlan.endtime = $('input[name="plan.endtime"]').val();
			}
			if (parseInt(CurrentPlan.startdate.replace(/\-/g,'')) > parseInt(CurrentPlan.enddate.replace(/\-/g,''))) {
				bootbox.alert(common.tips.date_error);
				return false;
			}
			return true;
		}

		function validPlandtl() {
			if (CurrentPlandtls.length == 0) {
				bootbox.alert(common.tips.plandtl_zero);
				return false;
			}
			return true;
		}

		function validPlanbind() {
			if (CurrentPlanbinds.length == 0) {
				bootbox.alert(common.tips.planbind_zero);
				return false;
			}
			return true;
		}

		function refreshSelectedDtlTable() {
			$('#SelectedDtlTable').dataTable().fnClearTable();
			for (var i=0; i<CurrentPlandtls.length; i++) {
				var plandtl = CurrentPlandtls[i];
				var mediatype = '';
				var thumbwidth = 100;
				var thumbnail = '';
				var thumbhtml = '';
				var medianame = '';

				if (plandtl.objtype == 1) {
					if (plandtl.bundle.snapshot != null) {
						thumbwidth = plandtl.bundle.width > plandtl.bundle.height? 100 : 100*plandtl.bundle.width/plandtl.bundle.height;
						thumbnail = '/pixsigdata' + plandtl.bundle.snapshot + '?t=' + timestamp;
					} else {
						thumbnail = '/pixsignage/img/blank.png';
					}
					mediatype = common.view.solopage;
					medianame = plandtl.bundle.name;
					if (plandtl.bundle.touchflag == 0) {
						mediatype = common.view.bundle;
					} else if (plandtl.bundle.touchflag == 1) {
						mediatype = common.view.touchbundle;
					}
				} else if (plandtl.objtype == 2) {
					if (plandtl.page.snapshot != null) {
						thumbwidth = plandtl.page.width > plandtl.page.height? 100 : 100*plandtl.page.width/plandtl.page.height;
						thumbnail = '/pixsigdata' + plandtl.page.snapshot + '?t=' + timestamp;
					} else {
						thumbnail = '/pixsignage/img/blank.png';
					}
					mediatype = common.view.solopage;
					medianame = plandtl.page.name;
					if (plandtl.page.touchflag == 0) {
						mediatype = common.view.solopage;
					} else if (plandtl.page.touchflag == 1) {
						mediatype = common.view.touchpage;
					}
				}
				if (thumbnail != '') {
					thumbhtml = '<div class="thumbs" style="width:40px; height:40px;"><img src="' + thumbnail + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + medianame + '"></div>';
				}
				var duration = plandtl.duration > 0? PixData.transferIntToTime(plandtl.duration) : '-';
				$('#SelectedDtlTable').dataTable().fnAddData([plandtl.sequence, mediatype, thumbhtml, medianame, duration, 0, 0]);
			}
		}

		function refreshSelectedBindTable() {
			$('#SelectedBindTable').dataTable().fnClearTable();
			for (var i=0; i<CurrentPlanbinds.length; i++) {
				var planbind = CurrentPlanbinds[i];
				var bindtype = '';
				var bindname = '';

				if (planbind.bindtype == 1) {
					bindtype = common.view.device;
					bindname = planbind.device.terminalid;
				} else if (planbind.bindtype == 2) {
					bindtype = common.view.devicegroup;
					bindname = planbind.devicegroup.name;
				}
				$('#SelectedBindTable').dataTable().fnAddData([(i+1), bindtype, bindname, 0]);
			}
		}

		$('.form_time').datetimepicker({
			autoclose: true,
			isRTL: Metronic.isRTL(),
			format: 'hh:ii:ss',
			pickerPosition: (Metronic.isRTL() ? 'top-right' : 'top-left'),
			language: 'zh-CN',
			minuteStep: 5,
			startView: 1,
			maxView: 1,
			formatViewType: 'time'
		});
		$('.form_date').datetimepicker({
			autoclose: true,
			isRTL: Metronic.isRTL(),
			format: 'yyyy-mm-dd',
			pickerPosition: (Metronic.isRTL() ? 'top-right' : 'top-left'),
			language: 'zh-CN',
			minView: 'month',
			todayBtn: true
		});
	}
	
	return {
		init: init,
		refresh: refresh,
	}
	
}();
