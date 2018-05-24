var origin = '';
var category = function () {
    var category = {};
    category.list = function (success) {
        $.ajax({
            url: origin + '/pixedxapi/lms/course_categories',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            timeout: 5000,
            dataType: 'json',
            success: function (result, textStatus) {
                switch (result.retcode) {
                    case 0:
                        lmsStorage.set("category", result.data);
                        if (typeof success == "function") {
                            success(result.data);
                        }
                        break;
                }
            },
            error: function (jqXHR, textStatus) {
                toastr.error("获取分类列表失败");
            }
        });
    };
    category.list();
    return category;
}();
