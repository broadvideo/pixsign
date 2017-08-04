$(document).ready(function(){
	
	$(":file").filestyle({icon: false,buttonText:"浏览",buttonName: "btn-primary",placeholder:"选择Excel文件"});
	$("#uploadFile").click(function () {
    $('#importDataForm').ajaxSubmit({
        url: 'classcard!import.action',
        type: 'POST',
        beforeSubmit: function (data) {
        var filePath=$("#excelFile").val();
        if($.trim(filePath).length==0){
			bootbox.alert("请选择上传Excel文件！");
	          return false;
             }
        var reg=/\.(xls|xlsx)/i;
        if(!reg.test(filePath)){
        	bootbox.alert("文件格式不合法，请上传excel文件！");
        	return false;
        	
        }
        return true;

        },
        
        success: function (data) {
        	if (data.errorcode == 0) {
        		var result=data.importResult;
				bootbox.alert("<b>导入结果</b><hr/>教室(成功："+result.classroom.success+"条 失败："+result.classroom.fail+"条)<br/>"+
						"  班级(成功："+result.schoolclass.success+"条 失败："+result.schoolclass.fail+"条)<br/>"+
						"  学生(成功："+result.student.success+"条 失败："+result.student.fail+"条)<br/>"+
						"课表方案(成功："+result.scheme.success+"条 失败："+result.scheme.fail+"条)<br/>"+
						"  课表(成功："+result.courseschedule.success+"条 失败："+result.courseschedule.fail+"条)<br/>");
			} else {
				bootbox.alert(common.tips.error + data.errormsg);
			}
        }
    });
});

});
