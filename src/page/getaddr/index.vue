<template>
  	<div class="home_container">
        <itemcontainer father-component="home"></itemcontainer>
        <!--登录-->
        <div id="bg" class="bg">
          <div class="login">
             <div class="form-horizontal login">
              <div class="logo">欢迎来到租房空间</div>
              <div class="form-group input-group input-group-lg ">
                 <input type="text" class=" form-control" placeholder="请输入手机号" v-model="userInfo.userId">
              </div>
              <div class="form-group"> 
                <el-button class="form-control" @click="generateAddr">生成地址</el-button>
                <el-button class="form-control" @click="queryAddr">查询地址</el-button>
              </div>
              <div class="form-group input-group input-group-lg">
                <input type="text" class="widthContrl"  v-model="form.address">
                <input type="text" class="widthContrl" v-model="form.prikey">
              </div>
               <!--<el-alert height="20px" title="请牢记地址和私钥，本系统不为用户保存地址和私钥！" type="info" :closable="false"></el-alert>-->
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import itemcontainer from '../../components/itemcontainer';
import axios from 'axios';
import http from 'http';
import {generateAddress} from 'src/common/js/address';
import {UrlConfig} from 'src/common/js/globe';
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
            userId: '',
            userName : '',
            pwd: '',
            retpwd: ''
        },
        form: {
           address: '',
           prikey: ''
        },
        newMap: new Map(),
      }
   },
   methods : {
      generateAddr() {
         console.log(this.userInfo.userId, this.newMap);
         if (this.userInfo.userId == '') {
             this.$notify({title : '提示信息',message : '手机号不能为空', type:'info'});
             return false;
         } 
         let userId = this.userInfo.userId;
         if (!this.checkId(userId)) {
            this.$notify({title : '提示信息',message : '手机号不符合规则', type:'info'});
             return false;
         }
         if (this.newMap.has(this.userInfo.userId)) {
               this.$notify({title : '提示信息',message : '已经注册过，地址为！'+this.newMap.get(this.userInfo.userId),type : 'error'});
               return false;
          }
          let [addr, prikey] = generateAddress();
          let url = UrlConfig.serverUrl+"/bindaddr/"+this.userInfo.userId+"/"+addr;
          axios.get(url, {}).then(res => {
                console.log(res.data.status)
                if(res.data.status == 200) { // 插入成功
                    this.form.address = addr;
                    this.form.prikey = prikey;
                    this.newMap.set(this.userInfo.userId, addr);             
                } else if (res.data.status == 201) { // 已经生成过地址
                    this.form.address = res.data.data;
                    this.$notify({title : '提示信息',message : '已经生成过地址！', type : 'info'});
                } else {
                    console.log(res.data);
                    this.$notify({title : '提示信息',message : '生成失败，请查看是否已经生成过地址！', type:'error'});
                }
          }).catch(err => {
              console.log("bind error", err);
              this.$notify({title : '提示信息',message : "请检查网络状况!", type:'error'});
          });
      },
      queryAddr() {
         console.log(this.userInfo.userId, this.newMap);
         if (this.userInfo.userId == '') {
             this.$notify({title : '提示信息',message : '手机号不能为空', type:'info'});
             return false;
         } 
         let userId = this.userInfo.userId;
         if (!this.checkId(userId)) {
            this.$notify({title : '提示信息',message : '手机号不符合规则', type:'info'});
             return false;
         }
         if (this.newMap.has(this.userInfo.userId)) { 
               this.form.address = this.newMap.get(this.userInfo.userId);
               return;
          }
          let url = UrlConfig.serverUrl+"/getaddr/"+this.userInfo.userId;
          axios.get(url, {}).then(res => {
                if(res.data.status ) {
                    this.form.address = res.data.data; 
                    // this.$notify({title : '提示信息',message : '地址为:'+res.data.data,duration: 0, type : 'error'});          
                } else {
                    console.log(res.data);
                    
                }
          }).catch(err => {
              console.log("bind error", err);
              this.$notify({title : '提示信息',message : "请检查网络状况!", type:'error'});
          });
      },
      checkId(userId) {
         if (!(/^1[3456789]\d{9}$/.test(userId))) {
             return false;
         }
         return true;
      }
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
      top: 42%;
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
       width: 500px;
    }
</style>
