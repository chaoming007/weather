<template>
  <div>


  <!--定位层 start-->
  <div class="address-model tc-zindex">
      <div class="nav">
        <a class="go" href="###" @click="closeCityBox"></a>
        <h2>选择城市</h2>
        <!-- <a class="edit" href="###">编辑</a> -->
      </div>

      <div class="search">
              <div class="input-box">
                <input type="text" v-model.trim="keyWords" @keyup="searchCity"  placeholder="请输入城市名（中文或拼音）" />
              </div>
              <a href="###" @click="searchCity">搜索</a>
      </div>
      <div class="search-list" v-show="searchListShow">
                <ul>
                  <li v-for="(item,key) in searchResult" >
                    <a href="###" @click="dqSelectFun(item)" :class="{'selected':item.state==1?true:false}">
                      {{item.cityname}}-{{item.cityparent}}
                    </a>
                  </li>

                </ul>
      </div>


      <!-- 热点城市 start  -->
      <div class="hot-city" v-show="hotCityShow">

            <h6>热门城市</h6>
            <div class="address-list">
                  <ul>

                    <li v-for="(item,key) in cityObjList">
                      <a href="###"  @click="dqSelectFun(item,key)" :class="{'no':item.state==1?true:false}" >
                          {{item.cityname}}
                      </a>
                    </li>


                  </ul>
            </div>
          <!--  <h6>热门景点</h6>
            <div class="address-list">
                <ul>

                  <li v-for="(item,key) in scenObjList">
                      <a href="###" @click="dqSelectFun(item)" :class="{'no':item.state==1?true:false}">
                         {{item.cityname}}
                      </a>
                  </li>

                </ul>
            </div> -->


      </div>
      <!-- 热点城市 end  -->
  </div>
  <!--定位层 end-->


  </div>
</template>

<script>

export default {
  data () {
    return {
    	apiUrl:"https://api.iapple123.com/weather/hotcity/index.html",//热门城市接口
      searchApiUrl:"https://api.iapple123.com/weather/cityinfo/index.html",//搜索城市接口
      cityObj:"",          //城市
      scenObj:"",          //景区
      datObj:"",           //城市数据
      keyWords:"",         //搜索关键字
      citySelected:"北京",   //选中的城市
      showMsg:{
          citynum:0,       //城市编号
          cityname:"北京",  //城市名称
          cShow:false,
          cityArr:[]
      },
      cityObjList:[],       //渲染模板城市列表
      scenObjList:[],       //渲染景点列表
      searchListShow:false,  //搜索列表展示控制
      hotCityShow:true,       //热门城市展示控制
      searchResult:[],        //搜索结果列表
      searchAjax:""
    }
  },

  methods:{
      searchCity(){         //搜索事件         
          if(this.keyWords==""){
            this.searchListShow=false;
            this.hotCityShow=true;
            return;
          }
          this.searchListShow=true;
          this.hotCityShow=false;
          this.fetchGetCity(this.keyWords);
          
      },
      fetch(){              //获取热门城市的数据
          this.$http.jsonp(this.apiUrl).then((response)=>{
              this.datObj=response.body;
              this.cityObj=response.body.data.internal;     //热门城市
              this.scenObj=response.body.data.attractions;  //热门景点
              this.cityObjList=this.getCityList(this.cityObj);
              this.scenObjList=this.getCityList(this.scenObj);
          });
      },
      fetchGetCity(key){     //获取搜索城市数据
           var json=window.localStorage.getItem("cityArr");
           var arr=JSON.parse(json)||[];
           this.searchResult=[];
           this.$http.jsonp(this.searchApiUrl,{params: {"cityname":key}}).then((response)=>{
                  var cityData=response.body.data;
                  if(response.body.code<1) return;   //没有数据
                  cityData.forEach((val,ind)=>{
                       var cityJson={};
                       cityJson.state=0;
                       arr.forEach((item,key)=>{
                            if(item.cityname==val.CityName){
                               cityJson.state=1;
                            }
                       })
                      if(val.CityName==this.showMsg.posCityName){
                           cityJson.state=1;
                      }
                      cityJson.citycode=val.CityCode;
                      cityJson.cityname=val.CityName;
                      cityJson.cityparent=val.ProvincesCN||"";
                      if(this.searchResult.length<10){
                         this.searchResult.push(cityJson);
                      }
                  });
                 
           });
      },
      getPlaceShow(){       //获取首页发过来的数据
          Event.$on("showPlaceEvent",h=>{
               this.citySelected=h.place;   //获取城市名字
          });
      },
      dqSelectFun(obj,key){           //向搜索页发送数据并关闭弹层
      	  var _this=this;
          if(obj.state==1){
            return;
          }
          this.showMsg.cityname=obj.cityname;    //选择的城市名字
          this.showMsg.citynum=obj.citycode;     //选择的城市编号
          this.showMsg.state=1;                  //城市选中状态
          _this.showMsg.cShow=!_this.showMsg.cShow; //选择城市弹层展示开关
        
          
         
       
          Event.$emit("showCityEvent",this.showMsg);
          Event.$emit("showPstate",this.showMsg);
          this.showMsg.setTuff=true;
          Event.$emit("setCityEvent",this.showMsg);
          
      },
      closeCityBox(){           //关闭城市选择弹层
          this.showMsg.cShow=!this.showMsg.cShow;
          Event.$emit("closeCityEvent",this.showMsg);
      },
      getCityList(obj){                     //生成城市列表渲染模板
          var cityList=[];
          obj.forEach((val,key)=>{
                 cityList[key]={};
                 cityList[key].state=0;
                 this.showMsg.cityArr.forEach((item,ind)=>{
                      if(val.citycode==item.citynum){
                          cityList[key].state=1;
                      }
                 });
                 if(val.citycode==this.showMsg.posCityCode){
                     cityList[key].state=1;
                 }
                 cityList[key].citycode=val.citycode;
                 cityList[key].cityname=val.cityname;
          })
          return cityList;
      }
  },
  mounted(){
  	  this.fetch(),                     //获得热门城市
      this.getPlaceShow(),
      Event.$on("showCityBox",h=>{       //接收数据打开城市设置弹层
           this.showMsg.posCityCode=h.posCityCode; //当前定位城市code
           this.showMsg.posCityName=h.posCityName; //当前定位的城市名字
           this.showMsg.cityArr=h.cityArr;    //已选择的城市列表
           this.showMsg.cShow=h.cShow;
           this.cityObjList=this.getCityList(this.cityObj); //从新生成城市列表
           this.scenObjList=this.getCityList(this.scenObj); //从新生成景点列表
           this.keyWords="";                //还原搜索框
           this.searchCity();
      });
  }
}
</script>

<style lang="scss">


</style>
