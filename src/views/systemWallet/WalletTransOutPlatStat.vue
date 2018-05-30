<!--系统转账统计-->
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
         <el-form-item label="转出账户">
          <el-select v-model="form.address_id" placeholder="请选择">
            <el-option
              v-for="item in addressSelect"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="转入账户">
          <el-select v-model="form.to_address_id" placeholder="请选择">
            <el-option
              v-for="item in addressSelect"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;margin-top: 0;">
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
      </el-col>
    </el-form>

    <el-col :span="24" class="" style="padding-bottom: 0px;margin-top: 20px;">
      <template>
        <el-tabs v-model="form.biz_type" type="card" @tab-click="handleTabClick">
          <el-tab-pane label="日统计表"  name="0"></el-tab-pane>
          <el-tab-pane label="月统计表"  name="1"></el-tab-pane>
        </el-tabs>
      </template>
    </el-col>
    <!--列表 fromBookAddress-->
    <el-col :span="24" class="" style="padding-bottom: 0px;margin-top: 0;">
      <el-table :data="listData"  :fit="tableFit" highlight-current-row border   style="width: 100%;">
        <el-table-column prop="d" label="日期" width="120" align="center" >
        </el-table-column>
        <el-table-column prop="wallet_type" label="币种" width="80"  align="center" :formatter="walletTypeFormatter">
        </el-table-column>
        <el-table-column prop="address_id" label="转出账户" width="80" align="center" :formatter="baseTypeTableFormatter">
        </el-table-column>
        <el-table-column prop="to_address_id" label="转入账户" width="80" align="center" :formatter="baseTypeTableFormatter">
        </el-table-column>
        <el-table-column prop="c" label="转账笔数" width="80" align="right" :formatter="namberFormatter"> 
        </el-table-column>
        <el-table-column prop="sumSuccessMoney" label="转账总数" width="80"  align="right" :formatter="namberFormatter">
        </el-table-column>
        <el-table-column prop="sumSuccessGas" label="转账手续费" width="80"  align="right" :formatter="namberFormatter">
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
          api_method:'WalletTransOutPlatStat',
          wallet_type:null, //币种 钱包类型
          to_address_id:null,//转入账户
          address_id:null,//转出账户
          trans_time_begin:null,//开始时间
          trans_time_end:null,//结束时间
          biz_type:'0',
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

        addressSelect:[],

        //列表
        listData:[],
        walletAddressListByPlat:[],
      }
    },
    mounted(){
      this.query();
      this.setWalletAddressListByPlat();
      this.setwalletTypeList();
      this.SelectFormatter();
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
      namberFormatter(row, column, cellValue, index){
        return cellValue.toFixed(8);
      },
      //select
      SelectFormatter(){
        let arr = [];
        arr.push({id:'',baseType:'',label:'全部'});
        for(let item of this.walletAddressListByPlat){
          let obj = {};
          obj.id = item.id;
          for(let btItem of this.baseTypes){
            if(btItem.value == item.baseType){
              obj.baseType = item.baseType;
              obj.label = btItem.label;
              arr.push(obj);
            }
          } 
        }
        this.addressSelect = arr;
        //console.log(arr);
      },
      //table
      baseTypeTableFormatter(row, column, cellValue, index){
        for(let item of this.walletAddressListByPlat){
          if(item.id == cellValue){
            for(let btItem of this.baseTypes){
              if(btItem.value == item.baseType){
                return btItem.label;
              }
            } 
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
      //分页查询
      handleCurrentChange(val) {
        this.form.page_number = val;
        this.query();
        //this.getUsers();
      },
      handleTabClick(tab,event) {
         this.query();
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
      setWalletAddressListByPlat(){ 
        let walletAddressListByPlat = sessionStorage.getItem('WalletAddressListByPlat');
        this.walletAddressListByPlat = JSON.parse(walletAddressListByPlat);
        console.log('this.walletAddressListByPlat',this.walletAddressListByPlat)
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