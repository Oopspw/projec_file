// 配置
var httpUrl = sessionStorage.getItem('httpUrl')
if (httpUrl == null) {
  window.history.back()
}
var infversion_1 = '6.3'
var Appv = sessionStorage.getItem('infversionApp')
var infversionApp = Appv.replace(/\./g, '') * 1
var userid = sessionStorage.getItem('userid')
var token = sessionStorage.getItem('token')
var taskid = sessionStorage.getItem('taskid')
var index = 0
var answeritems = [] //用户收集用户每一次的选项
var questionitems = [] //问题数组 用于存储点击开始答题时的题目
var questionflag = false //ios、android 类flag
var sure = 1 //类flag 防止反复循环做的判断依据
var testid //保存需要的参数
var isright
var isdone //完成情况
var Length //数据长度
var questiongold
var answerflag = 0 //用于记录对题数
var nextFlag = false //判断用户是否选答案
$('.B-mask').hide() //加载后立即隐藏

infversionApp = infversionApp * 1
if (infversionApp > 64) {
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    returnkeyToIos('no', 'no') //告诉app使用返回键
  } else if (/(Android)/i.test(navigator.userAgent)) {
    returnkeyToAndroid('no', '') //告诉app使用返回键  ""不使用后台进入后刷新
  }
}

//获取题目
function getItem() {
  flag = true //新增
  $.ajax({
    type: 'POST',
    url: httpUrl + '/TaskWebInterface-http/wapapi',
    data: JSON.stringify({
      userid: userid,
      token: token,
      taskid: taskid,
      Infversion: infversion_1,
      Method: 'QueryUserQuestionTaskWap'
    }),
    dataType: 'json',
    success: function(obj) {
      //调用开始答题接口
      startAnswer()
      var content = obj.data //data数据
      if (content.isfinish == '1') {
        $('.R-index').hide()
        $('.pullBox').hide()
        $('.tipsBox').show()
        $('.header').hide()
        $('.choose').hide()
        $('body').css('backgroundColor', '#fff')
        return false
      }
      if (content.questionitems.length == 0) {
        console.log('糟糕，试卷还没准备好~请稍后再来')
        window.history.back()
      }
      //总题数
      $('#questionnum').text(content.questionnum)
      //每题金币数
      $('#questiongold').text(content.questiongold)
      questiongold = content.questiongold * 1
      //总奖励金币数
      $('#maxgold').text(content.maxgold)

      //题目总数量
      Length = content.questionitems.length
      //题目总数
      $('.index-sum').text(Length)
      $('.showtext').text(Length)
      //获取textid并保存
      testid = content.testid
      maxgold = content.maxgold
      window.sessionStorage.setItem('testid', testid)
      //获取题目id集合 这里使用了sure
      if (sure == 1) {
        for (var i = 0; i < content.questionitems.length; i++) {
          var gather = content.questionitems[i].questionid
          var gathernum = toObj('questionid', gather)
          questionitems.push(gathernum)
        }
      } else {
        sure = 0
      }
      sure = 0
      //当前题目
      content = content.questionitems[index]
      var answerLength = content.answeritems.length
      //题目序号
      var contentnum = index + 1
      $('.index-num').text(contentnum)
      //生成题目
      var contentTitle = content.questioncontent

      $('.topic').text(contentTitle)
      //模板生成答案
      var html = template('question', content)
      $('#textContent').empty()
      $('#textContent').html(html)
    }
  })
}
getItem()

function startAnswer() {
  var refreshFlag = true
  window.sessionStorage.setItem('refreshFlag', refreshFlag)
  //发送ajax请求  告知后台开始答题状态
  $.ajax({
    type: 'POST',
    url: httpUrl + '/TaskWebInterface-http/wapapi',
    data: JSON.stringify({
      userid: userid,
      token: token,
      taskid: taskid,
      Infversion: infversion_1,
      questionitems: questionitems,
      Method: 'InsertTaskUserTestQuestionWap'
    }),
    dataType: 'json',
    success: function(obj) {},
    error: function() {
      console.log('数据加载出错')
    }
  })
}

// 继续下一题
$('#next-btn').click(function() {
  flag = true
  if (nextFlag) {
    index++
    console.log(index)
    if (index < Length) {
      getItem()
    } else {
      // index = 0
      console.log(index)
    }
    nextFlag = false
  } else {
    $('.warn').fadeIn(500)
    $('.warn').fadeOut(1500)
  }
})

// 接收按钮  这里要返回一个数据给后台
$('#accept-btn').click(function() {
  popupWindow()
  // window.history.back()
  $('.mask').hide()
  $('.complete').hide()
})

//创建一个对象
function toObj(key, val) {
  var data = {}
  data[key] = val
  return data
}

//答题中选择答案的操作
var flag = true
var answerture = 0
var answerfalse = 0
$('.choose').on('click', 'li', function() {
  nextFlag = true
  //动态绑定点击事件
  testid = sessionStorage.getItem('testid')
  //判断当前选项的对错
  if (flag) {
    //防止重复选择答案
    var judge = $(this).attr('data-judge') //判断对错 judge = 1 为正确，反之则错误；
    var questionid = $(this).attr('data-questionid')
    var answerid = $(this).attr('data-answerid')
    var itmeObj = {}
    itmeObj.questionid = questionid
    itmeObj.answerid = answerid
    judge = judge * 1
    if (judge === 1) {
      //判断答案为正确选项 做相关操作并 跳转下一题
      isright = '1'
      itmeObj.isright = isright
      isdone = '1'
      itmeObj.isdone = isdone
      answeritems.push(itmeObj)
      $('.rightanswer1').addClass('Aright')
      answerture++
      answerflag++ //正确的题目数增加
      if (index >= Length - 1) {
        //正确之后提交答案
        $.ajax({
          type: 'POST',
          url: httpUrl + '/TaskWebInterface-http/wapapi',
          data: JSON.stringify({
            userid: userid,
            token: token,
            appv: Appv,
            Infversion: infversion_1,
            taskid: taskid,
            Method: 'CommintUserAnswerWap',
            isfinish: '1',
            testid: testid,
            realgold: maxgold,
            answeritems: answeritems
          }),
          dataType: 'json',
          success: function(obj) {
            console.log(answeritems)
          },
          error: function() {
            console.log('提交答案失败1')
          }
        })
        questionflag = true //类flag 更改题目完成状态
        $('#endgold').text(maxgold)
        $('.mask').show()
        $('.complete').show()
      } else {
        flag = false
      }
    } else {
      answerfalse++
      isright = '0'
      itmeObj.isright = isright
      isdone = '1'
      itmeObj.isdone = isdone
      answeritems.push(itmeObj)
      // $('.rightanswer1').addClass('Aright')
      //选中错误选项后 显示正确答案和继续下一题按钮
      // 注意：利用flag判断 防止选错之后仍能点击选择正确答案
      $(this).addClass('Aright')
      flag = false
      if (index >= Length - 1) {
        console.log('发送2')
        console.log(maxgold)
        //发送ajax
        $.ajax({
          type: 'POST',
          url: httpUrl + '/TaskWebInterface-http/wapapi',
          data: JSON.stringify({
            userid: userid,
            token: token,
            appv: Appv,
            Infversion: infversion_1,
            taskid: taskid,
            Method: 'CommintUserAnswerWap',
            isfinish: '1',
            testid: testid,
            realgold: maxgold,
            answeritems: answeritems
          }),
          dataType: 'json',
          success: function(obj) {
            console.log(answeritems)
          },
          error: function() {
            console.log('提交答案失败2')
          }
        })
        questionflag = true //类flag 更改题目完成状态
        $('#endgold').text(maxgold)
        $('.mask').show()
        $('.complete').show()
        $('#nextbtn').hide()
        flag = true
      } else {
      }
    }
  } else {
    return false
  }
})

function returnkeyToIos(ruturnNum1, ruturnNum2) {
  //第一个参数（app点击返回键调用js方法 yes为调用，no为不调用），第二个参数（app是否刷新，yes为刷新，no为不刷新）
  var flag = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)
  var iosArr = [ruturnNum1, ruturnNum2]
  flag = parseInt(flag[1], 10)
  if (flag > 8) {
    window.webkit.messageHandlers.returnkey.postMessage(iosArr)
  } else {
    returnkey(iosArr)
  }
}

function returnkeyToAndroid(ruturnNum1, ruturnNum2) {
  //Android 返回键调用方法
  taskCentre.returnKeyAndroid(ruturnNum1, ruturnNum2)
}

// ios Android 点击返回按钮弹出弹框
function popupWindow() {
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    window.history.back()
    returnkeyToIos('no', 'yes')
  } else if (/(Android)/i.test(navigator.userAgent)) {
    window.history.back()
    returnkeyToAndroid('no', '')
  }
}

function refreshWindow(type) {
  var flag = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)
  flag = parseInt(flag[1], 10)
  if (flag > 8) {
    window.webkit.messageHandlers.refreshWindow.postMessage(type)
  } else {
    refreshWindow(type)
  }
}

function closewindowToIos() {
  var flag = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)
  flag = parseInt(flag[1], 10)
  if (flag > 8) {
    window.webkit.messageHandlers.closewindow.postMessage('yes')
  } else {
    closewindow()
  }
}
