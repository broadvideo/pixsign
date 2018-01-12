var CurPerson = null;
var CurClassid = null;
var classlist = [];
classlist.push({id:0,text: '男'},{id:1,text:'女'},{ id:2,text:'未知'});
var _persontype=0;

function preview(file,previewid) {
    var filePath=$("#"+file.id).val();
    if($.trim(filePath).length==0){
		   return false;
         }
    var reg=/\.(jpg|png)/i;
    if(!reg.test(filePath)){
    	bootbox.alert("文件格式不合法，请上传jpg或者png格式头像！");
    	return false;
    }
    var filebytes=file.files[0].size;
    if(filebytes>5*1024*1024){
    	bootbox.alert("上传头像不允许大于5MB！");
    	return false;
 	
    }
    
	
	var prevDiv = document.getElementById(previewid);
    if (file.files && file.files[0]) {
      var reader = new FileReader();
      reader.onload = function(evt) {
        prevDiv.innerHTML = '<img src="' + evt.target.result + '" width="120px" height="120px"/>';
      }
      reader.readAsDataURL(file.files[0]);
    } 
  }
var PersonModule=function(){
	

var init=function(persontype){
	_persontype=persontype;
	if(_persontype==3){
		initMyTable3();
	}else if(_persontype==2){	
		initMyTable2();
	}

	initEvent();
	
};

var refresh=function(){
	
   $('#MyTable').dataTable()._fnAjaxUpdate();
	
	
};



function initMyTable3(){

	$('#MyTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : 'person!list.action',
		'aoColumns' : [ {'sTitle' : '姓名', 'mData' : 'name', 'bSortable' : false, 'sWidth' : '10%' },
		                {'sTitle' : '性别', 'mData' : 'sex', 'bSortable' : false, 'sWidth' : '15%' },
						{'sTitle' : '电话', 'mData' : 'mobile', 'bSortable' : false, 'sWidth' : '15%' },
						{'sTitle' : '邮箱', 'mData' : 'email', 'bSortable' : false, 'sWidth' : '20%' },
						{'sTitle' : '地址', 'mData' : 'address', 'bSortable' : false, 'sWidth' : '20%' },
						{'sTitle' : '', 'mData' : 'personid', 'bSortable' : false, 'sWidth' : '8%' },
						{'sTitle' : '', 'mData' : 'personid', 'bSortable' : false, 'sWidth' : '8%' }],
					
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(1)', nRow).html(function(){
			
				for(var index in classlist){
					if(aData.sex==classlist[index].id){
						
						return classlist[index].text;
					}
					
				}
				
			});
			$('td:eq(5)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
			$('td:eq(6)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
	
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			if (_persontype != null) {
				aoData.push({'name':'person.type','value':_persontype });
			}
		}
	});
	
	$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').select2();
	$('#MyTable').css('width', '100%').css('table-layout', 'fixed');

}

function initMyTable2(){

	$('#MyTable').dataTable({
		'sDom' : '<"row"<"col-md-6 col-sm-12"l><"col-md-6 col-sm-12"f>r>t<"row"<"col-md-5 col-sm-12"i><"col-md-7 col-sm-12"p>>', 
		'aLengthMenu' : [ [ 10, 25, 50, 100 ],
						[ 10, 25, 50, 100 ] 
						],
		'bProcessing' : true,
		'bServerSide' : true,
		'sAjaxSource' : 'person!list.action',
		'aoColumns' : [ 
                        {'sTitle' : '工号', 'mData' : 'personno', 'bSortable' : false, 'sWidth' : '10%' },
		                {'sTitle' : '姓名', 'mData' : 'name', 'bSortable' : false, 'sWidth' : '10%' },
		                {'sTitle' : '性别', 'mData' : 'sex', 'bSortable' : false, 'sWidth' : '15%' },
						{'sTitle' : '电话', 'mData' : 'mobile', 'bSortable' : false, 'sWidth' : '15%' },
						{'sTitle' : '邮箱', 'mData' : 'email', 'bSortable' : false, 'sWidth' : '20%' },
						{'sTitle' : '', 'mData' : 'personid', 'bSortable' : false, 'sWidth' : '8%' },
						{'sTitle' : '', 'mData' : 'personid', 'bSortable' : false, 'sWidth' : '8%' }],
					
		'iDisplayLength' : 10,
		'sPaginationType' : 'bootstrap',
		'oLanguage' : DataTableLanguage,
		'fnRowCallback' : function(nRow, aData, iDisplayIndex) {
			$('td:eq(2)', nRow).html(function(){
			
				for(var index in classlist){
					if(aData.sex==classlist[index].id){
						
						return classlist[index].text;
					}
					
				}
				
			});
			$('td:eq(5)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs blue pix-update"><i class="fa fa-edit"></i> ' + common.view.edit + '</a>');
			$('td:eq(6)', nRow).html('<a href="javascript:;" data-id="' + iDisplayIndex + '" class="btn default btn-xs red pix-delete"><i class="fa fa-trash-o"></i> ' + common.view.remove + '</a>');
	
			return nRow;
		},
		'fnServerParams': function(aoData) { 
			if (_persontype != null) {
				aoData.push({'name':'person.type','value':_persontype });
			}
		}
	});
	
	$('#MyTable_wrapper .dataTables_filter input').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').addClass('form-control input-small');
	$('#MyTable_wrapper .dataTables_length select').select2();
	$('#MyTable').css('width', '100%').css('table-layout', 'fixed');

}


function initEvent(){
	
	
		$('body').on('click', '.pix-delete', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			CurPerson = $('#MyTable').dataTable().fnGetData(index);
			bootbox.confirm(common.tips.remove + CurPerson.name, function(result) {
				if (result == true) {
					$.ajax({
						type : 'POST',
						url : 'person!delete.action',
						cache: false,
						data : {
							'person.personid': CurPerson.personid
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
		
		OriginalFormData['MyEditForm'] = $('#MyEditForm').serializeObject();
		
		//FormValidateOption.rules['student.classid'] = {};
		//FormValidateOption.rules['student.classid']['required'] = true;
		if(_persontype==2){
			FormValidateOption.rules['person.personno'] = {};
			FormValidateOption.rules['person.personno']['required'] = true;
		}
		FormValidateOption.rules['person.name'] = {};
		FormValidateOption.rules['person.name']['required'] = true;
		FormValidateOption.rules['person.sex'] = {};
		FormValidateOption.rules['person.sex']['required'] = true;
		FormValidateOption.submitHandler = function(form) {
		
		  var action=$('#MyEditForm').attr('action');
		   if(action.indexOf("person!add")>=0){
			   var avatarfile=$("#avatarfile").val();
				  var imgfile=$("#imagefile").val();
				    if($.trim(avatarfile).length==0){
						   bootbox.alert("请上传头像!");
						   return;
				         }
				    if($.trim(imgfile).length==0){
				    	 bootbox.alert("请上传用于识别的人脸图像!");
				    	 return;
				    }
		   }
			
			  
			
			$.ajax({
				type : 'POST',
				url : $('#MyEditForm').attr('action'),
				dataType: 'json',
				data : new FormData($('#MyEditForm')[0]) ,
				 contentType: false,
				processData: false,
				success : function(data, status) {
					if (data.errorcode == 0) {
						$('#MyEditModal').modal('hide');
						bootbox.alert(common.tips.success);
						refresh();
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
			
			refreshForm('MyEditForm');
			$('#MyEditForm').attr('action', 'person!add.action?person.type='+_persontype);
			$('#MyEditModal').modal();
			$("#ClassSelect").select2('val','');
			$('#preview').html('')
			$('#preview2').html('')
		
		});			
		
		
		$('body').on('click', '.pix-update', function(event) {
			var index = $(event.target).attr('data-id');
			if (index == undefined) {
				index = $(event.target).parent().attr('data-id');
			}
			var item = $('#MyTable').dataTable().fnGetData(index);
			var formdata = new Object();
			for (var name in item) {
				formdata['person.' + name] = item[name];
			}
			refreshForm('MyEditForm');
			$('#MyEditForm').loadJSON(formdata);
			$('#MyEditForm').attr('action', 'person!update.action');
			//初始化图片
			$('#preview').html("");
			$('#preview2').html("");
		
			if(formdata['person.avatar']!=null){
				$('#preview').append('<img src="/pixsigdata' + formdata['person.avatar'] + '" width="120px" height="120px"/>');
		    }
			if(formdata['person.imageurl']!=null){
				$('#preview2').append('<img src="/pixsigdata' + formdata['person.imageurl'] + '" width="120px" height="120px"/>');
		    }
			$('#MyEditModal').modal();
			$("#ClassSelect").select2('val',item.sex);
		
		});
		
		$("#ClassSelect").select2({
			placeholder: common.tips.detail_select,
			minimumInputLength: 0,
			data: classlist,
			dropdownCssClass: "bigdrop", 
			escapeMarkup: function (m) { return m; } 
		});
}

return  { 
	     init: init,
	     refresh: refresh
	     }

}();
