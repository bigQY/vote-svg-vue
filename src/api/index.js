import axios from 'axios'

export const requests = axios.create({
  baseURL: 'https://vote.zzdx.gay/api',
  // baseURL: 'http://localhost:5173/api',
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