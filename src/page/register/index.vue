<template>
  	<div class="home_container">
        <itemcontainer father-component="home"></itemcontainer>
        <!--登录-->
        <div id="bg" class="bg">
          <div class="login">
             <div class="login">
              <div class="logo">欢迎来到租房空间</div>
              <!--<div class="form-group input-group input-group-lg">
                <span class="input-group-addon"><i class="fa fa-user-o" aria-hidden="true"></i></span>
                <input type="text" class=" form-control" placeholder="请输入用户名" v-model="userInfo.userName">
              </div>
              <div class="form-group input-group input-group-lg">
                <input type="text" class=" form-control" placeholder="请输入用户id" v-model="userInfo.userId">
              </div>
              <div class="form-group input-group input-group-lg">
                <input type="text" class=" form-control widthContrl" placeholder="请输入地址" v-model="userInfo.addr">
              </div>
              <div class="form-group input-group input-group-lg">
                <input type="pwd" class=" form-control" placeholder="请输入密码" v-model="userInfo.pwd">
              </div>
              <div class="form-group input-group input-group-lg">
                <span class="input-group-addon"><i class="fa fa-key" aria-hidden="true"></i></span>
                <input type="pwd" class=" form-control" placeholder="请输入确认密码" v-model="userInfo.retpwd">
              </div>
              <div class="form-group">
                <el-button class="form-control" @click="doRegister">注 册</el-button>
                <el-button class="form-control" @click="jumpLog">登 录</el-button>
              </div>-->
              <el-form>
                 <el-form-item label="用户名">
                    <el-input type="text" id="name" v-model="userInfo.userName" @blur="inputBlur('name',userInfo.userName)"></el-input>
                    <p>{{userInfo.nameErr}}</p>
                </el-form-item>
                 <el-form-item label="用户ID">
                    <el-input type="text" id="userId" v-model="userInfo.userId" @blur="inputBlur('userId',userInfo.userId)"></el-input>
                    <p>{{userInfo.idErr}}</p>
                </el-form-item>
                 <el-form-item label="地址">
                    <el-input type="text" id="addr" v-model="userInfo.addr" @blur="inputBlur('addr',userInfo.addr)"></el-input>
                    <p>{{userInfo.addrErr}}</p>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" id="pwd" v-model="userInfo.pwd" @blur="inputBlur('pwd',userInfo.pwd)"></el-input>
                    <p>{{userInfo.pwdErr}}</p>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('userInfo')" v-bind:disabled="userInfo.beDisabled">注册</el-button>
                  <el-button @click="resetForm">重置</el-button>
                </el-form-item>
              </el-form>     
            </div>
          </div>
          <el-dialog :title="regTitle" :visible.sync="dialogFormVisible" :show-close="false">
            <el-form :model="form">
              <el-form-item label="状态" :label-width="formLabelWidth">
                <el-input v-model="form.status" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item v-if = "isSus" label="链上Hash" :label-width="formLabelWidth">
                <el-input v-model="form.data" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item v-else label="错误原因" :label-width="formLabelWidth">
                <el-input v-model="form.err" autocomplete="off"></el-input>
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
            userId : '',
            addr: '',
            pwd: '',
            retpwd: '',
            nameErr: '',
            idErr: '',
            addrErr: '',
            pwdErr: '',
            retpwd: '',
            beDisabled: true
        },
        form: {
           status: '',
           data: '',
           err: ''
        },
        dialogFormVisible: false,
        showLoginForm : false,
        isSus: false, //传值给父组件
        formLabelWidth: '50px',
        regTitle: "注册中",
        newMap: new Map(),
      }
   },
   methods : {
      doRegister () {
          if (!this.validateReLg()) {
             return false;
          }
          if (this.newMap.has(this.userInfo.userId)) {
               this.$notify({title : '提示信息',message : '已经注册过，地址为！'+this.newMap[this.userInfo.userId],type : 'error'});
               return false;
          }
          let addr = this.userInfo.addr;
          let url = UrlConfig.serverUrl+"/register/"+addr+"/"+this.userInfo.userName+"/"+this.userInfo.userId+"/"+this.userInfo.pwd;
          axios.get(url, {}).then(res => {
                if(res.data.status){
                    this.regTitle = "注册结果";
                    // this.$notify({
                    //     title : '提示信息',
                    //     message : '注册成功',
                    //     type : 'success'
                    // });
                    this.newMap.set(this.userInfo.userId, addr);
                    // this.userInfo = {};
                    this.isSus = true;
                    this.showLoginForm = true;
                    this.form = res.data;
                }else {
                    console.log(res.data)
                    // this.$notify({
                    //     title : '提示信息',
                    //     message : '注册失败，'+res.data.err,
                    //     type : 'error'
                    // });
                    // this.userInfo = {};
                    this.form = res.data;
                }
          }).catch(err => {
              console.log(err);
          })
      },
      closeBut() {
          this.dialogFormVisible = false;
          this.form = {};
          this.userInfo = {};
          this.jumpLog();
      },
      jumpLog() {
         this.$router.push({path: '/'}); 
      },
      validateReLg() {
          if (this.userInfo.userId == ''){
              alert('用户名不能为空');
              return false
          }
          if (this.userInfo.pwd == ''){
              alert('密码不能为空');
              return false
          }
          return true;
        },
      handleClose() {
         if (this.showLoginForm) {
            this.showLoginForm = false;
            this.jumpLog();
         } else {
            this.$notify({title : '提示信息',message : '注册中，请稍后！',type : 'info'});
         }     
      },
      resetForm:function(){
          this.userInfo = {};
      },
      submitForm:function(formInfo){
         console.log(this.userInfo, formInfo)
         if (this.newMap.has(this.userInfo.userId)) {
               this.$notify({title : '提示信息',message : '已经注册过，地址为！'+this.newMap[this.userInfo.userId],type : 'error'});
               return false;
          }
          let addr = this.userInfo.addr;
          console.log(addr, this.userInfo.userName)
          let url = UrlConfig.serverUrl+"/register/"+addr+"/"+this.userInfo.userName+"/"+this.userInfo.userId+"/"+this.userInfo.pwd;
          this.dialogFormVisible = true;
          axios.get(url, {}).then(res => {
                this.form = res.data;
                this.regTitle = "注册结果";
                this.isSus = true;
                if(res.data.status) {
                    this.newMap.set(this.userInfo.userId, addr);                
                }
          }).catch(err => {
              console.log(err);
          })
      },
      inputBlur:function(errorItem,inputContent){
          let flag = true;
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
              } else if (!(/^0x[0-9a-fA-F]{40}$"/.test(inputContent))) {
                 this.userInfo.idErr = '用户ID不合法';
                 flag = false;
              } else{
                  this.userInfo.idErr = '';
              }
          } else if(errorItem === 'addr') {
              if (inputContent === '') {
                  this.userInfo.addrErr = '地址不能为空';
                  flag = false;
              }else{
                  this.userInfo.addrErr = '';

              }
          } else if(errorItem === 'pwd') {
              if (inputContent === '') {
                  this.userInfo.pwdErr = '密码不能为空';
                  flag = false;
              } else{
                  this.userInfo.pwdErr = '';
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
      // var wi=window.screen.width;
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
      top: 50%;
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
