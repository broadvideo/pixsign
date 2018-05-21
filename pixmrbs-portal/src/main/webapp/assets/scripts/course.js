/*Course Module*/
var course = function () {
    var course = {};
    /* 根据条件获取课程列表并渲染
     * 请求参数定义
     * param = {
     url: "请求的URL",
     data: "请求参数",
     headers: "请求头",
     render: "渲染用的函数",
     target: "显示的位置",
     template: "渲染用的模版"
     }*/
    course.list = function (param) {
        $.ajax({
            url: param.url,
            type: "GET",
            headers: param.headers,
            contentType: 'application/json; charset=utf-8',
            data: param.data,
            dataType: "json",
            success: function (result) {
                switch (result.retcode) {
                    case 0:
                        //添加两个模版用时间处理函数
                        result.dateFormat = function (ts) {
                            return moment(ts).format("ll");
                        };
                        result.timeFormat = function (start, end) {
                            var timeStr = moment(start).calendar();
                            if (moment().isBetween(moment(start), moment(end))) {
                                timeStr += ' (直播中)';
                            }
                            return timeStr;
                        };

                        param.render(param.target, param.template, result);
                        //如果是显示课程详情，将课程注册状态写到全局变量中
                        if (result.course) {
                            sessionStorage.isRegister = result.course.is_register;
                            sessionStorage.courseId = result.course.id;
                        }
                        //点击分类，进行分页渲染
                        if (param.pagingTarget && result.pagination) {
                            var page = Math.ceil(result.pagination.total / result.pagination.length);
                            page = Math.min(20, page);
                            var paging = [];
                            for (var i = 1; i <= page; i++) {
                                paging.push(i);
                            }
                            var curPage = result.pagination.start / result.pagination.length + 1
                            var pagination = {paging: paging, curPage: curPage};
                            param.pagingRender(param.pagingTarget, param.pagingTemplate, pagination);
                        }
                        break;
                    default:
                        toastr.error("获取课程列表失败");
                }
            }
        });
    }

    /*课程注册、取消注册*/
    course.register = function (param) {
        $.ajax({
            url: param.url,
            type: param.method,
            headers: param.headers,
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            success: function (result) {
                switch (result.retcode) {
                    case 0:
                        param.render(param.id);
                        break;
                    default:
                        toastr.error("课程注册或取消注册失败");
                }
            }
        });
    }

    /*课程表获取*/
    course.schedule = function (param) {
        $.ajax({
            url: param.url,
            type: 'GET',
            headers: param.headers,
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            success: function (result) {
                switch (result.retcode) {
                    case 0:
                        var weekNo = moment().week() - moment(Number(result.data[0].first_week_time)).week() + 1;
                        var oddCourseList = [], evenCourseList = [];
                        result.data.forEach(function (item) {
                            item.class_time.forEach(function (item2) {
                                var course = {
                                    courseName: item.sub_category_name,
                                    dayNo: item2.day_of_week,
                                    courseNo: item2.period_of_day,
                                    classRoom: item2.classroom_name
                                };
                                if ((item2.type != 2))
                                    oddCourseList.push(course);
                                if ((item2.type != 1))
                                    evenCourseList.push(course);
                            })
                        });
                        param.render(param.target, param.template, {oddCourseList: oddCourseList, evenCourseList: evenCourseList, weekNo: weekNo});
                        break;
                    default:
                        toastr.error("课程表获取失败");
                }
            }
        });
    }
    return course;
}();

