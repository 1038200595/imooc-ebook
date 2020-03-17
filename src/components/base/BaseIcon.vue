<template>
  <van-icon
    :class="customClass"
    :style="customStyle"
    :name="name"
    :color="color"
    :size="size"
    v-if="platform === 'wx'"
  ></van-icon>
  <icon
    :class="customClass"
    :style="customStyle"
    :type="name"
    :color="color"
    :size="size"
    v-else-if="platform === 'my'"
  />
</template>

<script>
  export default {
    props: {
      customStyle: Object,
      customClass: String,
      name: String,
      color: String,
      size: String
    },
    data() {
      return {
        platform: mpvuePlatform
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
