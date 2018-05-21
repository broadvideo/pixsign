/*Live Module*/
var origin = 'http://192.168.0.102:8080/pixmrbs-api';
var user = function () {
    var user = {};
    /*登录方法*/
    user.login = function (data, success) {
        if (data.username == "" || data.password == "") {
            toastr.warning("用户密码不能为空，请填写。");
            return;
        }
        $.ajax({
            url: origin + "/users/auth",
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            data: JSON.stringify(data),
            success: function (result) {
                switch (result.retcode) {
                    case 0:
                        sessionStorage.authorization = result.token.token_type + " " + result.token.access_token;
                        $.ajax({
                            url: origin + "/users/self/profile",
                            type: "GET",
                            headers: {Authorization: sessionStorage.authorization},
                            contentType: 'application/json; charset=utf-8',
                            dataType: "json",
                            success: function (result) {
                                switch (result.retcode) {
                                    case 0:
                                        sessionStorage.username = result.profile.name;
                                        sessionStorage.userid = result.profile.user_id;
                                        success();
                                        break;
                                    default:
                                        toastr.error("获取用户信息失败。");
                                        break;
                                }
                            }
                        });
                        break;
                }
            }
        });
    };
    /*自动登录方法*/
    user.autoLogin = function (data, success) {
        sessionStorage.authorization = data;
        $.ajax({
            url: origin + "/pixedxapi/lms/users/self/profile",
            type: "GET",
            headers: {Authorization: sessionStorage.authorization},
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            success: function (result) {
                switch (result.retcode) {
                    case 0:
                        sessionStorage.username = result.profile.name;
                        success();
                        break;
                    default:
                        toastr.error("获取用户信息失败。");
                        break;
                }
            }
        });
    };
    /*登出方法*/
    user.logout = function (success) {
        bootbox.confirm({
            buttons: {
                confirm: {label: "确认"},
                cancel: {label: "取消"}
            },
            message: "您准备退出登录？",
            callback: function (result) {
                if (result) {
                    sessionStorage.removeItem("authorization");
                    sessionStorage.removeItem("username");
                    success();
                    location.href = origin + "/pixedx/j_spring_security_logout"
                }
            },
        });
    };
    return user;
}();

