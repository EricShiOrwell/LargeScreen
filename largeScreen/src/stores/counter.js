import { ref, computed, shallowRef } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const useCalculateStore = defineStore('calculate', () => {
  const flag = ref(0)
  const frame = ref(0)
  const calculate = shallowRef([])
  const isOverall = ref(false)
  function changeData(timeStamp, data) {
    if (flag.value !== timeStamp && data.length > 0) {
      frame.value = 0
      flag.value = timeStamp
      let overall = data.find(e => e.name === '全局')
      if(overall) {
        isOverall.value = true
        calculate.value = [overall].concat(data.filter(e => e.name !== '全局'))
      } else {
        isOverall.value = false
        calculate.value = data
      }
    }
  }

  function $reset() {
    flag.value = 0
    frame.value = 0
    calculate.value = []
    isOverall.value = false
  }

  return { flag, frame, calculate, isOverall, changeData, $reset }
})
