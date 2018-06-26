$('body').css('visibility', 'inherit')
$(document).ready(function() {
  function getUrlParam(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.search.substring(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
  }
  var ggc = getUrlParam('ggc')
  var text = $('#text').val()
  var httpUrl = localStorage.httpUrl
  var nextUrl
  function getJumpUrl() {
    $.ajax({
      type: 'POST',
      url: httpUrl + '/kdbapi/getDownloadAppPageWap',
      data: JSON.stringify({
        Infversion: 7.2
      }),
      dataType: 'json',
      success: function(res) {
        console.log(res)
        nextUrl = res.data.pageurl
      },
      error: function(res) {
        $('.warn').fadeIn(100)
        $('.warn>p').text(res.msg.substring(2))
        $('.warn').fadeOut(4000)
      }
    })
  }
  getJumpUrl()
  // askIndex
  function getUserInfo() {
    $.ajax({
      type: 'POST',
      url: httpUrl + '/kdbapi/getRedpacketRainShareUserInfo',
      data: JSON.stringify({
        ggc: ggc
      }),
      dataType: 'json',
      success: function(res) {
        if (res.code !== '1000') {
          $('.warn').fadeIn(100)
          $('.warn>p').text(res.msg.substring(2))
          $('.warn').fadeOut(4000)
          return false
        }
        $('.source').text('您的好友' + res.data.nickname)
        $('.sources').text(res.data.nickname)
        if (res.data.wechatphoto !== '') {
          $('.icon_head').attr('src', res.data.wechatphoto)
        }
      },
      error: function(res) {
        $('.warn').fadeIn(100)
        $('.warn>p').text(res.msg.substring(2))
        $('.warn').fadeOut(4000)
      }
    })
  }
  if (text === '1') {
    getUserInfo()
  }
  var flag = true
  $('#extract_stock').click(function() {
    if (flag) {
      flag = false
      var mobile = $('.putcode').val()
      if (mobile === '') {
        $('.warn').fadeIn(100)
        $('.warn>p').text('请输入手机号码')
        $('.warn').fadeOut(4000)
        Flag = true
        return false
      }
      $.ajax({
        type: 'POST',
        url: httpUrl + '/kdbapi/RedpacketRainCheckTicket',
        data: JSON.stringify({
          ggc: ggc,
          mobile: mobile
        }),
        dataType: 'json',
        success: function(res) {
          console.log(res)
          if (res.code !== '1000') {
            flag = true
            window.location.href = nextUrl
            return false
          }
          if (res.data !== '' && res.data.isregisteruser === '1') {
            flag = true
            window.location.href = nextUrl
            return false
          }
          flag = true
          window.location.href = 'oldUser.html'
        },
        error: function(res) {
          $('.warn').fadeIn(100)
          $('.warn>p').text(res.msg.substring(2))
          $('.warn').fadeOut(4000)
          flag = true
        }
      })
    }
  })

  function isPoneAvailable(str) {
    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/
    if (!myreg.test(str)) {
      return false
    } else {
      return true
    }
  }

  $('.putcode').on('input propertychange', function() {
    if (isPoneAvailable($('.putcode').val())) {
      //输入了登录信息
      $('#extract_stock')
        .removeAttr('disabled')
        .css('background', '#2ab526')
    } else {
      //未输入登录信息
      $('#extract_stock')
        .attr('disabled', true)
        .css('background', '#999999')
    }
  })

  // jumpToApp
  $('#loadApp').click(function() {
    // 唤醒app 唤醒失败则跳转至下载页面
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      window.location.href = 'guaguatoutiao://'
      setTimeout(function() {
        window.location.href =
          'https://itunes.apple.com/us/app/id1262755575?l=zh&ls=1&mt=8'
      }, 1000)
    } else if (/(Android)/i.test(navigator.userAgent)) {
      window.location.href = 'guaguazhuan://ggz.app/open'
      setTimeout(function() {
        window.location.href = nextUrl
      }, 1000)
    }
  })

  // 根据用户输入的手机号码判断新老用户 后进行对应跳转操作
  var Flag = true
  $('#getBtn').click(function() {
    if (Flag) {
      Flag = false
      var mobile = $('.putcode').val()
      if (mobile === '') {
        $('.warn').fadeIn(100)
        $('.warn>p').text('请输入手机号码')
        $('.warn').fadeOut(4000)
        Flag = true
        return false
      }
      $.ajax({
        type: 'POST',
        url: httpUrl + '/kdbapi/GiveOlduserCheckTicket',
        data: JSON.stringify({
          mobile: mobile,
          Infversion: '7.2'
        }),
        dataType: 'json',
        success: function(res) {
          console.log(res.code)
          if (res.code === '2000') {
            $('.warn').fadeIn(100)
            $('.warn>p').text(res.msg)
            $('.warn').fadeOut(4000)
            Flag = true
            return false
          }
          Flag = true
          if (res.data.isregisteruser === '1') {
            // 老用户
            window.location.href = 'oldUser.html'
          } else if (res.data.isregisteruser === '0') {
            // 新注册用户
            window.location.href = 'newUser.html'
          }
        },
        error: function(res) {
          $('.warn').fadeIn(100)
          $('.warn>p').text(res.msg)
          $('.warn').fadeOut(4000)
          Flag = true
        }
      })
    }
  })
})
