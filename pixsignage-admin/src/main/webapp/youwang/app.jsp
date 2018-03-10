<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<html>
<head>
<meta charset="utf-8" />
<style type="text/css">
html,body,div {
	background: rgba(0, 0, 0, 0);
}

.pix-div { 
	position:absolute; width:100%; height:100%; text-align:center; overflow:hidden; text-overflow:clip; white-space:nowrap; "
} 

#Container {
	position:relative; margin-left:0px; margin-right:auto; width:100%; height:100%; 
}

</style>
</head>

<body>
<div id="Container">
	<div style="position:absolute; width:100%; height:20%; top:0%; left:0%; ">
		<div id="AppName" class="pix-div" >Pixsign管理APP</div>
	</div>
	<div style="position:absolute; width:40%; height:40%; top:30%; left:30%; ">
		<a id="AppLink" href="" ><img src="../img/download.png" width="100%"></img></a>
	</div>
</div>

<script src="/pixres/global/plugins/jquery.min.js" type="text/javascript"></script>
<script>
	var Locale='<%=request.getParameter("locale")%>';
	var Name='Pixsign2c';

	jQuery(document).ready(function() {
		$('#Container').find('.pix-div').each(function() {
			var width = $(this).parent().width();
			var height = $(this).parent().height();
			var textwidth = $(this).offsetWidth;
			var fontsize = Math.min(width * 0.15, height * 0.7);
			$(this).css('font-size', fontsize + 'px');
			$(this).css('line-height', height + 'px');
		});

		$.ajax({
			type : 'GET',
			url : '/pixsignage-api/service/admin2c/getversion',
			cache: false,
			data : {
				appname: Name,
			},
			dataType : 'json',
			contentType : 'application/json;charset=utf-8',
			success : function(data, status) {
				console.log(data);
				if (data.code == 0) {
					$('#AppLink').attr('href', data.data.url);
				}
			},
			error : function() {
				console.log('error');
			}
		});				
	
	});

</script>

</body>

</html>
