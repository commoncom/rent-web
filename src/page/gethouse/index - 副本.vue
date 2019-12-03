<template>
    <div class="home_container">
        <itemcontainer father-component="home"></itemcontainer>
        <!--发布房源-->
        <div id="bg" class="bg">
          <div class="login">
             <div class="login">
              <div class="logo">欢迎来到房屋发布</div>
              <el-form>
                 <el-form-item label="房屋地址">
                    <el-input type="text" id="houseAddr" v-model="houseInfo.houseAddr" @blur="inputBlur('houseAddr',houseInfo.houseAddr)"></el-input>
                    <p>{{houseInfo.houseAddrErr}}</p>
                 </el-form-item>
                 <el-form-item label="房屋描述">
                    <el-input type="textarea" id="describe" v-model="houseInfo.describe" @blur="inputBlur('describe',houseInfo.describe)"></el-input>
                    <p>{{houseInfo.describeErr}}</p>
                </el-form-item>
                 <el-form-item label="房东介绍">
                    <el-input type="textarea" id="info" v-model="houseInfo.info" @blur="inputBlur('info',houseInfo.info)"></el-input>
                    <p>{{houseInfo.infoErr}}</p>
                </el-form-item>
                <el-form-item label="租期">
                    <el-input type="text" id="tenancy" v-model="houseInfo.tenancy" @blur="inputBlur('tenancy',houseInfo.tenancy)"></el-input>
                    <p>{{houseInfo.tenancyErr}}</p>
                </el-form-item>
                <el-form-item label="租金">
                    <el-input type="text" id="rental" v-model="houseInfo.rental" @blur="inputBlur('rental',houseInfo.rental)"></el-input>
                    <p>{{houseInfo.rentalErr}}</p>
                </el-form-item>
                <el-form-item label="对你的期待">
                    <el-input type="textarea" id="hopeYou" v-model="houseInfo.hopeYou" @blur="inputBlur('hopeYou',houseInfo.hopeYou)"></el-input>
                    <p>{{houseInfo.hopeYouErr}}</p>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input type="text" id="addr" v-model="houseInfo.addr" @blur="inputBlur('addr',houseInfo.addr)"></el-input>
                    <p>{{houseInfo.addrErr}}</p>
                 </el-form-item>
                <el-form-item label="私钥">
                    <el-input type="pwd" id="prikey" v-model="houseInfo.prikey" @blur="inputBlur('prikey',houseInfo.prikey)"></el-input>
                    <p>{{houseInfo.prikeyErr}}</p>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('houseInfo')" v-bind:disabled="houseInfo.beDisabled">发布房源</el-button>
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
              <el-form-item v-show = "isSus" label="房屋ID" :label-width="formLabelWidth">
                <el-input v-model="form.houseId"  :readonly="true" autocomplete="off"></el-input>
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
            houseAddr: '',
            describe: '',
            info : '',
            tenancy: '',
            rental: '',
            hopeYou: '',
            addr: '',
            prikey: '',
            houseAddrErr: '',
            describeErr: '',
            infoErr: '',
            tenancyErr: '',
            rentalErr: '',
            hopeYouErr: '',
            addrErr: '',
            prikeyErr: '',
            beDisabled: true
        },
        form: {
           status: '',
           data: '',
           houseId: '',
           err: ''
        },
        dialogFormVisible: false,
        canClose : false,
        isSus: true, // 注册结果控制
        formLabelWidth: '80px',
        regTitle: "发布房源中",
        newMap: new Map(),
      }
   },
   methods : {
      closeBut() {
          if (this.canClose) {
              this.dialogFormVisible = false;
              this.form = {};
              this.canClose = false;
              if (this.isSus) {
                 this.jumpLog();
              }
          }
      },
      jumpLog() {
         this.houseInfo = {};
         this.$router.push({path: '/'}); 
      },
      resetForm:function(){
          this.houseInfo = {};
      },
      submitForm:function(formInfo){
         console.log(this.houseInfo, formInfo)
         if (this.newMap.has(this.houseInfo.addr)) {
               this.$notify({title : '提示信息',message : '该房源已经发布，房屋Hash为：'+this.newMap.get(this.houseInfo.addr).houseId,type : 'error'});
               return false;
          }
          let info = this.houseInfo;
          let url = UrlConfig.serverUrl+"/release/"+info.addr+"/"+info.prikey+"/"+info.houseAddr+"/"+info.describe+"/"+info.info+"/"+info.tenancy+"/"+info.rental+"/"+info.hopeYou;
          console.log(url);
          this.dialogFormVisible = true;
          axios.get(url, {}).then(res => {
                this.regTitle = "发布结果";
                console.log("rtn", res.data);
                if(res.data.status) {
                    this.newMap.set(this.houseInfo.addr, res.data.data); 
                    this.form.data = res.data.data.trans;
                    this.form.houseId = res.data.data.houseId;
                    this.form.status = "成功";               
                } else {
                    this.form.status = "失败"; 
                    this.isSus = false;
                    this.form.err = res.data.err;
                }
                this.canClose = true;
          }).catch(err => {
              this.form = err.data;
              this.regTitle = "发布结果";
              this.isSus = false;
              this.canClose = true;
          });
      },
      inputBlur:function(errorItem,inputContent){
          let flag = true;
          let reg =/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/;
          let guidReg = /^\d{12,64}$/;
          let addrReg = /^0x[0-9a-fA-F]{40}$/;
          if (errorItem === 'houseAddr') {
              if (inputContent === '') {
                  this.houseInfo.houseAddrErr = '房屋地址不能为空！';
                  flag = false;
              } else{
                  this.houseInfo.houseAddrErr = '';
              }
          } else if (errorItem === 'describe') {
              if (inputContent === '') {
                  this.houseInfo.describeErr = '房屋描述不能为空！';
                  flag = false;
              }  else{
                  this.houseInfo.describeErr = '';
              }
          } else if(errorItem === 'addr') {
              if (inputContent === '') {
                  this.houseInfo.addrErr = '地址不能为空！';
                  flag = false;
              } else if (!addrReg.test(inputContent)) {
                  this.houseInfo.addrErr = '地址不符合规则！';
                  flag = false;
              } else {
                  this.houseInfo.addrErr = '';
              }
          } else if(errorItem === 'prikey') {
              if (inputContent === '') {
                  this.houseInfo.prikeyErr = '私钥不能为空！';
                  flag = false;
              } else {
                  this.houseInfo.prikeyErr = '';
              }
          } else if (errorItem === 'info') {
             if (inputContent === '') {
                  this.houseInfo.infoErr = '房东信息不能为空！';
                  flag = false;
              }  else{
                  this.houseInfo.infoErr = '';
              }
          } else if (errorItem === 'tenancy') {
             if (inputContent === '') {
                  this.houseInfo.rentalErr = '租期不能为空！';
                  flag = false;
              }  else{
                  this.houseInfo.rentalErr = '';
              }
          } else if (errorItem === 'rental') {
             if (inputContent === '') {
                  this.houseInfo.rentalErr = '租金不能为空！';
                  flag = false;
              }  else{
                  this.houseInfo.rentalErr = '';
              }
          } else if (errorItem === 'hopeYou') {
             if (inputContent === '') {
                  this.houseInfo.hopeYouErr = '对你的期待不能为空！';
                  flag = false;
              } else{
                  this.houseInfo.hopeYouErr = '';
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
      top: 75%;
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
