import type { Chapter } from './types';

/** 第二章:视觉感知与编码(完整) */
export const CH2: Chapter = {
  id: '2',
  index: 2,
  title: { zh: '视觉感知与编码', en: 'Perception & Encoding' },
  intro: {
    zh: '人眼如何读图:视觉通道的精度排序、颜色的正确用法、常见的感知陷阱。',
    en: 'How eyes read charts: the ranking of visual channels, proper use of color, common perceptual traps.',
  },
  goals: [
    { zh: '按表达精度给视觉通道排序', en: 'Rank visual channels by encoding precision' },
    { zh: '亲手对比四种编码的读数难度', en: 'Feel the reading difficulty of four encodings hands-on' },
    { zh: '为分类/顺序数据选对配色', en: 'Pick the right palette for categorical/sequential data' },
    { zh: '识别截断轴、面积误导与彩虹陷阱', en: 'Spot truncated axes, area distortion and rainbow traps' },
  ],
  sections: [
    {
      id: 's1',
      title: { zh: '人眼是一台有偏好的仪器', en: 'The eye is a biased instrument' },
      body: [
        {
          t: 'p',
          x: {
            zh: '可视化的本质是把数字翻译成人眼擅长的语言。但人眼并不公正:它对位置极其敏感,对面积和角度却相当迟钝。克利夫兰与麦吉尔在 1984 年用实验证明了这一点:让人判断两数比例,用点的位置判断最准,用气泡面积判断误差最大——这直接决定了我们该用什么图。',
            en: 'Visualization translates numbers into a language the eye reads well. But the eye is unfair: exquisitely sensitive to position, embarrassingly bad at area and angle. Cleveland and McGill proved this experimentally in 1984 — judging ratios by dot position is most accurate, by bubble area the worst. That single result dictates much of chart choice.',
          },
        },
        { t: 'h3', x: { zh: '定量数据的通道精度排序', en: 'Channel ranking for quantitative data' } },
        {
          t: 'olist',
          x: {
            zh: [
              '位置:点在线上的位置,读数最准,散点图、点图都靠它吃饭。',
              '长度:从共同基线出发的柱高,柱状图经久不衰的原因。',
              '角度与面积:饼图扇形、气泡大小,只能看个大概,不适合精确比较。',
              '颜色深浅与色相:适合看趋势与分类,不适合读具体数值。',
            ],
            en: [
              'Position: a dot’s place on a line — the most accurate reading; scatter and dot plots live on it.',
              'Length: bar height from a common baseline — why bar charts never die.',
              'Angle and area: pie slices, bubble sizes — fine for rough impressions, poor for precise comparison.',
              'Color lightness and hue: good for trends and categories, bad for reading exact values.',
            ],
          },
        },
        {
          t: 'p',
          x: {
            zh: '排序不是教条,而是起点:当你想强调精确比较,就往前选通道;当你只想传达氛围与构成,后排通道也够用。下一节用同一组数据亲手验证——你会发现,不用任何人讲解,你的眼睛自己就能排出这个顺序。',
            en: 'This ranking is a starting point, not dogma: reach for the front of the list when precision matters, and the back is fine for mood and composition. Verify it yourself in the next section with one dataset — your eyes will reproduce this ranking with no coaching at all.',
          },
        },
      ],
    },
    {
      id: 's2',
      title: { zh: '实验:同一数据,四种编码', en: 'Lab: one dataset, four encodings' },
      body: [
        {
          t: 'p',
          x: {
            zh: '同一组数 [12, 28, 45, 70, 96],分别用点位置、柱长度、气泡面积、饼图角度画出来。请先不看数值,凭感觉判断 E 是 A 的几倍,再切换编码重复一次:位置和长度下你几乎脱口而出,面积和角度下你开始犹豫——犹豫本身,就是这一节的结论。',
            en: 'The same five numbers [12, 28, 45, 70, 96], drawn as dot position, bar length, bubble area and pie angle. Without peeking at the values, guess how many times larger E is than A, then switch encodings and repeat: with position and length the answer jumps out; with area and angle you hesitate — and that hesitation is the entire point of this section.',
          },
        },
        {
          t: 'p',
          x: {
            zh: '下面的代码同样随参数联动:注意 type 那一行,四种编码只差一个类型名,读数难度却天差地别。选图,本质上就是在为读者选择一种读数难度。',
            en: 'The code below is linked to the parameter too: only the type line changes across four encodings, yet reading difficulty differs enormously. Choosing a chart is, at bottom, choosing a reading difficulty for your audience.',
          },
        },
      ],
      code: {
        lang: 'javascript',
        source: `// 节选示意:同一数据,四种编码只差一个类型名
const data = [12, 28, 45, 70, 96]; // A B C D E
const option = {
  series: [{
    type: {{encoding}},  // ← 切换编码
    data: data,
  }],
};
chart.setOption(option);`,
      },
      demoId: 'encoding-channels',
      params: [
        {
          key: 'encoding',
          kind: 'select',
          label: { zh: '视觉编码', en: 'Encoding' },
          default: 'position',
          options: [
            { value: 'position', label: { zh: '位置·点图(最准)', en: 'Position · dots (best)' } },
            { value: 'length', label: { zh: '长度·柱状图', en: 'Length · bars' } },
            { value: 'area', label: { zh: '面积·气泡图', en: 'Area · bubbles' } },
            { value: 'angle', label: { zh: '角度·饼图(最难读数)', en: 'Angle · pie (hardest)' } },
          ],
          code: {
            position: `'scatter'  // 位置编码:读数最准`,
            length: `'bar'      // 长度编码:柱高正比于数值`,
            area: `'scatter'  // 面积编码:symbolSize 映射数值,读数吃力`,
            angle: `'pie'      // 角度编码:只适合看构成,不适合比大小`,
          },
        },
      ],
      caption: {
        zh: '同一组数,四种编码:E 是 A 的 8 倍,哪种一眼能看出来,哪种不能?',
        en: 'Same numbers, four encodings: E is 8x A — which encoding shows it at a glance, which hides it?',
      },
    },
    {
      id: 's3',
      title: { zh: '给数据穿对颜色', en: 'Dressing data in the right colors' },
      body: [
        {
          t: 'p',
          x: {
            zh: '颜色有两大家族,不可混用:分类色用于区分“哪一类”,要求色相差异大、明度接近,谁也不抢谁的戏;顺序色用于表达“有多少”,要求同一色相、明度渐变,越深越大。本站的六色色板属于前者,热力图常用的蓝渐变属于后者。最糟的选择是彩虹色:色相跨度大、明度上蹿下跳,黄色在绿色和红色之间凭空制造出根本不存在的边界。',
            en: 'Color has two families that must not mix: categorical palettes distinguish “which group” — distinct hues, similar lightness, no color shouting over others; sequential palettes express “how much” — one hue ramping in lightness, darker means larger. This site’s six-color palette is categorical; the blue ramp in heatmaps is sequential. The worst choice is the rainbow: huge hue span with jumping lightness, where yellow fabricates boundaries between green and red that do not exist in the data.',
          },
        },
        {
          t: 'p',
          x: {
            zh: '切换下方配色,观察同一组柱状图:本站色板下六类清晰可辨;彩虹色下黄色柱子莫名显眼,明明数值最小的周三反而最抓眼球;单色下分类彻底消失。code 中的 color 数组同步变化——配色不是装饰,是编码。',
            en: 'Switch palettes below on the same bars: with this site’s palette all six categories read cleanly; with the rainbow the yellow bar screams for attention even though Wednesday is the smallest value; with a single color the categories vanish entirely. The color array in the code changes in sync — palette is not decoration, it is encoding.',
          },
        },
      ],
      code: {
        lang: 'javascript',
        source: `const option = {
  color: {{scheme}},  // ← 切换配色
  series: [{ type: 'bar', data: [42, 58, 35, 72, 64, 81] }],
};
chart.setOption(option);`,
      },
      demoId: 'palette-compare',
      params: [
        {
          key: 'scheme',
          kind: 'select',
          label: { zh: '配色方案', en: 'Palette' },
          default: 'site',
          options: [
            { value: 'site', label: { zh: '本站六色·分类(推荐)', en: 'Site palette (recommended)' } },
            { value: 'rainbow', label: { zh: '彩虹色(反面教材)', en: 'Rainbow (anti-pattern)' } },
            { value: 'mono', label: { zh: '单色(无法区分)', en: 'Single color (no groups)' } },
          ],
          code: {
            site: `['#2F6BFF', '#00A38D', ...]  // 分类色:色相分明,明度接近`,
            rainbow: `['#E41A1C', '#FF7F00', ...]  // 彩虹:明度跳变,制造假边界`,
            mono: `'#2F6BFF'  // 单色:分类信息完全丢失`,
          },
        },
      ],
      caption: {
        zh: '同一组数据:分类色清晰,彩虹色误导,单色丢失信息。',
        en: 'Same data: categorical reads clean, rainbow misleads, mono loses the groups.',
      },
    },
    {
      id: 's4',
      title: { zh: '感知陷阱自查清单', en: 'Perceptual trap checklist' },
      body: [
        {
          t: 'p',
          x: {
            zh: '学完编码,得到一张终身可用的自查清单。下次画图或读图前花十秒钟过一遍,能躲开八成以上的可视化事故——包括第一章那个截断坐标轴的例子,它本质上也是感知陷阱:人眼默认柱子从共同基线开始。',
            en: 'You have earned a checklist for life. Ten seconds per chart, before drawing or reading, dodges most visualization accidents — including Chapter 1’s truncated axis, which is a perceptual trap at heart: the eye assumes bars start from a common baseline.',
          },
        },
        {
          t: 'olist',
          x: {
            zh: [
              '柱子从 0 开始了吗?没有共同基线,长度比较全部作废。',
              '面积代表数值吗?如果是,读者会系统性低估大值,考虑换长度。',
              '颜色跨了几个色相?分类用多色相、顺序用单色相渐变,彩虹一律重做。',
              '3D、阴影、纹理装饰删了吗?它们扭曲长度与面积,除了好看一无是处。',
              '色盲读者能读吗?红绿对比是重灾区,用蓝橙替代,或加上形状/文字双通道。',
            ],
            en: [
              'Do the bars start at zero? Without a common baseline, every length comparison is void.',
              'Does area encode value? If so, readers systematically underestimate large values — consider length instead.',
              'How many hues? Multiple hues for categories, one-hue ramps for sequences; rainbow always gets redone.',
              'Are 3D, shadows and textures removed? They distort length and area and add nothing but prettiness.',
              'Can color-blind readers follow? Red-green is the danger zone — use blue-orange, or add shape/text as a second channel.',
            ],
          },
        },
      ],
    },
  ],
  quizIds: ['ch2-q1', 'ch2-q2', 'ch2-q3'],
};