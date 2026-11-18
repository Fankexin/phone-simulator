<script setup>
import { computed, ref } from 'vue'
import { usePhone } from './usePhone.js'

const phone = usePhone()
const { pop } = phone
const taobao = computed(() => phone.story.taobao || {})

const channel = ref('shop')
const status = ref('all')
const tag = ref('all')
const scrollEl = ref(null)

const channels = [
  { id: 'all', name: '全部' },
  { id: 'shop', name: '购物' },
  { id: 'flash', name: '闪购' },
  { id: 'fliggy', name: '飞猪' },
]

const statuses = [
  { id: 'all', name: '全部订单' },
  { id: 'pay', name: '待付款' },
  { id: 'ship', name: '待发货' },
  { id: 'recv', name: '待收货' },
  { id: 'refund', name: '退款/售后' },
]

const tags = computed(() => [{ id: 'all', name: '全部' }, ...(taobao.value.filters || [])])

function shortDate(date) {
  const match = String(date || '').match(/^(\d{4})年(\d{1,2})月(\d{1,2})日/)
  if (!match) return date || ''
  return `${match[1]}.${String(match[2]).padStart(2, '0')}.${String(match[3]).padStart(2, '0')}`
}

function displayStatus(order) {
  if (order.status === '取消付款' || order.status === '交易关闭') return '交易关闭'
  if (order.status === '已完成' || order.status === '交易成功' || order.status === '已签收') return '交易成功'
  return order.status
}

function statusKind(order) {
  const label = displayStatus(order)
  if (label === '交易关闭') return 'closed'
  if (label === '交易成功') return 'done'
  return 'open'
}

function matchesStatus(order) {
  const kind = statusKind(order)
  if (status.value === 'all') return true
  if (status.value === 'pay') return kind === 'closed' || order.status === '取消付款'
  return false
}

const orders = computed(() => {
  if (channel.value !== 'all' && channel.value !== 'shop') return []
  return (taobao.value.orders || [])
    .filter((item) => (tag.value === 'all' ? true : item.tag === tag.value))
    .filter(matchesStatus)
})

function toTop() {
  scrollEl.value?.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <section class="taobao">
    <header class="chrome">
      <div class="bar">
        <button type="button" class="back" aria-label="返回" @click="pop">
          <svg viewBox="0 0 24 24"><path d="M15 4 7 12l8 8" /></svg>
        </button>
        <div class="search" tabindex="-1">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" stroke-width="2" />
            <path d="m16 16 3.5 3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <span>搜索订单</span>
        </div>
        <div class="tools">
          <button type="button" tabindex="-1"><i class="ai" />AI助手</button>
          <button type="button" tabindex="-1"><i class="funnel" />筛选</button>
          <button type="button" tabindex="-1"><i class="edit" />管理</button>
          <button type="button" class="more" tabindex="-1" aria-label="更多">
            <span /><span /><span />
            <i class="dot" />
          </button>
        </div>
      </div>

      <nav class="channels">
        <button
          v-for="item in channels"
          :key="item.id"
          type="button"
          :class="{ on: channel === item.id }"
          @click="channel = item.id"
        >
          {{ item.name }}
        </button>
      </nav>

      <div class="statuses">
        <button
          v-for="item in statuses"
          :key="item.id"
          type="button"
          :class="{ on: status === item.id }"
          @click="status = item.id"
        >
          {{ item.name }}
        </button>
      </div>

      <div class="tags">
        <button
          v-for="item in tags"
          :key="item.id"
          type="button"
          :class="{ on: tag === item.id }"
          @click="tag = item.id"
        >
          {{ item.name }}
        </button>
      </div>
    </header>

    <div ref="scrollEl" class="scroll">
      <article v-for="order in orders" :key="order.id" class="card">
        <div class="shop">
          <span class="badge" :data-type="order.shopType || 'taobao'">{{ order.shopType === 'tmall' ? '天猫' : '淘宝' }}</span>
          <b>{{ order.shop || '淘宝店铺' }}</b>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
          <em :data-kind="statusKind(order)">{{ displayStatus(order) }}</em>
        </div>

        <div class="goods">
          <div class="thumb" :data-tag="order.tag" aria-hidden="true" />
          <div class="info">
            <p class="title">{{ order.title }}</p>
            <p v-if="order.variant" class="variant">{{ order.variant }}</p>
            <p v-if="order.services?.length" class="services">{{ order.services.join(' · ') }}</p>
          </div>
          <div class="price">
            <b>¥{{ order.price || '0.00' }}</b>
            <small>x{{ order.qty || 1 }}</small>
          </div>
        </div>

        <div class="sum">
          <time>{{ shortDate(order.date) }}</time>
          <i aria-hidden="true" />
          <span>
            {{ statusKind(order) === 'closed' ? '应付款' : '实付款' }}
            <b>¥{{ order.price || '0.00' }}</b>
          </span>
        </div>

        <div class="actions">
          <button type="button" class="ghost" tabindex="-1">更多</button>
          <div class="right">
            <template v-if="statusKind(order) === 'closed'">
              <button type="button" tabindex="-1">删除订单</button>
              <button type="button" class="accent" tabindex="-1">再买一单</button>
            </template>
            <template v-else>
              <button type="button" tabindex="-1">评价</button>
              <button type="button" tabindex="-1">加入购物车</button>
              <button type="button" class="accent" tabindex="-1">再买一单</button>
            </template>
          </div>
        </div>
      </article>

      <p v-if="!orders.length" class="empty">没有相关订单</p>
      <p v-else class="end">没有更多了</p>
    </div>

    <div class="float">
      <button type="button" tabindex="-1">反馈</button>
      <button type="button" @click="toTop">顶部</button>
    </div>
  </section>
</template>

<style scoped>
.taobao {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f4f4f4;
  color: #111;
}

.chrome {
  flex: none;
  padding: calc(var(--safe-top) + 4px) 0 0;
  background: #fff;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.04);
}

.bar {
  display: grid;
  grid-template-columns: 34px 1fr auto;
  gap: 6px;
  align-items: center;
  padding: 0 8px 8px 4px;
}

.back {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  color: #111;
}

.back svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.search {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border-radius: 99px;
  background: #f5f5f5;
  color: #999;
  font-size: 13px;
}

.search svg {
  width: 14px;
  height: 14px;
}

.tools {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 2px;
  color: #333;
  font-size: 10px;
}

.tools > button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 28px;
  color: inherit;
  line-height: 1.1;
}

.tools i {
  width: 16px;
  height: 16px;
  display: block;
  background: center / contain no-repeat;
}

.tools .ai {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='1.8'%3E%3Cpath d='M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z'/%3E%3C/svg%3E");
}

.tools .funnel {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='1.8'%3E%3Cpath d='M4 5h16l-6 7v5l-4 2v-7L4 5z'/%3E%3C/svg%3E");
}

.tools .edit {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='1.8'%3E%3Cpath d='M4 20h4L18 10l-4-4L4 16v4zM12 6l4 4'/%3E%3C/svg%3E");
}

.more {
  position: relative;
  width: 18px;
  gap: 3px !important;
  padding-top: 2px;
}

.more span {
  width: 3px;
  height: 3px;
  border-radius: 99px;
  background: #333;
}

.more .dot {
  position: absolute;
  top: -1px;
  right: -2px;
  width: 7px;
  height: 7px;
  border-radius: 99px;
  background: #ff3b30;
  box-shadow: 0 0 0 1.5px #fff;
}

.channels {
  display: flex;
  gap: 22px;
  padding: 2px 16px 0;
}

.channels button {
  position: relative;
  padding: 8px 0 10px;
  color: #666;
  font-size: 15px;
}

.channels button.on {
  color: #111;
  font-weight: 700;
}

.channels button.on::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 2px;
  width: 18px;
  height: 3px;
  border-radius: 99px;
  background: #ff5000;
  transform: translateX(-50%);
}

.statuses,
.tags {
  display: flex;
  gap: 8px;
  padding: 8px 12px 10px;
  overflow-x: auto;
  scrollbar-width: none;
}

.statuses::-webkit-scrollbar,
.tags::-webkit-scrollbar {
  display: none;
}

.statuses button,
.tags button {
  flex: none;
  padding: 6px 12px;
  border-radius: 99px;
  background: #f5f5f5;
  color: #333;
  font-size: 12px;
  white-space: nowrap;
}

.statuses button.on,
.tags button.on {
  background: #fff1e8;
  color: #ff5000;
  font-weight: 650;
}

.tags {
  padding-top: 0;
}

.scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  padding: 8px 10px calc(var(--safe-bottom) + 56px);
}

.card {
  margin-bottom: 8px;
  padding: 12px 12px 10px;
  border-radius: 12px;
  background: #fff;
}

.shop {
  display: grid;
  grid-template-columns: auto auto 12px 1fr;
  gap: 6px;
  align-items: center;
  margin-bottom: 12px;
}

.badge {
  width: 16px;
  height: 16px;
  display: grid;
  place-items: center;
  border-radius: 4px;
  background: #ff5000;
  color: #fff;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: -0.4px;
}

.badge[data-type='tmall'] {
  background: #e61a1a;
  font-size: 7px;
}

.shop b {
  font-size: 13px;
  font-weight: 650;
}

.shop svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: #bbb;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.shop em {
  justify-self: end;
  color: #ff5000;
  font-style: normal;
  font-size: 12px;
}

.shop em[data-kind='closed'] {
  color: #999;
}

.goods {
  display: grid;
  grid-template-columns: 78px 1fr auto;
  gap: 10px;
}

.thumb {
  width: 78px;
  height: 78px;
  border-radius: 8px;
  background: linear-gradient(145deg, #ffe8d6, #ffd0a8);
}

.thumb[data-tag='boxing'] {
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.18), transparent 40%),
    linear-gradient(145deg, #3a3a3c, #111);
}

.thumb[data-tag='moto'] {
  background:
    radial-gradient(circle at 70% 25%, rgba(255, 255, 255, 0.16), transparent 36%),
    linear-gradient(145deg, #6a7380, #2f3640);
}

.thumb[data-tag='lamp'] {
  background:
    radial-gradient(circle at 50% 40%, #fff8d2, #f0d36a 46%, #d7b24a 100%);
}

.thumb[data-tag='art'] {
  background:
    radial-gradient(circle at 28% 30%, rgba(255, 255, 255, 0.35), transparent 42%),
    linear-gradient(145deg, #c4a574, #8b6914);
}

.thumb[data-tag='daily'] {
  background:
    radial-gradient(circle at 50% 28%, rgba(255, 255, 255, 0.5), transparent 40%),
    linear-gradient(145deg, #e8eef4, #9db0c4);
}

.info {
  min-width: 0;
}

.title {
  display: -webkit-box;
  overflow: hidden;
  color: #111;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.variant {
  margin-top: 6px;
  color: #999;
  font-size: 12px;
}

.services {
  margin-top: 6px;
  color: #00a870;
  font-size: 11px;
}

.price {
  text-align: right;
}

.price b {
  display: block;
  font-size: 13px;
  font-weight: 650;
}

.price small {
  display: block;
  margin-top: 4px;
  color: #999;
  font-size: 12px;
}

.sum {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
  color: #999;
  font-size: 12px;
}

.sum i {
  width: 1px;
  height: 11px;
  background: #ddd;
  transform: translateY(1px);
}

.sum span {
  color: #111;
}

.sum b {
  margin-left: 4px;
  font-size: 15px;
  font-weight: 720;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;
}

.ghost {
  color: #666;
  font-size: 12px;
}

.right {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.right button {
  min-width: 72px;
  height: 30px;
  padding: 0 10px;
  border: 0.5px solid #ddd;
  border-radius: 99px;
  background: #fff;
  color: #333;
  font-size: 12px;
}

.right .accent {
  border-color: #ffd0b5;
  background: #fff7f2;
  color: #ff5000;
}

.empty,
.end {
  padding: 28px 0 12px;
  color: #999;
  text-align: center;
  font-size: 13px;
}

.float {
  position: absolute;
  right: 14px;
  bottom: calc(var(--safe-bottom) + 18px);
  z-index: 3;
  display: grid;
  gap: 10px;
}

.float button {
  width: 44px;
  height: 44px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.92);
  color: #333;
  font-size: 11px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(8px);
}
</style>
