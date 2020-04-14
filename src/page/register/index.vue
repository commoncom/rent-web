<template>
  	<div class="home_container">
        <itemcontainer father-component="home"></itemcontainer>
        <!--登录-->
        <div id="bg" class="bg">
          <div class="login">
              <div class="logo">系统注册界面</div>
              <el-form>
                 <el-form-item label="用户名" class="form-size">
                    <el-input type="text" id="name" v-model="userInfo.userName" @blur="inputBlur('name',userInfo.userName)"></el-input>
                    <p>{{userInfo.nameErr}}</p>
                </el-form-item>
                 <el-form-item label="用户ID" class="form-size">
                    <el-input type="text" id="userId" v-model="userInfo.userId" @blur="inputBlur('userId',userInfo.userId)"></el-input>
                    <p>{{userInfo.idErr}}</p>
                </el-form-item>
                 <el-form-item label="地址" class="form-size">
                    <el-input type="text" id="addr" v-model="userInfo.addr" @blur="inputBlur('addr',userInfo.addr)"></el-input>
                    <p>{{userInfo.addrErr}}</p>
                </el-form-item>
                <el-form-item label="密码" class="form-size">
                    <el-input type="password" id="pwd" v-model="userInfo.pwd" @blur="inputBlur('pwd',userInfo.pwd)"></el-input>
                    <p>{{userInfo.pwdErr}}</p>
                </el-form-item>
                <el-form-item label="确认密码" class="form-size">
                    <el-input type="password" id="pwd" v-model="userInfo.retpwd" @blur="inputBlur('retpwd',userInfo.retpwd)"></el-input>
                    <p>{{userInfo.retpwdErr}}</p>
                </el-form-item>
                <el-form-item label="身份证号" class="form-size">
                    <el-input type="text" id="idcard" v-model="userInfo.idcard" @blur="inputBlur('idcard',userInfo.idcard)"></el-input>
                    <p>{{userInfo.idcardErr}}</p>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('userInfo')" v-bind:disabled="userInfo.beDisabled">注册</el-button>
                  <el-button @click="resetForm">重置</el-button>
                </el-form-item>
              </el-form>     
            </div>
          <el-dialog :title="regTitle" :visible.sync="dialogFormVisible" :show-close="false">
            <el-form :model="form">
              <el-form-item label="状态" :label-width="formLabelWidth">
                <el-input v-model="form.status"   autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item v-if = "isSus" label="链上Hash" :label-width="formLabelWidth">
                <el-input v-model="form.data"  :readonly="true" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item v-else label="错误原因" :label-width="formLabelWidth">
                <el-input v-model="form.err"  :readonly="true" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="closeBut">确 定</el-button>
            </div>
          </el-dialog>
        </div>
    </div>
</template>
<script>
import itemcontainer from '../../components/itemcontainer'
import axios from 'axios';
import http from 'http';
import {UrlConfig} from 'src/common/js/globe';
import {generateAddress} from 'src/common/js/address';
export default {
	  name: 'register',
  	components: {
  		itemcontainer
  	},
    created(){
        
    },
    data () {
      return {
        userInfo :{
            userName: '',
            userId : '',
            addr: '',
            pwd: '',
            retpwd: '',
            idcard: '',
            nameErr: '',
            idErr: '',
            addrErr: '',
            pwdErr: '',
            retpwdErr: '',
            beDisabled: true
        },
        form: {
           status: '',
           data: '',
           err: ''
        },
        dialogFormVisible: false,
        canClose : false,
        isSus: true, // 注册结果控制
        regSus: false,
        formLabelWidth: '80px',
        regTitle: "注册中，请稍等.....",
        newMap: new Map(),
      }
   },
   methods : {
      closeBut() {
          this.isSus = true;
          this.form = {};
          if (this.canClose) {
              this.dialogFormVisible = false;
              this.canClose = false;
              if (this.regSus) {
                 this.jumpLog();
              }
          }
      },
      jumpLog() {
         this.userInfo = {};
         this.$router.push({path: '/'}); 
      },
      resetForm:function(){
          this.userInfo = {};
      },
      submitForm:function(formInfo){
         console.log(this.userInfo, formInfo)
         if (this.newMap.has(this.userInfo.userId)) {
               this.$notify({title : '提示信息',message : '已经注册过，地址为:'+this.newMap.get(this.userInfo.userId),type : 'error'});
               return false;
          }
          let addr = this.userInfo.addr;
          console.log(addr, this.userInfo.userName)
          let url = UrlConfig.serverUrl+"/register/"+addr+"/"+this.userInfo.userName+"/"+this.userInfo.userId+"/"+this.userInfo.pwd+"/"+this.userInfo.idcard;
          this.dialogFormVisible = true;
          axios.get(url, {}).then(res => {
                this.regTitle = "注册结果";
                console.log("rtn", res.data);
                if(res.data.status) {
                    this.newMap.set(this.userInfo.userId, addr); 
                    this.form.data = res.data.data;
                    this.form.status = "成功";   
                    this.regSus = true;            
                } else {
                    this.form.status = "失败"; 
                    console.log(res.data.err);
                    if (typeof(res.data.err) == 'object') {
                       this.form.err = res.data.err.message;
                    } else {
                       this.form.err = res.data.err;
                    }
                }
                this.canClose = true;
          }).catch(err => {
              this.form.status = "失败";
              this.regTitle = "注册结果";
              console.log(err);
              this.form.err = "服务繁忙，请稍后重试！"; 
              this.canClose = true;
          })
      },
      inputBlur:function(errorItem,inputContent){
          let flag = true;
          let addrReg = /^0x[0-9a-fA-F]{40}$/;
          let reg =/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/;
          if (errorItem === 'name') {
              if (inputContent === '') {
                  this.userInfo.nameErr = '用户名不能为空';
                  flag = false;
              } else{
                  this.userInfo.nameErr = '';
              }
          } else if (errorItem === 'userId') {
              if (inputContent === '') {
                  this.userInfo.idErr = '用户ID不能为空';
                  flag = false;
              } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(inputContent))) {
                 this.userInfo.idErr = '用户ID不合法';
                 flag = false;
              } else{
                  this.userInfo.idErr = '';
              }
          } else if(errorItem === 'addr') {
              if (inputContent === '') {
                  this.userInfo.addrErr = '地址不能为空';
                  flag = false;
              } else if (!addrReg.test(inputContent)) {
                  this.houseInfo.addrErr = '地址不符合规则';
                  flag = false;
              } else{
                  this.userInfo.addrErr = '';
              }
          } else if(errorItem === 'pwd') { // /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/
              if (inputContent === '') {
                  this.userInfo.pwdErr = '密码不能为空';
                  flag = false;
              } else {
                  this.userInfo.pwdErr = '';
              }
          } else if (errorItem === 'retpwd') {
             if (inputContent === '') {
                  this.userInfo.retpwdErr = '密码不能为空';
                  flag = false;
              } else if (inputContent !== this.userInfo.pwd) {
                  this.userInfo.retpwdErr = '两次密码不一致';
                  flag = false;
              } else{
                  this.userInfo.idcardErr = '';
              }
          } else if (errorItem === 'idcard') {
             if (inputContent === '') {
                  this.userInfo.idcardErr = '身份证号不能为空';
                  flag = false;
              } else if (!reg.test(inputContent)) {
                  this.userInfo.idcardErr = '身份证号不规范';
                  flag = false;
              }else{
                  this.userInfo.idcardErr = '';
              }
          }
          //对于按钮的状态进行修改
          if (flag) {
              this.userInfo.beDisabled = false;
          }else{
              this.userInfo.beDisabled = true;
          }
      },
  },
  mounted (){
      var hi=window.screen.height;
      // document.getElementById("bg").style.width=wi+"px";
      document.getElementById("bg").style.height=hi+"px";
  },
}
// Microsoft YaHei, STHeiti
</script>

<style  scoped>
    .home_container{
        font-family:"Microsoft YaHei";
        font-weight: bold;
    }
    .login {
      position:absolute;
      top: 54%;
      left: 50%;
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      -o-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      width: 400px;
    }
    .login-btn {
      font-size:20px;
      background-color: whitesmoke;
    }
    .logo {
      font-family: "Microsoft YaHei";
      font-size: 30px;
    }
    .form-size .el-form-item__label {
    }
    .widthContrl {
       width: 400px;
    }
</style>
