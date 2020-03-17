<template xmlns="http://www.w3.org/1999/html">
  <Global>
    <div class="rank">
      <div class="stat">
        <span>共123位同学</span>
      </div>
      <div class="tab-wrapper">
        <div class="tab active">习题总分排行榜</div>
        <div class="tab">学习进度排行榜</div>
      </div>
      <div class="tab-content">
        <div class="rank-list">
          <div class="rank-card" v-for="(rank, index) in rankList" :key="index">
            <div class="info">
              <div class="avatar-wrapper">
                <ImageView :src="rank.avatarUrl" round></ImageView>
              </div>
              <div class="name">{{rank.name}}</div>
              <div class="medal-wrapper" v-if="rank.medal">
                <div class="medal" v-for="(medalItem, subIndex) in rank.medal" :key="subIndex">
                  <ImageView :src="medalItem.url" height="100%" mode="scaleToFill" round></ImageView>
                </div>
              </div>
            </div>
            <div class="score">{{rank.score}}
              <span class="score-unit">分</span>
            </div>
            <div :class="rank.rank <= 3 ? 'rank top-rank' : 'rank'">{{rank.rank}}</div>
          </div>
        </div>
      </div>
    </div>
  </Global>
</template>

<script>
  import Global from '@/components/Global'
  import ImageView from '@/components/base/ImageView'
  import { getStorageSync } from '../../api/wechat'

  export default {
    components: {
      ImageView,
      Global
    },
    data() {
      return {
        userInfo: null,
        rankList: [
          {
            avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83ereGLVUwIHzgcZUHlIfH0fuic3ehFoxW1rX0926ZdPbYZxRtGIJkW1yAeFODrvY3XdfbzH3n458Erg/132',
            name: '用户昵称',
            score: '377',
            rank: 1,
            medal: [
              { url: 'https://www.youbaobao.xyz/resource/icon/medal.png', key: 'user1Medal1' },
              { url: 'https://www.youbaobao.xyz/resource/icon/cup.png', key: 'user1Medal2' }
            ],
            key: 'user1'
          }, {
            avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83ereGLVUwIHzgcZUHlIfH0fuic3ehFoxW1rX0926ZdPbYZxRtGIJkW1yAeFODrvY3XdfbzH3n458Erg/132',
            name: '用户昵称',
            score: '377',
            rank: 2,
            medal: [
              { url: 'https://www.youbaobao.xyz/resource/icon/cup.png', key: 'user2Medal1' }
            ],
            key: 'user2'
          }, {
            avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83ereGLVUwIHzgcZUHlIfH0fuic3ehFoxW1rX0926ZdPbYZxRtGIJkW1yAeFODrvY3XdfbzH3n458Erg/132',
            name: '用户昵称',
            score: '377',
            rank: 3,
            medal: [
              { url: 'https://www.youbaobao.xyz/resource/icon/medal.png', key: 'user3Medal1' }
            ],
            key: 'user3'
          }, {
            avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83ereGLVUwIHzgcZUHlIfH0fuic3ehFoxW1rX0926ZdPbYZxRtGIJkW1yAeFODrvY3XdfbzH3n458Erg/132',
            name: '用户昵称',
            score: '377',
            rank: 4,
            key: 'user4'
          }, {
            avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83ereGLVUwIHzgcZUHlIfH0fuic3ehFoxW1rX0926ZdPbYZxRtGIJkW1yAeFODrvY3XdfbzH3n458Erg/132',
            name: '用户昵称',
            score: '377',
            rank: 5,
            key: 'user5'
          }, {
            avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83ereGLVUwIHzgcZUHlIfH0fuic3ehFoxW1rX0926ZdPbYZxRtGIJkW1yAeFODrvY3XdfbzH3n458Erg/132',
            name: '用户昵称',
            score: '377',
            rank: 6,
            key: 'user6'
          }, {
            avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83ereGLVUwIHzgcZUHlIfH0fuic3ehFoxW1rX0926ZdPbYZxRtGIJkW1yAeFODrvY3XdfbzH3n458Erg/132',
            name: '用户昵称',
            score: '377',
            rank: 7,
            key: 'user7'
          }
        ]
      }
    },
    created() {
      this.userInfo = getStorageSync('userInfo')
      this.openId = getStorageSync('openId')
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../style/base";

  .rank {
    .stat {
      padding: 15px;
      font-size: 12px;
      color: #666;
      text-align: center;
    }

    .tab-wrapper {
      display: flex;
      padding: 15px;

      .tab {
        flex: 1;
        color: #333;
        font-weight: 500;
        font-size: 14px;
        text-align: center;

        &.active {
          color: #4585ff;
        }
      }
    }

    .tab-content {
      .rank-list {
        padding: 0 15px 15px 15px;

        .rank-card {
          position: relative;
          overflow: hidden;
          border-radius: 5px;
          background: #f5f5f5;
          box-shadow: 4px 4px 6px 0 rgba(0, 0, 0, .1);
          margin-top: 15px;
          padding: 15px;

          .info {
            display: flex;
            align-items: center;

            .avatar-wrapper {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              border: 1px solid #ddd;
            }

            .name {
              font-size: 14px;
              color: #333;
              margin-left: 15px;
            }

            .medal-wrapper {
              display: flex;
              margin-left: 15px;

              .medal {
                width: 30px;
                height: 30px;
              }
            }
          }

          .score {
            font-size: 25px;
            color: #333;
            font-weight: 500;
            margin-top: 15px;

            .score-unit {
              font-size: 18px;
              color: #666;
            }
          }

          .rank {
            position: absolute;
            right: 10px;
            bottom: -30px;
            font-size: 80px;
            font-weight: 700;
            color: rgba(69, 133, 255, .1);

            &.top-rank {
              color: rgba(255, 215, 0, .3);
            }
          }
        }
      }
    }
  }
</style>
