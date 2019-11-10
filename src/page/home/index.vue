<template>
  	<div class="home_container">
        <itemcontainer father-component="home"></itemcontainer>
        <div v-if="showLoginForm == false" id="bg" class="bg">
          <div class="login" @keyup.13="doLogin">
             <div class="form-horizontal login">
              <div class="logo">欢迎来到租房空间</div>
              <div class="form-group input-group input-group-lg ">
                <span class="input-group-addon"><i class="fa fa-user-o" aria-hidden="true"></i></span>
                <input type="text" class=" form-control input_wid" placeholder="请输入地址" v-model="userInfo.address">
              </div>
              <div class="form-group input-group input-group-lg ">
                <span class="input-group-addon"><i class="fa fa-user-o" aria-hidden="true"></i></span>
                <input type="text" class=" form-control input_wid" placeholder="请输入用户名" v-model="userInfo.userName">
              </div>
              <div class="form-group input-group input-group-lg">
                <span class="input-group-addon"><i class="fa fa-key" aria-hidden="true"></i></span>
                <input type="password" class=" form-control input_wid" placeholder="请输入密码" v-model="userInfo.password">
              </div>
              <div class="form-group">
                <!--<el-button class="form-control" @click="doLogin">登 录</el-button>-->
                <el-button class="form-control" @click="doLogin">登 录</el-button>
                <!-- <button class="btn btn-default btn-sm form-control login-btn" @click="doLogin">注 册</button>-->
              </div>
            </div>
          </div>
        </div>
        </div>
    </div>
</template>
<script>
import itemcontainer from '../../components/itemcontainer'
import axios from 'axios';
import {packOpt} from 'src/common/js/com_fun';
export default {
	  name: 'home',
  	components: {
  		itemcontainer
  	},
    created(){
        this.showLoginForm = false;
    },
    data () {
    return {
      userInfo :{
          address: '',
          userName : '',
          password : '',
          password: '',
          retpassword: ''
      },
      showLoginForm : false,
    }
  },
  methods : {
      doLogin (){
          if (!this.validateReLg()) {
             return false;
          }
          let form = this.userInfo;
          let requestPath = "/login/"+form.address+"/"+form.userName+"/"+form.pwd+"/"+form.prikey;
          let option = packOpt(requestPath);
          http.get(options, function(res){
              res.on('data', (res) => {
                  if (res) {
                      let parsedData_1 = JSON.parse(data.toString());
                      console.info("---request data------", parsedData_1);
                      this.$notify({
                          title : '提示信息',
                          message : '登录成功',
                          type : 'success'
                      });
                      this.$router.push({path:'/'})
                  } else {
                      this.$notify({
                          title : '提示信息',
                          message : '账号或密码错误',
                          type : 'error'
                      });
                  }
              });
          });
          // axios.post('/login',JSON.stringify(this.userInfo)).then(res => {
          //         console.log(res)
          //         if(res.status == 200){
          //             this.$store.commit('setToken',res.data);
          //             localStorage.userName = this.userInfo.userName;
          //             localStorage.token_expire = res.data.expire;
          //             localStorage.token = res.data.token;
          //             this.$notify({
          //                 title : '提示信息',
          //                 message : '登录成功',
          //                 type : 'success'
          //             });
          //             this.$router.push({path:'/'})
          //         }else {
          //             this.$notify({
          //                 title : '提示信息',
          //                 message : '账号或密码错误',
          //                 type : 'error'
          //             });
          //         }
          // })
          // .catch(err => {
          //     console.log(err)
          // })
      },
      validateReLg() {
          if (!(/^0x[0-9a-fA-F]{40}$"/.test(this.userInfo.address))) {
              alert('该地址不是以太坊地址');
          }
          if (this.userInfo.userName == ''){
              alert('用户名不能为空');
              return false
          }
          if (this.userInfo.password == ''){
              alert('密码不能为空');
              return false
          }
        },
  },
  mounted (){
      // var wi=window.screen.width;
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
      font-size: 50px;
    }
    .input_wid {
       width:350px;
       font-size: 16px;
    }
</style>
