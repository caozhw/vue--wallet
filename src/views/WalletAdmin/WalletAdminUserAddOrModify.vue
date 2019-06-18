<template>
  <div>
    <section>
       <h3>{{ADD?'新增管理员':'编辑管理员'}}</h3>


      <el-form :model="form" status-icon :rules="rules2" ref="form" label-width="100px" class="demo-ruleForm-f">
        <el-form-item label="用户名" prop="username">
          <el-input v-model.number="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="re_password">
          <el-input type="password" v-model="form.re_password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model.number="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realname">
          <el-input v-model.number="form.realname"></el-input>
        </el-form-item>
        <el-form-item label="角色选择" prop="role_id">
          <el-select v-model="form.role_id" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in roleListData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="启用状态" prop="status"  v-if="!ADD">
            <template>
              <el-radio v-model="form.status" label='1' @change="statusChange">启用</el-radio>
              <el-radio v-model="form.status" label='0' @change="statusChange">停用</el-radio>
            </template>
        </el-form-item>
       <!--  <el-form-item label="年龄" prop="age">
         <el-input v-model.number="form.age"></el-input>
       </el-form-item> -->
        <el-form-item style="text-align:right">
          <el-button type="primary" @click="submitForm('form')">保存</el-button>
          <el-button @click="handleBack">返回</el-button>
        </el-form-item>
      </el-form> 


    </section>



   
  </div>
</template>
<script>
  import { requestApi } from '../../api/axios.js';
  import util from '../../util.js';
  export default{
    data:function(){


     /* var checkAge = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('不能为空'));
          }
          setTimeout(() => {
            if (!Number.isInteger(value)) {
              callback(new Error('请输入数字值'));
            } else {
              if (value < 18) {
                callback(new Error('必须年满18岁'));
              } else {
                callback();
              }
            }
          }, 1000);
        };*/

      var noVolid = (rule, value, callback) => {
          callback();
          
        }; 

      var checkUsername = (rule, value, callback) => {
        let usernameReg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
        let isUsername = usernameReg.test(value);
          if (!value) {
            return callback(new Error('用户名不能为空'));
          }
          
          if(!isUsername){
             callback(new Error('用户名长度输入控制在20位字符以内，不可输入空格及特殊字符'));
          }
          if ((value+'').length > 20) {
            callback(new Error('用户名长度输入控制在20位字符以内，不可输入空格及特殊字符'));
          } 

          else {
            callback();
          }
        };

      var checkPhone = (rule, value, callback) => {
        let phoneReg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
        let isPhone = phoneReg.test(value);
          if (!value) {
            return callback(new Error('手机号不能为空'));
          }
          if (!isPhone) {
            return callback(new Error('请输入正确的手机号'));
          }else{
            callback();
          }
          /*setTimeout(() => {
            if (!phoneReg.test(value)) {
              callback(new Error('请输入正确的手机号'));
            } else {
              if (value < 18) {
                callback(new Error('必须年满18岁'));
              } else {
                callback();
              }
            }
          }, 1000);*/
        };
      var checkRealname = (rule, value, callback) => {
         /* if (!value) {
            return callback(new Error('真不能为空'));
          }*/
          setTimeout(() => {
     
            if ((value+'').length > 20) {
              callback(new Error('真实姓名长度控制在20个字符以内'));
            } else {
              callback();
            }

          }, 1000);
        };
      var validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'));
          } else {
            if (this.form.re_password !== '') {
              this.$refs.form.validateField('re_password');
            }
            callback();
          }
        };
      var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.form.password) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        }


      return{
        ADD:true,

        roleListTotal:0,
        roleForm:{
          api_method:'WalletAdminRoleList',
          role_value:null,//角色
          page_number:1,//表格当前页
          page_size:10
        },
        roleListData:[],


        form:{
          api_method:'WalletAdminUserAddOrModify',
          id:null,
          username:'',
          role_id:'',
          password:'',
          re_password:'',
          status:'1',
          phone:'',
          realname:'',
        },


        
        rules2: {
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          re_password: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          /*age: [
            { validator: checkAge, trigger: 'blur' }
          ],*/
          realname:[
            { validator: checkRealname, trigger: 'blur' }
          ],
          phone:[
            { validator: checkPhone, trigger: 'blur' }
          ],
         username:[
           { validator: checkUsername, trigger: 'blur' }
          ],
        },






      }
    },
    methods:{


       submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.handleSave();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },


     /* handleRealnameFocus(e){
       
        console.log(e)
        
      },*/

      statusChange(v){
        //console.log(v);
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
        let params = {api_method:'WalletAdminUserList',phone:this.$route.query.phone};
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
              this.form.username = data[0].username;
              this.form.realname = data[0].realname;
              this.form.phone = data[0].phone;
              this.form.status = data[0].status+'';
              this.form.role_id = data[0].roleId;
              this.form.id = data[0].id;
            }
            //console.log(res);
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
            this.form.role_id = 1;
            this.roleListData = data;
            this.roleListTotal = total;
          }
          console.log(res);
        }).catch(() => {
        });
      },
    },
    mounted(){
      this.roleQuery();
      if(this.$route.query.phone){
        this.ADD = false;
        this.form.phone = this.$route.query.phone;
        this.getDetail(); 

        var noVolid = (rule, value, callback) => {
          callback();
        }; 
        this.rules2.password =  [{ validator: noVolid, trigger: 'blur' }];
        this.rules2.re_password =  [{ validator: noVolid, trigger: 'blur' }];

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

  .demo-ruleForm-f{
    width: 1000px;
    background: #f2f4f8;
    padding: 25px;
  }

 .demo-ruleForm-f .el-input {
    width: 40%;
}
.demo-ruleForm-f .el-form-item__label{
  font-weight: bold;
}

</style>