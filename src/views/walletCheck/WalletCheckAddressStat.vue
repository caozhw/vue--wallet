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
        <el-form-item label="对账状态">
          <el-select v-model="form.status" placeholder="全部">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
       
      </el-col>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;margin-top: 0;">
       <el-form-item label="审核状态">
          <el-select v-model="form.audit_status" placeholder="全部">
            <el-option
              v-for="item in auditStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易日期">
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
      <template >
        <el-tabs v-model="biz_type" type="card">
          <el-tab-pane label="余额对账"  name="0"></el-tab-pane>
        </el-tabs>
      </template>
    </el-col>
    <!--列表 fromBookAddress-->
    <el-col :span="24" class="" style="padding-bottom: 0px;margin-top: 0;">
      <el-table :data="listData"   v-if="biz_type == 0"
      :summary-method="getSummaries"  show-summary  :fit="tableFit" highlight-current-row border   style="width: 100%;" :row-style="rowColor"  :cell-style="cellStyle" @cell-click="sumTransMoneyClick">
        <el-table-column prop="check_day" label="日期" width="120" align="center" >
        </el-table-column>
        <el-table-column prop="wallet_type" label="币种" width="80"  align="center" :formatter="walletTypeFormatter">
        </el-table-column>

        <el-table-column prop="sumBalanceWallet" label="区块链账户余额总量"  width="80" align="right" 
          :formatter="namberFormatter">
        </el-table-column>
        <el-table-column prop="sumBalance" label="钱包系统账户余额总量"  width="80" align="right" :formatter="namberFormatter">
        </el-table-column>

        <el-table-column prop="status" label="对账状态" width="80" align="center" :formatter="statusFormatter">
        </el-table-column>
        <el-table-column prop="audit_status" label="财务审核状态" width="80" align="center" :formatter="auditStatusFormatter">
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
        biz_type:'0',//0充币对账 1提币对账
        //查询集合
        form:{
          api_method:'WalletCheckAddressStat',//充币对账   WalletCheckOutStat提币对账
          wallet_type:null, //币种 钱包类型
          check_time_begin:null,//开始时间
          check_time_end:null,//结束时间
          status:null,//对账状态
          audit_status:null,//审核状态
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
       //设置系统钱包列表 热钱包
      setwalletTypeList(){ 
        let walletTypeList = sessionStorage.getItem('WalletTypeList');
        this.walletTypes = JSON.parse(walletTypeList);
        this.walletTypes.unshift({walletType:null,walletShortEn:'全部'});
      },
      rowColor({row, rowIndex}){ //表格行颜色
        if(row.status == 1){
          return 'color:#ff0000'
        }
      },
      cellStyle({row, column, rowIndex, columnIndex}){ //单元格样式
        if(column.label == '钱包系统账户余额总量' ){ 
          return 'cursor:pointer;color:#66b1ff;'
        }
      },
      sumTransMoneyClick(row, column, cell, event){ //单元格点击事件
        if(column.label == '钱包系统账户余额总量'){
          this.$router.push({ path: '/WalletCheckAddressList', query: { wallet_type: row.wallet_type,check_day:row.check_day }}) 
        }
      },
      getSummaries(param) { //表格合计行
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          if (index === 1 || index === 4 || index === 5) {
            sums[index] = '--';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) { 
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index];
           
          } else {
            sums[index] = '--';
          }
          if(index === 2 || index === 3){
            sums[index] = Number(sums[index]).toFixed(8);
          }
        });
        return sums;
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