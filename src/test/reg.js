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
<el-table
    :data="tableData"
    @expand='expand'
    :expand-row-keys='expendRow'
    :row-key="row => row.index"
    style="width: 100%; position:absolute;">
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
          <el-form-item label="房屋链上ID">
            <span>{{props.row.houseId}}</span>
          </el-form-item>
          <el-form-item label="租户地址">
            <span>{{props.row.leaserAddr}}</span>
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
           <el-form-item label="违约金(Token/日)">
            <span>{{props.row.flsify_month}}个</span>
          </el-form-item>
          <el-form-item label="毁约理由" v-if="props.row.state == '6'">
            <span>{{props.row.reason}}</span>
          </el-form-item>
           <el-form-item label="租赁开始时间">
            <span>{{props.row.rentStartTime}}</span>
          </el-form-item>
          <el-form-item label="租赁结束时间">
            <span>{{props.row.rentEndTime}}</span>
          </el-form-item>
          <el-form-item>
          </el-form-item>
          <el-form-item>
            <el-button v-if="props.row.state == '0' || props.row.state == 0"                              size="small" type="primary"
                @click="leaserSign(props.row)">租客签订</el-button>
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
package main

import (
"fmt"
)

func main() {
   // 定义一个3行4列的二维数组，逐个从键盘输入值，编写程序将四周的数据清0
   var N, M int
   fmt.Scanln(&N,&M)
   n:=N
   m:=M
   var arr = [n][m]int{}
   for i := 0; i < len(arr); i++ {
      for j := 0; j < len(arr[i]); j++ {
         x := 0
         fmt.Scanln(&x)
         arr[i][j] = x
      }
   }
   //输出原数组
   fmt.Println("输出原数组：")
   for i := 0; i < len(arr); i++ {
      for j := 0; j < len(arr[i]); j++ {
         fmt.Print(arr[i][j], "\t")
      }
      fmt.Print("\n")
   }
   // 输出周围为0的数组
   fmt.Println("输出周围为0的数组：")
   for i := 0; i < len(arr); i++ {
      for j := 0; j < len(arr[i]); j++ {
         if i == 0 || i == len(arr)-1 || j == 0 || j == len(arr[i])-1 {
            fmt.Print("0\t")
         } else {
            fmt.Print(arr[i][j], "\t")
         }
      }
      fmt.Print("\n")
   }
}