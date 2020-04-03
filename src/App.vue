<template>
	<div>
		<v-head></v-head>
    <el-header style="text-align: center;font-family: 'DejaVu Sans Mono';color: lightblue;font-size: 30px;">
        基于区块链的租房系统
    </el-header> 
    <el-card style="margin:10px 10px 10px 165px;height:1500px">
          	
    <router-view ></router-view>

    </el-card> 
    </div>
</template>

<script>
    import vHead from './components/header.vue';

  	export default {
            components:{
            vHead
        }
  	}

</script>

<style>
  	  .el-header {
    background-color: #409eff;
    color: #333;
    line-height: 60px;
    /* margin-bottom:100px; */
  }
  .logo{
      padding-top:140px;
      /* font-size:20px; */
      width:100% !important;
      opacity: 0;
  }
</style>
