<template>
  <view class='tabs-container'>
    <!--Tab布局-->
    <view class='tabs-title'>
      <view :class="{'title-sel-selected': 'all' == visible, 'title-sel': 'all' != visible}" @tap="setState('all')">
        <text>所有</text>
        <view class="line-style"></view>
      </view>

      <view :class="{'title-sel-selected': 'active' == visible, 'title-sel': 'active' != visible}"
            @tap="setState('active')">
        <text>未完成</text>
        <view class="line-style"></view>
      </view>
      <view :class="{'title-sel-selected': 'completed' == visible, 'title-sel': 'completed' != visible}"
            @tap="setState('completed')">
        <text>已完成</text>
        <view class="line-style"></view>
      </view>
    </view>
  </view>
</template>

<script>
import './tabs.scss'

export default {
  name: 'tabs',
  data() {
    return {}
  },
  props: {
    setVisibility: Function,
    visible: String
  },
  methods: {
    setState(state) {
      this.setVisibility(state)
    },
  }
}
</script>

