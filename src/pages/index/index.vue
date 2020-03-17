<template>
  <Global>
    <div class="home" v-if="prepare && authorized && !loading">
      <SearchBar
        disabled
        @onClick="onSearchBarClick"
        :hotSearch="hotSearch && hotSearch.keyword"
      />
      <HomeCard
        :data="homeCardData"
        :num="shelfCount"
        :hasSign="hasSign"
        :signDay="continueSignDay"
        @onBookClick="gotoBookDetail"
        @onSignClick="onSignClick"
      />
      <AdImage :data="adImage" v-if="adImage"></AdImage>
      <HomeBook
        :data="recommend"
        :row="1"
        :col="3"
        title="为你推荐"
        btnText="换一批"
        linearBg
        @onBookClick="gotoBookDetail"
        @onMoreClick="() => onSuggestChange('recommend')"
      />
      <HomeBook
        :data="freeRead"
        :row="2"
        :col="2"
        :mode="modeRow"
        title="免费阅读"
        btnText="换一批"
        @onBookClick="gotoBookDetail"
        @onMoreClick="() => onSuggestChange('freeRead')"
      />
      <HomeBook
        :data="hotBook"
        :row="1"
        :col="4"
        title="当前最热"
        btnText="换一批"
        linearBg
        @onBookClick="gotoBookDetail"
        @onMoreClick="() => onSuggestChange('hotBook')"
      />
      <HomeBook
        :data="category"
        :row="3"
        :col="2"
        :mode="modeCategory"
        title="分类"
        btnText="查看全部"
        @onBookClick="gotoCategoryList"
        @onMoreClick="showCategoryList"
      />
      <van-dialog id="van-dialog"/>
    </div>
    <HomePreload v-if="prepare && authorized && loading"/>
    <Auth v-if="prepare && !authorized" @getUserInfo="handleGetUserInfo"/>
  </Global>
</template>

<script>
  /* eslint-disable */
  import SearchBar from "../../components/SearchBar";
  import HomeCard from "../../components/HomeCard";
  import AdImage from "../../components/AdImage";
  import HomeBook from "../../components/HomeBook";
  import Global from "../../components/Global";
  import HomePreload from "../../components/preload/HomePreload";
  import Auth from "../../components/auth/Auth";
  import {
    getHomeData,
    getHomeSectionData,
    register,
    hasSignToday,
    sign
  } from "../../api";
  import {
    getUserOpenId as getOpenId,
    showLoading,
    hideLoading,
    getSetting,
    getUserInfo,
    setStorageSync,
    getStorageSync,
    showToast
  } from "../../api/wechat";
  import { handleError } from "../../utils";
  import { HOMEBOOK_MODE, CATEGORY } from "@/utils/const";
  import Dialog from "vant-weapp/dist/dialog/dialog";

  export default {
    name: "index",
    components: {
      SearchBar, HomeCard, AdImage, HomeBook, Global, HomePreload, Auth
    },
    computed: {
      homeCardData() {
        return {
          bookList: this.cardList,
          userInfo: this.userInfo
        };
      },
      modeRow() {
        return HOMEBOOK_MODE.ROW;
      },
      modeCategory() {
        return HOMEBOOK_MODE.CATEGORY;
      }
    },
    data() {
      return {
        cardList: [],
        userInfo: null,
        adImage: null,
        recommend: [],
        freeRead: [],
        hotBook: [],
        category: [],
        openId: null,
        hotSearch: null,
        authorized: true,
        loading: true,
        prepare: false,
        shelfCount: 0,
        hasSign: false,
        continueSignDay: 0
      };
    },
    methods: {
      onSignClick() {
        Dialog.confirm({
          title: "立即签到",
          message: "连续签到30天，将有机会获得神秘礼物，敬请期待！",
          confirmButtonText: "是",
          cancelButtonText: "否"
        }).then(() => {
          this.sign();
        }).catch(() => {
        });
      },
      sign() {
        sign(this.openId).then(response => {
          if (handleError(response)) {
            showToast("签到成功", true);
            this.hasSign = true;
            this.continueSignDay++;
            this.getSignState(this.openId);
          }
        });
      },
      getSignState(openId) {
        const vue = this;
        hasSignToday(openId).then(response => {
          if (handleError(response)) {
            vue.hasSign = response.data.data.hasSignToday;
            vue.continueSignDay = response.data.data.continueSignDay;
          }
        });
      },
      showCategoryList() {
        this.$router.push("/pages/categoryList/main");
      },
      onSearchBarClick() {
        this.$router.push({
          path: "/pages/search/main",
          query: {
            hotSearch: (this.hotSearch && this.hotSearch.keyword) || ""
          }
        });
      },
      async onSuggestChange(key) {
        const response = await getHomeSectionData(key);
        if (handleError(response)) {
          this[key] = response.data.data;
        }
      },
      gotoBookDetail(book) {
        this.$router.push({ path: "/pages/detail/main", query: { fileName: book.fileName } });
      },
      gotoCategoryList(data) {
        const { category, text } = data;
        const query = { categoryId: category, title: text };
        this.$router.push({ path: "/pages/list/main", query });
      },
      async getHomeData(openId, onComplete) {
        const vue = this;
        const response = await getHomeData(openId);
        if (handleError(response)) {
          const data = response.data.data || {};
          const {
            banner,
            shelf,
            recommend,
            category,
            freeRead,
            hotBook,
            hotSearch,
            shelfCount
          } = data;
          this.adImage = banner;
          this.cardList = shelf;
          this.recommend = recommend;
          this.category = category;
          this.freeRead = freeRead;
          this.hotBook = hotBook;
          this.hotSearch = hotSearch;
          this.category.forEach(c => {
            c.text = CATEGORY[c.categoryText.toLowerCase()];
          });
          this.shelfCount = shelfCount;
          onComplete && onComplete();
          vue.$nextTick(() => {
            vue.loading = false;
          });
        }
      },

      //拉起授权面板
      getUserInfo() {
        const vue = this;
        const onOpenIdComplete = (vue, openId, userInfo) => {
          vue.openId = openId;
          // 获取首页数据
          vue.getHomeData(openId, hideLoading);
          // 上报用户信息，注册账号
          register(openId, userInfo);
          // 判断用户今天是否签到过
          vue.getSignState(openId);
        };
        console.log("------------getOpenUserInfo支付宝拉起授权面板------------------");
        getUserInfo(
          (userInfo) => {
            vue.userInfo = userInfo;
            setStorageSync("userInfo", userInfo);
            const openId = getStorageSync("openId");
            console.log("---------getStorageSync(openId)-------", openId);
            if (!openId || openId.length === 0) {
              getOpenId((openId) => {
                onOpenIdComplete(vue, openId, userInfo);
              });
            } else {
              onOpenIdComplete(vue, openId, userInfo);
            }
          },
          (err) => {
            console.log("getUserInfo failed", err);
          }
        );
      },

      /**
       * 判断当前小程序是否具备userInfo权限
       *
       * @param res
       */
      getSetting() {
        this.prepare = false;
        this.loading = true;
        const vue = this;
        getSetting(
          "userInfo",
          (res) => {
            console.log("验证成功...", res);
            vue.authorized = true;
            vue.prepare = true;
            vue.getUserInfo();
          },
          (res) => {
            if (mpvuePlatform === "wx") {
              vue.authorized = false;     //如果在微信中则直接拉起授权面板
            }
            console.log("验证失败...", res);
            vue.getUserInfo();
            vue.prepare = true;
            hideLoading();
          }
        );
      },
      /**
       * 处理用户授权
       *
       * @param res
       */
      handleGetUserInfo(res) {
        if (mpvuePlatform === "wx") {
          const { mp: { detail: { errMsg } } } = res;
          if (errMsg === "getUserInfo:ok") {
            this.init();
          } else {
            showToast("授权失败，请重试");
          }
        } else if (mpvuePlatform === "my") {
          mpvue.getAuthCode({
            scopes: "auth_user", // 主动授权（弹框）：auth_user，静默授权（不弹框）：auth_base
            success: (res) => {
              console.log("auth_user", res);
              if (res.authCode) {
                this.init();
              } else {
                showToast("授权失败，请重试");
              }
            },
            fail: () => {
              showToast("授权失败，请重试");
            }
          });
        }
      },
      /**
       * 初始化
       */
      init() {
        showLoading({ title: "正在加载" });
        this.getSetting(); // 判断是否已经具备获取用户信息权限
      }
    },
    mounted() {
      this.init();
    }
  };
</script>

<style lang="scss" scoped>
</style>
