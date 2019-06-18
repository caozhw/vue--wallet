<template>
  <section>
  
    <!--工具条-->
    <el-form :model="form" ref="form"  :inline="true"  :label-position="labelPosition" label-width="100px" >
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;margin-bottom: 0;min-width:1080px">
        <el-form-item label="平台订单号">
           <el-input v-model="form.trade_no" clearable   placeholder="平台订单号"></el-input>
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
        <el-form-item label="UID">
           <el-input v-model="form.uid" clearable   placeholder="用户UID"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;margin-top: 0;">
        <el-form-item label="区块订单号">
          <el-input v-model="form.tx_id" clearable   placeholder="区块订单号"></el-input>
        </el-form-item>
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
        <el-form-item>
          <el-button type="primary" @click="handleQuery('form')">查询</el-button>
        </el-form-item>
      </el-col>
    </el-form>
     <!--数据 按钮-->
    <el-col :span="24"  style="">
      <el-row :gutter="20" style="margin: 0;line-height: 60px;">
        <el-col :span="1" style="text-align:right;min-width:80px">已对账</el-col>
        <el-col :span="3"><el-input disabled v-model="checked"></el-input></el-col>
        <el-col :span="2">{{walletTypeFormatter(this.form.wallet_type)}}</el-col>
        <el-col :span="19"></el-col>
      </el-row>
      <el-row :gutter="20" style="margin: 0;height:60px;line-height:60px">
        <el-col :span="1" style="text-align:right;min-width:80px">未对账</el-col>
        <el-col :span="3"><el-input disabled v-model="unchecked"></el-input></el-col>
        <el-col :span="2">{{walletTypeFormatter(this.form.wallet_type)}}</el-col>
        <el-col :span="17" style="text-align:right"> 
          <el-button type="primary" @click="handleVerifyClick()" :disabled="roleId==3">审核</el-button>
          <el-button type="primary" @click="handleExportClick()">导出</el-button>
        </el-col>
      </el-row>
    </el-col>

    <!--列表-->
    <el-col :span="24" class="" style="padding-bottom: 0px;margin-top: 0;">
      <el-table :data="listData" :row-style="rowColor"   :fit="tableFit" highlight-current-row border   style="width: 100%;" 
        :cell-class-name="cellHide" @selection-change="handleSelectionChange">
        <el-table-column label="全选" type="selection" width="10" align="center" >
        </el-table-column>
        <el-table-column prop="tradeNo" label="平台订单号" width="140" align="center" >
        </el-table-column>
         <el-table-column prop="txId" label="区块订单号" width="180" align="center" >
        </el-table-column>
        <el-table-column prop="uid" label="UID" width="80"  align="center" >
        </el-table-column>
         <el-table-column prop="transMoney" label="交易平台充币总量" width="80" align="right" :formatter="namberFormatter">
        </el-table-column>
        <el-table-column prop="walletMoney" label="钱包系统充币总量" width="80" align="right" :formatter="namberFormatter">
        </el-table-column>
         <el-table-column prop="createTime" label="生成订单时间" width="100" align="center" :formatter="tableTimeFormatter">
        </el-table-column>
         <el-table-column prop="checkTime" label="自动对账时间" width="100" align="center" :formatter="tableTimeFormatter">
        </el-table-column>
        <el-table-column prop="status" label="自动对账结果" width="60" align="center" :formatter="statusFormatter">
        </el-table-column>
        <el-table-column prop="auditStatus" label="财务审核状态" width="60" align="center" :formatter="auditStatusFormatter">
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
  import fileDownload from 'js-file-download';
  import { requestApi ,exportApi} from '../../api/axios.js';
  import util from '../../util.js';
  export default{
    data:function(){
      return{
        roleId:null,
        tableFit:false,
        labelPosition:'right',
        dataRange:'',
        listTotal:0,//  列表数据总量
        checked:0,//已对账 数量
        unchecked:0,//未对账 数量
        selected:[],//选中的行
        ids:'',//审核参数
        fileHref:null,
        download:null,
        exportNumber:10,
        //查询集合
        form:{
          api_method:'WalletCheckInList',
          trade_no:null,//平台订单号
          tx_id:null,//区块订单号
          uid:null,//uid号
          wallet_type:null, //币种 钱包类型
          check_day:null,//查询日期
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
       this.roleId = sessionStorage.getItem('BITKER_ROLE_ID');
      this.form.wallet_type= this.$route.query.wallet_type;
      this.form.check_day= this.$route.query.check_day;
      this.query();
      this.setwalletTypeList();
    },
    methods: {
      walletTypeFormatter(cellValue){
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
          return cellValue;
        }
      },
      tableTimeFormatter(row, column, cellValue, index){
        if(cellValue == 0){return '--';}
        let cellTime =new Date(parseInt(cellValue) * 1000);
        return util.formatDate.format(cellTime);
        //return cellValue
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
          let {data,total,msg,status,checked,unchecked} = res;
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
            this.checked = checked;
            this.unchecked = unchecked;
          }
          //console.log(res);
        }).catch(() => {
        });
      },
      handleSelectionChange(selection){//表格行单选
        this.selected = selection;
        console.log(this.selected);

      },
      handleVerifyClick(){ //审核
        let idsArr = [],_this = this; 
        for(let obj of this.selected){
          if(obj.id && obj.status == 2){
            idsArr.push(obj.id);
          }
        }
        this.ids = idsArr.join(',');
        console.log(this.ids)
        if(this.ids == ''){
           this.$message({
              message: '请选择要审核的明细',
              type: 'error'
            });
        }else{
          this.$confirm('是否确认审核?', '提示', {
          //center: true
          //type: 'warning'
          }).then(() => {
            _this.verify();
            console.log('ids',this.ids);
          }).catch(() => {
          });
        } 
      },
      verify(){//确认审核
        let params = {
           api_method:'WalletCheckInAudit',
           audit_status:2,
           ids:this.ids
        };
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
            this.query();
            this.$message({
              message: '审核成功',
              type: 'success'
            });
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
        params.api_method = 'WalletCheckInListExp';
        params.page_number = 1;
        params.page_size = this.exportNumber;
        exportApi(params).then((res) => {
         if(res){
            this.form.api_method = 'WalletCheckInList'; 
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
      setwalletTypeList(){ //设置系统钱包列表 热钱包
        let walletTypeList = sessionStorage.getItem('WalletTypeList');
        this.walletTypes = JSON.parse(walletTypeList);
        console.log(this.walletTypes)
        this.walletTypes.unshift({walletType:null,walletShortEn:'全部'});
      },
      rowColor({row, rowIndex}){ //表格行颜色
        if(row.status == 1){
          return 'color:#ff0000';
        }
      },
      cellHide(row){
        if(row.row.status == 1){
          return "cell-hide";
        }
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
.el-checkbox {
  min-width:40px;
  max-width: 40px;
}
.cell-hide .el-checkbox__input {
  display: none;
}

</style>