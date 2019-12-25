<template>
<div class="header">
    <div style="display:inline-block;height:100%;width:118px">
        <div style="float:left;width:160px">
            <el-menu :default-active="activeIndex" :active="activeIndex" mode="vertical" router>
                 <el-submenu index="1">
                    <template slot="title">
                      <span class="el-icon-user">登录注册</span>
                    </template>
                    <el-menu-item-group style="margin-left:30px;">
                      <el-menu-item index="/">登录</el-menu-item>
                      <el-menu-item index="/register">注册</el-menu-item>
                      <el-menu-item index="/getaddr">获取地址</el-menu-item>
                      <el-menu-item index="/register/getstatus">登录状态</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="2">
                    <template slot="title">
                      <span class="el-icon-menu">房源管理</span>
                    </template>
                    <el-menu-item-group style="margin-left:30px;">
                       <el-menu-item index="/release">发布房源</el-menu-item>
                       <el-menu-item index="/gethouse">获取房源</el-menu-item>
                       <el-menu-item index="/signagree">房东签约</el-menu-item>
                       <el-menu-item index="/signagree/getsign">查询签约</el-menu-item>
                       <el-menu-item index="/signagree/sign" :disabled="true">租客签约</el-menu-item>
                       <el-menu-item index="/breakcontract">审核毁约</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title">
                      <span class="el-icon-tickets">认证管理</span>
                    </template>
                    <el-menu-item-group style="margin-left:30px;">
                       <el-menu-item index="/auth">房屋认证</el-menu-item>
                       <el-menu-item index="/auth/getauth">获取认证</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="4">
                    <template slot="title">
                      <span class="el-icon-s-comment">评论管理</span>
                    </template>
                    <el-menu-item-group style="margin-left:30px;">
                       <el-menu-item index="/auth">评论房源</el-menu-item>
                       <el-menu-item index="/auth/getauth">获取评论</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="5">
                    <template slot="title">
                      <span class="el-icon-coin">通证管理</span>
                    </template>
                    <el-menu-item-group style="margin-left:30px;">
                       <el-menu-item index="/auth">转账</el-menu-item>
                       <el-menu-item index="/auth/getauth">余额</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </div>


    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            activeIndex: this.$route.path.split("/")[1],
        }
    },
    filters: {
        filterTitle(value) {
            let titleMap = {
                newindex: '态势总览',
                assetIdentify: '资产识别',
                AIDetail: '资产详情',
                AttackDetect: '攻击检测',
                ADDetail: '攻击详情',
                Attacker: '攻击者画像',
                statemonitor: '状态监控',
                simply: '资产拓扑',
                full: '资产拓扑',
                webshell: 'webShell'
            }
            return titleMap[value];
        }
    },
    mounted() {
        if (this.$route.path == "/toply/simply" || this.$route.path == "/toply/full") {
            this.activeIndex = "/toply/simply";
        } else {
            this.activeIndex = "/" + this.$route.path.split("/")[1];
        }

    },

    methods: {

    }
}
</script>

<style scoped>
.header {
    position: fixed;
    display: flex;
    box-sizing: border-box;
    float: left;
    left: 0px;
    height: 100%;
    top: 0%;
    width: 118px;
    font-size: 14px;
    line-height: 60px;
    /* padding-top: 10px; */
    background-color: #fff;
    z-index: 1000;
    /* padding: 0 32px 0 30px; */
    overflow: hidden;
    -webkit-transition: all ease-in-out 1s;
    -o-transition: all ease-in-out 1s;
    -moz-transition: all ease-in-out 1s;
    transition: all ease-in-out 1s;
}

.headerFull {
    box-sizing: border-box;
    left: 180px;

    width: 100%;
    height: 60px;
    font-size: 14px;
    line-height: 60px;
    background-color: #fff;
    z-index: 1000;
    padding: 0 32px 0 30px;
    overflow: hidden;
    -webkit-transition: all ease-in-out 1s;
    -o-transition: all ease-in-out 1s;
    -moz-transition: all ease-in-out 1s;
    transition: all ease-in-out 1s;
}

.header .logo {
    float: left;
    cursor: pointer;
    font-size: 25px;
}

.logo_prefix {

    color: #fff;
}

.logo_suffix {
    color: #fff;
}

.header .search {
    float: left;
    color: #fff;
    font-size: 14px;
}

.website span {
    display: inline-block;
    color: #209e91;
}

.website span:first-child {
    color: #fff;
}

.header-right {
    padding-top: 25px;
    line-height: 10px;
}

.header-right span {
    display: inline-block;
    margin-left: 14px;
    font-size: 18px;
    color: #fff;
    line-height: 1px;
    height: 18px;
    cursor: pointer;

}

.header-right span:hover {
    color: #209e91;

}

.user-header {
    line-height: 10px;
    padding-top: 7px;
    font-size: 12px;
    float: right;
    margin-right: 5%
}

.user-header img {
    border-radius: 50%;
    cursor: pointer;
}

.pop-image {
    display: block;
    float: left;
}

.pop-image img {
    border-radius: 50%;
}

.pop-div {
    height: 55px;
    clear: both;
}

.pop-content {
    display: block;
    font-size: 12px;
    line-height: 14px;
    padding-top: 15px;
    margin-left: 60px;
}

.pop-time {
    display: block;
    float: right;
    font-size: 10px;
    color: #ccc;

}

.pop-title {
    font-size: 12px;
    color: #209e91;
}

.task-div {
    clear: both;
    height: 55px;
}

.task-span {
    display: block;
    float: left;
    font-size: 12px
}

.task-content {
    width: 160px;
    line-height: 16px;
    margin-left: 10px;
    padding: 5px;
}

.task-time {
    clear: both;
    float: right;
    color: #ccc;

}

.setting-div {
    position: relative;
    height: 30px;
    /* line-height: 30px; */
    /* background-color: #209e91; */
    clear: both;
    width: 110px;
    /* margin-top: 50px; */
}

.setting-div span {
    width: 50px;
    /* display: block; */
    /* float: left; */
    /* font-size: 12px; */
}

.setting-icon {
    padding-top: 3px;
    padding-right: 3px;
}

@media screen and (max-width: 1920px) {
    .dropdown {
        float: right;
        margin-right: 10px;
    }
}

@media screen and (max-width : 1681px) {
    .dropdown {
        float: right;
        margin-right: 10px
    }
}

.svg-icon {
    margin-top: 16%;
    width: 5em !important;
    height: 2em !important;
    transform: translate(0, 0px)
}

.idsvs.svg-icon {
    width: 5em !important;
    height: 4em !important;
    transform: translate(30px, -10px)
}

.title {
    margin-bottom: 150px;
    display: block;
    /* min-width: 180px; */
    /* text-overflow: ellipsis; */
    white-space: nowrap;
    /* font-size: 1.5em; */
    font-size: 30px;
    color: rgb(163, 177, 191);
    font-weight: bold;
    text-decoration: none;

}
</style>
<style>
.el-dropdown-menu {
    left: 94% !important;
    right: 10px !important;

}

.el-menu-item {
    padding: 0 0 0 10px !important;

}
</style>
