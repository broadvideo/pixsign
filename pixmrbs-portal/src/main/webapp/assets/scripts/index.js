var player = null, player2 = null, courseOutline;
var origin = '';
var courseListUrl = '/pixedxapi/lms/courses/live_courses';
var Index = function (user, category, course, lmsStorage) {
    /*走马灯广告初始化*/
    var initLayerSlider = function () {
        $('#layerslider').layerSlider({
            skin: 'fullwidth',
            thumbnailNavigation: 'hover',
            hoverPrevNext: false,
            responsive: false,
            responsiveUnder: 960,
            sublayerContainer: 960
        });
    }

    /*用户状态渲染*/
    var renderUserStatus = function () {
        if (typeof sessionStorage.username != 'undefined') {
            $("#userinfo").text(sessionStorage.username + ": 欢迎您！");
            $('#login').hide()
            $('#mycourse').show()
            $('#logout').show()
            handleMyCourseSchedule();
            handleMyCourse();
            handleMyFavorite();
        } else {
            $("#userinfo").text("未登录");
            $('#login').show()
            $('#mycourse').hide()
            $('#logout').hide()
            $("#my_course_schedule").empty();
            $("#my_course_list").empty();
            $("#my_favorite_list").empty();
        }
    };

    /*自动登录校验*/
    var handleautoLogin = function () {
        let url = new URL(location.href)
        let token = url.searchParams.get('token')
        if (token) {
            user.autoLogin(token, renderUserStatus)
        }
    }

    /*导航栏行为定义*/
    var handleNavbar = function () {
        window.history.replaceState({location: 'homepage'}, '', '#homepage')
        sessionStorage.pageId = 'homepage';
        /*导航栏点击事件*/
        $(".navbar-nav li").click(function (ev) {
            ev.preventDefault();
            var id = $(this).prop('id');
            if (sessionStorage.pageId == id) return;
            $(this).siblings().removeClass("active");
            $(this).addClass("active");
            $('.all-content').children().hide();
            $('.page-slider').hide();
            sessionStorage.pageId = id;
            switch (id) {
                case "homepage":
                    window.history.pushState({location: 'homepage'}, '', '#homepage')
                    courseListUrl = '/pixedxapi/lms/courses/live_courses';
                    handleGrade()
                    handleCategory()
                    $('.page-slider').show();
                    $("#main_page").show();
                    $("#cate_course").show();
                    break;
                case "courselist":
                    window.history.pushState({location: 'courselist'}, '', '#courselist')
                    courseListUrl = '/pixedxapi/lms/courses';
                    handleGrade()
                    handleCategory()
                    $("#cate_course").show();
                    break;
                case "mycourse":
                    window.history.pushState({location: 'mycourse'}, '', '#mycourse')
                    handleMyCourse();
                    handleMyFavorite();
                    $("#my_course").show();
                    /*handleMyCourseSchedule();*/
                    break;
                case "liveroom":
                    window.history.pushState({location: 'liveroom'}, '', '#liveroom')
                    handleLiveRooms();
                    $('#live_room').show();
                    break;
            }
            App.handleLayout();
        });

        /*回退popstate监听*/
        window.addEventListener('popstate', function(event) {
            if (!event.state) return
            var text = event.state.location;
            sessionStorage.pageId = text;
            if (text !== 'coursedetails') {
                var btnId = '#' + text
                $(btnId).siblings().removeClass("active");
                $(btnId).addClass("active");
                $('.all-content').children().hide();
                $('.page-slider').hide();
            }
            switch (text) {
                case "homepage":
                    courseListUrl = '/pixedxapi/lms/courses/live_courses';
                    handleGrade()
                    handleCategory()
                    $('.page-slider').show();
                    $("#main_page").show();
                    $("#cate_course").show();
                    break;
                case "courselist":
                    courseListUrl = '/pixedxapi/lms/courses';
                    handleGrade()
                    handleCategory()
                    $("#cate_course").show();
                    break;
                case "mycourse":
                    $("#my_course").show();
                    break;
                case "liveroom":
                    $('#live_room').show();
                    break;
                case 'coursedetails':
                    $("#course_details").show();
                    break;
            }
            App.handleLayout();
        });

        /*用户登入登出*/
        $('#login').click(function () {
            $("#modal_login").modal("toggle");
        })
        $('#logout').click(function () {
            user.logout(renderUserStatus);
        })

        /*登录界面提交点击事件*/
        $("body").on("click", "#modal_login #login_submit", function (event) {
            event.preventDefault();
            var data = {
                grant_type: "password",
                client_id: "pixedx-lms",
                client_secret: "pixedx-lms",
                username: $("#username").val(),
                password: $("#password").val()
            };
            user.login(data, function () {
                $("#modal_login").modal("hide");
                renderUserStatus();
            });
        });

        /*APP下载*/
        $('#downloadapp').click(function () {
            $("#contact_us").modal("toggle");
            var apkUrl = location.origin + '/pixdata/app/ktbox.apk';
            $('#qrcode').empty();
            $('#qrcode').qrcode({width: 270, height: 270, text: apkUrl});
            $('#qrcode').closest('a').attr('href', apkUrl);
        })

    };

    /*课程列表渲染
     * 参数说明：
     * target：显示目标位置
     * template：显示使用的模版
     * data：用于填充的数据*/
    var renderCourses = function (target, template, data) {
        var courseDot = doT.template($(template).text());
        $(target).html(courseDot(data));
        if (courseListUrl.includes('live_courses')) {
            $(target).find('.summary').css('top', '70px');
        }
        else {
            $(target).off('mouseover', '.listimg');
            $(target).off('mouseout', '.listimg');
            $(target).on('mouseover', '.listimg', function () {
                $(".summary", this).stop().animate({top: '70px'}, {queue: false, duration: 180});
            });
            $(target).on('mouseout', '.listimg', function () {
                $(".summary", this).stop().animate({top: '125px'}, {queue: false, duration: 180});
            });
        }
    };

    var handleGrade = function () {
        $.ajax({
            url: '/pixedxapi/lms/grades',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            timeout: 5000,
            dataType: 'json',
            success: function (result, textStatus) {
                switch (result.retcode) {
                    case 0:
                        sessionStorage.grades = result.data;
                        var gradeDot = doT.template($("#temp_grade").text());
                        $("#select0").html(gradeDot(result.data));
                        $("#select0 dd:eq(0)").click();
                        break;
                }
            },
            error: function (jqXHR, textStatus) {
                toastr.error("获取年级列表失败");
            }
        });
    }

    /*分类渲染*/
    var renderSecondCategory = function (cate) {
        var categoryDot = doT.template($("#temp_category22").text());
        $("#select2").html(categoryDot(cate));
    };
    var renderTopCategory = function (cate) {
        var categoryDot = doT.template($("#temp_category11").text());
        $("#select1").html(categoryDot(cate));
        $("#select1 dd:eq(0)").click();
    };

    /*分类处理*/
    var handleCategory = function () {
        category.list(renderTopCategory);
    };

    /*课程列表分页渲染
     * 参数说明：
     * target：显示目标位置
     * template：显示使用的模版
     * data：用于填充的数据*/
    var renderPagination = function (target, template, data) {
        var PaginationDot = doT.template($(template).text());
        $(target).html(PaginationDot(data));
        if ($('.pagination li').size() < 4) {
            $('.pagination').hide();
        }
        else {
            $('.pagination').show();
        }
    };

    /*根据分类查询课程列表*/
    var queryCourses = function (page) {
        /*查询参数获取*/
        var gradeId = ''
        if ($('#selectG').length == 1) gradeId = $('#selectG').data('grade-id')
        var topId = ''
        if ($('#selectA').length == 1) topId = $('#selectA').data('cate-id')
        var subId = ''
        if ($('#selectB').length == 1) subId = $('#selectB').data('cate-id')
        var start = 0
        if (page) start = (page - 1) * 12
        /*展示分类课程列表*/
        var data = {grade_id: gradeId, top_category_id: topId, sub_category_id: subId, length: 12, start: start};
        sessionStorage.topCatId = topId;
        sessionStorage.subCatId = subId;
        var param = {
            url: origin + courseListUrl,
            data: data,
            headers: {},
            render: renderCourses,
            target: "#cate_course_list",
            template: "#temp_course_list",
            pagingRender: renderPagination,
            pagingTarget: ".pagination",
            pagingTemplate: "#temp_pagination"
        };
        course.list(param);
    }

    /*分类点击事件处理*/
    var handleClickCategory = function () {
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

        $("#cate_course").on("click","#selectG", function () {
            $(this).remove();
            $("#select0 .select-all").addClass("selected").siblings().removeClass("selected");
            queryCourses()
        });

        $("#cate_course").on("click","#selectA", function () {
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
            var lastpage = parseInt($('.pagination li.checked').text())
            var page = null
            if ($(this).is($('.pagination li:first'))) {
                page = $('.pagination li.checked').next().text()
            }
            else if ($(this).is($('.pagination li:last'))) {
                page = $('.pagination li.checked').prev().text()
            }
            else {
                page = $(this).text()
            }
            page = parseInt(page)
            if (Number.isInteger(page) && lastpage !== page ) {
                queryCourses(page)
            }
        });
    };

    /*渲染我的课程列表*/
    var handleMyCourse = function () {
        var param = {
            url: origin + "/pixedxapi/lms/users/self/course_enrollments?relation=0,2",
            data: {},
            headers: {Authorization: sessionStorage.authorization},
            render: renderCourses,
            target: "#my_course_list",
            template: "#temp_my_course_list"
        };
        course.list(param);
    };

    var handleMyFavorite = function () {
        var param = {
            url: origin + "/pixedxapi/lms/users/self/course_enrollments?relation=1",
            data: {},
            headers: {Authorization: sessionStorage.authorization},
            render: renderCourses,
            target: "#my_favorite_list",
            template: "#temp_my_course_list"
        };
        course.list(param);
    };

    /*渲染课程表*/
    var renderCourseSchedule = function (target, template, data) {
        var scheduleDot = doT.template($(template).text());
        $(target).html(scheduleDot(data));
    }

    /*我的课程表处理*/
    var handleMyCourseSchedule = function () {
        var param = {
            url: origin + "/pixedxapi/lms/users/self/schedules",
            data: {},
            headers: {Authorization: sessionStorage.authorization},
            render: renderCourseSchedule,
            target: "#my_course_schedule",
            template: "#temp_my_course_schedule"
        };
        course.schedule(param);
    };

    /*课程详情渲染*/
    var renderCourseDetails = function (target, template, data) {
        var detailsDot = doT.template($(template).text());
        $(target).html(detailsDot(data));
        $(target).off('mouseover', '.listimg');
        $(target).off('mouseout', '.listimg');
        $(target).on('mouseover', '.listimg', function () {
            $(".summary", this).stop().animate({top: '70px'}, {queue: false, duration: 180});
        });
        $(target).on('mouseout', '.listimg', function () {
            $(".summary", this).stop().animate({top: '125px'}, {queue: false, duration: 180});
        });
        $('.all-content').children().hide();
        $('.page-slider').hide();
        $("#course_details").show();
        window.history.pushState({location: 'coursedetails'}, '', '#coursedetails');
        sessionStorage.pageId = 'coursedetails';
        $(target).find('.listimg').each(function(index, item) {
            if ($(item).data('state') == 2) {
                $(item).click()
            }
        })
    };

    /*课程详情处理*/
    var handleCourseDetails = function (id) {
        var param = {
            url: origin + "/pixedxapi/lms/courses/" + id,
            data: {},
            headers: {Authorization: sessionStorage.authorization},
            render: renderCourseDetails,
            target: "#course_details_info",
            template: "#temp_course_details"
        };
        course.list(param);
    };

    /*收藏、取消收藏课程*/
    var handleRegisterCourse = function (param) {
        $.extend(param, {
            url: origin + "/pixedxapi/lms/users/self/course_enrollments/" + param.id,
            headers: {Authorization: sessionStorage.authorization},
            render: handleCourseDetails,
        });
        course.register(param);
    };

    /*课程点击事件（点击课程、收藏、取消收藏）处理*/
    var handleClickCourse = function () {
        /*进入课程详情页*/
        $(".all-content").on('click', ".course .listimg", function () {
            var id = $(this).data("id");
            handleCourseDetails(id);
        });
        /*收藏、取消收藏点击事件处理*/
        $(".all-content").on('click', "button.register,button.unregister", function () {
            if (!sessionStorage.username) {
                $("#modal_login").modal("show");
                return;
            }
            if ($(this).hasClass("register")) {
                $("#modal_register").modal("show");
            }
            else {
                $("#modal_unregister").modal("show");
            }
        });
        /*收藏Modal提交事件处理*/
        $("body").on("click", "#modal_register #register_submit", function (event) {
            event.preventDefault();
            $("#modal_register").modal("hide");
            var param = {
                id: sessionStorage.courseId,
                method: 'POST'
            };
            handleRegisterCourse(param);
        });
        /*取消收藏Modal提交事件处理*/
        $("body").on("click", "#modal_unregister #unregister_submit", function (event) {
            event.preventDefault();
            $("#modal_unregister").modal("hide");
            var param = {
                id: sessionStorage.courseId,
                method: 'DELETE'
            };
            handleRegisterCourse(param);
        });
    };

    /*点击课件事件处理*/
    var handleClickCourseware = function () {
        $("#course_details").delegate(".courseware .listimg", "click", function () {
            if (!sessionStorage.username) {
                $("#modal_login").modal("toggle");
                //toastr.warning("学习课程前，请先登录。");
                return;
            }
            /*if (sessionStorage.isRegister == 'false') {
                $("#modal_register").modal("toggle");
                return;
            }*/
            var url = $(this).data("href");
            if ($(this).data('object-type') != 5) {
                var img = $(this).data("img");
                var playlist;
                if (url.indexOf(',') >= 0) {
                    var splitedUrls = url.split(',', 2);
                    playlist = new Array(
                        {file: splitedUrls[0], image: img}, {file: splitedUrls[1], image: img}
                    );
                }
                else {
                    playlist = new Array(
                        {file: url, image: img}
                    );
                }
                $("#modal_player").modal("toggle");
                /*课件播放*/
                var player = jwplayer("preview_player").setup({
                    stretching: "fill",
                    //logo: "assets/img/corners.png",
                    //image: "assets/plugins/jwplayer/preview.jpg",
                    width: 760,
                    height: 428,
                    /*file: "",*/
                    playlist: playlist,
                    autostart: true,
                    //repeat:false,
                    primary: 'flash',
                    bufferlength: 10,
                    start: 60,
                    flashplayer: "assets/plugins/jwplayer/jwplayer.flash.swf",
                    events: {
                        onComplete: function () {
                            //player.playlistNext();
                            $("#modal_player").modal("toggle");
                        },
                    }
                });
            }
            else {
                $(this).find('a').attr('href', url);
            }
        });
    };

    /*直播间处理*/
    var handleLiveRooms = function () {
        var param = {
            url: origin + "/pixedxapi/lms/liverooms",
            data: {},
            headers: {},
            render: renderCourses,
            target: "#live_room_list",
            template: "#temp_live_room_list"
        };
        course.list(param);
    };

    /*点击直播间播放按钮处理*/
    var handleClickLiveRoomPlayButton = function () {
        $("#live_room_list").on("click", "button", function () {
            var url = $(this).data("href");
            var img = $(this).data("img");
            var playlist = new Array(
                {file: url, image: img}
            );
            $("#modal_player").modal("toggle");
            /*课件播放*/
            var player = jwplayer("preview_player").setup({
                stretching: "fill",
                width: 760,
                height: 428,
                playlist: playlist,
                autostart: true,
                primary: 'flash',
                bufferlength: 10,
                start: 60,
                flashplayer: "assets/plugins/jwplayer/jwplayer.flash.swf",
                events: {
                    onComplete: function () {
                        $("#modal_player").modal("toggle");
                    },
                }
            });
        });
    };

    /*返回对象*/
    return {
        init: function () {
            initLayerSlider();
            renderUserStatus();
            handleNavbar();
            handleGrade();
            handleCategory();
            handleClickCategory();
            handleClickCourse();
            handleClickCourseware();
            handleClickLiveRoomPlayButton();
            handleautoLogin();
        }
    };
}(user, category, course, lmsStorage);
