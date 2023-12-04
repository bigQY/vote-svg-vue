<template>
  <div>
    <a-row>
      <Button @click="showCreateFormF" style="margin: 20px;">创建投票</Button>
    </a-row>
    <a-row style="width: 100%;">
      <a-card Title="Vote List" style="width: 100%;">
        <a-table :columns="topicColumns" :data-source="topicData" row-key="id" style="width: 100%;height: 100%;">
          <template #action="{ record }">
            <a-button @click="viewResults(record)">查看结果</a-button>
          </template>
        </a-table>
      </a-card>
    </a-row>
    <a-modal :open="showCreateForm" @cancel="handleCancel">
      <a-form :model="createFromState">
        <a-form-item label="投票标题">
          <a-input v-model:value="createFromState.Title" />
        </a-form-item>
        <a-form-item label="投票描述">
          <a-input v-model:value="createFromState.Description" />
        </a-form-item>
        <a-form-item label="投票选项">
          <div v-for="(option, index) in createFromState.Options" :key="index">
            <a-row style="align-items: center;">
              <a-input v-model:value="option.OptionText" style="width: 80%;margin: 5px;" />
              <PlusCircleOutlined @click="addOption(index)" style="color: green;margin: 5px;" />
              <MinusCircleOutlined @click="removeOption(index)" v-if="createFromState.Options.length > 1"
                style="color: red;" />
            </a-row>
          </div>
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="submitLoading" @click="handleSubmit">提交</a-button>
      </template>
    </a-modal>
    <a-modal :open="showMarkdown">
      <a-textarea v-model:value="markdown" autoSize disabled />
      <template #footer>
        <a-button key="submit" type="primary" @click="handleCopy">复制</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script setup>
import { Button } from 'ant-design-vue';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons-vue';
import { computed, ref } from 'vue'
import { addVote } from '@/api'
import { useCounterStore } from '@/stores/votes'

const { storeVotes, addVote2Store } = useCounterStore()

// 表格列
const topicColumns = [
  {
    title: '主题ID',
    dataIndex: 'TopicID',
    key: 'TopicID'
  },
  {
    title: '主题标题',
    dataIndex: 'Title',
    key: 'Title'
  },
  {
    title: '主题描述',
    dataIndex: 'Description',
    key: 'Description'
  },
  {
    title: '查看结果',
    key: 'action',
    slots: { customRender: 'action' },
  },
];

const topicData = computed(() => {
  if (!votes.value) {
    return []
  }
  return votes.value.map(vote => vote.topic[0]);
});
const viewResults = (record) => {
  // 打开新窗口，显示svg
  window.open(`https://vote.zzdx.gay/api/vote/${record['TopicID']}/result.svg`,'_blank')

}

const votes = ref(storeVotes)
const createFromState = ref({
  Title: '',
  Description: '',
  Options: [{ OptionText: '' }],
})
const showCreateForm = ref(false)
const showCreateFormF = () => {
  showCreateForm.value = true
}
const addOption = (index) => {
  createFromState.value.Options.splice(index + 1, 0, { OptionText: '' });
}
const removeOption = (index) => {
  createFromState.value.Options.splice(index, 1);
}
const submitLoading = ref(false)
const handleSubmit = () => {
  console.log(createFromState.value)
  submitLoading.value = true
  addVote(createFromState.value).then(res => {
    console.log(res)
    addVote2Store(res.data)
    generateMarkdown(res.data)
    submitLoading.value = false
    handleCancel()
  })
}
const handleCancel = () => {
  showCreateForm.value = false
  createFromState.value = {
    Title: '',
    Description: '',
    Options: [{ OptionText: '' }],
  }
}

const showMarkdown = ref(false)
const markdown = ref('')
const generateMarkdown = (vote) => {
  let md=`
# 投票
![投票结果](https://vote.zzdx.gay/api/vote/${vote.topic[0]['TopicID']}/result.svg)
## 投票选项
`
  md+=vote.options.map(option => {
    return `[${option.OptionText}](https://vote.zzdx.gay/api/vote/${vote.topic[0]['TopicID']}/voteUrl?optionId=${option.OptionID})\n`
  }).join('')
  markdown.value = md
  showMarkdownF()
}
const showMarkdownF = () => {
  showMarkdown.value = true
}
const handleCopy = () => {
  navigator.clipboard.writeText(markdown.value).then(() => {
    showMarkdown.value = false
  })
}

</script>