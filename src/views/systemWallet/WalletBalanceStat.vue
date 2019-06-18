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
      <template >
        <el-tabs v-model="biz_type" type="card">
          <el-tab-pane label="余额查询列表"  name="0"></el-tab-pane>
        </el-tabs>
        <el-button class='export_btn' type="primary" @click="handleExportClick()">导出</el-button>
      </template>
    </el-col>
    <!--列表 fromBookAddress-->
    <el-col :span="24" class="" style="padding-bottom: 0px;margin-top: 0;">
      <el-table :data="listData"   v-if="biz_type == 0"  :fit="tableFit" highlight-current-row border   style="width: 100%;" >
        <el-table-column prop="walletType" label="币种" width="80"  align="center" :formatter="walletTypeFormatter">
        </el-table-column>
        <el-table-column prop="balanceSum" label="余额数量"  width="80" align="right" :formatter="namberFormatter">
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
        biz_type:'0',//0充币对账 1提币对账
        exportNumber:10,
        //查询集合
        form:{
          api_method:'WalletBalanceStat',//充币对账   WalletCheckOutStat提币对账
          wallet_type:null, //币种 钱包类型
          page_number:1,//表格当前页
          page_size:10
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
        //审核状态  选择器数据
        auditStatus:[
          {
            value:null,
            label:'全部'
          },
          {
            value:2,
            label:'已审核'
          },
          {
            value:1,
            label:'未审核'
          }
        ],
        //对账状态  选择器数据
        statusList:[
          {
            value:null,
            label:'全部'
          },
          {
            value:2,
            label:'已对账'
          },
          {
            value:1,
            label:'未对账'
          }
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
          check_time_begin:dateRange?dateRange[0]/1000:null,
          check_time_end:dateRange?dateRange[1]/1000:null
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
          }
          //console.log(res);
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
        params.api_method = 'WalletBalanceStatExp';
        params.page_number = 1;
        params.page_size = this.exportNumber;
        exportApi(params).then((res) => {
         if(res){
            this.form.api_method = 'WalletBalanceStat'; 
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
      },
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
.el-tabs{
  width: 92%;
  float: left;
}
.export_btn{
  float: left;
}

</style>