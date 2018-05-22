<template>
  <div>
    <section>
        <h3>{{ADD?'新增钱包':'修改钱包'}}</h3>
        <el-row class="detail-row">
          <el-col :span="2" class="detail-label">币种</el-col>
          <el-col :span="10" class="detail-value">
            <span :style="{display: !ADD?'inline-block':'none'}"> {{walletTypeFormatter(detailData.walletType)}}</span>
            <el-select v-model="form.wallet_type" placeholder="请选择" :style="{display: ADD?'inline-block':'none'}" >
              <el-option
                v-for="item in walletTypes"
                :key="item.walletType"
                :label="item.walletShortEn"
                :value="item.walletType">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2" class="detail-label">账户类型</el-col>
          <el-col :span="10" class="detail-value">
            <span :style="{display: !ADD?'inline-block':'none'}">{{baseTypeFormatter(detailData.baseType)}}</span>
            <el-input v-model="form.walletShortEn" clearable :style="{display: ADD?'inline-block':'none'}" style="width:40%"></el-input>
          </el-col>
        </el-row>
         <el-row class="detail-row">
          <el-col :span="2" class="detail-label">地址</el-col>
          <el-col :span="10" class="detail-value">{{detailData.walletAddress?detailData.walletAddress:'--'}}</el-col>
          <el-col :span="2" class="detail-label">可用币数</el-col>
          <el-col :span="10" class="detail-value">{{detailData.userMoney?detailData.userMoney:'--'}}</el-col>
        </el-row>
        <el-row class="detail-row">
          <el-col :span="2" class="detail-label">启用状态</el-col>
          <el-col :span="10" class="detail-value">
            <template>
              <el-radio v-model="form.trans_locked" label='0' @change="transLockedChange">启用</el-radio>
              <el-radio v-model="form.trans_locked" label='1' @change="transLockedChange">停用</el-radio>
            </template>
          </el-col>
          <el-col :span="2" class="detail-label">创建时间</el-col>
          <el-col :span="10" class="detail-value">{{detailData.addtime?timeFormatter(detailData.addtime):'--'}}</el-col>
        </el-row>
        <el-row class="detail-row" style="background:#fff;text-align:right">
          <el-col :span="24" class="detail-btn">
              <el-button type="" @click="handleBack">返回</el-button>
              <el-button type="primary" @click="handleSave">保存</el-button>
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
        ADD:true,
        form:{
          api_method:'WalletAddressModify',
          id:'',
          //cash_min_number:'',
          //save_days:'',
          trans_locked:'0',
         // walletShortEn:''
        },
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
        //账户类型 
        baseTypes:[
          {
            value:null,
            label:'全部'
          },
          {
            value:1,
            label:'系统'
          },
          {
            value:2,
            label:'用户'
          },
          {
            value:3,
            label:'冷钱包'
          },
          {
            value:4,
            label:'找零地址'
          },
          {
            value:5,
            label:'总账户'
          }
        ],
        detailData:{},
      }
    },
    methods:{
      transLockedChange(v){
        console.log(v);
        this.transLocked = v;
      },
      walletTypeFormatter(value){
        for(let item of this.walletTypes){
          if(item.walletType == value){
            return item.walletShortEn;
          }
        }
      },
       baseTypeFormatter(value){
        for(let item of this.baseTypes){
          if(item.value == value){
            return item.label;
          }
        }
      },
      timeFormatter(ct){
        if(ct == 0){return ct;}
        let cellTime =new Date(parseInt(ct) * 1000);
        return util.formatDate.format(cellTime);
      },
      handleSave(){
        var _this = this;
        this.$confirm('是否确认设置?', '设置确认', {
          //center: true
          //type: 'warning'
        }).then(() => {
          _this.save();
        }).catch(() => {
        });
      },
      save(){
        requestApi(this.form).then((res) => {
        console.log(res);
        let {msg,status} = res;
          if(status !== '200'){
            this.$message({
              message: msg,
              type: 'error'
            });
          }else{
            this.$message({
              message: '设置成功',
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
          let {msg,status,walletAddress} = res;
            if(status !== '200'){
              this.$message({
                message: msg,
                type: 'error'
              });
            }else{
              this.detailData = walletAddress;
              this.form.trans_locked = walletAddress.transLocked+'';
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
      this.setwalletTypeList();
      if(this.$route.query.id){
        this.ADD = false;
        this.form.id = this.$route.query.id;
        this.getDetail();  
      }else{
        this.ADD = true;
      } 
    }
  }
</script>

<style>
  .detail-row{
    min-width:500px;
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