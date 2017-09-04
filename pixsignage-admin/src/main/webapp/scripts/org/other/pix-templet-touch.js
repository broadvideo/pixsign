var myurls = {
	'templet.list' : 'templet!list.action',
	'templet.add' : 'templet!add.action',
	'templet.update' : 'templet!update.action',
	'templet.delete' : 'templet!delete.action',
	'templet.design' : 'templet!design.action',
	'image.list' : 'image!list.action',
};

var CurrentTempletid = 0;
var CurrentTemplet;
var CurrentTempletdtl;
var CurrentSubTemplets;

var CurrentMediaBranchid;
var CurrentMediaFolderid;

$(window).resize(function(e) {
	if (CurrentTemplet != null && e.target == this) {
		var width = Math.floor($('#LayoutDiv').parent().width());
		var scale = CurrentTemplet.width / width;
		var height = CurrentTemplet.height / scale;
		$('#LayoutDiv').css('width', width);
		$('#LayoutDiv').css('height', height);

		var width = Math.floor($('#BundleDiv').parent().width());
		var scale = CurrentTemplet.width / width;
		var height = CurrentTemplet.height / scale;
		$('#BundleDiv').css('width', width);
		$('#BundleDiv').css('height', height);
	}
});

$("#MyTable thead").css("display", "none");
$("#MyTable tbody").css("display", "none");
$('#MyTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 10, 20, 30, 40 ],
						[ 10, 20, 30, 40 ] 
						],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : myurls['templet.list'],
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'templetid', 'bSortable' : false }],
	'iDisplayLength' : 10,
	'sPaginationType' : 'bootstrap',
	'oLanguage' : DataTableLanguage,
	'fnPreDrawCallback': function (oSettings) {
		if ($('#TempletContainer').length < 1) {
			$('#MyTable').append('<div id="TempletContainer"></div>');
		}
		$('#TempletContainer').html(''); 
		return true;
	},
	'fnRowCallback': function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		var templethtml = '';
		templethtml += '<div class="row" >';
		templethtml += '<div class="col-md-12 col-xs-12">';
		templethtml += '<h3 class="pixtitle">' + aData.name + '</h3>';
		templethtml += '<div privilegeid="101010">';
		templethtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-sm yellow pix-subtemplet-add"><i class="fa fa-plus"></i> ' + common.view.subtemplet + '</a>';
		//templethtml += '<a href="templet!export.action?templetid=' + aData.templetid + '" data-id="' + iDisplayIndex + '" class="btn default btn-sm green pix-export"><i class="fa fa-download"></i> ' + common.view.export + '</a>';
		templethtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-sm red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a> </div>';
		templethtml += '</div>';
		templethtml += '</div>';

		templethtml += '<div class="row" >';
		templethtml += '<div class="col-md-4 col-xs-6">';
		templethtml += '<a href="javascript:;" templetid="' + aData.templetid + '" class="fancybox">';
		templethtml += '<div class="thumbs">';
		if (aData.snapshot != null) {
			var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
			templethtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		}
		templethtml += '</div></a>';
		templethtml += '<div privilegeid="101010">';
		templethtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-templet"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
		templethtml += '</div>';
		templethtml += '</div>';
		templethtml += '<div class="col-md-8 col-xs-6">';
		for (var i=0; i<aData.subtemplets.length; i++) {
			if (i % 4 == 0) {
				templethtml += '<div class="row" >';
			}
			templethtml += '<div class="col-md-3 col-xs-3">';
			templethtml += '<h5 class="pixtitle">' + aData.subtemplets[i].name + '</h5>';
			templethtml += '<a href="javascript:;" templetid="' + aData.subtemplets[i].templetid + '" sub-id="' + i + '" class="fancybox">';
			templethtml += '<div class="thumbs">';
			if (aData.subtemplets[i].snapshot != null) {
				var subthumbwidth = aData.subtemplets[i].width > aData.subtemplets[i].height? 100 : 100*aData.subtemplets[i].width/aData.subtemplets[i].height;
				templethtml += '<img src="/pixsigdata' + aData.subtemplets[i].snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + subthumbwidth + '%" />';
			}
			templethtml += '</div></a>';
			templethtml += '<div privilegeid="101010">';
			templethtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" sub-id="' + i + '" class="btn default btn-xs blue pix-templet"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
			templethtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" sub-id="' + i + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>';
			templethtml += '</div>';
			templethtml += '</div>';
			if ((i+1) % 4 == 0 || (i+1) == aData.subtemplets.length) {
				templethtml += '</div>';
			}
			
		}
		templethtml += '</div>';
		templethtml += '</div>';

		templethtml += '<hr/>';
		$('#TempletContainer').append(templethtml);
		return nRow;
	},
	'fnDrawCallback': function(oSettings, json) {
		$('.thumbs').each(function(i) {
			$(this).width($(this).parent().closest('div').width());
			$(this).height($(this).parent().closest('div').width());
		});
		$('.fancybox').each(function(index,item) {
			$(this).click(function() {
				var templetid = $(this).attr('templetid');
				$.ajax({
					type : 'GET',
					url : 'templet!get.action',
					data : {templetid: templetid},
					success : function(data, status) {
						if (data.errorcode == 0) {
							$.fancybox({
								openEffect	: 'none',
								closeEffect	: 'none',
								closeBtn : false,
						        padding : 0,
						        content: '<div id="TempletPreview"></div>',
						    });
							redrawTempletPreview($('#TempletPreview'), data.templet, 800, 1);
						} else {
							bootbox.alert(common.tips.error + data.errormsg);
						}
					},
					error : function() {
						console.log('failue');
					}
				});
			    return false;
			})
		});
	},
	'fnServerParams': function(aoData) { 
		aoData.push({'name':'touchflag','value':'1' });
		aoData.push({'name':'homeflag','value':'1' });
	}
});
jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').select2();


function refreshFromTempletTable() {
	var width = 100/(CurrentSubTemplets.length+1);
	var fromTempletTableHtml = '';
	fromTempletTableHtml += '<tr>';
	fromTempletTableHtml += '<td style="padding: 0px 20px 0px 0px;" width="' + width + '%">';
	fromTempletTableHtml += '<div class="thumbs" style="width:100px; height:100px;">';
	fromTempletTableHtml += '</div></td>';
	for (var i=0; i<CurrentSubTemplets.length; i++) {
		var fromtemplet = CurrentSubTemplets[i];
		fromTempletTableHtml += '<td style="padding: 0px 20px 0px 0px;" width="' + width + '%">';
		fromTempletTableHtml += '<a href="javascript:;" fromtempletid="' + fromtemplet.templetid + '" class="fancybox">';
		fromTempletTableHtml += '<div class="thumbs" style="width:100px; height:100px;">';
		if (fromtemplet.snapshot != null) {
			var thumbwidth = fromtemplet.width > fromtemplet.height? 100 : 100*fromtemplet.width/fromtemplet.height;
			fromTempletTableHtml += '<img src="/pixsigdata' + fromtemplet.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + fromtemplet.name + '" />';
		}
		fromTempletTableHtml += '</div></a></td>';
	}
	fromTempletTableHtml += '</tr>';
	fromTempletTableHtml += '<tr>';
	fromTempletTableHtml += '<td>';
	fromTempletTableHtml += '<label class="radio-inline">';
	fromTempletTableHtml += '<input type="radio" name="fromtempletid" value="0" checked>';
	fromTempletTableHtml += common.view.blank + '</label>';
	fromTempletTableHtml += '</td>';
	for (var i=0; i<CurrentSubTemplets.length; i++) {
		var fromtemplet = CurrentSubTemplets[i];
		fromTempletTableHtml += '<td>';
		fromTempletTableHtml += '<label class="radio-inline">';
		fromTempletTableHtml += '<input type="radio" name="fromtempletid" value="' + fromtemplet.templetid + '">';
		fromTempletTableHtml += fromtemplet.name + '</label>';
		fromTempletTableHtml += '</td>';
	}
	fromTempletTableHtml += '</tr>';
	$('#FromTempletTable').html(fromTempletTableHtml);
	$('#FromTempletTable').width(120 * (CurrentSubTemplets.length+1));

	$('#FromTempletTable .fancybox').each(function(index,item) {
		$(this).click(function() {
			var templetid = $(this).attr('fromtempletid');
			$.ajax({
				type : 'GET',
				url : 'templet!get.action',
				data : {templetid: templetid},
				success : function(data, status) {
					if (data.errorcode == 0) {
						$.fancybox({
							openEffect	: 'none',
							closeEffect	: 'none',
							closeBtn : false,
							padding : 0,
							content: '<div id="TempletPreview"></div>',
						});
						redrawTempletPreview($('#TempletPreview'), data.templet, 800, 1);
					} else {
						bootbox.alert(common.tips.error + data.errormsg);
					}
				},
				error : function() {
					console.log('failue');
				}
			});
			return false;
		})
	});
}


OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();

FormValidateOption.rules = {};
FormValidateOption.rules['homeidletime'] = {};
FormValidateOption.rules['homeidletime']['required'] = true;
FormValidateOption.rules['homeidletime']['number'] = true;
FormValidateOption.submitHandler = null;
$('#TempletOptionForm').validate(FormValidateOption);

$('body').on('click', '.pix-add', function(event) {
	var action = myurls['templet.add'];
	refreshForm('MyEditForm');
	$('#MyEditForm').attr('action', action);
	CurrentTemplet = null;
	CurrentTempletid = 0;
	$('#MyEditModal').modal();
});			
$('[type=submit]', $('#MyEditModal')).on('click', function(event) {
	if ($('#MyEditForm').valid()) {
		$.ajax({
			type : 'POST',
			url : $('#MyEditForm').attr('action'),
			data : $('#MyEditForm').serialize(),
			success : function(data, status) {
				if (data.errorcode == 0) {
					$('#MyEditModal').modal('hide');
					bootbox.alert(common.tips.success);
					$('#MyTable').dataTable()._fnAjaxUpdate();
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

$('body').on('click', '.pix-subtemplet-add', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentTemplet = $('#MyTable').dataTable().fnGetData(index);
	CurrentTempletid = CurrentTemplet.templetid;
	CurrentSubTemplets = CurrentTemplet.subtemplets;
	var formdata = new Object();
	formdata['templet.name'] = '';
	formdata['templet.hometempletid'] = CurrentTempletid;
	formdata['templet.homeflag'] = '0';
	formdata['templet.ratio'] = CurrentTemplet.ratio;
	$('#SubtempletForm').loadJSON(formdata);
	refreshFromTempletTable();
	$('#SubtempletModal').modal();
});			
$('[type=submit]', $('#SubtempletModal')).on('click', function(event) {
	$.ajax({
		type : 'POST',
		url : myurls['templet.add'],
		data : $('#SubtempletForm').serialize(),
		success : function(data, status) {
			if (data.errorcode == 0) {
				$('#SubtempletModal').modal('hide');
				bootbox.alert(common.tips.success);
				$('#MyTable').dataTable()._fnAjaxUpdate();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			console.log('failue');
		}
	});
});


$('body').on('click', '.pix-delete', function(event) {
	var index = $(event.target).attr('data-id');
	var subid = $(event.target).attr('sub-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
		subid = $(event.target).parent().attr('sub-id');
	}
	CurrentTemplet = $('#MyTable').dataTable().fnGetData(index);
	var templetid = CurrentTemplet.templetid;
	var name = CurrentTemplet.name;
	CurrentSubTemplets = CurrentTemplet.subtemplets;
	if (subid != undefined) {
		templetid = CurrentTemplet.subtemplets[subid].templetid;
		name = CurrentTemplet.subtemplets[subid].name;
	}

	bootbox.confirm(common.tips.remove + name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : myurls['templet.delete'],
				cache: false,
				data : {
					'templet.templetid': templetid
				},
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#MyTable').dataTable()._fnAjaxUpdate();
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


//在列表页面中点击内容包设计
$('body').on('click', '.pix-templet', function(event) {
	var index = $(event.target).attr('data-id');
	var subid = $(event.target).attr('sub-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
		subid = $(event.target).parent().attr('sub-id');
	}
	CurrentTemplet = $('#MyTable').dataTable().fnGetData(index);
	var templetid = CurrentTemplet.templetid;
	CurrentSubTemplets = CurrentTemplet.subtemplets;
	if (subid != undefined) {
		templetid = CurrentTemplet.subtemplets[subid].templetid;
	}

	$.ajax({
		type : 'GET',
		url : 'templet!get.action',
		data : {templetid: templetid},
		success : function(data, status) {
			if (data.errorcode == 0) {
				CurrentTemplet = data.templet;
				CurrentTempletid = CurrentTemplet.templetid;
				CurrentTempletdtl = CurrentTemplet.templetdtls[0];
				for (var i=0; i<CurrentTemplet.templetdtls.length; i++) {
					var templetdtl = CurrentTemplet.templetdtls[i];
					if (templetdtl.medialist == null) {
						templetdtl.medialist = {};
						templetdtl.medialist.medialistid = 0;
						templetdtl.medialist.medialistdtls = [];
						templetdtl.medialist.type = 0;
					}
					if (templetdtl.text == null) {
						templetdtl.text = {};
						templetdtl.text.textid = 0;
						templetdtl.text.type = 0;
					}
					if (templetdtl.widget == null) {
						templetdtl.widget = {};
						templetdtl.widget.widgetid = 0;
						templetdtl.widget.type = 0;
					}
					if (templetdtl.rss == null) {
						templetdtl.rss = {};
						templetdtl.rss.rssid = 0;
						templetdtl.rss.type = 0;
					}
				}
				
				initWizard();
				$('#TempletModal').modal();
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
		},
		error : function() {
			console.log('failue');
		}
	});	
});

