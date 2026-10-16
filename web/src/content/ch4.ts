import type { Chapter } from './types';

/** 第四章:基础统计图表(完整) */
export const CH4: Chapter = {
  id: '4',
  index: 4,
  title: { zh: '基础统计图表', en: 'Core Statistical Charts' },
  intro: {
    zh: '柱状、折线、饼图、散点:同一数据集的四种视角,先问问题,再选图表。',
    en: 'Bar, line, pie, scatter: four views of one dataset — ask the question first, then pick the chart.',
  },
  goals: [
    { zh: '为比较/趋势/构成/关系选对图表', en: 'Match chart type to comparison, trend, composition, relationship' },
    { zh: '用同一数据生成四种图表并对比', en: 'Render four chart types from one dataset and compare' },
    { zh: '说出饼图的适用边界与替代方案', en: 'State the limits of pie charts and their alternatives' },
    { zh: '用选图清单避免答非所问', en: 'Use the chart-choice checklist to avoid answering the wrong question' },
  ],
  sections: [
    {
      id: 's1',
      title: { zh: '先问问题,再选图表', en: 'Ask the question first, then pick the chart' },
      body: [
        {
          t: 'p',
          x: {
            zh: '大多数选错图的事故,根子不在图,在问题。同一份月度销售数据,老板问哪个月最高、分析师问增长稳不稳、财务问各季度占比、建模同学问月份和销量到底有没有关系——四个问题,四种图。答错问题,再美的图也是零分。动手之前先把问题写成一句话:主语是比较、趋势、构成还是关系,图的类型就定了八成。',
            en: 'Most wrong-chart accidents start not with the chart but with the question. One monthly-sales dataset, four askers: the boss asks which month peaked, the analyst asks whether growth is steady, finance asks the quarterly shares, the modeler asks whether month and sales are even related — four questions, four charts. A beautiful chart answering the wrong question scores zero. Before touching any code, write the question in one sentence: is its verb compare, trend, compose or relate? The chart type is then 80% decided.',
          },
        },
        { t: 'h3', x: { zh: '四个问题,四种视角', en: 'Four questions, four views' } },
        {
          t: 'olist',
          x: {
            zh: [
              '比较:谁大谁小谁第几。用分组或排序柱状图,长度通道,第一章的从 0 开始规则继续有效。',
              '趋势:随时间怎么变。用折线图,位置连成的走向,斜率本身就是故事。',
              '构成:整体由哪些部分组成。用饼图、环形或堆叠条形,但名额有限,边界见下一节。',
              '关系:两个变量是否同进退。用散点图,点云的走向就是相关性的形状。',
            ],
            en: [
              'Compare: who is bigger, who ranks where. Grouped or ranked bars on the length channel; Chapter 1’s start-at-zero rule still applies.',
              'Trend: how it moves over time. Line charts — the slope itself is the story.',
              'Compose: what parts make the whole. Pie, donut or stacked bars — but seats are limited; see the next section for the boundary.',
              'Relate: do two variables move together. Scatter plots — the cloud’s drift is the shape of correlation.',
            ],
          },
        },
        {
          t: 'p',
          x: {
            zh: '下一节把同一份数据放进一数四图演示器:切换视角,注意代码里只有 type 一行在变,回答的问题却彻底换了。选图不是选皮肤,是选问题。',
            en: 'Next section loads one dataset into the one-data-four-charts lab: switch views and notice that only the type line changes in the code while the answered question changes completely. Choosing a chart is not choosing a skin — it is choosing a question.',
          },
        },
      ],
    },
    {
      id: 's2',
      title: { zh: '实验:一数四图', en: 'Lab: one dataset, four charts' },
      body: [
        {
          t: 'p',
          x: {
            zh: '数据是 12 个月销售额 [42, 38, 51, …, 112],整体爬升、中间有波动。柱状图下 12 月最高、2 月最低一目了然,适合回答比较;切到折线,年中的回调和年末的冲刺连成一条起伏的线,适合回答趋势;切到饼图,注意它先把 12 个月聚合成 4 个季度再画,这是构成视角的第一课:饼图的代价是细节;切到散点,横轴月份、纵轴销量,点列向右上方爬行,适合回答月份越往后销量越高吗。',
            en: 'The data is 12 months of sales [42, 38, 51, …, 112]: climbing overall with wobbles in the middle. Bars answer compare — December tallest, February shortest at a glance. Lines answer trend — the mid-year dip and year-end sprint join into one rising story. Pie first aggregates 12 months into 4 quarters — lesson one of composition: pie pays for simplicity with detail. Scatter puts month on x and sales on y, dots marching up-right to answer: do later months sell more.',
          },
        },
        {
          t: 'p',
          x: {
            zh: '切换参数,观察代码 type 行与图形同步变化。再想一步:如果老板只关心 Q4 占比超没超 30%,四个视角里只有饼图直接给答案。问题定了,图就没有选择困难症。',
            en: 'Switch the parameter and watch the type line change with the chart. One step further: if the boss only asks whether Q4 exceeded 30%, only the pie answers directly. Once the question is fixed, chart choice stops being a dilemma.',
          },
        },
      ],
      code: {
        lang: 'javascript',
        source: `const sales = [42, 38, 51, …, 112];  // 12 个月销售额
const option = {
  series: [{ type: {{mode}} }],  // ← 切换视角
};
chart.setOption(option);`,
      },
      demoId: 'chart-switcher',
      params: [
        {
          key: 'mode',
          kind: 'select',
          label: { zh: '图表视角', en: 'View' },
          default: 'bar',
          options: [
            { value: 'bar', label: { zh: '柱状·比较', en: 'Bar · compare' } },
            { value: 'line', label: { zh: '折线·趋势', en: 'Line · trend' } },
            { value: 'pie', label: { zh: '饼图·构成', en: 'Pie · compose' } },
            { value: 'scatter', label: { zh: '散点·关系', en: 'Scatter · relate' } },
          ],
          code: {
            bar: `'bar'      // 比较视角:12 个月并排,谁高谁低一眼分明`,
            line: `'line'     // 趋势视角:连线强调走向,波动与爬升一目了然`,
            pie: `'pie'      // 构成视角:注意!12 个月先聚合成 4 个季度`,
            scatter: `'scatter'  // 关系视角:月份 vs 销量,越往右上走增长越稳`,
          },
        },
      ],
      caption: {
        zh: '同一份销售数据:比较看高低,趋势看走向,构成看占比,关系看走向的相关。',
        en: 'One sales dataset: compare heights, trace trends, read shares, inspect relations.',
      },
    },
    {
      id: 's3',
      title: { zh: '饼图的边界', en: 'The limits of pie' },
      body: [
        {
          t: 'p',
          x: {
            zh: '饼图是最被滥用的图表,也是第二章精度排序的必然结果:角度读数本来就难,扇形一多直接变成色块拼盘。饼图的安全区很小:类别不超过 5 个、最大与最小份额差距够大、读者只关心谁占大头而不关心精确值。三条缺一,就该换图。',
            en: 'Pie is the most abused chart, and Chapter 2’s ranking explains why: angle is hard to read, and many slices turn the chart into a mosaic of color blocks. Pie’s safe zone is tiny: at most 5 categories, a large gap between the biggest and smallest shares, and readers who only ask who takes the biggest slice — never exact values. Miss any one of the three, and it is time to switch.',
          },
        },
        { t: 'h3', x: { zh: '构成问题的三条出路', en: 'Three exits for composition questions' } },
        {
          t: 'olist',
          x: {
            zh: [
              '要精确比较部分之间:换排序条形图,长度通道,差距一目了然。',
              '要看构成随时间变化:换堆叠条形或面积图,时间轴加长度,双通道叙事。',
              '非用饼不可:只留 Top4 加其他,从 12 点钟按大小顺时针排,最大扇形永远放在第一眼的位置。',
            ],
            en: [
              'To compare parts precisely: switch to ranked bars — the length channel lays gaps bare.',
              'To watch composition over time: switch to stacked bars or areas — time axis plus length, a two-channel story.',
              'If pie is mandatory: keep Top 4 plus Others, order clockwise from 12 o’clock by size, largest slice always where the eye lands first.',
            ],
          },
        },
        {
          t: 'p',
          x: {
            zh: '回头看演示器:12 个月直接画饼会有 12 个扇形,设计师替你聚合成季度才敢画。这不是偷懒,是诚实:承认饼图装不下 12 个答案。',
            en: 'Look back at the demo: 12 months would make 12 slices, so the designer aggregated to quarters before daring to draw a pie. Not laziness but honesty: admitting a pie cannot hold 12 answers.',
          },
        },
      ],
    },
    {
      id: 's4',
      title: { zh: '选图决策清单', en: 'Chart-choice checklist' },
      body: [
        {
          t: 'p',
          x: {
            zh: '四个问题配四种图,临门一脚前再过一遍清单。它和前三章的清单叠加使用:感知清单防读错,映射清单防画错,这张清单防答非所问。',
            en: 'Four questions, four charts — run this list before committing. It stacks with the earlier checklists: perception prevents misreading, mapping prevents misdrawing, this one prevents answering the wrong question.',
          },
        },
        {
          t: 'olist',
          x: {
            zh: [
              '问题写成一句话了吗?比较、趋势、构成、关系,动词不清不许动手。',
              '一个视角只回答一个问题了吗?想答两个问题就画两幅图,不要硬塞进一张。',
              '柱状图从 0 开始了吗?饼图类别超 5 了吗?超了就换条形。',
              '换一种图,结论还成立吗?结论只在一种图里成立,多半是图形在撒谎。',
            ],
            en: [
              'Is the question one sentence? Compare, trend, compose, relate — no verb, no chart.',
              'Does one view answer exactly one question? Two questions earn two charts, never one stuffed chart.',
              'Do bars start at zero? Does the pie exceed 5 slices? If so, switch to bars.',
              'Does the conclusion survive a different chart? A conclusion that holds in only one view is usually the graphics lying.',
            ],
          },
        },
      ],
    },
  ],
  quizIds: ['ch4-q1', 'ch4-q2', 'ch4-q3'],
};