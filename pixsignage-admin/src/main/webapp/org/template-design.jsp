<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%> 

<%
response.setHeader("Cache-Control","no-store");
response.setHeader("Pragrma","no-cache");
response.setDateHeader("Expires",0);

String currentPageid = "" + request.getParameter("pageid");
%>
<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!--> <html lang="en" class="no-js"> <!--<![endif]-->
<!-- BEGIN HEAD -->
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title> MVIX </title>
		<meta name="robots" content="noindex">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<!-- BEGIN GLOBAL MANDATORY STYLES -->
		<link href="${static_ctx}/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
		<link href="${static_ctx}/global/plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css" />
		<link href="${static_ctx}/global/plugins/bootstrap/css/bootstrap.css" rel="stylesheet" type="text/css" />
		<link href="${static_ctx}/global/plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css" />
		<link href="${static_ctx}/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css" rel="stylesheet" type="text/css"/>
		<link href="${static_ctx}/global/plugins/select2/select2.css" rel="stylesheet" type="text/css" />
		<link href="${static_ctx}/global/plugins/data-tables/DT_bootstrap.css" rel="stylesheet" type="text/css" />
		<link href="${static_ctx}/global/css/components.css" id="style_components" rel="stylesheet" type="text/css" />
		<link href="${static_ctx}/global/css/plugins.css" rel="stylesheet" type="text/css" />
		<link href="${static_ctx}/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css" rel="stylesheet" type="text/css"/>
		<!-- END GLOBAL MANDATORY STYLES -->
		   
		<link href="${base_ctx}/wysiwyg/css/wysiwyg.css" rel="stylesheet" type="text/css" />
		<link href="${base_ctx}/wysiwyg/css/wysiwyg_btn_${locale}.css" rel="stylesheet" type="text/css" />
		
		<!-- <link href="${base_ctx}/wysiwyg/css/css.css" rel="stylesheet" type="text/css" /> -->
		<!-- <link href="${base_ctx}/wysiwyg/css/wysiwyg2_editor.css" rel="stylesheet" type="text/css" /> -->
		<!-- <link href="${base_ctx}/wysiwyg/css/accordion_menu.css" rel="stylesheet" type="text/css" /> -->
		<!-- <link href="${base_ctx}/wysiwyg/css/editor.css" rel="stylesheet" type="text/css" /> -->
		<!-- <link href="${base_ctx}/wysiwyg/css/tutorsty.css" rel="stylesheet" type="text/css" />-->

		<link href="${base_ctx}/wysiwyg/css/jquery-ui.css" rel="stylesheet" type="text/css" />
		<link href="${base_ctx}/wysiwyg/css/ui.spinner.css" rel="stylesheet" type="text/css" />
		<link href="${base_ctx}/wysiwyg/css/jquery.qtip.css" rel="stylesheet" type="text/css" />
		<link href="${base_ctx}/wysiwyg/jqtransformplugin/jqtransform3_editor.css" rel="stylesheet" type="text/css" />

		<link href="${static_ctx}/global/plugins/wColorPicker/wColorPicker.min.css" rel="stylesheet" type="text/css"/>

		<style type="text/css">
		* {
			-webkit-box-sizing: inherit !important;
			-moz-box-sizing: inherit !important;
			box-sizing: inherit !important;
		}
		.modal {
			-webkit-box-sizing: border-box !important;
			-moz-box-sizing: border-box !important;
			box-sizing: border-box !important;
		}
		</style>

	</head>
	
	<body class="has-js">

		<div id="ImageLibraryModal" class="modal fade modal-scroll" role="dialog" data-backdrop="static">
			<div class="modal-dialog modal-full">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
					</div>
					<div class="modal-body">
						<div class="row">
							<div class="col-md-7">
			
								<div class="portlet box blue">
									<div class="portlet-title">
										<div class="caption"><i class="fa fa-reorder"></i><spring:message code="global.resource.warehouse"/></div>
										<ul class="nav nav-tabs" style="margin-left: 10px;">
											<li id="public_tab">
												<a href="#portlet_tab" data-toggle="tab">公共<spring:message code="global.image"/></a>
											</li>
											<li id="template_tab">
												<a href="#portlet_tab" data-toggle="tab">模板<spring:message code="global.image"/></a>
											</li>
											<li id="pagepkg_tab" class="active">
												<a href="#portlet_tab" data-toggle="tab">页面包<spring:message code="global.image"/></a>
											</li>
										</ul>
									</div>
									<div class="portlet-body">
										<div class="tab-content">
											<div class="tab-pane active" id="portlet_tab">
												<table id="ImageTable" class="table table-condensed table-hover">
													<thead></thead>
													<tbody></tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="col-md-5">
								<h3 class="page-title">选择图片</h3>
								<div id="ImageLibraryPreview">
								</div>
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<button type="submit" class="btn blue"><spring:message code="global.submit"/></button>
						<button class="btn default" data-dismiss="modal"><spring:message code="global.cancel"/></button>
					</div>
				</div>
			</div>
		</div>

				<div class="design_container">
					<div class="design_top"> 
						<div class="design_top_left">
							<div class="design_top_left_main">
								<div class="design_top_left_1"></div>
								<div class="design_top_left_2">
									<div class="zone_box">
										<div class="text_btn" onclick="javascript:create_text_div();">
											<a href="javascript:void(0);" rel="" title="Text" ></a>
										</div>
										<div class="image_btn" onclick="javascript:create_image_div();">
											<a href="javascript:void(0);" rel="" title="Image" ></a>
										</div>
										<div class="video_btn" onclick="javascript:create_image_div();">
											<a href="javascript:void(0);" rel="" title="Video" ></a>
										</div>
									</div>
									<div class="copy_box">
										<div class="copy_btn" onclick="javascript:cloneof_selected_div();">
											<a href="javascript:void(0);" rel="" title="Clone"></a>
										</div>
										<div class="del_btn" id="deleted_selected_all_top" onclick="javascript:deleted_selected_all();">
											<a href="javascript:void(0);" rel="" title="Delete" ></a>
										</div>
									</div>
									<div class="undo_box">
										<div class="undo_btn" id="btnUndo" onclick="">
											<a href="javascript:void(0);" rel="" title="Undo" ></a>
										</div>
										<div class="redo_btn" id="btnRedo" onclick="">
											<a href="javascript:void(0);" rel="" title="Redo" ></a>
										</div>
										<div class="dis_btn" >
											<a href="javascript:discard_all();" rel="" title="Discard" ></a>
										</div>
									</div> 
									<div class="zoom_box">
										<div class="zoomin_btn" id="zoom_in">
											<a href="javascript:void(0);" rel="" title="Zoom in" ></a>
										</div>
										<div class="zoomout_btn" id="zoom_out">
											<a href="javascript:void(0);" rel="" title="Zoom out" ></a>
										</div>										
									</div>
									<div class="grid_box">
										<div class="grid_btn" >
											<input type="hidden" name="set_ruler" id="set_ruler" value="0"/> 
											<a href="javascript:void(0);" onclick="set_ruler();" rel="" title="Show Grid" ></a>
										</div>
									</div>
									<div class="pre_box">
										<div class="pre_btn" onclick="javascript:show_template_preview();">
											<a href="javascript:void(0);" id="inline_data" rel="" title="Preview" ></a>
										</div>
									</div>
									<div class="save_box">
										<div class="save_btn" onclick="javascript:save_all_values('save', '0');">
											<a href="javascript:void(0);" rel="" title="Save"></a>
										</div>
										<div class="close1_btn" onclick="javascript:save_all_values('close', '0');">
											<a href="javascript:void(0);" title="Save & Close"></a>
										</div>
										<div class="close2_btn" onclick="javascript:save_all_values('exit', '0');">
											<a href="javascript:void(0);" title="Close without save" ></a>
										</div>
									</div>
								</div>
								<div class="design_top_left_3"></div>
								<div class="clear"></div>
							</div>
						</div>
						
						<div class="design_top_right">
							<div class="design_top_right_main">
								<div class="design_top_right_1"></div>
								<div class="design_top_right_2">
									<div class="box_y"><input type="text" id="y_position" class="box_value" value="0"/></div>
									<div class="box_x"><input type="text" id="x_position" class="box_value" value="0"/></div>
								</div>
								<div class="design_top_right_3"></div>
								<div class="clear"></div>
							</div>
						</div>
						<div class="clear"></div>
					</div>

					<div class="clear"></div>
			
					<div class="design_main">
						<div class="editor_screen">
							<table style="width:1024px;float: left;">
								<tr>
									<td align="center">
										<div class="outer_fixedwidth">
											<div class="fixedwidth" id="fixedwidth"></div>
										</div> 
									</td>
								</tr>
							</table>
						</div>	
						
						<div class="e_sidebare_box">
							<div class="sidebare_main">
								<div id="side">
									<input type="hidden" id="width_val" value=""/>
									<input type="hidden" id="height_val" value=""/>
									<ul id="acc3" class="accordion">
										<li>
											<h1 class="level1" ><spring:message code="global.page.setting"/></h1>
											<ul>
												<li class="level12">
													<div style="width:230px; height:auto; float:left; background:'url(${base_ctx}/wysiwyg/images/editor/spicy_bg.png) left top repeat-y'; padding:0 2px">
														<div style="width:230px; height:auto; float:left; background:'url(${base_ctx}/wysiwyg/images/editor/spicy_bg_h.png) left top repeat-x'; padding:0 0px">
															
															<!-- for image div settings-->
															<div id="image_div_settings" style="display: none;">
																<div id="image_select_title" class="setting_title"><spring:message code="global.page.setting.image.select"/></div>
																<div id="image_select_div" class="setting_div" style="display: none; height:72px; margin-left: 10px;">
																	<form id="image_upload_form" method="post" enctype="multipart/form-data" action='page!imgupload.action'>
																		<input type="hidden" name="pageid"/>
																		<div class="fileinput fileinput-new" data-provides="fileinput">
																			<span class="btn btn-xs blue btn-file">
																			<span class="fileinput-new"><i class="fa fa-file-image-o"></i> 上传 </span>
																			<input type="file" name="pageimage" id="pageimage" value="">
																			</span>
																		</div>
																		<div id="image_library" class="btn btn-xs green"><i class="fa fa-picture-o"></i> 图片库</div>
																		<div id="image_clear" class="btn btn-xs red"><i class="fa fa-trash-o"></i> 清除</div>
																	</form>
																</div>  
																
																<div id="image_setting_title" class="setting_title"><spring:message code="global.page.setting.image.set"/></div>
																<div id="image_setting_div" class="setting_div" style="display:none; position:relative; width:260px; height:120px; float:left;">
																	<div id="image_opacity" class="setting_opacity" style="position:absolute; left:30px; top:10px; float:left; width:150px; height:6px; color:#000;"></div>
																	<div class="icon_name" style="position:absolute; left:30px; top:20px;">0</div>
																	<div class="icon_name" style="position:absolute; left:170px; top:20px;">100</div>
																	<div class="icon_name" style="position:absolute; left:70px; top:25px;">Opacity:</div>
																	<div id="image_opacity_value" class="icon_name" style="position:absolute; left:130px; top:25px;"></div>
																	<div class="setting_spin" style="position:absolute; left:70px; top:60px; float:left;">
																		<input type="text" id="spinner_img" onchange="javascript:apply_padding_image();" oninput="javascript:apply_padding_image();" value="0"  style="width:45px;font-size:13px;"/>
																		<div class="icon_name">Padding</div>
																	</div>
																</div>
																
																<div id="image_shadow_title" class="setting_title"><spring:message code="global.page.setting.image.shadow"/></div>
																<div id="image_shadow_div" class="setting_div" style="display: none; position:relative; width:260px; height:130px; float:left;">
																	<div class="setting_spin" style="position:absolute; left:20px; top:10px; float:left;">
																		<input type="text" id="image_shadow_x" onchange="javascript:set_image_shadow();" oninput="javascript:set_image_shadow();" value="0" style="width:35px;"/>
																		<div class="icon_name">Shadow-X</div>
																	</div>
																	<div class="setting_spin" style="position:absolute; left:120px; top:10px; float:left;">
																		<input type="text" id="image_shadow_y" value="0" onchange="javascript:set_image_shadow();" oninput="javascript:set_image_shadow();" style="width:35px;"/>
																		<div class="icon_name">Shadow-Y</div>
																	</div>
																	<div id="image_shadow_color" class="setting_color" style="position:absolute; left:20px; top:75px; float:left;">
																		<a href="JavaScript:void(0);"></a>
																		<div class="icon_name">Color</div>
																	</div>
																	<div class="setting_spin" style="position:absolute; left:120px; top:75px; float:left;">
																		<input type="text" id="image_shadow_blur" value="0" onchange="javascript:set_image_shadow();" oninput="javascript:set_image_shadow();" style="width:35px;"/>
																		<div class="icon_name">Shadow-blur</div>
																	</div>
																</div>
															</div> 
									
															<!-- for text div settings -->									
															<div id="text_div_settings" style="display: none;">
																<!-- Font Settings -->
																<div id="text_font_title" class="setting_title"><spring:message code="global.page.setting.text.font"/></div>
																<div id="text_font_div" class="setting_div" style="display: none; position:relative; width:260px; height:190px; float:left;">
																	<div class="setting_font_family">
																		<select id="text_font_family" onchange="javascript:set_font_family();" >
																			<option data-font-file='Actor.woff' value='actor' style="font-family: 'actor';">Actor</option>
																			<option data-font-file='AdventPro.woff' value='advent pro' style="font-family: 'advent pro';">Advent pro</option>
																			<option data-font-file='ArchitectsDaughter.TTF' value='Architects Daughter' style="font-family: 'Architects Daughter';">Architects Daughter</option>
																			<option data-font-file='arial.ttf' value='arial' style="font-family: 'arial';">Arial</option>
																			<option data-font-file='ARIBLK.TTF' value='Ariblk' style="font-family: 'Ariblk';">Ariblk</option>
																			<option data-font-file='Arizonia.woff' value='arizonia' style="font-family: 'arizonia';">Arizonia</option>
																			<option data-font-file='Armata.woff' value='armata' style="font-family: 'armata';">Armata</option>
																			<option data-font-file='ITCAvantGardeGothicLTBookOblique_0.ttf' value='AvantGardeLT Bookoblique' style="font-family: 'AvantGardeLT Bookoblique';">AvantGardeLT Bookoblique</option>
																			<option data-font-file='ITCAvantGardeGothicLTDemi_0.ttf' value='AvantGardeLT Demi' style="font-family: 'AvantGardeLT Demi';">AvantGardeLT Demi</option>
																			<option data-font-file='BankGothicBold.ttf' value='BankGothicBold' style="font-family: 'BankGothicBold';">BankGothicBold</option>
																			<option data-font-file='BankGothicMedium.ttf' value='BankGothicMedium' style="font-family: 'BankGothicMedium';">BankGothicMedium</option>
																			<option data-font-file='Bebas.TTF' value='Bebas' style="font-family: 'Bebas';">Bebas</option>
																			<option data-font-file='Belgrano.woff' value='belgrano' style="font-family: 'belgrano';">Belgrano</option>
																			<option data-font-file='Belleza.woff' value='belleza' style="font-family: 'belleza';">Belleza</option>
																			<option data-font-file='berlin-sans-fb-demi-bold.ttf' value='berlinsans' style="font-family: 'berlinsans';">Berlinsans</option>
																			<option data-font-file='BOOKOS.TTF' value='Bookman old' style="font-family: 'Bookman old';">Bookman old</option>
																			<option data-font-file='BOOKOSBI.TTF' value='Bookman old bi' style="font-family: 'Bookman old bi';">Bookman old bi</option>
																			<option data-font-file='BOOKOSB.TTF' value='Bookman old bold' style="font-family: 'Bookman old bold';">Bookman old bold</option>
																			<option data-font-file='BOOKOSI.TTF' value='Bookman old italic' style="font-family: 'Bookman old italic';">Bookman old italic</option>
																			<option data-font-file='candara.ttf' value='candara' style="font-family: 'candara';">Candara</option>
																			<option data-font-file='Century_Gothic.ttf' value='Century_Gothic' style="font-family: 'Century_Gothic';">Century_Gothic</option>
																			<option data-font-file='Century_Gothic_Bold.ttf' value='Century_Gothic_Bold' style="font-family: 'Century_Gothic_Bold';">Century_Gothic_Bold</option>
																			<option data-font-file='ChaparralPro-Italic_0.otf' value='ChaparralPro' style="font-family: 'ChaparralPro';">ChaparralPro</option>
																			<option data-font-file='ChaparralPro-Bold.otf' value='ChaparralProBold' style="font-family: 'ChaparralProBold';">ChaparralProBold</option>
																			<option data-font-file='ComicSansMS.ttf' value='ComicSansMS' style="font-family: 'ComicSansMS';">ComicSansMS</option>
																			<option data-font-file='Cooper Std Black.ttf' value='Cooper Std Black' style="font-family: 'Cooper Std Black';">Cooper Std Black</option>
																			<option data-font-file='Courgette-Regular.ttf' value='Courgette-Regular' style="font-family: 'Courgette-Regular';">Courgette-Regular</option>
																			<option data-font-file='Curlz.TTF' value='Curlz MT' style="font-family: 'Curlz MT';">Curlz MT</option>
																			<option data-font-file='djb_almost_perfect.ttf' value='DJBAlmostPerfect' style="font-family: 'DJBAlmostPerfect';">DJBAlmostPerfect</option>
																			<option data-font-file='Diplomata.woff' value='Diplomata' style="font-family: 'Diplomata ';">Diplomata</option>
																			<option data-font-file='DiplomataSC.woff' value='DiplomataSC' style="font-family: 'DiplomataSC';">DiplomataSC</option>
																			<option data-font-file='DoppioOne.woff' value='doppio one' style="font-family: 'doppio one';">Doppio one</option>
																			<option data-font-file='DroidSans.ttf' value='DroidSans' style="font-family: 'DroidSans';">DroidSans</option>
																			<option data-font-file='Electrolize.woff' value='electrolize' style="font-family: 'electrolize';">Electrolize</option>
																			<option data-font-file='ERASBD.TTF' value='Eras BD' style="font-family: 'Eras BD';">Eras BD</option>
																			<option data-font-file='Forte.ttf' value='Forte' style="font-family: 'Forte';">Forte</option>
																			<option data-font-file='FRADM.TTF' value='Fradm' style="font-family: 'Fradm';">Fradm</option>
																			<option data-font-file='FRADMCN.TTF' value='Fradmcn' style="font-family: 'Fradmcn';">Fradmcn</option>
																			<option data-font-file='FRADMIT.TTF' value='Fradmit' style="font-family: 'Fradmit';">Fradmit</option>
																			<option data-font-file='FRAHV.TTF' value='Frahv' style="font-family: 'Frahv';">Frahv</option>
																			<option data-font-file='FRAHVIT.TTF' value='Frahvit' style="font-family: 'Frahvit';">Frahvit</option>
																			<option data-font-file='FRAMD.TTF' value='Framd' style="font-family: 'Framd';">Framd</option>
																			<option data-font-file='FRAMDCN.TTF' value='Framdcn' style="font-family: 'Framdcn';">Framdcn</option>
																			<option data-font-file='FRAMDIT.TTF' value='Framdit' style="font-family: 'Framdit';">Framdit</option>
																			<option data-font-file='FrederickatheGreat.woff' value='FrederickatheGreat' style="font-family: 'FrederickatheGreat';">FrederickatheGreat</option>
																			<option data-font-file='FredokaOne.woff' value='fredoka one' style="font-family: 'fredoka one';">Fredoka one</option>
																			<option data-font-file='Freeskpt.ttf' value='Freeskpt' style="font-family: 'Freeskpt';">Freeskpt</option>
																			<option data-font-file='futuraxk.ttf' value='Futura XBlk BT' style="font-family: 'Futura XBlk BT';">Futura XBlk BT</option>
																			<option data-font-file='gadugi.ttf' value='gadugi' style="font-family: 'gadugi';">Gadugi</option>
																			<option data-font-file='Gobold_Bold_Italic.TTF' value='GoboldBoldItalic' style="font-family: 'GoboldBoldItalic';">GoboldBoldItalic</option>
																			<option data-font-file='gothambold.ttf' value='Gothambold' style="font-family: 'Gothambold';">Gothambold</option>
																			<option data-font-file='gothambook.ttf' value='Gothambook' style="font-family: 'Gothambook';">Gothambook</option>
																			<option data-font-file='gothammedium.ttf' value='Gothammedium' style="font-family: 'Gothammedium';">Gothammedium</option>
																			<option data-font-file='Humanist 521 Ultra Bold.otf' value='Humanist521' style="font-family: 'Humanist521';">Humanist521</option>
																			<option data-font-file='Karla.woff' value='karla' style="font-family: 'karla';">Karla</option>
																			<option data-font-file='LondrinaSolid.woff' value='londrina solid' style="font-family: 'londrina solid';">Londrina solid</option>
																			<option data-font-file='mvboli.ttf' value='MV Boli' style="font-family: 'MV Boli';">MV Boli</option>
																			<option data-font-file='MavenPro.woff' value='marven pro' style="font-family: 'marven pro';">Marven pro</option>
																			<option data-font-file='MfReallyAwesome' value='MfReallyAwesome' style="font-family: 'MfReallyAwesome';">MfReallyAwesome</option>
																			<option data-font-file='MyriadPro.ttf' value='MyriadPro' style="font-family: 'MyriadPro';">MyriadPro</option>
																			<option data-font-file='Norican.woff' value='norican' style="font-family: 'norican';">Norican</option>
																			<option data-font-file='NovaSlim.woff' value='nova slim' style="font-family: 'nova slim';">Nova slim</option>
																			<option data-font-file='Nunito.woff' value='nunito' style="font-family: 'nunito';">Nunito</option>
																			<option data-font-file='Orbitron.woff' value='orbitron' style="font-family: 'orbitron';">Orbitron</option>
																			<option data-font-file='Overlock.woff' value='overlock' style="font-family: 'overlock';">Overlock</option>
																			<option data-font-file='PTSansNarrow.woff' value='PT sana narrow' style="font-family: 'PT sana narrow';">PT sana narrow</option>
																			<option data-font-file='Parisienne.woff' value='parisienne' style="font-family: 'parisienne';">Parisienne</option>
																			<option data-font-file='PermanentMarker.TTF' value='Permanent Marker' style="font-family: 'Permanent Marker';">Permanent Marker</option>
																			<option data-font-file='Philosopher.woff' value='philosopher' style="font-family: 'philosopher';">Philosopher</option>
																			<option data-font-file='PontanoSans.woff' value='pontano sans' style="font-family: 'pontano sans';">Pontano sans</option>
																			<option data-font-file='Prata.woff' value='pratas' style="font-family: 'pratas';">Pratas</option>
																			<option data-font-file='Quando.woff' value='quando' style="font-family: 'quando';">Quando</option>
																			<option data-font-file='quixotic' value='quixotic' style="font-family: 'quixotic';">Quixotic</option>
																			<option data-font-file='RobotoBold.ttf' value='RobotoBold' style="font-family: 'RobotoBold';">RobotoBold</option>
																			<option data-font-file='Roboto-Medium.ttf' value='RobotoMedium' style="font-family: 'RobotoMedium';">RobotoMedium</option>
																			<option data-font-file='RobotoRegular.ttf' value='RobotoRegular' style="font-family: 'RobotoRegular';">RobotoRegular</option>
																			<option data-font-file='rockwell.ttf' value='rockwell' style="font-family: 'rockwell';">Rockwell</option>
																			<option data-font-file='RockwellExtraBold.ttf' value='RockwellExtraBold' style="font-family: 'RockwellExtraBold';">RockwellExtraBold</option>
																			<option data-font-file='RussoOne.woff' value='russo one' style="font-family: 'russo one';">Russo one</option>
																			<option data-font-file='Rye.woff' value='Rye' style="font-family: 'Rye';">Rye</option>
																			<option data-font-file='Sanchez.woff' value='sanchez' style="font-family: 'sanchez';">Sanchez</option>
																			<option data-font-file='Sarina.woff' value='sarina' style="font-family: 'sarina';">Sarina</option>
																			<option data-font-file='Scandinavian.ttf' value='Scandinavian' style="font-family: 'Scandinavian';">Scandinavian</option>
																			<option data-font-file='SCANDINAVIANVIBLACK.TTF' value='Scandinavian Black' style="font-family: 'Scandinavian Black';">Scandinavian Black</option>
																			<option data-font-file='SegoePrint.ttf' value='SegoePrint' style="font-family: 'SegoePrint';">SegoePrint</option>
																			<option data-font-file='SegoeUI.ttf' value='SegoeUI' style="font-family: 'SegoeUI';">SegoeUI</option>
																			<option data-font-file='SegoeUIB.ttf' value='SegoeUIB' style="font-family: 'SegoeUIB';">SegoeUIB</option>
																			<option data-font-file='Signika.woff' value='signika' style="font-family: 'signika';">Signika</option>
																			<option data-font-file='SketchBlock.ttf' value='SketchBlock' style="font-family: 'SketchBlock';">SketchBlock</option>
																			<option data-font-file='Tacom.TTF' value='Taco modern' style="font-family: 'Taco modern';">Taco modern</option>
																			<option data-font-file='texgyreadventor-bold.otf' value='texgyreadventor-bold' style="font-family: 'texgyreadventor-bold';">Texgyreadventor-bold</option>
																			<option data-font-file='Timesnewroman.ttf' value='Timesnewroman' style="font-family: 'Timesnewroman';">Timesnewroman</option>
																			<option data-font-file='Trocchi.woff' value='trocchi' style="font-family: 'atrocchirial';">Trocchi</option>
																			<option data-font-file='TwentyEightDaysLater.ttf' value='TwentyEightDaysLater' style="font-family: 'TwentyEightDaysLater';">TwentyEightDaysLater</option>
																			<option data-font-file='VastShadow.woff' value='VastShadow' style="font-family: 'VastShadow';">VastShadow</option>
																			<option data-font-file='Verdana.ttf' value='Verdana' style="font-family: 'Verdana';">Verdana</option>
																			<option data-font-file='Yesteryear.woff' value='yesteryear' style="font-family: 'yesteryear';">Yesteryear</option>
																			<option data-font-file='28DaysLater.ttf' value='twentyDaysLater' style="font-family: 'twentyDaysLater';">twentyDaysLater</option>
																		</select>
																	</div>
																	<div class="setting_spin" style="position:absolute; left:170px; top:10px; float:left;">
																		<input type="text" id="text_font_size" value="0" onchange="javascript:set_text_font_size();" oninput="javascript:set_text_font_size();" style="width:40px;"/>
																	</div>
																	
																	<div class="setting_bold" id="text_font_bold" onclick="set_text_bold();" style="position:absolute; left:20px; top:60px; float:left;">
																		<a href="javascript:void(0);" ></a>
																		<div class="icon_name">Bold</div>
																	</div>
																	<div class="setting_italic" id="text_font_italic" onclick="set_text_italic();" style="position:absolute; left:75px; top:60px; float:left;">
																		<a href="javascript:void(0);" ></a>
																		<div class="icon_name">Italic</div>
																	</div>
																	<div class="setting_underline" id="text_font_underline" onclick="set_text_underline();" style="position:absolute; left:130px; top:60px; float:left;">
																		<a href="javascript:void(0);" ></a>
																		<div class="icon_name">Underline</div>
																	</div>
																	<div class="setting_strikethrough" id="text_font_strikethrough" onclick="set_text_strikethrough();" style="position:absolute; left:185px; top:60px; float:left;">
																		<a href="javascript:void(0);" ></a>
																		<div class="icon_name">Strikethrough</div>
																	</div>

																	<div id="text_font_color" class="setting_color" style="position:absolute; left:20px; top:130px; float:left;">
																		<a href="JavaScript:void(0);"></a>
																		<div class="icon_name">Color</div>
																	</div>
																	<div id="text_spin" class="setting_spin" style="position:absolute; left:120px; top:130px; float:left;">
																		<input type="text" id="spinnerfast" onchange="javascript:apply_padding_text();" oninput="javascript:apply_padding_text();" value="0"  style="width:35px;"/>
																		<div class="icon_name">Padding</div>
																	</div>
																</div>
																<!-- End Font Settings -->	  
																
																<div id="text_shadow_title" class="setting_title"><spring:message code="global.page.setting.text.shadow"/></div>
																<div id="text_shadow_div" class="setting_div" style="display:none; position:relative; width:260px; height:130px; float:left;">
																	<div class="setting_spin" style="position:absolute; left:20px; top:10px; float:left;">
																		<input type="text" id="text_shadow_x" onchange="javascript:set_text_shadow();" oninput="javascript:set_text_shadow();" value="0" style="width:35px;"/>
																		<div class="icon_name">Shadow-X</div>
																	</div>
																	<div class="setting_spin" style="position:absolute; left:120px; top:10px; float:left;">
																		<input type="text" id="text_shadow_y" value="0" onchange="javascript:set_text_shadow();" oninput="javascript:set_text_shadow();" style="width:35px;"/>
																		<div class="icon_name">Shadow-Y</div>
																	</div>
																	<div id="text_shadow_color" class="setting_color" style="position:absolute; left:20px; top:75px; float:left;">
																		<a href="JavaScript:void(0);"></a>
																		<div class="icon_name">Color</div>
																	</div>
																	<div class="setting_spin" style="position:absolute; left:120px; top:75px; float:left;">
																		<input type="text" id="text_shadow_blur" value="0" onchange="javascript:set_text_shadow();" oninput="javascript:set_text_shadow();" style="width:35px;"/>
																		<div class="icon_name">Shadow-blur</div>
																	</div>
 																</div>
						
																<!-- Text Ticker -->
																<!-- End Text Effect -->
						
																<!-- Text Alignment -->
																<div id="text_align_title" class="setting_title"><spring:message code="global.page.setting.text.align"/></div>
																<div id="text_align_div" class="setting_div" style="display:none; position:relative; width:260px; height:70px; float:left;">
																	<div class="setting_left" id="text_align_left" onclick="set_text_alignment('left');" style="position:absolute; left:20px; top:10px; float:left;">
																		<a href="javascript:void(0);" ></a>
																		<div class="icon_name">Left</div>
																	</div>
																	<div class="setting_center" id="text_align_center" onclick="set_text_alignment('center');" style="position:absolute; left:70px; top:10px; float:left;">
																		<a href="javascript:void(0);" ></a>
																		<div class="icon_name">Center</div>
																	</div>
																	<div class="setting_right" id="text_align_right" onclick="set_text_alignment('right');" style="position:absolute; left:120px; top:10px; float:left;">
																		<a href="javascript:void(0);" ></a>
																		<div class="icon_name">Right</div>
																	</div>
																	<div class="setting_justify" id="text_align_justify" onclick="set_text_alignment('justify');" style="position:absolute; left:170px; top:10px; float:left;">
																		<a href="javascript:void(0);" ></a>
																		<div class="icon_name">Justify</div>
																	</div>
																</div>
																<!-- End Text Alignment -->
																
																<div id="text_space_title" class="setting_title"><spring:message code="global.page.setting.text.space"/></div>
																<div id="text_space_div" class="setting_div" style="display: none; position:relative; width:260px; height:80px; float:left;">
																	<div id="text_unorder" class="setting_ul" onclick="apply_unorder_list();" style="position:absolute; left:20px; top:10px; float:left;">
																		<a href="javascript:void(0);"></a>
																		<div class="icon_name">UL</div>
																	</div>
																	<div id="text_order" class="setting_ol" onclick="apply_order_list();" style="position:absolute; left:70px; top:10px; float:left;">
																		<a href="javascript:void(0);" ></a>
																		<div class="icon_name">OL</div>
																	</div>
																	<div id="line_space" class="setting_spin" style="position:absolute; left:120px; top:15px; float:left;">
																		<input type="text" id="line_space_text" onchange="javascript:set_line_space_text();" oninput="javascript:set_line_space_text();" value="0"  style="width:45px;"/>
																		<div class="icon_name">Line-Spacing</div>
																	</div>
																</div>
															</div>	 
															<!-- End text div settings -->
															
															<div id="alignment_title" class="setting_title"><spring:message code="global.page.setting.align"/></div>
															<div id="alignment_div" class="setting_div" style="display:none; position:relative; width:260px; height:70px; float:left; ">
																<div id="select_div_top" class="setting_div_top" onclick="javascript:select_div_top();" style="position:absolute; left:10px; top:10px; float:left;">
																	<a href="javascript:void(0);"></a>
																	<div class="icon_name">Top</div>
																</div>
																<div id="select_div_bottom" class="setting_div_bottom" onclick="javascript:select_div_bottom();" style="position:absolute; left:50px; top:10px; float:left;">
																	<a href="javascript:void(0);"></a>
																	<div class="icon_name">Bottom</div>
																</div>
																<div id="select_div_left" class="setting_div_left" onclick="javascript:select_div_left();" style="position:absolute; left:90px; top:10px; float:left;">
																	<a href="javascript:void(0);"></a>
																	<div class="icon_name">Left</div>
																</div>
																<div id="select_div_right" class="setting_div_right" onclick="javascript:select_div_right();" style="position:absolute; left:130px; top:10px; float:left;">
																	<a href="javascript:void(0);"></a>
																	<div class="icon_name">Right</div>
																</div>
																<div id="select_div_vertical_stretch" class="setting_div_vstr" onclick="javascript:select_div_vertical_stretch();" style="position:absolute; left:170px; top:10px; float:left;">
																	<a href="javascript:void(0);"></a>
																	<div class="icon_name">V STR</div>
																</div>
																<div id="select_div_horizontal_stretch" class="setting_div_hstr" onclick="javascript:select_div_horizontal_stretch();" style="position:absolute; left:210px; top:10px; float:left;">
																	<a href="javascript:void(0);"></a>
																	<div class="icon_name">H STR</div>
																</div>
															</div>
						
															<div id="rotate_title" class="setting_title" ><spring:message code="global.page.setting.rotate"/></div>
															<div id="rotate_div" class="setting_div" style="display:none; position:relative; width:260px; height:130px; float:left; ">
																<div id="select_div_rotate_left" class="setting_rotate_left" onclick="javscript:select_div_rotate_left();">
																	<a href="javascript:void(0);"></a>
																	<div class="icon_name">Rotate Left</div>
																</div>
																<div id="select_div_rotate_right" class="setting_rotate_right" onclick="javascript:select_div_rotate_right();">
																	<a href="javascript:void(0);"></a>
																	<div class="icon_name">Rotate Right</div>
																</div>
																<div id="select_div_flip_vertical" class="setting_flip_vertical" onclick="javascript:select_div_flip_vertical();">
																	<a href="javascript:void(0);"></a>
																	<div class="icon_name">Flip Vertical</div>
																</div>
																<div id="select_div_flip_horizontal" class="setting_flip_horizontal" onclick="javascript:select_div_flip_horizontal();">
																	<a href="javascript:void(0);"></a>
																	<div class="icon_name">Flip Horizontal</div>
																</div>
																<div id="select_div_reset" class="setting_reset_rotate" onclick="javascript:select_div_reset();" >
																	<a href="javascript:void(0);"></a>
																	<div class="icon_name">Reset Rotate</div>
																</div>
																<div class="icon_name" style="position:absolute; left:40px; top:100px; ">Rotation Angle</div>
																<div class="setting_spin" style="position:absolute; left:150px; top:90px; float:left;">
																	<input type="text" id="rotate_selected_div" onchange="javascript:rotate_selected_div();" oninput="javascript:rotate_selected_div();" value="0"  style="width:45px;"/>
																</div>
															</div>
						
															<div id="size_position_title" class="setting_title"><spring:message code="global.page.setting.size"/></div>
															<div id="size_position_div" class="setting_div" style="display:none; position:relative; width:260px; height:130px; float:left; ">
																<div id="width_spin" class="setting_spin" style="position:absolute; left:40px; top:10px; float:left;">
																	<input type="text" id="div_width" onchange="javascript:apply_div_width();" oninput="javascript:apply_div_width();" value="0"  style="width:45px;"/>
																	<div class="icon_name">width</div>
																</div>
																<div id="hight_spin" class="setting_spin" style="position:absolute; left:140px; top:10px; float:left;">
																	<input type="text" id="div_height" onchange="javascript:apply_div_height();" oninput="javascript:apply_div_height();" value="0"  style="width:45px;"/>
																	<div class="icon_name">height</div>
																</div>
																<div id="xaxis_spin" class="setting_spin" style="position:absolute; left:40px; top:70px; float:left;">
																	<input type="text" id="div_x_axis" onchange="javascript:apply_div_x_axis();" oninput="javascript:apply_div_x_axis();" value="0"  style="width:45px;"/>
																	<div class="icon_name">x axis</div>
																</div>
																<div id="yaxis_spin" class="setting_spin" style="position:absolute; left:140px; top:70px; float:left;">
																	<input type="text" id="div_y_axis" onchange="javascript:apply_div_y_axis();" oninput="javascript:apply_div_y_axis();" value="0"  style="width:45px;"/>
																	<div class="icon_name">y axis</div>
																</div>
															</div>  
															
															<div id="background_title" class="setting_title"><spring:message code="global.page.setting.background"/></div>
															<div id="background_div" class="setting_div" style="display:none; position:relative; width:260px; height:70px; float:left; ">
																<div id="background_color" class="setting_color" style="position:absolute; left:20px; top:10px; float:left;">
																	<a href="JavaScript:void(0);"></a>
																	<div class="icon_name">Color</div>
																</div>
																<div id="background_opacity" class="setting_opacity" style="position:absolute; left:80px; top:20px; float:left; width:150px; height:6px; color:#000;"></div>
																<div class="icon_name" style="position:absolute; left:80px; top:30px;">0</div>
																<div class="icon_name" style="position:absolute; left:220px; top:30px;">100</div>
																<div class="icon_name" style="position:absolute; left:120px; top:35px;">Opacity:</div>
																<div id="background_opacity_value" class="icon_name" style="position:absolute; left:180px; top:35px;"></div>
															</div>
						
															<div id="border_title" class="setting_title"><spring:message code="global.page.setting.border"/></div>
															<div id="border_div" class="setting_div" style="display:none; position:relative; width:260px; height:220px; float:left; ">
																<div id="border_color" class="setting_color" style="position:absolute; left:20px; top:10px; float:left;">
																	<a href="JavaScript:void(0);"></a>
																	<div>Color</div>
																</div>
																<div id="image_spin" class="setting_spin" style="position:absolute; left:85px; top:10px; float:left;">
																	<input type="text" id="spinner_width" onchange="javascript:set_border_width();" oninput="javascript:set_border_width();" value="0"  style="width:35px;"/>
																	<div class="icon_name">Width</div>
																</div>
																<div class="setting_border_type" >
																	<select name="border_type" id="border_type"  onchange="javascript:set_border_style();">
																		<option value="solid">solid</option>
																		<option value="dashed">dashed</option>
																		<option value="dotted">dotted</option>
																	</select>
																	<div class="icon_name">Style</div>
																</div>
																
																<div class="setting_spin" style="position:absolute; left:20px; top:70px; float:left;">
																	<input type="text" id="border_top_left" onchange="javascript:set_round_border_top_left();" oninput="javascript:set_round_border_top_left();" value="0"  style="width:35px;"/>
																</div>
																<div class="icon_name" style="position:absolute; left:20px; top:105px; width:80px;">Top-Left-Rounded</div>
																<div class="setting_spin" style="position:absolute; left:150px; top:70px; float:left;">
																	<input type="text" id="border_top_right" onchange="javascript:set_round_border_top_right();" oninput="javascript:set_round_border_top_right();" value="0"  style="width:35px;"/>
																</div>
																<div class="icon_name" style="position:absolute; left:150px; top:105px; width:80px;">Top-Right-Rounded</div>
																<div class="setting_spin" style="position:absolute; left:20px; top:145px; float:left;">
																	<input type="text" id="border_bottom_left" onchange="javascript:set_round_border_bottom_left();" oninput="javascript:set_round_border_bottom_left();" value="0"  style="width:35px;"/>
																</div>
																<div class="icon_name" style="position:absolute; left:20px; top:180px; width:80px;">Bottom-Left-Rounded</div>
																<div class="setting_spin" style="position:absolute; left:150px; top:145px; float:left;">
																	<input type="text" id="border_bottom_right" onchange="javascript:set_round_border_bottom_right();" oninput="javascript:set_round_border_bottom_right();" value="0"  style="width:35px;"/>
																</div>
																<div class="icon_name" style="position:absolute; left:150px; top:180px; width:80px;">Bottom-Right-Rounded</div>
															</div>
															
															<div class="lock_box" style="width:260px; height:auto; float:left; margin:0;">
																<div class="lock_btn" id="lock_particular_zone" onclick="lock_selectedall_zone();"><img src="${base_ctx}/wysiwyg/images/editor/ter.png" alt="" title="" style="border:0;"></div>
																<div class="unlock_btn" id="unlock_particular_zone" onclick="unlock_selectedall_zone();"><img src="${base_ctx}/wysiwyg/images/editor/ter.png" alt="" title="" style="border:0;"></div>
																<div class="front_btn" id="select_div_bring_to_front" onclick="javascript:select_div_bring_to_front();"><img src="${base_ctx}/wysiwyg/images/editor/ter.png" alt="" title="" style="border:0;"></div>
																<div class="back_btn" id="select_div_send_to_back" onclick="javascript:select_div_send_to_back();"><img src="${base_ctx}/wysiwyg/images/editor/ter.png" alt="" title="" style="border:0;"></div>
															</div>
														</div>
														<div style="clear:both;"></div>
													</div>
												</li>
											</ul>
										</li>
										
										<li>
											<h1 class="level1" ><spring:message code="global.page.zones"/></h1>
											<form style="margin:0; padding:0; border:0; height:500px; overflow:-moz-hidden-unscrollable;">
												<ul id="create_li_list"></ul>
												<div class="lock_footer">
													<div class="unlock_b" id="unlock_selected_zone" onclick="unlock_selectedall_zone();"></div>
													<div class="lock_b" id="lock_selected_zone" onclick="lock_selectedall_zone();"></div>
													<div class="delete_b" id="deleted_selected_all_zones" onclick="javascript:deleted_selected_all();"></div>
												</div>
											</form>
										</li>
									</ul>
									<!-- end Accordion 3 -->
								</div>
							</div>
						
							<div class="clear"></div>
						</div>
						<!--==========sidebare end========== -->
				
					</div>
					<div class="clear"></div>
				</div>

		<div id="popup_background" style="display: none;"></div>
		<div id="preview_outer_div" style="display: none;">
			<div id="preview_close" class="fancybox_close"></div>
			<div id="preview_div" style="position:absolute; overflow:hidden; background-color:#EEEEEE;"></div>
		</div>
		<div id="snapshot_div" style="position:relative; top:65px; display:none;"></div>

<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->
<!-- BEGIN CORE PLUGINS -->   
<!--[if lt IE 9]>
<script src="${static_ctx}/global/plugins/respond.min.js"></script>
<script src="${static_ctx}/global/plugins/excanvas.min.js"></script> 
<![endif]-->   
<script src="${static_ctx}/global/plugins/jquery.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-migrate.min.js" type="text/javascript"></script>
<!-- IMPORTANT! Load jquery-ui.min.js before bootstrap.min.js to fix bootstrap tooltip conflict with jquery ui tooltip -->
		<script type="text/javascript" src="${base_ctx}/wysiwyg/js/jquery-ui.min.js"></script>
<script src="${static_ctx}/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery.blockui.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/jquery.cokie.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script>
<script src="${static_ctx}/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js" type="text/javascript"></script>
<!-- END CORE PLUGINS -->
		<script type="text/javascript" src="${base_ctx}/wysiwyg/js/jquery.ui.rotatable.js"></script>
		<script type="text/javascript" src="${base_ctx}/wysiwyg/js/ui/jquery.ui.resizable.js"></script>
		<script type="text/javascript" src="${base_ctx}/wysiwyg/js/ui/jquery.ui.draggable.js"></script>
		<script type="text/javascript" src="${base_ctx}/wysiwyg/js/ui.spinner.js"></script>
		<!-- <script type="text/javascript" src="${base_ctx}/wysiwyg/js/farbtastic.js"></script> -->
		<script type="text/javascript" src="${base_ctx}/wysiwyg/js/jquery.jeditable.js"></script>
		<script type="text/javascript" src="${base_ctx}/wysiwyg/js/jquery.qtip.js"></script>
		<script type="text/javascript" src="${base_ctx}/wysiwyg/js/jquery.tipsy.js"></script>
		<script type="text/javascript" src="${base_ctx}/wysiwyg/js/jquery.form.js"></script>
		<script type="text/javascript" src="${base_ctx}/wysiwyg/js/jquery.json-2.4.js"></script>
 
		<script type="text/javascript" src="${base_ctx}/wysiwyg/js/application.js"></script>
		<script type="text/javascript" src="${base_ctx}/wysiwyg/js/image_layer_application.js"></script>
		<script type="text/javascript" src="${base_ctx}/wysiwyg/js/text_layer_application.js"></script>
		<script type="text/javascript" src="${base_ctx}/wysiwyg/js/header_toolbar_application.js"></script>
		<script type="text/javascript" src="${base_ctx}/wysiwyg/js/common.js"></script>
		
		<script type="text/javascript" src="${base_ctx}/wysiwyg/jqtransformplugin/jquery.jqtransform.js"></script>
		<script type="text/javascript" src="${base_ctx}/wysiwyg/js/html2canvas.js"></script>

		<script src="${static_ctx}/global/plugins/select2/select2.min.js" type="text/javascript"></script>
		<script src="${static_ctx}/global/plugins/data-tables/jquery.dataTables.js" type="text/javascript"></script>
		<script src="${static_ctx}/global/plugins/data-tables/DT_bootstrap.js" type="text/javascript"></script>
		<script src="${static_ctx}/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
		<script src="${static_ctx}/global/plugins/wColorPicker/wColorPicker.min.js" type="text/javascript"></script>
		<script src="${base_ctx}/scripts/lang/${locale}.js" type="text/javascript"></script>
		<script src="${base_ctx}/scripts/pix-datainit.js"></script>

		<script type="text/javascript">
			var safari = (navigator.userAgent.toLowerCase().indexOf('safari') != -1) ? true : false;
			var gebtn = function(parEl, child) {
				return parEl.getElementsByTagName(child);
			};
			onload = function() {
				var ls = gebtn(document, 'label');
				if (!document.getElementById || !document.createTextNode)
					return;

				for (var i = 0; i < ls.length; i++) {
					var l = ls[i];
					if (l.className.indexOf('label_') == -1)
						continue;
					var inp = gebtn(l, 'input')[0];
					if (l.className.indexOf('label_check') != -1) {
						//l.className = (safari && inp.checked == true || inp.checked) ? 'label_check c_on' : 'label_check c_off';
						/*For check to checkbox of layer list on rigth side tab*/
						l.onchange = function() {
							var zoneid = $(this).parent().parent().parent().attr('zoneid');
							var zonetype = $(this).parent().parent().parent().attr('zonetype');
							var div_id = zonetype + 'div_' + zoneid;
							select_multiple_layers_active($('#' + div_id));
						};
					}
				}
			};
		
			$("#acc3").accordion({autoHeight: false, header: 'h1', collapsible: true});

			var CurrentPage = null;
			var template_width, template_height, original_width, original_height;
			var base_ctx = '${base_ctx}';

			$(window).load(function() {
				//$("#throberdiv").remove();
			});
			$(document).ready(function() {
				$('#preview_close').click(function() {
					$('#popup_background').fadeOut('slow');
					$('#preview_outer_div').fadeOut('slow');
					setTimeout(function() {
						for (i = 0; i < 99999; i++) {
							window.clearInterval(i);
						}
					}, 1000);
				});

				$('.text_btn a,.image_btn a,.video_btn a,.copy_btn a,.del_btn a,.undo_btn a,.redo_btn a,.dis_btn a,.zoomin_btn a,.zoomout_btn a,.grid_btn a,.pre_btn a,.save_btn a,.close1_btn a,.close2_btn a').tipsy({gravity: 's'});

				fill_data();
				$('#lock_particular_zone').removeClass("lock_main");
				$('#unlock_particular_zone').removeClass("unlock_main");

				/*Remove right side click*/
				$('#fixedwidth').bind('contextmenu', function(e) {
					e.preventDefault();
				});
			});
			$(function() {
				// Accordion
				$("#accordion").accordion({header: "h3"});

				// Tabs
				$('#tabs').tabs();

				// Dialog Link
				$('#dialog_link').click(function() {
					$('#dialog').dialog('open');
					return false;
				});

				// Datepicker
				$('#datepicker').datepicker({
					inline: true
				});

				// Slider
				$('#slider').slider({
					range: true,
					values: [17, 67]
				});

				// Progressbar
				$("#progressbar").progressbar({
					value: 20
				});

				//hover states on the static widgets
				$('#dialog_link, ul#icons li').hover(
						function() {
							$(this).addClass('ui-state-hover');
						},
						function() {
							$(this).removeClass('ui-state-hover');
						}
				);
			});
			z_index = 0;
			i = 1;
			img = 1;
			new_int_id = 0;
			j = 1;
			k = 1;
			txt = 0;
			var index_highest2 = 0;
			/* Render all data in editor area that render after this page*/
			function fill_data() {
				$.ajax({
					url: 'page!get.action',
					type: 'GET',
					data: {
						pageid: <%=currentPageid %>
					},
					beforeSend: function() {
						var throberdiv = '<div id = "throberdiv">&nbsp;</div>';
						$(throberdiv).prependTo("body");
					},
					success: function(data) {
						CurrentPage = data.page;
						if (CurrentPage == null) {
							bootbox.alert("Template not found.");
							return;
						}
						
						/*Set size of editor area & preview area according to template resolution*/
						original_width = parseInt(CurrentPage.width);
						original_height = parseInt(CurrentPage.height);
						if (original_height > original_width) {
							if (original_height >= '1024') {
								template_height = '1024';
							} else {
								template_height = original_height;
							}
							template_width = template_height * original_width / original_height;
							$('.editor_screen').height('576');
							$('.editor_screen').css('overflow-y', 'scroll');
						} else if (original_height < original_width) {
							if (original_width >= '1024') {
								template_width = '1024';
							} else {
								template_width = original_width;
							}
							template_height = template_width * original_height / original_width;
						} else if (original_height == original_width) {
							if (original_height < '576') {
								template_height = original_height;
							} else if (original_height >= '576') {
								template_height = '576';
							}
							template_width = template_height * original_width / original_height;
						}
						console.log('template_width:', template_width);
						console.log('template_height:', template_height);
						$('.outer_fixedwidth').width(template_width + 'px');
						$('.outer_fixedwidth').height(template_height + 'px');
						$('#preview_div').width(template_width + 'px');
						$('#preview_div').height(template_height + 'px');
						$('#fixedwidth').height(template_height + 'px');
						$('#fixedwidth').width(template_width + 'px');
						$('#preview_outer_div').height(template_height + 'px');
						$('#preview_outer_div').width(template_width + 'px');
						$('#snapshot_div').height(template_height + 'px');
						$('#snapshot_div').width(template_width + 'px');

						var pagezones = data.page.pagezones;
						var m = null;
						var n = null;
						var z = null;
						for (z = 0; z < pagezones.length; z++) {
							var pagezone = pagezones[z];
							var set_z_index = parseInt(pagezone.zindex);
							if (set_z_index > index_highest2) {
								index_highest2 = set_z_index;
							}
							var int_id = parseInt(pagezone.pagezoneid);
							if (int_id > new_int_id) {
								new_int_id = int_id;
							}
							
							pagezone.height = pagezone.height / 1.875;
							pagezone.width = pagezone.width / 1.875;
							pagezone.topoffset = pagezone.topoffset / 1.875;
							pagezone.leftoffset = pagezone.leftoffset / 1.875;
							pagezone.bdwidth = pagezone.bdwidth / 1.875;
							pagezone.fontsize = pagezone.fontsize / 1.875;
							pagezone.lineheight = pagezone.lineheight / 1.875;
							pagezone.padding = pagezone.padding / 1.875;
							pagezone.bdtl = pagezone.bdtl / 1.875;
							pagezone.bdtr = pagezone.bdtr / 1.875;
							pagezone.bdbl = pagezone.bdbl / 1.875;
							pagezone.bdbr = pagezone.bdbr / 1.875;
						}

						for (m = 0; m < pagezones.length; m++) {
							var pagezone = pagezones[m];
							var int_id = pagezone.pagezoneid;
							var element_layer_id = "";
							if (pagezone.type == '1') {
								create_image_div(pagezone.pagezoneid, pagezone.zindex, pagezone.name, 'lock', int_id, pagezone.content, 'imagediv', 'init');
								element_layer_id = $('#imagediv_' + int_id);
								if (isOpera) {
									element_layer_id.find('#rotatable').css('-o-transform', pagezone.transform);
								} else if (isFirefox) {
									element_layer_id.find('#rotatable').css('-moz-transform', pagezone.transform);
								} else if (isChrome || isSafari) {
									element_layer_id.find('#rotatable').css('-webkit-transform', pagezone.transform);
								}
								element_layer_id.find('#top').val(pagezone.topoffset);
								element_layer_id.find('#left').val(pagezone.leftoffset);
								element_layer_id.find('#height').val(pagezone.height);
								element_layer_id.find('#width').val(pagezone.width);
								element_layer_id.css({
									'top': pagezone.topoffset + 'px', 
									'left': pagezone.leftoffset + 'px', 
									'z-index': pagezone.zindex
								});
								element_layer_id.find('#rotatable').css({
									'height': pagezone.height + 'px', 
									'width': pagezone.width + 'px', 
									'border-color': pagezone.bdcolor, 
									'border-style': pagezone.bdstyle, 
									'border-width': pagezone.bdwidth, 
									'background-color': pagezone.bgcolor, 
									'padding': pagezone.padding + 'px', 
									'box-shadow': pagezone.shadow, 
									'border-top-right-radius': pagezone.bdtr + 'px', 
									'border-top-left-radius': pagezone.bdtl + 'px', 
									'border-bottom-left-radius': pagezone.bdbl + 'px', 
									'border-bottom-right-radius': pagezone.bdbr + 'px', 
								});
								if (pagezone.content != '' && pagezone.content != 'no' && pagezone.content != 'non' && !(pagezone.multiple_images_str)) {
									element_layer_id.find('.inner_div').css('background-image', 'url(/pixsigdata' + pagezone.content + ')');
									element_layer_id.find('.inner_div').attr('imageid', pagezone.imageid);
									element_layer_id.find('.inner_div').attr('content', pagezone.content);
									element_layer_id.find('.inner_div').attr('owidth', pagezone.width);
									element_layer_id.find('.inner_div').attr('oheight', pagezone.height);
								}
								element_layer_id.find('#b_color').val(pagezone.bdcolor);
								element_layer_id.find('#b_style').val(pagezone.bdstyle);
								element_layer_id.find('#b_width').val(pagezone.bdwidth);
								element_layer_id.find('#images_arr_str').val(pagezone.multiple_images_str);
								element_layer_id.find('#permission').val(pagezone.permission);
								element_layer_id.find('#kenuburn_effect').val(pagezone.img_kenburn_effect);
								//element_layer_id.find('#kenburn_duration').val(pagezone.img_kenburn_duration);
								element_layer_id.find('#pulse_effect').val(pagezone.img_pulse_effect);
								element_layer_id.find('.inner_div').css({'border-top-right-radius': pagezone.bdtr, 'border-top-left-radius': pagezone.bdtl, 'border-bottom-left-radius': pagezone.bdbl, 'border-bottom-right-radius': pagezone.bdbr, 'opacity': pagezone.opacity});
								if (pagezone.status == '0') {
									element_layer_id.removeClass('active').addClass('deactive').css('visibility', 'hidden');
									$('#imagename_' + pagezone.pagezoneid).find('div.dv_my > .line10').removeClass('act').addClass('dact').css('background', 'url(../wysiwyg/images/editor/i-eye.png) -7px -3px no-repeat');
								}
							} else if (pagezone.type == '0') {

								create_text_div(pagezone.pagezoneid, pagezone.content, pagezone.zindex, pagezone.name, 'lock', int_id, 'textdiv', 'init');
								element_layer_id = $('#textdiv_' + pagezone.pagezoneid);
								if (isOpera) {
									element_layer_id.find('#rotatable').css('-o-transform', pagezone.transform);
								} else if (isFirefox) {
									element_layer_id.find('#rotatable').css('-moz-transform', pagezone.transform);
								} else if (isChrome || isSafari) {
									element_layer_id.find('#rotatable').css('-webkit-transform', pagezone.transform);
								}
								element_layer_id.find('#top').val(pagezone.topoffset);
								element_layer_id.find('#left').val(pagezone.leftoffset);
								element_layer_id.find('#height').val(pagezone.height);
								element_layer_id.find('#width').val(pagezone.width);
								element_layer_id.css({
									'top': pagezone.topoffset + 'px', 
									'left': pagezone.leftoffset + 'px', 
									'z-index': pagezone.zindex
								});
								element_layer_id.find('#rotatable').css({
									'height': pagezone.height + 'px', 
									'width': pagezone.width + 'px', 
									'color': pagezone.color, 
									'font-family': pagezone.fontfamily, 
									'font-size': pagezone.fontsize + 'px', 
									'text-decoration': pagezone.decoration, 
									'text-align': pagezone.align, 
									'font-weight': pagezone.fontweight, 
									'font-style': pagezone.fontstyle, 
									'border-color': pagezone.bdcolor, 
									'border-style': pagezone.bdstyle, 
									'border-width': pagezone.bdwidth + 'px', 
									'background-color': pagezone.bgcolor, 
									'padding': pagezone.padding + 'px', 
									'line-height': pagezone.lineheight + 'px', 
									'text-shadow': pagezone.shadow, 
									'border-top-right-radius': pagezone.bdtr + 'px', 
									'border-top-left-radius': pagezone.bdtl + 'px', 
									'border-bottom-left-radius': pagezone.bdbl + 'px', 
									'border-bottom-right-radius': pagezone.bdbr + 'px', 
								});
								element_layer_id.find('#rotatable').find("p").css({'text-decoration': pagezone.decoration});
								element_layer_id.find('#b_color').val(pagezone.bdcolor);
								element_layer_id.find('#textticker_direction').val(pagezone.text_ticker_style);
								element_layer_id.find('#textticker_duration').val(pagezone.text_ticker_duration);
								var font_file_val = $("#text_font_family option[value='" + pagezone.fontfamily + "']").attr("data-font-file");
								if (pagezone.text_font_file) {
									if (font_file_val !== pagezone.text_font_file) {
										element_layer_id.find('#font_file').val(font_file_val);
									} else {
										element_layer_id.find('#font_file').val(pagezone.text_font_file);
									}
								} else {
									var font_file_val = $("#text_font_family option[value='" + pagezone.fontfamily + "']").attr("data-font-file");
									element_layer_id.find('#font_file').val(font_file_val);
								}
								element_layer_id.find('#b_style').val(pagezone.bdstyle);
								element_layer_id.find('#b_width').val(pagezone.bdwidth);
								element_layer_id.find('#kenuburn_effect').val(pagezone.img_kenburn_effect);
								element_layer_id.find('#permission').val(pagezones[m].permission);
								element_layer_id.find('#kenuburn_effect').val(pagezone.img_kenburn_effect);
								if (pagezone.status == '0') {
									element_layer_id.removeClass('active').addClass('deactive').css('visibility', 'hidden');
									$('#textname_' + pagezone.pagezoneid).find('div.dv_my > .line10').removeClass('act').addClass('dact').css('background', 'url(../wysiwyg/images/editor/i-eye.png) -7px -3px no-repeat');
								}
								element_layer_id.find('#rotatable').css('background-color', pagezone.bgcolor);
								element_layer_id.find('#rotatable').css('padding', pagezone.padding + 'px');
								element_layer_id.css('z-index', pagezone.zindex);
								element_layer_id.find('#rotatable').css('line-height', pagezone.lineheight + 'px');
								element_layer_id.find('#rotatable').css('text-shadow', pagezone.shadow);
								element_layer_id.find('#rotatable').css('border-top-right-radius', pagezone.bdtr + 'px');
								element_layer_id.find('#rotatable').css('border-top-left-radius', pagezone.bdtl + 'px');
								element_layer_id.find('#rotatable').css('border-bottom-left-radius', pagezone.bdbl + 'px');
								element_layer_id.find('#rotatable').css('border-bottom-right-radius', pagezone.bdbr + 'px');
								element_layer_id.find('#rotatable').css('word-wrap', 'break-word');
								if (pagezone.status == '1') {
								} else if (pagezone.status == '0') {
									$('#textdiv_' + pagezone.pagezoneid).removeClass('active');
									$('#textdiv_' + pagezone.pagezoneid).addClass('deactive');
									$('#textdiv_' + pagezone.pagezoneid).css('visibility', 'hidden');
									$('#textname_' + pagezone.pagezoneid).find('div.dv_my > .line10').removeClass('act');
									$('#textname_' + pagezone.pagezoneid).find('div.dv_my > .line10').addClass('dact');
									$('#textname_' + pagezone.pagezoneid).find('div.dv_my > .line10').css('background', 'url(../wysiwyg/images/editor/i-eye.png) -7px -3px no-repeat');
								}
							}

						}

						///* Apply different event to text & image layer that is only for rendered data */
						if (pagezones.length > 0) {
							/* Tipsy for text/image/chart layer, active and permission in right side setting tab*/
							layer_list_show_over_tipsy();

							/*Display layer list with checkbox on right side click of mouse point*/
							get_layer_list_on_right_click_and_select_layer();
							/*Roatatable image and text layer*/
							var image_layer_length = $('.image_div').length;
							var text_layer_length = $('.text_div').length;
							if ((parseInt(image_layer_length)) > 0) {
								common_disable_properties('.image_div');
								common_rotatable();
							}
							if ((parseInt(text_layer_length)) > 0) {
								common_disable_properties('.text_div');
								common_rotatable();
							}
						}
						disable_common_settings();
						
						/*Select multiple layer*/
						$('.image_div, .text_div').live('click', function (e) {
							$('#select_div_reset').attr('onclick', 'javascript:select_div_reset();');
							$('#rotate_selected_div').spinner('enable');
							if (e.ctrlKey) {
								select_multiple_layers_active(this);
							}
						});
						
						/*Draggable image and text layer*/
						$(".image_div, .text_div").draggable({
							drag: function(e, ui) {
								set_position_select_layer(ui.position.left, ui.position.top);
								create_error_select_layer_outof_range(this, ui.position.left, ui.position.top, '', 'click');
							}
						});
						$('.image_div').draggable('disable');
						$('.text_div').draggable('disable');
						$('.image_div').find('#rotatable').resizable('disable');
						$('.text_div').find('#rotatable').resizable('disable');
						$(".image_div").removeClass('select_layer');
						$(".text_div").removeClass('select_layer');
						$(".image_div").find('div.ui-resizable-handle').removeClass('select');
						$(".text_div").find('div.ui-resizable-handle').removeClass('select');
						$('.image_div').find("div.ui-rotatable-handle").css("display", "none");
						$('.text_div').find("div.ui-rotatable-handle").css("display", "none");
						$("#image_div_settings").hide();
						$('#text_div_settings').hide();
						$('#div_width').val('');
						$('#div_height').val('');
						$('#div_x_axis').val('');
						$('#div_y_axis').val('');
//						$('.zoom4').css('opacity', '0.3');
//						$('.zoom3').css('opacity', '0.3');

						var x = $('#fixedwidth').position().left;
						var y = $('#fixedwidth').position().top;
						$('.top').remove();
						$('.left').remove();
						/*Display mouse point position*/
						$('#fixedwidth').mousemove(function(e) {
							var x = Math.round((e.pageX - this.offsetLeft) * (original_width / template_width));
							var y = Math.round((e.pageY - this.offsetTop) * (original_width / template_width));
							$('#y_position').val(y);
							$('#x_position').val(x);
						});
						z_index = ++index_highest2;
						img = ++new_int_id;

						$('#create_li_list').sortable({
							handle: '.dots',
							items: "li:not(.ui-state-disabled)",
							containment: 'parent',
							stop: function() {
								var zindex = $('#create_li_list li').length;
								$("#create_li_list li").each(function() {
									var name = this.id.split('name')[0];
									var number = this.id.split('name')[1];
									if (name == 'image') {
										$('#' + name + 'div' + number).css('z-index', --zindex);
									} else {
										$('#' + name + 'div' + number).css('z-index', --zindex);
									}
								});
							}
						});

						/*Deactive tipsy in layer list in setting tab*/
						$('.level2').each(function() {
							$(this).find('.dact').qtip({
								style: {
									classes: 'ui-tooltip-dark ui-tooltip-shadow'
								},
								content: {
									text: 'Inactive'
								},
								position: {
									my: 'bottom center', // Position my top left...
									at: 'top center' // at the bottom right of...								
								}
							});
						});
						/*Bind zoom-in function*/


						$("#zoom_in").bind('click', function() {
							template_zoom_in();
							$("#zoom_in").unbind('click');
						});
					}, complete: function() {
						makeHistory_Array($('.fixedwidth').html(), $('#create_li_list').html());
					}

				}).done(function() {
					$("#throberdiv").remove();
				});
				//makeHistory($('.fixedwidth').html());
			}

			$(function() {
				//find all form with class jqtransform and apply the plugin
				$("form.jqtransform").jqTransform();
				$("#text_font_div").jqTransform();
				$("form.image_spinner").jqTransform();
				$("form.text_spinner").jqTransform();
				$("#size_position_div").jqTransform();
				$("#line_space").jqTransform();
				$('#font_shadow_setting').jqTransform();
				$('#image_shadow_setting').jqTransform();
				$('#kduration_outer_div').jqTransform();
				$(".rounded_ractange").jqTransform();
				
				$(".setting_spin").jqTransform();
				$(".setting_border_type").jqTransform();
			});
			
		</script>
		
	</body>
</html>
