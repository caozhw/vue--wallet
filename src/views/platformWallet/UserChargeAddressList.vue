<template>
  <section>
    <!--工具条-->
    <el-form :model="form" ref="form"  :inline="true"  :label-position="labelPosition" label-width="80px" >
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;margin-bottom: 0;min-width:1080px">
        <!-- <el-form-item label="UID"  prop="uid" :rules="[{type: 'number', message: 'uid必须为数字'}]">
          <el-input v-model.number="form.uid"   placeholder="用户ID"></el-input>
        </el-form-item> -->
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
      </el-col>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;margin-top: 0;">
        <el-form-item label="地址">
          <el-input v-model="form.wallet_address" clearable placeholder="地址"></el-input>
        </el-form-item>
        <el-form-item label="启用状态">
          <el-select v-model="form.trans_locked" placeholder="全部">
            <el-option
              v-for="item in transLockeds"
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

    <!--列表-->
    <el-col :span="24" class="" style="padding-bottom: 0px;margin-top: 0;">
      <el-table :data="listData"  :fit="tableFit" highlight-current-row border   style="width: 100%;">
        <el-table-column prop="uid" label="UID" width="80" align="center" :formatter="uidFormatter">
        </el-table-column>
        <el-table-column prop="walletType" label="币种" width="80"  align="center" :formatter="walletTypeFormatter">
        </el-table-column>
        <el-table-column prop="walletAddress" label="充币地址" width="360" align="center">
        </el-table-column>
        <el-table-column prop="addtime" label="生成时间" width="120" align="center" :formatter="tableTimeFormatter">
        </el-table-column>
        <el-table-column prop="bindTime" label="绑定时间" width="120" align="center" :formatter="tableTimeFormatter">
        </el-table-column>
        <el-table-column prop="transLocked" label="启用状态" width="80" align="center" :formatter="transLockedFormatter">
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template  slot-scope="scope">
            <el-button size="small" @click="handleDetailClick(scope.$index, scope.row)">查看</el-button>
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
        tableFit:false,
        labelPosition:'left',
        dataRange:'',
        listTotal:0,//  列表数据总量
        //查询集合
        form:{
          api_method:'WalletAddressList', 
          uid:null,//用户id
          wallet_address:null,
          wallet_type:null, //币种 钱包类型
          trans_locked:null,//启用状态
          bind_time_begin:null,//开始时间
          bind_time_end:null,//结束时间
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
        //walletTypeList:[],

        //用户充币地址列表
        listData:[
         /* {
            uid:0,
            walletType:2,
            walletAddress:"0xMGE4MzgzMjQ5MDc2OWM4NmQ4ZDE4NTQ1YWQ3MmZlZTZlZmJjMTI5NA==",
            addtime:1522373051,
            bindTime:1522373051,
            transLocked:0
          }*/

        ]

      }
    },
    mounted(){
      this.query();
      this.setwalletTypeList();
      //console.log('formatDate',util.formatDate.format(new Date()));  
    },
    methods: {
      //input change事件
      inputChange(v){

        //console.log('v',v);
        //console.log('this.form.uid',this.form.uid);
      },
      //选择时间范围
      selectDate(dateRange){
        //console.log(dateRange);
        let dr = {
          bind_time_begin:dateRange?dateRange[0]/1000:null,
          bind_time_end:dateRange?dateRange[1]/1000:null
        };
        Object.assign(this.form,dr);
        //console.log(this.form.bind_time_begin);
        //
        /*let dr ={};
        if(dateRange){
          dr = {
            bind_time_begin:dateRange[0]/1000,
            bind_time_end:dateRange[1]/1000
          };
        }else{
           dr = {
            bind_time_begin:0,
            bind_time_end:0
          };
        }*/
      },
      uidFormatter(row, column, cellValue, index){
        if(cellValue == '0'){
          return '--';
        }
        
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
      transLockedFormatter(row, column, cellValue, index){
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
      //详情查看
      handleDetailClick(index,row){
        //console.log('index',index);
        //console.log('row',row.id);
        this.$router.push({ path: '/WalletAddressDetail', query: { id: row.id } });
      },
      query(){
       // let formString = JSON.stringify(this.form);
        //let formJson = JSON.parse(formString);
        //console.log('query_form',JSON.stringify(this.form));
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
            console.log(this.listData)
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