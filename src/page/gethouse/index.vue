<template>
    <div class="home_container">
        <itemcontainer father-component="home"></itemcontainer>
        <!--发布房源-->
        <div id="bg" class="bg">
          <div class="login">
             <div class="login">
              <div class="logo">欢迎来到房屋浏览</div>
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
                          <el-form-item label="房屋地址">
                            <span>{{props.row.houseAddr}}</span>
                          </el-form-item>
                          <el-form-item label="房屋描述">
                            <span>{{props.row.describe}}</span>
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
                          <el-form-item label="期待你的样子">
                            <span>{{props.row.hopeYou}}</span>
                          </el-form-item>
                          <el-form-item label="房屋评级等级">
                            <span>{{props.row.huxing}}</span>
                          </el-form-item>
                          <el-form-item label="房东地址">
                            <span>{{props.row.userAddr}}</span>
                          </el-form-item>
                          <el-form-item label="房屋链上ID">
                            <span>{{props.row.houseId}}</span>
                          </el-form-item>
                          <el-form-item label="房屋交易Hash">
                            <span>{{props.row.txHash}}</span>
                          </el-form-item>
                          <el-form-item>
                          </el-form-item>
                          <el-form-item>
                            <el-button
                                size="medium"
                                @click="jumpDetail(props.row)">预定</el-button>
                          </el-form-item>
                        </el-form>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="房屋链上ID"
                      prop="houseId">
                    </el-table-column>
                    <el-table-column
                      label="房屋地址"
                      prop="addr">
                    </el-table-column>
                    <el-table-column
                      label="租金"
                      prop="rental">
                    </el-table-column>
                    <el-table-column label="房屋描述" width="160" prop="describe">
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
        </div>
    </div>
</template>
<script>
import itemcontainer from '../../components/itemcontainer'
import axios from 'axios';
import http from 'http';
import {UrlConfig, OPTION_TYPE} from 'src/common/js/globe';
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
        regTitle: '预约结果',
        dialogFormVisible: false,
        dialogVisible: false,
        isSus: false,
        formLabelWidth: '100px',
        offset: 0, // new
        limit: 20,
        count: 0,
        tableData: [],
        currentPage: 1,
        expendRow: [],
        options: OPTION_TYPE,
        filters: {
            houseId: '',
            type: '0'
        }
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
                    console.log(res.data);       
                } else {
                    console.log(res.data);            
                }
          }).catch(err => {
              console.log("bind error", err);
              this.$notify({title : '提示信息', message : "请检查网络状况!", type:'error'});
          });
      },
      jumpDetail(row) {
         console.log(row);
         this.dialogFormVisible = true;
         this.form.houseId = row.houseId;
         this.form.rental = row.rental;
      },
      resetForm(){
          this.houseInfo = {};
      },
      inputBlur(errorItem,inputContent) {
          let flag = true;
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
              }else{
                  this.userInfo.addrErr = '';

              }
          } 
          //对于按钮的状态进行修改
          if (flag) {
              this.userInfo.beDisabled = false;
          }else{
              this.userInfo.beDisabled = true;
          }
      },
      deleteSpecs(index){
        this.specs.splice(index, 1);
      },
      handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
          this.currentPage = val;
          this.offset = (val - 1)*this.limit;
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
