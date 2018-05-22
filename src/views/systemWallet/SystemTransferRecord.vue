<!--系统转账记录-->
<template>
  <section>
    <!--工具条-->
    <el-form :model="form" ref="form"  :inline="true"  :label-position="labelPosition" label-width="80px" >
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;margin-bottom: 0;min-width:1080px">
        <el-form-item label="订单号" >
          <el-input v-model="form.trans_id" clearable  placeholder="订单号"></el-input>
        </el-form-item>
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
      </el-col>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;margin-top: 0;">
        <el-form-item label="地址" :style="{display: form.biz_type==2?'none':'inline-block'}">
          <el-input v-model="form.address" clearable placeholder="地址"></el-input>
        </el-form-item>
        <el-form-item label="到账时间">
          <el-date-picker
            v-model="dataRange"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="timestamp"
            @change="selectDate"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery('form')">查询</el-button>
        </el-form-item>
      </el-col>
    </el-form>

    <el-col :span="24" class="" style="padding-bottom: 0px;margin-top: 20px;">
      <template>
        <el-tabs v-model="form.biz_type" type="card" @tab-click="handleTabClick">
          <el-tab-pane label="冷钱包转账记录"  name="1"></el-tab-pane>
          <el-tab-pane label="热钱包转账记录"  name="2"></el-tab-pane>
          <el-tab-pane label="热钱包手续费转账记录"  name="3"></el-tab-pane>
        </el-tabs>
      </template>
    </el-col>
    <!--列表 fromBookAddress-->
    <el-col :span="24" class="" style="padding-bottom: 0px;margin-top: 0;">
      <el-table :data="listData"  :fit="tableFit" highlight-current-row border   style="width: 100%;">
        <el-table-column prop="txId" label="订单号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="walletType" label="币种" width="80"  align="center" :formatter="walletTypeFormatter">
        </el-table-column>
        <el-table-column prop="address" label="转出账户" width="80" align="center">
        </el-table-column>
        <el-table-column prop="toAddress" label="转入账户" width="80" align="center">
        </el-table-column>
        <el-table-column prop="useMoney" label="当前账户余额" width="80" align="center" v-if="form.biz_type==1">
        </el-table-column>
        <el-table-column prop="transMomey" label="转账数量" width="80" align="center" v-if="form.biz_type!=3">
        </el-table-column>
         <el-table-column prop="transGas" label="转账手续费数量" width="80" align="center" v-if="form.biz_type==3">
        </el-table-column>
        <el-table-column prop="transTime" label="到账时间" width="120" align="center" :formatter="tableTimeFormatter">
        </el-table-column>
      </el-table>
    </el-col>
    <!--分页 :page-size="10"  :page-sizes="[10, 20, 30, 40]"-->
    <el-col :span="24" class="toolbar" style="background-color:#fff">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="form.page_number"
        layout="prev, pager, next, total, jumper"
        :total="listTotal">
      </el-pagination>  
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
          api_method:'WalletTransOutPlatList',
          trans_id:null,//交易id 订单号 
          address:null,//转出地址
          to_address:null,//转入地址
          wallet_type:null, //币种 钱包类型
          trans_time_begin:null,//开始时间
          trans_time_end:null,//结束时间
          biz_type:"1",//页签类型
          page_number:1,//表格当前页
          page_size:10
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
        

        //列表
        listData:[]
      }
    },
    mounted(){
      this.query();
      this.setwalletTypeList();
    },
    methods: {
      //选择时间范围
      selectDate(dateRange){
        let dr = {
          trans_time_begin:dateRange?dateRange[0]/1000:null,
          trans_time_end:dateRange?dateRange[1]/1000:null
        };
        Object.assign(this.form,dr);
      },
      walletTypeFormatter(row, column, cellValue, index){
        for(let item of this.walletTypes){
          if(item.walletType == cellValue){
            return item.walletShortEn;
          }
        }
      },
      tableTimeFormatter(row, column, cellValue, index){
        if(cellValue == 0){return cellValue;}
        let cellTime =new Date(parseInt(cellValue) * 1000);
        return util.formatDate.format(cellTime);
        //return cellValue
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
      //分页查询
      handleCurrentChange(val) {
        this.form.page_number = val;
        this.query();
        //this.getUsers();
      },
      //tab类型查询
      handleTabClick(tab,event) {
        this.query();
        this.setwalletTypeList();
        //console.log(tab,event);
      },
      query(){
        //this.form.biz_type = parseInt(this.form.biz_type);
        requestApi(this.form).then((res) => {
          let {data,total,msg,status} = res;
          if(status !== '200'){
            this.$message({
              message: msg,
              type: 'error'
            });
          }else{
            this.listData = data;
            this.listTotal = total;
          }
          console.log(res);
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

</style>