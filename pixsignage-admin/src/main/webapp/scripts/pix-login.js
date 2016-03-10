var Login = function () {

	var handleLogin = function() {
		$('input[name=username]', $('#LoginForm')).attr('value', $.cookie('pixsignage.username'));
		$('input[name=password]', $('#LoginForm')).attr('value', '');

		if ($.cookie('pixsignage.remember') == 'true') {
			$('input[name=remember]', $('#LoginForm')).attr('checked', true);
			$('input[name=remember]', $('#LoginForm')).parent().addClass('checked');
		}

		$('#LoginForm').validate({
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
	            },
	            invalidHandler: function (event, validator) {
	            	$('.alert-danger span', $('#LoginForm')).html(common.tips.input_check);
	            	$('.alert-danger', $('#LoginForm')).show();
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
	            	if ($('input[name=remember]', $('#LoginForm')).prop('checked')) {
		            	$.cookie('pixsignage.username', $('input[name=username]', $('#LoginForm')).attr('value'), {expires:10});
		            	$.cookie('pixsignage.remember', true, {expires:10});
	            	} else {
		            	$.removeCookie('pixsignage.username');
		            	$.cookie('pixsignage.remember', false);
	            	}
					$.ajax({
						type : 'POST',
						url : 'login.action',
						data : $('#LoginForm').serialize(),
						beforeSend: function ( xhr ) {
							Metronic.startPageLoading({animate: true});
						},
						success : function(data, status) {
							Metronic.stopPageLoading();
							if (data.errorcode == 0) {
								if (data.staff.subsystem == 0) {
									window.location.href = 'sys/main.jsp';
								} else if (data.staff.subsystem == 1) {
									window.location.href = 'vsp/main.jsp';
								} else if (data.staff.subsystem == 2) {
									window.location.href = 'org/main.jsp';
								}
							} else {
								$('.alert-danger span', $('#LoginForm')).html(common.tips.login_failed);
				            	$('.alert-danger', $('#LoginForm')).show();
							}
						},
						error : function() {
							Metronic.stopPageLoading();
							alert('failure');
						}
					});
	            }
	        });

	        $('#LoginForm input').keypress(function (e) {
	            if (e.which == 13) {
	                if ($('#LoginForm').validate().form()) {
	                    $('#LoginForm').submit();
	                }
	                return false;
	            }
	        });
	};

    return {
        //main function to initiate the module
        init: function () {
        	
            handleLogin();
            
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