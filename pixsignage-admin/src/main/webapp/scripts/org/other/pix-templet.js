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
var templethtml = '';
$('#MyTable').dataTable({
	'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
	'aLengthMenu' : [ [ 16, 36, 72, 108 ],
						[ 16, 36, 72, 108 ] 
						],
	'bProcessing' : true,
	'bServerSide' : true,
	'sAjaxSource' : myurls['templet.list'],
	'aoColumns' : [ {'sTitle' : common.view.name, 'mData' : 'name', 'bSortable' : false }, 
					{'sTitle' : common.view.operation, 'mData' : 'templetid', 'bSortable' : false }],
	'iDisplayLength' : 16,
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
		if (iDisplayIndex % 4 == 0) {
			templethtml = '';
			templethtml += '<div class="row" >';
		}
		templethtml += '<div class="col-md-3 col-xs-3">';
		templethtml += '<h3 class="pixtitle">' + aData.name + '</h3>';

		templethtml += '<a href="javascript:;" templetid="' + aData.templetid + '" class="fancybox">';
		templethtml += '<div class="thumbs">';
		if (aData.snapshot != null) {
			var thumbwidth = aData.width > aData.height? 100 : 100*aData.width/aData.height;
			templethtml += '<img src="/pixsigdata' + aData.snapshot + '?t=' + new Date().getTime() + '" class="imgthumb" width="' + thumbwidth + '%" alt="' + aData.name + '" />';
		}
		templethtml += '</div></a>';

		templethtml += '<div privilegeid="101010">';
		templethtml += '<a href="javascript:;" templetid="' + aData.templetid + '" class="btn default btn-xs blue pix-templet"><i class="fa fa-stack-overflow"></i> ' + common.view.design + '</a>';
		if (aData.reviewflag == 1) {
			templethtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-push"><i class="fa fa-desktop"></i> ' + common.view.device + '</a>';
			templethtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-sync"><i class="fa fa-rss"></i> ' + common.view.sync + '</a>';
			templethtml += '<a href="templet!export.action?templetid=' + aData.templetid + '" data-id="' + iDisplayIndex + '" class="btn default btn-xs green pix-export"><i class="fa fa-download"></i> ' + common.view.export + '</a>';
		}
		templethtml += '<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a> </div>';

		templethtml += '</div>';
		if ((iDisplayIndex+1) % 4 == 0 || (iDisplayIndex+1) == $('#MyTable').dataTable().fnGetData().length) {
			templethtml += '</div>';
			if ((iDisplayIndex+1) != $('#MyTable').dataTable().fnGetData().length) {
				templethtml += '<hr/>';
			}
			$('#TempletContainer').append(templethtml);
		}
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
		aoData.push({'name':'touchflag','value':'0' });
	}
});
jQuery('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
jQuery('#MyTable_wrapper .dataTables_length select').select2();

OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
FormValidateOption.rules['templet.name'] = {};
FormValidateOption.rules['templet.name']['required'] = true;
FormValidateOption.submitHandler = function(form) {
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
};
$('#MyEditForm').validate(FormValidateOption);

$('[type=submit]', $('#MyEditModal')).on('click', function(event) {
	if ($('#MyEditForm').valid()) {
		$('#MyEditForm').submit();
	}
});

$('body').on('click', '.pix-add', function(event) {
	var action = myurls['templet.add'];
	refreshForm('MyEditForm');
	$('#MyEditForm').attr('action', action);
	$('.templet-layout').css('display', 'block');
	CurrentTemplet = null;
	CurrentTempletid = 0;
	refreshLayoutBgImageSelect1();
	$('#MyEditModal').modal();
});			


$('body').on('click', '.pix-delete', function(event) {
	var index = $(event.target).attr('data-id');
	if (index == undefined) {
		index = $(event.target).parent().attr('data-id');
	}
	CurrentTemplet = $('#MyTable').dataTable().fnGetData(index);
	CurrentTempletid = CurrentTemplet.templetid;
	var action = myurls['templet.delete'];
	
	bootbox.confirm(common.tips.remove + CurrentTemplet.name, function(result) {
		if (result == true) {
			$.ajax({
				type : 'POST',
				url : action,
				cache: false,
				data : {
					'templet.templetid': CurrentTempletid
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
	var templetid = $(event.target).attr('templetid');
	if (templetid == undefined) {
		templetid = $(event.target).parent().attr('templetid');
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


