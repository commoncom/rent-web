let comCos = require("./common/globe.js");
let tracking = require("./db/user.js");
let nonceMap = new Map();
// 获取用户列表
function getUser(db, userName) {
    return new Promise((resolve, reject) => {
        tracking.updateUserStatus(db, "", addr, 2);
   });
}
// 编辑用户
function editUser(db, userId) {
    return new Promise((resolve, reject) => {
        tracking.updateUserStatus(db, "", addr, 2);
   });
}
// 添加用户
function addUser(db, userName, userId, img, telPhone, pwd) {
    return new Promise((resolve, reject) => {
        tracking.updateUserStatus(db, "", addr, 2);
   });
}


// 删除用户
function deleteUser(db, userId) {
    return new Promise((resolve, reject) => {
        
    });
}
function batchDelete(db, userIds) {
    return new Promise((resolve, reject) => {
        
    });
}


module.exports = {
    getVideo,
    exportVideo,
    deleteVideo
}