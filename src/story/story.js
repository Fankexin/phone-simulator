/**
 * 交互式捡手机的剧情只改这个文件，界面会照着数据长出来。
 *
 * threads[].script
 *   text { type:'text', id, from:'me'|联系人id|'system', text, time }
 * threads[].pinned：微信列表置顶
 * threads[].draft：输入框里未发送的文字
 * threads[].history：按日期查找的旧聊天，键名用 YYYY-MM-DD
 * moments[]：{ id, contact, text, image|images, at, likes, comments? }。at 是本地发布时间，界面按朋友圈规则显示日期。一张图用 image，多张用 images。likes 是点赞的联系人 id。comments 是 { from, text, to? }，to 表示回复谁。
 * notes[]：{ id, title, body, time }。title 是第一句，body 保留换行。
 * calls[]：{ id, contact, type:'incoming'|'outgoing', status:'answered'|'missed', time, duration }。按时间从早到晚写，界面把最新的放在上面。
 * calendar.events[]：{ id, title, month, day, yearly? }。yearly 为真时每年这一天都有。month 从 1 开始。
 * contacts[].avatar：微信头像图片地址。不写就用色块和 initial。
 * contacts[].wxid：微信号，用拼音。
 * contacts[].cover：朋友圈封面图。
 * friends[]：微信通讯录里的好友，写联系人 id。
 * requests[]：{ id, contact, message, status:'pending' }。新的朋友里还没通过的好友申请。
 *
 * meta.passcode：锁屏密码。写了之后，上滑、点通知和相机都要先输入。
 * meta.passcodeHint：锁屏密码页上的提示，可以不写。
 * meta.lockWallpaper：锁屏壁纸。
 * meta.homeWallpaper：主屏幕壁纸。
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
  const skipToday = today.getHours() < 21
  const start = skipToday ? count : count - 1
  const end = skipToday ? 1 : 0
  const list = []
  for (let offset = start; offset >= end; offset -= 1) {
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
    lockWallpaper: 'https://i.ibb.co/vxWftBb9/17.jpg',
    homeWallpaper: 'https://i.ibb.co/1Yxxj2k8/7.png',
  },
  contacts: {
    me: {
      name: '陈晃',
      initial: '晃',
      color: '#6b7280',
      wxid: 'chenhuang',
      avatar: 'https://i.ibb.co/Jwqkg00J/20261110164107-96-2.png',
      cover: 'https://i.ibb.co/hF1x1KMK/20.jpg',
    },
    tao: {
      name: '陶稚元',
      initial: '元',
      color: '#8b6b4a',
      wxid: 'taozhiyuan',
      avatar: 'https://i.ibb.co/V0GPgm9Z/006fi-FOlgy1hokx1vedyuj30nx0yjwkg1.jpg',
      cover: 'https://i.ibb.co/1fpfrVX0/19.jpg',
    },
    fang: {
      name: '方一鸣',
      initial: '方',
      color: '#4a6fa5',
      wxid: 'fangyiming',
    },
    teacher: {
      name: '班主任',
      initial: '班',
      color: '#6a8f7a',
      wxid: 'banzhuren',
    },
    zhe: {
      name: '阿哲',
      initial: '哲',
      color: '#b4533a',
      wxid: 'azhe',
    },
    zhou: {
      name: '老周',
      initial: '周',
      color: '#7a6848',
      wxid: 'laozhou',
    },
  },
  friends: ['tao', 'teacher', 'zhe', 'zhou'],
  requests: [
    { id: 'fang', contact: 'fang', message: '我是方一鸣。隔壁班的。', status: 'pending' },
  ],
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
    {
      id: 'zhe',
      app: 'wechat',
      contact: 'zhe',
      unread: 0,
      script: [
        { type: 'text', id: 'zhe-1', from: 'zhe', time: '2023年11月25日 19:00', text: '陈晃，最近怎么不来练了。' },
        { type: 'text', id: 'zhe-2', from: 'me', time: '2023年11月25日 21:30', text: '有事。过阵子去。' },
        { type: 'text', id: 'zhe-3', from: 'zhe', time: '2023年12月20日 18:10', text: '拳套还在馆里，给你收柜子里了。' },
        { type: 'text', id: 'zhe-4', from: 'me', time: '2023年12月20日 19:05', text: '谢了。' },
        { type: 'text', id: 'zhe-5', from: 'zhe', time: '2024年4月10日 20:30', text: '这周六来不来，新来一个打左架的。' },
        { type: 'text', id: 'zhe-6', from: 'me', time: '2024年4月10日 21:15', text: '来。' },
        { type: 'text', id: 'zhe-7', from: 'zhe', time: '2024年4月13日 22:40', text: '你今天那个后手不错。' },
        { type: 'text', id: 'zhe-8', from: 'me', time: '2024年4月13日 22:45', text: '还行。' },
        { type: 'text', id: 'zhe-9', from: 'zhe', time: '2025年6月18日 19:20', text: '馆里下个月比赛，你报不报。' },
        { type: 'text', id: 'zhe-10', from: 'me', time: '2025年6月18日 20:02', text: '报。' },
        { type: 'text', id: 'zhe-11', from: 'zhe', time: '2025年7月20日 23:10', text: '打得可以。下次别老用脸接拳。' },
        { type: 'text', id: 'zhe-12', from: 'me', time: '2025年7月20日 23:12', text: '知道了。' },
        { type: 'text', id: 'zhe-13', from: 'zhe', time: '2026年8月2日 21:30', text: '明天来不来。' },
        { type: 'text', id: 'zhe-14', from: 'me', time: '2026年8月2日 21:33', text: '来。' },
      ],
    },
    {
      id: 'zhou',
      app: 'wechat',
      contact: 'zhou',
      unread: 0,
      script: [
        { type: 'text', id: 'zhou-1', from: 'zhou', time: '2023年11月21日 17:20', text: '你要的那个化油器到了，什么时候来拿。' },
        { type: 'text', id: 'zhou-2', from: 'me', time: '2023年11月21日 18:05', text: '明天。' },
        { type: 'text', id: 'zhou-3', from: 'zhou', time: '2023年11月22日 19:40', text: '化油器拿走了？钱还没给。' },
        { type: 'text', id: 'zhou-4', from: 'me', time: '2023年11月22日 20:15', text: '明天给。' },
        { type: 'text', id: 'zhou-5', from: 'zhou', time: '2023年12月5日 16:30', text: '化油器钱不用给了。你那天没来拿，我先装我车上了。' },
        { type: 'text', id: 'zhou-6', from: 'me', time: '2023年12月5日 17:10', text: '行。下次算。' },
        { type: 'text', id: 'zhou-7', from: 'zhou', time: '2024年5月8日 14:20', text: '链条油到了，给你留了一瓶。' },
        { type: 'text', id: 'zhou-8', from: 'me', time: '2024年5月8日 15:00', text: '周末去拿。' },
        { type: 'text', id: 'zhou-9', from: 'zhou', time: '2025年11月2日 10:30', text: '你那车最近怎么样。' },
        { type: 'text', id: 'zhou-10', from: 'me', time: '2025年11月2日 11:15', text: '还行。就是有点抖。' },
        { type: 'text', id: 'zhou-11', from: 'zhou', time: '2025年11月2日 11:20', text: '过来看看。' },
        { type: 'text', id: 'zhou-12', from: 'zhou', time: '2026年9月20日 16:40', text: '车修好了没。' },
        { type: 'text', id: 'zhou-13', from: 'me', time: '2026年9月20日 18:00', text: '快了。' },
      ],
    },
    {
      id: 'sms-tao',
      app: 'sms',
      contact: 'tao',
      unread: 0,
      script: [
        { type: 'text', id: 'st-1', from: 'me', time: '2023年11月23日 18:40', text: '陶稚元。你手机怎么打不通。' },
        { type: 'text', id: 'st-2', from: 'me', time: '2023年11月23日 21:15', text: '画室里没人。你粉毛衣也不在。你去哪了。' },
        { type: 'text', id: 'st-3', from: 'me', time: '2023年11月24日 08:02', text: '今天来学校吗。' },
        { type: 'text', id: 'st-4', from: 'me', time: '2023年11月24日 12:30', text: '方一鸣问我你在哪。我说不知道。' },
        { type: 'text', id: 'st-5', from: 'me', time: '2023年11月25日 19:44', text: '我去树林那张沙发了。上面没有人。' },
        { type: 'text', id: 'st-6', from: 'me', time: '2023年11月26日 22:10', text: '画我拿走了。你那幅。放在我这儿。' },
        { type: 'text', id: 'st-7', from: 'me', time: '2023年11月29日 23:01', text: '俞硕被叫去问话了。方一鸣说他说没看见你。' },
        { type: 'text', id: 'st-8', from: 'me', time: '2023年12月2日 10:20', text: '我今天穿粉色。不是你那件。是我自己的。你别骂我。' },
        { type: 'text', id: 'st-9', from: 'me', time: '2023年12月4日 16:00', text: '试了。他说他见过你。他说那天看见你穿着粉色进了画室。他没忍住，跟了进去。' },
        { type: 'text', id: 'st-10', from: 'me', time: '2023年12月4日 16:01', text: '他进去的时候，你已经不在画室里了。后窗开着。' },
        { type: 'text', id: 'st-11', from: 'me', time: '2023年12月6日 16:00', text: '俞硕交代了后面的事。他说他追到树林，在沙发上打了你。打完之后你不动了。他以为死了，就走了。' },
        { type: 'text', id: 'st-12', from: 'me', time: '2023年12月6日 16:01', text: '但沙发上没有人。我去过。我也没看见。' },
        { type: 'st-13', from: 'me', time: '2023年12月6日 16:02', text: '陶稚元。你没死对不对。' },
        { type: 'text', id: 'st-14', from: 'me', time: '2023年12月6日 16:03', text: '你回我一句。' },
      ],
    },
    {
      id: 'sms-fang',
      app: 'sms',
      contact: 'fang',
      unread: 0,
      script: [
        { type: 'text', id: 'sf-1', from: 'fang', time: '2023年11月24日 09:12', text: '陈晃？我是方一鸣。隔壁班的。' },
        { type: 'text', id: 'sf-2', from: 'fang', time: '2023年11月24日 09:13', text: '陶稚元今天没来。你知道他在哪吗。' },
        { type: 'text', id: 'sf-3', from: 'me', time: '2023年11月24日 09:20', text: '你谁啊。你怎么有我号码。' },
        { type: 'text', id: 'sf-4', from: 'fang', time: '2023年11月24日 09:21', text: '问来的。我找你是因为游思铭的事。' },
        { type: 'text', id: 'sf-5', from: 'me', time: '2023年11月24日 09:22', text: '游思铭是谁。' },
        { type: 'text', id: 'sf-6', from: 'fang', time: '2023年11月24日 09:23', text: '郊区那个。前段时间的事。早餐店那件事之后，陶稚元自己去查过游思铭。' },
        { type: 'text', id: 'sf-7', from: 'me', time: '2023年11月24日 09:25', text: '所以呢。' },
        { type: 'text', id: 'sf-8', from: 'fang', time: '2023年11月24日 09:26', text: '我查游思铭有一阵了。查来查去，发现陶稚元也在查。他查得比很多人都深。现在他也不见了。' },
        { type: 'text', id: 'sf-9', from: 'me', time: '2023年11月24日 09:27', text: '你想说什么。' },
        { type: 'text', id: 'sf-10', from: 'fang', time: '2023年11月24日 09:28', text: '我昨天下午看见你从画室那边出来。你和陶稚元在画室，对吗。' },
        { type: 'text', id: 'sf-11', from: 'me', time: '2023年11月24日 09:40', text: '……对。' },
        { type: 'text', id: 'sf-12', from: 'fang', time: '2023年11月24日 09:41', text: '画室我去看了。很乱。地上有断的画框条。你走的时候是这样吗。' },
        { type: 'text', id: 'sf-13', from: 'me', time: '2023年11月24日 09:42', text: '不是。我走的时候不这样。' },
        { type: 'text', id: 'sf-14', from: 'fang', time: '2023年11月24日 09:43', text: '那中间有人进去过。我去调监控。你先别自己去找人。' },
        { type: 'text', id: 'sf-15', from: 'me', time: '2023年11月24日 09:44', text: '我找不找关你什么事。' },
        { type: 'text', id: 'sf-16', from: 'fang', time: '2023年11月24日 09:45', text: '关游思铭的事。你要是不想陶稚元变成第二个，就别乱来。' },
        { type: 'text', id: 'sf-17', from: 'fang', time: '2023年11月26日 11:30', text: '陶稚元画室最里面那幅画，你知道吗。' },
        { type: 'text', id: 'sf-18', from: 'me', time: '2023年11月26日 11:32', text: '知道。我看了。树林，破沙发，一个粉色人影。' },
        { type: 'text', id: 'sf-19', from: 'fang', time: '2023年11月26日 11:33', text: '画上那个位置你认得吗。' },
        { type: 'text', id: 'sf-20', from: 'me', time: '2023年11月26日 11:34', text: '认得。画室后面树林，靠围墙那边，有一张扔在那儿的旧沙发。' },
        { type: 'text', id: 'sf-21', from: 'fang', time: '2023年11月26日 11:35', text: '我去看过了。沙发还在。上面没有人。' },
        { type: 'text', id: 'sf-22', from: 'me', time: '2023年11月26日 11:36', text: '我知道。我也去过。' },
        { type: 'text', id: 'sf-23', from: 'fang', time: '2023年11月26日 11:37', text: '……你什么时候去的。' },
        { type: 'text', id: 'sf-24', from: 'me', time: '2023年11月26日 11:38', text: '前天。' },
        { type: 'text', id: 'sf-25', from: 'fang', time: '2023年11月26日 11:40', text: '陈晃，我不管你多着急，你现在一个人乱跑，只会把现场搞乱。' },
        { type: 'text', id: 'sf-26', from: 'me', time: '2023年11月26日 11:41', text: '现场？你当这是你的事？' },
        { type: 'text', id: 'sf-27', from: 'fang', time: '2023年11月26日 11:42', text: '游思铭死的时候，也没人当这是谁的事。' },
        { type: 'text', id: 'sf-28', from: 'fang', time: '2023年11月27日 14:03', text: '监控调到了。那天下午俞硕进过画室。' },
        { type: 'text', id: 'sf-29', from: 'me', time: '2023年11月27日 14:04', text: '俞硕是谁。' },
        { type: 'text', id: 'sf-30', from: 'fang', time: '2023年11月27日 14:05', text: '隔壁班的。游思铭那件事之后，俞硕在附近出现过。我一直在查他。' },
        { type: 'text', id: 'sf-31', from: 'me', time: '2023年11月27日 14:06', text: '所以你是冲着俞硕来的。' },
        { type: 'text', id: 'sf-32', from: 'fang', time: '2023年11月27日 14:07', text: '我冲着游思铭来的。俞硕是线。陶稚元是另一条线。现在两条线碰上了。' },
        { type: 'text', id: 'sf-33', from: 'me', time: '2023年11月27日 14:08', text: '你早就在查了。那你早干嘛去了。' },
        { type: 'text', id: 'sf-34', from: 'fang', time: '2023年11月27日 14:10', text: '我早不知道陶稚元会被卷进来。' },
        { type: 'text', id: 'sf-35', from: 'fang', time: '2023年11月29日 16:10', text: '俞硕被叫去问话了。他说他进画室的时候里面没人。地上很乱。他说他没看见粉衣服。' },
        { type: 'text', id: 'sf-36', from: 'me', time: '2023年11月29日 16:12', text: '你信？' },
        { type: 'text', id: 'sf-37', from: 'fang', time: '2023年11月29日 16:13', text: '他说话的时候很正常。问什么答什么，一点都不慌。' },
        { type: 'text', id: 'sf-38', from: 'me', time: '2023年11月29日 16:14', text: '太正常了。' },
        { type: 'text', id: 'sf-39', from: 'fang', time: '2023年11月29日 16:15', text: '我也这么想。所以我打算再试一次。' },
        { type: 'text', id: 'sf-40', from: 'fang', time: '2023年12月2日 10:02', text: '光问是问不出来的。俞硕这个人，得让他看见点什么。' },
        { type: 'text', id: 'sf-41', from: 'me', time: '2023年12月2日 10:05', text: '我去。' },
        { type: 'text', id: 'sf-42', from: 'fang', time: '2023年12月2日 10:06', text: '你？' },
        { type: 'text', id: 'sf-43', from: 'me', time: '2023年12月2日 10:07', text: '我穿粉色去。他不是看见粉色会失控吗。' },
        { type: 'text', id: 'sf-44', from: 'fang', time: '2023年12月2日 10:08', text: '陈晃，这不是你逞能的事。' },
        { type: 'text', id: 'sf-45', from: 'me', time: '2023年12月2日 10:09', text: '我没逞能。陶稚元穿粉色是为了让他来。我穿粉色是为了让他说。你带我去，我配合你。' },
        { type: 'text', id: 'sf-46', from: 'fang', time: '2023年12月2日 10:15', text: '……行。但你别自己开口。我让你说什么你说什么。' },
        { type: 'text', id: 'sf-47', from: 'me', time: '2023年12月2日 10:16', text: '知道了。' },
        { type: 'text', id: 'sf-48', from: 'fang', time: '2023年12月4日 15:20', text: '他承认了。他说他那天看见陶稚元穿粉色进了画室，没忍住跟了进去。他进去的时候陶稚元已经不在了，后窗开着。' },
        { type: 'text', id: 'sf-49', from: 'me', time: '2023年12月4日 15:22', text: '就这些？' },
        { type: 'text', id: 'sf-50', from: 'fang', time: '2023年12月4日 15:23', text: '就这些。后面他还没说。' },
        { type: 'text', id: 'sf-51', from: 'me', time: '2023年12月4日 15:24', text: '继续问。' },
        { type: 'text', id: 'sf-52', from: 'fang', time: '2023年12月6日 15:20', text: '他交代后面的事了。他说他顺着后窗追出去，在树林里把人拦住了。拖到沙发上打了一顿，打完之后人不动了。他以为死了，就走了。' },
        { type: 'text', id: 'sf-53', from: 'me', time: '2023年12月6日 15:24', text: '他以为死了。' },
        { type: 'text', id: 'sf-54', from: 'fang', time: '2023年12月6日 15:25', text: '对。他说他以为死了。' },
        { type: 'text', id: 'sf-55', from: 'me', time: '2023年12月6日 15:26', text: '那尸体呢。' },
        { type: 'text', id: 'sf-56', from: 'fang', time: '2023年12月6日 15:27', text: '没有尸体。警察去树林看了，沙发上没有人。' },
        { type: 'text', id: 'sf-57', from: 'me', time: '2023年12月6日 15:28', text: '我去过。我也没看见。' },
        { type: 'text', id: 'sf-58', from: 'fang', time: '2023年12月6日 15:29', text: '陈晃。陶稚元可能还活着。' },
        { type: 'text', id: 'sf-59', from: 'me', time: '2023年12月6日 15:30', text: '我知道。' },
        { type: 'text', id: 'sf-60', from: 'fang', time: '2023年12月6日 15:31', text: '游思铭的事到这儿算查清了。' },
        { type: 'text', id: 'sf-61', from: 'me', time: '2023年12月6日 15:33', text: '那你查完了。' },
        { type: 'text', id: 'sf-62', from: 'fang', time: '2023年12月6日 15:34', text: '游思铭的事查完了。陶稚元的事没完。' },
        { type: 'text', id: 'sf-63', from: 'me', time: '2023年12月6日 15:35', text: '……谢了。' },
        { type: 'text', id: 'sf-64', from: 'fang', time: '2023年12月6日 15:36', text: '不用谢我。我不是为你查的。' },
      ],
    },
  ],
  moments: [
    {
      id: 'me-bike-2026',
      contact: 'me',
      at: '2026-09-23T19:00:00',
      text: '车修好了，不知道去哪。',
    },
    {
      id: 'me-lamp-2026',
      contact: 'me',
      at: '2026-03-04T18:20:00',
      text: '画室灯修好了。顺手的事。',
    },
    {
      id: 'me-treat-2025',
      contact: 'me',
      at: '2025-09-23T19:00:00',
      text: '有人请客，我去了。',
    },
    {
      id: 'me-canvas-2025',
      contact: 'me',
      at: '2025-03-04T16:40:00',
      text: '车库里翻出一卷没拆的画布。放着吧。',
    },
    {
      id: 'me-birthday',
      contact: 'me',
      at: '2024-09-23T19:00:00',
      text: '今年我请。你没来',
    },
    {
      id: 'me-shrimp',
      contact: 'me',
      at: '2024-03-04T12:30:00',
      image: 'https://i.ibb.co/S77Zw91V/23.jpg',
      text: '虾饺，都是我的了。',
    },
    {
      id: 'me-suffix',
      contact: 'me',
      at: '2024-03-03T21:10:00',
      image: 'https://i.ibb.co/ZzWNFwtQ/4new.jpg',
      text: '我总是想不通\n为何令我喜悦的事物\n总是粘连着我的厌恶\n为何世界上令人欣喜的事物\n都跟着一个暧昧不明的后缀',
    },
    {
      id: 'me-boxing',
      contact: 'me',
      at: '2024-01-01T20:30:00',
      images: ['https://i.ibb.co/KpkdBSz8/6new.jpg', 'https://i.ibb.co/20XYFs0X/5new.jpg'],
      likes: ['zhe'],
      comments: [
        { from: 'zhe', text: '绷带缠多了，脑子也缠上了？' },
        { from: 'me', to: 'zhe', text: '明天来。你试试我脑子缠没缠。' },
      ],
      text: '我喜欢拳击给我带来的震颤\n尤其是绷带缠绕而上的触感\n\n也喜欢被汗水浸透\n一呼一吸之间，都是活着的证明\n\n这些也都是令我喜悦的事物\n\n但我不喜欢拳击馆里昏暗的光线\n也不喜欢淋漓尽致后更多的空虚',
    },
    {
      id: 'tao-scratch',
      contact: 'tao',
      at: '2023-11-22T21:18:00',
      image: 'https://i.ibb.co/FLqcc4sM/22.webp',
      likes: ['me'],
      comments: [{ from: 'me', text: '你在哪' }],
      text: '但每一道划痕，分不清是伤害还是解脱\n\n无计可施\n也许就是我的答案了',
    },
    {
      id: 'tao-canvas',
      contact: 'tao',
      at: '2023-11-20T21:20:00',
      image: 'https://i.ibb.co/kg6zTSjd/21.webp',
      likes: ['me'],
      comments: [{ from: 'me', text: '撕归撕，别划到手。' }],
      text: '我撕开画布，去看画布后的隐秘\n仿佛划破了，撕开了，我就自由了',
    },
    {
      id: 'tao-light',
      contact: 'tao',
      at: '2023-11-15T21:40:00',
      image: 'https://i.ibb.co/YFtz3XLL/14new.jpg',
      likes: ['me'],
      text: '用手电筒的一束光\n在灰尘遍布的走廊里找一处涂鸦\n用莹黄的蜡烛火焰\n在无人问津的废纸上找一页诊断',
    },
    {
      id: 'tao-ruin',
      contact: 'tao',
      at: '2023-11-08T21:30:00',
      image: 'https://i.ibb.co/FZk16b9/15new.jpg',
      likes: ['me'],
      comments: [
        { from: 'me', text: '又半夜乱跑。' },
        { from: 'tao', to: 'me', text: '你管我。' },
      ],
      text: '关于我的答案 我自己也不知道\n\n就像我并不知道该如何描述我的模样\n\n有时候在夜里\n我是偷偷潜入废墟的不速之客',
    },
    {
      id: 'tao-museum',
      contact: 'tao',
      at: '2023-10-23T21:00:00',
      image: 'https://i.ibb.co/7twc8hV6/006fi-FOlgy1hokvz15z3zj31fv4dakjm.webp',
      likes: ['me'],
      comments: [
        { from: 'me', text: '大半夜不睡觉，去什么美术馆。' },
        { from: 'tao', to: 'me', text: '你管我。' },
        { from: 'me', to: 'tao', text: '少半夜往外跑。还有，你水杯在我这，记得来拿。' },
        { from: 'tao', to: 'me', text: '……你翻我东西。' },
        { from: 'me', to: 'tao', text: '你自己不收。下次我扔了。' },
        { from: 'tao', to: 'me', text: '你敢。' },
      ],
      text: '有时候，我也会趁夜色浓郁，闯入无人的美术馆\n挂在墙上的每一幅画都像是我\n我解读画的秘密，画也窥探着我\n\n但我知道，废墟里没有我的答案\n画里也没有我的答案',
    },
    {
      id: 'me-oil',
      contact: 'me',
      at: '2023-10-23T18:40:00',
      image: 'https://i.ibb.co/vCXSDhVG/2new.jpg',
      likes: ['tao', 'zhou'],
      comments: [
        { from: 'tao', text: '那你以后别用笔了。' },
        { from: 'me', to: 'tao', text: '你管这么宽，我是不是该给你个名分。' },
        { from: 'tao', to: 'me', text: '你给得起吗。' },
        { from: 'me', to: 'tao', text: '给不起。所以你少管。' },
        { from: 'me', to: 'tao', text: '你回来。我就给得起。' },
      ],
      text: '手上全是机油味。扳手比笔顺手。',
    },
  ],
  albums: [{ id: 'recent', title: '最近项目' }],
  photos: [
    { id: 'p1', album: 'recent', title: '1', src: 'https://i.ibb.co/gbbYMFfT/1new.jpg' },
    { id: 'p2', album: 'recent', title: '2', src: 'https://i.ibb.co/vCXSDhVG/2new.jpg' },
    { id: 'p3', album: 'recent', title: '3', src: 'https://i.ibb.co/V0vXKjdQ/3new.jpg' },
    { id: 'p4', album: 'recent', title: '4', src: 'https://i.ibb.co/ZzWNFwtQ/4new.jpg' },
    { id: 'p5', album: 'recent', title: '5', src: 'https://i.ibb.co/20XYFs0X/5new.jpg' },
    { id: 'p6', album: 'recent', title: '6', src: 'https://i.ibb.co/KpkdBSz8/6new.jpg' },
    { id: 'p7', album: 'recent', title: '7', src: 'https://i.ibb.co/1Yxxj2k8/7.png' },
    { id: 'p8', album: 'recent', title: '8', src: 'https://i.ibb.co/7xGPR1WQ/8.jpg' },
    { id: 'p9', album: 'recent', title: '9', src: 'https://i.ibb.co/b5Fjg0Tm/9.jpg' },
    { id: 'p10', album: 'recent', title: '10', src: 'https://i.ibb.co/d45x6KK9/10.png' },
    { id: 'p11', album: 'recent', title: '11', src: 'https://i.ibb.co/F4WKGKSJ/11.jpg' },
    { id: 'p12', album: 'recent', title: '12', src: 'https://i.ibb.co/bgZ7bcjJ/12new.jpg' },
    { id: 'p13', album: 'recent', title: '13', src: 'https://i.ibb.co/rKS4TDDx/13.jpg' },
    { id: 'p14', album: 'recent', title: '14', src: 'https://i.ibb.co/YFtz3XLL/14new.jpg' },
    { id: 'p15', album: 'recent', title: '15', src: 'https://i.ibb.co/FZk16b9/15new.jpg' },
    { id: 'p16', album: 'recent', title: '16', src: 'https://i.ibb.co/fg9NYbk/16.jpg' },
    { id: 'p21', album: 'recent', title: '21', src: 'https://i.ibb.co/kg6zTSjd/21.webp' },
    { id: 'p22', album: 'recent', title: '22', src: 'https://i.ibb.co/FLqcc4sM/22.webp' },
    { id: 'p23', album: 'recent', title: '23', src: 'https://i.ibb.co/7twc8hV6/006fi-FOlgy1hokvz15z3zj31fv4dakjm.webp' },
    { id: 'p17', album: 'recent', title: '17', src: 'https://i.ibb.co/vxWftBb9/17.jpg' },
    { id: 'p18', album: 'recent', title: '18', src: 'https://i.ibb.co/C36N10xp/18.jpg' },
    { id: 'p19', album: 'recent', title: '19', src: 'https://i.ibb.co/1fpfrVX0/19.jpg' },
    { id: 'p20', album: 'recent', title: '20', src: 'https://i.ibb.co/hF1x1KMK/20.jpg' },
  ],
  notes: [
    {
      id: 'his-birthday',
      time: '2024年3月4日 星期一',
      title: '2024年3月4日',
      body: '今天你生日。\n\n同学说你是怪胎，我打了那个同学。\n\n画室那天你让我走，我走了。\n\n画是我找到的。地方是我认的。粉色衣服是我穿的。\n\n该做的我都做了。\n\n但我还是没找到你。\n\n以前我能挡在你前面。现在连你在哪都不知道。\n\n陶稚元，你到底在哪。\n\n生日快乐。',
    },
    {
      id: 'pink',
      time: '2023年11月26日 星期日',
      title: '2023年11月23日',
      body: '那天下午，我问你为什么老穿粉色。\n\n你让我走。我走了。\n\n没想到这是最后一次说话。\n\n画室很乱。\n\n你手机打不通。',
    },
    {
      id: 'breakfast',
      time: '2023年11月26日 星期日',
      title: '2023年10月17日',
      body: '早餐店。\n\n你吃那个虾饺的时候，小孩子一样，很可爱。\n\n后来后厨有人尖叫。服务员推开门，腿都在抖。\n\n我站起来。你没动。\n\n后厨里死了一个人。穿粉色上衣。\n\n新闻写的是“粉红衣高中生尸体惊现早餐店”。\n\n回去路上我问你，你怎么不害怕。\n\n你说，害怕有用吗。\n\n现在想想，你那个时候是不是已经想好了后来的一切。\n\n我后来一个人去过那家早餐店。\n\n点了一份虾饺。最后一个没人跟我抢。',
    },
    {
      id: 'birthday',
      time: '2023年11月26日 星期日',
      title: '2023年9月23日',
      body: '今天生日。\n\n我请吃饭。你空着手来的。\n\n我说我过生日你都不请客。你说，你请我来的，凭什么我请。\n\n我说那你至少带个礼物。你说人来了就是礼物。\n\n后来我去结账，服务员说已经买过了。\n\n我回头看你，你坐那儿，筷子都没放。\n\n你说，这顿算我请你的，明年你请我。\n\n明年。',
    },
    {
      id: 'water',
      time: '2023年11月26日 星期日',
      title: '2023年9月12日',
      body: '有人当着我的面说你是怪胎。\n\n我没等他说完。\n\n打完被叫去办公室，你站在门口等我，一句话没说，递了瓶水。\n\n我说你倒是说句话。你说，你手疼不疼。\n\n我当时觉得你有病。\n\n现在想想，你可能是不知道该说什么。\n\n那之后没人当面说了。背后说不说，我管不着。\n\n但至少在我面前，没人敢说。',
    },
  ],
  calendar: {
    events: [
      { id: 'tao-birthday', title: '陶稚元生日', month: 3, day: 4, yearly: true },
    ],
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
  calls: [
    { id: 'c1', contact: 'tao', type: 'outgoing', status: 'missed', time: '2023年11月23日 18:35', duration: '未接通' },
    { id: 'c2', contact: 'tao', type: 'outgoing', status: 'missed', time: '2023年11月23日 19:10', duration: '未接通' },
    { id: 'c3', contact: 'tao', type: 'outgoing', status: 'missed', time: '2023年11月23日 21:05', duration: '未接通' },
    { id: 'c4', contact: 'teacher', type: 'incoming', status: 'answered', time: '2023年11月24日 08:20', duration: '1分42秒' },
    { id: 'c5', contact: 'fang', type: 'incoming', status: 'missed', time: '2023年11月24日 09:08', duration: '未接通' },
    { id: 'c6', contact: 'fang', type: 'outgoing', status: 'answered', time: '2023年11月24日 09:10', duration: '2分13秒' },
    { id: 'c7', contact: 'tao', type: 'outgoing', status: 'missed', time: '2023年11月24日 20:50', duration: '未接通' },
    { id: 'c8', contact: 'tao', type: 'outgoing', status: 'missed', time: '2023年11月25日 19:30', duration: '未接通' },
    { id: 'c9', contact: 'teacher', type: 'incoming', status: 'answered', time: '2023年11月25日 20:10', duration: '2分05秒' },
    { id: 'c10', contact: 'fang', type: 'incoming', status: 'answered', time: '2023年11月26日 11:15', duration: '4分02秒' },
    { id: 'c11', contact: 'teacher', type: 'incoming', status: 'answered', time: '2023年11月26日 16:40', duration: '3分18秒' },
    { id: 'c12', contact: 'fang', type: 'incoming', status: 'answered', time: '2023年11月27日 14:00', duration: '3分27秒' },
    { id: 'c13', contact: 'fang', type: 'incoming', status: 'answered', time: '2023年11月29日 16:05', duration: '2分48秒' },
    { id: 'c14', contact: 'fang', type: 'outgoing', status: 'answered', time: '2023年12月2日 10:00', duration: '5分11秒' },
    { id: 'c15', contact: 'fang', type: 'incoming', status: 'answered', time: '2023年12月4日 15:15', duration: '1分56秒' },
    { id: 'c16', contact: 'fang', type: 'incoming', status: 'answered', time: '2023年12月6日 15:10', duration: '6分34秒' },
    { id: 'c17', contact: 'teacher', type: 'incoming', status: 'answered', time: '2023年12月6日 18:30', duration: '2分44秒' },
    { id: 'c18', contact: 'tao', type: 'outgoing', status: 'missed', time: '2023年12月6日 21:20', duration: '未接通' },
    { id: 'c19', contact: 'tao', type: 'outgoing', status: 'missed', time: '2023年12月12日 21:30', duration: '未接通' },
  ],
}
