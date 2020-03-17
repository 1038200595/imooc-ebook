<template>
  <Global>
    <div class="search">
      <SearchBar
        @onClick="onSearchBarClick"
        @onConfirm="onConfirm"
        @onChange="onChange"
        @onClear="onClear"
        :hotSearch="hotSearchWord"
        :focus="searchFocus"
        ref="searchBar"
      />
      <TagGroup
        headerText="热门搜索"
        btnText="换一批"
        @onClick="onHotSearchClick"
        @onBtnClick="changeHotSearch"
        :value="hotSearch"
        v-if="!showSearchList"
      />
      <TagGroup
        headerText="搜索历史"
        btnText="清空"
        @onClick="item => onHistoryClick(item)"
        @onBtnClick="clearHistorySearch"
        :value="historySearch"
        v-if="!showSearchList"
      />
      <SearchList
        :data="searchList"
        v-if="showSearchList"
      />
    </div>
  </Global>
</template>

<script>
  import SearchBar from '@/components/SearchBar'
  import TagGroup from '../../components/TagGroup'
  import SearchList from '@/components/SearchList'
  import Global from '@/components/Global'
  import { search, hotSearch } from '@/api'
  import { setStorageSync, getStorageSync, showToast } from '../../api/wechat'

  const HOT_SEARCH_KEY = 'historySearch'
  const OPEN_ID_KEY = 'openId'
  export default {
    components: {
      SearchBar,
      TagGroup,
      SearchList,
      Global
    },
    props: {
      hotSearchWord: {
        type: String,
        default: ''
      }
    },
    computed: {
      showSearchList() {
        let keys = []
        if (this.searchList) {
          keys = Object.keys(this.searchList)
        }
        return this.searchList && keys.length > 0
      }
    },
    data() {
      return {
        hotSearch: null,
        hotSearchKey: null,
        historySearch: null,
        searchList: null,
        openId: null,
        page: 1,
        searchFocus: true
      }
    },
    methods: {
      onSearchBarClick() {
        if (!this.searchFocus) {
          this.searchFocus = true
        }
      },
      getHotSearch() {
        hotSearch().then(response => {
          const _hotSearch = response.data.data
          this.hotSearch = []
          this.hotSearchKey = []
          _hotSearch.forEach(i => {
            this.hotSearch.push(i.title)
            this.hotSearchKey.push(i.fileName)
          })
        })
      },
      onClear() {
        this.searchList = null
      },
      onSearch(keyword, appendOpenId = false) {
        const params = {
          keyword,
          page: this.page
        }
        if (appendOpenId && this.openId) {
          params.openId = this.openId
        }
        search(params).then(response => {
          if (response && response.data && response.data.error_code === 0) {
            this.searchList = response.data.data
          }
        })
      },
      onConfirm(keyword) {
        if (!keyword || keyword.trim().length === 0) {
          if (this.hotSearchWord && this.hotSearchWord.length > 0) {
            this.$refs.searchBar.setValue(this.hotSearchWord)
            keyword = this.hotSearchWord
          } else {
            return
          }
        }
        if (!this.historySearch.includes(keyword)) {
          this.historySearch.push(keyword)
          setStorageSync(HOT_SEARCH_KEY, this.historySearch)
        }
        this.searchFocus = false
        this.onSearch(keyword, true)
      },
      onChange(keyword) {
        if (!keyword || keyword.trim().length === 0) {
          this.searchList = null
          return
        }
        this.onSearch(keyword)
      },
      onHistoryClick(keyword) {
        this.$refs.searchBar.setValue(keyword)
        this.onSearch(keyword, true)
      },
      onHotSearchClick(keyword) {
        const index = this.hotSearch.indexOf(keyword)
        const fileName = this.hotSearchKey[index]
        this.$router.push({ path: '/pages/detail/main', query: { fileName } })
      },
      changeHotSearch() {
        this.getHotSearch()
      },
      clearHistorySearch() {
        this.historySearch = []
        setStorageSync(HOT_SEARCH_KEY, this.historySearch)
      }
    },
    mounted() {
      this.hotSearchWord = this.$route.query.hotSearch
      this.historySearch = getStorageSync(HOT_SEARCH_KEY) || []
      console.log('mounted historySearch', this.historySearch)
      this.openId = getStorageSync(OPEN_ID_KEY) || ''
      this.page = 1
      this.searchList = null
      this.getHotSearch()
      this.$refs.searchBar.setValue('')
      this.searchFocus = true
    },
    onReachBottom() {
      this.page++
      if (this.searchList) {
        const searchWord = this.$refs.searchBar.getValue()
        search({
          keyword: searchWord,
          page: this.page
        }).then(response => {
          if (response && response.data && response.data.error_code === 0) {
            const book = response.data.data.book
            if (book && book.length > 0) {
              this.searchList.book.push(...book)
            } else {
              showToast('没有更多数据了')
            }
          }
        })
      }
    },
    onPageScroll() {
      if (this.searchFocus) {
        this.searchFocus = false
      }
    }

  }
</script>

<style lang="scss" scoped>
</style>
