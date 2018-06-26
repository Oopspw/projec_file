/*
 * @Author: pw
 * @Date: 2018-01-09 14:37:03 
 * @Last Modified time: 2018-01-09 14:37:03 
 */

//AJXA交互 URl中的参数
function getUrlParam(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

var httpUrl = sessionStorage.getItem('httpUrl')
var infversionApp = sessionStorage.getItem('infversionApp')
var userid = sessionStorage.getItem('userid')
var token = sessionStorage.getItem('token')
var taskid = sessionStorage.getItem('taskid')
var infversion_1 = '6.3'

if (
  userid == null ||
  token == null ||
  taskid == null ||
  infversionApp == null
) {
  userid = getUrlParam('userid')
  token = getUrlParam('token')
  infversionApp = getUrlParam('infversionApp')
  taskid = '67'
  httpUrl = 'http://47.104.87.206'
}

$('.B-mask').hide()
function getNewGoal() {
  $.ajax({
    type: 'POST',
    url: httpUrl + '/TaskWebInterface-http/wapapi',
    data: JSON.stringify({
      userid: userid,
      token: token,
      async: false,
      taskid: taskid,
      Infversion: infversion_1,
      Method: 'QueryXianShiDetailTaskWap'
    }),
    dataType: 'json',
    success: function(obj) {
      console.log(obj)
      if (obj.data !== null) {
        var html = template('newGoala', obj)
        $('#new_ul').append(html)
        $('.yxtdNum').text(obj.data.youxiaotudinum)
        $('#addNum').text(obj.data.tudinum)
        $('#wayNum').text(obj.data.golding)
        $('#rewardmaxgold').text(obj.data.rewardmaxgold)
        var startDate = obj.data.starttime
        var endDate = obj.data.endtime
        startDate = startDate.replace(
          /(\d{4}).(\d{1,2}).(\d{1,2}).+/gm,
          '$1年$2月$3日'
        )
        endDate = endDate.replace(
          /(\d{4}).(\d{1,2}).(\d{1,2}).+/gm,
          '$1年$2月$3日'
        )
        $('#starttime').text(startDate)
        $('#endtime').text(endDate)
      } else {
        history.back()
      }
    }
  })
}
getNewGoal()

$('.new_tips').click(function(e) {
  e.preventDefault()
  $('.tips_box').fadeIn(100)
  $('.mask').fadeIn(100)
})

$('.mask').click(function() {
  $('.tips_box').fadeOut(100)
  $('.mask').fadeOut(100)
})

$('#close').click(function() {
  $('.tips_box').fadeOut(100)
  $('.mask').fadeOut(100)
})

$('#share_btn').click(function() {
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    sendInfoToIos('4')
  } else if (/(Android)/i.test(navigator.userAgent)) {
    sendInfoToAndroid('4')
  }
})

$(document).on('click', '._goto', function() {
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    sendInfoToIos('4')
  } else if (/(Android)/i.test(navigator.userAgent)) {
    sendInfoToAndroid('4')
  }
})

function sendInfoToIos(jumpNum) {
  var flag = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)
  flag = parseInt(flag[1], 10)
  if (flag > 8) {
    window.webkit.messageHandlers.jumpView.postMessage(jumpNum)
  } else {
    jumpView(jumpNum)
  }
}

function sendInfoToAndroid(jumpNum) {
  taskCentre.gofinish(jumpNum)
}
