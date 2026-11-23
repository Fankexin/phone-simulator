const files = import.meta.glob('../images/story/*', { eager: true, import: 'default' })

/** 剧情用本地图：`img('1.webp')` */
export function img(name) {
  const url = files[`../images/story/${name}`]
  if (!url) throw new Error(`[story] missing image: ${name}`)
  return url
}
