var Index = function () {

    /*课程详情渲染*/
    var tokenLgoin = function () {
        var token = $.url('?token', location.href);
        var redirect = $.url('?redirect_url', location.href);
        if (token == undefined) {
            toastr.warning("无效token,跳转失败。");
            return;
        }

        $.ajax({
            url: "/pixedxapi/lms/users/sso_auth?token=" + encodeURIComponent(token),
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            success: function (result) {
                switch (result.retcode) {
                    case 0:
                        sessionStorage.authorization = result.token.token_type + " " + result.token.access_token;
                        $.ajax({
                            url: "/pixedxapi/lms/users/self/profile",
                            type: "GET",
                            headers: {Authorization: sessionStorage.authorization},
                            contentType: 'application/json; charset=utf-8',
                            dataType: "json",
                            success: function (result) {
                                switch (result.retcode) {
                                    case 0:
                                        sessionStorage.username = result.profile.name;
                                        if (result.profile.outer_auth_url != null) {
                                            sessionStorage.outerAuthUrl = result.profile.outer_auth_url;
                                        }
                                        location.href = '/pixlms/';
                                        break;
                                    default:
                                        toastr.error("获取用户信息失败。");
                                        break;

                                }
                            }
                        });
                        break;
                    default:
                        toastr.error("无效token,跳转失败。");
                        break;
                }
            }
        });
    };

    /*返回对象*/
    return {
        init: function () {
            tokenLgoin();
        }
    };
}();