<template>
  <section style="height:100%">
    <el-container class='e-ct'>
      <el-aside class="e-aside" style="width:210px">
        <div v-for = "item in nodeData">
          <span>{{walletTypeFormatter(item.walletType)}}</span>
          <em>{{item.localHeight}}</em>
        </div>
       
      </el-aside>
      <el-container style="margin-top: 0px;" id="WalletMonitor">
        <el-header class="e-header" style="height: 120px;box-shadow: 0 0px 0px 0 rgba(0,0,0,1), 0 0 0px 0 rgba(0,0,0,1);">
          <div class="h-color" :style="{background: statusNum>0?'#f50a0a':'#449d44'}">
            <div :class="statusNum>0?'el-icon-close':'el-icon-check'"></div>
            <div class='hright'>
              <strong>{{statusNum}}</strong>
              <span>{{statusNum>0?'有异常':'无异常'}}</span>
            </div>
          </div>
          <div class="h-color" style="background-color: #3a8ee6;">
            <div class="el-icon-refresh" @click="freashClick"></div>
            <div class='hright'>
              <strong>{{refreshTime}}</strong>
              <span>秒前刷新</span>
            </div>
          </div>
          <div class="h-radio">
            <h4>报警设置</h4>
              <el-radio-group v-model="notification_frequency" @change="frequencQuery()">
                <el-radio :label="1" >报警15分钟报警</el-radio>
                <el-radio :label="2" >每30分钟报警</el-radio>
                <el-radio :label="3" >每1小时报警</el-radio>
              </el-radio-group>
            
          </div>
        </el-header>
        <div class="e-main" >
          
          <div class="etable" v-for="item in MonitorData">
            <el-row class="theader" >
              <el-col :span="2">{{walletTypeFormatter(item.walletType)}}</el-col>
              <el-col :span="22">在线块高：{{namberFormatter(item.netHeight)}}</el-col>
            </el-row>
            <el-row class="ttitle">
              <el-col :span="1">Node</el-col>
              <el-col :span="3">IP</el-col>
              <el-col :span="2">本服节点高度</el-col>
              <el-col :span="3">本服节点时间</el-col>
              <el-col :span="2">钱包处理高度</el-col>
              <el-col :span="1">节点数</el-col>
              <el-col :span="2">区块总金额</el-col>
              <el-col :span="2">钱包总金额</el-col>
              <el-col :span="2">充币待处理统计数</el-col>
              <el-col :span="2">提币待处理统计数</el-col>
              <el-col :span="1">unspents</el-col>
              <el-col :span="3">更新时间</el-col> 
            </el-row>
             <el-row class="ttbody" :style="{color: item.status==2?'#f50a0a':'#000'}">
              <el-col :span="1">MAIN</el-col>
              <el-col :span="3">{{item.ip?item.ip:'--'}}</el-col>
              <el-col :span="2">{{namberFormatter(item.localHeight)}}</el-col>
              <el-col :span="3">{{timeFormatter(item.localTime)}}</el-col>
              <el-col :span="2">{{namberFormatter(item.walletHeight)}}</el-col>
              <el-col :span="1">{{namberFormatter(item.peers)}}</el-col>
              <el-col :span="2">{{namberFormatter(item.balance)}}</el-col>
              <el-col :span="2">{{namberFormatter(item.walletBalance)}}</el-col>
              <el-col :span="2">{{namberFormatter(item.inCount)}}</el-col>
              <el-col :span="2">{{namberFormatter(item.outCount)}}</el-col> 
              <el-col :span="1">{{item.unspents?item.unspents:'--'}}</el-col>
              <el-col :span="3">{{timeFormatter(item.updatetime)}}</el-col> 
            </el-row>
          </div>




        </div>
      </el-container>
   </el-container>
   
  </section>
</template>
<script>
  import { requestApi} from '../../api/axios.js';
  import util from '../../util.js';
  export default{
    data:function(){
      return{
        refreshTime: 1,
        statusNum:0,


        notification_frequency: 1,
        nodeTotal:0,
        MonitorTotal:0,
        
        //币种 钱包类型 选择器数据
        walletTypes:[],

        //列表
        MonitorData:[],
        nodeData:[],

      }
    },
    mounted(){
      this.setwalletTypeList();

      this.monitorListQuery();
      this.nodeQuery(); 

      this.setRefresh();
    },
    methods: {
      walletTypeFormatter(cellValue){
        for(let item of this.walletTypes){
          if(item.walletType == cellValue){
            return item.walletShortEn;
          }
        }
      },
      namberFormatter(cellValue){
        if(isNaN(cellValue)){return '--';}
        else{return cellValue} 
      },
      timeFormatter(cellValue){
        if(cellValue == 0){return '--';}
        let cellTime =new Date(parseInt(cellValue) * 1000);
        return util.formatDate.format(cellTime);
        //return cellValue
      },
     /*设置报警频率*/
      frequencQuery(){
        let params = {
          api_method:'WalletSetNotificationFrequency',
          notification_frequency:this.notification_frequency
        }
        requestApi(params).then((res) => {
          let {msg,status} = res;
          if(status !== '200'){
            this.$message({
              message: msg,
              type: 'error'
            });
            if(status == '211'){
              this.$router.push({ path: '/login'}); 
            }
          }else{
            this.$message({
              message: msg,
              type: 'success'
            });
          }
          //console.log(res);
        }).catch(() => {
        });
      },
      monitorListQuery(){
        let params = {
          api_method:'WalletMonitorList'
        }
        requestApi(params).then((res) => {

          let {data,total,msg,status} = res;
          if(status !== '200'){
            this.$message({
              message: msg,
              type: 'error'
            });
            if(status == '211'){
              this.$router.push({ path: '/login'}); 
            }
          }else{

            this.MonitorData = data;
            this.MonitorTotal = total;
            this.computeStatusNum(data);

          }
          //console.log(res);
        }).catch(() => {
        });
      },
      nodeQuery(){
        let params = {
          api_method:'WalletNodeMonitorList'
        }
        requestApi(params).then((res) => {
          let {data,total,msg,status} = res;
          if(status !== '200'){
            this.$message({
              message: msg,
              type: 'error'
            });
            if(status == '211'){
              this.$router.push({ path: '/login'}); 
            }
          }else{
            this.nodeData = data;
            this.nodeTotal = total;
          }
          //console.log(res);
        }).catch(() => {
        });
      },
      computeStatusNum(data){
        let _this = this;
        for(let item of data){
          if(item.status == '2'){ 
            _this.statusNum ++ ;
          }
        }
      },
      freashClick(){
        
        this.monitorListQuery(); 
        this.nodeQuery();   
        this.refreshTime = 1;
        this.statusNum = 0;
      },
      setRefresh(){
        let _this = this;
        let Time = setInterval(function(){
          _this.refreshTime++;
          if(_this.refreshTime>=60){    
            _this.monitorListQuery(); 
            _this.nodeQuery();   
            _this.refreshTime = 1;
            _this.statusNum = 0;

            //clearInterval(Time);
          }
        },1000)
      },
      //设置系统钱包列表 热钱包
      setwalletTypeList(){ 
        let walletTypeList = sessionStorage.getItem('WalletTypeList');
        this.walletTypes = JSON.parse(walletTypeList);
        this.walletTypes.unshift({walletType:null,walletShortEn:'全部'});
      }  
    }
  }
</script>

<style>
.e-ct{
  margin: 4px;
  height:100%;
}
.e-aside{
  border:1px solid #e5e9f2;
  margin-right: 10px;
  padding:12px;
  padding-top: 2px;
}
.e-aside div{
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  font-weight: 400;
  margin-top: 10px;
}
.e-aside div:nth-child(odd){
  background: #3a8ee6;
  color:#fff;
}
.e-aside div:nth-child(even){
  background: rgba(242, 242, 242, 1);
  color:#000;
}
.e-aside div span{
  display: inline-block;
  width: 80px;
  text-align: center;
}
.e-aside div em{
  font-style: normal;
}

.e-header{
  height: 80px;
  background: #fff;
}

.h-color{
  float: left;
  width: 240px;
  height: 100px;
  line-height: 100px;
  margin-right: 20px;
  color: #fff;
  font-weight: 600;
  font-size: 16px;

 /*  background-color: #449d44; */
 /*  background-color: #f50a0a; */
}
.h-color .hright{
  float: right;
  width: 100px;
  height: 100px;
  padding-right: 24px;
  font-size: 18px;
}
.h-color .hright strong,.h-color .hright span{
  display: inline-block;
  width: 100px;
  height: 46px;
  line-height: 46px;
  float:left;
  text-align: right;
}

.h-radio{
  float: left;
  width:400px;
  height: 76px;
  padding:12px 24px;
  border:1px solid #e5e9f2;
    
}
.h-radio h4{
  color:#000;
  margin-top:0;
  margin-bottom: 34px;
}

.e-main{
  height: 100%;
  margin-left: 20px;
  min-height: initial;
}

.e-main .etable{

  margin-bottom: 20px;
}
.e-main .etable .theader{
  min-width: 1360px;
  height: 60px;
  line-height: 60px;
  border: 1px solid #e5e9f2;
  font-size: 16px;
  font-weight: 600;

}
.e-main .etable .theader div{
  padding-left: 8px;

}
.ttitle,.ttbody{
  min-width: 1360px;
  height: 48px;
  line-height: 48px;
  font-size: 14px;
  border: 1px solid #e5e9f2;
  border-top: 0;
  text-align: center;
}
.ttitle div,.ttbody div{
  border-left: 1px solid #e5e9f2;
}
.ttitle div:nth-of-type(1),.ttbody div:nth-of-type(1){
  border-left: 0;
}
.ttitle{
  font-weight: 600;
}


#WalletMonitor .el-icon-check:before ,#WalletMonitor .el-icon-close:before ,#WalletMonitor .el-icon-refresh:before{
  font-size: 50px;
  font-weight: 600;
  color: #51555f;
  background-color: #fff;
  padding:8px;
  border-radius: 34px;
  border:1px solid #51555f;
  line-height: 2;
  margin-left: 24px;
}


</style>