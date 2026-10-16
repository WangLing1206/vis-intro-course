import type { Chapter } from './types';

/** 第三章:数据与映射(完整) */
export const CH3: Chapter = {
  id: '3',
  index: 3,
  title: { zh: '数据与映射', en: 'Data & Mapping' },
  intro: {
    zh: '数据类型、比例尺与聚合粒度:把数字变成位置之前必须想清楚的事。',
    en: 'Data types, scales and aggregation: what to settle before turning numbers into positions.',
  },
  goals: [
    { zh: '区分分类/有序/定量数据并匹配通道', en: 'Distinguish nominal, ordinal and quantitative data' },
    { zh: '理解线性/对数比例尺的适用场景', en: 'Know when to use linear vs log scales' },
    { zh: '解释聚合粒度如何改变图形结论', en: 'Explain how binning changes conclusions' },
  ],
  sections: [
    {
      id: 's1',
      title: { zh: '数据长什么样,决定图长什么样', en: 'Data shape dictates chart shape' },
      body: [
        {
          t: 'p',
          x: {
            zh: '动手画图之前,先给数据验明正身。分类数据只有名字没有顺序,比如城市、产品线,只能数个数;有序数据有等级没间距,比如满意度五星,能排序不能做差;定量数据是真正的数字,比如销售额、温度,加减乘除随便来。验错身份,后面全错:给城市画折线图,用连线暗示了城市之间存在连续变化——这是凭空捏造关系。',
            en: 'Before drawing anything, identify your data. Nominal data has names but no order — cities, product lines — countable but not measurable. Ordinal data has rank but no spacing — five-star ratings — sortable but not subtractable. Quantitative data is truly numeric — sales, temperature — free for any arithmetic. Misidentify it and everything downstream fails: a line chart of cities implies continuous change between them — a relationship you fabricated.',
          },
        },
        { t: 'h3', x: { zh: '类型与通道的速配表', en: 'Type-to-channel cheat sheet' } },
        {
          t: 'olist',
          x: {
            zh: [
              '分类数据配分类色与位置并列:分组柱状、着色散点,不要用深浅表达类别。',
              '有序数据配顺序色或位置序列:热力分级、排序条形,保留等级感。',
              '定量数据配位置与长度:散点、柱状、折线,精度最高的通道留给最重要的数字。',
              '时间是最特殊的定量:永远用位置(横轴)表达,永远保持等间距,缺失也要留空位。',
            ],
            en: [
              'Nominal goes with categorical color and side-by-side position: grouped bars, colored scatters — never lightness for groups.',
              'Ordinal goes with sequential color or ordered position: graded heatmaps, ranked bars — preserve the sense of rank.',
              'Quantitative goes with position and length: scatters, bars, lines — the most precise channels for the most important numbers.',
              'Time is the special quantitative: always position (horizontal axis), always evenly spaced, gaps left visible when data is missing.',
            ],
          },
        },
      ],
    },
    {
      id: 's2',
      title: { zh: '实验:比例尺会讲故事', en: 'Lab: scales tell stories' },
      body: [
        {
          t: 'p',
          x: {
            zh: '同一组指数增长的用户数 [3, 5, 9, …, 310]:在线性轴下,前半段被压成一条贴地爬行的线,所有戏剧性都堆在最后两天;切换到对数轴,指数增长被拉成一条直线,每天翻倍的节奏一目了然。两种画法都诚实,但回答的问题不同:线性轴回答“现在有多大”,对数轴回答“增长有多稳”。',
            en: 'The same exponential user counts [3, 5, 9, …, 310]: on a linear axis the first half is flattened into a crawling line with all drama crammed into the last two days; on a log axis the exponential becomes a straight line and the daily doubling rhythm jumps out. Both are honest, but they answer different questions: linear asks “how big now”, log asks “how steady is the growth”.',
          },
        },
        {
          t: 'p',
          x: {
            zh: '切换参数,注意代码里只有 type 一行变化。对数轴的代价是直觉:普通读者会低估顶部区间的真实跨度,所以用对数轴时必须在标题或标注里明说,绝不能偷偷切换。',
            en: 'Switch the parameter — only the type line changes in the code. The price of log scales is intuition: lay readers underestimate the true span of top intervals, so a log axis must always be announced in the title or annotations, never switched silently.',
          },
        },
      ],
      code: {
        lang: 'javascript',
        source: `const option = {
  xAxis: { type: 'category', data: ['1', …, '9'] },
  yAxis: { type: {{scale}} },  // ← 切换比例尺
  series: [{ type: 'line', data: [3, 5, 9, 17, 33, 65, 129, 200, 310] }],
};`,
      },
      demoId: 'scale-switch',
      params: [
        {
          key: 'scale',
          kind: 'select',
          label: { zh: 'y 轴比例尺', en: 'Y scale' },
          default: 'linear',
          options: [
            { value: 'linear', label: { zh: '线性轴(看体量)', en: 'Linear (see size)' } },
            { value: 'log', label: { zh: '对数轴(看增速)', en: 'Log (see rate)' } },
          ],
          code: {
            linear: `'value'  // 线性轴:小值被压扁,体量感真实`,
            log: `'log'    // 对数轴:指数变直线,但必须明确标注`,
          },
        },
      ],
      caption: {
        zh: '同一组数据:线性轴看体量,对数轴看增速,两种都诚实,但必须明示。',
        en: 'Same data: linear shows size, log shows rate — both honest, but the scale must be announced.',
      },
    },
    {
      id: 's3',
      title: { zh: '实验:聚合的粒度决定结论', en: 'Lab: binning decides conclusions' },
      body: [
        {
          t: 'p',
          x: {
            zh: '200 个样本藏着两个峰(35 与 70 附近),但你能不能看到,完全取决于分箱数:只分 5 箱,双峰被抹平成一个驼峰,你会断言“单峰分布”;拖到 30 箱以上,柱子高高低低全是噪声,真正的结构淹没在毛刺里。分箱不是技术细节,是分析结论本身——换一组箱,换一个故事。',
            en: 'Two hundred samples hide two peaks (near 35 and 70) — whether you see them depends entirely on bin count: with 5 bins the twin peaks merge into one hump and you would declare “unimodal”; past 30 bins every bar is noise and the real structure drowns in spikes. Binning is not a technicality, it is the conclusion — change the bins, change the story.',
          },
        },
        {
          t: 'p',
          x: {
            zh: '拖动滑杆,观察代码中的 binCount 与图形同步变化。实践建议:从 10~15 箱起步,上下各试一档,如果结论(几个峰、偏态方向)在三档下都稳定,这个结论才值得信任。',
            en: 'Drag the slider and watch binCount in the code change with the chart. Practical rule: start at 10–15 bins, try one step up and down — if the conclusion (how many peaks, which skew) survives all three, it deserves trust.',
          },
        },
      ],
      code: {
        lang: 'javascript',
        source: `const binCount = {{bins}};  // ← 拖动滑杆
const counts = bin(data, binCount);
const option = {
  xAxis: { type: 'category', data: ranges },
  series: [{ type: 'bar', data: counts }],
};`,
      },
      demoId: 'histogram-bins',
      params: [
        {
          key: 'bins',
          kind: 'slider',
          label: { zh: '分箱数', en: 'Bins' },
          min: 5,
          max: 40,
          step: 1,
          default: 12,
        },
      ],
      caption: {
        zh: '分箱太少吞掉双峰,太多全是噪声:粒度本身就是结论的一部分。',
        en: 'Too few bins swallow the twin peaks; too many drown them in noise.',
      },
    },
    {
      id: 's4',
      title: { zh: '映射检查清单', en: 'Mapping checklist' },
      body: [
        {
          t: 'p',
          x: {
            zh: '映射是管线里最容易出错的一步,值得一张独立的清单。它和第二章的感知清单配合使用:感知清单防“读错”,这张清单防“画错”。',
            en: 'Mapping is the pipeline step where most errors are born, so it earns its own checklist. Pair it with Chapter 2’s perceptual list: that one prevents misreading, this one prevents misdrawing.',
          },
        },
        {
          t: 'olist',
          x: {
            zh: [
              '数据类型验明正身了吗?分类、有序、定量各归其位,时间轴等距留空。',
              '比例尺选对了吗?跨数量级用对数并明示,柱状图从 0 开始。',
              '聚合粒度试过三档了吗?结论在粗中细三档下都稳定才算数。',
              '缺失值如实表达了吗?断点就是断点,不许用连线编造数据。',
            ],
            en: [
              'Is every data type identified? Nominal, ordinal, quantitative each in place; time axes even with gaps shown.',
              'Is the scale right? Log for orders of magnitude with announcement; bars from zero.',
              'Did the aggregation survive three granularities? A conclusion counts only if coarse, medium and fine agree.',
              'Are missing values shown honestly? A gap is a gap — never bridge it with an invented line.',
            ],
          },
        },
      ],
    },
  ],
  quizIds: ['ch3-q1', 'ch3-q2', 'ch3-q3'],
};