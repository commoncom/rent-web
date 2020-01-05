<template>
    <div class="home_container">
        <itemcontainer father-component="home"></itemcontainer>
        <!--认证-->
        <div id="bg" class="bg">
          <div class="login">
             <div class="login">
              <div class="logo">欢迎来到租房认证</div>
              <el-form>
                 <el-form-item label="房屋唯一码">
                    <el-input type="text" id="guid" v-model="houseInfo.guid" @blur="inputBlur('guid',houseInfo.guid)"></el-input>
                    <p>{{houseInfo.guidErr}}</p>
                </el-form-item>
                 <el-form-item label="用户身份证号">
                    <el-input type="text" id="idCard" v-model="houseInfo.idCard" @blur="inputBlur('idCard',houseInfo.idCard)"></el-input>
                    <p>{{houseInfo.idCardErr}}</p>
                </el-form-item>
                <el-form-item label="用户姓名">
                    <el-input type="text" id="userName" v-model="houseInfo.userName" @blur="inputBlur('userName',houseInfo.userName)"></el-input>
                    <p>{{houseInfo.usernameErr}}</p>
                </el-form-item>
                <el-form-item label="用户ID">
                    <el-input type="text" id="userId" v-model="houseInfo.userId" @blur="inputBlur('userId',houseInfo.userId)"></el-input>
                    <p>{{houseInfo.userIdErr}}</p>
                </el-form-item>
                <el-form-item label="用户地址">
                    <el-input type="text" id="addr" v-model="houseInfo.addr" @blur="inputBlur('addr',houseInfo.addr)"></el-input>
                    <p>{{houseInfo.addrErr}}</p>
                </el-form-item>
                <el-form-item label="私钥">
                    <el-input type="pwd" id="prikey" v-model="houseInfo.prikey" @blur="inputBlur('prikey',houseInfo.prikey)"></el-input>
                    <p>{{houseInfo.prikeyErr}}</p>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('houseInfo')" v-bind:disabled="houseInfo.beDisabled">认证</el-button>
                  <el-button @click="resetForm">重置</el-button>
                </el-form-item>
              </el-form>     
            </div>
          </div>
          <el-dialog :title="regTitle" :visible.sync="dialogFormVisible" :show-close="false">
            <el-form :model="form">
              <el-form-item label="状态" :label-width="formLabelWidth">
                <el-input v-model="form.status"  :readonly="true" autocomplete="off"></el-input>
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
    name: 'auth',
    components: {
      itemcontainer
    },
    created(){
        
    },
    data () {
      return {
        houseInfo :{
            guid: '',
            addr: '',
            prikey: '',
            idCard : '',
            userName: '',
            userId: '',
            guidErr: '',
            addrErr: '',
            prikeyErr: '',
            idCardErr: '',
            userNameErr: '',
            userIdErr: '',
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
        formLabelWidth: '80px',
        regTitle: "认证中",
        newMap: new Map(),
      }
   },
   methods : {
      closeBut() {
          this.form = {};
          if (this.canClose) {
              this.dialogFormVisible = false;
              this.canClose = false;
              this.jumpLog();
          }
      },
      jumpLog() {
         if (this.isSus) {
            this.$router.push({path: '/release'}); 
            this.houseInfo = {};
         }
      },
      resetForm:function(){
          this.houseInfo = {};
      },
      submitForm:function(formInfo){
         console.log(this.houseInfo, formInfo)
         if (this.newMap.has(this.houseInfo.userId)) {
               this.$notify({title : '提示信息',message : '已经认证，认证Hash为！'+this.newMap.get(this.houseInfo.userId),type : 'error'});
               return false;
          }
          let info = this.houseInfo;
          let url = UrlConfig.serverUrl+"/auth/"+info.addr+"/"+info.idCard+"/"+info.guid+"/"+info.userName+"/"+info.userId+"/"+info.prikey;
          console.log(url);
          this.regTitle = "认证结果";
          this.dialogFormVisible = true;
          axios.get(url, {}).then(res => {
                console.log("rtn", res.data);
                if(res.data.status) {
                    this.newMap.set(this.houseInfo.userId, res.data.data); 
                    this.form.data = res.data.data;
                    this.form.status = "成功";             
                } else {
                    this.form.status = "失败"; 
                    this.isSus = false;
                    this.form.err = res.data.err;
                }
                this.canClose = true;
          }).catch(err => {
              this.form.statue = "失败";
              this.form.err = err.data;
              this.canClose = true;
          });
      },
      inputBlur:function(errorItem,inputContent){
          let flag = true;
          let reg =/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/;
          let guidReg = /^\d{12,64}$/;
          let addrReg = /^0x[0-9a-fA-F]{40}$/;
          if (errorItem === 'guid') {
              if (inputContent === '') {
                  this.houseInfo.guidErr = '房屋唯一编码不能为空！';
                  flag = false;
              } else if (guidReg.test(inputContent)) {
                  this.houseInfo.guidErr = '房屋唯一编码不符合规范！';
                  flag = false;
              } else{
                  this.houseInfo.guidErr = '';
              }
          } else if (errorItem === 'userId') {
              if (inputContent === '') {
                  this.houseInfo.userIdErr = '用户ID不能为空';
                  flag = false;
              } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(inputContent))) {
                 this.houseInfo.userIdErr = '用户ID不合法';
                 flag = false;
              } else{
                  this.houseInfo.userIdErr = '';
              }
          } else if(errorItem === 'addr') {
              if (inputContent === '') {
                  this.houseInfo.addrErr = '地址不能为空';
                  flag = false;
              } else if (!addrReg.test(inputContent)) {
                  this.houseInfo.addrErr = '地址不符合规则';
                  flag = false;
              } else {
                  this.houseInfo.addrErr = '';
              }
          } else if(errorItem === 'prikey') {
              if (inputContent === '') {
                  this.houseInfo.prikeyErr = '私钥不能为空';
                  flag = false;
              } else {
                  this.houseInfo.prikeyErr = '';
              }
          } else if (errorItem === 'idCard') {
             if (inputContent === '') {
                  this.houseInfo.idCardErr = '身份证号不能为空';
                  flag = false;
              } else if (!reg.test(inputContent)) {
                  this.userInfo.idCardErr = '身份证号不规范';
                  flag = false;
              } else{
                  this.houseInfo.idCardErr = '';
              }
          } else if (errorItem === 'userName') {
             if (inputContent === '') {
                  this.houseInfo.userNameErr = '用户名不能为空';
                  flag = false;
              } else{
                  this.houseInfo.userNameErr = '';
              }
          }
          //对于按钮的状态进行修改
          if (flag) {
              this.houseInfo.beDisabled = false;
          }else{
              this.houseInfo.beDisabled = true;
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
