export function meets(requires, flags) {
  if (!requires || requires.length === 0) return true
  return requires.every((flag) => Boolean(flags[flag]))
}

export function projectThread(script) {
  const messages = []
  for (const node of script || []) {
    if (node.type === 'text') messages.push(node)
  }
  return { messages, pending: null }
}

export function validateStory(story) {
  const errors = []
  const contacts = new Set(Object.keys(story.contacts || {}))
  const installed = new Set([...(story.home?.grid || []), ...(story.home?.dock || [])])
  const threadIds = new Set()
  const albums = new Set((story.albums || []).map((album) => album.id))

  if (!contacts.has('me')) errors.push('缺少联系人 me，代表机主')

  for (const appId of installed) {
    if (!appId) errors.push('主屏幕有空的应用 id')
  }

  for (const thread of story.threads || []) {
    if (threadIds.has(thread.id)) errors.push(`重复会话 ${thread.id}`)
    threadIds.add(thread.id)
    if (!installed.has(thread.app)) errors.push(`会话 ${thread.id} 的应用 ${thread.app} 不在主屏幕`)
    if (!contacts.has(thread.contact)) errors.push(`会话 ${thread.id} 缺少联系人 ${thread.contact}`)

    const ids = new Set()
    for (const node of thread.script || []) {
      if (!node.id) errors.push(`会话 ${thread.id} 有条目缺少 id`)
      if (ids.has(node.id)) errors.push(`会话 ${thread.id} 重复 id ${node.id}`)
      ids.add(node.id)
      if (node.type === 'text') checkSender(errors, contacts, node.from, node.id)
    }
  }

  for (const photo of story.photos || []) {
    if (!albums.has(photo.album)) errors.push(`照片 ${photo.id} 的相册 ${photo.album} 不存在`)
  }

  for (const moment of story.moments || []) {
    if (!contacts.has(moment.contact)) errors.push(`朋友圈 ${moment.id} 缺少联系人`)
    for (const id of moment.likes || []) {
      if (!contacts.has(id)) errors.push(`朋友圈 ${moment.id} 的点赞人 ${id} 不在联系人里`)
    }
    for (const comment of moment.comments || []) {
      if (!contacts.has(comment.from)) errors.push(`朋友圈 ${moment.id} 的评论人 ${comment.from} 不在联系人里`)
      if (comment.to && !contacts.has(comment.to)) errors.push(`朋友圈 ${moment.id} 的回复对象 ${comment.to} 不在联系人里`)
    }
  }

  for (const call of story.calls || []) {
    if (!contacts.has(call.contact)) errors.push(`通话 ${call.id} 缺少联系人`)
  }

  for (const request of story.requests || []) {
    if (!contacts.has(request.contact)) errors.push(`好友申请 ${request.id} 缺少联系人`)
  }

  for (const id of story.friends || []) {
    if (!contacts.has(id)) errors.push(`好友 ${id} 不在联系人里`)
  }

  return errors
}

function checkSender(errors, contacts, from, id) {
  if (from === 'me' || from === 'system') return
  if (!contacts.has(from)) errors.push(`消息 ${id} 的发送者 ${from} 不在联系人里`)
}
