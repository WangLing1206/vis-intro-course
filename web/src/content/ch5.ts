import type { Chapter } from './types';

/** 第五章:关系、网络与时空(完整) */
export const CH5: Chapter = {
  id: '5',
  index: 5,
  title: { zh: '关系、网络与时空', en: 'Relations, Networks & Space-Time' },
  intro: {
    zh: '层次、网络、地图与时间序列:数据之间有关系时,图表该怎么画。',
    en: 'Hierarchies, networks, maps and time series: how to draw data that is connected.',
  },
  goals: [
    { zh: '为层次/网络/时空数据匹配图表', en: 'Match charts to hierarchical, networked and spatio-temporal data' },
    { zh: '读懂力导向网络图并调节斥力', en: 'Read force-directed graphs and tune repulsion' },
    { zh: '用时间窗口与均线分离趋势与噪声', en: 'Separate trend from noise with windows and moving averages' },
    { zh: '说出地图设色的归一化铁律', en: 'State the normalization rule for choropleth maps' },
  ],
  sections: [
    {
      id: 's1',
      title: { zh: '当数据之间有关系', en: 'When data points relate' },
      body: [
        {
          t: 'p',
          x: {
            zh: '前四章的每个数字都是孤岛:一行即一个样本。但真实数据常常成对、成网、成序列地出现:员工属于部门、论文引用论文、气温连着日期、病例落在城市。关系本身就是数据,画关系的方法论自成一章。',
            en: 'Every number so far was an island: one row, one sample. But real data arrives in pairs, nets and sequences: staff belong to teams, papers cite papers, temperature clings to dates, cases land in cities. Relationships are data too, and drawing them deserves its own chapter.',
          },
        },
        { t: 'h3', x: { zh: '三种关系,三种武器', en: 'Three relations, three weapons' } },
        {
          t: 'olist',
          x: {
            zh: [
              '层次:谁包含谁。用树图、矩形树图、旭日图,面积表体量,嵌套表归属。',
              '网络:谁连接谁。用节点连线图或邻接矩阵,下一节亲手调一张力导向图。',
              '时空:何时、何地。用时间序列折线与地图设色,时间永远占横轴,地图永远先归一化。',
            ],
            en: [
              'Hierarchy: who contains whom. Trees, treemaps, sunbursts — area for size, nesting for belonging.',
              'Network: who links to whom. Node-link diagrams or adjacency matrices — tune a force layout hands-on next section.',
              'Space-time: when and where. Time-series lines and choropleth maps — time always owns the horizontal axis, maps always get normalized first.',
            ],
          },
        },
        {
          t: 'p',
          x: {
            zh: '读关系图的第一课:位置不再编码数值,而是编码关系。树用上下级排布,网络用邻近表达亲疏,时间用横轴表达先后,地图用地理表达区位。读懂位置的新含义,才算拿到了本章的钥匙。',
            en: 'Lesson one for reading relational charts: position no longer encodes values — it encodes relationships. Trees use levels, networks use proximity for closeness, time uses the horizontal axis for order, maps use geography for location. Grasp position’s new meaning and you hold this chapter’s key.',
          },
        },
      ],
    },
    {
      id: 's2',
      title: { zh: '实验:力导向网络', en: 'Lab: force-directed network' },
      body: [
        {
          t: 'p',
          x: {
            zh: '12 个课程角色、16 条协作边,力导向算法把它们摆成一张网:相连的节点被边拽住,不相连的被斥力推开,最终抱团的是天然社群。拖动滑杆:斥力太小,所有节点挤成毛线团,社群结构荡然无存;斥力太大,边被拉得失去意义,亲疏感彻底消失。120 附近是这张图的甜蜜点:三个颜色组各自抱团,组间桥梁清晰可见。',
            en: 'Twelve course roles, sixteen collaboration edges: the force layout arranges them into a net — linked nodes pulled by edges, unlinked ones pushed apart by repulsion, so natural communities end up huddled together. Drag the slider: too little repulsion and everything collapses into a hairball with no community structure; too much and the edges stretch into meaninglessness. Around 120 is this graph’s sweet spot: three color groups cluster, with bridges between them clearly visible.',
          },
        },
        {
          t: 'p',
          x: {
            zh: '图是可以玩的:拖拽节点、滚轮缩放、悬停高亮邻居。注意代码里只有 repulsion 一行随滑杆变化,节点颜色表达的是分组归属,是第二章的分类色在网络图里的延续。',
            en: 'This chart is playable: drag nodes, scroll to zoom, hover to highlight neighbors. Only the repulsion line in the code follows the slider; node colors encode group membership — Chapter 2’s categorical palette living on in a network.',
          },
        },
      ],
      code: {
        lang: 'javascript',
        source: `series: [{
  type: 'graph',
  layout: 'force',
  force: { repulsion: {{repel}}, edgeLength: 90 },  // ← 拖动滑杆
  roam: true,      // 滚轮缩放
  draggable: true, // 节点可拖拽
}],`,
      },
      demoId: 'force-network',
      params: [
        {
          key: 'repel',
          kind: 'slider',
          label: { zh: '节点斥力', en: 'Repulsion' },
          min: 50,
          max: 300,
          step: 10,
          default: 120,
        },
      ],
      caption: {
        zh: '斥力太小挤成毛线团,太大扯断亲疏感:布局参数本身就是一种叙事选择。',
        en: 'Too little repulsion, a hairball; too much, no closeness left: layout parameters are narrative choices.',
      },
    },
    {
      id: 's3',
      title: { zh: '实验:时间窗口', en: 'Lab: the time window' },
      body: [
        {
          t: 'p',
          x: {
            zh: '120 天的访问量藏着三层结构:缓慢爬升的趋势、每 7 天一个的周周期、每天的随机噪声。只看最近 14 天,你看到的全是毛刺,会断言毫无规律;把窗口拉到 120 天,爬升的趋势线自己走了出来。窗口长度不是显示设置,是分析结论:看多长,决定了你能回答什么问题。',
            en: 'One hundred twenty days of traffic hide three layers: a slow climbing trend, a weekly cycle, and daily random noise. With only the last 14 days you see nothing but spikes and would declare there is no pattern; stretch the window to 120 days and the climbing trend walks out by itself. Window length is not a display setting — it is the analysis: how much you see decides which questions you may answer.',
          },
        },
        {
          t: 'p',
          x: {
            zh: '7 日均线是第二件武器:逐日滑动平均,恰好抹掉周周期与噪声,留下趋势的骨架。拖动窗口、开关均线,观察代码中 slice 与均线序列同步变化。记住第三章的铁律:缺失的日期必须留空,绝不许用连线编造数据。',
            en: 'The 7-day moving average is the second weapon: a sliding mean that erases exactly the weekly cycle and the noise, leaving the skeleton of the trend. Drag the window, toggle the average, and watch the slice and the average series change in the code. And remember Chapter 3’s iron rule: missing dates stay empty — never bridge them with invented lines.',
          },
        },
      ],
      code: {
        lang: 'javascript',
        source: `const window = data.slice(-{{days}});  // ← 拖动滑杆:窗口越长,趋势越清楚
const showMA = {{ma}};
series: [
  { name: 'daily', data: window },
  showMA && { name: '7-day MA', data: ma7(window) },
],`,
      },
      demoId: 'time-window',
      params: [
        {
          key: 'days',
          kind: 'slider',
          label: { zh: '时间窗口(天)', en: 'Window (days)' },
          min: 14,
          max: 120,
          step: 2,
          default: 60,
        },
        {
          key: 'ma',
          kind: 'select',
          label: { zh: '7 日均线', en: '7-day MA' },
          default: 'on',
          options: [
            { value: 'on', label: { zh: '显示均线', en: 'Show MA' } },
            { value: 'off', label: { zh: '只看日值', en: 'Daily only' } },
          ],
          code: {
            on: 'true   // 显示 7 日均线:滤掉噪声,趋势浮现',
            off: 'false  // 只看日值:毛刺淹没趋势',
          },
        },
      ],
      caption: {
        zh: '窗口越长越能看见趋势,均线滤掉噪声留下骨架:时间分析的两件武器。',
        en: 'Longer windows reveal trends; the moving average keeps the skeleton: two weapons for time.',
      },
    },
    {
      id: 's4',
      title: { zh: '地图一瞥与时空清单', en: 'Maps at a glance, and the space-time checklist' },
      body: [
        {
          t: 'p',
          x: {
            zh: '地图是最直观的关系图,也是最容易撒谎的图。分级设色地图有两条铁律:第一,永远画比率不画总量,各省病例数必须除以人口,否则画出来的只是人口地图;第二,顺序数据用单色相渐变,这是第二章配色课的直接应用,彩虹地图和彩虹柱状图一样,都是反面教材。此外任何投影都会扭曲面积或距离,读图时记得地图只是地球的近似。',
            en: 'Maps are the most intuitive relational charts — and the easiest liars. Choropleth maps obey two iron rules: first, always map rates, never raw counts — divide cases by population or you have merely drawn a population map; second, sequential data takes a single-hue ramp, a direct application of Chapter 2’s color lesson — rainbow maps are anti-patterns exactly like rainbow bars. And every projection distorts area or distance: a map is only an approximation of the Earth.',
          },
        },
        { t: 'h3', x: { zh: '时空自查清单', en: 'Space-time checklist' } },
        {
          t: 'olist',
          x: {
            zh: [
              '时间轴等距了吗?缺失的日期留空了吗?不等距的时间轴是隐形的截断坐标轴。',
              '窗口长度试过三档了吗?结论在短中长三个窗口下都稳定才算数。',
              '地图画的是比率吗?总量上色之前,先除以人口、面积或基数。',
              '网络图的布局调过吗?换一组斥力,社群结构还成立吗?只在一种布局下成立的结构不值得信任。',
            ],
            en: [
              'Is the time axis evenly spaced, gaps left visible? An uneven time axis is a stealth truncated axis.',
              'Did the conclusion survive three window lengths? Short, medium and long must agree.',
              'Does the map show rates? Before coloring raw counts, divide by population, area or baseline.',
              'Was the network layout tuned? Does the community structure survive a different repulsion? A structure that holds in only one layout deserves no trust.',
            ],
          },
        },
      ],
    },
  ],
  quizIds: ['ch5-q1', 'ch5-q2', 'ch5-q3'],
};