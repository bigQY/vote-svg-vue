import axios from 'axios'

export const requests = axios.create({
  baseURL: '/api',
  timeout: 20 * 1000
})

// 添加投票
export const addVote = (data) => {
  return requests({
    url: '/vote/add',
    method: 'post',
    data
  })
}