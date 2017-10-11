/*
* @Author: chenchaoming
* @Date:   2017-06-16 09:43:39
* @Last Modified by:   chenchaoming
* @Last Modified time: 2017-06-16 15:57:32
*/
'use strict';
(function(){
	var canvas=document.querySelector("#canObj");
	var ctx=canvas.getContext("2d");
	var dataArr=canvas.getAttribute("data-temp").split("|");
	var minNum=-30;
	var maxNum=100;
	var scale=maxNum/(Math.abs(minNum)+Math.abs(maxNum));
	var canW=canvas.width;
	var canH=canvas.height;
	drawLineFun();
	function drawLineFun(){
		ctx.strokeStyle="rgba(255,255,255,1)";
		ctx.lineWidth=3;
		ctx.beginPath();
		ctx.lineCap="round";
	    ctx.lineJoin="round";
		dataArr.forEach(function(val,key){
		    var dnumX=Math.ceil(canW/(dataArr.length-1)*key);
		    var dnumY=(maxNum-parseInt(val.split(":")[1]))*(canH*scale)/maxNum;
		    var txtMax=val.split(":")[1]+"℃";
		    var txtMin=val.split(":")[0]+"℃";
		    if(key==0){
		    	ctx.moveTo(dnumX,dnumY);
		    }
		    ctx.lineTo(dnumX,dnumY);
		    var txtW=ctx.measureText(txtMax).width;
		    if(key==0){
		    	dnumX=dnumX+15;
		    }else if(key==dataArr.length-1){
		    	dnumX=dnumX-(txtW+15);
		    }else{
		    	dnumX=dnumX-txtW/2;
		    }
		    ctx.font="30px Verdana";
		    ctx.fillStyle="rgba(255,255,255,1)";
		    ctx.fillText(txtMin,dnumX,dnumY+60);
		    ctx.fillText(txtMax,dnumX,dnumY-40);
		})
		ctx.stroke();
		ctx.closePath();
	}	
})()


