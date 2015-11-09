var Login = function () {

	var handleOrgLogin = function() {
		$('input[name=username]', $('#OrgLoginForm')).attr('value', $.cookie("org.username"));
		$('input[name=code]', $('#OrgLoginForm')).attr('value', $.cookie("org.code"));
		$('input[name=password]', $('#OrgLoginForm')).attr('value', '');

		if ($.cookie("org.remember") == 'true') {
			$('input[name=remember]', $('#OrgLoginForm')).attr("checked", true);
			$('input[name=remember]', $('#OrgLoginForm')).parent().addClass("checked");
		}

		$('#OrgLoginForm').validate({
	            errorElement: 'span', 
	            errorClass: 'help-block', 
	            focusInvalid: false, 
	            rules: {
	                username: {
	                    required: true
	                },
	                password: {
	                    required: true
	                },
	                code: {
	                    required: true
	                },
	                remember: {
	                    required: false
	                }
	            },
	            messages: {
	                username: {
	                    required: "必须输入用户名."
	                },
	                password: {
	                    required: "必须输入密码."
	                },
	                code: {
	                    required: "必须输入企业编码."
	                },
	            },
	            invalidHandler: function (event, validator) {
	            	$('.alert-danger span', $('#OrgLoginForm')).html('请检查输入项。');
	            	$('.alert-danger', $('#OrgLoginForm')).show();
	            },
	            highlight: function (element) {
	                $(element).closest('.form-group').addClass('has-error');
	            },
	            success: function (label) {
	                label.closest('.form-group').removeClass('has-error');
	                label.remove();
	            },
	            errorPlacement: function (error, element) {
	                error.insertAfter(element.closest('.input-icon'));
	            },
	            submitHandler: function (form) {
	            	if ($('input[name=remember]', $('#OrgLoginForm')).prop('checked')) {
		            	$.cookie("org.username", $('input[name=username]', $('#OrgLoginForm')).attr('value'), {expires:10});
		            	$.cookie("org.code", $('input[name=code]', $('#OrgLoginForm')).attr('value'), {expires:10});
		            	$.cookie("org.remember", true, {expires:10});
	            	} else {
		            	$.removeCookie("org.username");
		            	$.removeCookie("org.code");
		            	$.cookie("org.remember", false);
	            	}
					$.ajax({
						type : "POST",
						url : 'org/login!org',
						data : $('#OrgLoginForm').serialize(),
						beforeSend: function ( xhr ) {
							Metronic.startPageLoading({animate: true});
						},
						success : function(data, status) {
							Metronic.stopPageLoading();
							if (data.errorcode == 0) {
								window.location.href = 'main.jsp';
							} else {
								$('.alert-danger span', $('#OrgLoginForm')).html('信息输入有误，登陆失败。');
				            	$('.alert-danger', $('#OrgLoginForm')).show();
							}
						},
						error : function() {
							Metronic.stopPageLoading();
							alert('failure');
						}
					});
	            }
	        });

	        $('#OrgLoginForm input').keypress(function (e) {
	            if (e.which == 13) {
	                if ($('#OrgLoginForm').validate().form()) {
	                    $('#OrgLoginForm').submit();
	                }
	                return false;
	            }
	        });
	};

	var handleVspLogin = function() {
		$('input[name=username]', $('#VspLoginForm')).attr('value', $.cookie("vsp.username"));
		$('input[name=code]', $('#VspLoginForm')).attr('value', $.cookie("vsp.code"));
		$('input[name=password]', $('#VspLoginForm')).attr('value', '');

		if ($.cookie("vsp.remember") == 'true') {
			$('input[name=remember]', $('#VspLoginForm')).attr("checked", true);
			$('input[name=remember]', $('#VspLoginForm')).parent().addClass("checked");
		}
		
		$('#VspLoginForm').validate({
	            errorElement: 'span', 
	            errorClass: 'help-block', 
	            focusInvalid: false, 
	            rules: {
	                username: {
	                    required: true
	                },
	                password: {
	                    required: true
	                },
	                code: {
	                    required: false
	                },
	                remember: {
	                    required: false
	                }
	            },

	            messages: {
	                username: {
	                    required: "必须输入用户名."
	                },
	                password: {
	                    required: "必须输入密码."
	                }
	            },

	            invalidHandler: function (event, validator) { 
	            	$('.alert-danger span', $('#VspLoginForm')).html('请检查输入项。');
	                $('.alert-danger', $('#VspLoginForm')).show();
	            },

	            highlight: function (element) { 
	                $(element)
	                    .closest('.form-group').addClass('has-error'); 
	            },

	            success: function (label) {
	                label.closest('.form-group').removeClass('has-error');
	                label.remove();
	            },

	            errorPlacement: function (error, element) {
	                error.insertAfter(element.closest('.input-icon'));
	            },

	            submitHandler: function (form) {
	            	if ($('input[name=remember]', $('#VspLoginForm')).prop('checked')) {
		            	$.cookie("vsp.username", $('input[name=username]', $('#VspLoginForm')).attr('value'), {expires:10});
		            	$.cookie("vsp.code", $('input[name=code]', $('#VspLoginForm')).attr('value'), {expires:10});
		            	$.cookie("vsp.remember", true, {expires:10});
	            	} else {
		            	$.removeCookie("vsp.username");
		            	$.removeCookie("vsp.code");
		            	$.cookie("vsp.remember", false);
	            	}

					$.ajax({
						type : "POST",
						url : 'vsp/login!vsp',
						data : $('#VspLoginForm').serialize(),
						beforeSend: function ( xhr ) {
							Metronic.startPageLoading({animate: true});
						},
						success : function(data, status) {
							Metronic.stopPageLoading();
							if (data.errorcode == 0) {
								window.location.href = 'main.jsp';
							} else {
								$('.alert-danger span', $('#VspLoginForm')).html('信息输入有误，登陆失败。');
				            	$('.alert-danger', $('#VspLoginForm')).show();
							}
						},
						error : function() {
							Metronic.stopPageLoading();
							alert('failure');
						}
					});
	            }
	        });

	        $('#VspLoginForm input').keypress(function (e) {
	            if (e.which == 13) {
	                if ($('#VspLoginForm').validate().form()) {
	                    $('#VspLoginForm').submit();
	                }
	                return false;
	            }
	        });
	};
    
    return {
        //main function to initiate the module
        init: function () {
        	
            handleOrgLogin();
            handleVspLogin();     
            
	       	$.backstretch([
		        "/pixsignage-static/admin/pages/media/bg/1.jpg",
		        "/pixsignage-static/admin/pages/media/bg/2.jpg",
		        "/pixsignage-static/admin/pages/media/bg/3.jpg",
		        "/pixsignage-static/admin/pages/media/bg/4.jpg"
		        ], {
		          fade: 1000,
		          duration: 8000
		    });
        }

    };

}();