<template>
  <section>
    <!--工具条-->
    <el-form :model="form" ref="form"  :inline="true"  :label-position="labelPosition" label-width="80px" >
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;margin-bottom: 0;min-width:1080px">
        <el-form-item label="UID" >
          <el-input v-model="form.uid" clearable @change="inputChange"  placeholder="用户ID"></el-input>
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
        <el-form-item label="地址">
          <el-input v-model="form.wallet_address" clearable placeholder="地址"></el-input>
        </el-form-item>
        <el-form-item label="绑定时间">
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

    <!--列表-->
    <el-col :span="24" class="" style="padding-bottom: 0px;margin-top: 0;">
      <el-table :data="listData"  :fit="tableFit" highlight-current-row border   style="width: 100%;">
        <el-table-column prop="uid" label="UID" width="80" align="center">
        </el-table-column>
        <el-table-column prop="walletType" label="币种" width="80"  align="center" :formatter="walletTypeFormatter">
        </el-table-column>
        <el-table-column prop="walletAddress" label="提币地址" width="360" align="center">
        </el-table-column>
        <el-table-column prop="addtime" label="绑定时间" width="120" align="center" :formatter="tableTimeFormatter">
        </el-table-column>
        <el-table-column  label="启用状态" width="160" align="center" >
         <template  slot-scope="scope"> 
            <span :style="{display: scope.row.id!=TableRadioId?'inline-block':'none'}">{{transLockedFormatter(scope.row.transLocked)}}</span>
            <el-radio-group v-model="scope.row.transLocked" :style="{display: scope.row.id==TableRadioId?'block':'none'}" >
              <el-radio :label="0" @change="transLockedChange(scope.row,0)">开启中</el-radio>
              <el-radio :label="1" @change="transLockedChange(scope.row,1)">关闭</el-radio>
            </el-radio-group>
         </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
         <!--  <template scope="scope" slot-scope="scope">
           
         </template> -->
          <template  slot-scope="scope"> 
           <el-button size="small" @click="handleTableRadioShow(scope.$index, scope.row)" 
            :style="{display: scope.row.id!=TableRadioId?'inline-block':'none'}" :disabled="roleId==3">设置状态</el-button> 
            <el-button size="small" @click="handleTableRadioSave(scope.$index, scope.row)" 
            :style="{display: scope.row.id==TableRadioId?'inline-block':'none'}">保存</el-button> 
            <el-button size="small" @click="handleTableRadioConcel(scope.$index, scope.row)" 
            :style="{display: scope.row.id==TableRadioId?'inline-block':'none'}">取消</el-button> 
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
  import { requestApi } from '../../api/axios.js';
  import util from '../../util.js';
  export default{
    data:function(){
      return{
        roleId:null,
        tableFit:false,
        labelPosition:'left',
        dataRange:'',
        listTotal:0,//  列表数据总量
        TableRadioId:-1,
        transLocked:0,
        saveTransLocked:0,
        //查询集合
        form:{
          api_method:'WalletAddressBookList', 
          uid:null,//用户id
          wallet_address:null,
          wallet_type:null, //币种 钱包类型
          trans_locked:null,//启用状态
          addtime_begin:null,//开始时间
          addtime_end:null,//结束时间
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

        //用户提币地址列表
        listData:[]
      }
    },
    mounted(){
      this.roleId = sessionStorage.getItem('BITKER_ROLE_ID');
      this.query();
      this.setwalletTypeList(); 
    },
    methods: {
      //input change事件
      inputChange(v){
      },
      //表格单选显示
      handleTableRadioShow(index,row){

         //console.log('index',index);
        this.TableRadioId = row.id;
        this.saveTransLocked = row.transLocked;
      },
      //单选点击
      transLockedChange(row,v){
        this.saveTransLocked = v;
        //this.TableRadioId = v;
      },
      handleTableRadioSave(row,v){
        let _this = this;
        let params = { api_method:'WalletAddressBookModify',id:this.TableRadioId,trans_locked:this.saveTransLocked};
        this.$confirm('是否设置状态?', '设置状态', {
          //center: true
          //type: 'warning'
        }).then(() => {
          _this.setTransLocked(params);
        }).catch(() => {
        }); 
      },
      handleTableRadioConcel(row,v){
        this.TableRadioId = -1;
        this.query();
      },
      setTransLocked(params){
        //let transLocked = row.transLocked;
        requestApi(params).then((res) => {
          console.log(res)
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
            this.$message({
              message: msg,
              type: 'success' 
            });
            this.query();
            this.TableRadioId = -1;
           //row.transLocked = transLocked;
          }
        }).catch(() => {
        });
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
      tableTimeFormatter(row, column, cellValue, index){
        if(cellValue == 0){return '--';}
        let cellTime =new Date(parseInt(cellValue) * 1000);
        return util.formatDate.format(cellTime);
        //return cellValue
      },
      transLockedFormatter(cellValue){
        for(let item of this.transLockeds){
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