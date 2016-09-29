$(document).ready(function(){
    var height=$(window).height();
    var ele=[];
    $('body').height(height);
    circle(95/100,0,0,"#b3ccdc","#6899ba",'html',4);
    circle(90/100,80,50,"#f8e4b6","#f2c96d",'css',3);
    circle(80/100,0,100,"#a3c7a6","#478f4d",'js',2);
    circle(88/100,160,0,"#dfa4cb","#c04a98",'jq',2);
    circle(60/100,160,100,"#dda3a1","#bb4843",'seaJs',5);

    //nav点击事件
    $('.head-nav').find('li').on('click',function(){
        var index=$(this).index();
        //获取anchor的坐标
        for(var i=0;i<3;i++){
            ele.push($('div.anchor').eq(i).position().top);
        }
        $('body').animate({
            scrollTop : ele[index] + 'px'
        },1000);
    })

});
function circle(percent,movex,movey,c1,c2,con,num){
	var p=percent * 100;
	var c=document.getElementById('canvas');
    var ctx=c.getContext("2d");
    var r=30;
    //外圆
    ctx.fillStyle=c1;
    ctx.beginPath();
    ctx.moveTo((r+movex),(r+movey));
    ctx.arc((r+movex),(r+movey),(r-1),0,2*Math.PI);
    ctx.closePath();
    ctx.fill();
    //生成扇形
    ctx.fillStyle=c2;
    ctx.beginPath();
    ctx.moveTo((r+movex),(r+movey));
     if(percent==1){
        ctx.arc((r+movex),(r+movey),r,0,Math.PI*2,false);
    }else if(percent==0){
        ctx.arc((r+movex),(r+movey),r,0,0,true);
    }else{
        ctx.arc((r+movex),(r+movey),r,Math.PI,Math.PI+Math.PI*2*percent,false);
    }
    ctx.closePath();
    ctx.fill();
    // // //内圆
    ctx.fillStyle="#ffffff";
    ctx.beginPath();
    ctx.moveTo((r+movex),(r+movey));
    ctx.arc((r+movex),(r+movey),(r-2),0,2*Math.PI);
    ctx.closePath();
    ctx.fill();
    // //生成中间百分比文字
    ctx.font="15px arial";
    ctx.fillStyle="#000000";
    ctx.textAlign = 'center';  
    ctx.textBaseline = 'middle'; 
    ctx.moveTo((r+movex),(r+movey));
    ctx.fillText(p+"%", (r+movex),(r+movey)); 
   // ctx.fillText(p+"%",((r+movex)-12),((r+movey)+5));
    // ctx.font="15px arial";
    // ctx.fillStyle="#000000";
    ctx.fillText(con,(r+movex),(r+movey));
    // ctx.fillText(con,(x/2),(y*2+15));
}
