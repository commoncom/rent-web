<template>
  	<div class="home_container">
        <itemcontainer father-component="home"></itemcontainer>
        <!--登录-->
        <div id="bg" class="bg">
          <div class="login">
             <div class="login">
              <div class="logo">欢迎来到Token转账</div>
              <el-form>
                 <el-form-item label="转出地址(from)" v-if="tokenInfo.type == '2'">
                    <el-input type="text" id="transOutAddr" v-model="tokenInfo.transOutAddr" @blur="inputBlur('transOutAddr',tokenInfo.transOutAddr)"></el-input>
                    <p>{{tokenInfo.transOutAddrErr}}</p>
                </el-form-item>
                 <el-form-item label="转入地址(to)">
                    <el-input type="text" id="transInAddr" v-model="tokenInfo.transInAddr" @blur="inputBlur('transInAddr',tokenInfo.transInAddr)"></el-input>
                    <p>{{tokenInfo.transInAddrErr}}</p>
                </el-form-item>
                 <el-form-item label="数量">
                    <el-input type="text" id="amount" v-model="tokenInfo.amount" @blur="inputBlur('amount',tokenInfo.amount)"></el-input>
                    <p>{{tokenInfo.amountErr}}</p>
                </el-form-item>
                <el-form-item label="Token类型">
                    <el-select v-model="tokenInfo.type" clearable placeholder="请选择token类型">
                      <el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="地址">
                    <el-input type="text" id="addr" v-model="tokenInfo.addr" @blur="inputBlur('addr',tokenInfo.addr)"></el-input>
                    <p>{{tokenInfo.addrErr}}</p>
                </el-form-item>
                <el-form-item label="私钥">
                    <el-input type="password" id="prikey" v-model="tokenInfo.prikey" @blur="inputBlur('prikey',tokenInfo.prikey)"></el-input>
                    <p>{{tokenInfo.prikeyErr}}</p>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('tokenInfo')" v-bind:disabled="tokenInfo.beDisabled">转账</el-button>
                  <el-button @click="resetForm">重置</el-button>
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
import {UrlConfig, TOKEN_TYPE} from 'src/common/js/globe';
import {generateAddress} from 'src/common/js/address';
export default {
	  name: 'transfer',
  	components: {
  		itemcontainer
  	},
    created(){
        
    },
    data () {
      return {
        tokenInfo :{
            transInAddr: '',
            transOutAddr: '',
            amount : '',
            type: '1',
            addr: '',
            pwd: '',
            prikey: '',
            transInAddrErr: '',
            transOutAddrErr: '',
            amountErr: '',
            addrErr: '',
            prikeyErr: '',
            beDisabled: true
        },
        form: {
           status: '',
           data: '',
           err: ''
        },
        options: TOKEN_TYPE,
        dialogFormVisible: false,
        canClose : false,
        isSus: true, // 注册结果控制
        regSus: false,
        formLabelWidth: '80px',
        regTitle: "转账中，请稍等.....",
        newMap: new Map(),
      }
   },
   methods : {
      closeBut() {
          if (this.canClose) {
              this.dialogFormVisible = false;
              this.form = {};
              this.canClose = false;
              if (this.regSus) {
                 this.jumpLog();
              }
          }
      },
      jumpLog() {
         this.tokenInfo = {};
         this.regSus = false;
         this.$router.push({path: '/token/aprrove'}); 
      },
      resetForm:function(){
          this.tokenInfo = {};
      },
      submitForm:function(formInfo){
         console.log(this.tokenInfo)
        let url = UrlConfig.serverUrl;
        let info = this.tokenInfo;
        if (this.tokenInfo.type == '1') { // Eth转账 
            url += "/transfereth/"+info.transInAddr+"/"+info.amount+"/"+info.addr+"/"+info.prikey;
        } else { // 转RentToken
            url += "/transfertoken/"+info.transOutAddr+"/"+info.transInAddr+"/"+info.amount+"/"+info.addr+"/"+info.prikey;
        }
        console.log(111, url);
        this.dialogFormVisible = true;
        axios.get(url, {}).then(res => {
            this.regTitle = "转账结果";
            console.log("rtn", res.data);
            if(res.data.status) {
                this.newMap.set(this.tokenInfo.addr, addr); 
                this.form.data = res.data.data;
                this.form.status = "成功";   
                this.regSus = true;            
            } else {
                this.form.status = "失败"; 
                this.isSus = false;
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
            this.regTitle = "转账结果";
            console.log(err);
            this.form.err = "服务繁忙，请稍后重试！"; 
            this.canClose = true;
        });
      },
      inputBlur:function(errorItem,inputContent){
          let flag = true;
          let addrReg = /^0x[0-9a-fA-F]{40}$/;
          let reg =/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/;
          if (errorItem === 'transInAddr') {
              if (inputContent === '') {
                  this.tokenInfo.transInAddrErr = '转入地址不能为空！';
                  flag = false;
              } else if (!(addrReg.test(inputContent))) {
                 this.tokenInfo.transInAddrErr = '转入地址不符合规则！';
                 flag = false;
              } else{
                  this.tokenInfo.transInAddrErr = '';
              }
          } else if (errorItem === 'transOutAddr') {
              if (inputContent === '') {
                  this.tokenInfo.transOutAddrAddrErr = '转出地址不能为空！';
                  flag = false;
              } else if (!(addrReg.test(inputContent))) {
                 this.tokenInfo.transOutAddrAddrErr = '转出地址不符合规则！';
                 flag = false;
              } else{
                  this.tokenInfo.transOutAddrAddrErr = '';
              }
          } else if (errorItem === 'amount') { 
              if (inputContent === '') {
                  this.tokenInfo.amountErr = '数量不能为空';
                  flag = false;
              } else{
                  this.tokenInfo.amountErr = '';
              }
          } else if(errorItem === 'addr') {
              if (inputContent === '') {
                  this.tokenInfo.addrErr = '地址不能为空';
                  flag = false;
              } else if (!addrReg.test(inputContent)) {
                  this.houseInfo.addrErr = '地址不符合规则';
                  flag = false;
              } else{
                  this.tokenInfo.addrErr = '';
              }
          }  else if (errorItem === 'prikey') {
             if (inputContent === '') {
                  this.tokenInfo.prikeyErr = '密钥不能为空';
                  flag = false;
              }  else{
                  this.tokenInfo.prikeyErr = '';
              }
          } 
          //对于按钮的状态进行修改
          if (flag) {
              this.tokenInfo.beDisabled = false;
          }else{
              this.tokenInfo.beDisabled = true;
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
