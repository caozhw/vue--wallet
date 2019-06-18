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
        <el-form-item label="添加时间">
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
      </el-col>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;margin-top: 0;">
        <el-form-item label="UID" >
          <el-input v-model="form.uid" clearable  placeholder="UID"></el-input>
        </el-form-item>
        
        <el-form-item label="打币方式">
          <el-select v-model="form.audit_type" placeholder="请选择">
            <el-option
              v-for="item in auditTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" clearable placeholder="地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery('form')">查询</el-button>
          <el-button type="primary" @click="handleExportClick()">导出</el-button>
        </el-form-item>
      </el-col>
    </el-form>

    <!--列表-->
    <el-col :span="24" class="" style="padding-bottom: 0px;margin-top: 0;">
      <el-table :data="listData"  :fit="tableFit" highlight-current-row border   style="width: 100%;">
        <el-table-column prop="txId" label="订单号" width="160" align="center">
        </el-table-column>
        <el-table-column prop="uid" label="UID" width="40" align="center">
        </el-table-column>
        <el-table-column prop="walletType" label="币种" width="40"  align="center" :formatter="walletTypeFormatter">
        </el-table-column>
         <el-table-column prop="address" label="用户钱包" width="160" align="center" >
        </el-table-column>
         <el-table-column prop="address" label="热钱包" width="80" align="center" :formatter="baseTypeFormatter">
        </el-table-column>
         <el-table-column prop="transMomey" label="提币申请数量" width="80" lign="right" :formatter="namberFormatter">
        </el-table-column>
         <!-- <el-table-column prop="address" label="认证级别" width="160" align="center" >
                 </el-table-column> -->
        <el-table-column prop="successMoney" label="提币数量" width="80" align="right" :formatter="namberFormatter">
        </el-table-column>
        <el-table-column prop="successGas" label="区块手续费" width="80" align="right" :formatter="namberFormatter">
        </el-table-column>
        <el-table-column prop="auditType" label="打币方式" width="60"  align="center" :formatter="auditTypeFormatter">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="60"  align="center" :formatter="statusFormatter"  >
        </el-table-column>
         <el-table-column prop="addtime" label="申请时间" width="120" align="center" :formatter="tableTimeFormatter">
        </el-table-column>
         <el-table-column prop="transTime" label="打币时间" width="120" align="center" :formatter="tableTimeFormatter">
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template  slot-scope="scope"> 
           <el-button size="small" @click="handleDetailClick(scope.$index, scope.row)" 
            :style="{display: scope.row.status!=0?'inline-block':'none'}">查看</el-button>
            <el-button size="small" @click="handleTransClick(scope.$index, scope.row)" 
            :style="{display: scope.row.status==0?'inline-block':'none'}" :disabled="roleId==3">打币</el-button> 
          </template>
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
        roleId:null,
        tableFit:false,
        labelPosition:'left',
        dataRange:'',
        listTotal:0,//  列表数据总量
        exportNumber:10,
        walletAddressListByPlat:[],
        //查询集合
        form:{
          uid:'',
          api_method:'WalletTransOutList', 
          trans_id:null,//交易id 订单号 
          book_address:null,//提币地址
          wallet_type:null, //币种 钱包类型
          audit_type:null,//打币方式
          trans_locked:null,//启用状态
          addtime_begin:null,//开始时间
          addtime_end:null,//结束时间
          page_number:1,//表格当前页
          page_size:10
        },
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
        //0 添加(待审核)1 成功 2 待发送 3 已发送 4 已审核 5 审核拒绝
        statusList:[
          {
            value:null,
            label:'全部'
          },
          {
            value:0,
            label:'添加(待审核)'
          },
          {
            value:1,
            label:'成功'
          },
          {
            value:2,
            label:'待发送'
          },
          {
            value:3,
            label:'已发送'
          },
          {
            value:4,
            label:'已审核'
          },
          {
            value:5,
            label:'审核拒绝'
          }
        ],
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
         //打币方式  选择器数据
        auditTypes:[
          {
            value:null,
            label:'全部'
          },
          {
            value:2,
            label:'人工'//使用
          },
          {
            value:1,
            label:'自动'//锁定
          }
        ],

        //列表
        listData:[]
      }
    },
    mounted(){
       this.roleId = sessionStorage.getItem('BITKER_ROLE_ID');
      this.query();
      this.setWalletAddressListByPlat();
      this.setwalletTypeList();
    },
    methods: {
      //input change事件
      inputChange(v){
      },
      //选择时间范围
      selectDate(dateRange){
        let dr = {
          addtime_begin:dateRange?dateRange[0]/1000:null,
          addtime_end:dateRange?dateRange[1]/1000:null
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
        return cellValue.toFixed(8);
      },
      auditTypeFormatter(row, column, cellValue, index){
        for(let item of this.auditTypes){
          if(item.value == cellValue){
            return item.label;
          }
        }
      },
      statusFormatter(row, column, cellValue, index){
        for(let item of this.statusList){
          if(item.value == cellValue){
            return item.label;
          }
        }
      },
      baseTypeFormatter(row, column, cellValue, index){
        //console.log('cellValue',cellValue);
        for(let item of this.walletAddressListByPlat){
          if(item.walletAddress == cellValue){
            for(let btItem of this.baseTypes){
              if(btItem.value == item.baseType){
                return btItem.label;
              }
            }
            
          }
        }
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
      //详情查看
      handleDetailClick(index,row){
        //console.log('index',index);
        //console.log('row',row.id);
        this.$router.push({ path: '/WalletTransOutDetail', query: { id: row.id } });
      },
      //打币 提币放行
      handleTransClick(index,row){
        //console.log('index',index);
        //console.log('row',row.id);
        this.$router.push({ path: '/WalletTransOutModify', query: { id: row.id } });
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
        params.api_method = 'WalletTransOutListExp';
        params.page_number = 1;
        params.page_size = this.exportNumber;
        exportApi(params).then((res) => {
         if(res){
            this.form.api_method = 'WalletTransOutList'; 
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