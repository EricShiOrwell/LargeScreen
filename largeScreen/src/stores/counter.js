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
  function changeData(timeStamp, data) {
    if (flag.value !== timeStamp) {
      frame.value = 0
      flag.value = timeStamp
      calculate.value = data
    }
  }

  function $reset() {
    flag.value = 0
    frame.value = 0
    calculate.value = []
  }

  return { flag, frame, calculate, changeData, $reset }
})
