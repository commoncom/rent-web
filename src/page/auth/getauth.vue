<template>
    <div class="home_container">
        <itemcontainer father-component="home"></itemcontainer>
        <!--发布房源-->
        <div id="bg" class="bg">
          <div class="login">
             <div class="login">
              <div class="logo moveCenter">欢迎来到授权查看认证</div>
                    <el-col class="toolbar" style="padding-bottom:0px;height:50px;">
                      <el-form :inline="true" :model="filters">
                              <el-form-item :span="6">
                                  <el-input type="text" style="width:400px;" id="houseId" v-model="filters.houseId" placeholder="房屋链上ID" @blur="inputBlur('houseId',filters.houseId)"></el-input>
                              </el-form-item>
                              <!-- 设置查询Form-->
                              <el-form-item >
                                  <el-button type="primary" icon="el-icon-search" @click="search" style="width:100px;">查询</el-button>
                              </el-form-item>
                      </el-form>
                    </el-col>
                    <el-table :data="tableData">
                    <el-table-column label="房屋链上ID" width="265">  
                        <template slot-scope="scope">
                          {{scope.row.houseId}}
                        </template>
                    </el-table-column>
                    <el-table-column
                      label="请求授权方地址" width="220"
                      prop="leaserAddr">
                    </el-table-column> 
                    <el-table-column label="房东地址" width="222" prop="landlordAddr">
                    </el-table-column>
                    <el-table-column label="授权访问状态" width="80">
                       <template slot-scope="scope">
                          {{approveList[scope.row.state]}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="160">
                      <template slot-scope="scope">
                        <el-button v-if="scope.row.state == 0"
                          size="small"
                          type="primary" 
                          @click="approve(scope.row)">授权</el-button>
                        <el-button v-if="scope.row.state == 1"
                          size="small"
                          type="primary" 
                          @click="inspectApprove(scope.row)">查看授权</el-button>
                        <el-button v-if="scope.row.state == 0"
                          size="small"
                          type="danger"
                          @click="rejectApprove(scope.row)">拒绝</el-button>
                      </template>
                    </el-table-column>
                </el-table> 
            </div>
          </div>
           <el-dialog top title="授权访问" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                  <el-form-item label="房屋链上ID" :label-width="formLabelWidth">
                    <el-input v-model="form.houseId" :readonly="true"  autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="请求授权方地址" :label-width="formLabelWidth">
                    <el-input v-model="form.leaserAddr"  :readonly="true"  autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="房东地址" :label-width="formLabelWidth">
                    <el-input v-model="form.landlordAddr"  :readonly="true" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="私钥" :label-width="formLabelWidth">
                    <el-input v-model="form.prikey" autocomplete="off" id="prikey" @blur="inputBlur('prikey',form.prikey)"></el-input>
                    {{form.prikeyErr}}
                  </el-form-item>
                   <el-form-item :label-width="formLabelWidth">
                     <el-button style="float:right;" type="primary" v-bind:disabled="form.beDisabled" @click="comfirmSub">确 定</el-button>
                  </el-form-item>
              </el-form>
          </el-dialog>
          <el-dialog :title="regTitle" :visible.sync="dialogVisible" top :show-close="false">
            <el-form :model="form">
              <el-form-item label="状态" :label-width="formLabelWidth">
                <el-input v-model="dialogForm.status"   autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item v-if = "isSus" label="链上Hash" :label-width="formLabelWidth">
                <el-input v-model="dialogForm.data"  :readonly="true" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item v-else label="错误原因" :label-width="formLabelWidth">
                <el-input v-model="dialogForm.err"  :readonly="true" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="closeBut">确 定</el-button>
            </div>
          </el-dialog>
          <el-dialog top title="认证信息" :visible.sync="authInfoVisible">
              <el-form :model="authForm">
                  <el-form-item label="房屋链上ID" :label-width="formLabelWidth">
                    <el-input v-model="authForm.houseId" :readonly="true"  autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="房屋唯一码" :label-width="formLabelWidth">
                    <el-input v-model="authForm.guid"  :readonly="true"  autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="房东名字" :label-width="formLabelWidth">
                    <el-input v-model="authForm.ownerName"  :readonly="true" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="房东身份证号" :label-width="formLabelWidth">
                    <el-input v-model="authForm.idCard" :readonly="true" autocomplete="off"></el-input>
                  </el-form-item>
                   <el-form-item :label-width="formLabelWidth">
                     <el-button style="float:right;" type="primary" v-bind:disabled="form.beDisabled" @click="comfirmSub">确 定</el-button>
                  </el-form-item>
              </el-form>
          </el-dialog>
        </div>
    </div>
</template>
<script>
import itemcontainer from '../../components/itemcontainer'
import axios from 'axios';
import http from 'http';
import {UrlConfig, APPROVE_STATUS} from 'src/common/js/globe';
export default {
    name: 'gethouse',
    components: {
      itemcontainer
    },
    created(){
      this.initData();
    },
    data () {
      return {
        form: {
           houseId: '',
           leaserAddr: '',
           landlordAddr: '',
           prikey: '',
           prikeyErr: '',
           beDisabled: true
        },
        dialogForm: {
           status: '',
           data: '',
           err: ''
        },
        authForm: {
           houseId: '',
           guid: '',
           idCard: '',
           ownerName: '',
           beDisabled: true
        },
        approveList: APPROVE_STATUS,
        regTitle: '授权中，请等待...',
        dialogFormVisible: false,
        dialogVisible: false,
        authInfoVisible: false,
        isSus: false,
        btnStatus: 0,
        formLabelWidth: '140px',
        tableData: [],
        currentPage: 1,
        expendRow: [],
        filters: {
            houseId: ''
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
              this.gethAuthData();
          } catch(err){
              console.log('获取数据失败', err);
          }
      },
      closeBut() {
         this.dialogForm = {};
         this.dialogVisible = false;
          this.dialogFormVisible = false; 
         this.gethAuthData();
      },
      gethAuthData() {
          this.tableData = [];
          let houseId = this.filters.houseId;
          if (!this.filters.houseId || this.filters.houseId == '') {
              houseId = '0x';
          }
          console.log("house hash", this.filters.houseId)
          let url = UrlConfig.serverUrl+"/getauth/"+houseId;
          console.log(url);
          axios.get(url, {}).then(res => {
                if(res.data.status) {
                    let authInfo = res.data.data; 
                    console.log(authInfo);  
                    authInfo.forEach((item, index) => {
                        const tableData = {};
                        tableData.houseId = item.house_id;
                        tableData.leaserAddr = item.leaser_addr;
                        tableData.landlordAddr = item.landlord_addr;
                        tableData.index = index;
                        tableData.state = item.state;
                        this.tableData.push(tableData);
                    });        
                } else {
                    console.log(res.data);            
                }
          }).catch(err => {
              console.log("bind error", err);
              this.$notify({title : '提示信息',message : "请检查网络状况!", type:'error'});
          });
      },
      search() {
          this.gethAuthData();
      },
      tableRowClassName(row, index) {
          if (index === 1) {
            return 'info-row';
          } else if (index === 3) {
            return 'positive-row';
          }
          return '';
      },
      comfirmSub() {
          console.log("comfirm Sub", this.form);
          this.dialogVisible = true;
          let url = UrlConfig.serverUrl+"/approve/"+this.form.houseId+"/"+this.form.leaserAddr+"/"+this.form.landlordAddr+"/"+this.form.prikey;
          console.log(url);
          this.regTitle = "授权结果";
          axios.get(url, {}).then(res => {
                console.log(res.data);  
                if(res.data.status) {
                    this.dialogForm.status = "成功";
                    this.dialogForm.data = res.data.data; 
                    this.dialogFormVisible = false;
                    this.dialogVisible = false;  
                } else {
                    this.dialogForm.status = "失败";
                    this.dialogForm.err = res.data.err;
                    console.log(res.data);            
                }
          }).catch(err => {
              console.log("get house error", err);
              this.dialogForm.status = "失败";
              this.dialogForm.err = res.data.err;
          });
      },
      approve(row) {
          console.log("approve row", row);
          this.form.houseId = row.houseId;
          this.form.leaserAddr = row.leaserAddr;
          this.form.landlordAddr = row.landlordAddr;
          this.dialogFormVisible = true;
          this.dialogVisible = false;
      },
      inspectApprove(row) {
          console.log("inspect approve", row);
          let url = UrlConfig.serverUrl+"/getAuthInfo/"+row.houseId+"/"+row.leaserAddr;
          console.log(url);
          axios.get(url, {}).then(res => {
                console.log(res.data);  
                if(res.data.status) {
                    this.authInfoVisible = true;
                    console.log(res.data.data);
                    this.authForm.idCard = res.data.data[0];
                    this.authForm.guid = res.data.data[1]; 
                    this.authForm.ownerName = res.data.data[2]; 
                    this.authForm.houseId = res.data.data[3];  
                } else {
                    this.$notify({
                        message: "查看授权失败："+res.data.err,
                        type: 'error',
                        duration: 2000
                    });
                    console.log(res.data);            
                }
          }).catch(err => {
              console.log("get auth error", err);
              this.$notify({
                  message: "查看授权失败："+res.data.err,
                  type: 'error',
                  duration: 2000
              });
          });
      },
      rejectApprove(row) {
          console.log("rejectApprove row", row);
          this.dialogFormVisible = false;
          this.dialogVisible = true;
          let url = UrlConfig.serverUrl+"/reject/"+row.houseId+"/"+row.leaserAddr;
          console.log(url);
          this.regTitle = "授权结果";
          axios.get(url, {}).then(res => {
                console.log(res.data);  
                if(res.data.status) {
                    this.dialogForm.data = res.data.data; 
                } else {
                    this.dialogForm.status = "失败";
                    this.dialogForm.err = res.data.err;
                    console.log(res.data);            
                }
          }).catch(err => {
              console.log("get house error", err);
              this.dialogForm.status = "失败";
              this.dialogForm.err = res.data.err;
          });
      },
      inputBlur:function(errorItem,inputContent){
          let flag = true;
          if(errorItem === 'prikey') {
              if (inputContent === '') {
                  this.form.prikeyErr = '私钥不能为空！';
                  flag = false;
              } else {
                  this.form.prikeyErr = '';
              }
          } 
          //对于按钮的状态进行修改
          if (flag) {
              this.form.beDisabled = false;
          }else{
              this.form.beDisabled = true;
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
      top: 20%;
      left: 50%;
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      -o-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      width: 950px;
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
