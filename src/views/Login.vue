<template>
  <div class="login-bg">
    <el-form :model="form" :rules="validRules" ref="form" label-position="left" label-width="80px" class="demo-ruleForm login-container">
      <img class='logo' src="../assets/99.png"> <h3 class="title">WALLET</h3>
      <el-form-item prop="username" label="用户名">
        <el-input type="text" v-model="form.username"  placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password" v-model="form.password"  placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item prop="phone" label="手机号码">
        <el-input type="text" v-model="form.phone"  placeholder="手机号码"></el-input>
      </el-form-item>
      <el-form-item prop="checkCode" label="验证码">
        <el-col :span="14" >
          <el-input type="text" v-model="form.checkCode"  placeholder="验证码"></el-input>
        </el-col>
        <el-col :span="10" style="text-align: right;">
          <el-button @click.native.prevent="handleGetCheckCode" :disabled="getCheckCodeDisabled">{{getCheckCodeBtn}}</el-button>
        </el-col>
      </el-form-item>
      <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
      <el-form-item style="width:100%" label-width="0px">   
        <el-button type="primary" style="width:100%;"   @click.native.prevent="handleLogin"  @keyup.native="keyupLogin($event)"    :loading="logining">登录</el-button>
        <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
 import { requestApi } from '../api/axios.js';
  export default {
    data() {
      return {
        logining: false,
        getCheckCodeBtn:'获取验证码',
        seconds:1000, 
        getCheckCodeDisabled:false,
        form: {
          api_method:'WalletAdminUserLogin',
          username: '',
          password: '',
          phone:'',
          checkCode:''
        },
        validRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'change' },
            //{ validator: validaePass }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'change' },
            //{ validator: validaePass2 }
          ],
          phone: [
            { required: true, message: '请输入手机号码', trigger: 'change' },
            //{ validator: validaePass2 }
          ],
          checkCode: [
            { required: true, message: '请输入验证码', trigger: 'change' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      /*handleReset2() {
        this.$refs.form.resetFields();
      },*/
      handleGetCheckCode(ev){
        let _this = this;
        let getCheckCode = {api_method:'WalletAdminUserGetCheckCode',phone:_this.form.phone,check_type:'TYPE_LOGIN'}; 
        requestApi(getCheckCode).then(response => {
          let { msg, status } = response;
          if (status !== '200') {
            this.$message({
              message: msg,
              type: 'error'
            });
          } else {
            this.$message({
              message: msg,
              type: 'success'
            });
            let second = 59;
            //修改发送验证码按钮
            let Time = window.setInterval(()=>{
              
              if(second > 0){
                _this.getCheckCodeBtn = `${second}s后再次发送`;
                _this.getCheckCodeDisabled = true;
                second --;
              }
              else{
                 _this.getCheckCodeBtn = '获取验证码';
                 _this.getCheckCodeDisabled = false;
                 window.clearInterval(Time);
              }
            },_this.seconds);
          }
        });
      },
      keyupLogin(ev) {
        if(ev.keyCode==13){
         this.handleLogin();
        }
      },
      handleLogin(ev) {
        let _this = this;
        this.$refs.form.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            //NProgress.start();
            requestApi(_this.form).then(response => {
              this.logining = false;
              //NProgress.done();
              let { msg, status, data ,roleId} = response;
              if (status !== '200') {
                this.$message({
                  message: msg,
                  type: 'error'
                });
              } else {
                sessionStorage.setItem('BITKER_ROLE_ID', JSON.stringify(roleId));
                sessionStorage.setItem('BITKER_WALLET_USER', JSON.stringify(data));
                _this.$router.push({ path: '/UserChargeAddressList' });
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-bg{
    width: 100%;
    height: 100%;
    background: url(../assets/bg.png) no-repeat center 0;
    .logo{
      width: 84px;
      height: 20px;
      position: relative;
      top: 22px;
      left: 100px;
    }
  }
  .login-container {
    position: relative;
    top: 180px;
    box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin:0  auto;
    width: 400px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
      margin-left: 60px;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>