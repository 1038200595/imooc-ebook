<template>
  <div class="chapter-list-inner">
    <div
      class="chapter-item"
      v-for="item in data"
      :key="item.index"
      @click="onChapterClick(item)"
      :style="{marginLeft: (item.level - 1) * 15 + 'px'}"
    >
      <div
        :class="item.indexClass"
        :style="{fontSize: 30 - (item.level - 1) * 5 + 'px'}"
      >
        {{item.order}}
      </div>
      <div :class="item.score ? 'chapter-right not-finish' : 'chapter-right'">
        <div
          class="chapter-name"
          :style="{
            fontSize: 16 - (item.level - 1) * 2 + 'px',
            color: item.level === 1 ? '#333': '#666'
          }"
        >
          {{item.name}}
        </div>
        <div class="chapter-section" v-if="!item.score">
          <div class="chapter-num">习题数量：{{item.num || 0}}题</div>
          <div class="chapter-min">预计完成时间：{{item.finishTime || 0}}分</div>
        </div>
        <div class="chapter-section" v-else>
          <div class="chapter-num">
            得分：
            <span :class="item.scoreClass">{{item.score}}</span>
          </div>
          <div class="chapter-min">完成时间：{{item.finishMin}}分</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      data: Array
    },
    methods: {
      onChapterClick(item) {
        this.$emit('onChapterClick', item)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../../style/base';

  .chapter-list-inner {
    padding: 10px 0;

    .chapter-item {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px solid #eee;

      &:last-child {
        border-bottom: none;
      }

      .chapter-index {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        color: rgba(69, 133, 255, .3);
        @include center;

        &.chapter-index-finish {
          color: rgba(69, 133, 255, .7);
        }
      }

      .chapter-right {
        flex: 1;
        margin-left: 15px;
        max-width: 80%;
        height: 100%;

        &.not-finish {
          opacity: .3;
        }

        .chapter-name {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .chapter-section {
          margin-top: 5px;
          display: flex;
          color: #999;
          font-size: 12px;

          .chapter-num {
            flex: 1;
          }

          .chapter-min {
            flex: 1;
          }

          .chapter-score {
            flex: 1;
            font-weight: 500;
            font-size: 14px;

            &.excellent {
              color: #149dff;
            }

            &.good {
              color: #79ff7b;
            }

            &.bad {
              color: #ff2864;
            }
          }
        }
      }
    }
  }
</style>
