<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'app',
  data: function () {
    return {
      showMsg: 'order'
    }
  },
  components: { },
  mounted: function () {
  },
  methods: {
  }
}
</script>

