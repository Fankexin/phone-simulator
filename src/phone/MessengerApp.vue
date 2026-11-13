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

const { route } = usePhone()
const app = computed(() => route.value?.app || 'wechat')
const theme = computed(() => (app.value === 'sms' ? 'sms' : 'wechat'))
const title = computed(() => (app.value === 'sms' ? '信息' : '微信'))
const view = computed(() => route.value?.view || '')
</script>

<template>
  <MomentsView v-if="view === 'moments'" :contact-id="route?.contact || ''" />
  <ContactProfile v-else-if="view === 'contact' && route?.contact" :contact-id="route.contact" />
  <NewFriends v-else-if="view === 'new-friends'" />
  <ChatInfo v-else-if="view === 'chat-info' && route?.thread" :thread-id="route.thread" />
  <ChatFind
    v-else-if="view === 'find-chat' && route?.thread"
    mode="find"
    :thread-id="route.thread"
  />
  <ChatFind
    v-else-if="view === 'find-date' && route?.thread"
    mode="date"
    :thread-id="route.thread"
  />
  <ChatFind
    v-else-if="view === 'find-day' && route?.thread"
    mode="day"
    :thread-id="route.thread"
    :day="route.day"
  />
  <ChatPane v-else-if="route?.thread" :thread-id="route.thread" :theme="theme" :back-label="title" />
  <InboxList v-else :app="app" :title="title" />
</template>
