<template>
  <Global>
    <div class="chapter">
      <van-notice-bar
        mode="closeable"
        left-icon="https://www.youbaobao.xyz/resource/icon/notice.png"
        text="公告：7月30日小班课火热招募中，请抓紧时间完成签到和习题任务，大家加油！"
      />
      <div class="user-info-wrapper">
        <div class="user-info">
          <div class="user-nick-name">{{userInfo.nickName}}</div>
          <div class="user-read-time">
            <div class="learn-progress-label">课后作业完成进度</div>
            <van-progress percentage="30"/>
          </div>
          <div class="user-avatar-wrapper">
            <img class="user-avatar" :src="userInfo.avatarUrl" mode="widthFix">
          </div>
        </div>
        <div class="user-extra">
          <div class="user-extra-text">总分：322，平均分：97.5</div>
          <div class="user-extra-text-hint">超越90%的同学，你太棒了！</div>
        </div>
      </div>
      <div class="show-rank" @click="gotoClassRank">查看班级排行榜</div>
      <div class="chapter-list-wrapper">
        <div class="chapter-header">习题列表</div>
        <van-collapse :value="activeNames" @change="onCollapseChange">
          <van-collapse-item
            v-for="(item, index) in exerciseSet"
            :key="index"
            :title="item.name"
            :name="index">
            <ChapterList :data="chapter" @onChapterClick="gotoExercise"/>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>
  </Global>
</template>

<script>
  import Global from '@/components/Global'
  import ChapterList from '@/components/chapter/ChapterList'
  import { getExerciseSet, getExerciseChapter } from '../../api'
  import { handleError } from '../../utils'
  import { getStorageSync } from '../../api/wechat'

  export default {
    components: {
      ChapterList,
      Global
    },
    methods: {
      onCollapseChange(e) {
        this.activeNames = e.mp.detail
        if (this.activeNames.length > 0) {
          const exSetId = this.exerciseSet[this.activeNames[0]].id
          getExerciseChapter(exSetId).then(response => {
            if (handleError(response)) {
              this.chapter = response.data.data
              this.chapter.forEach(item => {
                item.indexClass = this.indexClass(item)
                item.scoreClass = this.scoreClass(item)
              })
              console.log(this.chapter)
            }
          })
        } else {
          this.chapter = null
        }
        console.log(this.activeNames)
      },
      gotoExercise(item) {
        if (this.activeNames.length > 0) {
          const exSetId = item.ex_set_id
          const chapterId = item.id
          const title = item.name
          this.$router.push({
            path: '/pages/exercise/main',
            query: { exSetId, chapterId, title }
          })
        }
      },
      gotoClassRank() {
        this.$router.push('/pages/rank/main')
      },
      indexClass(item) {
        let c = 'chapter-index'
        // if (!item.score) {
        //   return c
        // } else {
        //   return c + ' chapter-index-finish'
        // }
        return c + ' chapter-index-finish'
      },
      scoreClass(item) {
        let c = 'chapter-score'
        if (!item.score) {
          return c
        } else if (item.score >= 90) {
          return c + ' excellent'
        } else if (item.score >= 60 && item.score < 90) {
          return c + ' good'
        } else {
          return c + ' bad'
        }
      }
    },
    data() {
      return {
        userInfo: null,
        openId: null,
        activeNames: [],
        chapter: null,
        exerciseSet: null
      }
    },
    created() {
      this.userInfo = getStorageSync('userInfo')
      this.openId = getStorageSync('openId')
    },
    mounted() {
      getExerciseSet().then(response => {
        if (handleError(response)) {
          this.exerciseSet = response.data.data
        }
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../style/base";

  .chapter {
    .user-info-wrapper {
      margin: 15px 25px;
      background: #eee;
      border-radius: 15px;
      padding: 15px 20px;

      .user-info {
        position: relative;
        height: 80px;
        border-bottom: 1px solid #ddd;

        .user-nick-name {
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }

        .user-read-time {
          font-size: 12px;
          color: #999;

          .learn-progress-label {
            padding: 10px 0;
          }
        }

        .user-avatar-wrapper {
          position: absolute;
          right: 0;
          top: 0;

          .user-avatar {
            width: 40px;
            border-radius: 50%;
          }
        }
      }

      .user-extra {
        margin-top: 15px;

        .user-extra-text {
          font-size: 12px;
          color: #333;
          font-weight: 500;
        }

        .user-extra-text-hint {
          font-size: 10px;
          color: #999;
          margin-top: 5px;
        }
      }
    }

    .show-rank {
      margin-top: 10px;
      text-align: center;
      color: #666;
      font-size: 12px;
    }

    .chapter-list-wrapper {
      padding: 15px 0 15px 15px;

      .chapter-header {
        text-align: center;
        color: #333;
        font-weight: 500;
        font-size: 20px;
        padding: 15px 0;
      }
    }
  }
</style>
