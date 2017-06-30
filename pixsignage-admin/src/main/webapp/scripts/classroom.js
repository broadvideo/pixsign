//初始化操作栏按钮动作
function initaction() {
    //操作栏新增按钮动作
    $("#action_add_classroom").click(function () {
    	
    	//对数据进行模版渲染
        $("#nest_modal").empty();
        $("#nest_modal").setTemplateElement("temp_add_classroom");
        $("#nest_modal").processTemplate("");
        $("#modal_add_classroom").modal("toggle");
        $("#action_submit_add").click(function () {
            $('#form_add_classroom').ajaxSubmit({
                url: 'classroom!add.action',
                type: 'POST',
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                beforeSubmit: function (data) {
                   
                },
                success: function (result) {
                    switch (result.retcode) {
                        case -90:
                            bootbox.alert(common.tips.t00, function () {
                                document.location.href = "/login.action";
                            });
                            break;
                        case 1:
                            toastr.success("添加教室成功。");
                            $("#modal_add_classroom").modal("toggle");
                            $('#classroomList').DataTable().ajax.reload(null, false);
                            break;
                        case -2:
                            toastr.warning("教室名称已经存在，请修改！");
                            break;
                        case -3:
                            toastr.error("操作异常！");
                            break;
                        case -4:
                            toastr.error(common.tips.t02);
                            break;
                    }
                }
            });
        });
    });

    //操作栏编辑按钮动作
    $('#classroomList').delegate("a.editclassroom", "click", function () {
    	
        var jsonData = {id: $(this).attr("classroomid")};
        $.ajax({
            url: 'classroom!get.action',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            data: jsonData,
            dataType: 'json',
            success: function (data) {
                switch (data.retcode) {
                    case 1:
                        $("#nest_modal").empty();
                        $("#nest_modal").setTemplateElement("temp_edit_classroom");
                        $("#nest_modal").processTemplate(data.data);
                       
                        $("#modal_edit_classroom").modal("toggle");
                        $("#action_submit_edit").click(function () {
                            $('#form_edit_classroom').ajaxSubmit({
                                url: 'classroom!update.action',
                                type: 'POST',
                                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                                dataType: 'json',
                                beforeSubmit: function (data) {
                                
                                },
                                success: function (result) {
                                    switch (result.retcode) {
                                        case -90:
                                            bootbox.alert(common.tips.t00, function () {
                                                document.location.href = "/login.action";
                                            });
                                            break;
                                        case 1:
                                            toastr.success("编辑教室成功。");
                                            $("#modal_edit_classroom").modal("toggle");
                                            $('#classroomList').DataTable().ajax.reload(null, false);
                                            break;
                                        case -2:
                                            toastr.warning(common.tips.t10);
                                            break;
                                        case -3:
                                            toastr.error(common.tips.t01);
                                            break;
                                        case -4:
                                            toastr.error(common.tips.t02);
                                            break;
                                    }
                                }
                            });
                        });
                        break;
                    case -3:
                        toastr.error(common.tips.t01);
                        break;
                    case -4:
                        toastr.error(common.tips.t02);
                        break;
                }
            }
        });
    });

    //操作栏删除按钮动作
    $('#classroomList').delegate("a.deleteclassroom", "click", function () {
    	
        var classroomId = $(this).attr('classroomid');
      
        bootbox.confirm({
            buttons: {
                confirm: {label: common.tips.t03, className: 'default blue-stripe'},
                cancel: {label: common.tips.t04, className: 'default'}
            },
            message: "删除教室将清空教室关联的课表，确认是否删除:" + $(this).closest("tr").find("td:first").text(),
            callback: function (result) {
                if (result) {
                    var jsonData = {ids: classroomId};
                    $.ajax({
                        url: 'classroom!delete.action',
                        type: 'GET',
                        contentType: 'application/json; charset=utf-8',
                        data: jsonData,
                        dataType: 'json',
                        success: function (result) {
                            switch (result.retcode) {
                                case -90:
                                    bootbox.alert(common.tips.t00, function () {
                                        document.location.href = "/login.action";
                                    });
                                    break;
                                case 1:
                                    toastr.success("删除教室成功。");
                                    var pageInfo = $('#classroomList').DataTable().page.info();
                                    if (pageInfo.pages > 1 && pageInfo.pages == pageInfo.page + 1 && 1 == pageInfo.end - pageInfo.start) {
                                        $('#classroomList').DataTable().page(pageInfo.page - 1);
                                    }
                                    $('#classroomList').DataTable().ajax.reload(null, false);
                                    break;
                                case -3:
                                    toastr.error(common.tips.t01);
                                    break;
                                case -4:
                                    toastr.error(common.tips.t02);
                                    break;
                            }
                        },
                        error: function (jqXHR, textStatus) {
                            toastr.warning("删除教室异常:" + textStatus);
                        }
                    });
                }
            },
            //title: "bootbox confirm也可以添加标题哦",
        });
    });
}

//role list初始化
var Custom =function () {
    return {
        //main function to initiate the module
        init: function () {
            if (!jQuery().dataTable) {
                return;
            }
            //toastr初始化
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "progressBar": false,
                "positionClass": "toast-bottom-center",
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };

            $('#classroomList').dataTable({
                serverSide: true,
                ajax: {
                    url: "classroom!list.action",
                    type: "GET",
                    contentType: 'application/json; charset=utf-8',
                    data: function (d) {
                        var searchKey = $('input[type="search"]').val();
                        var pageSize = d.length;
                        var pageNo = d.start / d.length + 1;
                  
                        var jsonData = {
                            searchKey: searchKey,
                            pageSize: pageSize,
                            pageNo: pageNo
               
                        };
                    
                        return jsonData;
                        
                        
                    }
                },
                lengthMenu: [
                    [10, 20, 50],
                    [10, 20, 50]
                ],
                // set the initial value
                pageLength: 10,
                processing: true,
                language: {
                    "processing": "<img src='" + res + "/global/img/ajax-loading.gif' />",
                    "lengthMenu": common.view.v03,
                    "zeroRecords": common.view.v04,
                    "info": common.view.v05,
                    "infoEmpty": common.view.v06,
                    "search": common.view.v07,
                    "infoFiltered": common.view.v08,
                    "paginate": {
                        previous: common.view.v09,
                        next: common.view.v10
                    }
                },
                columns: [
                    {data: "name"},
                    {data: "description"},
                    {data: "createtime"},
                    {data: "id"},

                ],
                order: [[0, "asc"]],
                columnDefs: [
                    {
                        "render": function (data, type, row) {
                        	
                            return '<div class="btn-group">' +
                                '<a class="btn btn-sm blue" href="#" data-toggle="dropdown">' + common.menu.m00 + ' <i class="fa fa-angle-down"></i> </a>' +
                                '<ul class="dropdown-menu pull-right">' +
                                '<li> <a href="javascript:;" class="editclassroom" classroomid="' + data + '"> <i class="fa fa-pencil"></i> ' + common.menu.m01 + ' </a> </li>' +
                                '<li > <a href="javascript:;" class="deleteclassroom" classroomid="' + data + '"> <i class="fa fa-trash-o"></i> ' + common.menu.m02 + ' </a> </li></ul></div>';
                        },
                        "targets": [3]
                    },
                    
                    {
                        "render": function (data, type, row) {

                            return moment(data).format('YYYY MM-DD HH:mm');
                        },
                        "targets": [2]
                    },
                    {"orderable": false, "targets": [2]},
                    {"searchable": false, "targets": [2]}
                ],
                "createdRow": function (row, data, index) {
                	
                    //do something
                },
            });
            // modify table search input
            jQuery('input[type="search"]').addClass("form-control input-small input-inline");
            // modify table per page dropdown
            jQuery('select[name="rolelist_length"]').addClass("form-control input-xsmall");
            // initialize select2 dropdown
            jQuery('select[name="rolelist_length"]').select2();
            //按钮行为初始化
            initaction();
        }
    };
}();