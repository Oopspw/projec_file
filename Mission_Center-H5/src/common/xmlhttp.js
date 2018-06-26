import $ from 'jquery'
import wx from 'weixin-js-sdk'
export default {
  install (Vue) {
    Vue.prototype.$getHashParameter = function (key) {
      var arr = (location.hash || '').split('?')[1].split('&')
      var params = {}
      for (var i = 0; i < arr.length; i++) {
        var data = arr[i].split('=')
        if (data.length === 2) {
          params[data[0]] = data[1]
        }
      }
      return params[key]
    }
    Vue.prototype.$apiPost = function (url, data, callback, callbackerror) {
      $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(data),
        dataType: 'json',
        success: function (res) {
          if (res.code === 1000 || res.code === '1000') {
            if (callback) {
              callback(res, data)
            }
          } else if (res.code === 401 || res.code === '401') {
          } else {
            if (callbackerror) {
              callbackerror(res)
            } else {
              console.log(res.code + ':' + res.message)
            }
          }
        }
      })
    }
    // post数据
    Vue.prototype.$Post = function (url, data, callback, callbackerror) {
      $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(data),
        // contentType: 'application/json',
        success: function (rs) {
          var res = JSON.parse(rs)
          if (res.code === 1000 || res.code === '1000') {
            if (callback) {
              callback(res, data)
            }
          } else if (res.code === 401 || res.code === '401') {
          } else {
            if (callbackerror) {
              callbackerror(res)
            } else {
              console.log(res.code + ':' + res.message)
            }
          }
        }
      })
    }
    Vue.prototype.$httpPost = function (url, data, callback, callbackerror) {
      $.post(url, data, {emulateJSON: true}).then(function (rs) {
        var res = JSON.parse(rs)
        if (res.code === 1000 || res.code === '1000') {
          if (callback) {
            callback(res, data)
          }
        } else if (res.code === 401 || res.code === '401') {
          window.location.href = '/static/index.html'
        } else {
          if (callbackerror) {
            callbackerror(res)
          } else {
            console.log(res.code + ':' + res.message)
          }
        }
      })
    }
    // 微信支付
    Vue.prototype.$wxPay = function (data, callback) {
      wx.config({
        appId: data.appId,
        timestamp: data.timeStamp,
        nonceStr: data.nonceStr,
        signature: data.paySign,
        jsApiList: [
          'chooseWXPay'
        ]
      })
      wx.ready(function () {
        wx.chooseWXPay({
          timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
          package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
          signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: data.paySign, // 支付签名
          success: function (res) {
            if (callback) {
              callback(res)
            }
          }
        })
      })
    }
    // 上传文件
    Vue.prototype.$PostFile = function (url, data, callback, callbackError) {
      var formData = new FormData()
      // 建立一个upload表单项，值为上传的文件
      // formData.append('file', document.getElementById(theFile).files)
      for (var item in data) {
        formData.append(item, data[item])
      }
      var xhr
      if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xhr = new XMLHttpRequest()
      }
      xhr.open('POST', url, true)
      // 定义上传完成后的回调函数
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          if (callback) {
            callback(JSON.parse(xhr.response))
          }
        } else if (xhr.readyState === 4) {
          if (callbackError) {
            callbackError(JSON.parse(xhr.response))
          }
        }
      }
      xhr.send(formData)
    }
  }
}
