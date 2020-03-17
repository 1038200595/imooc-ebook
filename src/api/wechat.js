import { getOpenId, getAlipayOpenId } from './index'
import { handleError } from '../utils'
import { setError } from '../utils/error'

export function showLoading(params) {
  const wx = () => {
    const { title } = params
    mpvue.showLoading({ title })
  }
  const my = () => {
    const { title: content } = params
    mpvue.showLoading({ content })
  }
  adapter({ wx, my })
}

export function hideLoading() {
  mpvue.hideLoading()
}

// 判断当前小程序是否具备userInfo权限
export function getSetting(authorize, onSuccess, onFail) {
  const wx = (res) => {
    if (res.authSetting[`scope.${authorize}`]) {
      onSuccess(res)
    } else {
      onFail(res)
    }
  }
  const my = (res) => {
    if (res.authSetting[authorize]) {
      onSuccess(res)
    } else {
      onFail(res)
    }
  }
  mpvue.getSetting({
    success: (res) => {
      adapter({ wx, my }, res)
    },
    fail: () => {
      setError('获取权限失败')
    }
  })
}

// 获取会员基础信息
export function getUserInfo(onSuccess, onFail) {
  const wx = () => {
    mpvue.getUserInfo({
      success(res) {
        const { userInfo } = res
        console.log('getUserInfo', userInfo)
        onSuccess(userInfo)
      },
      fail() {
        onFail ? onFail() : setError('获取用户信息失败')
      }
    })
  }
  const my = () => {
    mpvue.getOpenUserInfo({
      success(res) {
        let userInfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 response
        res.avatarUrl = res.avatar || res.avatarUrl || userInfo.avatar
        delete res.avatar
        console.log(userInfo, '@@@获取会员基础信息@@@')
        onSuccess(userInfo)
      },
      fail() {
        onFail ? onFail() : setError('获取用户信息失败')
      }
    })
  }
  adapter({ wx, my })
}

// 通过用户code和小程序appid获取支付宝openId
export function getUserOpenId(cb) {
  const wx = () => {
    mpvue.login({
      success: function(res) {
        console.log(res)
        if (res.code) {
          const appid = 'wx43d5eafb479c9649' // 我的微信小程序appid
          getOpenId(appid, res.code).then(response => {
            if (handleError(response)) {
              const openId = response.data.data.openid
              const sessionKey = response.data.data.session_key
              setStorageSync('openId', openId)
              setStorageSync('session_key', sessionKey)
              cb && cb(openId)
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
          setError('获取用户登录态失败！')
        }
      },
      fail() {
        setError('获取openId失败！')
      }
    })
  }
  const my = () => {
    mpvue.getAuthCode({
      scopes: 'auth_user', // 主动授权（弹框）：auth_user，静默授权（不弹框）：auth_base
      success: async (res) => {
        console.log('----getUserOpenId获取----res.authCode，通过code和小程序appid一起去获得支付宝小程序的openId------', res)
        if (res.authCode) {
          const code = res.authCode
          const appId = '2021001144674074' // 我的支付宝小程序appId2021001144674074 ||  老师的支付宝小程序appId：2019060665444521
          const response = await getAlipayOpenId(appId, code) // 这个getAlipayOpenId接口需要自己本地起node项目运行
          if (handleError(response)) {
            const openId = response.data.data.openid
            const sessionKey = response.data.data.session_key
            setStorageSync('openId', openId)
            setStorageSync('session_key', sessionKey)
            cb && cb(openId)
          }
        } else {
          setError('获取openId失败！')
        }
      },
      fail: () => {
        setError('获取openId失败！')
      }
    })
  }
  adapter({ wx, my })
}

export function setStorageSync(key, data) {
  console.log('setStorageSync', key, data)
  const wx = () => {
    mpvue.setStorageSync(key, data)
  }
  const my = () => {
    mpvue.setStorageSync({ key, data })
  }
  adapter({ wx, my })
}

export function getStorageSync(key) {
  const wx = () => {
    return mpvue.getStorageSync(key)
  }
  const my = () => {
    const result = mpvue.getStorageSync({ key })
    return (result && result.data) || null
  }
  const result = adapter({ wx, my })
  console.log('getStorageSync', key, result)
  return result
}

export function setNavigationBar({ title }) {
  const wx = () => {
    mpvue.setNavigationBarTitle({ title })
  }
  const my = () => {
    mpvue.setNavigationBar({ title })
  }
  adapter({ wx, my })
}

export function showToast(title, success = false) {
  adapter({
    wx() {
      success ? mpvue.showToast({ title })
        : mpvue.showToast({ title, icon: 'none' })
    },
    my() {
      mpvue.showToast({
        type: success ? 'success' : 'none',
        content: title
      })
    }
  })
}

export function showModal({ title, content, callback }) {
  adapter({
    wx() {
      mpvue.showModal({
        title,
        content,
        success(res) {
          if (res.confirm) {
            callback && callback()
          }
        }
      })
    },
    my() {
      mpvue.confirm({
        title,
        content,
        success: (result) => {
          if (result.confirm) {
            callback && callback()
          }
        }
      })
    }
  })
}

function adapter(fn, params) {
  return fn[mpvuePlatform] && fn[mpvuePlatform](params)
}
