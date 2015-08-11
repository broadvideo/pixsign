var myEditModal = $('#MyEditModal');
var myEditForm = $('form', myEditModal);
var myEditFormData = myEditForm.serializeObject();


var MyEditModal = function() {
	return {
		init : function() {
			var myEditFormBody = $('.form-body', myEditForm);
			myEditFormBody.prepend('<div class="alert alert-success display-hide"><button class="close" data-close="alert"></button>输入验证成功!</div>');
			myEditFormBody.prepend('<div class="alert alert-danger display-hide"><button class="close" data-close="alert"></button>输入格式有误，请重新检查.</div>');
			var error = $('.alert-danger', myEditFormBody);
			var success = $('.alert-success', myEditFormBody);

			myEditForm.validate({
				errorElement : 'span', //default input error message container
				errorClass : 'help-block', // default input error message class
				focusInvalid : false, // do not focus the last invalid input
				ignore : "",
				rules : myeditform_rules,

				invalidHandler : function(event, validator) { //display error alert on form submit              
					success.hide();
					error.show();
					App.scrollTo(error, -200);
				},

				errorPlacement : function(error, element) { // render error placement for each input type
					var icon = $(element).parent('.input-icon').children('i');
					icon.removeClass('fa-check').addClass("fa-warning");
					icon.attr("data-original-title", error.text()).tooltip({
						'container' : 'body'
					});
				},

				highlight : function(element) { // hightlight error inputs
					$(element).closest('.form-group').addClass('has-error'); // set error class to the control group   
				},

				unhighlight : function(element) { // revert the change done by hightlight
				},

				success : function(label, element) {
					var icon = $(element).parent('.input-icon').children('i');
					$(element).closest('.form-group').removeClass('has-error')
						.addClass('has-success'); // set success class to the control group
					icon.removeClass("fa-warning").addClass("fa-check");
				},

				submitHandler : function(form) {
					success.show();
					error.hide();
				}
			});

			$('[type="submit"]', myEditModal).on('click', function(event) {
				if (myEditForm.valid()) {
					myEditForm.submit();
					success.hide();
					error.hide();
				}
			});

			myEditForm.on('submit', function(event) {
				var $form = $(this);
				var $target = $($form.attr('data-target'));
				$.ajax({
					type : $form.attr('method'),
					url : $form.attr('action'),
					data : $form.serialize(),
					success : function(data, status) {
						if (data.errorcode == 0) {
							$target.modal('hide');
							alert('操作成功');
							refreshMyTable();
						} else {
							alert(data.errorcode + ": " + data.errormsg);
						}
					},
					error : function() {
						alert('failure');
					}
				});
		
				event.preventDefault();
			});

			$('body').on('click', '.pix-add', function(event) {
				var action = myurls['common.add'];
				myEditForm.loadJSON(myEditFormData);
				myEditForm.attr("action", action);
				myEditModal.modal();
			});			

			
			$('body').on('click', '.pix-update', function(event) {
				var data = myTable.dataTable().fnGetData($(event.target).attr("data-id"));
				var action = myurls['common.update'];
				var formdata = new Object();
				for (var name in data) {
					formdata[objname + "." + name] = data[name];
				}
				myEditModal.loadJSON(formdata);
				myEditForm.attr("action", action);
				myEditModal.modal();
			});

			var currentItem;
			$('body').on('click', '.pix-delete', function(event) {
				var item = myTable.dataTable().fnGetData($(event.target).attr("data-id"));
				var action = myurls['common.delete'];
				currentItem = item;
				var confirm = $.scojs_confirm({
					content: "请确认是否删除\"" + currentItem.name + "\"",
					action: function() {
						$.ajax({
							type : "POST",
							url : action,
							cache: false,
							data : {
								"ids": currentItem[idname]
							},
							success : function(data, status) {
								if (data.errorcode == 0) {
									$('#MyTable').dataTable()._fnAjaxUpdate();
									//confirm.close();
								} else {
									alert(data.errorcode + ": " + data.errormsg);
								}
							},
							error : function() {
								alert('failure');
							}
						});
					}
				});
				confirm.show();
			});
			
		
		}
	};
}();

