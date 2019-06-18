<template>
  <section>
    <!--工具条-->
    <el-form :model="form" ref="form"  :inline="true"  :label-position="labelPosition" label-width="80px" >
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;margin-bottom: 0;min-width:1080px">
        <el-form-item label="币种">
          <el-select v-model="form.wallet_type" placeholder="请选择">
            <el-option
              v-for="item in walletTypes"
              :key="item.walletType"
              :label="item.walletShortEn"
              :value="item.walletType">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery('form')">查询</el-button>
        </el-form-item>
      </el-col>
    </el-form>
    <el-col :span="24" class="" style="padding-bottom: 0px;margin-top: 20px;">
      <el-input class="textarea" type="textarea" v-model="listData"></el-input>
    </el-col>

  </section>
</template>
<script>
  import { requestApi } from '../../api/axios.js';
  import util from '../../util.js';
  export default{
    data:function(){
      return{
        tableFit:false,
        labelPosition:'left',
        dataRange:'',
        listTotal:0,//  列表数据总量
       
        //查询集合
        form:{
          api_method:'walletLastBlock',//充币对账   WalletCheckOutStat提币对账
          wallet_type:null, //币种 钱包类型
        },
        //币种 钱包类型 选择器数据
        walletTypes:[
         /* {
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


        //列表
        listData:null
      }
    },
    mounted(){
      //this.query();
      this.setwalletTypeList();
    },
    methods: {
      
      walletTypeFormatter(row, column, cellValue, index){
        for(let item of this.walletTypes){
          if(item.walletType == cellValue){
            return item.walletShortEn;
          }
        }
      },
      namberFormatter(row, column, cellValue, index){
        if(cellValue || cellValue == 0){
          return cellValue.toFixed(8);
        }else{
          return cellValue;
        }
      },
      statusFormatter(row, column, cellValue, index){//对账状态
        for(let item of this.statusList){
          if(item.value == cellValue){
            return item.label;
          }
        }
      },
      auditStatusFormatter(row, column, cellValue, index){//审核状态
        for(let item of this.auditStatus){
          if(item.value == cellValue){
            return item.label;
          }
        }
      },
      //查询
      handleQuery(form){
        this.$refs[form].validate((valid) => {
          if (valid) {
           this.query();   
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        //console.log(JSON.stringify(this.form));
      },
      query(){
        requestApi(this.form).then((res) => {
          if(res == 'ERROR'){
            this.$message({
              message: '当前币种未查到信息',
              type: 'error'
            });
          }else if(res instanceof Object){
             this.listData = JSON.stringify(res);
             this.$message({
              message: '查询成功',
              type: 'success'
            });
          }else{
             this.$router.push({ path: '/login'}); 
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
    }
  }
</script>

<style>
.el-table table{
  width:100% !important;
  table-layout: initial; 
}
.el-table th{
  background:#e5e9f2;
  color: #000;   
}
.el-table td{
  padding:4px 0;  
}
.el-table tr:odd{

}
.el-table--border th{
  border-right: 1px solid #cfd1d7;
}
.el-table__body, .el-table__footer, .el-table__header {
     table-layout: initial; 
}
.textarea{
  width:600px;
  height:800px;
}
.textarea .el-textarea__inner{
  width:400px;
  height:600px;
}

</style>