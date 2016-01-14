var Login = function () {

	var handleOrgLogin = function() {
		$('input[name=username]', $('#OrgLoginForm')).attr('value', $.cookie('org.username'));
		$('input[name=code]', $('#OrgLoginForm')).attr('value', $.cookie('org.code'));
		$('input[name=password]', $('#OrgLoginForm')).attr('value', '');

		if ($.cookie('org.remember') == 'true') {
			$('input[name=remember]', $('#OrgLoginForm')).attr('checked', true);
			$('input[name=remember]', $('#OrgLoginForm')).parent().addClass('checked');
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
	                    required: common.tips.username_required
	                },
	                password: {
	                    required: common.tips.password_required
	                },
	                code: {
	                    required: common.tips.code_required
	                },
	            },
	            invalidHandler: function (event, validator) {
	            	$('.alert-danger span', $('#OrgLoginForm')).html(common.tips.input_check);
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
		            	$.cookie('org.username', $('input[name=username]', $('#OrgLoginForm')).attr('value'), {expires:10});
		            	$.cookie('org.code', $('input[name=code]', $('#OrgLoginForm')).attr('value'), {expires:10});
		            	$.cookie('org.remember', true, {expires:10});
	            	} else {
		            	$.removeCookie('org.username');
		            	$.removeCookie('org.code');
		            	$.cookie('org.remember', false);
	            	}
					$.ajax({
						type : 'POST',
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
								$('.alert-danger span', $('#OrgLoginForm')).html(common.tips.login_failed);
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
		$('input[name=username]', $('#VspLoginForm')).attr('value', $.cookie('vsp.username'));
		$('input[name=code]', $('#VspLoginForm')).attr('value', $.cookie('vsp.code'));
		$('input[name=password]', $('#VspLoginForm')).attr('value', '');

		if ($.cookie('vsp.remember') == 'true') {
			$('input[name=remember]', $('#VspLoginForm')).attr('checked', true);
			$('input[name=remember]', $('#VspLoginForm')).parent().addClass('checked');
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
	                    required: common.tips.username_required
	                },
	                password: {
	                    required: common.tips.password_required
	                }
	            },

	            invalidHandler: function (event, validator) { 
	            	$('.alert-danger span', $('#VspLoginForm')).html(common.tips.input_check);
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
		            	$.cookie('vsp.username', $('input[name=username]', $('#VspLoginForm')).attr('value'), {expires:10});
		            	$.cookie('vsp.code', $('input[name=code]', $('#VspLoginForm')).attr('value'), {expires:10});
		            	$.cookie('vsp.remember', true, {expires:10});
	            	} else {
		            	$.removeCookie('vsp.username');
		            	$.removeCookie('vsp.code');
		            	$.cookie('vsp.remember', false);
	            	}

					$.ajax({
						type : 'POST',
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
								$('.alert-danger span', $('#VspLoginForm')).html(common.tips.login_failed);
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
		        '/pixres/admin/pages/media/bg/1.jpg',
		        '/pixres/admin/pages/media/bg/2.jpg',
		        '/pixres/admin/pages/media/bg/3.jpg',
		        '/pixres/admin/pages/media/bg/4.jpg'
		        ], {
		          fade: 1000,
		          duration: 8000
		    });
        }

    };

}();