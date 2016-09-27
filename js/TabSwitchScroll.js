define(function(require,exports,module){
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
    this.anchor=this.scroll_con.find('.anchor');//获取anchor
    this.tab=$('.switch-scroll').find('li');
    this.index=0;
    if(this.scroll_con_height > this.scroll_warp_height){
      this.Init();
    }else{
      console.log('不显示滚动条！');
    }
  }

  // 初始化
  JqSroll.prototype.Init=function(){
    var self=this;
    self.createScroll();
    self.sliderDragEvent();
    self.mouseScrollEve();
    self.tabClickEve();
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

  //获取anchor的位置
  JqSroll.prototype.getAnchorPosition=function(index){
    var self=this;
    return self.anchor.eq(index).position().top;
  }

  //获取anchor的数据信息
  JqSroll.prototype.getAnchorInfo=function(){
    var self=this;
    var all_anchor=[];
    for(var i=0;i<self.anchor.length;i++){
      all_anchor.push(self.scroll_con[0].scrollTop + self.getAnchorPosition(i))
    }
    return all_anchor;
  }

  //添加anchor的点击事件
  JqSroll.prototype.tabClickEve=function(){
    var self=this;
    self.tab.on('click',function(){
      var ind=$(this).index();
      var positionVal=self.getAnchorPosition(ind)+self.scroll_con[0].scrollTop;
       self.moveFun(positionVal);
    })
  }

  //修改anchor的选择
  JqSroll.prototype.changAnchorSelect=function(index){
    var self=this;
    return self.tab.eq(index).addClass('on').siblings().removeClass('on');
  }

  //滚动条移动的方法
  JqSroll.prototype.moveFun=function(positionVal){
    var self=this;
     var max_slider_rang=self.getMaxSliderPosition();
     var anchor_arr=self.getAnchorInfo();
     self.changAnchorSelect(getIndex(positionVal));
     self.scroll_con.scrollTop(positionVal);
     var slider_rang=self.scroll_con[0].scrollTop / self.getConBarRate();
     slider_rang = (slider_rang < 0) ? 0 : (slider_rang > max_slider_rang) ? max_slider_rang : slider_rang;//限制临界值
     self.scroll_slider.css({top : slider_rang + 'px'});//设置滑块的top值

    //获取anchor的下标
    function getIndex(positionVal){
      for (var i = anchor_arr.length; i >= 0; i--) {
        if (positionVal >= anchor_arr[i]) return i;
      }
    }
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