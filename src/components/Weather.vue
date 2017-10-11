<template>
  <div>
       <div class="wd-box">
         <canvas :id="oid" height="456" width="1320"  ></canvas>
      </div>
  </div>
</template>

<script>
export default {
    data () {
      return {
          oid:"obj_"+this.dat.id
      }
    },
    props:["dat"],
    methods:{
       drawWeather(){
              let _this=this;
              let canvas=document.querySelector("#"+this.oid);
              let ctx=canvas.getContext("2d");
              let dataArr=[];
              let canW=canvas.width;
              let canH=canvas.height;
              let s=this.dat.data.split("|");
              for(let i=0;i<5;i++){
                 dataArr.push(s[i]);
              }
              drawLineFun();
              function drawLineFun(){
                var tempNum=parseInt(dataArr[0].split(":")[1]);
                ctx.clearRect(0,0,canW,canH);
                ctx.strokeStyle="rgba(255,255,255,1)";
                ctx.lineWidth=3;
                ctx.beginPath();
                ctx.lineCap="round";
                ctx.lineJoin="round";
                dataArr.forEach((val,key)=>{
                    let cz=0;
                    let dnumX=Math.ceil(canW/(dataArr.length-1)*key);
                    //let dnumY=(maxNum-parseInt(val.split(":")[1]))*(canH*scale)/maxNum*2;
                     if(key>0){
                        cz=(tempNum-parseInt(val.split(":")[1]))*15;
                     }
                    let dnumY=canH/2+cz;
                    let txtMax=val.split(":")[1]+"℃";
                    let txtMin=val.split(":")[0]+"℃";
                    let txtW=ctx.measureText(txtMax).width;
                    if(key==0){
                      ctx.moveTo(dnumX,dnumY);
                    }
                    ctx.lineTo(dnumX,dnumY);
                    if(key==0){
                      dnumX=dnumX+15;
                    }else if(key==dataArr.length-1){
                      dnumX=dnumX-(txtW+15);
                    }else{
                      dnumX=dnumX-txtW/2;
                    }
                    ctx.font="42px Verdana";
                    ctx.fillStyle="rgba(255,255,255,1)";
                    ctx.fillText(txtMin,dnumX,dnumY+80);
                    ctx.fillText(txtMax,dnumX,dnumY-55);
                })
                ctx.stroke();
                ctx.closePath();
              } 
        }
    },
    mounted(){
       this.drawWeather(); 
    }
}
</script>
