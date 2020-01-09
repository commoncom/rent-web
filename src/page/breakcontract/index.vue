<template>
    <div class="home_container">
        <itemcontainer father-component="home"></itemcontainer>
        <!--发布房源-->
        <div id="bg" class="bg">
             <div class="login">
                  <div class="logo moveCenter">欢迎来到签订租房</div>
                    <el-col class="toolbar" style="padding-bottom:0px;height:50px;">
                      <el-form :inline="true" :model="filters">
                              <el-form-item :span="6">
                                  <el-input type="text" style="width:300px;" id="houseId" v-model="filters.houseId" placeholder="房屋链上ID" @blur="inputBlur('houseId',houseInfo.houseId)"></el-input>
                              </el-form-item>
                              <!-- 设置查询Form-->
                              <el-form-item >
                                  <el-button type="primary" icon="el-icon-search" @click="search" style="width:100px;">查询</el-button>
                              </el-form-item>
                      </el-form>
                  </el-col>
                   <el-table
                    :data="tableData"
                    @expand='expand'
                    :expand-row-keys='expendRow'
                    :row-key="row => row.index"
                    style="width: 100%">
                    <el-table-column type="expand">
                      <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                          <el-form-item label="房屋位置">
                            <span>{{props.row.houseAddr}}</span>
                          </el-form-item>
                          <el-form-item label="房屋交易Hash">
                            <span>{{props.row.txHash}}</span>
                          </el-form-item>
                          <el-form-item label="房东地址">
                            <span>{{props.row.addr}}</span>
                          </el-form-item>
                          </el-form-item>
                           <el-form-item label="租户地址">
                            <span>{{props.row.leaserAddr}}</span>
                          </el-form-item>
                          <el-form-item label="房屋链上ID">
                            <span>{{props.row.houseId}}</span>
                          </el-form-item>
                          <el-form-item label="租期">
                            <span>{{props.row.tenancy}}</span>
                          </el-form-item>
                          <el-form-item label="租金">
                            <span>{{props.row.rental}}</span>
                          </el-form-item>
                          <el-form-item label="房屋用途">
                            <span>{{props.row.houseUse}}</span>
                          </el-form-item>
                          <el-form-item label="交付期限">
                            <span>{{props.row.payDeadline}}天</span>
                          </el-form-item>
                          <el-form-item label="日常维修方">
                            <span>{{props.row.payOne}}</span>
                          </el-form-item>
                          <el-form-item label="租赁开始时间">
                            <span>{{props.row.rentStartTime}}</span>
                          </el-form-item>
                          <el-form-item label="租赁结束时间">
                            <span>{{props.row.rentEndTime}}</span>
                          </el-form-item>
                          <el-form-item label="续租提前通知时间(月)">
                            <span>{{props.row.renewalBeforeMonth}}</span>
                          </el-form-item>
                          <el-form-item label="双方提前终止通知时间(月)">
                            <span>{{props.row.noticeBreakMonth}}</span>
                          </el-form-item>
                           <el-form-item label="违约金(Token/日)">
                            <span>{{props.row.flsify_month}}个</span>
                          </el-form-item>
                          <el-form-item>
                            <el-button v-if="props.row.state == '5' || props.row.state == 5 || props.row.state == 9"                              size="small" type="primary"
                                @click="passCheck(props.row)">通过</el-button>
                            <!--<el-button v-if="props.row.state == '5' || props.row.state == 5" 
                                size="small" type="danger"
                                @click="rejectCheck(props.row)">拒绝</el-button> -->
                          </el-form-item>
                        </el-form>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="房屋位置"
                      prop="houseAddr">
                    </el-table-column>
                    <el-table-column
                      label="房屋链上ID">  
                        <template slot-scope="scope">
                          {{scope.row.houseId | limitLen}}
                        </template>
                    </el-table-column>
                    <el-table-column
                      label="租金" width="60"
                      prop="rental">
                    </el-table-column> 
                    <el-table-column label="房东地址" prop="addr">
                    </el-table-column>
                    <el-table-column label="状态" width="80">
                       <template slot-scope="scope">
                          {{signStatus[scope.row.state]}}
                        </template>
                    </el-table-column>
                    <el-table-column label="房东签订日期" width="90"> 
                       <template slot-scope="scope">
                          {{scope.row.landlordSignTime}}
                        </template>
                    </el-table-column>
                </el-table> 
            </div>
          </div>
          <el-dialog title="审核毁约" :visible.sync="breakDialogVisible" :show-close="false">
            <el-form :model="checkForm">
              <el-form-item label="房源链上ID" :label-width="formLabelWidth">
                <el-input v-model="checkForm.houseId" :readyonly="true"  autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="惩罚地址" :label-width="formLabelWidth">
                <el-input v-model="checkForm.punishAddr"  id="punishAddr" @blur="inputBlur('punishAddr', checkForm.punishAddr)"  autocomplete="off"></el-input>
                 {{checkForm.punishAddrErr}}
              </el-form-item>
              <el-form-item  label="惩罚数量" :label-width="formLabelWidth"> 
                <el-input v-model="checkForm.punishAmount" id="punishAmount" @blur="inputBlur('punishAmount', checkForm.punishAmount)" autocomplete="off"></el-input>
                {{checkForm.punishAmountErr}}
              </el-form-item>
              <el-form-item  label="审查人地址" :label-width="formLabelWidth"> 
                <el-input v-model="checkForm.inspectAddr" id="inspectAddr" @blur="inputBlur('inspectAddr', checkForm.inspectAddr)" autocomplete="off"></el-input>
                {{checkForm.inspectAddrErr}}
              </el-form-item>
              <el-form-item  label="私钥" :label-width="formLabelWidth">
                <el-input v-model="checkForm.prikey" id="prikey" @blur="inputBlur('prikey', checkForm.prikey)"  autocomplete="off"></el-input>
                {{checkForm.prikeyErr}}
              </el-form-item>
              <el-form-item>
                 <el-button type="primary" @click="subBreak" v-bind:disabled="checkForm.beDisabled" style="float:right;">确 定</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <el-dialog title="审核毁约" :visible.sync="rejectBreakVisible" :show-close="false">
            <el-form :model="rejectForm">
              <el-form-item label="房源链上ID" :label-width="formLabelWidth">
                <el-input v-model="rejectForm.houseId" :readyonly="true"  autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="拒绝原因" :label-width="formLabelWidth">
                <el-input v-model="rejectForm.rejReason" id="rejReason" @blur="inputBlur('rejReason', rejectForm.rejReason)"  autocomplete="off"></el-input>
                {{rejectForm.rejReasonErr}}
              </el-form-item>
              <el-form-item  label="审查人地址" :label-width="formLabelWidth"> 
                <el-input v-model="rejectForm.inspectAddr" id="inspectAddr" @blur="inputBlur('rejectAddr', rejectForm.inspectAddr)" autocomplete="off"></el-input>
                {{rejectForm.inspectAddrErr}}
              </el-form-item>
              <el-form-item  label="私钥" :label-width="formLabelWidth">
                <el-input v-model="rejectForm.prikey" id="prikey" @blur="inputBlur('rejectPrikey', rejectForm.prikey)"  autocomplete="off"></el-input>
                {{rejectForm.prikeyErr}}
              </el-form-item>
              <el-form-item>
                 <el-button type="primary" @click="rejectBreak" v-bind:disabled="rejectForm.beDisabled" style="float:right;">确 定</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
    </div>
</template>
<script>
import itemcontainer from '../../components/itemcontainer'
import axios from 'axios';
import http from 'http';
import {UrlConfig, COMMENT_REMARK, SIGN_STATUS} from 'src/common/js/globe';
import util from 'src/common/js/util'; // 引入时间控件
export default {
    name: 'breakcontract',
    components: {
      itemcontainer
    },
    created(){
      this.initData();
    },
    data () {
      return {
        checkForm: {
           houseId: '',
           punishAddr: '',
           punishAmount: 0,
           inspectAddr: '',
           prikey: '',
           punishAddrErr: '',
           punishAmountErr: '',
           inspectAddrErr: '',
           prikeyErr: '',
           beDisabled: true
        },
        rejectForm: {
           houseId: '',
           rejReason: '',
           inspectAddr: '',
           prikey: '',
           rejReasonErr: '',
           inspectAddrErr: '',
           prikeyErr: '',
           beDisabled: true
        },
        signStatus: SIGN_STATUS,
        breakDialogVisible: false,
        rejectBreakVisible: false,
        isSus: false,
        btnStatus: 0,
        formLabelWidth: '100px',
        tableData: [],
        currentPage: 1,
        expendRow: [],
        remarks: COMMENT_REMARK,
        filters: {
            houseId: '',
            type: '5'
        }
      }
   },
   filters: {
      limitLen(src){
          let a = src.split('', 10);
          let b = a.join('');
          if (src.length <= 10) {
            return b;
          }
          return b + '...';
      }
   },
   methods : {
      initData(){
          try{
              this.getHouseData();
          } catch(err){
              console.log('获取数据失败', err);
          }
      },
      closeBut() {
         this.dialogVisible = false;
      },
      closeBreak() {
         this.checkForm = {};
      },
      getHouseData() {
          this.tableData = [];
          let houseId = this.filters.houseId;
          if (!this.filters.houseId || this.filters.houseId == '') {
              houseId = '0x';
          }
          console.log("house hash", this.filters.houseId)
          let url = UrlConfig.serverUrl+"/getagree/"+houseId;
          console.log(url);
          this.btnStatus = this.filters.type;
          axios.get(url, {}).then(res => {
                if(res.data.status) {
                    let releaseInfo = res.data.data; 
                    console.log(releaseInfo);
                    releaseInfo.forEach((item, index) => {
                        const tableData = {};
                        tableData.houseAddr = item.house_addr;
                        tableData.describe = item.describe;
                        tableData.info = item.info;
                        tableData.tenancy = item.tenancy;
                        tableData.rental = item.rental;
                        tableData.addr = item.addr;
                        tableData.leaserAddr = item.leaser_addr;
                        tableData.houseId = item.house_id;
                        tableData.txHash = item.tx_hash;
                        tableData.index = index;
                        tableData.houseUse = item.house_use;
                        tableData.payDeadline = item.pay_deadline;
                        tableData.payOne = item.pay_one;
                        tableData.flsify_month = item.flsify_month;
                        tableData.rentStartTime = this.dealTime(item.rent_start_time);
                        tableData.rentEndTime = this.dealTime(item.rent_end_time);
                        tableData.renewalBeforeMonth = item.renewal_before_month;
                        tableData.noticeBreakMonth = item.notice_break_month;
                        tableData.landlordSignTime = this.dealTime(item.landlord_sign_time);
                        tableData.state = item.state;
                        this.tableData.push(tableData);
                    })        
                } else {
                    console.log(res.data);            
                }
          }).catch(err => {
              console.log("bind error", err);
              this.$notify({title : '提示信息',message : "请检查网络状况!", type:'error'});
          });
      },
      search() {
          this.getHouseData();
      },
      tableRowClassName(row, index) {
          if (index === 1) {
            return 'info-row';
          } else if (index === 3) {
            return 'positive-row';
          }
          return '';
      },
      passCheck(row) {
         console.log("leaser sign", row);
         this.breakDialogVisible = true;
         this.checkForm.houseId = row.houseId;
      },
      rejectCheck(row) {
          console.log("break", row);
          if (row) {
            this.rejectForm.houseId = row.houseId;
         }
         this.rejectBreakVisible = true;
      },
      rejectBreak() { // 拒绝毁约
          let form = this.rejectForm;
          let url = UrlConfig.serverUrl+"/rejectbreak/"+form.houseId+"/"+form.rejReason+"/"+form.inspectAddr+"/"+form.prikey;
          console.log(url)
          axios.get(url, {}).then(res => {
                console.log(res.data);  
                if(res.data.status) {
                    this.$notify({
                        message: "已拒绝该申请！",
                        type: 'info',
                        duration: 2000,
                        onClose: action => {
                          this.rejectForm = {};
                          this.rejectBreakVisible = false; 
                          this.getHouseData();
                        }
                    });  
                } else  {
                    this.$notify({
                        message: "审核失败："+res.data.err,
                        type: 'info',
                        duration: 2000,
                        onClose: action => {
                          this.rejectForm = {};
                          this.rejectBreakVisible = false; 
                          this.getHouseData();
                        }
                    });      
                } 
          }).catch(err => {
              console.log("get house error", err);
              this.$notify({
                  message: "审核失败："+err.message,
                  type: 'error',
                  duration: 2000,
                  onClose: action => {
                    this.rejectForm = {};
                    this.rejectBreakVisible = false; 
                    this.getHouseData();
                  }
              });  
          });
      },
      subBreak() {
          let form = this.checkForm;
          let url = UrlConfig.serverUrl+"/checkbreak/"+form.houseId+"/"+form.punishAddr+"/"+form.punishAmount+"/"+form.inspectAddr+"/"+form.prikey;
          console.log(url)
          axios.get(url, {}).then(res => {
                console.log(res.data);  
                if(res.data.status) {
                    this.$notify({
                        message: "审核通过："+res.data.data,
                        type: 'info',
                        duration: 2000,
                        onClose: action => {
                          this.checkForm = {};
                          this.breakDialogVisible = false; 
                          this.getHouseData();
                        }
                    });  
                } else  {
                    this.$notify({
                        message: "审核失败："+res.data.err,
                        type: 'info',
                        duration: 2000,
                        onClose: action => {
                          this.dialogForm = {};
                          this.breakDialogVisible = false; 
                          this.getHouseData();
                        }
                    });      
                } 
          }).catch(err => {
              console.log("get house error", err);
              this.$notify({
                  message: "审核失败："+err.message,
                  type: 'error',
                  duration: 2000,
                  onClose: action => {
                    this.dialogForm = {};
                    this.breakDialogVisible = false; 
                    this.getHouseData();
                  }
              });  
          });
      },
      dealTime(src) {
          console.log(111111, src);
          if (!src) {
            return '';
          }
          let date = new Date();
          let time = date.setTime(src);
          let timeStamp = util.formatDate(new Date(time), 'yyyy/MM/dd'); // 将时间转为yyyy-MM-dd
          return timeStamp;
      },
      expand(row, status){
        if (status) {
          this.getSelectItemData(row)
        }else{
              const index = this.expendRow.indexOf(row.index);
              this.expendRow.splice(index, 1)
          }
      },
      getDetail(row) {
          this.getSelectItemData(row, 'edit')
          this.dialogFormVisible = true;
      },
      async getSelectItemData(row, type){
        const restaurant = await getResturantDetail(row.restaurant_id);
        const category = await getMenuById(row.category_id)
          this.selectTable = {...row, ...{restaurant_name: restaurant.name, restaurant_address: restaurant.address, category_name: category.name}};
          this.selectMenu = {label: category.name, value: row.category_id}
          this.tableData.splice(row.index, 1, {...this.selectTable});
          this.$nextTick(() => {
              this.expendRow.push(row.index);
          })
          if (type == 'edit' && this.restaurant_id != row.restaurant_id) {
            this.getMenu();
          }
      },
      inputBlur:function(errorItem,inputContent){
          let flag = true;
          let addrReg = /^0x[0-9a-fA-F]{40}$/;
          console.log(inputContent, addrReg.test(inputContent));
          if(errorItem === 'punishAddr') {
              if (inputContent === '') {
                  this.checkForm.punishAddrErr = '被惩罚的地址不能为空！';
                  flag = false;
              } else if (!addrReg.test(inputContent)) {
                  this.checkForm.punishAddrErr = '请输入正确被惩罚的地址！';
                  flag = false;
              } else {
                  this.checkForm.punishAddrErr = '';
              }
          } else if(errorItem === 'punishAmount') { 
              if (inputContent === '') {
                  this.checkForm.punishAmountErr = '惩罚数量不能为空！';
                  flag = false;
              }  else {
                  this.checkForm.punishAmountErr = '';
              }
          } else if(errorItem === 'inspectAddr') { 
              if (inputContent === '') {
                  this.checkForm.inspectAddrErr = '审核人地址不能为空！';
                  flag = false;
              }  else if (!addrReg.test(inputContent)) {
                  this.checkForm.inspectAddrErr = '请输入审查人正确的地址！';
                  flag = false;
              } else {
                  this.checkForm.inspectAddrErr = '';
              }
          } else if(errorItem === 'prikey') { 
              if (inputContent === '') {
                  this.checkForm.prikeyErr = '私钥不能为空！';
                  flag = false;
              }  else {
                  this.checkForm.prikeyErr = '';
              }
          } 
          //对于按钮的状态进行修改
          if (flag) {
              this.checkForm.beDisabled = false;
          } else {
              this.checkForm.beDisabled = true;
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
      top: 30%;
      left: 50%;
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      -o-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      width: 800px;
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
    .moveCenter {
       margin-left: 250px;
    }
    .widthContrl {
       width: 400px;
    }
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .table_container{
        padding: 20px;
    }
    .Pagination{
        display: flex;
        justify-content: flex-start;
        margin-top: 8px;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }
    .avatar {
        width: 120px;
        height: 120px;
        display: block;
    }
</style>
