/* 
* @Author: chunmei
* @Date:   2016-06-29 10:58:02
* @Last Modified by:   anchen
* @Last Modified time: 2016-09-26 12:02:42
*/

function SlideMethod(options){
  var config={
    container    : '.j-banner',                    //banner滑动的容器
    showTabNav   : true,                          //焦点图的分页小图标
    autoPlay     : false,                          //自动轮播
    isShowArrow  : true,                          //箭头是否显示
    dotClick     : true,                          //圆点点击事件
    delayTime    : 500,                            //效果持续时间
    interTime    : 3000,                           //自动轮播运行的间隔
    slideEffect  : 'leftmove',                    //轮播的形式 左移动:leftmove  淡入淡出:fadeInOut   手风琴:slidedown
    showNumber   : 2,                            //轮播显示的数量
    scrollNum    : 2,                            //滚动个数
    width        : 'fullscreen',
    ispnLoop     :true                           //前后按钮循环       
  };
  if (options) {
    //合并配置
    config = $.extend(true, config, options);
  }

  this.config = config;

  //banner容器
  this.$banner_con=$(this.config.container);

  //banner容器下的ul
  this.$banner_ul=this.$banner_con.find('ul');

  //banner容器下的li
  this.$banner_li=this.$banner_ul.find('li');

  //图片个数
  this.li_len=this.$banner_li.length;

  //li宽度
  this.li_wid=0;

  //轮播显示的数量不能大于图片的数量
  if(this.config.showNumber > this.li_len  || this.config.scrollNum > this.config.showNumber){
    alert('显示数量和滚动个数超出范围！');
    return;
  }

  //轮播显示数量等于轮播内容的个数，不显示左右按钮和分页圆点
  if(this.config.showNumber==this.li_len){
      this.ifShow=null;
  }
  //索引值
  this.index=0;

  //前一个索引值
  this.old_index=this.index;

  //自动轮播
  this.auto;

  //计算手风琴的比列
  this.ratio=1 / (this.li_len+1);

  //判断左右按钮
  this.isleft=true;

  this.initialize();

  //如果是手风琴效果不显示左右按钮和分页圆点
  if(this.config.slideEffect==='slidedown'){
    this.methodSet();
  }else{
    this.ifShow();
  }

}


//判断宽度是否全屏
SlideMethod.prototype.iffullscreen=function(){
  var self=this;
  if(self.config.width=='fullscreen'){
    self.config.width=$(window).width();
    if(self.config.width < 1000){
      self.config.width=1000;
    }
    return self.config.width;
  }else{
    self.config.width=self.config.width;
    return self.config.width;
  }
}

//计算宽度高度的方法
SlideMethod.prototype.countSize=function(fun){
  var self=this;
  self.iffullscreen();

  self.li_wid=self.config.width / self.config.showNumber;
  // 根据slideeffect效果的不一样，设置不一样的宽度，高度
  switch(self.config.slideEffect){
    case 'fadeInOut':
      self.$banner_li.css({width: self.config.width + 'px',height : parseInt(self.config.width / 3.84)});
      self.$banner_ul.css({width: Math.ceil((self.config.width * self.li_len))  + 'px'});
      break;
    case 'leftmove' :
      fun;
      self.$banner_li=self.$banner_ul.find('li');
      self.$banner_li.css({width: self.li_wid + 'px',height : parseInt(self.config.width / 3.84)});
      self.$banner_ul.css({width: (self.li_len+self.config.showNumber+self.cloneNum)*self.li_wid  + 'px',left:-(self.cloneNum+self.index*self.config.scrollNum)*self.li_wid + 'px'});
      break;
    case 'slidedown' :
      self.$banner_ul.css({width: (self.config.width * self.li_len)  + 'px'});
      self.$banner_li.eq(self.index).css({width: self.config.width * (2 * self.ratio) + 'px',height : parseInt(self.config.width / 3.84)}).siblings('li').css({width:  self.config.width * self.ratio + 'px',height : parseInt(self.config.width / 3.84)});
      break;
  }
  self.$banner_con.css({width: self.config.width + 'px'});

}

//初始化宽度，高度
SlideMethod.prototype.initialize=function(){
  var self=this;
  if(self.config.slideEffect=='leftmove'){
    self.countSize(self.CloneLi());
  }else{
    self.countSize();
  }
  
  self.resize();
}

//响应式
SlideMethod.prototype.resize=function(){
  var self=this;
  $(window).resize(function(event) {
    self.config.width=$(window).width();
   self.countSize();
  });
}

//是否自动播放
SlideMethod.prototype.doAutoPlay=function(){
  var self=this;
  self.isleft=true;
  if(self.config.autoPlay==true){
      self.auto=setInterval(function(){//计时器，自动轮番
        self.index++;
        self.methodSet();
      },self.config.interTime);
    }
}

//判断调用何种效果
SlideMethod.prototype.methodSet=function(){
  var self=this;
  switch (self.config.slideEffect){
    case 'fadeInOut' : 
      self.slideFadeInOutMo();
      break;
    case 'slidedown' :
      self.SlideDownMo();
      break;
    case 'leftmove' :
      self.slideLeftMoveMo();
      break;
  }
}

//淡入淡出效果方法
SlideMethod.prototype.slideFadeInOutMo=function(){
  var self=this;
  if(self.index<0){
    self.index=0;
  }else if(self.index>self.li_len-1){
    self.index=self.li_len-1;
  }
  self.$banner_li.eq(self.index).fadeIn('slow').siblings().fadeOut('slow');
  self.$page_li.eq(self.index).addClass('on').siblings().removeClass('on');
}

//手风琴效果方法
SlideMethod.prototype.SlideDownMo=function(){
  var self=this;
  //放大的宽度
  var enlarge_w=self.config.width * (2 * self.ratio);
  //缩小的宽度
  var scale_w=self.config.width * self.ratio;

  self.$banner_li.mouseenter(function(){
    self.index = $(this).index();
    $(this).stop().animate({width: enlarge_w + 'px'},self.config.delayTime).siblings("li").stop().animate({width: scale_w + 'px'},self.config.delayTime);
  });
}

//克隆li方法
SlideMethod.prototype.CloneLi=function(){
  var self=this;
  self.cloneNum=0;
  //计算li前面要克隆多少个li
  if (self.li_len >= self.config.showNumber) {
    self.cloneNum = 0;
    if (self.li_len % self.config.scrollNum) {
      self.cloneNum = self.li_len % self.config.scrollNum;
    } else {
      self.cloneNum = self.config.scrollNum;
    }
  } else {
    self.cloneNum = 0
  }
  //克隆li
  for(var i=0;i<self.cloneNum;i++){//前面
    var clone=self.$banner_li.eq(self.li_len-i-1).clone(true).addClass('clone');
    self.$banner_ul.prepend(clone); 
  }
  for(var i=0;i<self.config.showNumber;i++){//后面
    var clone=self.$banner_li.eq(i).clone(true).addClass('clone');
    self.$banner_ul.append(clone);
  }
}

//左移动效果方法
SlideMethod.prototype.slideLeftMoveMo=function(){
  var self=this;
  self.old_index=self.index;
  if ( self.index >= self.navObjSize) { 
      self.index = 0; 
  } 
  else if( self.index < 0) { 
      self.index = self.navObjSize-1; 
  }
  //计算滚动的个数
  var scrollNum=function(ind){ 
    var _tempCs= ind*self.config.scrollNum; 
    if( ind==self.navObjSize ){ _tempCs=self.li_len; }else if( ind==-1 && self.li_len%self.config.scrollNum!=0){ _tempCs=-self.li_len%self.config.scrollNum; }
    return _tempCs;
  }
  //添加动画
  self.$banner_ul.stop(true,true).animate({left:-(scrollNum(self.old_index)+self.cloneNum)*self.li_wid + 'px'} ,self.config.delayTime,function(){
    //判断临界点
    if(self.old_index<=-1){
      self.$banner_ul.css('left',-(self.cloneNum+(self.navObjSize-1)*self.config.scrollNum)*self.li_wid +'px');
    }
    else if(self.old_index>=self.navObjSize){
       self.$banner_ul.css('left',-self.cloneNum*self.li_wid +'px');
    }
  });
  //nav小图标添加类
  self.$page_li.eq(self.index).addClass('on').siblings().removeClass('on');
}

//设置分页，和左右按钮
SlideMethod.prototype.ifShow=function(){
  var self=this;
  self.config.isShowArrow===true ? showArrow() : false;
  self.config.dotClick===true ? showDot() : false;

  //显示左右按钮方法
  function showArrow(){
    self.$banner_con.append('<a href="javascript:void(0);" class="left-arrow arrow"><</a><a href="javascript:void(0);" class="right-arrow arrow">></a>');
    var $arrowl=self.$banner_con.find('.left-arrow');
    var $arrowr=self.$banner_con.find('.right-arrow');
    $arrowr.on('click',function(){
      if(self.config.ispnLoop || self.index!=self.navObjSize-1){
        self.index++; 
        self.methodSet();
      }
    });
    $arrowl.on('click',function(){
      if(self.config.ispnLoop || self.index!=0){
        self.index--;
        self.methodSet();
      }
    }); 
    
    $arrowl.add($arrowr).hover(function() {
      clearInterval(self.auto);
    }, function() {
      self.doAutoPlay();
    });
  }

  //计算显示的nav小图标
  function countNav(){
    // if(self.config.slideEffect==='leftmove'){
      if (self.li_len >= self.config.showNumber) {
        if(self.li_len%self.config.scrollNum!=0){
          self.navObjSize=(self.li_len/self.config.scrollNum^0)+1;
        }else{
          self.navObjSize=self.li_len/self.config.scrollNum;
        }
      }else{
        self.navObjSize=1;
      }
    //   return self.navObjSize;
    // }else if(self.config.slideEffect==='fadeInOut'){
    //   if(self.li_len%self.config.scrollNum!=0){
    //       self.navObjSize=(self.li_len/self.config.scrollNum^0);
    //     }else{
    //       self.navObjSize=self.li_len/self.config.scrollNum;
    //     }
    //   return self.navObjSize;
    // }
  }

  //显示分页圆点的方法
  function showDot(){
    self.$banner_con.append('<div class="show-num clearfloat"><ul></ul></div>');
    countNav();
    for(var j=0;j<self.navObjSize;j++){
      self.$banner_con.find('div.show-num ul').append('<li></li>');
    }
    self.$page_li= self.$banner_con.find('.show-num').find('li');
    self.$page_li.eq(0).addClass('on');
    self.$page_li.on('click',function(){
      self.index=$(this).index();
      self.methodSet();
      $(this).addClass('on').siblings().removeClass('on');
    });
  }
}