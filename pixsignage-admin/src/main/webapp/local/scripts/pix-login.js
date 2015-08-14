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
	            errorElement: 'span', //default input error message container
	            errorClass: 'help-block', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
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
	            invalidHandler: function (event, validator) { //display error alert on form submit   
	            	$('.alert-danger span', $('#OrgLoginForm')).html('请检查输入项。');
	            	$('.alert-danger', $('#OrgLoginForm')).show();
	            },
	            highlight: function (element) { // hightlight error inputs
	                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
	            },
	            success: function (label) {
	                label.closest('.form-group').removeClass('has-error');
	                label.remove();
	            },
	            errorPlacement: function (error, element) {
	                error.insertAfter(element.closest('.input-icon'));
	            },
	            submitHandler: function (form) {
	            	$.cookie("login.tab", 'org');
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
						url : $('#OrgLoginForm').attr('action'),
						data : $('#OrgLoginForm').serialize(),
						beforeSend: function ( xhr ) {
							App.blockUI($('.tab-content'));
						},
						success : function(data, status) {
							App.unblockUI($('.tab-content'));
							if (data.errorcode == 0) {
								window.location.href = 'main.jsp';
							} else {
								$('.alert-danger span', $('#OrgLoginForm')).html('信息输入有误，登陆失败。');
				            	$('.alert-danger', $('#OrgLoginForm')).show();
							}
						},
						error : function() {
							App.unblockUI($('.tab-content'));
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
	            errorElement: 'span', //default input error message container
	            errorClass: 'help-block', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
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

	            invalidHandler: function (event, validator) { //display error alert on form submit   
	            	$('.alert-danger span', $('#VspLoginForm')).html('请检查输入项。');
	                $('.alert-danger', $('#VspLoginForm')).show();
	            },

	            highlight: function (element) { // hightlight error inputs
	                $(element)
	                    .closest('.form-group').addClass('has-error'); // set error class to the control group
	            },

	            success: function (label) {
	                label.closest('.form-group').removeClass('has-error');
	                label.remove();
	            },

	            errorPlacement: function (error, element) {
	                error.insertAfter(element.closest('.input-icon'));
	            },

	            submitHandler: function (form) {
	            	$.cookie("login.tab", 'vsp');
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
						url : $('#VspLoginForm').attr('action'),
						data : $('#VspLoginForm').serialize(),
						beforeSend: function ( xhr ) {
							App.blockUI($('.tab-content'));
						},
						success : function(data, status) {
							App.unblockUI($('.tab-content'));
							if (data.errorcode == 0) {
								window.location.href = 'main.jsp';
							} else {
								$('.alert-danger span', $('#VspLoginForm')).html('信息输入有误，登陆失败。');
				            	$('.alert-danger', $('#VspLoginForm')).show();
							}
						},
						error : function() {
							App.unblockUI($('.tab-content'));
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
	       
            /*
            if ($.cookie("login.tab") == 'vsp') {
            	$('#li_org').removeClass('active');
            	$('#tab_org').removeClass('active in');
            	$('#li_vsp').addClass('active');
            	$('#tab_vsp').addClass('active in');
            } else {
            	$('#li_org').addClass('active');
            	$('#tab_org').addClass('active in');
            	$('#li_vsp').removeClass('active');
            	$('#tab_vsp').removeClass('active in');            	
            }*/
            
	       	$.backstretch([
		        "../assets/img/bg/1.jpg",
		        "../assets/img/bg/2.jpg",
		        "../assets/img/bg/3.jpg",
		        "../assets/img/bg/4.jpg"
		        ], {
		          fade: 1000,
		          duration: 8000
		    });
        }

    };

}();