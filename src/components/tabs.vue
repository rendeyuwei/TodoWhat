<template>
  <view class="filters at-row">
    <text @tap="setState('all')"
          :class="{ selected: visible == 'all', 'filters-link': true , 'at-col':true}">所有
    </text>
    <text @tap="setState('active')"
          :class="{ selected: visible == 'active', 'filters-link': true, 'at-col':true }">未完成
    </text>
    <text @tap="setState('completed')"
          :class="{ selected: visible == 'completed', 'filters-link': true, 'at-col':true }">已完成
    </text>
  </view>
</template>

<script>

export default {
  name: 'tabs',
  data() {
    return {
    }
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

