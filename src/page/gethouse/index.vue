<template>
    <div class="home_container">
        <itemcontainer father-component="home"></itemcontainer>
        <!--发布房源-->
        <div id="bg" class="bg">
             <div class="login">
                  <div class="logo moveCenter">欢迎来到房屋浏览</div>
                    <el-col class="toolbar" style="padding-bottom:0px;height:50px;">
                      <el-form :inline="true" :model="filters">
                              <el-form-item :span="6">
                                  <el-input type="text" style="width:240px;" id="houseId" v-model="filters.houseId" placeholder="房屋链上ID" @blur="inputBlur('houseId',houseInfo.houseId)"></el-input>
                              </el-form-item>
                              <!-- 操作类型下拉查询-->
                              <el-form-item :span="3">
                                  <el-select v-model="filters.type" clearable placeholder="房屋状态">
                                      <el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value">
                                      </el-option>
                                  </el-select>
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
                          <el-form-item label="房屋链上ID">
                            <span>{{props.row.houseId}}</span>
                          </el-form-item>
                          <el-form-item label="房屋交易Hash">
                            <span>{{props.row.txHash}}</span>
                          </el-form-item>
                          <el-form-item label="房东信息">
                            <span>{{props.row.info}}</span>
                          </el-form-item>
                          <el-form-item label="租期">
                            <span>{{props.row.tenancy}}</span>
                          </el-form-item>
                          <el-form-item label="租金">
                            <span>{{props.row.rental}}</span>
                          </el-form-item>
                          <el-form-item label="房东地址">
                            <span>{{props.row.userAddr}}</span>
                          </el-form-item>
                          <el-form-item label="期待你的样子">
                            <span>{{props.row.hopeYou}}</span>
                          </el-form-item>
                           <el-form-item label="房屋描述">
                            <span>{{props.row.describe}}</span>
                          </el-form-item>
                          <el-form-item>
                            <el-button v-if="btnStatus == 0"
                                size="small" type="primary"
                                @click="orderHouse(props.row)">预定房屋</el-button>
                            <el-button v-else-if="btnStatus == 1"
                                size="small" type="primary"
                                @click="inspectBreak(props.row)">签订合同</el-button>
                            <el-button v-else-if="btnStatus == 2"
                                size="small" type="success "
                                @click="achieveRent(props.row)">完成租赁</el-button>
                            <el-button v-else-if="btnStatus == 4"
                                size="small" type="warning "
                                @click="inspectBreak(props.row)">审核毁约</el-button>
                            <el-button v-else
                                size="small" type="primary"
                                @click="withdrawRent(props.row)">退回押金</el-button>
                            <el-button v-if="btnStatus != 0"
                                size="small" type="danger"
                                @click="breakContract(props.row)">毁约合同</el-button>
                            <el-button type="primary"
                                size="small"
                                @click="lookAuth(props.row)">查看认证</el-button>
                            <el-button v-if="btnStatus == 0" type="primary"
                                size="small"
                                @click="cacle(props.row)">撤销租赁</el-button>
                          </el-form-item>
                        </el-form>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="房屋地址"
                      prop="houseAddr">
                    </el-table-column>
                    <el-table-column
                      label="房屋链上ID">  
                        <template slot-scope="scope">
                          {{scope.row.houseId | limitLen}}
                        </template>
                    </el-table-column>
                    <el-table-column
                      label="租金"
                      prop="rental">
                    </el-table-column>
                    <el-table-column label="房屋描述" width="160" prop="describe">
                    </el-table-column>
                    <el-table-column label="房屋评价等级" width="80"> 
                       <template slot-scope="scope">
                          {{remarks[scope.row.huxing]}}
                        </template>
                    </el-table-column>
                </el-table> 
            </div>
          </div>
           <el-dialog title="预定房租" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                  <el-form-item label="房屋链上ID" :label-width="formLabelWidth">
                    <el-input v-model="form.houseId"   autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="租金" :label-width="formLabelWidth">
                    <el-input v-model="form.rental"  autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="地址" :label-width="formLabelWidth">
                    <el-input v-model="form.addr"   autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="私钥" :label-width="formLabelWidth">
                    <el-input v-model="form.prikey" autocomplete="off"></el-input>
                  </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="comfirmSub">确 定</el-button>
              </div>
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
          <el-dialog title="请求查看认证" top :visible.sync="authVisible">
                <el-form :model="authForm">
                  <el-form-item label="房屋链上ID" :label-width="formLabelWidth">
                    <el-input v-model="authForm.houseId" :readyonly="true"  autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="房东地址" :label-width="formLabelWidth">
                    <el-input v-model="authForm.landlordAddr" :readyonly="true"  autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="地址" :label-width="formLabelWidth">
                    <el-input v-model="authForm.addr" id="addr" @blur="inputBlur('addr', authForm.addr)" autocomplete="off"></el-input>
                    {{authForm.addrErr}}
                  </el-form-item>
                  <el-form-item>
                     <el-button type="primary" @click="requireAuth" v-bind:disabled="authForm.beDisabled" style="float:right;">确 定</el-button>
                  </el-form-item>
              </el-form>
          </el-dialog>
    </div>
</template>
<script>
import itemcontainer from '../../components/itemcontainer'
import axios from 'axios';
import http from 'http';
import {UrlConfig, OPTION_TYPE, COMMENT_REMARK} from 'src/common/js/globe';
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
           houseId: '',
           rental: '',
           addr: '',
           prikey: ''
        },
        dialogForm: {
           status: '',
           data: '',
           err: ''
        },
        authForm: {
           houseId: '',
           landlordAddr: '',
           addr: '',
           addrErr: '',
           beDisabled: true
        },
        regTitle: '预约结果',
        dialogFormVisible: false,
        dialogVisible: false,
        authVisible: false,
        isSus: false,
        btnStatus: 0,
        formLabelWidth: '100px',
        tableData: [],
        currentPage: 1,
        expendRow: [],
        options: OPTION_TYPE,
        remarks: COMMENT_REMARK,
        filters: {
            houseId: '',
            type: '0'
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
      getHouseData() {
          this.tableData = [];
          let houseId = this.filters.houseId;
          if (!this.filters.houseId || this.filters.houseId == '') {
              houseId = '0x';
          }
          console.log("house hash", this.filters.houseId)
          let url = UrlConfig.serverUrl+"/gethouse/"+houseId+"/"+this.filters.type;
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
                        tableData.hopeYou = item.hope_you;
                        tableData.addr = item.addr;
                        tableData.houseId = item.house_id;
                        tableData.userAddr = item.addr;
                        tableData.txHash = item.tx_hash;
                        tableData.index = index;
                        tableData.huxing = item.huxing;
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
      comfirmSub() {
          console.log("comfirm Sub", this.form);
          this.dialogVisible = true;
          let url = UrlConfig.serverUrl+"/requestsign/"+this.form.addr+"/"+this.form.prikey+"/"+this.form.houseId+"/"+this.form.rental;
          console.log(url)
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
      orderHouse(row) {
         console.log(row);
         this.dialogFormVisible = true;
         this.form.houseId = row.houseId;
         this.form.rental = row.rental;
      },
      cancle(row) {
         console.log("cancle", row);
      },
      breakContract(row) {
         console.log("break", row);
      },
      inspectBreak(row) {
         console.log("inspect", row);
      },
      achieveRent(row) {
         console.log("achieveRent", row);
      },
      withdrawRent(row) {
         console.log("withdrawRent", row);
      },
      lookAuth(row) {
         console.log("look auth", row);
         this.authForm.houseId = row.houseId;
         this.authForm.landlordAddr = row.addr;
         this.authVisible = true;
      },
      requireAuth(){
          console.log("requireAuth", this.authForm);
          let url = UrlConfig.serverUrl+"/requestapprove/"+this.authForm.houseId+"/"+this.authForm.landlordAddr+"/"+this.authForm.addr;
          console.log(url)
          axios.get(url, {}).then(res => {
                console.log(res.data);  
                if(res.data.status == 200) {
                    this.$notify({
                        message: "已成功请求查看房屋授权",
                        type: 'success',
                        duration: 2000,
                        onClose: action => {
                            this.$router.push({
                                path: 'auth/getauth',
                                params: {
                                  key: 'key',
                                  msgKey: this.authForm
                                }
                            });
                        }
                    });
                } else if (res.data.status == 201) {
                    this.$notify({
                        message: "已请求过查看房屋授权",
                        type: 'info',
                        duration: 2000,
                        onClose: action => {
                            this.$router.push({
                                path: 'auth/getauth',
                                params: {
                                  key: 'key',
                                  msgKey: this.authForm
                                }
                            });
                        }
                    });
                } else {
                    this.$notify({
                      message: "请求查看授权失败",
                      type: 'warning',
                      duration: 2000,
                      onClose: action => {
                         this.authForm.addr = "";
                      }
                    });          
                }
          }).catch(err => {
              console.log("get house error", err);
              this.$notify({
                message: "请求查看授权失败"+err.message,
                type: 'warning',
                duration: 2000,
                onClose: action => {
                   this.authForm.addr = "";
                }
              }); 
          });
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
      handleSelect(index){
        this.selectIndex = index;
        this.selectMenu = this.menuOptions[index];
      },
      inputBlur:function(errorItem,inputContent){
          let flag = true;
          let addrReg = /^0x[0-9a-fA-F]{40}$/;
          console.log(inputContent, addrReg.test(inputContent));
          if(errorItem === 'addr') {
              if (inputContent === '') {
                  this.authForm.addrErr = '地址不能为空';
                  flag = false;
              } else if (!addrReg.test(inputContent)) {
                  this.authForm.addrErr = '请输入正确的地址！';
                  flag = false;
              } else {
                  this.authForm.addrErr = '';
              }
          } 
          //对于按钮的状态进行修改
          if (flag) {
              this.authForm.beDisabled = false;
          } else{
              this.authForm.beDisabled = true;
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
