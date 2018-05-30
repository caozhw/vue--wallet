<template>
  <div>
    <section>
       <h3>提币放行</h3>
       <el-row class="detail-row">
        <el-col :span="2" class="detail-label">订单号</el-col>
        <el-col :span="10" class="detail-value">{{datailData.txId}}</el-col>
        <el-col :span="2" class="detail-label">UID</el-col>
        <el-col :span="10" class="detail-value">{{datailData.uid}}</el-col>
      </el-row>
      <el-row class="detail-row">
         <el-col :span="2" class="detail-label">币种</el-col>
        <el-col :span="10" class="detail-value">{{walletTypeFormatter()}}</el-col>
        <el-col :span="2" class="detail-label">用户钱包</el-col>
        <el-col :span="10" class="detail-value">{{datailData.bookAddress}}</el-col>
      </el-row>
       <el-row class="detail-row">
        <el-col :span="2" class="detail-label">热钱包</el-col>
        <el-col :span="10" class="detail-value">
          <el-select v-model="form.address_id" placeholder="请选择">
            <el-option
              v-for="item in walletAddressListByPlat"
              :key="item.id"
              :label="item.baseType"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <!-- <el-col :span="10" class="detail-value">{{datailData.address}}</el-col> -->
        <!-- <el-col :span="2" class="detail-label">认证级别</el-col>
        <el-col :span="10" class="detail-value">{{datailData.transType}}</el-col> -->
      </el-row>
      <el-row class="detail-row">
        <el-col :span="2" class="detail-label">提币数量</el-col>
        <el-col :span="10" class="detail-value">{{datailData.successMoney}}</el-col>
        <el-col :span="2" class="detail-label">区块手续费</el-col>
        <el-col :span="10" class="detail-value">{{datailData.successGas}}</el-col>
      </el-row>
      <el-row class="detail-row">
        <el-col :span="2" class="detail-label">平台审核人</el-col>
        <el-col :span="10" class="detail-value">{{datailData.auditUid?datailData.auditUid:'--'}}</el-col>
        <el-col :span="2" class="detail-label">审核备注</el-col>
        <el-col :span="10" class="detail-value">{{datailData.remark?datailData.remark:'--'}}</el-col>
      </el-row>
      <el-row class="detail-row">
        <el-col :span="2" class="detail-label">申请时间</el-col>
        <el-col :span="10" class="detail-value">{{timeFormatter(datailData.addtime)}}</el-col>
        <el-col :span="2" class="detail-label">打币时间</el-col>
        <el-col :span="10" class="detail-value">{{timeFormatter(datailData.transTime)?timeFormatter(datailData.transTime):'--'}}</el-col>
      </el-row>
      <el-row class="detail-row" style="background:#fff;text-align:right">
        <el-col :span="24" class="detail-btn">
          <el-button type="" @click="handleBack">返回</el-button>
          <el-button type="primary" @click="handleModifyDialogShow">打币审核</el-button>
        </el-col>
      </el-row>
    </section> 


    <!-- 审核 对话框 -->
      <el-dialog title="打币审核" :visible.sync="dialogFormVisible" width="600px">
        <el-form :model="form">
          <el-form-item label="打币审核" label-width="80px">
            <el-radio-group v-model="form.status">
              <el-radio :label="4">通过</el-radio>
              <el-radio :label="5">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" label-width="80px">
             <el-input type="textarea" v-model="form.remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleModify">确 定</el-button>
        </div>
      </el-dialog>

  </div>
</template>
<script>
  import { requestApi } from '../../api/axios.js';
  import util from '../../util.js';
  export default{
    data:function(){
      return{
        dialogFormVisible: false,
        form:{
          api_method:'WalletTransOutModify',
          id:null,
          address_id:null,//钱包地址ID
          status:4,//审核状态
          remark:null,//备注
        },
        datailData:{
          txId:'',
          uid:'',
          walletType:'',
          address:'',
          bookAddress:'',
          successMoney:'',
          successGas:'',
          auditUid:'',
          remark:'',
          addtime:'',
          transTime:'',
        },
        walletAddressListByPlat:[],
       
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
        transLockeds:[
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
          /*{
            value:2,
            label:'用户'
          },*/
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
      }
    },
    methods: {
      walletTypeFormatter(){
        for(let item of this.walletTypes){
          if(item.walletType == this.datailData.walletType){
            return item.walletShortEn;
          }
        }
      },
      timeFormatter(ct){
        if(ct == 0){return '--';}
        let cellTime =new Date(parseInt(ct) * 1000);
        return util.formatDate.format(cellTime);
        //return cellValue
      },
      baseTypeFormatter(value){
        for(let item of this.walletAddressListByPlat){
          if(item.walletAddress == value){
            for(let btItem of this.baseTypes){
              if(btItem.value == item.baseType){
                return btItem.label;
              }
            } 
          }
        }
      },
      transLockedChange(v){
        this.transLocked = v;
      },
      //返回
      handleBack(){
        this.$router.go(-1);
      },
      handleModifyDialogShow(){
        this.dialogFormVisible = true;
      },
      handleModify(){
        requestApi(this.form).then((res) => {
          let {msg,status,data} = res;
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
                message: '审核成功',
                type: 'success'
              });
            this.dialogFormVisible = false;
            }
        }).catch(() => { 
        });
      },

      getDetail(){
        let params = {api_method:'WalletTransOutDetail',id:this.$route.query.id};
        requestApi(params).then((res) => {
          //console.log(res);
          let {msg,status,data} = res;
            if(status !== '200'){
              this.$message({
                message: msg,
                type: 'error'
              });
              if(status == '211'){
                this.$router.push({ path: '/login'}); 
              }
            }else{
              this.datailData = data;
              this.datailData.transLocked += '';
              this.transLocked = this.datailData.transLocked;
              this.form.id = this.$route.query.id;
            }
            //console.log(res);
        }).catch(() => { 
        });
      },
       //设置系统钱包列表 热钱包
      setWalletAddressListByPlat(){ 
        let walletAddressListByPlat = sessionStorage.getItem('WalletAddressListByPlat');
        this.walletAddressListByPlat = JSON.parse(walletAddressListByPlat);
      },
       //设置系统钱包列表 热钱包
      setwalletTypeList(){ 
        let walletTypeList = sessionStorage.getItem('WalletTypeList');
        this.walletTypes = JSON.parse(walletTypeList);
        this.walletTypes.unshift({walletType:null,walletShortEn:'全部'});
      } 
    },
     
    mounted(){
      this.getDetail();
      this.setWalletAddressListByPlat();
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