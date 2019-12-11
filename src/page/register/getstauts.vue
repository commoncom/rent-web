<template>
  	<div class="home_container">
        <itemcontainer father-component="home"></itemcontainer>
        <!--登录-->
        <div id="bg" class="bg">
          <div class="login">
             <div class="login">
              <div class="logo">用户链上活动状态</div>
              <el-form :inline="true" :model="filters">
                  <el-form-item>
                   <el-input type="text" id="addr" placeholder="地址" style="width:260px;" v-model="filters.addr" @blur="inputBlur('addr', filters.addr)"></el-input>
                   <p>{{filters.addrErr}}</p>
                 </el-form-item>
                 <el-form-item >
                    <el-button type="primary" icon="el-icon-search" @click="search" style="width:100px;">查询</el-button>
                 </el-form-item>
              </el-form>  
              <el-form>
                <el-form-item>
                    <span style="font-size:16px;">是否已创建</span>
                    <el-tag type="success" effect="dark" style="margin-left:40px;width:80px;">{{userInfo.isCreate}}</el-tag>
                </el-form-item>
                <el-form-item>
                    <span style="font-size:16px;">是否已登录</span>
                    <el-tag type="success" effect="dark" style="margin-left:40px;width:80px;">{{userInfo.isLogin}}</el-tag>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="goCreate()"  v-bind:disabled="userInfo.noCreate">注册</el-button>
                    <el-button type="primary" @click="goLogin()" v-bind:disabled="userInfo.noLogin">登录</el-button>
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
       let addr = "0x"; // 后续通过session获得
       this.initData(addr);
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
        filters: {
           addr: '',
           addrErr: ''
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
      search() {
          if (this.userInfo.beDisabled) {
              this.initData(this.filters.addr);
          }
      },
      initData(addr){
          let url = UrlConfig.serverUrl+"/getstatus/"+addr;
          console.log(url);
          axios.get(url, {}).then(res => {
                console.log(res.data);
                if (res.data.status) {
                  let tempStatus = parseInt(res.data.data);
                  if (tempStatus == 0) { // 只绑定
                      this.userInfo.noCreate = true;
                      this.userInfo.isCreate = "否"
                      this.userInfo.isLogin = "否"
                  } else if (tempStatus == 1) { // 已创建
                      this.userInfo.noLogin = true;
                      this.userInfo.isCreate = "是";
                      this.userInfo.isLogin = "否";
                  } else {
                      this.userInfo.isCreate = "是";
                      this.userInfo.isLogin = "是";
                  }
                } 
          }).catch(err => {
              console.log("init data error", err);
              this.$notify({title : '提示信息',message : '网络异常！', type : 'error'});
          });
      },
      inputBlur:function(errorItem,inputContent){
          let flag = true;
          if(errorItem === 'addr') {
              if (inputContent === '') {
                  this.filters.addrErr = '地址不能为空';
                  flag = false;
              } else if (!addrReg.test(inputContent)) {
                  this.filters.addrErr = '请输入正确的地址！';
                  flag = false;
              } else{
                  this.filters.addrErr = '';
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
      top: 39%;
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
