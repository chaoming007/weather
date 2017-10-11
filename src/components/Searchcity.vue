<template>
  <div>
       <!--选择城市 start-->
  <div class="address-model">
    <div class="nav">
      <a class="go" href="###" @click="hideCityBox"></a>
      <h2>选择城市</h2>
      <a class="edit" href="###" @click="editFun">{{editTxt}}</a>
    </div>
    <div class="city-list">
      <ul>
        <li @click="setCityData('dat',-1)">
           当前城市是： {{currentCity.cityname}}
        </li>
        <li v-for="(item,key) in showMsg.cityArr">
             <span class="locate" @click="setCityData(item,key)">{{item.cityname}}</span>
             <a class="close" href="###" v-show="delBtnState" @click="delCityFun(item.citynum)"></a>
        </li>

        <li>
          <a href="###" @click="addCityEvent">
            <span><i class="add"></i>添加城市</span>
          </a>
        </li>
      </ul>
      </div>
  </div>
  <!--选择城市 end-->

  </div>
</template>

<script>

export default {
    data(){
      return {
        posApiUrl:"https://api.iapple123.com/simpleweather/index.html", //定位API地址
        citySelected:"",
        delBtnState:false,   //删除按钮状态
        showMsg:{
            showTuff:false,  //城市设置弹层开关
            cShow:false,     //城市选择弹层开关
            cityName:"",     //设置的首页城市
            setCityData:"",
            cityArr:JSON.parse(window.localStorage.getItem("cityArr"))||[]     //渲染模板的城市数组
        },
        positionNum:"",
        currentCity:{cityname:""},
        editTxt:"编辑"
      }
    },
   methods:{
        fetch(x,y){                        //获取定位信息
            var xPos=x||37.042354;
            var yPos=y||119.482237;
            this.$http.jsonp(this.posApiUrl,{before:this.beforeFun(),params: {x:xPos,"y":yPos,"citycode":0}}).then((response)=>{
                  if(response.body.code<0){
                    this.currentCity.cityname="未能获取定位信息";
                    return;
                  }
                  this.currentCity.cityname=response.body.data.City+"-"+response.body.data.Province;
                  this.currentCity.citycode=response.body.data.CityCode;
                  this.showMsg.posCityCode=response.body.data.CityCode;
                  this.showMsg.posCityName=response.body.data.City;
            });
        },
        beforeFun(){
            this.currentCity.cityname="正在获取地理位置定位...";
        },
        getPosFun(){                 //获得经纬度
            var _this=this;
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    var mk = new BMap.Marker(r.point);
                    var currentLat = r.point.lat;
                    var currentLon = r.point.lng;
                    _this.fetch(currentLat,currentLon);
            }})
        },
        getCityShow(){                  //获得设置的城市
            Event.$on("showCityEvent",h=>{
                 //this.showMsg.cityName="北京";   //显示的城市名字
                 this.showMsg.cShow=h.cShow; //是否显示城市设置弹层
            });
        },
        hideCityBox(){                //返回首页隐藏城市搜索
            if(this.delBtnState==true){
               this.delBtnState=!this.delBtnState;
              this.editTxt="编辑";
            }
            Event.$emit("showPstate",this.showMsg);
        },
        setCityData(dat,key){                //设置首页的城市数据
            if(this.delBtnState==true){
               this.delBtnState=!this.delBtnState;
                this.editTxt="编辑";
            }
            if(dat){
               this.showMsg.setCityData=dat;
               this.showMsg.indexNum=key;
            }else{
              return;
            }
            window.localStorage.setItem("indexnum",String(this.showMsg.indexNum));
            Event.$emit("setCityEvent",this.showMsg);
        },
        addCityEvent(){            //显示添加城市弹层
            if(this.delBtnState==true){
               this.delBtnState=!this.delBtnState;
                this.editTxt="编辑";
            }
             this.showMsg.cShow=!this.showMsg.cShow;
             Event.$emit("showCityBox",this.showMsg);
        },
        editFun(){                   //编辑按钮事件
             this.delBtnState=!this.delBtnState;
             if(this.delBtnState){
                this.editTxt="完成";
             }else{
                this.editTxt="编辑";
             }
        },
        delCityFun(obj){              //删除列表中的某一项
            var arr=this.showMsg.cityArr;
            for(var i=0,len=arr.length;i<len;i++){
                if(arr[i].citynum==obj){
                    arr.splice(i,1);
                    break;
                }
            }
           window.localStorage.setItem("cityArr",JSON.stringify(arr));
        }
   },
   mounted(){
        this.getPosFun();
        Event.$on("closeCityEvent",h=>{       //关闭城市选择弹层
             this.showMsg.cShow=h.cShow;
        });
        Event.$on("showCityEvent",h=>{
             this.showMsg.cityArr.push({citynum:h.citynum,cityname:h.cityname,state:h.state}); //添加渲染城市进入列表
             this.showMsg.cShow=h.cShow;      //是否显示城市设置弹层
             window.localStorage.setItem("cityArr",JSON.stringify(this.showMsg.cityArr));
             var json=window.localStorage.getItem("cityArr");
             this.showMsg.cityArr=JSON.parse(json);
             this.getPosFun();                //获取当前城市

        });
   }


}
</script>
