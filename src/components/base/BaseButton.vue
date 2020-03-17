<template>
  <van-button
    :size="size"
    :type="type"
    :round="round"
    :custom-class="customClass"
    @click="onClick"
    v-if="platform === 'wx'"
  >
    {{text}}
  </van-button>
  <button
    :size="size"
    :type="type"
    :class="customClass"
    :style="{borderRadius: round ? '50px' : '0'}"
    @click="onClick"
    v-else-if="platform === 'my'"
  >
    {{text}}
  </button>
</template>

<script>
  export default {
    props: {
      customClass: String,
      text: String,
      color: String,
      size: String,
      round: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        platform: mpvuePlatform
      }
    },
    methods: {
      onClick() {
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
