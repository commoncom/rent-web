<template>
    <div class="home_container">
        <itemcontainer father-component="home"></itemcontainer>
        <!--发布房源-->
        <div id="bg" class="bg">
          <div class="login">
             <div class="login">
              <div class="logo">欢迎来到房屋浏览</div>
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
                            <span>{{ props.row.describe}}</span>
                          </el-form-item>
                          <el-form-item label="房东信息">
                            <span>{{ props.row.info}}</span>
                          </el-form-item>
                          <el-form-item label="租期">
                            <span>{{ props.row.tenancy }}</span>
                          </el-form-item>
                          <el-form-item label="租金">
                            <span>{{ props.row.rental}}</span>
                          </el-form-item>
                          <el-form-item label="期待你的样子">
                            <span>{{ props.row.hopeYou }}</span>
                          </el-form-item>
                          <el-form-item label="房东地址">
                            <span>{{ props.row.addr}}</span>
                          </el-form-item>
                          <el-form-item label="房东名字">
                            <span>{{props.row.userId}}</span>
                          </el-form-item>
                          <el-form-item label="房屋链上ID">
                            <span>{{props.row.houseId}}</span>
                          </el-form-item>
                          <el-form-item label="房屋交易Hash">
                            <span>{{props.row.txHash}}</span>
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
                    <el-table-column label="操作" width="160">
                      <template slot-scope="scope">
                         <router-link :to="{ 
                             path: '',     
                             params: {   
                                key: 'value',}}"> <button type="button">跳转</button> 
                          </router-link> 
                        <!--<el-button
                          size="small"
                          @click="getDetail(scope.row)">详情</el-button>
                        <el-button
                          size="small"
                          type="danger"
                          @click="breakRent(scope.$index, scope.row)">毁约</el-button>-->
                      </template>
                    </el-table-column>
                </el-table>
                <!--<div class="Pagination">
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      :page-size="20"
                      layout="total, prev, pager, next"
                      :total="count">
                    </el-pagination>
                </div> --->   
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import itemcontainer from '../../components/itemcontainer'
import axios from 'axios';
import http from 'http';
import {UrlConfig, OPTION_TYPE} from 'src/common/js/globe';
export default {
    name: 'getdetail',
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
      getParans() {
         let routerParams = this.$route.params.msgKey;
         this.tableData = routerParams;
         console.log(this.tableData);
      },
      initData(){
          try{
              this.getHouseData();
          } catch(err){
              console.log('获取数据失败', err);
          }
      },
      getHouseData() {
          this.tableData = [];
          let houseId = this.filters.houseId;
          if (!this.filters.houseId || this.filters.houseId == '') {
              houseId = '0x';
          }
          console.log("house hash", this.filters.houseId)
          let url = UrlConfig.serverUrl+"/gethouse/"+houseId+"/"+this.filters.type;
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
          // this.page.currentPage = 1;
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
      getDetail(data) {
         this.houseInfo = {};
         this.$router.push({path: '/'}); 
      },
      resetForm:function(){
          this.houseInfo = {};
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
   watch: {  
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可  
      '$route': 'getParams'  
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
