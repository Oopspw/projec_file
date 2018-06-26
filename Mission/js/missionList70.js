$('body').css('visibility', 'inherit')
$(document).ready(function() {
  //AJXA交互 URl中的参数
  function getUrlParam(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
  }

  //截取参数
  var gethttpUrl = 'http://testtask.ruit666.net'
  var getuserid = getUrlParam('userid')
  var gettoken = getUrlParam('token')
  var getinfversionApp = getUrlParam('infversionApp')

  //存储本地
  sessionStorage.setItem('httpUrl', gethttpUrl)
  sessionStorage.setItem('infversionApp', getinfversionApp)
  sessionStorage.setItem('userid', getuserid)
  sessionStorage.setItem('token', gettoken)

  //本地取出
  var httpUrl = sessionStorage.getItem('httpUrl')
  var infversion_1 = '6.3'
  var infversion_2 = '7.0'
  var infversionApp = sessionStorage.getItem('infversionApp')
  var myApp = infversionApp.replace(/\./g, '') * 1
  var userid = sessionStorage.getItem('userid')
  var token = sessionStorage.getItem('token')

  // Jroll初始化
  var Jroll = new JRoll('#wrapper', { scrollBarY: true, scrollBarFade: true })
  $('.mask').click(function() {
    window.location.reload()
  })

  if (getuserid == null || gettoken == null) {
    $('.mask').show()
    $('.maskImg').show()
    $('.font').show()
    return false
  }

  function writeInfo(continuous, attendance, grownpoint) {
    if (continuous < 5) {
      if (attendance === 1) {
        $('.lottoButton').addClass('canClick')
        //已签到的状态
        $('.signButton').addClass('completeSign') //改变签到按钮的状态
        //明日签到可获得的成长值
        exp = grownpoint * (continuous + 1) + '成长值'
        $('.buttonText')
          .text('明日签到可领取' + exp)
          .css({
            fontSize: '0.3rem',
            lineHeight: '0.42rem'
          }) //签到按钮的颜色
        $('.sufferUl>li:eq(' + (continuous - 1) + ')')
          .children('div')
          .siblings('p')
          .addClass('todayCanclick')
        $('.todayCanclick')
          .text('已领取')
          .css('color', '#717171')
        $('.sufferUl>li>div.todaySuffer')
          .removeClass('todaySuffer')
          .addClass('completeSuffer')
        $('.sufferUl>li:lt(' + continuous + ')')
          .children('div')
          .addClass('completeSuffer')
      } else if (attendance === 0) {
        $('.todayCanclick')
          .text('可领取')
          .css('color', '#e96f5a')
        $('.sufferUl>li:lt(' + continuous + ')')
          .children('div')
          .addClass('completeSuffer')
        $('.sufferUl>li:eq(' + continuous + ')')
          .children('div')
          .addClass('todaySuffer')
        $('.sufferUl>li:eq(' + continuous + ')')
          .children('div')
          .siblings('p')
          .text('可领取')
          .css('color', '#e96f5a')
        $('.sufferUl>li:eq(' + continuous + ')')
          .children('div')
          .siblings('p')
          .addClass('todayCanclick')
      }
    } else {
      if (attendance === 1) {
        $('.lottoButton').addClass('canClick')
        //签到的状态
        $('.signButton').addClass('completeSign') //改变签到按钮的状态
        //明日签到可获得的成长值
        exp = grownpoint * 5
        $('.buttonText')
          .text('明日签到可领取' + exp + '成长值')
          .css({
            fontSize: '0.3rem',
            lineHeight: '0.42rem'
          }) //签到按钮的颜色
        $('.sufferUl>li:eq(4)')
          .children('div')
          .siblings('p')
          .addClass('todayCanclick')
        $('.todayCanclick')
          .text('已领取')
          .css('color', '#717171')
        $('.sufferUl>li>div.todaySuffer')
          .removeClass('todaySuffer')
          .addClass('completeSuffer')
        $('.sufferUl>li:lt(5)')
          .children('div')
          .addClass('completeSuffer')
      } else if (attendance === 0) {
        $('.todayCanclick')
          .text('可领取')
          .css('color', '#e96f5a')
        $('.sufferUl>li:lt(4)')
          .children('div')
          .addClass('completeSuffer')
        $('.sufferUl>li:eq(4)')
          .children('div')
          .addClass('todaySuffer')
        $('.sufferUl>li:eq(4)')
          .children('div')
          .siblings('p')
          .text('可领取')
          .css('color', '#e96f5a')
        $('.sufferUl>li:eq(4)')
          .children('div')
          .siblings('p')
          .addClass('todayCanclick')
      }
    }
  }

  //获取每日签到的状态
  var exp = ''
  var attend
  function getInfo() {
    $.ajax({
      type: 'POST',
      url: httpUrl + '/TaskWebInterface-http/wapapi',
      async: true,
      data: JSON.stringify({
        userid: userid,
        token: token,
        Infversion: infversion_2,
        appv: infversionApp,
        Method: 'GetQianDaoInfo70Wap'
      }),
      dataType: 'json',
      success: function(res) {
        console.log(res)
        if (res === null) {
          $('.mask').show()
          $('.maskImg').show()
          $('.font').show()
        }
        if (res.data.ioscheckstate === '1') {
          $('#jumptoTTZ').hide()
        }
        //  Attendance：是否签到(1:已签到；0：未签到)    Continuous：连续签到的天数
        //签到的状态
        var attendance = res.data.attendance * 1
        attend = attendance
        //连续签到的天数
        var continuous = res.data.continuous * 1
        var grownpoint = res.data.grownpoint * 1
        $('#day1').text('+' + grownpoint * 1)
        $('#day2').text('+' + grownpoint * 2)
        $('#day3').text('+' + grownpoint * 3)
        $('#day4').text('+' + grownpoint * 4)
        $('#day5').text('+' + grownpoint * 5)
        writeInfo(continuous, attendance, grownpoint)
      },
      error: function() {
        $('.mask').show()
        $('.maskImg').show()
        $('.font').show()
        //alert('错误提示, 获取内容失败，请重试！')
      }
    })
  }
  getInfo()

  //每日签到   点击每日签到调用接口
  $('.signButton').click(function() {
    //状态的判断
    if ($('.signButton').hasClass('completeSign')) {
      return false
    } else {
      $.ajax({
        type: 'POST',
        url: httpUrl + '/TaskWebInterface-http/wapapi',
        data: JSON.stringify({
          userid: userid,
          token: token,
          Infversion: infversion_2,
          Method: 'DailyAttendance70Wap'
        }),
        dataType: 'json',
        success: function(res) {
          if (res.code !== '1000') {
            $('.warn').fadeIn(100)
            getInfo()
            $('.warn>p').text(res.msg.substr(2))
            $('.warn').fadeOut(3500)
            return false
          }
          if (res === null) {
            $('.mask').show()
            $('.maskImg').show()
            $('.font').show()
          }
          $('.succeed').fadeIn(100)
          $('.lottoButton').addClass('canClick')
          attend = 1
          var continuous = res.data.continuous * 1
          var grownpoint = res.data.grownpoint * 1
          if (continuous < 5) {
            exp = res.data.grownpoint * (continuous + 1)
            // console.log(exp)
          } else {
            exp = grownpoint * 5
            // console.log(exp)
          }
          $('.lottoButton').addClass('canClick')
          $('.buttonText')
            .text('明日签到可领取' + exp + '成长值')
            .css({
              fontSize: '0.3rem',
              lineHeight: '0.42rem'
            })
          $('.signButton').addClass('completeSign')
          $('.sufferUl>li>div.todaySuffer')
            .removeClass('todaySuffer')
            .addClass('completeSuffer')
          $('.todayCanclick')
            .text('已领取')
            .css('color', '#717171')
          $('.succeed').fadeOut(3500)
          //签到后的成长值变化
          if ($('.sufferUl>li>div').hasClass('todaySuffer')) {
            $('.sufferUl>li>div.todaySuffer')
              .removeClass('todaySuffer')
              .addClass('completeSuffer')
            $('.todayCanclick')
              .text('已领取')
              .css('color', '#717171')
          } else if ($('.sufferUl>li>div').hasClass('completeSuffer')) {
            return false //当签到处于完成状态时，返回（防止重复触发）
          }
        },
        error: function() {
          $('.mask').show()
          $('.maskImg').show()
          $('.font').show()
          // alert('错误提示, 获取内容失败，请重试！')
        }
      })
    }
  })

  //点击任务标题展示任务详情
  $(document).on('click', '.liTitle', function() {
    if (
      $(this)
        .next()
        .hasClass('showContent')
    ) {
      $(this)
        .next()
        .removeClass('showContent')
      $(this)
        .find('u')
        .removeClass('open')
      $(this)
        .children('.itbox')
        .css('border-bottom', '1px solid #eee')
    } else {
      $(this)
        .next()
        .addClass('showContent')
      $(this)
        .find('u')
        .addClass('open')
      $(this)
        .children('.itbox')
        .css('border-bottom', 'none')
    }
    setTimeout(function() {
      Jroll.refresh()
    }, 10)
  })

  //app跳转方法
  $('#jumptoTTZ').click(function() {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      var data = {}
      data.type = '2'
      data.jumpUrl = 'http://dl.shihesuiren.cn/ttDownload/DownloadMe.html'
      window.webkit.messageHandlers.missionWay.postMessage(data)
    } else {
      window.taskCentre.missionWay(
        '2',
        'http://dl.shihesuiren.cn/ttDownload/DownloadMe.html'
      )
    }
  })

  function missionWay(type, jumpUrl) {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      var data = {}
      data.type = type
      data.jumpUrl = jumpUrl
      window.webkit.messageHandlers.missionWay.postMessage(data)
    } else {
      window.taskCentre.missionWay(type, jumpUrl)
    }
  }
  function shareChannel() {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      var data = {}
      data.type = '2'
      data.key = 'ios_task_share_set'
      data.articleid = '-1'
      window.webkit.messageHandlers.shareChannel.postMessage(data)
    } else {
      var type = '2'
      var key = 'android_task_share_set'
      var articleid = '-1'
      window.taskCentre.shareChannel(type, key, articleid)
    }
  }

  //抽奖及其他跳转 (此处与app进行交互，当用户点击时跳转至抽奖页面，app返回剩余抽奖次数后进行动态渲染)
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    document.addEventListener('click', function(e) {
      var target = e.target
      if (target.classList.contains('lottoButton')) {
        if (attend === 1) {
          sendInfoToIos('6')
        } else {
          $('.warn').fadeIn(100)
          $('.warn').fadeOut(3500)
        }
      } else if (target.classList.contains('goTo1')) {
        sendInfoToIos('1')
      } else if (target.classList.contains('goTo2')) {
        sendInfoToIos('2')
      } else if (target.classList.contains('goTo3')) {
        sendInfoToIos('3')
      } else if (target.classList.contains('goTo4')) {
        sendInfoToIos('4')
      } else if (target.classList.contains('goTo5')) {
        sendInfoToIos('5')
      } else if (target.classList.contains('goTo6')) {
        sendInfoToIos('6')
      } else if (target.classList.contains('goTo7')) {
        var taskid = $('.goTo7').attr('value')
        var tasktype = $('.goTo7').attr('data')
        sessionStorage.setItem('tasktype', tasktype)
        sessionStorage.setItem('taskid', taskid)
        window.location.href = 'missionDetails.html'
      } else if (target.classList.contains('goTo8')) {
        var taskids = $('.goTo8').attr('value')
        sessionStorage.setItem('taskid', taskids)
        window.location.href = 'Research.html'
        if (myApp > 64) {
          returnkeyToIos('no', 'no')
          refreshWindow('no')
        }
      } else if (target.classList.contains('goTo9')) {
        var taskide = target.id
        sessionStorage.setItem('taskid', taskide)
        window.location.href = 'reward.html'
        if (myApp > 64) {
          returnkeyToIos('no', 'no')
          refreshWindow('no')
        }
      } else if (target.classList.contains('goTo10')) {
        var taskida = $('.goTo10').attr('value')
        sessionStorage.setItem('taskid', taskida)
        window.location.href = 'newGoal.html'
        if (myApp > 64) {
          returnkeyToIos('no', 'no')
          refreshWindow('no')
        }
      } else if (target.classList.contains('goTo13')) {
        var taskidd = $('.goTo13').attr('value')
        sessionStorage.setItem('taskid', taskidd)
        window.location.href = 'Investigate.html'
        if (myApp > 64) {
          returnkeyToIos('no', 'no')
          refreshWindow('no')
        }
      } else if (target.classList.contains('goTo14')) {
        var jumto, url
        jumto = target.id
        url = target.title
        if (jumto == '1') {
          //内部浏览器
          missionWay('1', url)
        } else if (jumto == '2') {
          //外部浏览器
          missionWay('2', url)
        } else if (jumto == '3') {
          //文章列表
          sendInfoToIos('3')
        } else if (jumto == '4') {
          //师徒
          sendInfoToIos('4')
        } else if (jumto == '6') {
          //红包
          sendInfoToIos('14')
        } else if (jumto == '7') {
          //分享
          shareChannel()
        }
      }
    })
  } else if (/(Android)/i.test(navigator.userAgent)) {
    document.addEventListener('click', function(e) {
      var target = e.target
      if (target.classList.contains('lottoButton')) {
        if (attend === 1) {
          sendInfoToAndroid('6')
        } else {
          $('.warn').fadeIn(100)
          $('.warn').fadeOut(3500)
        }
      } else if (target.classList.contains('goTo1')) {
        sendInfoToAndroid('1')
      } else if (target.classList.contains('goTo2')) {
        sendInfoToAndroid('2')
      } else if (target.classList.contains('goTo3')) {
        sendInfoToAndroid('3')
      } else if (target.classList.contains('goTo4')) {
        sendInfoToAndroid('4')
      } else if (target.classList.contains('goTo5')) {
        sendInfoToAndroid('5')
      } else if (target.classList.contains('goTo6')) {
        sendInfoToAndroid('6')
      } else if (target.classList.contains('goTo7')) {
        var taskid = $('.goTo7').attr('value')
        var tasktype = $('.goTo7').attr('data')
        sessionStorage.setItem('tasktype', tasktype)
        sessionStorage.setItem('taskid', taskid)
        window.location.href = 'missionDetails.html'
      } else if (target.classList.contains('goTo8')) {
        var taskids = $('.goTo8').attr('value')
        sessionStorage.setItem('taskid', taskids)
        window.location.href = 'Research.html'
        if (myApp > 64) {
          returnkeyToAndroid('', 'yes')
        }
      } else if (target.classList.contains('goTo9')) {
        var taskide = target.id
        sessionStorage.setItem('taskid', taskide)
        window.location.href = 'reward.html'
        if (myApp > 64) {
          returnkeyToAndroid('', '')
        }
      } else if (target.classList.contains('goTo10')) {
        var taskida = $('.goTo10').attr('value')
        sessionStorage.setItem('taskid', taskida)
        window.location.href = 'newGoal.html'
        if (myApp > 64) {
          returnkeyToAndroid('', '')
        }
      } else if (target.classList.contains('goTo13')) {
        var taskidd = $('.goTo13').attr('value')
        sessionStorage.setItem('taskid', taskidd)
        window.location.href = 'Investigate.html'
        if (myApp > 64) {
          returnkeyToAndroid('', '')
        }
      } else if (target.classList.contains('goTo14')) {
        var jumto, url
        jumto = target.id
        url = target.title
        if (jumto == '1') {
          //内部浏览器
          missionWay('1', url)
        } else if (jumto == '2') {
          //外部浏览器
          missionWay('2', url)
        } else if (jumto == '3') {
          //文章列表
          sendInfoToAndroid('3')
        } else if (jumto == '4') {
          //师徒
          sendInfoToAndroid('4')
        } else if (jumto == '6') {
          //红包
          sendInfoToAndroid('14')
        } else if (jumto == '7') {
          //分享
          shareChannel()
        }
      }
    })
  }

  function jumpWay() {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      var flag = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)
      flag = parseInt(flag[1], 10)
      if (flag > 7) {
        window.webkit.messageHandlers.jumpView.postMessage(jumpNum)
      } else {
        jumpView(jumpNum)
      }
    } else if (/(Android)/i.test(navigator.userAgent)) {
      taskCentre.gofinish(jumpNum)
    }
  }

  //$(".doThis goTo7").text("查看详情");
  // ios 跳转方法
  function sendInfoToIos(jumpNum) {
    window.webkit.messageHandlers.jumpView.postMessage(jumpNum)
  }

  function returnkeyToIos(ruturnNum1, ruturnNum2) {
    //第一个参数（app点击返回键调用js方法 yes为调用，no为不调用），第二个参数（app是否刷新，yes为刷新，no为不刷新）
    window.webkit.messageHandlers.returnkey.postMessage(iosArr)
  }

  function refreshWindow(type) {
    window.webkit.messageHandlers.refreshWindow.postMessage(type)
  }

  //Android 跳转方法
  function sendInfoToAndroid(jumpNum) {
    taskCentre.gofinish(jumpNum)
  }

  function returnkeyToAndroid(ruturnNum1, ruturnNum2) {
    taskCentre.returnKeyAndroid(ruturnNum1, ruturnNum2)
  }

  //获取今日完成任务金币
  function getTaskGold() {
    $.ajax({
      type: 'POST',
      url: httpUrl + '/TaskWebInterface-http/wapapi',
      async: true,
      data: JSON.stringify({
        userid: userid,
        token: token,
        Infversion: infversion_1,
        Method: 'QueryTodayAndTotalGoldWap'
      }),
      dataType: 'json',
      success: function(data) {
        if (data === null) {
          $('.bigTitle').text('今日金币奖励')
        } else {
          var html = template('goldCoin', data)
          $('.bigTitle').text(html)
        }
      },
      error: function() {
        $('.mask').show()
        $('.maskImg').show()
        $('.font').show()
        // alert('错误提示, 获取内容失败，请重试！')
      }
    })
  }

  getTaskGold()

  //新手任务-交互部分(获取具体任务数据进行显示)
  function getNewTask() {
    $.ajax({
      type: 'POST',
      url: httpUrl + '/TaskWebInterface-http/wapapi',
      async: true,
      data: JSON.stringify({
        userid: userid,
        token: token,
        Infversion: infversion_1,
        Method: 'QueryUserMyNewTaskWap'
      }),
      dataType: 'json',
      success: function(res) {
        console.log(res)
        if (res === null) {
          $('.mask').show()
          $('.maskImg').show()
          $('.font').show()
        }
        if (res.data.length > 0) {
          var html = template('getNewList', res)
          $('#newbieMission').append(html)
        } else {
          $('#newbieMission').hide()
        }
        setTimeout(function() {
          Jroll.refresh()
        }, 10)
      },
      error: function() {
        $('.mask').show()
        $('.maskImg').show()
        $('.font').show()
        // alert('错误提示, 获取内容失败，请重试！')
      }
    })
  }

  getNewTask()

  //日常任务-交互部分(获取具体任务数据进行显示)

  function getDailyTask() {
    $.ajax({
      type: 'POST',
      url: httpUrl + '/TaskWebInterface-http/wapapi',
      async: false,
      data: JSON.stringify({
        userid: userid,
        token: token,
        appv: infversionApp,
        Infversion: infversion_1,
        Method: 'QueryUserMyDailyTaskWap'
      }),
      dataType: 'json',
      success: function(res) {
        console.log(res)
        if (res === null) {
          $('.mask').show()
          $('.maskImg').show()
          $('.font').show()
        }
        $('.mask').hide()
        if (res.data.length > 0) {
          var html = template('getDmList', res) //模板中渲染
          $('#dayMission').append(html) //添加进入dom
        } else {
          $('#dayMission').hide()
        }
        //取值（任务刷新的时间）
        timevalue = res.data
        for (var i = 0; i < timevalue.length; i++) {
          var getTaskTime = timevalue[i].countdowntime * 1
          var listtask = $('.missionTime')[i]
          countDown(getTaskTime, listtask, function(myclass, msg) {
            $(myclass).text(msg)
          })
        }
        setTimeout(function() {
          Jroll.refresh()
        }, 10)
      },
      error: function() {
        $('.mask').show()
        $('.maskImg').show()
        $('.font').show()
        // alert('错误提示, 获取内容失败，请重试！')
      }
    })
  }

  getDailyTask()
  //设置倒计时
  function countDown(time, listclass, fn) {
    if (time === 0) {
      return
    }
    timer = setInterval(function() {
      if (time >= 0) {
        var hour = parseInt((time / 60 / 60) % 24, 10) //计算剩余的小时数
        var minute = parseInt((time / 60) % 60, 10) //计算剩余的分钟数
        var second = parseInt(time % 60, 10) //计算剩余的秒数
        myclass = listclass
        hour = checkTime(hour)
        minute = checkTime(minute)
        second = checkTime(second)
        msg = hour + ':' + minute + ':' + second + '后刷新'
        fn(myclass, msg)
        --time
      } else {
        clearInterval(timer)
        location.reload()
      }
    }, 1000)
  }

  function checkTime(i) {
    if (i < 10) {
      i = '0' + i
    }
    return i
  }

  //限时任务-交互部分
  function getLimitTask() {
    $.ajax({
      type: 'POST',
      url: httpUrl + '/TaskWebInterface-http/wapapi',
      async: false,
      data: JSON.stringify({
        userid: userid,
        token: token,
        Infversion: infversion_1,
        appv: infversionApp,
        Method: 'QueryXianShiTaskWap'
      }),
      dataType: 'json',
      success: function(res) {
        $('.mask').hide()
        //console.log(res)
        if (res === null) {
          $('.mask').show()
          $('.maskImg').show()
          $('.font').show()
        }
        if (res.data.length > 0) {
          var html = template('getLimitmList', res) //模板中渲染
          $('#limitMission').append(html) //添加进入dom
        } else {
          $('#limitMission').hide()
        }
        setTimeout(function() {
          Jroll.refresh()
        }, 10)
      },
      error: function() {
        $('.mask').show()
        $('.maskImg').show()
        $('.font').show()
        // alert('错误提示, 获取内容失败，请重试！')
      }
    })
  }
  getLimitTask()

  //已完成任务-交互部分(获取具体任务数据进行显示)
  function getCompletedTask() {
    $.ajax({
      type: 'POST',
      url: httpUrl + '/TaskWebInterface-http/wapapi',
      async: true,
      data: JSON.stringify({
        userid: userid,
        token: token,
        Infversion: infversion_1,
        Method: 'QueryCompletedTaskWap'
      }),
      dataType: 'json',
      success: function(res) {
        //console.log.log(res)
        if (res.data.length > 0) {
          var html = template('getCmList', res)
          $('#completeMission').append(html)
        } else {
          $('#completeMission').hide()
        }
        setTimeout(function() {
          Jroll.refresh()
        }, 10)
      },
      error: function() {
        $('.mask').show()
        $('.maskImg').show()
        $('.font').show()
        // alert('错误提示, 获取内容失败，请重试！')
      }
    })
  }
  getCompletedTask()
  Jroll.refresh()
  function ajax(params) {
    setTimeout(function() {
      params.success()
    }, 800)
  }
  setTimeout(function() {
    Jroll.refresh()
  }, 10)
  Jroll.pulldown({
    refresh: function(complete) {
      ajax({
        success: function() {
          //异步数据加载完成后必须要执行该complete方法才能结束loading
          complete()
          setTimeout(function() {
            location.reload()
          }, 800)
        }
      })
    }
  })
})
