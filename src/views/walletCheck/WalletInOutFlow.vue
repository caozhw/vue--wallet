<template>
  <section>
    <!--工具条-->
    <el-form :model="form" ref="form"  :inline="true"  :label-position="labelPosition" label-width="80px" >
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;margin-bottom: 0;min-width:1080px">
        <el-form-item label="账户地址" >
          <el-input v-model="form.wallet_address" clearable  placeholder="账户地址"></el-input>
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
        <el-form-item>
          <el-button type="primary" @click="handleQuery('form')">查询</el-button>
          <el-button type="primary" @click="handleExportClick()">导出</el-button>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px;margin-top: 0;">
        <el-form-item label="交易时间">
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
      </el-col> -->
    </el-form>

    <el-col :span="24" class="" style="padding-bottom: 0px;margin:20px 0 10px;text-align:right;">
      
     <!--  <el-button type="primary" @click="handleAdd()">新增币种</el-button> -->
      
    </el-col>
    <!--列表 fromBookAddress-->
    <el-col :span="24" class="" style="padding-bottom: 0px;margin-top: 0;">
      <el-table :data="listData"  :fit="tableFit" highlight-current-row border   style="width: 100%;">
       <el-table-column prop="transToken" label="流水号" width="80"  align="center" >
        </el-table-column> 
         <el-table-column prop="successMoney" label="交易金额" width="120"  align="right" :formatter="namberFormatter">
        </el-table-column>
        <el-table-column prop="successGas" label="矿工费" width="120" align="center" >
        </el-table-column>
        <el-table-column prop="address" label="平台订单号" width="80" align="center" >
        </el-table-column>
         <el-table-column prop="txId" label="交易哈希" width="80" align="center" >
        </el-table-column>
         <el-table-column prop="transTime" label="时间" width="80" align="center" :formatter="tableTimeFormatter">
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
  import { requestApi ,exportApi} from '../../api/axios.js';
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
          api_method:'WalletInOutFlow',
          wallet_type:null, //币种 钱包类型
          wallet_address:null,
          //trans_time_begin:null,//开始时间
          //trans_time_end:null,//结束时间
          page_number:1,//表格当前页
          page_size:10
        },
        //币种 钱包类型 选择器数据
        walletTypes:[
          
        ],
       
        
        //列表
        listData:[]
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
        return cellValue.toFixed(8); 
      },
      tableTimeFormatter(row, column, cellValue, index){
        if(cellValue == 0){return '--';}
        let cellTime =new Date(parseInt(cellValue) * 1000);
        return util.formatDate.format(cellTime);
        //return cellValue
      },

      //查询
      handleQuery(form){
        this.form.page_number = 1;
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
      query(){ 
        this.form.wallet_short_en = this.form.wallet_short_en == '全部'?'':this.form.wallet_short_en;
        requestApi(this.form).then((res) => {
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
            this.listData = data;
            this.listTotal = total;
            console.log(this.listData[0].cashMinNumber);   
          }
          
        }).catch(() => {
        });
      },
       handleExportClick(){//导出
         this.$prompt('请输入导出数据的条数', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[0-9]*$/,
          inputErrorMessage: '数字格式不正确'
        }).then(({ value }) => {
          this.exportNumber = value;
          this.export();
          /*this.$message({
            type: 'success',
            message: '导出的条数是: ' + value
          });*/
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消导出'
          });       
        });
      },
      export(){
        let params = this.form;
        params.api_method = 'WalletInOutFlowExp';
        params.page_number = 1;
        params.page_size = this.exportNumber;
        exportApi(params).then((res) => {
         if(res){
            this.form.api_method = 'WalletInOutFlow'; 
            this.$message({
              message: '导出成功',
              type: 'success'
            });
          }else{
            this.$message({
              message: msg,
              type: 'error'
            });
            if(status == '211'){
              this.$router.push({ path: '/login'}); 
            } 
          }
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