<template>
  <div>
    <section>
       <h3>{{ADD?'新增币种':'修改币种'}}</h3>
       <el-row class="detail-row">
        <el-col :span="4" class="detail-label">币种</el-col>
        <el-col :span="10" class="detail-value">
          <el-input v-model="form.walletShortEn" clearable disabled></el-input>
        </el-col>
       
      </el-row>
      <el-row class="detail-row">
        <el-col :span="4" class="detail-label">最小提币数量</el-col>
        <el-col :span="10" class="detail-value">
           <el-input v-model="form.cash_min_number" clearable ></el-input>
        </el-col>
      
      </el-row>
      <el-row class="detail-row">
        <el-col :span="4" class="detail-label">提币权限</el-col>
        <el-col :span="10" class="detail-value">
          <template>
            <el-radio v-model="form.status" label='1' @change="statusChange">开启</el-radio>
            <el-radio v-model="form.status" label='0' @change="statusChange">关闭</el-radio>
          </template>
        </el-col>
      </el-row>
      <el-row class="detail-row" style="background:#fff;text-align:right">
        <el-col :span="24" class="detail-btn">
            <el-button type="" @click="handleBack">返回</el-button>
            <el-button type="primary" @click="handleSave">保存</el-button>
        </el-col>
      </el-row>
    </section> 

   
  </div>
</template>
<script>
  import { requestApi } from '../../api/axios.js';
  import util from '../../util.js';
  export default{
    data:function(){
      return{
        ADD:true,
        form:{
          api_method:'WalletTypeModify',
          id:'',
          cash_min_number:'',
          save_days:'',
          status:'1',
          walletShortEn:''
        }
      }
    },
    methods:{
      statusChange(v){
        console.log(v);
        this.form.status = v;
      },
      handleSave(){
        var _this = this;
        this.$confirm('是否确认设置?', '设置确认', {
          //center: true
          //type: 'warning'
        }).then(() => {
          _this.save();
        }).catch(() => {
        });
      },
      save(){
        requestApi(this.form).then((res) => {
        //console.log(res);
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
              message: '设置成功',
              type: 'success'
            });
          } 
        }).catch(() => { 
        });
      },
      //返回
      handleBack(){
        this.$router.go(-1);
      },
      getDetail(){
        let params = {api_method:'WalletTypeDetail',id:this.$route.query.id};
        requestApi(params).then((res) => {
         // console.log(res);
          let {msg,status,data} = res;
            if(status !== '200'){
              this.$message({
                message: msg,
                type: 'error'
              });
              if(status == '211'){
                this.$router.push({ path: '/login'}); 
              }
            }else{
              this.form.walletShortEn = data.walletShortEn;
              this.form.cash_min_number = data.cashMinNumber;
              this.form.status = data.status+'';
            }
            //console.log(res);
        }).catch(() => { 
        });
      }
    },
    mounted(){
      if(this.$route.query.id){
        this.ADD = false;
        this.form.id = this.$route.query.id;
        this.getDetail();  
      }else{
        this.ADD = true;
      } 
    }
  }
</script>

<style>
  .detail-row{
    min-width:680px;
    width:1000px;
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
    min-width:200px;
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