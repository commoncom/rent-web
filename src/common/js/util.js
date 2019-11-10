/** 格式化时间
 *  @param {string} date 需要格式化的时间
 *  @param {string} fmt 想要格式化的格式
 */
exports.formatDate = (date, fmt) => {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};
/** 格式化时间，返回年，月，日
 *  @param {string } date 需要格式化的时间
 */
exports.objectDate = (date) => {
    if (date && typeof date === 'string') {
        date = new Date(date);
        let o = {
            'Y': date.getFullYear(),
            'M': date.getMonth() + 1,
            'D': date.getDate()
        };
        return o;
    }
    return date;
};
/** 限定名字显示位数
* @param {string value} 名字
*/
exports.limitName = (value) => { // 名字长度过滤
  let b = value.toString().split(' ', 1);
  let c = b.join(' ');
  return c;
};

/** 将数字用，分割
*@param {string num1} 需要处理的数
*/
exports.splitNum = (num1) => {
  let num = (num1 || 0).toString();
  let result = '';
  while (num.length > 3) {
      result = ',' + num.slice(-3) + result;
      num = num.slice(0, num.length - 3);
  }
  if (num) { result = num + result; }
  return result;
};
/** 分割序列号
* @param {string src} 需要处理的序列号
* @param {int num2}  留下几位序列号
*/
exports.limitBoxNum = (src, num2) => {
  let a = src.split('', num2);
  let b = a.join('');
  if (src.length <= num2) {
    return b;
  }
  return b + '...';
};

/** 分割采集点
* @param {string src} 需要处理的序列号
* @param {int num3}
**/
exports.limitCollection = (src, num3) => {
  let a = src.split(' ');
  let b;
  if (a.length > num3) {
    b = src.split(' ', num3).join(' ') + '...';
  } else {
    b = src;
  }
  return b;
};
/** 单词表头过滤
* @param {string value} 权限
*/
exports.handleLabel = (value, num) => {
  if (!value) {
    return '';
  } else {
      let c = value.split(' ');
      let a;
      if (c.length > num) {
        a = value.split(' ', num).join(' ') + '...';
      } else {
        a = value;
      }
      return a;
  }
};

/** 格式化时间，返回年-月-日
 *  @param {string } 需要格式化String 类型为 dd/MM/yyyy
 */
exports.stringDate = (stringDate) => {
    if (typeof stringDate === 'string') {
      var array = stringDate.split('/');
      var newArray = array.reverse();
      var joinString = newArray.join('-');
      return new Date(joinString);
    }
    return stringDate;
};
/** 格式化时间，返回年-月-日
 *  @param {string } 需要格式化String 类型为 dd/MM/yyyy hh:mm:ss
 */
exports.stringTime = (stringTime) => {
    if (typeof stringTime === 'string') {
      var array = stringTime.split(' ');
      var newArray = array[0].split('/').reverse();
      var joinString = newArray.join('-');
      var date = new Date(joinString);
      return new Date(date.getTime() - 8 * 60 * 60 * 1000);
    }
    return stringTime;
};
function padLeftZero(str) {
  return ('00' + str).substr(str.length);
} ;
