import { computed, reactive, ref, watch } from 'vue'
import { story as baseStory } from '../story/story.js'
import { applyIfBranch, ifBranch } from '../story/ifBranch.js'
import { appCatalog } from './catalog.js'
import { meets, projectThread, validateStory } from './engine.js'

const saveKey = `found-phone:${baseStory.meta.id}:${baseStory.meta.revision}`

function messageStamp(time) {
  const match = String(time || '').match(/^(\d{4})年(\d{1,2})月(\d{1,2})日(?:\s+(\d{1,2}):(\d{2}))?/)
  if (!match) return null
  const [, year, month, day, hour = '0', minute = '0'] = match
  return Date.UTC(+year, +month - 1, +day, +hour, +minute)
}

function blankProgress() {
  return {
    phase: 'lock',
    stack: [],
    read: {},
    unlocked: {},
    momentsStale: false,
    momentReplies: {},
    branch: '',
  }
}

function createPhone() {
  const issues = validateStory(baseStory)
  if (issues.length && import.meta.env.DEV) {
    console.warn('[捡手机] 剧情数据有问题\n' + issues.join('\n'))
  }

  const progress = reactive(blankProgress())
  const wechatTab = ref('chats')

  load()

  function liveStory() {
    return progress.branch === 'if' ? applyIfBranch(baseStory, ifBranch) : baseStory
  }

  const route = computed(() => progress.stack[progress.stack.length - 1] || null)
  const visibleMoments = computed(() => liveStory().moments.filter((item) => meets(item.requires, {})))
  const visibleNotes = computed(() => liveStory().notes.filter((item) => meets(item.requires, {})))

  function momentsOf(contactId) {
    return visibleMoments.value.filter((item) => item.contact === contactId)
  }

  function momentComments(moment) {
    if (progress.branch === 'if') return moment.comments || []
    const patch = progress.momentReplies[moment.id]
    return (moment.comments || []).map((item) => {
      const text = item.id && patch?.replacements?.[item.id]
      return text ? { ...item, text } : item
    })
  }

  function canEditMoment(momentId, comment) {
    if (!comment?.id || !comment.edit) return false
    if (progress.branch === 'if') return true
    return !progress.momentReplies[momentId]?.done?.[comment.id]
  }

  function sendMomentEdit(momentId, commentId) {
    const moment = liveStory().moments.find((item) => item.id === momentId)
    const comment = moment?.comments?.find((item) => item.id === commentId)
    if (!comment?.edit || !canEditMoment(momentId, comment)) return false

    const nextBranch = comment.edit.branch === 'if' ? 'if' : ''
    if (nextBranch === 'if') {
      const prev = progress.momentReplies[momentId] || { done: {}, replacements: {} }
      progress.momentReplies[momentId] = {
        done: { ...prev.done, [commentId]: true },
        replacements: {
          ...prev.replacements,
          [commentId]: comment.edit.text,
        },
      }
      progress.branch = 'if'
    } else {
      progress.branch = ''
      delete progress.momentReplies[momentId]
    }
    return true
  }

  const notices = computed(() =>
    liveStory()
      .threads.filter((thread) => !progress.read[thread.id] && thread.unread)
      .map((thread) => {
        const projected = projectThread(thread.script)
        const last = projected.messages[projected.messages.length - 1]
        return {
          id: thread.id,
          app: thread.app,
          appName: appCatalog[thread.app]?.name || thread.app,
          contact: contactOf(thread.contact),
          text: last?.text || '',
        }
      })
      .filter((item) => item.text),
  )

  const darkChrome = computed(() => {
    if (progress.phase === 'lock') return true
    if (progress.phase === 'home' && !route.value) return true
    if (route.value?.photo) return true
    if (route.value?.app === 'clock' || route.value?.app === 'weather') return true
    return false
  })

  watch(progress, save, { deep: true })

  function contactOf(id) {
    return liveStory().contacts[id] || { name: '未知', initial: '?', color: '#8e8e93' }
  }

  function projection(threadId) {
    const thread = liveStory().threads.find((item) => item.id === threadId)
    if (!thread) return { messages: [], pending: null, draft: '' }
    return { ...projectThread(thread.script), draft: thread.draft || '' }
  }

  function threadsFor(appId) {
    return liveStory()
      .threads.filter((thread) => thread.app === appId)
      .map((thread) => {
        const projected = projectThread(thread.script)
        const last = projected.messages[projected.messages.length - 1]
        return {
          ...thread,
          contactId: thread.contact,
          contact: contactOf(thread.contact),
          last,
          badge: progress.read[thread.id] ? 0 : thread.unread || 0,
        }
      })
      .sort((a, b) => {
        const pin = Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))
        if (pin) return pin
        const left = messageStamp(a.last?.time)
        const right = messageStamp(b.last?.time)
        if (left == null || right == null) return 0
        return right - left
      })
  }

  function wechatFriends() {
    const current = liveStory()
    return (current.friends || [])
      .filter((id) => id !== 'me' && current.contacts[id])
      .map((id) => ({ id, contact: contactOf(id) }))
      .sort((a, b) => {
        const left = String(a.contact.wxid || a.contact.name || '')
        const right = String(b.contact.wxid || b.contact.name || '')
        return left.localeCompare(right, 'en', { sensitivity: 'base' })
      })
  }

  function badgeCount(appId) {
    return threadsFor(appId).reduce((sum, thread) => sum + thread.badge, 0)
  }

  function photosIn(albumId) {
    return liveStory().photos.filter((photo) => photo.album === albumId && meets(photo.requires, {}))
  }

  function unlock() {
    progress.phase = 'home'
    progress.stack = []
  }

  function openFromLock(threadId) {
    const thread = liveStory().threads.find((item) => item.id === threadId)
    if (!thread) return
    progress.phase = 'home'
    progress.read[threadId] = true
    progress.stack = [{ app: thread.app }, { app: thread.app, thread: threadId }]
  }

  function openApp(appId) {
    if (!appCatalog[appId]) return
    progress.phase = 'home'
    progress.stack = [{ app: appId }]
  }

  function openThread(threadId) {
    const thread = liveStory().threads.find((item) => item.id === threadId)
    if (!thread) return
    progress.read[threadId] = true
    progress.stack = [...progress.stack, { app: thread.app, thread: threadId }]
  }

  function openContact(contactId) {
    if (!liveStory().contacts[contactId]) return
    const top = progress.stack[progress.stack.length - 1]
    if (top?.view === 'contact' && top.contact === contactId) return
    progress.stack = [...progress.stack, { app: 'wechat', view: 'contact', contact: contactId }]
  }

  function openMoments(contactId) {
    progress.momentsStale = false
    const next = { app: 'wechat', view: 'moments' }
    if (contactId && liveStory().contacts[contactId]) next.contact = contactId
    progress.stack = [...progress.stack, next]
  }

  function openNewFriends() {
    progress.stack = [...progress.stack, { app: 'wechat', view: 'new-friends' }]
  }

  function openFavorites() {
    progress.stack = [...progress.stack, { app: 'wechat', view: 'favorites' }]
  }

  function openFavorite(favoriteId) {
    const item = (liveStory().favorites || []).find((entry) => entry.id === favoriteId)
    if (!item) return
    progress.stack = [...progress.stack, { app: 'wechat', view: 'favorites', favorite: favoriteId }]
  }

  function openChannels() {
    progress.stack = [...progress.stack, { app: 'wechat', view: 'channels' }]
  }

  function openChatInfo(threadId) {
    const thread = liveStory().threads.find((item) => item.id === threadId)
    if (!thread || thread.app !== 'wechat') return
    progress.stack = [...progress.stack, { app: 'wechat', thread: threadId, view: 'chat-info' }]
  }

  function openFindChat(threadId) {
    const thread = liveStory().threads.find((item) => item.id === threadId)
    if (!thread || thread.app !== 'wechat') return
    progress.stack = [...progress.stack, { app: 'wechat', thread: threadId, view: 'find-chat' }]
  }

  function openFindDate(threadId) {
    const thread = liveStory().threads.find((item) => item.id === threadId)
    if (!thread || thread.app !== 'wechat') return
    progress.stack = [...progress.stack, { app: 'wechat', thread: threadId, view: 'find-date' }]
  }

  function openFindDay(threadId, day) {
    const thread = liveStory().threads.find((item) => item.id === threadId)
    if (!thread || thread.app !== 'wechat') return
    if (!thread.history?.[day]) return
    progress.stack = [...progress.stack, { app: 'wechat', thread: threadId, view: 'find-day', day }]
  }

  function historyOf(threadId, day) {
    const thread = liveStory().threads.find((item) => item.id === threadId)
    return thread?.history?.[day] || []
  }

  function openAlbum(albumId) {
    progress.stack = [...progress.stack, { app: 'photos', album: albumId }]
  }

  function openPhoto(photoId) {
    progress.stack = [...progress.stack, { app: 'photos', photo: photoId }]
  }

  function openNote(noteId) {
    progress.stack = [...progress.stack, { app: 'notes', note: noteId }]
  }

  function pop() {
    if (progress.stack.length > 1) progress.stack = progress.stack.slice(0, -1)
    else progress.stack = []
  }

  function goHome() {
    if (progress.phase !== 'home' || !progress.stack.length) return
    progress.stack = []
  }

  function tryUnlock(albumId, code) {
    const secret = liveStory().meta.secrets?.[albumId]
    if (!secret || code !== secret) return false
    progress.unlocked[albumId] = true
    return true
  }

  function load() {
    try {
      const raw = localStorage.getItem(saveKey)
      if (!raw) return
      const data = JSON.parse(raw)
      if (!data || typeof data !== 'object') return
      Object.assign(progress.read, data.read || {})
      Object.assign(progress.unlocked, data.unlocked || {})
      progress.momentsStale = Boolean(data.momentsStale)
      progress.momentReplies = data.momentReplies && typeof data.momentReplies === 'object' ? data.momentReplies : {}
      progress.branch = data.branch === 'if' ? 'if' : ''
      progress.phase = 'lock'
      progress.stack = []
    } catch {
      localStorage.removeItem(saveKey)
    }
  }

  function save() {
    localStorage.setItem(
      saveKey,
      JSON.stringify({
        phase: progress.phase,
        stack: progress.stack,
        read: progress.read,
        unlocked: progress.unlocked,
        momentsStale: progress.momentsStale,
        momentReplies: progress.momentReplies,
        branch: progress.branch,
      }),
    )
  }

  return {
    get story() {
      return liveStory()
    },
    progress,
    route,
    ending: computed(() => null),
    talkLine: computed(() => ''),
    visibleMoments,
    visibleNotes,
    notices,
    darkChrome,
    wechatTab,
    contactOf,
    momentsOf,
    momentComments,
    canEditMoment,
    sendMomentEdit,
    projection,
    threadsFor,
    wechatFriends,
    badgeCount,
    photosIn,
    unlock,
    openFromLock,
    openApp,
    openThread,
    openContact,
    openMoments,
    openNewFriends,
    openFavorites,
    openFavorite,
    openChannels,
    openChatInfo,
    openFindChat,
    openFindDate,
    openFindDay,
    historyOf,
    openAlbum,
    openPhoto,
    openNote,
    pop,
    goHome,
    tryUnlock,
  }
}

let singleton
export function usePhone() {
  if (!singleton) singleton = createPhone()
  return singleton
}
