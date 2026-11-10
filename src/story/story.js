/**
 * 交互式捡手机的剧情只改这个文件，界面会照着数据长出来。
 *
 * threads[].script
 *   text { type:'text', id, from:'me'|联系人id|'system', text, time }
 * threads[].pinned：微信列表置顶
 * threads[].draft：输入框里未发送的文字
 * threads[].history：按日期查找的旧聊天，键名用 YYYY-MM-DD
 *
 * meta.passcode：锁屏密码。写了之后，上滑、点通知和相机都要先输入。
 * meta.passcodeHint：锁屏密码页上的提示，可以不写。
 * 进度存在浏览器本地。改 meta.revision 会让旧进度失效。
 */

const EPOCH = new Date(2023, 10, 23)

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function dayNumber(date) {
  return Math.floor((startOfDay(date) - EPOCH) / 86400000) + 1
}

function stampOf(date, today) {
  const day = startOfDay(date)
  const now = startOfDay(today)
  const diff = Math.round((now - day) / 86400000)
  const clock = '21:00'
  if (diff === 0) return clock
  if (diff === 1) return `昨天 ${clock}`
  return `${day.getMonth() + 1}月${day.getDate()}日 ${clock}`
}

function recentLampMessages(count = 10) {
  const today = new Date()
  const list = []
  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset)
    const n = dayNumber(date)
    list.push({
      type: 'text',
      id: `lamp-${n}`,
      from: 'me',
      text: `第${n}天，陶稚元，画室灯还亮着。`,
      time: stampOf(date, today),
    })
  }
  return list
}

export const story = {
  meta: {
    id: 'studio-lamp',
    revision: 1,
    title: '画室灯',
    owner: '陈晃',
    clock: '21:00',
    date: '11月4日 星期二',
    blurb: '捡到陈晃的手机。微信置顶着陶稚元，近十天他每天只发同一句话。',
    passcode: '1123',
    passcodeHint: '提示 1123',
  },
  contacts: {
    me: { name: '陈晃', initial: '晃', color: '#6b7280' },
    tao: { name: '陶稚元', initial: '元', color: '#8b6b4a' },
  },
  home: {
    grid: ['wechat', 'clock', 'calendar', 'weather'],
    dock: ['calls', 'sms', 'photos', 'notes'],
  },
  threads: [
    {
      id: 'tao',
      app: 'wechat',
      contact: 'tao',
      pinned: true,
      unread: 0,
      draft: '等你回来关。',
      script: recentLampMessages(10),
      history: {
        '2023-11-23': [
          { id: 'd0-1', from: 'me', text: '陶稚元，你最近怎么老是喜欢穿粉色？', time: '11月23日 下午2:00' },
          { id: 'd0-2', from: 'tao', text: '你管我呢。', time: '11月23日 下午2:00' },
          { id: 'd0-3', from: 'me', text: '脱下来我试试呗。', time: '11月23日 下午2:00' },
          { id: 'd0-4', from: 'tao', text: '不行。', time: '11月23日 下午2:00' },
          { id: 'd0-5', from: 'me', text: '你——', time: '11月23日 下午2:00' },
          { id: 'd0-6', from: 'tao', text: '陈晃。你听好。你现在下楼，从后门走，别回头。', time: '11月23日 下午2:00' },
          { id: 'd0-7', from: 'me', text: '你什么意思？', time: '11月23日 下午2:00' },
          { id: 'd0-8', from: 'tao', text: '我什么意思都没有。我就是不想跟你一块儿待着。你烦不烦。', time: '11月23日 下午2:00' },
          { id: 'd0-9', from: 'me', text: '……你说真的？', time: '11月23日 下午2:00' },
          { id: 'd0-10', from: 'tao', text: '真的。走。', time: '11月23日 下午2:00' },
          { id: 'd0-11', from: 'me', text: '行。陶稚元，你行。', time: '11月23日 下午2:00' },

          { id: 'd0-12', from: 'me', text: '我走了。后门没人。', time: '11月23日 下午2:40' },
          { id: 'd0-13', from: 'me', text: '但你还在画室。你刚才是不是故意把我支走？', time: '11月23日 下午2:40' },
          { id: 'd0-14', from: 'me', text: '陶稚元，回话。', time: '11月23日 下午2:40' },
          { id: 'd0-15', from: 'me', text: '你再不理我我真的生气了。', time: '11月23日 下午2:40' },

          { id: 'd2-1', from: 'me', text: '陶稚元，你今天没来学校。', time: '11月24日 21:00' },
          { id: 'd2-2', from: 'me', text: '我去画室找你了。画室很乱，画架倒了两个，地上有断掉的画框条，还有一小块木片。像打过架。', time: '11月24日 21:00' },
          { id: 'd2-3', from: 'me', text: '但里面没人。你也不在。', time: '11月24日 21:00' },
          { id: 'd2-4', from: 'me', text: '你手机呢。你为什么不回消息。', time: '11月24日 21:00' },

          { id: 'd3-1', from: 'me', text: '我报警了。警察问我你最近有没有得罪什么人，我说没有。你谁都不得罪。', time: '11月25日 21:00' },
          { id: 'd3-2', from: 'me', text: '但我想起来一件事。你上周问我，如果有人做了错事但没被抓住，该怎么让他自己露出来。', time: '11月25日 21:00' },
          { id: 'd3-3', from: 'me', text: '我当时说，设个局让他再来一次。你笑了一下，没接话。', time: '11月25日 21:00' },
          { id: 'd3-4', from: 'me', text: '陶稚元，你那天笑的意思是，你已经在设局了，对吗。', time: '11月25日 21:00' },

          { id: 'd4-1', from: 'me', text: '画室最里面那幅画我看了。', time: '11月26日 21:00' },
          { id: 'd4-2', from: 'me', text: '画的是画室后面的树林。树林里有一张破沙发，沙发上有一个粉色的人影。', time: '11月26日 21:00' },
          { id: 'd4-3', from: 'me', text: '画室那天没有粉衣服。你人不在，粉毛衣也不在。', time: '11月26日 21:00' },
          { id: 'd4-4', from: 'me', text: '但你画了。你画了一个粉色的影子，坐在树林的破沙发上。', time: '11月26日 21:00' },
          { id: 'd4-5', from: 'me', text: '你穿粉色，不是随手穿的。你画的那个影子，是谁。', time: '11月26日 21:00' },
          { id: 'd4-6', from: 'me', text: '我去树林那张沙发看过了。沙发还在。上面没有人。', time: '11月26日 21:00' },

          { id: 'd5-1', from: 'me', text: '我把画的事告诉方一鸣了。', time: '11月27日 21:00' },
          { id: 'd5-2', from: 'me', text: '他看了画，问我画上那个地方认不认得。我说认得，画室后面的树林，靠围墙那侧，有一张扔在那儿的旧沙发。', time: '11月27日 21:00' },
          { id: 'd5-3', from: 'me', text: '他说他去调画室外面的监控。', time: '11月27日 21:00' },
          { id: 'd5-4', from: 'me', text: '监控拍到俞硕那天下午进了画室。', time: '11月27日 21:00' },
          { id: 'd5-5', from: 'me', text: '陶稚元，俞硕进过画室。你不在里面。你去哪了。', time: '11月27日 21:00' },

          { id: 'd7-1', from: 'me', text: '俞硕被叫去问话了。', time: '11月29日 21:00' },
          { id: 'd7-2', from: 'me', text: '他说他进画室的时候里面没人，地上很乱，像有人刚打过架。他说他没看见粉衣服。', time: '11月29日 21:00' },
          { id: 'd7-3', from: 'me', text: '方一鸣说，俞硕说话的时候很正常，问什么答什么，一点都不慌。', time: '11月29日 21:00' },
          { id: 'd7-4', from: 'me', text: '陶稚元，你穿粉色，是因为你知道他看见粉色会失控。', time: '11月29日 21:00' },
          { id: 'd7-5', from: 'me', text: '你拿自己当饵。你把我支走，是因为你不想让我挡在中间。', time: '11月29日 21:00' },
          { id: 'd7-6', from: 'me', text: '但你是自己走的，还是被他带走的。你告诉我。', time: '11月29日 21:00' },

          { id: 'd10-1', from: 'me', text: '方一鸣说要再试一次。他说俞硕这个人，光问是问不出来的。', time: '12月2日 21:00' },
          { id: 'd10-2', from: 'me', text: '我说我去。我找了一件粉色的衣服穿上，不是你那件，是我自己的。', time: '12月2日 21:00' },
          { id: 'd10-3', from: 'me', text: '陶稚元，你别骂我。', time: '12月2日 21:00' },

          { id: 'd12-1', from: 'me', text: '试了。', time: '12月4日 21:00' },
          { id: 'd12-2', from: 'me', text: '方一鸣带我去找俞硕。我穿着粉色的衣服进去的。', time: '12月4日 21:00' },
          { id: 'd12-3', from: 'me', text: '他一开始没反应。问到第三句的时候，他抬头看了我一眼，然后又看了一眼。', time: '12月4日 21:00' },
          { id: 'd12-4', from: 'me', text: '他说话了。他说他见过你。', time: '12月4日 21:00' },
          { id: 'd12-5', from: 'me', text: '他说那天看见你穿着粉色进了画室。他没忍住，跟了进去。', time: '12月4日 21:00' },
          { id: 'd12-6', from: 'me', text: '他说他进去的时候，你已经不在画室里了。地上很乱，后窗开着。', time: '12月4日 21:00' },
          { id: 'd12-7', from: 'me', text: '陶稚元，他在跟我说话。他承认见过你了。', time: '12月4日 21:00' },

          { id: 'd14-1', from: 'me', text: '俞硕交代了后面的事。', time: '12月6日 21:00' },
          { id: 'd14-2', from: 'me', text: '他说他顺着后窗追出去，在树林里把你拦住了。他把你拖到那张旧沙发上，打了一顿。打完之后，你不动了。', time: '12月6日 21:00' },
          { id: 'd14-3', from: 'me', text: '他以为死了。他就走了。', time: '12月6日 21:00' },
          { id: 'd14-4', from: 'me', text: '我今天又去了一趟树林。沙发还在，上面没有人。我上次来看的时候也没有人。', time: '12月6日 21:00' },
          { id: 'd14-5', from: 'me', text: '我没看见尸体。你不在那儿。', time: '12月6日 21:00' },
          { id: 'd14-6', from: 'me', text: '你挨了打，然后你自己走了。', time: '12月6日 21:00' },
          { id: 'd14-7', from: 'me', text: '画框条缺的那一小块，我在沙发旁边找到了。上面有血。不是你的。', time: '12月6日 21:00' },
          { id: 'd14-8', from: 'me', text: '你到最后都在还手。你从来都不是等着挨打的人。', time: '12月6日 21:00' },
          { id: 'd14-9', from: 'me', text: '但你为什么不告诉我。我可以保护你。就像一直以来的那样。', time: '12月6日 21:00' },

          { id: 'd20-1', from: 'me', text: '我每天发一条。你不回也没关系。', time: '12月12日 21:00' },
          { id: 'd20-2', from: 'me', text: '今天没什么事。就是路过画室，灯换了新的，不闪了。', time: '12月12日 21:00' },
          { id: 'd20-3', from: 'me', text: '陶稚元。', time: '12月12日 21:00' },
          { id: 'd20-4', from: 'me', text: '你那时候跟我说“走”，语气特别烦。我当时真信了。', time: '12月12日 21:00' },
          { id: 'd20-5', from: 'me', text: '你演得真好。', time: '12月12日 21:00' },
          { id: 'd20-6', from: 'me', text: '画是我找到的，地方是我认的，粉色衣服是我穿的。俞硕是我试出来的。', time: '12月12日 21:00' },
          { id: 'd20-7', from: 'me', text: '该做的我都做了。', time: '12月12日 21:00' },
          { id: 'd20-8', from: 'me', text: '但我还是没找到你。', time: '12月12日 21:00' },
          { id: 'd20-9', from: 'me', text: '你到底在哪。', time: '12月12日 21:00' },
        ],
      },
    },
  ],
  moments: [],
  albums: [{ id: 'recent', title: '最近项目' }],
  photos: [],
  notes: [],
  calendar: {
    year: 2026,
    label: '11月',
    days: 30,
    lead: 0,
    today: 4,
    events: [],
  },
  clock: {
    alarms: [
      { id: 'a1', time: '07:30', label: '闹钟', on: true },
      { id: 'a2', time: '21:00', label: '闹钟', on: false },
    ],
  },
  weather: {
    city: '北京',
    temp: 9,
    condition: '多云',
    high: 12,
    low: 6,
    hours: [
      { time: '现在', temp: 9, icon: 'cloud' },
      { time: '16时', temp: 9, icon: 'cloud' },
      { time: '17时', temp: 8, icon: 'cloud' },
      { time: '18时', temp: 8, icon: 'moon' },
      { time: '19时', temp: 7, icon: 'moon' },
      { time: '20时', temp: 7, icon: 'moon' },
      { time: '21时', temp: 6, icon: 'moon' },
      { time: '22时', temp: 6, icon: 'moon' },
    ],
    days: [
      { name: '今天', rain: '10%', low: 6, high: 12, icon: 'cloud' },
      { name: '周三', rain: '20%', low: 5, high: 11, icon: 'cloud' },
      { name: '周四', rain: '10%', low: 6, high: 13, icon: 'sun' },
      { name: '周五', rain: '40%', low: 7, high: 14, icon: 'cloud' },
      { name: '周六', rain: '30%', low: 8, high: 15, icon: 'sun' },
      { name: '周日', rain: '20%', low: 6, high: 12, icon: 'cloud' },
      { name: '周一', rain: '15%', low: 5, high: 10, icon: 'sun' },
    ],
  },
  calls: [],
}
