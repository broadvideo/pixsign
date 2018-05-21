class CourseList {

    constructor (location) {
        this.dom = location;
        this.categories = [];
        this.grades = [];
        this.grade = null;
        this.topCat = null;
        this.subCat = null;
    }

    //实例方法
    init () {
        var self = this
        //获取grade
        $.ajax({
            url: '/pixedxapi/lms/grades',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            timeout: 5000,
            dataType: 'json',
            success: function (result, textStatus) {
                switch (result.retcode) {
                    case 0:
                        self.grades = result.data;
                        var gradeDot = doT.template($("#temp_grade").text());
                        $("#select0").html(gradeDot(result.data));
                        break;
                }
            },
            error: function (jqXHR, textStatus) {
                toastr.error("获取年级列表失败");
            }
        });
        //获取categories
        $.ajax({
            url: '/pixedxapi/lms/course_categories',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            timeout: 5000,
            dataType: 'json',
            success: function (result, textStatus) {
                switch (result.retcode) {
                    case 0:
                        self.categories = result.data;
                        var categoryDot = doT.template($("#temp_category11").text());
                        $("#select1").html(categoryDot(result.data));
                        break;
                }
            },
            error: function (jqXHR, textStatus) {
                toastr.error("获取分类列表失败");
            }
        });

        /*点击年级*/
        $("#select0").on('click', 'dd', function () {
            $(this).addClass("selected").siblings().removeClass("selected");
            $("#selectG").remove();
            if (!$(this).hasClass("select-all")) {
                var copyThisG = $(this).clone();
                $(".select-result dl").prepend(copyThisG.attr("id", "selectG"));
            }
            queryCourses()
        });

        /*点击主分类*/
        $("#select1").on('click', 'dd', function () {
            $(this).addClass("selected").siblings().removeClass("selected");
            $("#selectA").remove();
            $("#selectB").remove();
            $('#select2 dd:gt(0)').remove();
            if (!$(this).hasClass("select-all")) {
                var copyThisA = $(this).clone();
                $(".select-result dl").append(copyThisA.attr("id", "selectA"));
                /*渲染子分类*/
                var cateId = $(this).data('cate-id')
                var cateList = lmsStorage.get('category')
                var selectedCate = cateList.find(function (item) {
                    return item.id == cateId
                })
                renderSecondCategory(selectedCate.children)
            }
            queryCourses()
        });

        $("#select2").on('click', 'dd', function () {
            $(this).addClass("selected").siblings().removeClass("selected");
            $("#selectB").remove();
            if (!$(this).hasClass("select-all")) {
                var copyThisB = $(this).clone();
                $(".select-result dl").append(copyThisB.attr("id", "selectB"));
            }
            queryCourses()
        });

        $("#cate_course").on("click", "#selectG", function () {
            $(this).remove();
            $("#select0 .select-all").addClass("selected").siblings().removeClass("selected");
            queryCourses()
        });

        $("#cate_course").on("click", "#selectA", function () {
            $(this).remove();
            $("#selectB").remove();
            $("#select1 .select-all").addClass("selected").siblings().removeClass("selected");
            $('#select2 dd:gt(0)').remove();
            queryCourses()
        });

        $("#cate_course").on("click", "#selectB", function () {
            $(this).remove();
            $("#select2 .select-all").addClass("selected").siblings().removeClass("selected");
            queryCourses()
        });

        $("#cate_course").on("click", "dd", function () {
            if ($(".select-result dd").length > 1) {
                $(".select-no").hide();
            } else {
                $(".select-no").show();
            }
        });

        /*点击分页，显示对应的课程列表*/
        $(".pagination").on("click", "li", function () {
            if ($(this).is($('.pagination li:first'))) {
                if ($('.pagination li.checked').length && !$('.pagination li.checked').is($('.pagination li:eq(1)'))) {
                    var checked = $('.pagination li.checked');
                    checked.removeClass('checked');
                    checked.prev('li').addClass('checked');
                }
            }
            else if ($(this).is($('.pagination li:last'))) {
                if ($('.pagination li.checked').size() == 0 && $('.pagination li').size() > 3) {
                    $('.pagination li:eq(2)').addClass('checked');
                }
                else if ($('.pagination li.checked').size() > 0 && !$('.pagination li.checked').is($('.pagination li:last').prev('li'))) {
                    var checked = $('.pagination li.checked');
                    checked.removeClass('checked');
                    checked.next('li').addClass('checked');
                }
            }
            else {
                $('.pagination li.checked').removeClass('checked');
                $(this).addClass('checked');
            }
            if ($('.pagination li.checked').length == 1) {
                var page = $('.pagination li.checked').text();
                page = parseInt(page)
                queryCourses(page)
            }
        });
    }
};