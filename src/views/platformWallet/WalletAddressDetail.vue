<template>
  <div>
    <section>
       <h3>充币地址详情</h3>
       <el-row class="detail-row" style="width:1480px;">
        <el-col :span="2" class="detail-label">UID</el-col>
        <el-col :span="10" class="detail-value">{{walletAddress.uid}}</el-col>
        <el-col :span="2" class="detail-label">币种</el-col>
        <el-col :span="10" class="detail-value">{{walletTypeFormatter()}}</el-col>
      </el-row>
      <el-row class="detail-row">
        <el-col :span="2" class="detail-label">充币地址</el-col>
        <el-col :span="10" class="detail-value">{{walletAddress.walletAddress}}</el-col>
        <el-col :span="2" class="detail-label">生成时间</el-col>
        <el-col :span="10" class="detail-value">{{timeFormatter(walletAddress.addtime)}}</el-col>
      </el-row>
      <el-row class="detail-row">
        <el-col :span="2" class="detail-label">绑定时间</el-col>
        <el-col :span="10" class="detail-value">{{timeFormatter(walletAddress.bindTime)}}</el-col>
        <el-col :span="2" class="detail-label">启用状态</el-col>
        <el-col :span="10" class="detail-value">
          <template>
            <el-radio v-model="walletAddress.status" label='0' @change="statusChange">启用</el-radio>
            <el-radio v-model="walletAddress.status" label='1' @change="statusChange">未启用</el-radio>
          </template>
        </el-col>
      </el-row>
      <el-row class="detail-row" style="background:#fff;text-align:right">
        <el-col :span="24" class="detail-btn">
           <el-button type="primary" @click="handleSave" :disabled="roleId==3">保存</el-button>
        </el-col>
      </el-row>
    </section> 

   <section>
     <h3>历史充值记录</h3>
     <el-row class="detail-row detail-table">
      <el-col :span="24">
        <template style=" width:1480px;">
          <el-table :data="walletTransInList"  border style="width: 100%">
            <el-table-column prop="uid" label="UID" width="" align="center">
            </el-table-column>
            <el-table-column prop="successMoney" label="充币数量" width="" align="right" :formatter="namberFormatter">
            </el-table-column>
            <el-table-column prop="transTime" label="充币时间" width="" align="center" :formatter="tableTimeFormatter">
            </el-table-column>
          </el-table>
        </template>
      </el-col>
      <el-col :span="24" class="detail-btn " style="margin:10px 0;">
         <el-button type="" @click="handleBack">返回</el-button>
      </el-col>
     </el-row>
     
   </section> 
  </div>
</template>
<script>
  import { requestApi } from '../../api/axios.js';
  import util from '../../util.js';
  export default{
    data:function(){
      return{
        roleId:null,
        status:'',
        walletAddress:{
          uid:'',
          walletType:'',
          walletAddress:'',
          addtime:'',
          bindtime:'',
          status:''
        },
        walletTransInList:[],
         //币种 钱包类型 选择器数据
        walletTypes:[
          /*{
            walletType:null,
            walletShortEn:'全部'
          },
          {
            walletType:1,
            walletShortEn:'BTC'
          },
          {
            walletType:2,
            walletShortEn:'ETH'
          },
          {
            walletType:3,
            walletShortEn:'USDT'
          } */
        ],
        //启用状态  选择器数据
        statuss:[
          {
            value:null,
            label:'全部'
          },
          {
            value:0,
            label:'已启用'//使用
          },
          {
            value:1,
            label:'未启用'//锁定
          }
        ],
      }
    },
    methods: {
      walletTypeFormatter(){
        for(let item of this.walletTypes){
          if(item.walletType == this.walletAddress.walletType){
            return item.walletShortEn;
          }
        }
      },
      namberFormatter(row, column, cellValue, index){
        return cellValue.toFixed(8);
      },
      timeFormatter(ct){
        if(ct == 0){return '--';}
        let cellTime =new Date(parseInt(ct) * 1000);
        return util.formatDate.format(cellTime);
        //return cellValue
      },
      tableTimeFormatter(row, column, cellValue, index){
        if(cellValue == 0){return '--';}
        let cellTime =new Date(parseInt(cellValue) * 1000);
        return util.formatDate.format(cellTime);
        //return cellValue
      },
      statusChange(v){
        console.log(v);
        this.status = v;
      },
      handleSave(){
        var _this = this;
        this.$confirm('是否确认保存?', '保存确认', {
          //center: true
          //type: 'warning'
        }).then(() => {
          _this.save();
        }).catch(() => {
        });
      },
      save(){
        let _id = this.$route.query.id;
        let status = parseInt(this.status);
        let saveParams = {api_method:'WalletAddressModify',id:_id,status:status};
        requestApi(saveParams).then((res) => {
        //console.log(res);
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
              message: '保存成功',
              type: 'success'
            });
          } 
        }).catch(() => { 
        });
      },
      //返回
      handleBack(){
        this.$router.go(-1);
      },
      getDetail(){
        let params = {api_method:'WalletAddressDetail',id:this.$route.query.id};
        requestApi(params).then((res) => {
          //console.log(res);
          let {msg,status,walletAddress,walletTransInList} = res;
            if(status !== '200'){
              this.$message({
                message: msg,
                type: 'error'
              });
              if(status == '211'){
                this.$router.push({ path: '/login'}); 
              }
            }else{
              this.walletAddress = walletAddress;
              this.walletAddress.status += '';
              this.status = this.walletAddress.status;
              this.walletTransInList = walletTransInList;
            }
            //console.log(res);
        }).catch(() => { 
        });
      },
      //设置系统钱包列表 热钱包
      setwalletTypeList(){ 
        let walletTypeList = sessionStorage.getItem('WalletTypeList');
        this.walletTypes = JSON.parse(walletTypeList);
        this.walletTypes.unshift({walletType:null,walletShortEn:'全部'});
      }
    },

    mounted(){

      this.roleId = sessionStorage.getItem('BITKER_ROLE_ID');

      this.getDetail();
      this.setwalletTypeList();
      
  }
  }
</script>

<style>
  .detail-row{
    min-width:680px;
    width:1480px;
    background: #f2f4f8;
    height: 60px;
    line-height: 60px;
    font-size: 14px;
    color: #677887;
    padding-left: 24px;
  }
  .detail-label{
    min-width:80px;
    text-align: left;
    font-weight: bold;
  }
  .detail-value{
    min-width:600px;
    text-align: left;
  }
  .detail-table{
    background: #fff;
    line-height: 20px;
    padding-left: 0; 
  }
  .detail-btn{
   text-align: right;
  }
  .el-table th{
    background:#e5e9f2;
    color: #000;   
  }

</style>