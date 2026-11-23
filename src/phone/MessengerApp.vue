<script setup>
import { computed } from 'vue'
import { usePhone } from './usePhone.js'
import InboxList from './InboxList.vue'
import ChatPane from './ChatPane.vue'
import ChatInfo from './ChatInfo.vue'
import ChatFind from './ChatFind.vue'
import MomentsView from './MomentsView.vue'
import NewFriends from './NewFriends.vue'
import ContactProfile from './ContactProfile.vue'
import FavoritesView from './FavoritesView.vue'
import ChannelsView from './ChannelsView.vue'

const { route } = usePhone()
const app = computed(() => route.value?.app || 'wechat')
const theme = computed(() => (app.value === 'sms' ? 'sms' : 'wechat'))
const title = computed(() => (app.value === 'sms' ? '信息' : '微信'))
const view = computed(() => route.value?.view || '')
const findMode = computed(() => {
  if (view.value === 'find-date') return 'date'
  if (view.value === 'find-day') return 'day'
  return 'find'
})
const isFind = computed(() => ['find-chat', 'find-date', 'find-day'].includes(view.value))
</script>

<template>
  <div class="shell" :data-theme="theme">
    <MomentsView v-if="view === 'moments'" :contact-id="route?.contact || ''" />
    <ContactProfile v-else-if="view === 'contact' && route?.contact" :contact-id="route.contact" />
    <NewFriends v-else-if="view === 'new-friends'" />
    <FavoritesView v-else-if="view === 'favorites'" />
    <ChannelsView v-else-if="view === 'channels'" />
    <ChatInfo v-else-if="view === 'chat-info' && route?.thread" :thread-id="route.thread" />
    <ChatFind
      v-else-if="isFind && route?.thread"
      :mode="findMode"
      :thread-id="route.thread"
      :day="route.day || ''"
    />
    <ChatPane v-else-if="route?.thread" :thread-id="route.thread" :theme="theme" :back-label="title" />
    <InboxList v-else :app="app" :title="title" />
  </div>
</template>

<style scoped>
.shell {
  background: #ededed;
}

.shell[data-theme='sms'] {
  background: #fff;
}

.shell > :deep(*) {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
</style>
