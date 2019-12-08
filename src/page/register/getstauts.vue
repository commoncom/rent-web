<template>
  	<div class="home_container">
        <itemcontainer father-component="home"></itemcontainer>
        <!--登录-->
        <div id="bg" class="bg">
          <div class="login">
             <div class="login">
              <div class="logo">用户链上活动状态</div>
              <el-form>
                 <el-form-item label="地址">
                    <el-input type="text" id="addr" v-model="userInfo.addr" @blur="inputBlur('addr',userInfo.addr)"></el-input>
                </el-form-item>
                <el-form-item label="是否已创建">
                    <el-input type="text" id="isCreate" v-model="userInfo.isCreate" @blur="inputBlur('isCreate',userInfo.isCreate)"></el-input>
                    <el-button type="primary" @click="goCreate()" v-bind:disabled="userInfo.noCreate">注册</el-button>
                </el-form-item>
                <el-form-item label="是否已登录">
                    <el-input type="text" id="isLogin" v-model="userInfo.isLogin" @blur="inputBlur('isLogin',userInfo.isLogin)"></el-input>
                    <el-button type="primary" @click="goLogin()" v-bind:disabled="userInfo.noLogin">注册</el-button>
                </el-form-item>
              </el-form>     
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import itemcontainer from '../../components/itemcontainer'
import axios from 'axios';
import {UrlConfig} from 'src/common/js/globe';
export default {
	  name: 'getstauts',
  	components: {
  		itemcontainer
  	},
    created(){
       this.initData();
    },
    data () {
      return {
        userInfo :{
            addr: '',
            isCreate: '',
            isLogin: '',
            noCreate: false,
            noLogin: false
        },
        formLabelWidth: '80px',
      }
   },
   methods : {
      goCreate() {
         this.$router.push({path: 'register'}); 
      },
      goLogin() {
         this.$router.push({path: 'login'}); 
      },
      initData(){
          let addr = this.userInfo.addr;
          let url = UrlConfig.serverUrl+"/getstatus/"+addr;
          console.log(url);
          axios.get(url, {}).then(res => {
                this.userInfo.noCreate = res.data.createStatus;
                this.userInfo.noLogin = res.data.loginStatus;  
          }).catch(err => {
              console.log("init data error", err);
              this.$notify({title : '提示信息',message : '网络异常！', type : 'error'});
          });
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
      top: 60%;
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
