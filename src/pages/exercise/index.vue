<template>
  <Global>
    <div class="exercise">
      <van-action-sheet
        :show="show"
        :actions="actions"
        @close="onAnswerClose"
        @select="onAnswerSelect"
      ></van-action-sheet>
      <div class="tab-wrapper">
        <van-tabs :active="active" color="#4585ff" @change="onTabChange">
          <van-tab
            v-for="(item, index) in exercise"
            :title="'习题' + (index + 1)"
            :key="index"
          >
            <div>
              <div class="title">{{item.name}}</div>
              <wemark :md="item.body" link highlight type="wemark" v-if="item.body"></wemark>
              <div :style="{padding: '15px 0'}">
                <van-button
                  type="info"
                  round
                  custom-class="btn-select"
                  @click="showSelectAnswer(item)"
                >
                  选择答案
                </van-button>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
      <div class="btn-wrapper">
        <van-button type="info" round custom-class="btn-submit">提交</van-button>
      </div>
    </div>
  </Global>
</template>

<script>
  import Global from '@/components/Global'
  import { getExercise } from '../../api'
  import { handleError } from '../../utils'
  import { getStorageSync } from '../../api/wechat'

  export default {
    components: {
      Global
    },
    data() {
      return {
        userInfo: null,
        openId: null,
        active: 0,
        exercise: null,
        show: false,
        actions: []
      }
    },
    methods: {
      onTabChange({ mp: { detail: { index } } }) {
        this.active = index
        this.actions = this.exercise[index].actions
      },
      createActions(item) {
        const actions = [
          { name: 'A', subname: item.answer_a },
          { name: 'B', subname: item.answer_b },
          { name: 'C', subname: item.answer_c },
          { name: 'D', subname: item.answer_d }
        ]
        console.log('createActions', item, actions)
        return actions
      },
      onAnswerClose() {
        this.show = false
      },
      onAnswerSelect(mp) {
        console.log(mp)
      },
      showSelectAnswer() {
        this.show = true
      }
    },
    created() {
      this.userInfo = getStorageSync('userInfo')
      this.openId = getStorageSync('openId')
    },
    mounted() {
      const title = this.$route.query.title
      const exSetId = this.$route.query.exSetId
      const chapterId = this.$route.query.chapterId
      this.active = 0
      mpvue.setNavigationBarTitle({ title })
      getExercise(exSetId, chapterId).then(response => {
        if (handleError(response)) {
          this.exercise = response.data.data
          this.exercise.forEach(item => {
            item.actions = this.createActions(item)
          })
          this.actions = this.exercise[0].actions
        }
      })
    }
  }
</script>

<style lang="scss">
  .exercise {
    .btn-submit {
      width: 100%;
      height: 100%;
    }
  }
</style>
<style lang="scss" scoped>
  @import "../../style/base";

  .exercise {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .tab-wrapper {
      flex: 1;
      overflow: auto;
      padding: 0 15px;

      .title {
        padding: 15px 0;
        font-size: 16px;
        color: #333;
      }
    }

    .btn-wrapper {
      flex: 0 0 60px;
      box-sizing: border-box;
      padding: 15px;
      border-top: 1px solid #eee;
    }
  }
</style>
