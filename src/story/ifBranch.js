/** if 线：修改 me-oil 评论后整线切换。各组均为整组替换，未改动的条目从 story 复制。 */
import { story } from './story.js'
import collarThumb from '../images/pic/4.webp'
import { img } from './media.js'

const ifMomentText = {
  'me-shrimp': '生日快乐，男朋友。',
}

const ifSuffix = {
  text: '明天有人生日。准备了惊喜。',
  comments: [
    { from: 'tao', text: '虾饺是我的。' },
    { from: 'me', to: 'tao', text: '明天再说。' },
  ],
}

const ifBoxing = {
  text: '新年第一拳。\n\n手还没好利索，教练不让上强度。\n\n但绷带缠上去的时候，还是踏实。',
  comments: [
    { from: 'tao', text: '手别碰水。' },
    { from: 'me', to: 'tao', text: '知道了。' },
  ],
}

const ifOil = {
  id: 'me-oil',
  contact: 'me',
  at: '2023-10-23T18:40:00',
  image: img('2.jpg'),
  likes: ['tao', 'zhou'],
  comments: [
    { from: 'tao', text: '那你以后别用笔了。' },
    { from: 'me', to: 'tao', text: '你管这么宽，我是不是该给你个名分。' },
    { from: 'tao', to: 'me', text: '你给得起吗。' },
    {
      id: 'oil-answer',
      from: 'me',
      to: 'tao',
      text: '你要是要，我就给得起。',
      edit: { text: '给不起。所以你少管。', branch: '' },
    },
    { from: 'tao', to: 'me', text: '那你给。' },
    { from: 'me', to: 'tao', text: '明天来拿。' },
    { from: 'tao', to: 'me', text: '拿什么。' },
    { from: 'me', to: 'tao', text: '都拿。' },
  ],
  text: '手上全是机油味。扳手比笔顺手。',
}

const ifTao = {
  id: 'tao',
  app: 'wechat',
  contact: 'tao',
  pinned: true,
  unread: 0,
  draft: '',
  script: [
    { type: 'text', id: 'if-last-1', from: 'me', text: '车修好了。你坐后面抱住我。', time: '昨天 21:00' },
    { type: 'text', id: 'if-last-2', from: 'tao', text: '你开快点。', time: '昨天 21:01' },
    { type: 'text', id: 'if-last-3', from: 'me', text: '知道了，男朋友。', time: '昨天 21:02' },
    { type: 'text', id: 'if-last-4', from: 'tao', text: '明天你想吃那家虾饺吗。', time: '昨天 21:05' },
    { type: 'text', id: 'if-last-5', from: 'me', text: '懂你意思，明天我去买。', time: '昨天 21:06' },
    { type: 'text', id: 'if-last-6', from: 'me', text: '有没有奖励。', time: '昨天 21:07' },
    { type: 'text', id: 'if-last-7', from: 'tao', text: '你不是已经来了吗。', time: '昨天 21:08' },
  ],
  history: {
    '2023-11-23': [
      { id: 'if-0a', from: 'tao', text: '陈晃。你听好。你现在下楼，从后门走，别回头。', time: '11月23日 下午2:00' },
      { id: 'if-0b', from: 'me', text: '不走。', time: '11月23日 下午2:00' },
      { id: 'if-0c', from: 'tao', text: '……你烦不烦。', time: '11月23日 下午2:00' },
      { id: 'if-0d', from: 'me', text: '烦。不走。', time: '11月23日 下午2:00' },
      { id: 'if-0e', from: 'tao', text: '……', time: '11月23日 下午2:00' },
      { id: 'if-0f', from: 'tao', text: '那你站我后面。', time: '11月23日 下午2:00' },
      { id: 'if-0g', from: 'tao', text: '他来了。后门。', time: '11月23日 下午2:10' },
      { id: 'if-0h', from: 'me', text: '我站前面。你退后。', time: '11月23日 下午2:10' },
      { id: 'if-0i', from: 'tao', text: '陈晃，他有刀。', time: '11月23日 下午2:11' },
      { id: 'if-0j', from: 'me', text: '我知道。你别动。', time: '11月23日 下午2:11' },
      { id: 'if-0k', from: 'tao', text: '……你手流血了。', time: '11月23日 下午2:15' },
      { id: 'if-0l', from: 'me', text: '没事。他跑了。', time: '11月23日 下午2:16' },
      { id: 'if-0m', from: 'tao', text: '你疯了。', time: '11月23日 下午2:17' },
      { id: 'if-0n', from: 'me', text: '没疯。', time: '11月23日 下午2:18' },
      { id: 'if-0o', from: 'tao', text: '我报警。', time: '11月23日 下午2:20' },
      { id: 'if-0p', from: 'me', text: '嗯。', time: '11月23日 下午2:21' },
      { id: 'if-0q', from: 'tao', text: '你手别动。警察马上来。', time: '11月23日 下午2:40' },
      { id: 'if-0r', from: 'me', text: '你报警的时候说什么了。', time: '11月23日 下午2:41' },
      { id: 'if-0s', from: 'tao', text: '说俞硕。说游思铭。说画室。全说了。', time: '11月23日 下午2:42' },
      { id: 'if-0t', from: 'me', text: '嗯。', time: '11月23日 下午2:43' },
      { id: 'if-0u', from: 'tao', text: '你手要是废了，我跟他没完。', time: '11月23日 下午2:44' },
      { id: 'if-0v', from: 'me', text: '没废。', time: '11月23日 下午2:45' },
    ],
    '2023-11-24': [
      { id: 'if-1', from: 'tao', text: '明天几点。', time: '11月24日 08:10' },
      { id: 'if-2', from: 'me', text: '你什么时候醒。', time: '11月24日 08:12' },
      { id: 'if-3', from: 'tao', text: '你管我呢。', time: '11月24日 08:13' },
      { id: 'if-4', from: 'me', text: '管。名分给了。', time: '11月24日 08:14' },
      { id: 'if-5', from: 'tao', text: '……水杯还在你那？', time: '11月24日 08:20' },
      { id: 'if-6', from: 'me', text: '在。来拿。', time: '11月24日 08:21' },
      { id: 'if-7', from: 'tao', text: '下午。', time: '11月24日 08:22' },
      { id: 'if-8', from: 'me', text: '嗯。', time: '11月24日 08:23' },
    ],
    '2023-11-27': [
      { id: 'if-9', from: 'me', text: '有个叫方一鸣的找我。', time: '11月27日 14:10' },
      { id: 'if-10', from: 'tao', text: '他也找过我。', time: '11月27日 14:11' },
      { id: 'if-11', from: 'me', text: '你怎么没跟我说。', time: '11月27日 14:12' },
      { id: 'if-12', from: 'tao', text: '不想理。', time: '11月27日 14:13' },
      { id: 'if-13', from: 'me', text: '他说俞硕的事。', time: '11月27日 14:14' },
      { id: 'if-14', from: 'tao', text: '嗯。别理他。', time: '11月27日 14:15' },
      { id: 'if-15', from: 'me', text: '他说警察那边他同步。', time: '11月27日 14:16' },
      { id: 'if-16', from: 'tao', text: '……那理一下也行。', time: '11月27日 14:17' },
      { id: 'if-17', from: 'tao', text: '手怎么样。', time: '11月27日 14:18' },
      { id: 'if-18', from: 'me', text: '没什么事。', time: '11月27日 14:19' },
    ],
    '2023-12-06': [
      { id: 'if-37', from: 'tao', text: '警察那边说，俞硕全交代了。', time: '12月6日 15:20' },
      { id: 'if-38', from: 'me', text: '说什么。', time: '12月6日 15:21' },
      { id: 'if-39', from: 'tao', text: '画室那天，还有游思铭。都认了。', time: '12月6日 15:22' },
      { id: 'if-40', from: 'me', text: '嗯。', time: '12月6日 15:23' },
      { id: 'if-41', from: 'tao', text: '手。', time: '12月6日 15:24' },
      { id: 'if-42', from: 'me', text: '快好了。', time: '12月6日 15:25' },
      { id: 'if-43', from: 'tao', text: '留疤了。', time: '12月6日 15:26' },
      { id: 'if-44', from: 'me', text: '嗯。', time: '12月6日 15:27' },
      { id: 'if-44a', from: 'tao', text: '留疤也认。', time: '12月6日 15:28' },
      { id: 'if-44b', from: 'me', text: '你认什么。', time: '12月6日 15:29' },
      { id: 'if-44c', from: 'tao', text: '认你。', time: '12月6日 15:30' },
    ],
    '2023-12-08': [
      { id: 'if-45', from: 'me', text: '学校有人在传。', time: '12月8日 19:10' },
      { id: 'if-46', from: 'tao', text: '传什么。', time: '12月8日 19:11' },
      { id: 'if-47', from: 'me', text: '俞硕的事。还有你穿粉色。', time: '12月8日 19:12' },
      { id: 'if-48', from: 'tao', text: '哦。', time: '12月8日 19:13' },
      { id: 'if-49', from: 'me', text: '你不生气？', time: '12月8日 19:14' },
      { id: 'if-50', from: 'tao', text: '不生气。跟我没关系。', time: '12月8日 19:15' },
      { id: 'if-51', from: 'me', text: '他们说你拿自己当饵，说你不正常。', time: '12月8日 19:16' },
      { id: 'if-52', from: 'tao', text: '嗯。', time: '12月8日 19:17' },
      { id: 'if-53', from: 'me', text: '你嗯什么。', time: '12月8日 19:18' },
      { id: 'if-54', from: 'tao', text: '你猜。', time: '12月8日 19:19' },
      { id: 'if-55', from: 'me', text: '你认了？', time: '12月8日 19:20' },
      { id: 'if-56', from: 'tao', text: '一半。', time: '12月8日 19:21' },
      { id: 'if-57', from: 'me', text: '哪一半。', time: '12月8日 19:22' },
      { id: 'if-58', from: 'tao', text: '拿自己当饵那半。', time: '12月8日 19:23' },
      { id: 'if-59', from: 'me', text: '那你觉得你正常吗。', time: '12月8日 19:24' },
      { id: 'if-60', from: 'tao', text: '……你觉得呢。', time: '12月8日 19:25' },
      { id: 'if-61', from: 'me', text: '我觉得他们说的不算。', time: '12月8日 19:26' },
      { id: 'if-62', from: 'tao', text: '嗯。', time: '12月8日 19:27' },
    ],
    '2024-01-01': [
      { id: 'if-70', from: 'me', text: '你那天在画室，怕不怕。', time: '1月1日 23:10' },
      { id: 'if-71', from: 'tao', text: '怕。', time: '1月1日 23:11' },
      { id: 'if-72', from: 'me', text: '只有怕？', time: '1月1日 23:12' },
      { id: 'if-73', from: 'tao', text: '还有一点。就一点。', time: '1月1日 23:13' },
      { id: 'if-74', from: 'me', text: '一点什么。', time: '1月1日 23:14' },
      { id: 'if-75', from: 'tao', text: '他来了的时候，心跳很快。不是因为怕。', time: '1月1日 23:15' },
      { id: 'if-76', from: 'me', text: '我知道。', time: '1月1日 23:16' },
      { id: 'if-77', from: 'tao', text: '你知道什么？', time: '1月1日 23:17' },
      { id: 'if-78', from: 'me', text: '知道你喜欢什么。', time: '1月1日 23:18' },
    ],
  },
}

const ifSmsFang = {
  id: 'sms-fang',
  app: 'sms',
  contact: 'fang',
  unread: 0,
  script: [
    { type: 'text', id: 'sf-if-1', from: 'fang', time: '2023年11月27日 09:12', text: '陈晃？我是方一鸣。隔壁班的。' },
    { type: 'text', id: 'sf-if-2', from: 'fang', time: '2023年11月27日 09:13', text: '俞硕的事，你知道多少。' },
    { type: 'text', id: 'sf-if-3', from: 'me', time: '2023年11月27日 09:20', text: '你谁啊。你怎么有我号码。' },
    { type: 'text', id: 'sf-if-4', from: 'fang', time: '2023年11月27日 09:21', text: '问来的。陶稚元那边我问过了，他没回。' },
    { type: 'text', id: 'sf-if-5', from: 'me', time: '2023年11月27日 09:22', text: '他谁都不理。' },
    { type: 'text', id: 'sf-if-6', from: 'fang', time: '2023年11月27日 09:23', text: '我查游思铭的时候，注意到俞硕。那天画室，你们跟他动手了？' },
    { type: 'text', id: 'sf-if-7', from: 'me', time: '2023年11月27日 09:25', text: '动了。他带了刀。' },
    { type: 'text', id: 'sf-if-8', from: 'fang', time: '2023年11月27日 09:26', text: '谁受伤了。' },
    { type: 'text', id: 'sf-if-9', from: 'me', time: '2023年11月27日 09:27', text: '我。手划了一下。' },
    { type: 'text', id: 'sf-if-10', from: 'fang', time: '2023年11月27日 09:28', text: '陶稚元呢。' },
    { type: 'text', id: 'sf-if-11', from: 'me', time: '2023年11月27日 09:40', text: '他没事。他报的警。' },
    { type: 'text', id: 'sf-if-12', from: 'fang', time: '2023年11月27日 09:41', text: '你们俩...' },
    { type: 'text', id: 'sf-if-13', from: 'me', time: '2023年11月27日 09:42', text: '他胆子大。我跟着。' },
    { type: 'text', id: 'sf-if-14', from: 'fang', time: '2023年11月27日 09:43', text: '警察那边我去说。你们别自己再去找俞硕。' },
    { type: 'text', id: 'sf-if-15', from: 'me', time: '2023年11月27日 09:44', text: '嗯。' },
    { type: 'text', id: 'sf-if-16', from: 'fang', time: '2023年12月6日 15:20', text: '俞硕全交代了。画室那天，还有游思铭。都认了。' },
    { type: 'text', id: 'sf-if-17', from: 'me', time: '2023年12月6日 15:24', text: '嗯。' },
    { type: 'text', id: 'sf-if-18', from: 'fang', time: '2023年12月6日 15:25', text: '你手怎么样了。' },
    { type: 'text', id: 'sf-if-19', from: 'me', time: '2023年12月6日 15:26', text: '快好了。' },
    { type: 'text', id: 'sf-if-20', from: 'fang', time: '2023年12月6日 15:27', text: '陶稚元那边，你跟他说一声。他查得比我早。' },
    { type: 'text', id: 'sf-if-21', from: 'me', time: '2023年12月6日 15:28', text: '嗯。' },
  ],
}

export const ifBranch = {
  meta: {
    id: 'studio-lamp-if',
    revision: 9,
    title: '画室灯',
    owner: '陈晃',
    clock: '21:00',
    date: '11月4日 星期二',
    blurb: '捡到陈晃的手机。微信置顶着陶稚元，最后一条是“车修好了。你坐后面。”',
    passcode: '4399',
    passcodeHint: '提示 4399',
    lockWallpaper: img('17.jpg'),
    homeWallpaper: img('7.jpg'),
  },
  contacts: story.contacts,
  friends: story.friends,
  requests: story.requests,
  home: story.home,
  albums: story.albums,
  photos: story.photos,
  calendar: story.calendar,
  clock: story.clock,
  health: {
    ...story.health,
    heart: {
      ...story.health.heart,
      events: [
        {
          id: 'hr-1023',
          date: '2023年10月23日',
          level: 'high',
          text: '晚上 19:00 前后心率升高。',
        },
        {
          id: 'hr-nov',
          date: '2023年11月23日 — 11月25日',
          level: 'high',
          text: '两三天深夜心率偏高。之后恢复。',
        },
        {
          id: 'hr-dec8',
          date: '2023年12月8日',
          level: 'high',
          text: '晚上心率升高。',
        },
        {
          id: 'hr-recover',
          date: '2024年之后',
          level: 'recover',
          text: '数据逐渐恢复。',
        },
        {
          id: 'hr-anniv',
          date: '每年 3月4日、9月23日前后',
          level: 'high',
          text: '深夜心率会再次出现小幅升高。',
        },
      ],
    },
  },
  favorites: [
    {
      id: 'fav-if-3',
      type: 'article',
      title: '男生和男生第一次之前，需要准备什么',
      savedAt: '2024年2月18日',
      source: '公众号',
    },
    {
      id: 'fav-if-2',
      type: 'article',
      title: '对方手抖的时候，该说什么',
      savedAt: '2023年12月22日',
      source: '公众号',
    },
    {
      id: 'fav-if-1',
      type: 'article',
      title: '在一起之后，怎么相处才不奇怪',
      savedAt: '2023年12月10日',
      source: '公众号',
    },
    ...story.favorites,
  ],
  channels: {
    likes: story.channels.likes.filter((item) => item.id !== 'ch-woods'),
  },
  weather: story.weather,
  threads: story.threads
    .filter((thread) => thread.id !== 'sms-tao')
    .map((thread) => {
      if (thread.id === 'tao') return ifTao
      if (thread.id === 'sms-fang') return ifSmsFang
      return thread
    }),
  moments: story.moments
    .filter((moment) => !['me-birthday', 'me-treat-2025', 'me-bike-2026', 'me-lamp-2026', 'me-canvas-2025'].includes(moment.id))
    .map((moment) => {
      if (moment.id === 'me-oil') return ifOil
      if (moment.id === 'me-suffix') return { ...moment, ...ifSuffix }
      if (moment.id === 'me-boxing') return { ...moment, ...ifBoxing }
      if (moment.id === 'tao-scratch') return { ...moment, comments: [{ from: 'me', text: '明天给你带创可贴。' }] }
      if (moment.id === 'me-shrimp') {
        return {
          ...moment,
          text: ifMomentText['me-shrimp'],
          image: img('19.jpg'),
        }
      }
      if (ifMomentText[moment.id]) return { ...moment, text: ifMomentText[moment.id] }
      return moment
    }),
  notes: [
    {
      id: 'my-birthday',
      time: '2024年9月23日 星期一',
      title: '2024年9月23日',
      body: '你是最好的生日礼物。\n\n',
    },
    {
      id: 'his-birthday',
      time: '2024年3月4日 星期一',
      title: '2024年3月4日',
      body: '开心。(￣︶￣)\n\n生日快乐。',
    },
    {
      id: 'if-jan-note',
      time: '2024年1月2日 星期二',
      title: '2024年1月1日',
      body: '我问你，怕不怕。\n\n你说怕。又说还有一点别的。\n\n我问是什么。你说他来了的时候，心跳很快。不是因为怕。\n\n我说我知道。\n\n你笑了。\n\n你笑起来真好看。',
    },
    {
      id: 'if-dec-note',
      time: '2023年12月7日 星期四',
      title: '2023年12月6日',
      body: '警察说俞硕全交代了。画室那天，还有游思铭。\n\n你报警的时候就把这些说了。你比谁都快。\n\n你问我手怎么样。我说快好了。\n\n你说留疤了。\n\n我说嗯。\n\n你说留疤也认。\n\n我问你认什么。\n\n你说认我。\n\n你从来没说过这种话。\n\n这伤值了。',
    },
    {
      id: 'pink',
      time: '2023年11月26日 星期日',
      title: '2023年11月23日',
      body: '那天下午，我问你为什么老穿粉色。\n\n你让我走。我没走。\n\n你说我烦。我说行。但人没动。\n\n你看了我一会儿。\n\n然后你说，那你站我后面。\n\n不可能，这就不是我干的事。\n\n手划了一下。没大事。',
    },
    {
      id: 'breakfast',
      time: '2023年11月26日 星期日',
      title: '2023年10月17日',
      body: '早餐店。\n\n你吃那个虾饺的时候，小孩子一样，很可爱。\n\n后来后厨有人尖叫。服务员推开门，腿都在抖。\n\n我站起来。你没动。\n\n后厨里死了一个人。穿粉色上衣。\n\n新闻写的是“粉红衣高中生尸体惊现早餐店”。\n\n回去路上我问你，你怎么不害怕。\n\n你说，害怕有用吗。\n\n现在想想，你那个时候是不是已经想好了后来的一切。\n\n后来我们又去了一次。\n\n点了一份虾饺。最后一个还是被你抢了。',
    },
    {
      id: 'birthday',
      time: '2023年11月26日 星期日',
      title: '2023年9月23日',
      body: '今天生日。\n\n我请吃饭。你空着手来的。\n\n我说我过生日你都不请客。你说，你请我来的，凭什么我请。\n\n我说那你至少带个礼物。你说人来了就是礼物。\n\n后来我去结账，服务员说已经买过了。\n\n我回头看你，你坐那儿，筷子都没放。\n\n你说，这顿算我请你的，明年你请我。',
    },
    {
      id: 'water',
      time: '2023年11月26日 星期日',
      title: '2023年9月12日',
      body: '有人当着我的面说你是怪胎。\n\n我没等他说完。\n\n打完被叫去办公室，你站在门口等我，一句话没说，递了瓶水。\n\n我说你倒是说句话。你说，你手疼不疼。\n\n我当时觉得你有病。\n\n现在想想，你可能是不知道该说什么。\n\n那之后没人当面说了。背后说不说，我管不着。\n\n但至少在我面前，没人敢说。\n\n后来水杯你来拿了。名分也拿了。都没还。',
    },
  ],
  taobao: {
    filters: story.taobao.filters,
    orders: [
      ...story.taobao.orders.filter((order) => !['tb-moto-1', 'tb-box-2', 'tb-if-glove'].includes(order.id)),
      {
        id: 'tb-box-2',
        title: '定制拳击手套',
        status: '交易成功',
        date: '2023年11月26日',
        tag: 'boxing',
        shop: '拳馆装备专营店',
        shopType: 'tmall',
        price: '228.00',
        qty: 1,
        variant: '定制刻字 / 陶稚元',
        services: ['支持定制'],
      },
      {
        id: 'tb-if-collar',
        title: '小众项圈',
        status: '交易成功',
        date: '2024年2月25日',
        tag: 'daily',
        shop: '私语小物店',
        shopType: 'taobao',
        price: '89.00',
        qty: 1,
        variant: '黑色 / 可调节',
        services: ['隐私发货'],
        image: collarThumb,
      },
      {
        id: 'tb-if-1b',
        title: '杜蕾斯润滑剂',
        status: '交易成功',
        date: '2024年9月20日',
        tag: 'daily',
        shop: '杜蕾斯官方旗舰店',
        shopType: 'tmall',
        price: '119.70',
        qty: 3,
        variant: '水溶性 / 50ml',
        services: ['隐私发货'],
      },
      {
        id: 'tb-if-1',
        title: '杜蕾斯润滑剂',
        status: '交易成功',
        date: '2024年3月1日',
        tag: 'daily',
        shop: '杜蕾斯官方旗舰店',
        shopType: 'tmall',
        price: '39.90',
        qty: 1,
        variant: '水溶性 / 50ml',
        services: ['隐私发货'],
      },
      {
        id: 'tb-if-2',
        title: '杜蕾斯避孕套',
        status: '交易成功',
        date: '2024年3月1日',
        tag: 'daily',
        shop: '杜蕾斯官方旗舰店',
        shopType: 'tmall',
        price: '49.90',
        qty: 1,
        variant: '超薄 / 10只装',
        services: ['隐私发货'],
      },
      {
        id: 'tb-box-if',
        title: '手绑带',
        status: '交易成功',
        date: '2023年12月20日',
        tag: 'boxing',
        shop: '拳馆装备专营店',
        shopType: 'taobao',
        price: '39.90',
        qty: 1,
        variant: '黑色 / 3卷',
        services: ['极速退款', '7天无理由退货'],
      },
    ].sort((a, b) => {
      const stamp = (date) => {
        const match = String(date || '').match(/^(\d{4})年(\d{1,2})月(\d{1,2})日/)
        if (!match) return 0
        return Date.UTC(+match[1], +match[2] - 1, +match[3])
      }
      return stamp(b.date) - stamp(a.date)
    }),
  },
  calls: [
    {
      id: 'c-if-leave',
      contact: 'teacher',
      type: 'outgoing',
      status: 'answered',
      time: '2023年11月23日 16:50',
      duration: '1分28秒',
    },
    ...story.calls
      .filter((call) => !['c1', 'c2', 'c3', 'c4', 'c7', 'c8', 'c9', 'c11', 'c13', 'c14', 'c15', 'c17'].includes(call.id))
      .map((call) => {
        if (call.id === 'c18') {
          return { id: 'c18', contact: 'tao', type: 'outgoing', status: 'answered', time: '2023年12月6日 21:20', duration: '1分12秒' }
        }
        if (call.id === 'c19') {
          return { id: 'c19', contact: 'tao', type: 'outgoing', status: 'answered', time: '2023年12月12日 21:30', duration: '3分05秒' }
        }
        return call
      }),
  ],
}

/** 整组覆盖：branch 里有的顶层字段整组替换 base */
export function applyIfBranch(base, branch = ifBranch) {
  return { ...base, ...branch }
}
