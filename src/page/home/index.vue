<template>
    <div class="home_container">
        <itemcontainer father-component="home"></itemcontainer>
        <!--登录-->
        <div id="bg" class="bg">
          <div class="login">
             <div class="login">
              <div class="logo">欢迎来到基于区块链的租房系统登录界面</div>
              <el-form>
                 <el-form-item label="用户名">
                    <el-input type="text" id="name" v-model="userInfo.userName" @blur="inputBlur('name',userInfo.userName)"></el-input>
                    <p>{{userInfo.nameErr}}</p>
                </el-form-item>
                 <el-form-item label="地址">
                    <el-input type="text" id="addr" v-model="userInfo.addr" @blur="inputBlur('addr',userInfo.addr)"></el-input>
                    <p>{{userInfo.addrErr}}</p>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" id="pwd" v-model="userInfo.pwd" @blur="inputBlur('pwd',userInfo.pwd)"></el-input>
                    <p>{{userInfo.pwdErr}}</p>
                </el-form-item>
                 <el-form-item label="私钥">
                    <el-input type="password" id="prikey" v-model="userInfo.prikey" @blur="inputBlur('prikey',userInfo.prikey)"></el-input>
                    <p>{{userInfo.prikeyErr}}</p>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('userInfo')" v-bind:disabled="userInfo.beDisabled">登录</el-button>
                  <el-button @click="goRegister">注册</el-button>
                </el-form-item>
              </el-form>     
            </div>
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
    name: 'home',
    components: {
      itemcontainer
    },
    created(){
        
    },
    data () {
      return {
        userInfo :{
            userName: '',
            addr: '',
            pwd: '',
            prikey: '',
            nameErr: '',
            addrErr: '',
            pwdErr: '',
            prikeyErr: '',
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
        regTitle: "登录中，请稍等.....",
        newMap: new Map(),
      }
   },
   methods : {
      closeBut() {
          this.form = {};
          this.regSus = true;
          if (this.canClose) {
              this.dialogFormVisible = false;
              this.regTitle = "登录中，请稍等.....";
              this.canClose = false;
              if (this.regSus) {
                 this.jumpLog();
              }
          }
      },
      jumpLog() {
         this.userInfo = {};
         this.$router.push({path: '/auth'}); 
      },
      goRegister(){
          this.$router.push({path: '/register'});
      },
      submitForm:function(formInfo){
         console.log(this.userInfo, formInfo)
         let addr = this.userInfo.addr;
         if (this.newMap.has(addr)) {
               this.$notify({title : '提示信息',message : '该用户已登录！', type : 'error'});
               console.log(this.newMap.get(addr));
               return false;
          }
          console.log(addr, this.userInfo.userName)
          let url = UrlConfig.serverUrl+"/login/"+addr+"/"+this.userInfo.userName +"/"+this.userInfo.pwd+"/"+this.userInfo.prikey;
          this.dialogFormVisible = true;
          console.log("url", url)
          axios.get(url, {}).then(res => {
                this.regTitle = "登录结果";
                console.log("rtn", res.data);
                if(res.data.status) {
                    this.newMap.set(addr, res.data.data); 
                    this.regSus = true; 
                    this.form.data = res.data.data;
                    this.form.status = "成功";              
                } else {
                    this.form.status = "失败"; 
                    this.isSus = false;
                    if (typeof(res.data.err) == 'object') {
                       this.form.err = res.data.err.message;
                    } else {
                       this.form.err = res.data.err;
                    }
                }
                this.canClose = true;
          }).catch(err => {
              this.isSus = false;
              this.form.status = "失败";
              this.regTitle = "登录结果";
              this.form.err = "服务繁忙，请稍后重试！"; 
              console.log(err)
              this.canClose = true;
          })
      },
      inputBlur:function(errorItem,inputContent){
          let flag = true;
          let addrReg = /^0x[0-9a-fA-F]{40}$/;
          if (errorItem === 'name') {
              if (inputContent === '') {
                  this.userInfo.nameErr = '用户名不能为空';
                  flag = false;
              } else{
                  this.userInfo.nameErr = '';
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
          } else if(errorItem === 'pwd') {
              if (inputContent === '') {
                  this.userInfo.pwdErr = '密码不能为空';
                  flag = false;
              } else {
                  this.userInfo.pwdErr = '';
              }
          } else if(errorItem === 'prikey') {
              if (inputContent === '') {
                  this.userInfo.prikeyErr = '私钥不能为空';
                  flag = false;
              } else if (!inputContent.startsWith('0x')) {
                  this.userInfo.prikeyErr = '私钥没有0x开头，需要补上0x!';
                  flag = false;
              } else {
                  this.userInfo.prikeyErr = '';
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
</script>

<style lang="less" scoped>
    .home_container{

    }
    .login {
      position:absolute;
      top: 35%;
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
      font-family: "DejaVu Sans Mono";
      color: lightblue;
      font-size: 30px;
    }
    .widthContrl {
       width: 400px;
    }
</style>
