$(document).ready(function() {
  //监听加载状态改变
  document.onreadystatechange = completeLoading

  //加载状态为complete时移除loading效果
  function completeLoading() {
    if (document.readyState == 'complete') {
      $('.mask').hide()
    }
  }

  var httpUrl = sessionStorage.getItem('httpUrl')
  var infversion_1 = '6.3'
  var infversionApp = sessionStorage.getItem('infversionApp')
  var userid = sessionStorage.getItem('userid')
  var token = sessionStorage.getItem('token')
  var taskid = sessionStorage.getItem('taskid')
  var tasktype = sessionStorage.getItem('tasktype')
  //交互js（获取每日任务完成状态进行显示）
  //查询新手任务详情
  var myType

  function getMyNewTaskDetail() {
    $.ajax({
      type: 'POST',
      url: httpUrl + '/TaskWebInterface-http/wapapi',
      data: JSON.stringify({
        userid: userid,
        token: token,
        taskid: taskid,
        Infversion: infversion_1,
        Method: 'QueryMyNewTaskDetailWap'
      }),
      dataType: 'json',
      success: function(obj) {
        console.log(obj)
        var item = obj.data
        var lis = $('.showDate>ul>li')
        for (var i = 0; i < item.length; i++) {
          if (item[i].isdone === '1') {
            lis[i].className = 'isGet'
          } else {
            lis[i].className = 'isLost'
          }
          myType = item[i].type
        }
      },
      error: function() {
        alert('错误提示2, 获取识别结果失败，请重试！')
      }
    })
  }

  //查询日常任务详情
  function getMyDailyTaskDetail() {
    $.ajax({
      type: 'POST',
      url: httpUrl + '/TaskWebInterface-http/wapapi',
      data: JSON.stringify({
        userid: userid,
        token: token,
        taskid: taskid,
        Infversion: infversion_1,
        Method: 'QueryMyDailyTaskDetailWap'
      }),
      dataType: 'json',
      success: function(obj) {
        console.log(obj)
        var item = obj.data
        var lis = $('.showDate>ul>li')
        var taskday = item[0].taskdays * 1
        for (var i = 0; i <= taskday; i++) {
          if (i < taskday) {
            lis[i].className = 'isGet'
          }
          myType = item[0].type
        }
      },
      error: function() {
        alert('错误提示2, 获取识别结果失败，请重试！')
      }
    })
  }

  if (myType == undefined) {
    myType = '3'
  }
  if (tasktype === 'NewTask') {
    getMyNewTaskDetail()
  } else if (tasktype === 'DailyTask') {
    getMyDailyTaskDetail()
  }

  //ios 跳转方法
  function sendInfoToIos(jumpNum) {
    window.webkit.messageHandlers.jumpView.postMessage(jumpNum)
  }

  //Android 跳转方法
  function sendInfoToAndroid(jumpNum) {
    taskCentre.gofinish(jumpNum)
  }
  $('#ShowBtn').click(function() {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      sendInfoToIos(myType)
      sessionStorage.clear()
    } else if (/(Android)/i.test(navigator.userAgent)) {
      sendInfoToAndroid(myType)
      sessionStorage.clear()
    }
  })
})
