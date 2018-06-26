$(document).ready(function() {
  $('body').css('visibility', 'inherit')
  //跳转到师徒页面中的如何收徒页面(需要更改为相应服务器地址)
  $('#master').click(function() {
    window.location.href =
      'http://testmanage.ruit666.net/User_Center-H5/#/acceptApper'
  })
  function getUrlParam(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
  }
  var appv = getUrlParam('infversionApp')
  $('.question_btn').click(function() {
    $('.content').removeClass('openMe')
    $('.question_btn').removeClass('choose')
    $(this).addClass('choose') //100 300 500
    var num = $(this).attr('data-index') * 1
    if (num == 1) {
      document.body.scrollTop = document.documentElement.scrollTop = 0
    } else if (num == 2) {
      document.body.scrollTop = document.documentElement.scrollTop = 300
    } else if (num == 3) {
      document.body.scrollTop = document.documentElement.scrollTop = 430
    } else {
      document.body.scrollTop = document.documentElement.scrollTop = 800
    }
  })
  $('.title').click(function() {
    if (
      $(this)
        .next()
        .hasClass('openMe')
    ) {
      $(this)
        .next()
        .removeClass('openMe')
      $(this)
        .children('em')
        .removeClass('open')
    } else {
      $('.title')
        .next()
        .removeClass('openMe')
      $('em').removeClass('open')
      $(this)
        .next()
        .addClass('openMe')
      $(this)
        .children('em')
        .addClass('open')
    }
  })
  $('.p_title').click(function() {
    if (
      $(this)
        .next()
        .hasClass('openMe')
    ) {
      $(this)
        .next()
        .removeClass('openMe')
      $(this)
        .children('u')
        .removeClass('icon_top')
        .addClass('icon_down')
    } else {
      $('.p_title')
        .next()
        .removeClass('openMe')
      $('u')
        .removeClass('icon_top')
        .addClass('icon_down')
      $(this)
        .next()
        .addClass('openMe')
      $(this)
        .children('u')
        .removeClass('icon_down')
        .addClass('icon_top')
    }
  })

  //调用app方法跳转至师徒页面
  $('#gotoBtn').click(function() {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      window.webkit.messageHandlers.jumpView.postMessage('4')
    } else if (/(Android)/i.test(navigator.userAgent)) {
      taskCentre.gofinish('4')
    }
  })

  //调用app方法跳转至文章阅读列表
  $('#jumpBtn').click(function() {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      window.webkit.messageHandlers.jumpView.postMessage('3')
    } else if (/(Android)/i.test(navigator.userAgent)) {
      taskCentre.gofinish('3')
    }
  })

  //跳转至详细步骤页面
  $('#jumpPlay').click(function() {
    window.location.href = 'play.html'
  })

  //调用联系客服方法
  $('#service').click(function() {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      window.webkit.messageHandlers.callService.postMessage('')
    } else if (/(Android)/i.test(navigator.userAgent)) {
      taskCentre.callService()
    }
  })
})
