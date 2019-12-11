<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>

<%
	String id = new String(request.getParameter("id").getBytes("ISO-8859-1"), "UTF-8");
	String index = new String(request.getParameter("index").getBytes("ISO-8859-1"), "UTF-8");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Canvas画布绘制线路图</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script type="text/javascript"  src="jquery.js"></script>
    <script type="text/javascript"  src="route-guide.js"></script>

    <script type="text/javascript">

        $(document).ready(function(){
            var data=[];

            RouteGuide.defaultbg='guide.png';
            var routeGuide=new RouteGuide($('div.container'),null,null,null,'/pixsigdata/routeguide/<%=id%>/',<%=index%>);



            $('#wytyq').click(function(){

                var routelines=[];
                routelines.push(data);
                routeGuide.route(routelines);

            });

            $('canvas').click(function(e){

            // alert("offset:x1:"+e.offsetX+",y1:"+e.offsetY);
               data.push({x1: e.pageX,y1: e.pageY});
             $('#zb').append('<span style="margin-right:10px;">'+'x1:'+e.pageX+',y1:'+e.pageY+'</span>');

            });


            $('#resetbtn').click(function(){
                data=[];
                $('#zb').html('');
                $('#routline').html('');
               routeGuide.reset(routeGuide.getCanvasCtx());


            });

            $('#genroutelinebtn').click(function(){

                $('#routline').html(JSON.stringify(data));

            });
   		 
   		 
   				 //绘制网格
   		function drawGrid(CANVAS_WIDTH,CANVAS_HEIGHT,GRID_WIDTH,GRID_HEIGHT){
   			var rows=parseInt(CANVAS_WIDTH/GRID_WIDTH);
   			var cols=parseInt(CANVAS_HEIGHT/GRID_HEIGHT);
   			for(var i=0;i<rows;++i)
   			{
   				for(var j=0;j<cols;++j)
   				{
   					drawRect(i,j,GRID_WIDTH,GRID_HEIGHT);
   					if(i==0||j==0)                
   					{
   						drawText(i,j,GRID_WIDTH,GRID_HEIGHT); //增加坐标
   					}
   				}
   			}
   		}
   		 
   			//绘制横坐标与纵坐标
   			function drawText(i,j,GRID_WIDTH,GRID_HEIGHT){
   				
   				var context=routeGuide.getCanvasCtx();
   				context.font="bold 16px Arial";
   				context.textAlign="start";
   				var x_axis=i*100+"";
   				var y_axis=j*100+"";
   				context.fillText(x_axis,i*100,20);   //绘制横坐标
   				context.fillText(y_axis,10,j*100);    //绘制纵坐标
   			 
   			}
   			 
   			//绘制矩形
   			function drawRect(i,j,GRID_WIDTH,GRID_HEIGHT){
   				
   				var context=routeGuide.getCanvasCtx();
   				context.lineWidth=1;
   				context.strokeStyle="lightgrey";
   				context.strokeRect(i*100,j*100,GRID_WIDTH,GRID_HEIGHT);
   			}
   			var CANVAS_WIDTH=1920;
   			var CANVAS_HEIGHT=1080;
   			var GRID_WIDTH=100;
   			var GRID_HEIGHT=100;
   			 
   			//drawGrid(CANVAS_WIDTH,CANVAS_HEIGHT,GRID_WIDTH,GRID_HEIGHT);


        });



       </script>

       <style type="text/css">
           div.container{
               top:0px;
               left:0px;
               text-align:center;
               margin:0px auto;
               display:block;
               width:1920px;
              height:1080px;

               padding:0px;
           }

       </style>


   </head>
   <body style="margin:0px 0px;" >
     <div class="container"  >

     </div>
     <div style="display:block; "></div>
     <div style="width:100%;border-style:none;border-bottom: solid 1px yellowgreen;margin-bottom:10px;"></div>
     <div id="zb"  style="margin:10px auto;">
     </div>
     <div id="routline" style="margin-bottom:10px;">
     </div>
     <div style="width:100%;clear:both;">
     <button id='wytyq' class="btn-primary">绘制线路</button>
     <button id='genroutelinebtn' class="btn btn-default">生成路线</button>
     <button id='resetbtn' class="btn btn-default">重置</button>
     </div>

   </body>
   </html>