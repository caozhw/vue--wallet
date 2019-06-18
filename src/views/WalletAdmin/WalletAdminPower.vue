<!--系统转账记录-->
<template>
  <section>
    <!--工具条-->
    <!--管理员 查询-->
    <el-form :model="form" ref="form"  :inline="true"  :label-position="labelPosition" label-width="80px" >
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;min-width:1080px"  v-if="biz_type==1">
        <el-form-item label="账号" >
          <el-input v-model="form.username" clearable  placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item label="姓名" >
          <el-input v-model="form.realname" clearable  placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" >
          <el-input v-model="form.phone" clearable  placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option
              v-for="item in statusTypes"
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
  <!--角色管理 查询-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;" v-if="biz_type==2">
        <el-form-item label="角色" >
          <el-input v-model="roleForm.role_value" clearable placeholder="角色"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRoleQuery('form')">查询</el-button>
        </el-form-item>
      </el-col>
    </el-form>
    <!--tab 切换-->
    <el-col :span="22" class="" style="padding-bottom: 0px;margin-top: 20px;">
      <template >
        <el-tabs v-model="biz_type" type="card" @tab-click="handleTabClick">
          <el-tab-pane label="管理员"  name="1"></el-tab-pane>
          <el-tab-pane label="角色管理"  name="2"></el-tab-pane>
          <!-- <el-tab-pane label="热钱包手续费转账记录"  name="3"></el-tab-pane> -->
        </el-tabs>
      </template>
      
    </el-col>
    <el-col :span="2" class="" style="padding-bottom: 0px;margin-top: 20px;text-align:right" v-if="biz_type==1">
     <el-button type="primary"  plain @click="handleAdd">新增管理员</el-button> 
    </el-col>
    <!--列表 fromBookAddress  管理员-->
    <el-col :span="24" class="" style="padding-bottom: 0px;margin-top: 0;" v-if="biz_type==1">
      <el-table :data="listData"  :fit="tableFit" highlight-current-row border   style="width: 100%;" v-if="biz_type==1">
        <el-table-column prop="id" label="ID" width="80" align="center">
        </el-table-column>
        <el-table-column prop="username" label="账号" width="80"  align="center" >
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80" align="center" :formatter="statusFormatter">
        </el-table-column>
        <el-table-column prop="realname" label="真实姓名" width="80" align="center">
        </el-table-column>
         <el-table-column prop="phone" label="手机号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="roleId" label="角色" width="80" align="center" :formatter="roleFormatter">
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template  slot-scope="scope">
            <el-button size="small" @click="handleEditClick(scope.$index, scope.row)">编辑</el-button>
            <!-- <el-button size="small" >删除</el-button> -->
          </template>
        </el-table-column>
       
       
      </el-table>
    </el-col>
    <!--分页 :page-size="10"  :page-sizes="[10, 20, 30, 40]"-->
    <el-col :span="24" class="toolbar" style="background-color:#fff" v-if="biz_type==1">
      <el-pagination v-if="biz_type==1"
        @current-change="handleCurrentChange"
        :current-page="form.page_number"
        layout="prev, pager, next, total, jumper"
        :total="listTotal">
      </el-pagination>  
    </el-col>


     <!--列表 fromBookAddress 角色管理-->
    <el-col :span="24" class="" style="padding-bottom: 0px;margin-top: 0;" v-if="biz_type==2">
      <el-table :data="roleListData"  :fit="tableFit" highlight-current-row border   style="width: 100%;"  v-if="biz_type==2">
        <el-table-column prop="id" label="角色ID" width="80" align="center">
        </el-table-column>
        <el-table-column prop="value" label="角色" width="80"  align="center" >
        </el-table-column>
        <el-table-column prop="name" label="角色名称" width="80" align="center">
        </el-table-column>
        <el-table-column prop="description" label="描述" width="80" align="center">
        </el-table-column>
      </el-table>
    </el-col>
    <!--分页 :page-size="10"  :page-sizes="[10, 20, 30, 40]"-->
    <el-col :span="24" class="toolbar" style="background-color:#fff" v-if="biz_type==2">
      <el-pagination  v-if="biz_type==2"
        @current-change="handleRoleCurrentChange"
        :current-page="roleForm.page_number"
        layout="prev, pager, next, total, jumper"
        :total="roleListTotal">
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
        exportNumber:10,
        biz_type:"1",//页签类型
        
        //查询集合  管理员
        form:{
          api_method:'WalletAdminUserList',
          username:null,//用户名 
          realname:null,//真实姓名
          status:null,//0：停用 1：启用
          phone:null, //手机号
          page_number:1,//表格当前页
          page_size:10
        },
         //列表
        listData:[],

        roleListTotal:0,
        roleForm:{
          api_method:'WalletAdminRoleList',
          role_value:null,//角色
          page_number:1,//表格当前页
          page_size:10
        },
        roleListData:[],
        //类型 选择器数据
        statusTypes:[
          {
            value:null,
            label:'全部'
          },
          {
            value:1,
            label:'启用'
          },
          {
            value:0,
            label:'停用'
          }
          
        ],
        

       
      }
    },
    mounted(){
      this.query();
      
      this.roleQuery();
    },
    methods: {

      handleAdd(){
        this.$router.push({ path: '/WalletAdminUserAddOrModify'});
      },
      handleEditClick(index,row){

       this.$router.push({ path: '/WalletAdminUserAddOrModify', query: { phone: row.phone } });

      },


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
      tableTimeFormatter(row, column, cellValue, index){
        if(cellValue == 0){return '--';}
        let cellTime =new Date(parseInt(cellValue) * 1000);
        return util.formatDate.format(cellTime);
        //return cellValue
      },
      statusFormatter(row, column, cellValue, index){
        //console.log('cellValue',cellValue);
        for(let item of this.statusTypes){
          if(item.value == cellValue){
            return item.label;
          }
        }
      },
      roleFormatter(row, column, cellValue, index){
        //console.log('cellValue',cellValue);
        for(let item of this.roleListData){
          if(item.id == cellValue){
            return item.name;
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
      //角色管理 查询
      handleRoleQuery(form){
        this.roleForm.page_number = 1;
        this.$refs[form].validate((valid) => {
          if (valid) {
           this.roleQuery();   
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //分页查询
      handleCurrentChange(val) {
        this.form.page_number = val;
        this.query();
        //this.getUsers();
      },
      // 角色管理 分页
      handleRoleCurrentChange(val) {
        this.roleForm.page_number = val;
        this.roleQuery();
        //this.getUsers();
      },
      //tab类型查询
      handleTabClick(tab,event) {
        if(this.biz_type == '1'){
          this.query();
        }
        if(this.biz_type == '2'){
          this.roleQuery();
        }
        //this.setwalletTypeList();
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
            if(status == '211'){
              this.$router.push({ path: '/login'}); 
            }
          }else{
            data.sort(function(x,y){
              var rx = isNaN(x.id)?0:x.id, ry = isNaN(y.id)?0:y.id;
              return rx - ry;
            });  
            this.listData = data;
            this.listTotal = total;

          

          }
          console.log(res);
        }).catch(() => {
        });
      },
      roleQuery(){
        //this.form.biz_type = parseInt(this.form.biz_type);
        requestApi(this.roleForm).then((res) => {
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
            data.sort(function(x,y){
              var rx = isNaN(x.id)?0:x.id, ry = isNaN(y.id)?0:y.id;
              return rx - ry;
            });  
            this.roleListData = data;
            this.roleListTotal = total;
          }
          console.log(res);
        }).catch(() => {
        });
      },



     
      //设置系统钱包列表 热钱包
     /* setwalletTypeList(){ 
        let walletTypeList = sessionStorage.getItem('WalletTypeList');
        this.walletTypes = JSON.parse(walletTypeList);
        this.walletTypes.unshift({walletType:null,walletShortEn:'全部'});
      }  */ 
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