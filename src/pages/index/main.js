import Vue from 'vue'
import App from './index'
// import { onError } from '@/utils/error'

// console.log('index main...')
// getApp().onError(err => {
//   console.log('app onError', err)
// })

const app = new Vue(App)
// onError(app)
app.$mount()
