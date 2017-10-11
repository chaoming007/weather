import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'



import Selectcity from './components/Selectcity.vue'   //选择城市
import Weather from './components/Weather.vue'  //天气
import Searchcity from './components/Searchcity.vue'  //搜索城市

Vue.use(VueResource);
Event=new Vue();

Vue.filter("kq",function(val,pos){
    var num;
    var str=val||"";
    if(pos=="front"){
       num=str.split(" ")[0];
    }
    if(pos=="later"){
       num=str.split(" ")[1];
    }
    return num;
})

new Vue({
  el: '#app',
  data:{
  	 pShow:false,		//搜索城市控制
  	 cShow:false,      //选择城市控制
  	 place:"北京",      //地点默认北京
  	 sendObj:{},       //发送的数据
     ajaxUrl:"https://api.iapple123.com/simpleweather/index.html",   //数据接口
     posApiUrl:"https://api.iapple123.com/location/index.html", //定位API地址
     cityData:{}, //请求返回数据
     dataArr:[{"dataname":""},{"dataname":""},{"dataname":""},{"dataname":""},{"dataname":""}],  //预报数组
     nowArr:{},    //今天数据
     liveArr:[{"src":""},{"src":""},{"src":""},{"src":""},{"src":""},{"src":""},{"src":""}],    //生活指数数组
     weatherImgArr:[],
     currentCity:"正在定位...",
     currentCityCode:"",     //定位城市的code
     tsTxt:"未能获取定位信息",
     // classTuff:false,
     // classSuff:true,
     //hotCurrent:false,  //高温
     weatherArr:[
        {
          "name":"雷阵雨",
          "img":"overcast.png"
        },
        {
          "name":"暴雨",
          "img":"ras.png"
        },
        {
          "name":"大雨",
          "img":"br.png"
        },
        {
          "name":"中雨",
          "img":"mr.png"
        },
        {
          "name":"阵雨",
          "img":"hs.png"
        },
        {
          "name":"小雨",
          "img":"sr.png"
        },

        {
          "name":"阴",
          "img":"hr.png"
        },
        {
          "name":"多云",
          "img":"cloudy.png"
        },
        {
          "name":"晴",
          "img":"sunny.png"
        },
        {
          "name":"台风",
          "img":"typhoon.png"
        },
        {
          "name":"暴雪",
          "img":"thundershower.png"
        },
        {
          "name":"大雪",
          "img":"bs.png"
        },
        {
          "name":"小雪",
          "img":"ss.png"
        },
        {
          "name":"中雪",
          "img":"ms.png"
        },
         {
          "name":"沙尘暴",
          "img":"sand.png"
        },
        {
          "name":"雨夹雪",
          "img":"rs.png"
        },
        {
          "name":"霾",
          "img":"haze.png"
        },
        {
          "name":"冰雹",
          "img":"hail.png"
        },
        {
          "name":"雾",
          "img":"fog.png"
        }
     ],
     liveImg:[
           {
             title:"洗车指数",
             src:"life_carwashing.png"
           },
           {
             title:"穿衣指数",
             src:"life_dressing.png"
           },
           {
             title:"感冒指数",
             src:"life_flu.png"
           },
           {
             title:"运动指数",
             src:"life_sport.png"
           },
            {
             title:"旅游指数",
             src:"life_travel.png"
           },
           {
             title:"紫外线指数",
             src:"life_uv.png"
           },
            {
             title:"车辆限行",
             src:"life_xianxing.png"
           }
     ],
     temp:{num:""},   //温度数据
     canvasData:[],   //canvas数据
     cityArr:[],      //选择的城市数组
     mainArr:[],
     codeArr:[],      //code数组
     mySwiperfocus:"",
     nowTime:Date()
  },
  methods:{
  	  showPlace(){
  	  	  this.pShow=!this.pShow;
  	  	  this.sendPlace();
  	  },
      getWeatherFun(){                     //天气小图标
          this.weatherImgArr=[];
          this.weatherArr.forEach((item,key)=>{
              this.dataArr.forEach((val,ind)=>{
                  if(val.climate==item.name){
                      var src="./src/assets/img/status/"+item.img;
                      this.weatherImgArr.push(src);
                  }
              })
          });
      },
  	  sendPlace(){                            //发送数据状态
  	  	  this.sendObj.pShow=this.pShow;      //是否显示城市搜索弹层
  	  	  this.sendObj.place=this.place;
  	  	  this.sendObj.cShow=this.cShow;     //是否显示城市设置弹层
  	  	  Event.$emit("showPlaceEvent",this.sendObj);
  	  },
      liveSetImg(obj){                         //设置天气指数图片
          var s="./src/assets/img/live/";
          obj.forEach((item,key)=>{
              this.liveImg.forEach((val,ind)=>{
                   if(item.title==val.title){
                       item.src=s+val.src;
                   }
              })
          });
          return obj;
      },
      fetch(code=101010100,res){                        
          this.$http.jsonp(this.ajaxUrl,{before:this.beforeFun(),params: {"citycode":code}}).then((response)=>{
              res(response);
          });
      },
      sendAjaxFun(response){
          var arr=[];
          response.forEach((item,key)=>{
                    var num=new Date(item.now.sysdate).getDay();
                    arr[key]={};
                    arr[key].tempNum="";
                    arr[key].currentCity=item.City;   //选择的城市
                    if(arr[key].currentCity==arr[0].currentCity){
                       arr[key].posTip=true;
                    }else{
                       arr[key].posTip=false;
                    }
                    arr[key].daily=item.Daily;
                    arr[key].nowArr=item.now;         //
                    arr[key].CityCode=item.CityCode;
                    arr[key].nowArr.s1=item.now.pm.split(" ")[0];
                    arr[key].nowArr.s2=item.now.pm.split(" ")[1];
                    arr[key].liveArr=this.liveSetImg(item.index);  //生活指数
                    arr[key].liveArr.forEach((val,ind)=>{
                         val.classTuff=false;
                         val.classSuff=true;
                         if(val.title=="车辆限行"){
                             val.classTuff=true;
                             val.classSuff=false;
                             if(num==6||num==0){
                                  val.text="无";
                                  val.title="无限行";
                              }
                         }
                    });
                    arr[key].tipTxt="";
                    arr[key].hotCurrent=false;

                    if(item.now.temp>=35){     //高温预警
                        arr[key].hotCurrent=true;
                        arr[key].tipTxt="高温";  
                    }

                    if(item.now.climate=="雷阵雨"){  //雷电预警
                        arr[key].hotCurrent=true;
                        arr[key].tipTxt="雷电"; 
                    }

                    if(item.now.climate=="暴雪"){  //暴雪预警
                        arr[key].hotCurrent=true;
                        arr[key].tipTxt="暴雪"; 
                    }

                    if(item.now.climate=="台风"){  //台风预警
                        arr[key].hotCurrent=true;
                        arr[key].tipTxt="台风"; 
                    }


                    for(let i=0;i<5;i++){
                       var n=item.Daily[i].templow+":"+item.Daily[i].tempheight+"|";
                       arr[key].tempNum+=n;
                    }
                    arr[key].weatherImgArr=[];                //天气图标
                    this.weatherArr.forEach((item1,key1)=>{
                        item.Daily.forEach((val1,ind1)=>{
                            if(val1.climate==item1.name){
                                var src="./src/assets/img/status/"+item1.img;
                                arr[key].weatherImgArr.push(src);
                            }
                        })
                    });
                    arr[key].cid="can_"+key;
                    this.canvasData[key]={};
                    this.canvasData[key].data=arr[key].tempNum;
                    this.canvasData[key].id=arr[key].cid;
          });
          this.mainArr=arr;

      },
      fetchPos(x,y){                        //获取定位信息
          var xPos=x||114.41586755;
          var yPos=y||43.46823822;
          this.$http.jsonp(this.ajaxUrl,{before:this.beforeFun(),params: {"x":xPos,"y":yPos,"citycode":0}}).then((response)=>{
               console.log(response.body.data);
                var code=response.body.data.CityCode;
                this.currentCityCode=response.body.data.CityCode;
                this.currentCity=response.body.data.City||this.tsTxt;
                if(this.currentCity==this.tsTxt){
                  return;
                }
                this.posGetFun(code);//101010100
          });
      },
      posGetFun(code){
          this.codeArr=[];
          this.codeArr.unshift({citynum:code});
          this.getStoreFun()
      },
      beforeFun(){
          this.currentCity="正在定位...";
      },
      getPosFun(){                 //获得经纬度
          var _this=this;
          var geolocation = new BMap.Geolocation();
          geolocation.getCurrentPosition(function (r) {
              if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                  var mk = new BMap.Marker(r.point);
                  var currentLat = r.point.lat;
                  var currentLon = r.point.lng;
                  _this.fetchPos(currentLat,currentLon)
          }})
      },
      promFun(code){        // promise 函数
          var p=new Promise((resolve, reject)=>{
                this.fetch(code,resolve);
          });
          return p;
      },
      promMainFun(arr){
           var arrFun=[];
           arr.forEach((item,key)=>{
                arrFun.push(this.promFun(item.citynum));
           });
           this.promAllFun(arrFun);
      },
      promAllFun(arr){
           Promise.all(arr).then(val=>{
               var cityDataJson=[];
               val.forEach((item,key)=>{
                    cityDataJson.push(item.body.data);
               });
               this.sendAjaxFun(cityDataJson);
           });
      },
      getStoreFun(){     //首页显示城市数据
            var cArr=JSON.parse(window.localStorage.getItem("cityArr"))||[];
            if(cArr){
                cArr.forEach((item,key)=>{
                    this.codeArr.push({citynum:item.citynum});
                })
            }
            this.promMainFun(this.codeArr);
      },
      swiperFun(index){
             var _this=this;
             this.mySwiperfocus = new Swiper('#m-focus-box', {
                autoHeight: true,
                pagination : '.pagination-num',
                watchActiveIndex:true,
                initialSlide:index||0,
                observer: true,
                observeParents: true,
                onSlideChangeEnd: function(swiper){
                    _this.timSetFun();
                }
            });
      },
      timSetFun(){
          var nowTim=new Date().getTime();
          var nextTim=new Date(this.nowTime).getTime();
          var timNum=(nowTim-nextTim)/1000/60/60;
          if(timNum>2){
               this.nowTime=Date();
               this.posGetFun(this.currentCityCode);
          }
      }
  },

  mounted(){
       var ind=Number(window.localStorage.getItem("indexnum"))||-1;
  	   Event.$on("showPstate",h=>{         //接收到数据,关闭城市搜索
  	   	   this.pShow=h.showTuff;
           this.posGetFun(h.citycode);
  	   });
  	   Event.$on("showCityBox",h=>{       //接收数据打开城市设置弹层
  	   	   this.cShow=h.cShow;
  	   });
  	   Event.$on("closeCityEvent",h=>{       //关闭城市选择弹层
  	   	   this.cShow=h.cShow;
  	   });
  	   Event.$on("showCityEvent",h=>{        //选择城市关闭城市选择弹层
           this.cShow=h.cShow; 
           this.posGetFun(h.posCityCode);
       });
       Event.$on("setCityEvent",h=>{       //接收设置城市事件
       	   var _this=this;        
           this.posGetFun(h.citycode);
           this.pShow=h.showTuff;
           if(h.setTuff){
           	   h.indexNum=this.codeArr.length+1;
           }
           window.setTimeout(
           	  function(){
           	  	_this.mySwiperfocus.slideTo(h.indexNum+1);
           	  },200
           )
           
       });
       this.getPosFun();   //定位
       this.swiperFun(ind+1);    //初始化swiper
  },

  components:{
  	Weather,
  	Searchcity,
  	Selectcity
  }
})
