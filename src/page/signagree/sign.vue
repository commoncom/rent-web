<template>
    <div class="home_container">
        <itemcontainer father-component="home"></itemcontainer>
        <!--发布房源-->
        <div id="bg" class="bg">
          <div class="login">
             <div class="login">
              <div class="logo" style="margin-top:5px;">欢迎来到租客签订合同</div>
              <el-form style="margin-top:10px;">
                 <el-form-item label="承租方(乙方，填写真实姓名)">
                    <el-input type="text" id="leaserName" v-model="agreeInfo.leaserName" @blur="inputBlur('leaserName',agreeInfo.leaserName)"></el-input>
                    <p>{{agreeInfo.leaserNameErr}}</p>
                 </el-form-item>
                 <el-form-item label="身份证号">
                    <el-input type="text" id="idCard" v-model="agreeInfo.idCard" @blur="inputBlur('idCard',agreeInfo.idCard)"></el-input>
                    <p>{{agreeInfo.idCardErr}}</p>
                 </el-form-item>
                 <el-form-item label="联系电话">
                    <el-input type="text" id="phoneNum" v-model="agreeInfo.phoneNum" @blur="inputBlur('phoneNum',agreeInfo.phoneNum)"></el-input>
                    <p>{{agreeInfo.phoneNumErr}}</p>
                 </el-form-item>
                 <el-form-item label="房源链上ID">
                    <el-input type="text" id="houseId" v-model="agreeInfo.houseId" :readonly="true"></el-input>
                 </el-form-item>
                 <el-form-item label="租金">
                    <el-input type="text" id="rental" v-model="agreeInfo.rental" :readonly="true"></el-input>
                   </el-form-item>
                 <el-form-item label="租期">
                    <el-input type="text" id="tenacy" v-model="agreeInfo.tenacy" :readonly="true"></el-input>
                    </el-form-item>
                 <el-form-item label="房屋用途">
                    <el-input type="text" id="houseUse" v-model="agreeInfo.houseUse" :readonly="true" @blur="inputBlur('houseUse', agreeInfo.houseUse)"></el-input>
                    <p>{{agreeInfo.houseUseErr}}</p>
                 </el-form-item>
                 <el-form-item label="违约金(RentToken数目)">  
                    <el-input type="text" id="falsify" v-model="agreeInfo.falsify" :readonly="true"></el-input>
                 </el-form-item>
                 <el-form-item label="提前终止通知时间(月)">  
                    <el-input type="text" id="breakMonth" v-model="agreeInfo.breakMonth" @blur="inputBlur('breakMonth',agreeInfo.breakMonth)"></el-input>
                 </el-form-item>
                 <el-form-item label="续租提前时间(月)">
                    <el-input type="text" id="renewalMonth" v-model="agreeInfo.renewalMonth" @blur="inputBlur('renewalMonth',agreeInfo.renewalMonth)"></el-input>
                    <p>{{agreeInfo.renewalMonthErr}}</p>
                 </el-form-item>
                 <el-form-item label="地址">
                    <el-input type="text" id="addr" v-model="agreeInfo.addr" @blur="inputBlur('addr', agreeInfo.addr)"></el-input>
                    <p>{{agreeInfo.addrErr}}</p>
                 </el-form-item>
                 <el-form-item label="私钥">
                    <el-input type="text" id="prikey" v-model="agreeInfo.prikey" @blur="inputBlur('prikey', agreeInfo.prikey)"></el-input>
                    <p>{{agreeInfo.prikeyErr}}</p>
                 </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('agreeInfo')" v-bind:disabled="agreeInfo.beDisabled">签约</el-button>
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
    name: 'sign',
    components: {
      itemcontainer
    },
    created(){
        console.log("By pass:",this.$route.params.data)
        let tempData = this.$route.params.data;
        if (tempData && Object.keys(tempData).length != 0) {
            this.initForm(tempData);
        }
    },
    data () {
      return {
        agreeInfo :{
            leaserName: '',
            idCard: '',
            phoneNum: '',
            houseId: '',
            houseAddr: '',
            rental: '',
            tenacy: '',
            houseUse : '',
            falsify: '',
            renewalMonth: '',
            breakMonth: '',
            rentStartTime: '',
            rentEndTime: '',
            addr: '',
            prikey: '',
            leaserNameErr: '',
            idCardErr: '',
            phoneNumErr: '',
            houseIdErr: '',
            houseAddrErr: '',
            tenancyErr: '',
            rentalErr: '',
            houseUseErr: '',
            falsifyErr: '',
            renewalMonthErr: '',
            landlordSignTimeErr: '',
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
        regTitle: "签订合同中",
        newMap: new Map(),
      }
   },
   methods : {
      closeBut() {
          this.isSus = true;
          if (this.canClose) {
              this.dialogFormVisible = false;
              this.form = {};
              this.canClose = false;
              if (this.isSus) {
                 this.jumpLog();
              }
          }
      },
      initForm(data) {
          this.agreeInfo.houseId = data.houseId;
          this.agreeInfo.houseAddr = data.houseAddr;
          this.agreeInfo.rental = data.rental;
          this.agreeInfo.tenacy = data.tenancy;
          this.agreeInfo.houseUse = data.houseUse;
          this.agreeInfo.falsify = data.flsify_month;
      },
      jumpLog() {
         this.agreeInfo = {};
         this.$router.push({path: '/signagree/getsign'}); 
      },
      resetForm:function(){
          this.agreeInfo = {};
      },
      submitForm(formInfo){
         console.log(this.agreeInfo, formInfo);
          let info = this.agreeInfo; 
          console.log("info--", info);
          let url = UrlConfig.serverUrl+"/leasersign/"+info.leaserName+"/"+info.idCard+"/"+info.phoneNum+"/"+info.houseId+"/"+info.renewalMonth+"/"+info.breakMonth+"/"+info.tenacy+"/"+info.addr+"/"+info.prikey;
          console.log(url);
          this.form.houseId = info.houseId;
          this.dialogFormVisible = true;
          axios.get(url, {}).then(res => {
                this.regTitle = "签订结果";
                console.log("rtn", res.data);
                if(res.data.status) {
                    this.newMap.set(this.agreeInfo.addr, res.data.data); 
                    this.form.data = res.data.data;
                    this.form.status = "成功";               
                } else {
                    this.form.status = "失败"; 
                    this.isSus = false;
                    this.form.err = res.data.err;
                }
                this.canClose = true;
          }).catch(err => {
                console.log("sub form err", err);
                this.form = err.data;
                this.regTitle = "签订结果";
                this.isSus = false;
                this.canClose = true;
                this.form.status = "失败"; 
                this.form.err = res.data.err;
          });
      },
      inputBlur:function(errorItem,inputContent){
          let flag = true;
          let reg =/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/;
          let guidReg = /^\d{12,64}$/;
          let addrReg = /^0x[0-9a-fA-F]{40}$/;
          if (errorItem === 'leaserName') {
              if (inputContent === '') {
                  this.agreeInfo.leaserNameErr = '用户名不能为空！';
                  flag = false;
              } else{
                  this.agreeInfo.leaserNameErr = '';
              }
          } else if (errorItem === 'idCard') {
              if (inputContent === '') {
                  this.agreeInfo.idCardErr = '身份证号不能为空！';
                  flag = false;
              }  else{
                  this.agreeInfo.idCardErr = '';
              }
          } else if(errorItem === 'phoneNum') {
              if (inputContent === '') {
                  this.agreeInfo.phoneNumErr = '手机号不能为空！';
                  flag = false;
              } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(inputContent))) {
                  this.agreeInfo.phoneNumErr = '手机号不符合规则！';
                  flag = false;
              } else {
                  this.agreeInfo.phoneNumErr = '';
              }
          } else if(errorItem === 'houseId') {
              if (inputContent === '') {
                  this.agreeInfo.houseIdErr = '房屋ID不能为空！';
                  flag = false;
              } else {
                  this.agreeInfo.houseIdErr = '';
              }
          } else if (errorItem === 'houseAddr') {
             if (inputContent === '') {
                  this.agreeInfo.houseAddrErr = '房东地址不能为空！';
                  flag = false;
              }  else{
                  this.agreeInfo.houseAddrErr = '';
              }
          } else if (errorItem === 'rental') {
             if (inputContent === '') {
                  this.agreeInfo.rentalErr = '租金不能为空！';
                  flag = false;
              }  else{
                  this.agreeInfo.rentalErr = '';
              }
          } else if (errorItem === 'tenacy') {
             if (inputContent === '') {
                  this.agreeInfo.tenancyErr = '租期不能为空！';
                  flag = false;
              }  else{
                  this.agreeInfo.tenancyErr = '';
              }
          } else if (errorItem === 'houseUse') {
             if (inputContent === '') {
                  this.agreeInfo.houseUseErr = '房屋用途不能为空！';
                  flag = false;
              } else{
                  this.agreeInfo.houseUseErr = '';
              }
          } else if (errorItem === 'falsify') {
             if (inputContent === '') {
                  this.agreeInfo.falsifyErr = '房屋违约金不能为空！';
                  flag = false;
              } else{
                  this.agreeInfo.falsifyErr = '';
              }
          } else if (errorItem === 'renewalMonth') {
             if (inputContent === '') {
                  this.agreeInfo.renewalMonthErr = '房屋租期不能为空！';
                  flag = false;
              } else{
                  this.agreeInfo.renewalMonthErr = '';
              }
          } else if (errorItem === 'addr') {
             if (inputContent === '') {
                  this.agreeInfo.addrErr = '地址不能为空！';
                  flag = false;
              } else{
                  this.agreeInfo.addrErr = '';
              }
          } else if (errorItem === 'prikey') {
             if (inputContent === '') {
                  this.agreeInfo.prikeyErr = '私钥不能为空！';
                  flag = false;
              } else{
                  this.agreeInfo.prikeyErr = '';
              }
          }
          //对于按钮的状态进行修改
          if (flag) {
              this.agreeInfo.beDisabled = false;
          } else{
              this.agreeInfo.beDisabled = true;
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
      top: 98%;
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
