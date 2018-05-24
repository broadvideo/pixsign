<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%> 
<!DOCTYPE html>
<!--[if IE 8]>
<html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]>
<html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en"> <!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
    <meta charset="utf-8"/>
    <title>会议预订</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <meta content="" name="description"/>
    <meta content="elvis" name="author"/>

    <!-- BEGIN GLOBAL MANDATORY STYLES -->
    <link href="${base_ctx}/assets/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>
    <link href="${base_ctx}/assets/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
    <!-- END GLOBAL MANDATORY STYLES -->

    <!-- BEGIN PAGE LEVEL PLUGIN STYLES -->
    <link href="${base_ctx}/assets/plugins/fullcalendar2/fullcalendar.min.css" rel="stylesheet"/>
    <link href="${base_ctx}/assets/plugins/fancybox/source/jquery.fancybox.css" rel="stylesheet"/>
    <link href="${base_ctx}/assets/plugins/bootstrap-modal/css/bootstrap-modal-bs3patch.css" rel="stylesheet" type="text/css"/>
    <link href="${base_ctx}/assets/plugins/bootstrap-modal/css/bootstrap-modal.css" rel="stylesheet" type="text/css"/>
    <link rel="stylesheet" type="text/css" href="${base_ctx}/assets/plugins/bootstrap-toastr/toastr.min.css"/>
    <link rel="stylesheet" href="${base_ctx}/assets/plugins/jstree/dist/themes/default/style.min.css" type="text/css"/>
    <link href="${base_ctx}/assets/plugins/bxslider/jquery.bxslider.css" rel="stylesheet"/>
    <link href="${base_ctx}/assets/plugins/multi-select/css/style.css" rel="stylesheet"/>
    <link rel="stylesheet" href="${base_ctx}/assets/plugins/layerslider/css/layerslider.css" type="text/css">
    <link href="${base_ctx}/assets/plugins/lrtk/css/lrtk.css" rel="stylesheet"/>
    <!-- END PAGE LEVEL PLUGIN STYLES -->

    <!-- BEGIN THEME STYLES -->
    <link href="${base_ctx}/assets/css/style-metronic.css" rel="stylesheet" type="text/css"/>
    <link href="${base_ctx}/assets/css/plugins.css" rel="stylesheet" type="text/css"/>
    <link href="${base_ctx}/assets/css/style.css" rel="stylesheet" type="text/css"/>
    <link href="${base_ctx}/assets/css/themes/blue.css" rel="stylesheet" type="text/css" id="style_color"/>
    <link href="${base_ctx}/assets/css/style-responsive.css" rel="stylesheet" type="text/css"/>
    <link href="${base_ctx}/assets/css/custom.css" rel="stylesheet" type="text/css"/>
    <!-- END THEME STYLES -->

    <link rel="shortcut icon" href="favicon.ico"/>
</head>
<!-- END HEAD -->

<!-- BEGIN BODY -->
<body>
<!-- BEGIN HEADER -->
<div class="header navbar navbar-default navbar-static-top">
    <!-- BEGIN TOP BAR -->
    <div class="front-topbar">
        <div class="container">
            <div class="row">
                <div class="col-md-9 col-sm-9">
                    <ul class="list-unstyled inline">
                        <li>会议预订</li>
                    </ul>
                </div>
                <div class="col-md-3 col-sm-3 login-reg-links">
                    <ul class="list-unstyled inline">
                        <li id="userinfo"></li>
                        <!--<li><a id="login" style="color:rebeccapurple">登录</a></li>
                        <li><a id="logout" style="color:darkred;display: none">退出</a></li>-->
                        <li id="downloadapp" title="下载APP" style="color:green;display:none;">下载APP</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <!-- END TOP BAR -->
    <div class="container">
        <div class="navbar-header">
            <img src="${base_ctx}/assets/img/PixBox-logo.png" id="logoimg" alt="">
        </div>

        <!-- BEGIN TOP NAVIGATION MENU -->
        <div class="navbar-collapse collapse">
            <ul class="nav navbar-nav pull-left main-menu">
                <li class="dropdown active" id="dashboard">
                    <a>首页</a>
                </li>
                <li class="dropdown" id="meeting">
                    <a>会议列表</a>
                </li>
                <li class="dropdown" id="my-meeting">
                    <a>我的会议</a>
                </li>

                <li class="menu-search" style="display:none">
                    <span class="sep"></span>
                    <i class="fa fa-search search-btn"></i>

                    <div class="search-box">
                        <form action="#">
                            <div class="input-group input-large">
                                <input class="form-control" type="text" placeholder="Search">
                                <span class="input-group-btn">
                                        <button type="submit" class="btn theme-btn">会议检索</button>
                                    </span>
                            </div>
                        </form>
                    </div>
                </li>
            </ul>
        </div>
        <!-- BEGIN TOP NAVIGATION MENU -->
    </div>
</div>
<!-- END HEADER -->

<!-- BEGIN PAGE CONTAINER -->
<div class="container" id="dashboard2">
    <div class="row basic-summary" style="margin: 20px -5px;"></div>
    <div class="row">
        <div class="col-md-6 meeting-sum"></div>
        <div class="col-md-6 room-sum"></div>
    </div>
    <div class="row">
        <div class="col-md-6 week-hot-rooms"></div>
        <div class="col-md-6 month-hot-rooms"></div>
    </div>
</div>
<div class="container" style="margin-top:20px;display: none" id="meeting2">
    <div class="row">
        <div class="col-md-12">
            <ul class="select">
                <li class="select-list">
                    <dl id="select1">
                        <dt>写字楼：</dt>
                        <dd class="select-none selected"><a href="#">未选</a></dd>
                    </dl>
                </li>
                <li class="select-list">
                    <dl id="select2">
                        <dt>会议室：</dt>
                        <dd class="select-none selected"><a href="#">未选</a></dd>
                    </dl>
                </li>
                <li class="select-result">
                    <dl>
                        <dt>已选会议室：</dt>
                        <dd class="select-no">无过滤条件</dd>
                    </dl>
                </li>
            </ul>
        </div>
        <div class="col-md-12" style="margin-top: 20px;">
            <div id="calendar" class="has-toolbar"></div>
        </div>
    </div>
</div>
<div class="container" id="my-meeting2" style="display: none">
    <div class="row" id="my-meeting-list"></div>
</div>
<!-- END PAGE CONTAINER -->
<div id="template_container" style="display: none"></div>
<!-- BEGIN FOOTER -->
<div class="footer">
    <p>Copyright ©2014-2017 明视广博 版权所有</p>
    <p>地址：深圳市科技园虚拟大学园综合楼C604 邮编：518057 </p>
</div>
<!-- END FOOTER -->

<!-- Load javascripts at bottom, this will reduce page load time -->
<!-- BEGIN CORE PLUGINS(REQUIRED FOR ALL PAGES) -->
<!--[if lt IE 9]>
<script src="${base_ctx}/assets/plugins/respond.min.js"></script>
<![endif]-->
<script src="${base_ctx}/assets/plugins/jquery-1.10.2.min.js" type="text/javascript"></script>
<script src="${base_ctx}/assets/plugins/jquery.form.js" type="text/javascript"></script>
<script src="${base_ctx}/assets/plugins/jquery.serializejson.js" type="text/javascript"></script>
<script src="${base_ctx}/assets/plugins/jquery-migrate-1.2.1.min.js" type="text/javascript"></script>
<script src="${base_ctx}/assets/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script type="text/javascript" src="${base_ctx}/assets/plugins/back-to-top.js"></script>

<!-- END CORE PLUGINS -->

<!-- BEGIN PAGE LEVEL JAVASCRIPTS(REQUIRED ONLY FOR CURRENT PAGE) -->
<script src="${base_ctx}/assets/plugins/bootstrap-modal/js/bootstrap-modalmanager.js"></script>
<script src="${base_ctx}/assets/plugins/bootstrap-modal/js/bootstrap-modal.js"></script>
<script src="${base_ctx}/assets/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
<script type='text/javascript' src="${base_ctx}/assets/plugins/jquery.cokie.min.js"></script>
<script src="${base_ctx}/assets/plugins/doT.min.js"></script>
<script src="${base_ctx}/assets/plugins/lrtk/js/lrtk.js"></script>
<script src="${base_ctx}/assets/plugins/moment-with-locales.js"></script>
<script src="${base_ctx}/assets/plugins/fullcalendar2/fullcalendar.js"></script>
<script src="${base_ctx}/assets/plugins/fullcalendar2/lang-all.js"></script>
<script src="${base_ctx}/assets/plugins/jstree/dist/jstree.min.js"></script>
<script src="${base_ctx}/assets/plugins/echarts/echarts.js"></script>
<script type="text/javascript" src="${base_ctx}/assets/plugins/bxslider/jquery.bxslider.min.js"></script>
<script type="text/javascript" src="${base_ctx}/assets/plugins/bootstrap-toastr/toastr.min.js"></script>
<script type='text/javascript' src="${base_ctx}/assets/plugins/CryptoJS-v3.1.2/components/core.js"></script>
<script type='text/javascript' src="${base_ctx}/assets/plugins/CryptoJS-v3.1.2/rollups/aes.js"></script>
<script type='text/javascript' src="${base_ctx}/assets/plugins/CryptoJS-v3.1.2/components/mode-ecb-min.js"></script>
<script type='text/javascript' src="${base_ctx}/assets/plugins/CryptoJS-v3.1.2/components/enc-base64-min.js"></script>
<script type='text/javascript' src="${base_ctx}/assets/plugins/CryptoJS-v3.1.2/components/pad-nopadding.js"></script>
<script type='text/javascript' src="${base_ctx}/assets/plugins/jquery.qrcode.min.js"></script>

<!-- BEGIN LayerSlider -->
<script src="${base_ctx}/assets/plugins/layerslider/jQuery/jquery-easing-1.3.js" type="text/javascript"></script>
<script src="${base_ctx}/assets/plugins/layerslider/jQuery/jquery-transit-modified.js" type="text/javascript"></script>
<script src="${base_ctx}/assets/plugins/layerslider/js/layerslider.transitions.js" type="text/javascript"></script>
<script src="${base_ctx}/assets/plugins/layerslider/js/layerslider.kreaturamedia.jquery.js" type="text/javascript"></script>
<!-- END LayerSlider -->

<!--加载模版-->
<script>$("#template_container").load("${base_ctx}/assets/templates/index-tpl.html");</script>
<script src="${base_ctx}/assets/scripts/app.js"></script>
<script src="${base_ctx}/assets/scripts/user.js"></script>
<script src="${base_ctx}/assets/scripts/meeting.js"></script>
<script type="text/javascript">
    jQuery(document).ready(function () {
        App.init();
        Meeting.init();
    });
</script>
<div id="nest_modal"></div>
</body>
<!-- END BODY -->
</html>