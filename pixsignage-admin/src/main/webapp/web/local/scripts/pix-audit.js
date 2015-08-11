var myurls = {
	'selfapply.list' : 'selfapply!list.action',
};

function initMyTable() {
	$('#ApplyTable1').dataTable({
		'sDom' : "<'row'<'col-md-6 col-sm-12'l><'col-md-12 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", //default layout without horizontal scroll(remove this setting to enable horizontal scroll for the table)
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] // change per page values here
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['selfapply.list'],
		'aoColumns' : [ {"sTitle" : "邮件地址", "mData" : "email", "bSortable" : false }, 
						{"sTitle" : "申请人姓名", "mData" : "name", "bSortable" : false }, 
						{"sTitle" : "申请人手机", "mData" : "mobile", "bSortable" : false }, 
						{"sTitle" : "申请企业名称", "mData" : "orgname", "bSortable" : false }, 
						{"sTitle" : "申请企业编码", "mData" : "orgcode", "bSortable" : false }, 
						{"sTitle" : "操作", "mData" : "selfapplyid", "bSortable" : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			var data = $('#ApplyTable1').dataTable().fnGetData(iDisplayIndex);
			var dropdownBtn = '<a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn default btn-sm blue pix-audit"><i class="fa fa-edit"></i>&nbsp;&nbsp;审核</a>';
			$('td:eq(5)', nRow).html(dropdownBtn);
			return nRow;
		},
		'fnServerParams': function(aoData) { 
	        aoData.push({'name':'status','value':'0' });
		}
	});
    jQuery('#ApplyTable1_wrapper .dataTables_filter input').addClass('form-control input-small'); // modify table search input
    jQuery('#ApplyTable1_wrapper .dataTables_length select').addClass('form-control input-small'); // modify table per page dropdown
    jQuery('#ApplyTable1_wrapper .dataTables_length select').select2(); // initialize select2 dropdown
	
	$('#ApplyTable2').dataTable({
		'sDom' : "<'row'<'col-md-6 col-sm-12'l><'col-md-12 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", //default layout without horizontal scroll(remove this setting to enable horizontal scroll for the table)
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] // change per page values here
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['selfapply.list'],
		'aoColumns' : [ {"sTitle" : "邮件地址", "mData" : "email", "bSortable" : false }, 
						{"sTitle" : "申请人姓名", "mData" : "name", "bSortable" : false }, 
						{"sTitle" : "申请人手机", "mData" : "mobile", "bSortable" : false }, 
						{"sTitle" : "申请企业名称", "mData" : "orgname", "bSortable" : false }, 
						{"sTitle" : "申请企业编码", "mData" : "orgcode", "bSortable" : false }, 
						{"sTitle" : "操作", "mData" : "selfapplyid", "bSortable" : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			var dropdownBtn = '<div class="btn-group">';
			dropdownBtn += '<a class="btn default btn-sm blue" href="#" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">操作  <i class="fa fa-angle-down"></i></a>';
			dropdownBtn += '<ul class="dropdown-menu pull-right">';
			dropdownBtn += '<li><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-update"><i class="fa fa-edit"></i> 编辑</a></li>';
			dropdownBtn += '<li><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-delete"><i class="fa fa-trash-o"></i> 删除</a></li>';
			dropdownBtn += '</ul></div>';
			$('td:eq(5)', nRow).html(dropdownBtn);
			return nRow;
		},
		'fnServerParams': function(aoData) { 
	        aoData.push({'name':'status','value':'1' });
		}
	});
    jQuery('#ApplyTable2_wrapper .dataTables_filter input').addClass('form-control input-small'); // modify table search input
    jQuery('#ApplyTable2_wrapper .dataTables_length select').addClass('form-control input-small'); // modify table per page dropdown
    jQuery('#ApplyTable2_wrapper .dataTables_length select').select2(); // initialize select2 dropdown

	$('#ApplyTable3').dataTable({
		'sDom' : "<'row'<'col-md-6 col-sm-12'l><'col-md-12 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", //default layout without horizontal scroll(remove this setting to enable horizontal scroll for the table)
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] // change per page values here
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : myurls['selfapply.list'],
		'aoColumns' : [ {"sTitle" : "邮件地址", "mData" : "email", "bSortable" : false }, 
						{"sTitle" : "申请人姓名", "mData" : "name", "bSortable" : false }, 
						{"sTitle" : "申请人手机", "mData" : "mobile", "bSortable" : false }, 
						{"sTitle" : "申请企业名称", "mData" : "orgname", "bSortable" : false }, 
						{"sTitle" : "申请企业编码", "mData" : "orgcode", "bSortable" : false }, 
						{"sTitle" : "操作", "mData" : "selfapplyid", "bSortable" : false }],
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			var dropdownBtn = '<div class="btn-group">';
			dropdownBtn += '<a class="btn default btn-sm blue" href="#" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">操作  <i class="fa fa-angle-down"></i></a>';
			dropdownBtn += '<ul class="dropdown-menu pull-right">';
			dropdownBtn += '<li><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-update"><i class="fa fa-edit"></i> 编辑</a></li>';
			dropdownBtn += '<li><a href="javascript:;" privilegeid="101010" data-id="' + iDisplayIndex + '" class="btn-sm pix-delete"><i class="fa fa-trash-o"></i> 删除</a></li>';
			dropdownBtn += '</ul></div>';
			$('td:eq(5)', nRow).html(dropdownBtn);
			return nRow;
		},
		'fnServerParams': function(aoData) { 
	        aoData.push({'name':'status','value':'2' });
		}
	});
    jQuery('#ApplyTable3_wrapper .dataTables_filter input').addClass('form-control input-small'); // modify table search input
    jQuery('#ApplyTable3_wrapper .dataTables_length select').addClass('form-control input-small'); // modify table per page dropdown
    jQuery('#ApplyTable3_wrapper .dataTables_length select').select2(); // initialize select2 dropdown
}

function initMyEditModal() {
	OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
	
	
	
	FormValidateOption.rules = {};
	FormValidateOption.rules['org.name'] = {
		required: true,
		minlength: 2,
		remote: {
			url: myurls['org.validate'],
			type: 'post',
			data: {
				'org.orgid': function() {
					return $('#MyEditForm input[name="org.orgid"]').val();
				},
				'org.name': function() {
					return $('#MyEditForm input[name="org.name"]').val();
				}
			},
			dataFilter: function(responseString) {
				var response = $.parseJSON(responseString);
				if (response.errorcode == 0) {
					return true;
				}
				return false;
			}
		}
	};
	FormValidateOption.rules['org.code'] = {
			required: true,
			minlength: 2,
			remote: {
				url: myurls['org.validate'],
				type: 'post',
				data: {
					'org.orgid': function() {
						return $('#MyEditForm input[name="org.orgid"]').val();
					},
					'org.code': function() {
						return $('#MyEditForm input[name="org.code"]').val();
					}
				},
				dataFilter: function(responseString) {
					var response = $.parseJSON(responseString);
					if (response.errorcode == 0) {
						return true;
					}
					return false;
				}
			}
		};
	FormValidateOption.messages = {
		'org.name': {
			remote: "名称已存在"
		},
		'org.code': {
			remote: "编码已存在"
		},
	};
	FormValidateOption.rules['org.maxdevices'] = {};
	FormValidateOption.rules['org.maxdevices']['required'] = true;
	FormValidateOption.rules['org.maxdevices']['number'] = true;
	FormValidateOption.rules['org.maxstorage'] = {};
	FormValidateOption.rules['org.maxstorage']['required'] = true;
	FormValidateOption.rules['org.maxdevices']['number'] = true;
	if ($('input[name="org.orgtype"]:checked').val() == 1) {
		FormValidateOption.rules['org.maxdevices']['max'] = MaxDevicesPerSigOrg;
		FormValidateOption.rules['org.maxstorage']['max'] = MaxStoragePerSigOrg;
	} else {
		FormValidateOption.rules['org.maxdevices']['max'] = MaxDevicesPerMovieOrg;
		FormValidateOption.rules['org.maxstorage']['max'] = MaxStoragePerMovieOrg;
	}
	
	FormValidateOption.submitHandler = function(form) {
		if ($('input[name="org.expireflag"]:checked').val() == 0) {
			$('input[name="org.expiretime"]').val('2037-01-01');
		}
		
		var checkboxes = $('#MyEditForm').find('input[type="checkbox"]');
		$.each( checkboxes, function( key, value ) {
		    if (value.checked === false) {
		        value.value = 0;
		    } else {
		        value.value = 1;
		    }
		});
		var data = jQuery("#MyEditForm").serializeArray();
		data = data.concat(
			jQuery('#MyEditForm input[type=checkbox]:not(:checked)').map(
				function() {
					return {"name": this.name, "value": this.value};
				}).get()
	    );
		
		$.ajax({
			type : 'POST',
			url : $('#MyEditForm').attr('action'),
			data : data,
			success : function(data, status) {
				if (data.errorcode == 0) {
					$('#MyEditModal').modal('hide');
					bootbox.alert('操作成功');
					refreshMyTable();
				} else {
					bootbox.alert('出错了：' + data.errorcode + ': ' + data.errormsg);
				}
			},
			error : function() {
				bootbox.alert('出错了!');
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
		if ($('#MyTable').dataTable().fnGetData().length >= MaxOrgs) {
			bootbox.alert('企业数量已达上限，无法新增。');
			return;
		}
		
		var action = myurls['common.add'];
		refreshForm('MyEditForm');
		var checkboxes = $('#MyEditForm').find('input[type="checkbox"]');
		$.each( checkboxes, function( index, checkbox ) {
		    $(checkbox).attr('checked');
		    $(checkbox).parent().addClass('checked');
		});
		if ($('input[name="org.expireflag"]:checked').val() == 0) {
			$('.expiretime').css('display', 'none');
		} else {
			$('.expiretime').css('display', 'block');
		}
		$('#MyEditForm').attr('action', action);
		$('#MyEditModal').modal();
	});			

	
	$('body').on('click', '.pix-update', function(event) {
		var index = $(event.target).attr('data-id');
		if (index == undefined) {
			index = $(event.target).parent().attr('data-id');
		}
		var data = $('#MyTable').dataTable().fnGetData(index);
		var action = myurls['common.update'];
		var formdata = new Object();
		for (var name in data) {
			formdata['org.' + name] = data[name];
		}
		refreshForm('MyEditForm');
		$('#MyEditForm').loadJSON(formdata);
		var checkboxes = $('#MyEditForm').find('input[type="checkbox"]');
		$.each( checkboxes, function( index, checkbox ) {
			if (formdata[$(checkbox).attr('name')] == 0) {
			    $(checkbox).removeAttr('checked');
			    $(checkbox).parent().removeClass('checked');
			} else {
			    $(checkbox).attr('checked');
			    $(checkbox).parent().addClass('checked');
			}
		});
		if ($('input[name="org.expireflag"]:checked').val() == 0) {
			$('.expiretime').css('display', 'none');
		} else {
			$('.expiretime').css('display', 'block');
		}
		$('#MyEditForm').attr('action', action);
		$('#MyEditModal').modal();
	});

	$('input[name="org.orgtype"]').click(function(e) {
		FormValidateOption.rules['org.maxdevices'] = {};
		FormValidateOption.rules['org.maxdevices']['required'] = true;
		FormValidateOption.rules['org.maxdevices']['number'] = true;
		FormValidateOption.rules['org.maxstorage'] = {};
		FormValidateOption.rules['org.maxstorage']['required'] = true;
		FormValidateOption.rules['org.maxdevices']['number'] = true;
		if ($('input[name="org.orgtype"]:checked').val() == 1) {
			FormValidateOption.rules['org.maxdevices']['max'] = MaxDevicesPerSigOrg;
			FormValidateOption.rules['org.maxstorage']['max'] = MaxStoragePerSigOrg;
		} else {
			FormValidateOption.rules['org.maxdevices']['max'] = MaxDevicesPerMovieOrg;
			FormValidateOption.rules['org.maxstorage']['max'] = MaxStoragePerMovieOrg;
		}
		$('#MyEditForm').validate(FormValidateOption);
	    $.extend($("#MyEditForm").validate().settings, {
	    	rules: FormValidateOption.rules
		});
	});  

	$('input[name="org.expireflag"]').click(function(e) {
		if ($('input[name="org.expireflag"]:checked').val() == 0) {
			$('.expiretime').css('display', 'none');
		} else {
			$('.expiretime').css('display', 'block');
		}
	});  

	$(".form_datetime").datetimepicker({
        autoclose: true,
        isRTL: App.isRTL(),
        format: "yyyy-mm-dd",
        pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left"),
        language: "zh-CN",
        minView: 'month',
        todayBtn: true
    });
}


