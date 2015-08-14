
function initUploadModal() {
	var queueItems = new Array();
	
    // Initialize the jQuery File Upload widget:
   $('#UploadForm').fileupload({
       disableImageResize: false,
       autoUpload: false,
       // Uncomment the following to send cross-domain cookies:
       //xhrFields: {withCredentials: true},                
       url: 'upload.action'
   });

   // Enable iframe cross-domain access via redirect option:
   $('#UploadForm').fileupload(
       'option',
       'redirect',
       window.location.href.replace(
           /\/[^\/]*$/,
           '/cors/result.html?%s'
       )
   );

   // Demo settings:
   $('#UploadForm').fileupload('option', {
       url: $('#UploadForm').fileupload('option', 'url'),
       // Enable image resizing, except for Android and Opera,
       // which actually support image resizing, but fail to
       // send Blob objects via XHR requests:
       disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
       maxFileSize: 2147483648,
       acceptFileTypes: acceptFileTypes
   });

       // Upload server status check for browsers with CORS support:
   if ($.support.cors) {
       $.ajax({
           url: 'upload.action',
           type: 'HEAD'
       }).fail(function () {
           $('<div class="alert alert-danger"/>')
               .text('上载服务器当前不可用 - ' +
                       new Date())
               .appendTo('#MyUploadForm');
       });
   }

   // Load & display existing files:
   $('#UploadForm').addClass('fileupload-processing');
   $.ajax({
       // Uncomment the following to send cross-domain cookies:
       //xhrFields: {withCredentials: true},
       url: $('#UploadForm').fileupload('option', 'url'),
       dataType: 'json',
       context: $('#UploadForm')[0]
   }).always(function () {
       $(this).removeClass('fileupload-processing');
   }).done(function (result) {
       $(this).fileupload('option', 'done')
       .call(this, $.Event('done'), {result: result});
   });

   $('#UploadForm').bind('fileuploadsubmit', function (e, data) {
       var inputs = data.context.find(':input');
       data.formData = inputs.serializeArray();
   }); 


	$('body').on('click', '.pix-add', function(event) {
		$('#UploadForm').find('.cancel').click();
		$('#UploadForm .files').html('');
		$('#UploadModal').modal();
	});			

	
	$('body').on('click', '.pix-upload-close', function(event) {
		refreshMyTable();
	});
	
	
}
