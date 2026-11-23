import { story } from './story/story.js'
import { ifBranch } from './story/ifBranch.js'
import { allStoryImageUrls } from './story/media.js'

const picFiles = import.meta.glob('./images/pic/*', { eager: true, import: 'default' })

function looksLikeImageUrl(value) {
  if (typeof value !== 'string' || !value) return false
  if (value.startsWith('data:image')) return true
  return /\.(webp|jpe?g|png|gif|svg)(\?|#|$)/i.test(value) || value.includes('/assets/')
}

function collectUrls(value, out = new Set()) {
  if (!value) return out
  if (typeof value === 'string') {
    if (looksLikeImageUrl(value)) out.add(value)
    return out
  }
  if (Array.isArray(value)) {
    for (const item of value) collectUrls(item, out)
    return out
  }
  if (typeof value === 'object') {
    for (const item of Object.values(value)) collectUrls(item, out)
  }
  return out
}

function warm(url) {
  return new Promise((resolve) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = image.onerror = () => resolve(url)
    image.src = url
  })
}

function preferLinkPreload(urls) {
  for (const url of urls) {
    if (!url || document.querySelector(`link[rel="preload"][href="${url}"]`)) continue
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = url
    document.head.appendChild(link)
  }
}

/** 打开页面后立刻预热剧情图与封面图，不阻塞首屏挂载 */
export function preloadAssets() {
  const urls = new Set([
    ...allStoryImageUrls(),
    ...Object.values(picFiles).filter(Boolean),
  ])
  collectUrls(story, urls)
  collectUrls(ifBranch, urls)

  const list = [...urls]
  const priority = [
    story.meta?.lockWallpaper,
    story.meta?.homeWallpaper,
    story.contacts?.me?.avatar,
    story.contacts?.tao?.avatar,
  ].filter((url) => urls.has(url))

  preferLinkPreload(priority)

  // 先抢锁屏/头像，其余后台灌进浏览器缓存
  const rest = list.filter((url) => !priority.includes(url))
  void Promise.all(priority.map(warm)).then(() => Promise.all(rest.map(warm)))
}
