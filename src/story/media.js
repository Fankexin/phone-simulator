const files = import.meta.glob('../images/story/*', { eager: true, import: 'default' })

/** 剧情用本地图：`img('1.webp')` */
export function img(name) {
  const url = files[`../images/story/${name}`]
  if (!url) throw new Error(`[story] missing image: ${name}`)
  return url
}

/** 全部剧情图 URL（构建后为 hashed 资源路径） */
export function allStoryImageUrls() {
  return Object.values(files).filter(Boolean)
}
