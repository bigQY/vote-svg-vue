import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('votes', () => {
  const storeVotes = ref([])
  function addVote2Store(vote) {
    storeVotes.value.push(vote)
  }
  return { storeVotes, addVote2Store }
},
  {
    persist: true,
  })
