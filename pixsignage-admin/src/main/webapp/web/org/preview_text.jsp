<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html lang="en">
    <head>
        <title></title>
        <meta name="viewport" content="width=<%=request.getAttribute("width") %>, user-scalable=no, initial-scale=1.0, target-densitydpi=device-dpi" />
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<!-- Copyright 2006-2014 Daniel Garner. Part of the Xibo Open Source Digital Signage Solution. Released under the AGPLv3 or later. -->
        <style type="text/css">
            body {
                margin: 0;
            }

            h1, h2, h3, h4, p {
            	margin-top: 0;
            }
        </style>
    
    <script src="../assets/plugins/jquery-1.10.2.min.js" type="text/javascript"></script>
    
    <script type="text/javascript">
/**
* author Remy Sharp
* url http://remysharp.com/tag/marquee
*/
(function(e){e.fn.marquee=function(t){function i(e,t,n){var r=n.behavior,i=n.width,s=n.dir;var o=0;if(r=="alternate"){o=e==1?t[n.widthAxis]-i*2:i}else if(r=="slide"){if(e==-1){o=s==-1?t[n.widthAxis]:i}else{o=s==-1?t[n.widthAxis]-i*2:0}}else{o=e==-1?t[n.widthAxis]:0}return o}function s(){var t=n.length,r=null,o=null,u={},a=[],f=false;while(t--){r=n[t];o=e(r);u=o.data("marqueeState");if(o.data("paused")!==true){r[u.axis]+=u.scrollamount*u.dir;f=u.dir==-1?r[u.axis]<=i(u.dir*-1,r,u):r[u.axis]>=i(u.dir*-1,r,u);if(u.behavior=="scroll"&&u.last==r[u.axis]||u.behavior=="alternate"&&f&&u.last!=-1||u.behavior=="slide"&&f&&u.last!=-1){if(u.behavior=="alternate"){u.dir*=-1}u.last=-1;o.trigger("stop");u.loops--;if(u.loops===0){if(u.behavior!="slide"){r[u.axis]=i(u.dir,r,u)}else{r[u.axis]=i(u.dir*-1,r,u)}o.trigger("end")}else{a.push(r);o.trigger("start");r[u.axis]=i(u.dir,r,u)}}else{a.push(r)}u.last=r[u.axis];o.data("marqueeState",u)}else{a.push(r)}}n=a;if(n.length){setTimeout(s,25)}}var n=[],r=this.length;this.each(function(o){var u=e(this),a=u.attr("width")||u.width(),f=u.attr("height")||u.height(),l=u.after("<div "+(t?'class="'+t+'" ':"")+'style="display: block-inline; width: '+a+"px; height: "+f+'px; overflow: hidden;"><div style="float: left; white-space: nowrap;">'+u.html()+"</div></div>").next(),c=l.get(0),h=0,p=(u.attr("direction")||"left").toLowerCase(),d={dir:/down|right/.test(p)?-1:1,axis:/left|right/.test(p)?"scrollLeft":"scrollTop",widthAxis:/left|right/.test(p)?"scrollWidth":"scrollHeight",last:-1,loops:u.attr("loop")||-1,scrollamount:u.attr("scrollamount")||this.scrollAmount||2,behavior:(u.attr("behavior")||"scroll").toLowerCase(),width:/left|right/.test(p)?a:f};if(u.attr("loop")==-1&&d.behavior=="slide"){d.loops=1}u.remove();if(/left|right/.test(p)){l.find("> div").css("padding","0 "+a+"px")}else{l.find("> div").css("padding",f+"px 0")}l.bind("stop",function(){l.data("paused",true)}).bind("pause",function(){l.data("paused",true)}).bind("start",function(){l.data("paused",false)}).bind("unpause",function(){l.data("paused",false)}).data("marqueeState",d);n.push(c);c[d.axis]=i(d.dir,c,d);l.trigger("start");if(o+1==r){s()}});return e(n)}})(jQuery)
        </script>

        <script type="text/javascript">
/*global jQuery */
/*!
* FitText.js 1.0
*
* Copyright 2011, Dave Rupert http://daverupert.com
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*
* Date: Thu May 05 14:23:00 2011 -0600
*/
(function(e){e.fn.fitText=function(t,n){var r={minFontSize:Number.NEGATIVE_INFINITY,maxFontSize:Number.POSITIVE_INFINITY};return this.each(function(){var i=e(this);var s=t||1;if(n){e.extend(r,n)}var o=function(){i.children().css("font-size",Math.max(Math.min(i.width()/(s*10),parseFloat(r.maxFontSize)),parseFloat(r.minFontSize)))};o();e(window).resize(o)})}})(jQuery)
        </script>
        
        <script type="text/javascript">
/**
* Xibo - Digital Signage - http://www.xibo.org.uk
* Copyright (C) 2009-2014 Daniel Garner
*
* This file is part of Xibo.
*
* Xibo is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* any later version.
*
* Xibo is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with Xibo.  If not, see <http://www.gnu.org/licenses/>.
*/
jQuery.fn.extend({
	xiboRender : function(e,t) {
		var n = {
			type : "ticker",
			direction : "single",
			duration : "50",
			durationIsPerItem : false,
			numItems : 0,
			takeItemsFrom : "start",
			itemsPerPage:0,
			scrollSpeed:"2",
			scaleMode:"scale"
		};
		var e=$.extend({},n,e);
		e.width=$(window).width();
		e.height=$(window).height();
		if (e.width == 0) {
			e.width = e.originalWidth;
		}
		if (e.height == 0) {
			e.height = e.originalHeight;
		}
		e.scaleFactor=Math.min(e.width/e.originalWidth,e.height/e.originalHeight);
		this.each(function(){
			if(e.type=="ticker"){
				if(e.sourceid==undefined){
					console.error("Source ID undefined - assuming 1");
					e.sourceid=1
				}
				if(e.sourceid==1){
					if(e.takeItemsFrom=="end"){
						t.reverse()
					}
					if(e.numItems>t.length||e.numItems==0)
						e.numItems=t.length;
					t=t.slice(0,e.numItems);
					if(e.takeItemsFrom=="end"){
						t.reverse()
					}
				}else{
					e.numItems=t.length
				}
			}
			var n=e.numItems;
			var r=e.itemsPerPage>0?Math.ceil(e.numItems/e.itemsPerPage):e.numItems;
			var i=1;
			var s=this;
			for(var o=0;o<t.length;o++){
				if(e.direction=="single"&&e.itemsPerPage>0&&(i>=e.itemsPerPage||o==0)){
					s=$("<div/>").addClass("page").appendTo(this);
					i=0
				}
				$("<div/>").addClass("item").html(t[o]).appendTo(s);
				i++
			}
			if(e.scaleMode=="fit"){
				$("*",this).css("font-size","");
				$(this).css({width:e.originalWidth,height:e.originalHeight}).fitText(1.75)
			}else if(e.scaleMode=="scale"){
				$(this).css({zoom:e.scaleFactor,width:e.originalWidth,height:e.originalHeight})
			}
		
			var u=false;
			if(e.direction=="single"){
				var a=e.itemsPerPage>0?"> .page":"> .item";
				var f=e.itemsPerPage>0?r:n;
				var l=e.durationIsPerItem?e.duration:e.duration/f;
				$(this).cycle({
					fx:e.transition,timeout:l*1e3,slides:a
				})
			}else if(e.direction=="left"||e.direction=="right"){
				u=true;
				$(" .item",this).css({display:"inline","padding-left":"4px"});
				$(" .item p",this).css({display:"inline"})
			}else if(e.direction=="up"||e.direction=="down"){
				u=true
			}
			if(u){
				var c=$("<div/>").addClass("scroll").attr({
					scrollamount:e.scrollSpeed,
					scaleFactor:e.scaleFactor,
					behaviour:"scroll",
					direction:e.direction,
					height:e.originalHeight,
					width:e.originalWidth
				});
				$(this).wrapInner(c);
				$(this).find(".scroll").marquee()
			}
			if(e.direction=="up"||e.direction=="down"){
				$(this).children().children().css("white-space","normal")
			}
		})
	},

	dataSetRender:function(e){
		if(e===undefined||e===null){
			e={duration:5,transition:"fade"}
		}
		$(this).each(function(){
			var t=$(this).attr("totalPages");
			$(this).cycle({
				fx:e.transition,
				timeout:e.duration*1e3/t,
				slides:"> table"
			})
		})
	}
});

if(!window.console){
	(function(){
		var e=["log","debug","info","warn","error","assert","dir","dirxml","group","groupEnd","time","timeEnd","count","trace","profile","profileEnd"], t,
		n=e.length;
		window.console={};
		for(t=0;t<n;t++){
			window.console[e[t]]=function(){}
		}
	})()
}

        </script>
        <!--script type="text/javascript" src="modules/preview/xibo-text-render.js"></script-->

<script type="text/javascript">
function init() {        
	$('body').xiboRender(options, items);   
}    

var options = {
	'type':'text',
	'sourceid':1,
	'direction':'<%=request.getAttribute("direction") %>',
	'duration':'60',
	'durationIsPerItem':false,
	'numItems':1,
	'takeItemsFrom':'start',
	'itemsPerPage':0,
	'scrollSpeed':'<%=request.getAttribute("speed") %>',
	'scaleMode':'scale',
	'originalWidth':'<%=request.getAttribute("width") %>',
	'originalHeight':'<%=request.getAttribute("height") %>'
};   
var items = ['<p><span style="font-size:<%=request.getAttribute("size") %>px;"><span style="color:<%=request.getAttribute("color") %>;"><%=request.getAttribute("raw") %><\/span><\/span><\/p>\n'];
</script>

<script type="text/javascript">
        	// Clock variables
			var tick;
			var dayTick;

	        // Do we need to call any of our substituted functions
	        $(document).ready(function() {
	            if (typeof(init) != "undefined")
	                init();

	            if (typeof(EmbedInit) != "undefined")
	                EmbedInit();

	            // See if there are any clocks
	            var tmp = document.getElementById('clock');

				if (tmp != null) {
					dispClock();
				}

				var tmp = document.getElementById('date');

				if (tmp != null) {
					dispDate();
				}
	        });

			function stop() {
			  clearTimeout(tick);
			  clearTimeout(dayTick);
			}

			function dispClock() {
				var ut=new Date();
				var h,m;
				var time=" ";
				h=ut.getHours();
				m=ut.getMinutes();
				if(m<=9) m="0"+m;
				if(h<=9) h="0"+h;
				time+=h+":"+m;
				document.getElementById('clock').innerHTML=time;
				tick=setTimeout("dispClock()",1000);
			}

			function dispDate() {
				var ut=new Date();
				document.getElementById('date').innerHTML= ut.toLocaleDateString();
				dayTick=setTimeout("dispDate()",60000);
			}
        </script>
        </head>
<body>
    <!--[[[BODYCONTENT]]]-->
</body>
</html>
<!--[[[CONTROLMETA]]]-->