/**
 * Created by charles on 2017/9/11.
 */
/**
 * Created by charles on 2017/9/5.
 */

var AN_LIST=[
            {text:'脉冲',anid:'pulse','clsid':'anPulse'},
            { text:'闪烁',anid:'flash','clsid':'anFlash'},
            {text:'震动',anid:'shake','clsid':'anShake'},
            {text:'弹出',anid:'jackInTheBox'},
            {text:'变形',anid:'rubberBand','clsid':'anRubberBand'},
            {text:'反弹',anid:'bounce','clsid':'anBounce'},
            {text:'摆动',anid:'swing','clsid':'anSwing'},
            {text:'晃动',anid:'wobble','clsid':'anWobble'},
            {text:'扭动',anid:'jello','clsid':'anJello'},
            {text:'弹跳进入',anid:'bounceIn','clsid':'anBounceIn'},
            {text:'顶部弹入',anid:'bounceInDown'},
            {text:'左侧弹入',anid:'bounceInLeft'},
            {text:'右侧弹入',anid:'bounceInRight'},
            {text:'底部弹入',anid:'bounceInUp'},
            {text:'弹跳退出',anid:'bounceOut'},
            {text:'底部弹出',anid:'bounceOutDown'},
            {text:'左侧弹出',anid:'bounceOutLeft'},
            {text:'右侧弹出',anid:'bounceOutRight'},
            {text:'顶部弹出',anid:'bounceOutUp'},
            {text:'渐入式显示',anid:'fadeIn','clsid':'anFadeIn'},
            {text:'顶部渐进滑入',anid:'fadeInDown'},
            {text:'底部渐进滑入',anid:'fadeInUp'},
            {text:'左侧渐进滑入',anid:'fadeInLeft'},
            {text:'右侧渐进滑入',anid:'fadeInRight'},
            {text:'渐进淡出',anid:'fadeOut'},
            {text:'底部渐进淡出',anid:'fadeOutDown'},
            {text:'左侧渐进淡出',anid:'fadeOutLeft'},
            {text:'右侧渐进淡出',anid:'fadeOutRight'},
            {text:'顶部渐进淡出',anid:'fadeOutUp'},
            {text:'翻转',anid:'flip','clsid':'anFlip'},
            {text:'翻转消失',anid:'flipOutY'},
            {text:'旋转滑入',anid:'rollIn','clsid':'anRollIn'},
            {text:'旋转',anid:'rotateIn','clsid' :'anRotateIn'},
            {text:'放大',anid:'zoomInDown','clsid':'anZoomInDown'},
            {text:'左侧平移',anid:'slideInRight'},
            {text:'右侧平移',anid:'slideInRight'},
            {text:'从上到下平移',anid:'slideInDown'}
            ];



var AnCapacity=function(zonediv,zone){



};

AnCapacity.prototype.getAN=function(anid){

    for(var i=0;i<AN_LIST.length;i++){

        var item=AN_LIST[i];
        if(anid==item.anid){
            console.log('anid',anid,'match item',JSON.stringify(item));
            return item;
        }
    }


};
AnCapacity.prototype.call=function(anid,selectors,delay,iterationcount){

   var anobj=this.getAN(anid);
   if(anobj==null || anobj==undefined){
       console.log('animation not found for anid:',anid);
       return;
   }
   var clsid=(anobj.clsid!=null?anobj.clsid : anobj.anid);
   //添加动画前，清除原有的动画
    var oldcls=$(selectors).attr('data-cls');
   $(selectors).removeClass(clsid);


   //添加动画特性
    $(selectors).addClass('animated');

    //延时设置
   if(delay!=null){
    $(selectors).each(function(){
        this.style.webkitAnimationDelay=delay;
    });
   }
    //时长设置
    if(iterationcount==-1){//循环
        $(selectors).addClass('infinite');
        $(selectors)[0].style.removeProperty('animation-duration');
      //  $(selectors)[0].style.removeProperty('animation-delay');

    }else{
        $(selectors).removeClass('infinite');
        $(selectors).each(function(){
            this.style.webkitAnimationIterationCount=iterationcount;

        });
    }
    //添加具体动画样式
    $(selectors).addClass(clsid);
    $(selectors).attr('data-cls',clsid);




};

AnCapacity.prototype.init=function(zonediv,animations) {

    var thisobj = this;
    $(document).ready(function () {

        animations.forEach(function (item, index, arr) {
            console.log('execute...')
            if(item.onevent=='load'){
                thisobj.call(item.anid, item.selectors, item.delay, item.iterationcount);
            }else{
                $(item.selectors).one(item.onevent,function(){
                    console.log('selectors:',item.selectors,'trigger event:',item.onevent);
                    thisobj.call(item.anid,item.selectors,item.delay,item.iterationcount);


                });

            }


        });
    });
};

AnCapacity.prototype.resize=function(scalew,scaleh){




};



AnCapacity.prototype.destory=function(){



};