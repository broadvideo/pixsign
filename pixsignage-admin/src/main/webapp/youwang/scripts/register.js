var Register = function () {
	
	var init = function () {
		handleRegister();
	};

	var handleRegister = function() {
		$.validator.addMethod('checkUsername', function(value,element,params) {
			var checkUsername = /^[a-zA-Z0-9_-]{4,16}$/; //用户名正则，4到16位（字母，数字，下划线，减号）
			return this.optional(element)||(checkUsername.test(value));
		}, '用户名格式有误');
		$.validator.addMethod('checkPassword', function(value,element,params) {
			var checkPassword = /^[a-zA-Z\d!@#$%^&*]{6,}$/; //密码正则，6
			return this.optional(element)||(checkPassword.test(value));
		}, '密码格式有误');
		$.validator.addMethod('checkPhone', function(value,element,params) {
			var checkPhone = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/; //手机号正则
			return this.optional(element)||(checkPhone.test(value));
		}, '手机号格式有误');
		$('#RegisterForm').validate({
			errorElement: 'span', 
			errorClass: 'help-block', 
			focusInvalid: false, 
			rules: {
				username: {
					required: true,
					minlength: 4,
					checkUsername: true,
					remote: {
						url: '/pixsignage/register!validate.action',
						type: 'post',
						data: {
							'username': function() {
								return $('#RegisterForm input[name="username"]').val();
							}
						},
						dataFilter: function(responseString) {
							var response = $.parseJSON(responseString);
							if (response.errorcode == 0) {
								return true;
							}
							return false;
						}
					}
				},
				phone: {
					required: true,
					minlength: 11,
					checkPhone: true,
					remote: {
						url: '/pixsignage/register!validate.action',
						type: 'post',
						data: {
							'phone': function() {
								return $('#RegisterForm input[name="phone"]').val();
							}
						},
						dataFilter: function(responseString) {
							var response = $.parseJSON(responseString);
							if (response.errorcode == 0) {
								return true;
							}
							return false;
						}
					}
				},
				password: {
					required: true,
					minlength: 6,
					checkPassword: true,
				}
			},
			messages: {
				'username': {
					remote: common.tips.username_repeat,
					required: common.tips.username_required
				},
				'phone': {
					remote: common.tips.phone_repeat,
					required: common.tips.phone_required
				},
				password: {
					required: common.tips.password_required
				},
			},
			invalidHandler: function (event, validator) {
				$('.alert-danger span', $('#RegisterForm')).html(common.tips.input_check);
				$('.alert-danger', $('#RegisterForm')).show();
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
				$.ajax({
					type : 'POST',
					url : '/pixsignage/register.action',
					data : $('#RegisterForm').serialize(),
					beforeSend: function ( xhr ) {
						Metronic.startPageLoading({animate: true});
					},
					success : function(data, status) {
						Metronic.stopPageLoading();
						if (data.errorcode == 0) {
							window.location.href = '../index_yw.jsp';
						} else {
							$('.alert-danger span', $('#RegisterForm')).html(common.tips.register_failed);
							$('.alert-danger', $('#RegisterForm')).show();
						}
					},
					error : function() {
						Metronic.stopPageLoading();
						console.log('failue');
					}
				});
			}
		});
		
		$('#GetVCode').html(common.view.send);
		$('#GetVCode').on('click', function(event) {
			if ($('#RegisterForm').valid()) {
				$.ajax({
					type : 'POST',
					url : '/pixsignage/register!getvcode.action',
					data : {
						phone: $('#RegisterForm input[name="phone"]').val(),
					},
					beforeSend: function ( xhr ) {
						$('#GetVCode').attr('disabled', 'true');
					},
					success : function(data, status) {
						if (data.errorcode == 0) {
							countdown(60);
						} else {
							$('#GetVCode').removeAttr('disabled');
							$('.alert-danger span', $('#RegisterForm')).html(common.tips.getvcode_failed);
							$('.alert-danger', $('#RegisterForm')).show();
						}
					},
					error : function() {
						$('#GetVCode').removeAttr('disabled');
						console.log('failue');
					}
				});
			}
		});
		var countdown = function(time) {
			$('#GetVCode').html(time);
			if (time > 0) {
				setTimeout(countdown, 1000, time-1); 
			} else {
				$('#GetVCode').html(common.view.send);
				$('#GetVCode').removeAttr('disabled');
			}
		}

		$('#RegisterForm input').keypress(function (e) {
			if (e.which == 13) {
				if ($('#RegisterForm').validate().form()) {
					$('#RegisterForm').submit();
				}
				return false;
			}
		});
	};

	
	return {
		init: init,
	}
	
}();
