<template>
  	<div class="home_container">
        <itemcontainer father-component="home"></itemcontainer>
        <!--登录-->
        <div id="bg" class="bg">
          <div class="login" @keyup.13="doLogin">
             <div class="form-horizontal login">
              <div class="logo">欢迎来到租房空间</div>
              <div class="form-group input-group input-group-lg ">
                <span class="input-group-addon"><i class="fa fa-user-o" aria-hidden="true"></i></span>
                <input type="text" class=" form-control" placeholder="请输入用户名" v-model="userInfo.userName">
              </div>
              <div class="form-group input-group input-group-lg">
                <span class="input-group-addon"><i class="fa fa-key" aria-hidden="true"></i></span>
                <input type="password" class=" form-control" placeholder="请输入密码" v-model="userInfo.pwd">
              </div>
              <div class="form-group input-group input-group-lg">
                <span class="input-group-addon"><i class="fa fa-key" aria-hidden="true"></i></span>
                <input type="password" class=" form-control" placeholder="请输入确认密码" v-model="userInfo.retpwd">
              </div>
              <div class="form-group">
                <el-button class="form-control" @click="doRegister">注 册</el-button>
                <el-button class="form-control" @click="jumpLog">登 录</el-button>
              </div>
            </div>
          </div>
        </div>
        <el-dialog
                  title="提示"
                  :visible.sync="dialogVisible" :modal-append-to-body="false" 
                  width="30%"
                  :before-close="handleClose">
                   <div slot="title" style="float:left;font-size:18px;">请牢记您的地址和密钥</div>
                  <el-form :model="form">
                    <el-form-item label="地址" :label-width="formLabelWidth">
                      <el-input v-model="form.address" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密钥" :label-width="formLabelWidth">
                      <el-input v-model="form.prikey" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-left:160px;">
                      <el-button @click="dialogVisible = false">取 消</el-button>
                      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                    </el-form-item>
                  </el-form>
                  
              </el-dialog>
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
          userName : '',
          pwd: '',
          retpwd: ''
      },
      form: {
         address: '',
         prikey: ''
      },
      dialogVisible: false,
      showLoginForm : false,
      formLabelWidth: '50px',
      newMap: new Map(),
    }
  },
  methods : {
      doRegister () {
          // console.log(this.userInfo)
          if (!this.validateReLg()) {
             return false;
          }
          // console.log(this.userInfo.retpwd, this.userInfo.pwd, typeof(this.userInfo.retpwd), typeof(this.userInfo.pwd))
          // if (this.userInfo.retpwd === this.userInfo.pwd){
          //     alert('确认密码和密码不一致');
          //     return false
          // }
          console.log(11111, typeof(this.newMap))
          if (this.newMap.has(this.userInfo.userName)) {
               this.$notify({title : '提示信息',message : '已经注册过，地址为！'+this.newMap[this.userInfo.userName],type : 'error'});
               return false;
          }
          let [addr, prikey] = generateAddress();
          this.form.address = addr;
          this.form.prikey = prikey;
          let url = UrlConfig.serverUrl+"/register/"+addr+"/"+this.userInfo.userName+"/"+this.userInfo.pwd+"/"+prikey;
          this.dialogVisible = true;
          axios.get(url, {}).then(res => {
                if(res.data.status){
                    this.$notify({
                        title : '提示信息',
                        message : '注册成功',
                        type : 'success'
                    });
                    this.showLoginForm = true;
                    this.newMap.set(this.userInfo.userName, addr);
                    this.userInfo = {};
                    this.form = {};
                }else {
                    this.$notify({
                        title : '提示信息',
                        message : '注册失败，请重新注册！',
                        type : 'error'
                    });
                    this.userInfo = {};
                    this.form = {};
                }
          }).catch(err => {
              console.log(err);
          })
      },
      jumpLog() {
         this.$router.push({path: '/'}); 
      },
      validateReLg() {
          if (this.userInfo.userName == ''){
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
            this.jumpLog();
            this.showLoginForm = false;
            this.dialogVisible = false;
         } else {
            this.$notify({title : '提示信息',message : '注册中，请稍后！',type : 'info'});
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
      font-size: 50px;
    }
</style>
