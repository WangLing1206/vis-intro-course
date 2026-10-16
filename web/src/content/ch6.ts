import type { Chapter } from './types';

/** 第六章:高维、文本与交互叙事(完整) */
export const CH6: Chapter = {
  id: '6',
  index: 6,
  title: { zh: '高维、文本与交互叙事', en: 'High-Dim, Text & Narrative' },
  intro: {
    zh: '降维的直觉、文本可视化,以及把图表串成故事的交互叙事。',
    en: 'Intuition for dimension reduction, text visualization, and narrative that strings charts into stories.',
  },
  goals: [
    { zh: '理解降维投影的得与失', en: 'Grasp what projection gains and loses' },
    { zh: '为词频数据选择条形而非词云', en: 'Choose bars over word clouds for word frequencies' },
    { zh: '用四步结构讲好一个数据故事', en: 'Tell a data story in four steps' },
    { zh: '用全课程清单交付一幅诚实作品', en: 'Ship one honest piece with the whole-course checklist' },
  ],
  sections: [
    {
      id: 's1',
      title: { zh: '实验:投影的得与失', en: 'Lab: what projection gains and loses' },
      body: [
        {
          t: 'p',
          x: {
            zh: '三个高斯簇各 60 个点,是降维算法的入学考试:好的投影让三簇泾渭分明,坏的投影把它们糊成一团。拖动噪声滑杆,你亲手模拟了投影质量从好到坏的全过程:噪声为 0 时三簇清晰可辨;噪声过半,簇的边界开始溶解;噪声拉满,颜色混成一片,任何关于分组的结论都是猜测。',
            en: 'Three Gaussian clusters of 60 points each are the entrance exam for dimension reduction: a good projection separates them cleanly, a bad one smears them together. Drag the noise slider to replay the full journey from good to bad projection: at zero noise the clusters read cleanly; past half, boundaries dissolve; at full noise the colors merge into soup and any claim about groups is a guess.',
          },
        },
        {
          t: 'p',
          x: {
            zh: '记住两条投影读图铁律:第一,投影图只看相对邻近,不读精确距离,轴上的刻度没有业务含义;第二,任何投影都必须报告方法与失真度,不交代方法就贴一张 t-SNE 散点,等同于第三章里偷偷切换对数轴。观察代码:噪声系数 k 直接决定了点的抖动幅度,失真从不是玄学,是参数。',
            en: 'Two iron rules for reading projections: first, read only relative neighborhood, never exact distances — the axis ticks carry no business meaning; second, every projection must report its method and distortion — pasting a t-SNE scatter with no method stated equals silently switching to a log axis back in Chapter 3. Watch the code: the noise factor k directly sets the jitter amplitude. Distortion is never magic — it is a parameter.',
          },
        },
      ],
      code: {
        lang: 'javascript',
        source: `const k = {{noise}} / 100;  // ← 拖动滑杆:噪声越大,簇的边界越模糊
const jittered = pts.map(([x, y]) => [
  x + (rand() - 0.5) * k * 9,
  y + (rand() - 0.5) * k * 9,
]);`,
      },
      demoId: 'projection-noise',
      params: [
        {
          key: 'noise',
          kind: 'slider',
          label: { zh: '投影噪声', en: 'Noise' },
          min: 0,
          max: 100,
          step: 5,
          default: 20,
        },
      ],
      caption: {
        zh: '噪声为 0 时三簇分明,拉满后混成一片:投影的质量决定了结论的生死。',
        en: 'Zero noise, three clean clusters; full noise, undifferentiated soup: projection quality decides the conclusion.',
      },
    },
    {
      id: 's2',
      title: { zh: '文本可视化:先数数,再谈美', en: 'Text visualization: count first, beauty later' },
      body: [
        {
          t: 'p',
          x: {
            zh: '词云是文本可视化的顶流,也是第二章精度排序的反面典型:它用字号和面积编码词频,而面积恰恰是人眼最不擅长的通道。你能一眼看出最大的词,但第二和第三谁大,基本靠猜。更糟的是布局:为了填满形状,词的位置与顺序毫无含义,长词天然占优,停用词稍不注意就霸占全场。',
            en: 'The word cloud is the celebrity of text visualization — and a textbook villain of Chapter 2’s ranking: it encodes frequency with font size and area, the very channels the eye reads worst. You can spot the biggest word at a glance, but second versus third is a guess. Worse, the layout: to fill a shape, word positions mean nothing, long words win by default, and one forgotten stopword steals the whole show.',
          },
        },
        { t: 'h3', x: { zh: '文本的三级武器', en: 'Three levels of text weaponry' } },
        {
          t: 'olist',
          x: {
            zh: [
              '精确比较词频:用排序条形图,长度通道,去停用词,词干归一,老实但永远正确。',
              '看词与词的关系:用共现网络,第五章的力导向图直接上岗,边表示同现,社群表示话题。',
              '看话题随时间演化:用主题河流或堆叠面积,时间轴加构成,双通道叙事。',
            ],
            en: [
              'To compare frequencies precisely: ranked bars on the length channel, stopwords removed, stems unified — honest and always correct.',
              'To see word relations: a co-occurrence network — Chapter 5’s force layout goes straight to work, edges for co-occurrence, communities for topics.',
              'To watch topics evolve: a theme river or stacked areas — time axis plus composition, a two-channel story.',
            ],
          },
        },
        {
          t: 'p',
          x: {
            zh: '词云并非死刑:当目标只是营造氛围、装饰封面,它依然好用。但只要读者需要读出谁比谁大,请立刻换条形图。判断标准永远是第二章那句话:你在为读者选择一种读数难度。',
            en: 'Word clouds are not dead: for atmosphere and cover decoration they still work. But the moment readers must tell who is bigger than whom, switch to bars immediately. The test is forever Chapter 2’s line: you are choosing a reading difficulty for your audience.',
          },
        },
      ],
    },
    {
      id: 's3',
      title: { zh: '实验:四步讲好一个故事', en: 'Lab: a story in four steps' },
      body: [
        {
          t: 'p',
          x: {
            zh: '10 个点的散点图,分四步讲完:第一步只给原始散点,让读者自己找规律,这是钩子;第二步叠加趋势线,整体向上有了锚点,这是背景;第三步把离群点标红拎出来,它在撒谎吗,还是藏着新发现,这是冲突;第四步收束结论,去掉它趋势依然成立,这是观点。同一张图,四步走完,读者从看到到看懂再到记住。',
            en: 'Ten dots, told in four steps. Step 1 shows only the raw scatter and lets readers find their own pattern — the hook. Step 2 overlays the trend line so the upward drift gains an anchor — the context. Step 3 flags the outlier in red: is it lying, or hiding a discovery — the conflict. Step 4 lands the takeaway: the trend holds without it — the point. One chart, four steps: from seeing to understanding to remembering.',
          },
        },
        {
          t: 'p',
          x: {
            zh: '切换步骤,注意代码如何逐层叠加:散点、趋势线、高亮、结论,每一层都是一行新增,从不删除之前的信息。叙事的诚实就藏在这里:离群点被标红追问,而不是被悄悄删掉。删掉离群点不留痕,和截断坐标轴是同一种不诚实。',
            en: 'Switch steps and watch the code accumulate layer by layer: scatter, trend, highlight, takeaway — each step adds one line and never erases earlier information. Narrative honesty hides right here: the outlier is flagged and interrogated, never silently deleted. Deleting outliers without a trace is the same dishonesty as truncating an axis.',
          },
        },
      ],
      code: {
        lang: 'javascript',
        source: `const layers = {{step}};  // ← 切换叙事步骤
chart.setOption({ series: layers });`,
      },
      demoId: 'story-steps',
      params: [
        {
          key: 'step',
          kind: 'select',
          label: { zh: '叙事步骤', en: 'Story step' },
          default: '1',
          options: [
            { value: '1', label: { zh: '1·钩子:原始散点', en: '1 · Hook: raw scatter' } },
            { value: '2', label: { zh: '2·背景:叠加趋势', en: '2 · Context: add trend' } },
            { value: '3', label: { zh: '3·冲突:揪出离群点', en: '3 · Conflict: flag outlier' } },
            { value: '4', label: { zh: '4·观点:收束结论', en: '4 · Point: takeaway' } },
          ],
          code: {
            '1': '[scatterOf(pts)]                                            // 只给散点:让读者自己找规律',
            '2': '[scatterOf(pts), trendLine()]                               // 叠加趋势:整体向上有了锚点',
            '3': '[scatterOf(main), highlight(outlier)]                       // 揪出离群点:标红追问,而不是删掉',
            '4': '[scatterOf(main), highlight(outlier), takeaway()]           // 收束结论:去掉它,趋势依然成立',
          },
        },
      ],
      caption: {
        zh: '钩子、背景、冲突、观点:同一张散点,四步讲出完整故事。',
        en: 'Hook, context, conflict, point: one scatter plot, a complete story in four steps.',
      },
    },
    {
      id: 's4',
      title: { zh: '结课:从管线到作品', en: 'Finale: from pipeline to portfolio' },
      body: [
        {
          t: 'p',
          x: {
            zh: '回到第一章的管线,现在每一站都有了名字:数据与任务是第四章的一句话问题,数据变换是第三章的比例尺与分箱,视觉映射是第二章的通道排序与配色,视图与交互是第五、六章的关系、时空与叙事。六章读完,你手里有四张清单、一套色板、十一个亲手调过的演示,这就是第一件作品的全部家当。',
            en: 'Back to Chapter 1’s pipeline — every stop now has a name. Data and task is Chapter 4’s one-sentence question; transform is Chapter 3’s scales and bins; mapping is Chapter 2’s channel ranking and palettes; view and interaction are Chapters 5–6’s relations, space-time and narrative. Six chapters later you hold four checklists, one palette and eleven hands-on demos — everything a first portfolio piece needs.',
          },
        },
        { t: 'h3', x: { zh: '作品交付清单', en: 'Ship-it checklist' } },
        {
          t: 'olist',
          x: {
            zh: [
              '诚实吗?基线、比例尺、聚合粒度、离群点、地图分母,五个位置逐一过堂。',
              '清晰吗?一个视角一个问题,通道精度配得上问题的分量,配色没有彩虹。',
              '美观吗?全站同一套色板,同一字号体系,装饰元素全部服务于数据。',
              '可交互吗?至少留一个参数给读者,亲手调过的结论才记得住。',
            ],
            en: [
              'Honest? Baseline, scale, binning, outliers, map denominators — interrogate all five.',
              'Clear? One view, one question; channel precision worthy of the question; no rainbow anywhere.',
              'Beautiful? One palette site-wide, one type scale, every decoration serving the data.',
              'Interactive? Leave readers at least one parameter — conclusions tuned by hand are conclusions remembered.',
            ],
          },
        },
        {
          t: 'p',
          x: {
            zh: '下一步:去 ECharts 官方示例里复刻三幅图,去读一本完整的图鉴,然后带着清单回来,把你自己的数据讲成第一个故事。可视化是手艺,看完不练等于没看。现在,关掉这一页,动手。',
            en: 'Next steps: replicate three charts from the ECharts gallery, read one complete chart atlas, then return with the checklists and turn your own data into a first story. Visualization is a craft — reading without practice is not reading. Now close this page and build.',
          },
        },
      ],
    },
  ],
  quizIds: ['ch6-q1', 'ch6-q2', 'ch6-q3'],
};