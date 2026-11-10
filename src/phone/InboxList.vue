<script setup>
import { computed } from 'vue'
import Avatar from './Avatar.vue'
import { usePhone } from './usePhone.js'
import chatOff from '../images/wechat/chats-off.svg'
import chatOn from '../images/wechat/chats-on.svg'
import contactsOff from '../images/wechat/contacts-off.svg'
import contactsOn from '../images/wechat/contacts-on.svg'
import findOff from '../images/wechat/discover-off.svg'
import findOn from '../images/wechat/discover-on.svg'
import meOff from '../images/wechat/me-off.svg'
import meOn from '../images/wechat/me-on.svg'
import momentsIcon from '../images/wechat/moments.svg'
import channelsIcon from '../images/wechat/channels.svg'
import favoritesIcon from '../images/wechat/favorites.svg'
import settingsIcon from '../images/wechat/settings.svg'

const props = defineProps({
  app: { type: String, required: true },
  title: { type: String, required: true },
})

const phone = usePhone()
const { wechatTab } = phone
const unread = computed(() => phone.badgeCount('wechat'))
const heading = computed(() => (unread.value ? `微信(${unread.value})` : '微信'))
const contacts = computed(() => phone.threadsFor('wechat'))

const contactShortcuts = [
  { id: 'new', name: '新的朋友', tone: 'new' },
  { id: 'group', name: '群聊', tone: 'group' },
  { id: 'tag', name: '标签', tone: 'tag' },
  { id: 'oa', name: '公众号', tone: 'oa' },
]

const discover = [
  [{ id: 'moments', name: '朋友圈', icon: momentsIcon }],
  [{ id: 'video', name: '视频号', icon: channelsIcon }],
]

const mine = [
  [
    { id: 'fav', name: '收藏', icon: favoritesIcon },
    { id: 'moments', name: '朋友圈', icon: momentsIcon },
  ],
  [{ id: 'settings', name: '设置', icon: settingsIcon }],
]

function openRow(id) {
  if (id === 'moments') phone.openMoments()
}

function letterOf(name) {
  const ch = (name || '#').trim().charAt(0)
  return /[A-Za-z]/.test(ch) ? ch.toUpperCase() : ch
}
</script>

<template>
  <div v-if="app === 'sms'" class="inbox sms">
    <header class="sms-top">
      <button type="button" class="edit" tabindex="-1">编辑</button>
      <h1>信息</h1>
      <button type="button" class="compose" tabindex="-1" aria-label="编写">
        <svg viewBox="0 0 24 24"><path d="M4 18.5V6.8A1.8 1.8 0 0 1 5.8 5h8.4A1.8 1.8 0 0 1 16 6.8v7.4a1.8 1.8 0 0 1-1.8 1.8H8l-4 2.5z" /><path d="M14.5 4.5 19 9l-7.5 7.5H7v-4.5z" /></svg>
      </button>
    </header>
    <label class="sms-search">
      <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
      搜索
    </label>
    <div class="scroll">
      <button
        v-for="thread in phone.threadsFor(app)"
        :key="thread.id"
        type="button"
        class="row"
        @click="phone.openThread(thread.id)"
      >
        <i v-if="thread.badge" class="unread" />
        <Avatar :contact="thread.contact" :size="48" round />
        <span class="copy">
          <span class="top">
            <b>{{ thread.contact.name }}</b>
            <time>{{ thread.last?.time }}</time>
          </span>
          <span class="preview">{{ thread.last?.text }}</span>
        </span>
      </button>
    </div>
  </div>

  <div v-else class="wx">
    <header class="wxh">
      <b>{{ wechatTab === 'chats' ? heading : wechatTab === 'contacts' ? '通讯录' : wechatTab === 'find' ? '发现' : '' }}</b>
      <span v-if="wechatTab === 'chats'" class="plus" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
      </span>
      <span v-else-if="wechatTab === 'contacts'" class="plus" aria-hidden="true">
        <svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2" /><path d="M2.8 19c.8-3.2 3.2-5 6.2-5s5.4 1.8 6.2 5M16.5 8.5h5M19 6v5" /></svg>
      </span>
    </header>

    <div v-if="wechatTab === 'chats' || wechatTab === 'contacts'" class="search">
      <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
      搜索
    </div>

    <div v-if="wechatTab === 'chats'" class="list">
      <button
        v-for="thread in phone.threadsFor('wechat')"
        :key="thread.id"
        type="button"
        class="wxr"
        @click="phone.openThread(thread.id)"
      >
        <span class="av">
          <Avatar :contact="thread.contact" :size="48" />
          <i v-if="thread.badge">{{ thread.badge }}</i>
        </span>
        <span class="meta">
          <span class="r1">
            <b>
              <em v-if="thread.pinned" class="pin" aria-hidden="true" />
              {{ thread.contact.name }}
            </b>
            <time>{{ thread.last?.time }}</time>
          </span>
          <p>{{ thread.last?.text }}</p>
        </span>
      </button>
    </div>

    <div v-else-if="wechatTab === 'contacts'" class="list contacts">
      <div class="shortcuts">
        <div v-for="item in contactShortcuts" :key="item.id" class="wxr mute">
          <span class="sc" :data-tone="item.tone" aria-hidden="true" />
          <span class="meta name-only"><b>{{ item.name }}</b></span>
        </div>
      </div>
      <template v-for="thread in contacts" :key="thread.id">
        <p class="letter">{{ letterOf(thread.contact.name) }}</p>
        <button type="button" class="wxr" @click="phone.openThread(thread.id)">
          <span class="av"><Avatar :contact="thread.contact" :size="40" /></span>
          <span class="meta name-only"><b>{{ thread.contact.name }}</b></span>
        </button>
      </template>
    </div>

    <div v-else-if="wechatTab === 'find'" class="groups">
      <div v-for="(group, index) in discover" :key="index" class="group">
        <button v-for="item in group" :key="item.id" type="button" class="grow" @click="openRow(item.id)">
          <img class="tic" :class="item.id" :src="item.icon" alt="" />
          <span>{{ item.name }}</span>
          <em v-if="item.id === 'moments' && phone.progress.momentsStale" class="dot" />
          <svg class="chev" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg>
        </button>
      </div>
    </div>

    <div v-else class="groups me">
      <div class="profile">
        <Avatar :contact="phone.contactOf('me')" :size="64" />
        <span class="who">
          <b>{{ phone.story.meta.owner }}</b>
          <small>微信号：{{ phone.story.meta.owner }}</small>
          <em>状态 · 点击添加</em>
        </span>
        <svg class="qr" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 4h7v7H4zm2 2v3h3V6zm7-2h7v7h-7zm2 2v3h3V6zM4 13h7v7H4zm2 2v3h3v-3zm9 0h2v2h-2zm-2-2h2v2h-2zm4 0h3v3h-2v2h-2v-3h1zm-2 4h2v3h-2zm4 0h3v3h-3z" />
        </svg>
        <svg class="chev" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg>
      </div>
      <div v-for="(group, index) in mine" :key="index" class="group">
        <button v-for="item in group" :key="item.id" type="button" class="grow" @click="openRow(item.id)">
          <img class="tic" :class="item.id" :src="item.icon" alt="" />
          <span>{{ item.name }}</span>
          <svg class="chev" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg>
        </button>
      </div>
    </div>

    <nav class="tabs">
      <button type="button" data-tab="chats" :class="{ on: wechatTab === 'chats' }" @click="wechatTab = 'chats'">
        <img :src="wechatTab === 'chats' ? chatOn : chatOff" alt="" />
        <span>微信</span>
        <i v-if="unread">{{ unread }}</i>
      </button>
      <button type="button" data-tab="contacts" :class="{ on: wechatTab === 'contacts' }" @click="wechatTab = 'contacts'">
        <img :src="wechatTab === 'contacts' ? contactsOn : contactsOff" alt="" />
        <span>通讯录</span>
      </button>
      <button type="button" data-tab="find" :class="{ on: wechatTab === 'find' }" @click="wechatTab = 'find'">
        <img :src="wechatTab === 'find' ? findOn : findOff" alt="" />
        <span>发现</span>
        <i v-if="phone.progress.momentsStale" class="pip" />
      </button>
      <button type="button" data-tab="me" :class="{ on: wechatTab === 'me' }" @click="wechatTab = 'me'">
        <img :src="wechatTab === 'me' ? meOn : meOff" alt="" />
        <span>我</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.inbox,
.wx {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ededed;
  color: #111;
}

.wxh {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex: none;
  height: calc(var(--safe-top) + 44px);
  padding-bottom: 10px;
  background: #ededed;
  font-size: 17px;
}

.wxh b {
  font-weight: 650;
}

.plus {
  position: absolute;
  right: 14px;
  bottom: 8px;
  color: #111;
}

.plus svg,
.search svg,
.chev {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.plus svg {
  width: 22px;
  height: 22px;
  display: block;
}

.search {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: none;
  height: 36px;
  margin: 0 10px 10px;
  border-radius: 8px;
  background: #fff;
  color: #b2b2b2;
  font-size: 15px;
}

.search svg {
  width: 15px;
  height: 15px;
}

.list,
.groups {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding-top: var(--call-gap, 0px);
}

.list {
  background: #fff;
}

.wxr {
  display: flex;
  align-items: center;
  width: 100%;
  height: 68px;
  padding-left: 14px;
  text-align: left;
}

.wxr.mute {
  pointer-events: none;
}

.av {
  position: relative;
  flex: none;
}

.av :deep(.avatar) {
  border-radius: 6px;
  font-size: 18px;
}

.av i,
.tabs i {
  position: absolute;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 99px;
  background: #fa5151;
  color: #fff;
  font-size: 11px;
  font-style: normal;
  line-height: 18px;
  text-align: center;
}

.av i {
  top: -5px;
  right: -6px;
}

.meta {
  flex: 1;
  min-width: 0;
  height: 100%;
  margin-left: 12px;
  padding: 12px 14px 0 0;
  border-bottom: 0.5px solid #e5e5e5;
}

.wxr:last-child .meta {
  border-bottom: 0;
}

.r1 {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.r1 b,
.name-only b {
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  font-size: 17px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pin {
  width: 10px;
  height: 10px;
  flex: none;
  border-radius: 1px;
  background:
    linear-gradient(#b2b2b2, #b2b2b2) 4px 1px / 2px 7px no-repeat,
    linear-gradient(#b2b2b2, #b2b2b2) 2px 2px / 6px 3px no-repeat;
  transform: rotate(35deg);
}

.meta time {
  flex: none;
  color: #b2b2b2;
  font-size: 12px;
}

.meta p {
  margin: 5px 0 0;
  overflow: hidden;
  color: #9a9a9a;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.name-only {
  display: flex;
  align-items: center;
  padding-top: 0;
}

.shortcuts .wxr {
  height: 56px;
}

.sc {
  width: 40px;
  height: 40px;
  flex: none;
  border-radius: 6px;
  background:
    radial-gradient(circle at 50% 38%, #fff 0 18%, transparent 19%),
    linear-gradient(180deg, #fff 48%, transparent 48%),
    currentColor;
  color: #fa9d3b;
}

.sc[data-tone='group'] {
  color: #10aeff;
  background:
    radial-gradient(circle at 35% 40%, #fff 0 12%, transparent 13%),
    radial-gradient(circle at 65% 40%, #fff 0 12%, transparent 13%),
    radial-gradient(circle at 50% 62%, #fff 0 14%, transparent 15%),
    currentColor;
}

.sc[data-tone='tag'] {
  color: #1485ee;
  background:
    linear-gradient(#fff, #fff) 10px 12px / 20px 3px no-repeat,
    linear-gradient(#fff, #fff) 10px 19px / 14px 3px no-repeat,
    linear-gradient(#fff, #fff) 10px 26px / 17px 3px no-repeat,
    currentColor;
}

.sc[data-tone='oa'] {
  color: #2aae67;
  background:
    radial-gradient(circle at 50% 42%, #fff 0 11%, transparent 12%),
    linear-gradient(#fff, #fff) 18px 22px / 4px 10px no-repeat,
    currentColor;
}

.letter {
  margin: 0;
  padding: 4px 14px;
  background: #ededed;
  color: #888;
  font-size: 13px;
  font-weight: 560;
}

.groups {
  padding-bottom: 12px;
}

.group {
  margin-bottom: 8px;
  background: #fff;
  border-top: 0.5px solid #e5e5e5;
  border-bottom: 0.5px solid #e5e5e5;
}

.grow {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 56px;
  padding: 0 16px;
  text-align: left;
  font-size: 17px;
}

.grow + .grow::before {
  content: '';
  position: absolute;
  top: 0;
  left: 54px;
  right: 0;
  border-top: 0.5px solid #e5e5e5;
}

.grow span {
  flex: 1;
}

.chev {
  width: 14px;
  height: 14px;
  color: #c7c7cc;
}

.tic {
  width: 24px;
  height: 24px;
  margin-right: 14px;
  flex: none;
  display: block;
  object-fit: contain;
}

.tic.fav {
  transform: scale(1.08);
}

.dot {
  width: 8px;
  height: 8px;
  margin-right: 8px;
  border-radius: 50%;
  background: #fa5151;
}

.profile {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 8px;
  padding: 22px 16px 24px;
  background: #fff;
  border-bottom: 0.5px solid #e5e5e5;
}

.profile :deep(.avatar) {
  border-radius: 8px;
  font-size: 26px;
}

.who {
  flex: 1;
  min-width: 0;
}

.who b,
.who small,
.who em {
  display: block;
}

.who b {
  font-size: 22px;
  font-weight: 650;
}

.who small {
  margin-top: 6px;
  color: #7f7f7f;
  font-size: 15px;
}

.who em {
  margin-top: 8px;
  color: #b2b2b2;
  font-size: 13px;
  font-style: normal;
}

.qr {
  width: 18px;
  height: 18px;
  flex: none;
  fill: #2c2c2c;
  margin-right: 2px;
}

.tabs {
  display: flex;
  flex: none;
  height: calc(56px + var(--safe-bottom));
  padding-top: 6px;
  padding-bottom: var(--safe-bottom);
  background: #f7f7f7;
  border-top: 0.5px solid #dcdcdc;
}

.tabs button {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: #191919;
  font-size: 10px;
}

.tabs img {
  width: 28px;
  height: 28px;
  display: block;
  object-fit: contain;
}

.tabs .on {
  color: #07c160;
}

.tabs i {
  top: -2px;
  left: 54%;
}

.tabs .pip {
  min-width: 8px;
  width: 8px;
  height: 8px;
  padding: 0;
}

.sms {
  background: #fff;
}

.sms-top {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: flex-end;
  min-height: calc(var(--safe-top) + 44px);
  padding: var(--safe-top) 14px 4px;
}

.sms-top h1 {
  margin: 0;
  font-size: 17px;
  font-weight: 650;
}

.edit,
.compose {
  color: #007aff;
  font-size: 17px;
}

.edit {
  justify-self: start;
}

.compose {
  justify-self: end;
  display: grid;
  place-items: center;
}

.compose svg {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.sms-search {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  margin: 6px 16px 4px;
  border-radius: 10px;
  background: rgba(118, 118, 128, 0.12);
  color: rgba(60, 60, 67, 0.6);
  font-size: 17px;
}

.sms-search svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
}

.scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  background: #fff;
  padding-top: var(--call-gap, 0px);
  padding-bottom: var(--safe-bottom);
}

.row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px 12px 22px;
  text-align: left;
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.12);
}

.unread {
  position: absolute;
  left: 8px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #007aff;
}

.copy {
  flex: 1;
  min-width: 0;
}

.top {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.top b {
  font-size: 17px;
  font-weight: 620;
}

.row time {
  flex: none;
  color: rgba(60, 60, 67, 0.55);
  font-size: 15px;
}

.preview {
  display: block;
  margin-top: 3px;
  overflow: hidden;
  color: rgba(60, 60, 67, 0.6);
  font-size: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
