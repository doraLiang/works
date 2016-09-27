/* 
* @Author: chunmei
* @Date:   2016-06-21 09:39:47
* @Last Modified by:   anchen
* @Last Modified time: 2016-09-06 15:51:57
* @dec: 滚动条插件
*/

//javascript写法
/*define(function (require, exports, module) {
  var $ = require('$');
  function ScrollBar(options){
    /// <summary>
    /// Page 构造函数
    /// </summary>

    if (!(this instanceof ScrollBar)) {
      return new ScrollBar(options);
    }

    //默认配置
    var config = {
        container:'scroll-warp',
        scrollCon:'scroll-con',
        barWid: 10,
        slideWid:5,
        barClass:'scroll-bar',
        slideClass:'scroll-slide'
    };

    if (options) {
      //合并配置
      config = $.extend(true, config, options);
    }

    this.config = config;
    this.scroll_warp=document.getElementById(this.config.container);
    this.scroll_con=document.getElementById(this.config.scrollCon);
    this.scroll_bar=null;
    this.scroll_slider=null;
    this.scroll_warp_height=this.scroll_warp.offsetHeight;
    this.scroll_con_height=this.scroll_con.scrollHeight;
    this.scorll_slider_height=this.scroll_warp_height / this.scroll_con_height * this.scroll_warp_height;
    this.init();
  }

  ScrollBar.prototype.init = function () {
      /// <summary>
      /// Page 初始化方法
      /// </summary>
      var self=this;
      self.createScroll();
      self.SliderDragEvent();
      self.MouseScrollEve();
  }
  //创建滚动条
  ScrollBar.prototype.createScroll=function(){
      var self=this;
      self.scroll_bar=document.createElement('div');//创建滚动条
      self.scroll_slider=document.createElement('div');//创建滚动滑块
      self.scroll_bar.appendChild(self.scroll_slider);//滑块添加到滚动条
      self.scroll_warp.appendChild(self.scroll_bar);//滚动条添加到父容器
      self.scroll_warp.style.position='relative';

      //调用容器/滑块样式
      self.initScrollBar(self.config.barClass);
      self.initScrollSlider(self.config.slideClass);
  }
  //初始化滚动条
  ScrollBar.prototype.initScrollBar=function(classname){
      var self=this;
      self.scroll_bar.style.height=self.scroll_warp_height+'px';
      self.scroll_bar.style.width=self.config.barWid+'px';
      self.scroll_bar.style.top='0px';
      self.scroll_bar.style.right='0px';
      self.scroll_bar.className=classname;
  }
  //初始化滑块
  ScrollBar.prototype.initScrollSlider=function(classname){
      var self=this;
      var slider_height=self.scroll_warp_height / self.scroll_con_height * self.scroll_warp_height;
      self.scroll_slider.style.height=slider_height+'px';
      self.scroll_slider.style.top='0px';
      self.scroll_slider.className=classname;
  }

  //获取滚动内容的最大距离值
  ScrollBar.prototype.getMaxConPosition=function(){
    var self=this;
    return self.scroll_con_height - self.scroll_warp_height;
  }

  //获取滚动滑块的最大距离值
  ScrollBar.prototype.getMaxSliderPosition=function(){
    var self=this;
    return self.scroll_warp_height-self.scorll_slider_height;
  }

  //获取滑块的位置
  ScrollBar.prototype.getSliderPosition=function(){
    var self=this;
    return self.scroll_slider.offsetTop;
  }

  //获取滚动内容和滑块的比列
  ScrollBar.prototype.getConBarRate=function(){
    var self=this;
    return self.getMaxConPosition() / self.getMaxSliderPosition();
  }

  //滚动条移动的方法
  ScrollBar.prototype.moveFun=function(positionVal){
    var self=this;
     var max_slider_rang=self.getMaxSliderPosition();//滚动滑块移动的最大的高度
      self.scroll_con.scrollTop=positionVal;
      var slider_rang=self.scroll_con.scrollTop / self.getConBarRate();
      slider_rang = (slider_rang < 0) ? 0 : (slider_rang > max_slider_rang) ? max_slider_rang : slider_rang;
      self.scroll_slider.style.top=slider_rang + 'px';
  }

  //鼠标拖放滚动条
  ScrollBar.prototype.SliderDragEvent=function(){
    var self=this;
    self.scroll_slider.onmousedown=function(event){
      event.preventDefault();
      var start_pageY=event.pageY;//获取鼠标第一个点的位置
      var slider_position=self.getSliderPosition();
      document.onmousemove=function(event){
        event.preventDefault();
        var differ=event.pageY-start_pageY;
        var con_bar_rate=self.getConBarRate();
        self.moveFun((slider_position + differ) * con_bar_rate);
      }
      document.onmouseup=function(event){
        event.preventDefault();
        document.onmousemove=null;
      }
    }
  }

  //鼠标滚轮
  ScrollBar.prototype.MouseScrollEve=function(){
    var self=this;
    (self.addEvents(self.scroll_con,'mousewheel',function(event){
      var slider_position=self.getSliderPosition();
      var wheelStep=parseInt(self.scroll_warp_height / self.scorll_slider_height);
      var direction=event.delta;
      var con_bar_rate=self.getConBarRate();
      self.moveFun((slider_position + direction * wheelStep) * con_bar_rate);
    }))();  
  }

  //添加事件，处理各浏览器的兼容性
  ScrollBar.prototype.addEvents=function(el, type, fn, capture){
    var self=this;
    var _eventCompat = function(event) {
      var type = event.type;//通过鼠标滚轮事件的type属性来区分浏览器
      if (type == 'DOMMouseScroll' || type == 'mousewheel') {
        event.delta = (event.wheelDelta) ? -event.wheelDelta / 120 : (event.detail || 0) / 3; // event.delta= -1;
      }
      if (event.srcElement && !event.target) {
        event.target = event.srcElement;
      }
      if (!event.preventDefault && event.returnValue !== undefined) {
        event.preventDefault = function() {
          event.returnValue = false;
        };
      }
      return event;
    };
    if (window.addEventListener) {
      return function() {  //火狐兼容
        if (type === "mousewheel" && document.mozHidden !== undefined) {
          type = "DOMMouseScroll";
        }
        el.addEventListener(type, function(event) {
          fn.call(this, _eventCompat(event));
        }, capture || false);
      }
    } else if (window.attachEvent) {
      console.log("mousewheel");
      return function() {
        el.attachEvent("on" + type, function(event) {
          event = event || window.event;
          fn.call(el, _eventCompat(event));
        });
      }
    }
    return function() {};
  }
  module.exports = ScrollBar;
});*/


//  jquery写法
define(function(require,exports,module){
  var $ = require('$');
  function JqSroll(options){
    if (!(this instanceof JqSroll)) {
        return new JqSroll(options);
    }

    //默认配置
    var config = {
        container:'scroll-warp',
        scrollCon:'scroll-con',
        barWid: 10,
        slideWid:5,
        barClass:'scroll-bar',
        slideClass:'scroll-slide',
        wheelStep: 14 // 滚动步幅
    };

    if (options) {
        //合并配置
        config = $.extend(true, config, options);
    }
    this.config=config;
    this.scroll_warp=$('#'+this.config.container);
    this.scroll_con=$('#'+this.config.scrollCon);
    this.scroll_bar=null;
    this.scroll_slider=null;
    this.scroll_warp_height=this.scroll_warp[0].offsetHeight;
    this.scroll_con_height=this.scroll_con[0].scrollHeight;
    this.scorll_slider_height=parseInt(this.scroll_warp_height / this.scroll_con_height * this.scroll_warp_height);//计算滑块的高度
    this.slider_position;//滑块位置
    if(this.scroll_con_height > this.scroll_warp_height){
      this.init();
    }else{
      console.log('不显示滚动条！');
    }

  }

  // 初始化
  JqSroll.prototype.init=function(){
    var self=this;
    self.createScroll();
    self.sliderDragEvent();
    self.mouseScrollEve();
  }

  //创建和设置滚动条
  JqSroll.prototype.createScroll=function(){
    var self=this;
    var create_scroll_bar=$('<div></div>');//创建滚动条
    var create_scroll_slider=$('<div></div>');//创建滚动滑块
    self.scroll_bar=create_scroll_bar;
    self.scroll_slider=create_scroll_slider;
    self.scroll_bar.addClass(self.config.barClass);//添加类
    self.scroll_slider.addClass(self.config.slideClass);//添加类
    self.scroll_bar.append(self.scroll_slider);//添加滑块到滚动条
    self.scroll_warp.append(self.scroll_bar).css({position: 'relative'});//添加滚动条到滚动模块，然后设置滚动模块
    countHei();
    
    //计算滚动条高度
    function countHei(){
      self.scroll_bar.css({
        width:self.config.barWid,
        height: '100%',
        top: '0',
        right:'0'
      });
      self.scroll_slider.css({
        width:self.config.slideWid,
        height:self.scorll_slider_height+'px',
        top:'0'
      });
    }
  }

 //获取内容滚动的最大距离值
  JqSroll.prototype.getMaxConPosition=function(){
    var self=this;
    return self.scroll_con_height - self.scroll_warp_height;
  }
  //获取滚动滑块的最大值
  JqSroll.prototype.getMaxSliderPosition=function(){
    var self=this;
    return self.scroll_warp_height - self.scorll_slider_height;
  }

  //获取滑块的位置
  JqSroll.prototype.getSliderPosition=function(){
    var self=this;
    return self.scroll_slider.position().top;
  }

  //获取滚动内容和滑块的比列
JqSroll.prototype.getConBarRate=function(){
  var self=this;
  return self.getMaxConPosition() / self.getMaxSliderPosition();
}

  //滚动条移动的方法
JqSroll.prototype.moveFun=function(positionVal){
  var self=this;
  var max_slider_rang=self.getMaxSliderPosition();
  self.scroll_con.scrollTop(positionVal);
  var slider_rang=self.scroll_con[0].scrollTop / self.getConBarRate();
  slider_rang = (slider_rang < 0) ? 0 : (slider_rang > max_slider_rang) ? max_slider_rang : slider_rang;//限制临界值
  self.scroll_slider.css({top : slider_rang + 'px'});//设置滑块的top值
}

  //鼠标拖放滚动条
JqSroll.prototype.sliderDragEvent=function(){
  var self=this;
  //添加鼠标拖放事件
  self.scroll_bar.on('mousedown',function(event){
    event.preventDefault();
    var start_pageY=event.pageY;//获取鼠标第一个点的位置
    self.slider_position=self.getSliderPosition();
    $(document).on('mousemove.scroll',function(event){
      event.preventDefault();
      var differ = event.pageY - start_pageY;//鼠标两点之间的相差值
      var con_bar_rate=self.getConBarRate();
      self.moveFun((self.slider_position + differ) *  con_bar_rate);
    }).on("mouseup.scroll", function(event){
        event.preventDefault();
        $(document).off(".scroll");//移除scroll事件名的事件
    });
  });
}

//鼠标滚轮
  JqSroll.prototype.mouseScrollEve=function(){
    var self=this;
    self.scroll_con.on('mousewheel DOMMouseScroll',function(e){
      e.preventDefault();
      self.slider_position=self.getSliderPosition();
      var oEv=e.originalEvent;
      var wheelDir=oEv.wheelDelta ? -oEv.wheelDelta/120 : oEv.detail/3;
      var wheelStep=self.scroll_warp_height / self.scorll_slider_height;
      var con_bar_rate=self.getConBarRate();
      console.log(wheelDir * wheelStep)
      self.moveFun((self.slider_position + wheelDir * wheelStep) * con_bar_rate);
    })
  }

  module.exports=JqSroll;
});