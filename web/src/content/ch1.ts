import type { Chapter } from './types';

/** 第一章:走进可视化(完整) */
export const CH1: Chapter = {
  id: '1',
  index: 1,
  title: { zh: '走进可视化', en: 'Meet Visualization' },
  intro: {
    zh: '可视化是什么、解决什么问题:一条从数据到决策的管线,和两个亲手验证的理由。',
    en: 'What visualization is and why it matters: one pipeline from data to decision, two reasons you verify by hand.',
  },
  goals: [
    { zh: '说出可视化管线的四个阶段', en: 'Name the four stages of the visualization pipeline' },
    { zh: '用安斯库姆四重奏解释“只看统计量不够”', en: 'Explain, via Anscombe’s quartet, why summary statistics are not enough' },
    { zh: '识别截断坐标轴式误导,并说出修正方法', en: 'Spot truncated-axis distortion and fix it' },
    { zh: '用诚实、清晰、美观评价一幅图', en: 'Judge a chart by honest, clear, beautiful' },
  ],
  sections: [
    {
      id: 's1',
      title: { zh: '从数据到决策:可视化管线', en: 'From data to decision: the pipeline' },
      body: [
        {
          t: 'p',
          x: {
            zh: '可视化的经典定义是:借助人眼的感知能力,将数据转换为可见的图形,帮助人们发现规律、做出判断。它不是把表格“画出来”而已,而是一条完整管线:原始数据经过清洗与变换,映射为位置、长度、颜色等视觉通道,再渲染成图,最终被人解读并反作用于决策。',
            en: 'The classic definition: visualization turns data into visible graphics that leverage human perception, helping people discover patterns and make judgments. It is not just “drawing the table” — it is a pipeline: raw data is cleaned and transformed, mapped to visual channels such as position, length and color, rendered as graphics, and finally read by a human who acts on it.',
          },
        },
        { t: 'h3', x: { zh: '管线的四个阶段', en: 'Four stages of the pipeline' } },
        {
          t: 'olist',
          x: {
            zh: [
              '数据与任务:明确数据长什么样、读者想回答什么问题,问题不清,图注定失败。',
              '数据变换:筛选、聚合、归一化,把数据变成“可画”的形状,这是最容易藏猫腻的一步。',
              '视觉映射:选择图表与通道,把数值变成位置、长度、面积、颜色,本章后面会反复回到这一步。',
              '视图与交互:布局、标注、筛选联动,让读者能追问数据,而不是只看一张静态图。',
            ],
            en: [
              'Data and task: know what the data looks like and what question the reader wants answered. A vague question guarantees a failed chart.',
              'Data transform: filter, aggregate, normalize — reshape data into something drawable. This is where distortion hides most easily.',
              'Visual mapping: choose charts and channels, turning numbers into position, length, area, color. We will return to this step throughout the course.',
              'View and interaction: layout, annotation, linked filtering — let readers interrogate the data instead of staring at one static image.',
            ],
          },
        },
        {
          t: 'p',
          x: {
            zh: '记住这条管线,后面每一章都是它的展开:第二章讲人眼如何读图,第三章讲变换与比例尺,第四到六章讲各类图表,全程都可以用“诚实吗?清晰吗?”来拷问每一幅效果图。',
            en: 'Keep this pipeline in mind — every later chapter expands one part of it: how eyes read (Ch2), transforms and scales (Ch3), chart families (Ch4–6). Interrogate each demo with the same two questions: is it honest? is it clear?',
          },
        },
      ],
    },
    {
      id: 's2',
      title: { zh: '安斯库姆四重奏:数字相同,图形迥异', en: 'Anscombe’s quartet: same numbers, different shapes' },
      body: [
        {
          t: 'p',
          x: {
            zh: '1973 年统计学家安斯库姆构造了四组数据:样本量、x 与 y 的均值方差、相关系数、回归直线几乎完全相同。但把它们画成散点图,四幅图讲述的是四个完全不同的故事:线性、曲线、离群点、杠杆点。只看统计量,你会以为它们是同一组数据。',
            en: 'In 1973, statistician Anscombe constructed four datasets with nearly identical size, means, variances, correlation and regression line. Yet their scatter plots tell four completely different stories: linear, curved, outlier-driven, leverage-point-driven. Trust the summary statistics alone and you would swear they are the same data.',
          },
        },
        {
          t: 'p',
          x: {
            zh: '下面的代码与渲染效果是联动的:切换分组,注意 series 那一行如何变化,回归直线几乎不动,而点的分布天差地别——这就是可视化存在的理由:图形能暴露数字的盲区。',
            en: 'The code below is linked to its rendering: switch groups and watch the series line change. The regression line barely moves while the point clouds could not differ more. That is why visualization exists — graphics expose what numbers hide.',
          },
        },
      ],
      code: {
        lang: 'javascript',
        source: `// ECharts 散点图 + 回归直线(随下方参数联动)
const option = {
  color: ['#2F6BFF', '#00A38D', '#E8A100', '#E85D4D'],
  xAxis: { name: 'x', min: 2, max: 20 },
  yAxis: { name: 'y', min: 2, max: 13 },
  series: {{group}},   // ← 当前选择
  // 回归线 y = 3 + 0.5x:四组几乎重合(markLine)
};
chart.setOption(option);`,
      },
      demoId: 'anscombe-quartet',
      params: [
        {
          key: 'group',
          kind: 'select',
          label: { zh: '数据分组', en: 'Group' },
          default: 'all',
          options: [
            { value: 'all', label: { zh: '四组叠加', en: 'All overlaid' } },
            { value: '0', label: { zh: '第 I 组·线性', en: 'I · linear' } },
            { value: '1', label: { zh: '第 II 组·曲线', en: 'II · curved' } },
            { value: '2', label: { zh: '第 III 组·离群点', en: 'III · outlier' } },
            { value: '3', label: { zh: '第 IV 组·杠杆点', en: 'IV · leverage' } },
          ],
          code: {
            all: 'groups.map((g) => scatterOf(g))',
            '0': '[scatterOf(groups[0])]  // 仅第 I 组·线性',
            '1': '[scatterOf(groups[1])]  // 仅第 II 组·曲线',
            '2': '[scatterOf(groups[2])]  // 仅第 III 组·离群点',
            '3': '[scatterOf(groups[3])]  // 仅第 IV 组·杠杆点',
          },
        },
      ],
      caption: {
        zh: '四组数据的均值、方差、相关系数几乎相同,回归线重合,但散点形态完全不同。',
        en: 'The four groups share nearly identical statistics and regression lines, yet their scatters differ completely.',
      },
    },
    {
      id: 's3',
      title: { zh: '柱状图如何撒谎:截断坐标轴', en: 'How bars lie: the truncated axis' },
      body: [
        {
          t: 'p',
          x: {
            zh: '三组数据 A=128、B=142、C=151,C 只比 A 高 18%。但如果把 y 轴从 100 开始截断,C 的柱子看起来比 A 高出近 3 倍——柱子的高度不再正比于数值,人眼对长度的判断被彻底带偏。这是商业图表里最常见的误导手法,识别方法只有一句话:看 y 轴从几开始。',
            en: 'Three values A=128, B=142, C=151: C is only 18% above A. But start the y axis at 100 and C’s bar looks nearly 3x taller than A’s — bar height is no longer proportional to value, and the eye’s length judgment is hijacked. This is the most common trick in business charts, and the defense is one sentence: check where the y axis starts.',
          },
        },
        {
          t: 'p',
          x: {
            zh: '切换下方参数,把 y 轴起点从 0 改到 100,观察代码中 min 那一行与柱子形态同步变化。修正方法同样简单:柱状图的 y 轴永远从 0 开始;如果差异确实需要强调,换折线图并明确标注坐标范围,而不是偷偷截断。',
            en: 'Switch the parameter below from 0 to 100 and watch the min line in the code change together with the bars. The fix is equally simple: bar charts always start at zero. If small differences truly matter, use a line chart with a clearly labeled range instead of silently truncating.',
          },
        },
      ],
      code: {
        lang: 'javascript',
        source: `const option = {
  xAxis: { type: 'category', data: ['A', 'B', 'C'] },
  yAxis: { min: {{baseline}} },  // ← 切换参数,看柱子如何撒谎
  series: [{ type: 'bar', data: [128, 142, 151] }],
};
chart.setOption(option);`,
      },
      demoId: 'truncated-axis',
      params: [
        {
          key: 'baseline',
          kind: 'select',
          label: { zh: 'y 轴起点', en: 'Y baseline' },
          default: '0',
          options: [
            { value: '0', label: { zh: '从 0 开始(诚实)', en: 'Start at 0 (honest)' } },
            { value: '100', label: { zh: '从 100 截断(误导)', en: 'Cut at 100 (misleading)' } },
          ],
          code: {
            '0': '0    // 从 0 开始,柱高正比于数值',
            '100': '100  // 从 100 截断!18% 的差距看起来像 3 倍',
          },
        },
      ],
      caption: {
        zh: '同一组数据,仅 y 轴起点不同,传达的信息强度完全不同。',
        en: 'Same data, different baseline — a completely different perceived story.',
      },
    },
    {
      id: 's4',
      title: { zh: '什么是好的可视化', en: 'What makes a good visualization' },
      body: [
        {
          t: 'p',
          x: {
            zh: '好图有三个朴素标准,按重要性排序:诚实、清晰、美观。诚实是底线——坐标轴截断、面积冒充长度、双轴误导,都属于不诚实;清晰要求一眼能抓住主要信息,不让装饰喧宾夺主;美观是加分项,统一的色彩与克制的排版会让人更愿意读下去。',
            en: 'A good chart meets three plain criteria, in order: honest, clear, beautiful. Honesty is the baseline — truncated axes, areas posing as lengths, misleading dual axes all fail it. Clarity means the main message lands at a glance without decoration stealing the show. Beauty is the bonus: consistent color and restrained layout invite reading.',
          },
        },
        {
          t: 'olist',
          x: {
            zh: [
              '诚实:数据与图形严格对应,不截断、不双标、不暗示不存在的关系。',
              '清晰:一个视角只回答一个问题,图例与标注完整,读者无需猜。',
              '美观:色彩统一、留白克制,让读者愿意停留,而不是被吓跑。',
            ],
            en: [
              'Honest: graphics correspond strictly to data — no truncation, no double standards, no implied relationships that do not exist.',
              'Clear: one view answers one question, legends and labels complete, no guessing required.',
              'Beautiful: consistent color, restrained whitespace — inviting, not intimidating.',
            ],
          },
        },
        {
          t: 'p',
          x: {
            zh: '本站的全部图表共用一套六色色板、同一套交互控件,正是“美观服务于清晰”的实践:当颜色与交互处处一致,读者的大脑就不用在每张图前重新学习规则,可以把注意力还给数据本身。下一章,我们深入人眼,看看它到底擅长读什么、不擅长读什么。',
            en: 'Every chart on this site shares one six-color palette and one set of controls — beauty serving clarity in practice. When color and interaction stay consistent, readers stop re-learning the rules on every chart and spend their attention on the data itself. Next chapter, we go inside the eye to learn what it reads well — and what it does not.',
          },
        },
      ],
    },
  ],
  quizIds: ['ch1-q1', 'ch1-q2', 'ch1-q3', 'ch1-q4'],
};