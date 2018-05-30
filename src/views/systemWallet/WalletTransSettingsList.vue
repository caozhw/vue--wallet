<!-- 系统转账设置  提现预警表-->
<template>
  <div>
    <section>
      <h3>系统转账设置</h3>
        <el-col :span="24">
         <!--列表 -->
          <el-table :data="listData_1"  border style="width: 100%">
            <el-table-column prop="wallet_type" label="币种" width="" align="center" :formatter="walletTypeFormatter">
            </el-table-column>
            <el-table-column prop="avgMoney" label="七日提现平均数" width="" align="right"  :formatter="namberFormatter">
            </el-table-column>
            <el-table-column label="预存天数" width="" align="center">
               <template  slot-scope="scope"> 
                <span :style="{display: scope.row.id!=TableRowId?'inline-block':'none'}">{{scope.row.save_days}}</span>
                <el-input v-model="tableModify.save_days" clearable :style="{display: scope.row.id==TableRowId?'inline-block':'none'}">
                </el-input>
               </template>
            </el-table-column>
             <el-table-column prop="refMoney" label="参考提币预留数量" width="" align="right"  :formatter="namberFormatter">
            </el-table-column>
             <el-table-column prop="sumUseMoney" label="提币余额" width="" align="right"  :formatter="namberFormatter">
            </el-table-column>
             <el-table-column prop="diffMoney" label="提币差额" width="" align="right"  :formatter="namberFormatter">
            </el-table-column>
            <el-table-column label="操作" width="180" align="center">
              <template  slot-scope="scope"> 
                <el-button size="small" @click="handleTableEdit(scope.$index, scope.row)" 
                :style="{display: scope.row.id!=TableRowId?'inline-block':'none'}">修改</el-button> 
                 <el-button size="small" @click="handleTableSave(scope.$index, scope.row)" 
                :style="{display: scope.row.id==TableRowId?'inline-block':'none'}">保存</el-button> 
                 <el-button size="small" @click="handleTableConcel(scope.$index, scope.row)" 
                :style="{display: scope.row.id==TableRowId?'inline-block':'none'}">取消</el-button> 
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <!--分页 :page-size="10"  :page-sizes="[10, 20, 30, 40]"-->
        <el-col :span="24" class="toolbar" style="background-color:#fff;margin-bottom:28px">
          <el-pagination
            @current-change="handleCurrentChange_1"
            :current-page="form_1.page_number"
            layout="prev, pager, next, total, jumper"
            :total="listTotal_1">
          </el-pagination>  
        </el-col>
   
    </section> 

  <section> 
     <h3>提现预警表</h3>
      <!--工具条-->
      <el-form :model="form_2" ref="form_2"  :inline="true"  :label-position="labelPosition" label-width="80px" >
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;margin-bottom: 0; background: #fff;">
          <el-form-item label="币种">
            <el-select v-model="form_2.wallet_type" placeholder="请选择">
              <el-option
                v-for="item in walletTypes"
                :key="item.walletType"
                :label="item.walletShortEn"
                :value="item.walletType">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery_2('form_2')">查询</el-button>
          </el-form-item>
        </el-col>
      </el-form>
       <!--列表 -->
      <el-col :span="24">
        <el-table :data="listData_2"  border style="width: 100%">
          <el-table-column prop="wallet_short_en" label="币种" width="" align="center">
          </el-table-column>
          <template v-for="(item,index) in table_2_days">
             <el-table-column :prop="item" :label="item" width="" align="center" :formatter="tableDataFormatter">
             </el-table-column>
          </template>
          <el-table-column prop="sumMoney" label="7日总提币" width="" align="right"  :formatter="namberFormatter">
          </el-table-column>
          <el-table-column prop="avgMoney" label="平均提币" width="" align="right"  :formatter="namberFormatter">
          </el-table-column>
        </el-table>
      </el-col> 
      <!--分页 -->
      <el-col :span="24" class="toolbar" style="background-color:#fff">
        <el-pagination
          @current-change="handleCurrentChange_2"
          :current-page="form_2.page_number"
          layout="prev, pager, next, total, jumper"
          :total="listTotal_2">
        </el-pagination>  
      </el-col>
     
   </section>
  </div>
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
        listTotal_1:0,
        listTotal_2:2,
        TableRowId:-1,
        form_1:{
          api_method:'WalletTransSettingsList',//系统转账设置列表    
          page_number:1,
          page_size:10
        },
        form_2:{
          api_method:'WalletTransOutWarningList',//提现预警表
          wallet_type:null,
          page_number:1,
          page_size:10
        },
        tableModify:{
          api_method:'WalletTypeModify',
          id:null,
          save_days:null
        },
        listData_1:[],
        listData_2:[],
        table_2_days:[],
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
      }
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
        if(cellValue){
           return cellValue.toFixed(8);
         }else{
          return '--'
         }
       
      },
      tableDataFormatter(row, column, cellValue, index){
        console.log(cellValue)
        if(cellValue || cellValue!=0){
          return cellValue;
        }else{
          return '--';
        }
      },
      
     
      //表格编辑显示
      handleTableEdit(index,row){
         //console.log('index',index);
        this.tableModify.id = row.id;
        this.tableModify.save_days = row.save_days;
        this.TableRowId = row.id;
      },
      handleTableConcel(){
        this.TableRowId = -1; 
      },
      handleTableSave(){
        console.log(this.tableModify);
        var _this = this;
        this.$confirm('是否确认保存?', '保存确认', {
          //center: true
          //type: 'warning'
        }).then(() => {
          _this.save();
        }).catch(() => {
        });
      },
      //分页查询1
      handleCurrentChange_1(val) {
        this.form_1.page_number = val;
        this.query_1();
      },
       //分页查询2
      handleCurrentChange_2(val) {
        this.form_2.page_number = val;
        this.query_2();
      },
      save(){
        requestApi(this.tableModify).then((res) => {
        //console.log(res);
        let {msg,status} = res;
          if(status !== '200'){
            this.$message({
              message: msg,
              type: 'error'
            });
          }else{
            this.query_1();
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.TableRowId = -1;
          } 
        }).catch(() => { 
        });
      },
      query_1(){
        requestApi(this.form_1).then((res) => {
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
            this.listData_1 = data;
            this.listTotal_1 = total;
          }
         // console.log(res);
        }).catch(() => {
        });
      },
      query_2(){
        requestApi(this.form_2).then((res) => {
          let {data,total,msg,status,days} = res;
          if(status !== '200'){
            this.$message({
              message: msg,
              type: 'error'
            });
          }else{
            this.listData_2 = data;
            this.listTotal_2 = total;
            this.table_2_days = days.sort();//reverse
          }
          console.log(res);
        }).catch(() => {
        });

       },
      //提现预警表
      //查询 
      handleQuery_2(form){
        this.$refs[form].validate((valid) => {
          if (valid) {
           this.query_2();   
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        //console.log(JSON.stringify(this.form));
      },
      //设置系统钱包列表 热钱包
      setwalletTypeList(){ 
        let walletTypeList = sessionStorage.getItem('WalletTypeList');
        this.walletTypes = JSON.parse(walletTypeList);
        this.walletTypes.unshift({walletType:null,walletShortEn:'全部'});
      }   
    },

    mounted(){
      this.query_1();
      this.query_2();
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