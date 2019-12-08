<template>
    <el-row class="container">
    <!-- 头部信息-->
    <el-col :span="24" class="header">
        <el-col :span="20">
            <div class="themeItem">
                {{collapsed?sysName:sysName}}
            </div>
        </el-col>
        <el-col :span="4">
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <aside>
        <!--折叠菜单-->
        <!-- <div style="background-color:#fff;">
          <div class="el-icon-my-caidan" @click="collapse" style="margin-left:22px;font-size:20px;"></div>
        </div> -->
        <!--导航菜单-->
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" unique-opened router :collapse="collapsed">
           <template v-for="(item,index) in menus" v-if="!item.hidden">
            <el-submenu :index="index+''" v-if="item.children && !item.onlyPage">
              <template slot="title"><i :class="item.iconCls"></i><span slot="title">{{item.name}}</span></template>
              <el-menu-item style="margin-left:2px;" v-for="child in item.children" :index="item.path + '/' + child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
            </el-submenu>
            <el-menu-item v-else-if="item.onlyPage" :index="item.path + '/' + item.children[0].path"><i :class="item.iconCls"></i><span slot="title">{{child.name}}</span></el-menu-item>
            <el-menu-item v-else :index="item.path"><i :class="item.iconCls"></i><span slot="title">{{item.name}}</span></el-menu-item>
          </template>
        </el-menu>
      </aside>
        <section class="content-container">
            <div class="grid-content bg-purple-light">
                <el-col :span="24" class="breadcrumb-container">
                    <strong class="title" style="width:300px;" >{{$route.name}}</strong>
                    <el-breadcrumb separator="/" class="breadcrumb-inner">
                        <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                            {{item.name}}
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <el-col :span="24" class="content-wrapper">
                    <transition name="fade" mode="out-in">
                        <router-view></router-view>
                    </transition>
                </el-col>
            </div>
        </section>
    </el-col>
  </el-row>
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
          if (this.canClose) {
              this.dialogFormVisible = false;
              this.form = {};
              this.regTitle = "登录中，请稍等.....";
              this.canClose = false;
              if (this.regSus) {
                 this.jumpLog();
              }
          }
      },
      jumpLog() {
         this.userInfo = {};
         this.regSus = true;
         this.$router.push({path: '/'}); 
      },
      goRegister(){
          this.$router.push({path: 'register'});
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
