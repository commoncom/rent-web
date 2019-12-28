<template>
  	<div class="home_container">
        <itemcontainer father-component="home"></itemcontainer>
        <!--登录-->
        <div id="bg" class="bg">
          <div class="login">
             <div class="login">
              <div class="logo">用户余额</div>
              <div>
                <el-form   :inline="true" :model="filters">
                    <el-form-item>
                     <el-input type="text" id="addr" placeholder="地址" style="width:350px;" v-model="filters.addr" @blur="inputBlur('addr', filters.addr)"></el-input>
                     <p>{{filters.addrErr}}</p>
                   </el-form-item>
                   <el-form-item >
                      <el-button type="primary" icon="el-icon-search" @click="search" style="width:80px;">查询</el-button>
                   </el-form-item>
                </el-form>  
              </div>
              <el-form>
                <span style="font-size:16px;">余额：</span>
                <el-form-item>
                    <span style="font-size:16px;">ETH(数量)：</span>
                    <span class ="judgeStyle">{{userInfo.ethAmount}}</span>
                </el-form-item>
                <el-form-item>
                    <span style="font-size:16px;">RentToken(数量)：</span>
                    <span class ="judgeStyle">{{userInfo.rentAmount}}</span>
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
            ethAmount: '0',
            rentAmount: '0',
            noCreate: false
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
         this.$router.push({path: '/register'}); 
      },
      goLogin() {
         this.$router.push({path: '/'}); 
      },
      search() {
          if (!this.userInfo.beDisabled) {
              this.initData(this.filters.addr);
          } else {
              this.$notify({title : '提示信息',message : '地址为空或者地址不正确！', type : 'error'});
          }
      },
      initData(addr){
          let url = UrlConfig.serverUrl+"/getbalance/"+addr;
          console.log(url);
          axios.get(url, {}).then(res => {
                console.log(res.data);
                if (res.data.status) {
                    let rtnInfo = res.data;
                    this.userInfo.ethAmount = rtnInfo.data.ethbal;
                    this.userInfo.rentAmount = rtnInfo.data.tokenbal;
                } 
          }).catch(err => {
              console.log("init data error", err);
              this.$notify({title : '提示信息',message : '网络异常！', type : 'error'});
          });
      },
      inputBlur:function(errorItem,inputContent){
          let flag = true;
          let addrReg = /^0x[0-9a-fA-F]{40}$/;
          console.log(inputContent, addrReg.test(inputContent));
          if(errorItem === 'addr') {
              if (inputContent === '') {
                  this.filters.addrErr = '地址不能为空!';
                  flag = false;
              } else if (!addrReg.test(inputContent)) {
                  this.filters.addrErr = '请输入正确的地址！';
                  flag = false;
              } else {
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
    .judgeStyle {
       font-size:16px;margin-left:30px;width:80px;
    }
    .login {
      position:absolute;
      top: 30%;
      left: 50%;
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      -o-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      width: 500px;
      font-size:20px;
    }
    .approveform {
       font-size: 20px;
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
