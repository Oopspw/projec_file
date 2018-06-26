<template>
  <div class="container">
    <div v-show="showLuckTip" class="luck-tip">
      <!-- 重复分享无效的提示 -->
      <div v-show="showShareTip" class="luck-share">
        <div class="luck-share-info">
          抱歉, 您当前抽奖次数不足,分享链接到朋友圈和QQ空间可获得抽奖次数继续抽奖, 每天重复分享无效。
        </div>
        <div class="luck-share-btn">
          <div @click="returnIndex" class="makemoney">不玩了，赚钱去</div>
          <div @click="showShare" class="share">立即分享</div>
        </div>
      </div>
      <!-- 抽奖获得奖品提示 -->
      <div v-show="showLuckInfoTip" class="luck-tip-cont">
        <div class="luck-tip-title" v-text="lottery.Type=='4'?'很遗憾未中奖':'恭喜您中奖啦!'"></div>
        <div class="luck-tip-info">
          <p v-if="lottery.Type !='4'">
            <span>{{lottery.prizename}}</span>已到账</p>
          <p v-if="lottery.Type !='4'">请到收入明细查看</p>
          <p v-if="lottery.Type=='4'">不要气馁哦，</p>
          <p v-if="lottery.Type=='4'">坚持就是胜利</p>
          <div @click="showLuckTip=false" class="luck-tip-btn">继续抽奖</div>
        </div>
      </div>
    </div>
    <div class="luck-wheel">
      <div class="luck-users">
        <ul>
          <li v-for="item in datas.record" v-html="item.Description"></li>
        </ul>
      </div>
      <img src="../../static/img/wheel_bg.png" alt="">
      <div class="loading">
        <img src="../../static/img/loading.gif" alt="">
      </div>
      <div class="wheel">
        <div class="lottery-box">
          <div v-for="(item, index) in datas.tableList" class="lotterys" :class="'prize'+(index+1)">
            <p>{{item.prizename}}</p>
            <img v-lazy="item.image" alt="" />
          </div>
        </div>
      </div>
      <div @click="begin" class="lottery-btn"></div>
    </div>
    <div class="experience">
      <div class="chance-num">
        <img src="../../static/img/cishu_icon.png" alt="">
        <span>您今天还有</span>
        <span class="num">{{datas.everydaynumber}}</span>
        <span>次机会</span>
      </div>
    </div>
    <div class="rule">
      <div class="rule-title">活动说明</div>
      <div class="rule-info">
        <ul>
          <li v-html="datas.intro"></li>
        </ul>
        <span class="statement" v-if="showTips">声明：所有产品抽奖活动与苹果公司（Apple Inc)无关</span>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import { Toast } from 'mint-ui'
require('../../static/js/rotate.js')
require('../../static/js/jquery.vticker-min.js')
export default {
  data: function () {
    return {
      url: window.config.api.postUrl,
      Infversion: window.config.api.Infversion,
      userid: '',
      token: '',
      appv: '',
      datas: {},
      flag: true,
      showTips: false,
      activityid: '',
      displayorder: '0',
      showLuckTip: false,
      showLuckInfoTip: false,
      showShareTip: false,
      showShareLayer: false,
      lottery: {},
      bgurl: '../../static/img/luckwheel-tip-title.png'
    }
  },
  components: { Toast },
  updated: function () {},
  mounted: function () {
    document.title = '幸运抽奖'
    setTimeout(function () {
      $('.luck-users').vTicker({
        speed: 700,
        pause: 3000,
        animation: 'fade',
        mousePause: false,
        showItems: 1
      })
      $('.luck-users').css('height', '.7rem')
    }, 500)
    let _this = this
    _this.userid = _this.$getHashParameter('userid')
    _this.token = _this.$getHashParameter('token')
    _this.appv = _this.$getHashParameter('infversionApp')
    _this.luckyInfo()
    _this.showLuckTip = true
    _this.showLuckInfoTip = true
    $('.luck-wheel>img').on('load', function () {
      setTimeout(function () {
        _this.showLuckTip = false
        _this.showLuckInfoTip = false
      }, 0)
      $('.loading').hide()
    })
    // app调用刷新转盘信息接口
    window['refreshLucky'] = function () {
      location.reload()
    }
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      this.showTips = true
    }
  },
  methods: {
    // 获取抽奖信息
    luckyInfo: function () {
      let _this = this
      let url = _this.url
      let data = {
        userid: _this.userid,
        token: _this.token,
        Infversion: _this.Infversion,
        Method: 'LuckyInfoWap',
        appv: _this.appv
      }
      _this.$Post(
        url,
        data,
        res => {
          _this.datas = res.data
          _this.activityid = res.data.activityid
        },
        res => {
          Toast({
            message: res.msg.split('|')[1],
            duration: 2000
          })
        }
      )
    },
    // 点击抽奖触发
    begin: function () {
      let _this = this
      if (
        _this.datas.blanceExp >= _this.datas.num ||
        _this.datas.everydaynumber > 0 // 判断触发抽奖的条件 抽奖的次数是否大于0
      ) {
        if (_this.flag) {
          _this.luckyClick()
        }
      } else {
        _this.showLuckTip = true
        _this.showLuckInfoTip = false
        _this.showShareTip = true
      }
    },
    wheel: function () {
      let _this = this
      let wheel = $('.lottery-box')
      _this.flag = false
      wheel.rotate({
        angle: 0,
        duration: 6000, // 旋转时间
        animateTo: -45 * (_this.lottery.displayorder - 1) + 1800, // 让它根据得出来的结果加上1440度旋转
        callback: function () {
          _this.flag = true
          _this.showLuckTip = true
          _this.showLuckInfoTip = true
          _this.showShareTip = false
          if (_this.lottery.Type === '1') {
            _this.goldVoice()
          }
        }
      })
    },
    luckyClick: function () {
      console.log(this.activityid)
      let _this = this
      _this.flag = false
      let url = _this.url
      let data = {
        userid: _this.userid,
        token: _this.token,
        Infversion: _this.Infversion,
        activityid: _this.activityid,
        Method: 'LuckyClickWap',
        appv: _this.appv
      }
      _this.$Post(
        url,
        data,
        res => {
          _this.lottery = res.data
          _this.datas.blanceExp =
            parseInt(_this.datas.blanceExp) - parseInt(_this.datas.num)
          _this.datas.everydaynumber = _this.datas.everydaynumber - 1
          _this.wheel()
        },
        res => {
          Toast({
            message: res.msg.split('|')[1],
            duration: 2000
          })
        }
      )
    },
    returnIndex: function () {
      this.showShareTip = false
      this.showLuckTip = false
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        window.webkit.messageHandlers.jumpView.postMessage('3')
      } else {
        window.taskCentre.gofinish('3')
      }
    },
    // 调用app方法弹出分享
    showShare: function () {
      let _this = this
      _this.showShareLayer = false
      _this.showLuckTip = false
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        window.webkit.messageHandlers.showShareLayer.postMessage('')
      } else {
        window.taskCentre.showShareLayer()
      }
    },
    // 抽到金币
    goldVoice: function () {
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        window.webkit.messageHandlers.goldVoice.postMessage('')
      } else {
        window.taskCentre.goldVoice()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../src/common/css/luckWheel.scss';
</style>
