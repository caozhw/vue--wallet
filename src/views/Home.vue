<template >
  <div style="height:100%">
    <!-- 头部导航 -->
    <header class="header">
    <el-row>
     <el-col :span="2">
       <img class="logo" src="../assets/100.png" style="min-width:140px;">  
     </el-col>
     <el-col :span="12">
      <el-menu default-active=""  class="el-menu-demo" mode="horizontal" @select="" style="background-color: rgba(0,0,0,0);color:#fff;">
        <template v-for="(item,index) in $router.options.routes">
          <el-menu-item :index="index+''"  :class="{'is-active': item.name == $route.matched[0].name}" @click="handleClickFirstMemu" >{{item.name}}</el-menu-item> 
        </template>
      </el-menu>
     </el-col>
     <el-col :span="6" :offset="3" class="user-info">
       <span>欢迎 {{sysUserName}} 使用互信交易平台后台系统！</span>
       <i></i>
       <span class="logout" @click="handleLogoff">注销</span>
     </el-col>
    </el-row>
    </header>
    <div style="height: 48px;width: 100%;">
      <div class="tab-nav">
        <span class="nav-btn" :class="{'active':!isAsideShow}" @click="asideHide">&lt; 收起</span>
        <i></i>
        <span class="nav-btn" :class="{'active':isAsideShow}"  @click="asideShow">展开 &gt;</span>
      </div>
      <el-breadcrumb separator=">" class="breadcrumb-inner" style=" position: absolute;left: 230px;line-height: 4;min-width: 240px；float：left;min-width: 340px;">
        <span style="float:left;margin-right:12px;display:inline-block">当前位置：</span>
        <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <main>
      <!-- 左侧导航 -->

     <div class="main-left" :style="{left: !isAsideShow?'-200px':'0'}">
      <el-menu default-active="" class="el-menu-vertical-demo" :router="true">

        <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
          <template :index="index+''" v-if="index == firstMenuIndex"> 
            <el-menu-item v-for="(child,i) in item.children"  :index="child.path" :key="child.path" v-if="child&&!child.hidden" :class="{'is-active': isFirstClick && i == 0 || $route.matched[1] && $route.matched[1].name ==child.name}"  @click="handleClickSecondMemu">{{child.name}}</el-menu-item>  
          </template>
        </template>
      </el-menu>
     </div>
      <!-- 右侧主内容区 -->
      <div class="main-right"  :style="{marginLeft: !isAsideShow?'-200px':'0'}"> 
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </main>
  </div>
 </template>
 <script>
 import { requestApi } from '../api/axios.js';
 import Util from '../util.js';
 export default {
  data: function (){
    return {
     active:true,
     sysUserName:'',
     firstMenuIndex:0,
     isFirstClick:false,
     firstClick:0,
     childPath:'/',
     isAsideShow:true
    }
  },
  created:function(){
    //设置显示第一个menu
    for(let index in this.$router.options.routes){
      if(this.$router.options.routes[index].name == this.$route.matched[0].name){
       this.firstMenuIndex = index;
      }
    }
  },
  mounted() {
    let user = sessionStorage.getItem('BITKER_WALLET_USER');
    //console.log(user);
    if (user) {
      user = JSON.parse(user);
      this.sysUserName = user.username || '';
      //this.sysUserAvatar = user.avatar || '';
    }

    this.getWalletAddressListByPlat();
    this.getWalletTypeList();
  },
  methods: {
    //一级菜单点击事件
    handleClickFirstMemu(el){
      //console.log(this.$route)
      //console.log(this.$router.options.routes)
      this.isFirstClick = true;
      this.firstClick = 0;
      //console.log(this.isFirstClick)
      this.firstMenuIndex = el.$options.propsData.index;
      //获取当前被点击的路由对象
      let thisFirstMenuObject =  this.$router.options.routes[this.firstMenuIndex];
      // 默认显示第一个子路由
      let firstChildrenPath = thisFirstMenuObject.children[0].path; 
      this.childPath = firstChildrenPath;
      this.$router.push({ path: firstChildrenPath });

    },
    //二级菜单点击事件
    handleClickSecondMemu(el){
      this.isFirstClick = false;
      this.firstClick = 1;
      //console.log(this.isFirstClick) 
      //console.log(el.index)
    },
    asideHide(){
      this.isAsideShow = false;
    },
    asideShow(){
      this.isAsideShow = true;
    },
    //注销
    handleLogoff(){
      var _this = this;
        this.$confirm('确认退出吗?', '提示', {
          //type: 'warning'
        }).then(() => {
          sessionStorage.removeItem('BITKER_WALLET_USER');
          _this.$router.push('/login');
        }).catch(() => {

      });
    },
    //系统钱包列表数据
    getWalletAddressListByPlat(){
      let params = {api_method:'WalletAddressListByPlat',page_size:200};
      requestApi(params).then((res) => {
        let {data,total,msg,status} = res;
        if(status !== '200'){
          this.$message({
            message: msg,
            type: 'error'
          });
        }else{
          let walletAddressListByPlat_string = JSON.stringify(data);
          sessionStorage.setItem('WalletAddressListByPlat',walletAddressListByPlat_string);
         //console.log('WalletAddressListByPlat',res);
        }
       
      }).catch(() => {
      });
    },
    getWalletTypeList(){
      let params = {api_method:'WalletTypeList',page_size:200};
      requestApi(params).then((res) => {
        let {data,total,msg,status} = res;
        if(status !== '200'){
          this.$message({
            message: msg,
            type: 'error'
          });
        }else{
          let walletTypeList_string = JSON.stringify(data);
          sessionStorage.setItem('WalletTypeList',walletTypeList_string);
        }
        
      }).catch(() => {
      });
    }
  }
 }
 </script>
<style>
body{margin: 0;}
 /* #app {
  min-width: 1200px;
  margin: 0 auto;
  font-family: "Helvetica Neue","PingFang SC",Arial,sans-serif;
 } */
 /* 头部导航 */
 header{z-index: 1000;min-width: 1200px;transition: all 0.5s ease; background: linear-gradient(to right, #0b2879, #4595d9);; box-shadow: 0 2px 4px 0 rgba(0,0,0,.12),0 0 6px 0 rgba(0,0,0,.04); color: #b2ceed;}
 header.header-fixed{position: fixed;top: 0;left: 0;right: 0;}
 header .el-menu-demo{padding-left: 300px!important;}
 header .logo{   
    min-width: 140px;
    position: relative;
    left: 34px;
    top: 12px;
  }
  header .user-info{
    line-height: 60px;
    min-width: 332px;
    text-align: right;
  }
  header .user-info i {
    display: inline-block;

    background-color: #a2caec;
    width: 1px;
    height: 20px;
    position: relative;
    top: 4px;
    margin: 0 10px 0 6px;
  }
  header .logout{
    cursor: pointer;
  }
  header .logout:hover{
    color: #000;
  }
  .tab-nav{
    min-width:200px;
    float:left;
    height: 36px;
    text-align: center;
    line-height: 1;
    border: 1px solid #e5e9f2;
    margin: 4px 12px 0 0;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
  }
  .tab-nav .nav-btn{
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    text-align: center;
    line-height: 36px;
    color: #677887;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
  }
  .tab-nav i {
    width: 1px;
    height: 16px;
    background-color: #e5e9f2;
  }
  .tab-nav .active {
    color: #20a0ff;
  }
 /* 主内容区 */
  main{ display: -webkit-box; display: -ms-flexbox; display: flex; min-height: 800px;  background-color: #FCFCFC; height:88%;}
  main .main-left{text-align: center;min-width: 200px;float: left;border-right:1px solid #e5e9f2;border-top: 1px solid #e5e9f2;position: relative;transition:left 1s;}
  main .main-right{-webkit-box-flex: 1; -ms-flex: 1; flex: 1; background-color: #fff; padding: 0px 5px 5px 20px; transition:margin-left 1s;}
  main .el-menu{background-color: transparent!important;}

  .el-menu{background-color: rgba(0,0,0,0);color:#fff;border-right: none;}
  .el-menu-item, .el-submenu__title {color:#a7bcda;}
  .el-menu-item:hover{
    color: #20a0ff;
  }
  .el-menu--horizontal {
    border-bottom:none;
  }
header .el-menu-demo {
    padding-left: 120px!important; 
}
.el-menu--horizontal > .el-menu-item.is-active {
    border-bottom: 2px solid #409EFF;
    color: #409EFF;
    background-color: #fff;
}
/* .el-menu--horizontal > .el-menu-item:hover, .el-menu--horizontal > .el-submenu.is-active .el-submenu__title, .el-menu--horizontal > .el-submenu:hover .el-submenu__title {
    border-bottom: 0;
} */
</style>