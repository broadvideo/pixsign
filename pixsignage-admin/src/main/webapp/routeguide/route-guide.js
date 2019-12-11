/**
 * Created by charles on 2017/9/16.
 */

var RouteGuide=function(zonediv,zone,scalew,scaleh,diydir,index){
    this.width=1920;
    this.height=1080;
    this.zone=zone;
    this.zonediv=zonediv;
    this.guidediv=null;
    this.canvas=null;
    this.diydir=diydir;
    this.index=index;
    if (index == 1) {
    	 RouteGuide.defaultbg='guide.png';
    } else if (index == 2) {
    	 RouteGuide.defaultbg='guide02.png';
    }
    this.init();
};
 RouteGuide.animationcounter=0;
 RouteGuide.bgchangeflag=false;
 RouteGuide.defaultbg='/img/guide01.png';
RouteGuide.prototype.getRoute=function(routeid){

    for(var i=0;i<RouteGuide.RouteData.length;i++){

      var route=RouteGuide.RouteData[i];
        if(route.routeid==routeid){
          console.log('roudid:',routeid,'route:',JSON.stringify(route));
          return route;
      }


  }
    return null;


};

RouteGuide.prototype.doAction=function(routeid){

        var route= this.getRoute(routeid);

        this.route(route.routelines);

};

RouteGuide.prototype.initAnimationcounter=function(routelines){
    var counter=0;
    for(var i=0;i<routelines.length;i++){
        counter+=routelines[i].length-1;
    }
    RouteGuide.animationcounter=counter;

};

RouteGuide.prototype.route=function(routelines){

    if(RouteGuide.animationcounter>0){
        console.log('Animation is running,coutter is:',RouteGuide.animationcounter);
        return;
    }
    if(RouteGuide.bgchangeflag){
        //设置默认的bg
        this.changeCanvas(RouteGuide.defaultbg);
        RouteGuide.bgchangeflag=false;
    }
    this.initAnimationcounter(routelines);
    var canvasctx=this.getCanvasCtx();
    this.reset(canvasctx);
    canvasctx.beginPath();
    console.log('Draw dash line....');
   for(var i=0;i<routelines.length;i++) {

    var routeline=routelines[i];
    routeline.forEach(function(item,index,arr){
        console.log(item.x1,item.y1);
    });
    for (var j = 0; j + 1 < routeline.length; j++) {
        if (routeline[j].linebreak != null && routeline[j].linebreak) {
            continue;
        }
        if(routeline[j].bg!=null){
            console.log('change bg to',routeline[j].bg);
            this.changeCanvas(routeline[j].bg);
            RouteGuide.bgchangeflag=true;
        }
        var x1 = routeline[j].x1;
        var y1 = routeline[j].y1;
        var x2 = routeline[j + 1].x1;
        var y2 = routeline[j + 1].y1;
        this.drawDashLine(canvasctx, x1, y1, x2, y2, 8);
    }
    console.log('miniman do animation move');
    this.subMove(routeline);
}

};


RouteGuide.prototype.init=function(){

  var width=this.zonediv.width();
  var height=  this.zonediv.height();
  //创建外部路线导览div
  var guidediv=document.createElement('div');
  guidediv.id='guide_wrapper';
  guidediv.style='display:block;width:100%;height:100%;';
  //创建画布
  var canvas=document.createElement('canvas');
  canvas.id='canvas';
  canvas.width=this.width;
  canvas.height=this.height;
  //canvas.className='guide01';
  $(canvas).css({'background': 'url('+this.diydir+RouteGuide.defaultbg+')','background-repeat':'no-repeat','background-size':'1920px 1080px'});
  guidediv.appendChild(canvas);
  var scalew=width/this.width;
  var scaleh=height/this.height;
  guidediv.style.webkitTransformOrigin='0% 0%';
  guidediv.style.webkitTransform='scale3d('+scalew+','+scaleh+',1)';
  this.zonediv.append($(guidediv));
  this.canvas=canvas;
  this.guidediv=guidediv;



};
RouteGuide.prototype.changeCanvas=function(bg){


    $(canvas).css({'background': 'url('+this.diydir+bg+')','background-repeat':'no-repeat','background-size':'1920px 1080px'});


};

RouteGuide.prototype.createMiniman=function(){
    //创建小人人
    var  miniman=document.createElement('div');
    miniman.className='miniman';
    $(miniman).css({'position':'absolute','display':'none','left':'593px','top':'827px','width':'28px','height':'73px','background':'url(/pixsigdata/routeguide/step.png)'});
    this.guidediv.appendChild(miniman);
    return miniman;
};
//Resize
RouteGuide.prototype.resize=function(){
    var width=this.zonediv.width();
    var height=  this.zonediv.height();
    var scalew=width/this.width;
    var scaleh=height/this.height;
    this.guidediv.style.webkitTransformOrigin='0% 0%';
    this.guidediv.style.webkitTransform='scale3d('+scalew+','+scaleh+',1)';

};

RouteGuide.prototype.getCanvasCtx=function(){
    var ctx= this.canvas.getContext('2d');
    ctx.lineWidth=5;
    ctx.strokeStyle = 'red';
    return ctx;


}
RouteGuide.prototype.drawDashLine=function(context, x1, y1, x2, y2, dashLength){
       console.log("drawdashline:",x1, y1, x2, y2);
        var dashLen = dashLength === undefined ? 5 : dashLength;
        var xpos = x2 - x1;   //得到橫向的寬度;
        var ypos = y2 - y1;  //得到縱向的高度;
        var numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / dashLen);
        //利用正切獲取斜邊的長度除以虛線長度，得到要分為多少段;
        for(var i=0; i<numDashes; i++){
            if(i % 2 === 0){
                context.moveTo(x1 + (xpos/numDashes) * i, y1 + (ypos/numDashes) * i);
            }else{
                //有了橫向寬度和多少段，得出每壹段是多長，起點 + 每段長度 * i = 要繪制的起點；
                context.lineTo(x1 + (xpos/numDashes) * i, y1 + (ypos/numDashes) * i);
            }
        }
       context.stroke();

};
RouteGuide.prototype.subMove= function(data){
    if (data.length==0) {
        return;
    }
   var miniman=this.createMiniman();
    for(var i=0;i+1<data.length;i++) {

        var xlength = Math.abs(data[i+1].x1 - data[i].x1);
        var ylength = Math.abs(data[i+1].y1  - data[i].y1);
        var distance = Math.sqrt(xlength * xlength + ylength * ylength);
        var times = distance *2;
        if(i==0) {
            $(miniman).css({'left': data[0].x1 - 14, 'top': data[0].y1 - 73}).show();
        }
        $(miniman).show().animate({'left': data[i+1].x1-14, 'top': data[i+1].y1-73}, times,function(idx,thisobj){
            return function() {
                RouteGuide.animationcounter--;
                console.log('>>>animation end,with counter:', RouteGuide.animationcounter);
                if(data[idx+1].routelines!=null){

                    thisobj.reset(thisobj.getCanvasCtx());
                    setTimeout(function(){
                        thisobj.route(data[idx+1].routelines);

                    },100);

                }

            };
        }(i,this));
    }
};
RouteGuide.prototype.reset=function(canvasctx) {
    $('.miniman').remove();
    canvasctx.clearRect(0,0,this.canvas.width,this.canvas.height);




};

