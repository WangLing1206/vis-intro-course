/* 《可视化导论》课程内容 · 第 7—12 章（中英双语数据层） */

window.COURSE_B = [

/* ============================ 第 7 章 ============================ */
{
  id: 'highdim',
  zh: {
    title: '高维数据可视化',
    lede: '当属性超过三维，位置通道就不够用了。散点图矩阵、平行坐标与降维投影是三类经典解法。'
  },
  en: {
    title: 'High-Dimensional Data',
    lede: 'Beyond three attributes, position runs out. Scatterplot matrices, parallel coordinates, and dimension reduction are three classic answers.'
  },
  sections: [
    {
      no: '7.1',
      zh: { h: '维度灾难与降维' },
      en: { h: 'The Curse of Dimensionality' },
      blocks: [
        { t: 'p',
          zh: '高维数据有两个困难：一是屏幕只有二维，二是高维空间中距离趋于均匀，邻近关系失去意义。降维把 d 维样本映射到二维或三维，尽可能保留原有结构，代价是信息损失与坐标不可解释。',
          en: 'High-dimensional data poses two difficulties: the screen has only two dimensions, and in high dimensions distances become nearly uniform so neighborhood loses meaning. Dimension reduction maps d-dimensional samples into two or three dimensions while preserving structure as far as possible, at the cost of information loss and uninterpretable axes.' },
        { t: 'ul',
          zh: [
            '线性方法 PCA：找到方差最大的正交方向，坐标可解释，适合线性结构。',
            '非线性方法 t-SNE：把邻域相似度转为概率分布，擅长展示聚类，但全局距离不可信。',
            'UMAP：保留局部与部分全局结构，速度更快，适合十万级样本。',
            '可解释性补充：用载荷矩阵或属性箭头说明每个主成分主要由哪些属性贡献。'
          ],
          en: [
            'Linear PCA: orthogonal directions of maximal variance; axes are interpretable, suited to linear structure.',
            'Non-linear t-SNE: converts neighborhood similarity into probabilities; excellent for clusters, but global distances are unreliable.',
            'UMAP: preserves local and some global structure, faster, scales to hundreds of thousands of samples.',
            'Interpretability aids: use loading matrices or attribute arrows to explain which attributes drive each component.'
          ] }
      ]
    },
    {
      no: '7.2',
      zh: { h: '散点图矩阵' },
      en: { h: 'Scatterplot Matrix' },
      blocks: [
        { t: 'p',
          zh: '散点图矩阵把 p 个属性两两组合，排成 p×p 的网格。它不降维，因此不损失信息，并能暴露两两之间的相关、非线性关系与离群点。缺点是需要 O(p²) 的空间，p 超过十左右就难以在单个屏幕上阅读。',
          en: 'A scatterplot matrix pairs p attributes into a p×p grid. It does not reduce dimensions, so no information is lost, and it reveals pairwise correlation, non-linear relations, and outliers. The cost is O(p²) space: beyond roughly ten attributes it no longer fits one screen.' },
        { t: 'demo',
          demo: 'demos/splom.html',
          capZh: '图 7-1　鸢尾花数据集的散点图矩阵：点击任意单元格可放大观察。',
          capEn: 'Fig 7-1　Scatterplot matrix of the iris dataset: click any cell to enlarge it.' }
      ]
    },
    {
      no: '7.3',
      zh: { h: '平行坐标' },
      en: { h: 'Parallel Coordinates' },
      blocks: [
        { t: 'p',
          zh: '平行坐标把每个属性画成一条平行的竖轴，一条数据记录成为一条贯穿所有轴的折线。它能容纳几十个属性，擅长发现簇、负相关与"交叉模式"。轴的顺序会显著改变图形面貌，通常按相关性聚类或按重要性排序。',
          en: 'Parallel coordinates draw each attribute as a parallel vertical axis, and each record becomes a polyline crossing all axes. It accommodates dozens of attributes and excels at exposing clusters, negative correlation, and crossing patterns. Axis order strongly changes the picture, so axes are usually ordered by correlation clustering or by importance.' },
        { t: 'code',
          demo: 'demos/parallel.html',
          capZh: '图 7-2　带刷选的平行坐标：在任一轴上拖出区间，被过滤的记录在右侧统计中同步更新。',
          capEn: 'Fig 7-2　Parallel coordinates with brushing: drag an interval on any axis, and the summary on the right updates.',
          lang: 'javascript',
          code: `const dims = ["sepalLength", "sepalWidth", "petalLength", "petalWidth"];

const y = {};
dims.forEach(k => {
  y[k] = d3.scaleLinear()
    .domain(d3.extent(data, d => +d[k])).nice()
    .range([h, 0]);
});
const x = d3.scalePoint().domain(dims).range([0, w]);

// 每条记录一条折线，拖动轴刷选即可过滤
const line = d3.line().defined(d => d[1] != null);
svg.append("g").selectAll("path")
  .data(data)
  .join("path")
  .attr("fill", "none")
  .attr("stroke", d => color(d.species))
  .attr("stroke-opacity", 0.4)
  .attr("d", d => line(dims.map(k => [x(k), y[k](+d[k])])))
  .on("mouseover", function () { d3.select(this).attr("stroke-opacity", 1).raise(); })
  .on("mouseout",  function () { d3.select(this).attr("stroke-opacity", 0.4); });` }
      ]
    },
    {
      no: '7.4',
      zh: { h: '径向布局与雷达图' },
      en: { h: 'Radial Layouts and Radar Charts' },
      blocks: [
        { t: 'p',
          zh: '把各属性轴排成一个圆，就得到星形坐标与雷达图。它们节省空间、适合展示单个对象的多指标画像，但半径方向的比较精度低于直角坐标，且面积会随属性顺序变化。适合"对比少数对象的整体轮廓"，不适合精确读数。',
          en: 'Arranging attribute axes around a circle yields star coordinates and radar charts. They save space and suit multi-indicator profiles of a few objects, but radial comparison is less accurate than along a straight axis and the enclosed area changes with axis order. Use them to compare overall shapes of a few objects, not for precise reading.' }
      ]
    }
  ]
},

/* ============================ 第 8 章 ============================ */
{
  id: 'spacetime',
  zh: {
    title: '时空数据可视化',
    lede: '时间是单向的、空间是二维的。本章讨论时间线、分级统计图、热力图与轨迹的表达方法。'
  },
  en: {
    title: 'Spatio-Temporal Data',
    lede: 'Time is one-directional and space is two-dimensional: timelines, choropleths, heatmaps, and trajectories.'
  },
  sections: [
    {
      no: '8.1',
      zh: { h: '时间可视化' },
      en: { h: 'Visualizing Time' },
      blocks: [
        { t: 'p',
          zh: '时间属性通常映射到水平位置，因为读者习惯从左到右阅读。折线图适合单序列趋势，堆叠面积图与河流图（streamgraph）适合多序列的构成变化，日历图适合展示以天为单位的周期模式。',
          en: 'Time is usually mapped to horizontal position because readers scan left to right. Line charts suit a single trend; stacked area charts and streamgraphs suit composition change across series; calendar views suit day-level periodic patterns.' },
        { t: 'code',
          demo: 'demos/stream.html',
          capZh: '图 8-1　河流图：点击图例切换序列，观察各层厚度随时间的消长。',
          capEn: 'Fig 8-1　Streamgraph: toggle series from the legend and watch layer thickness evolve.',
          lang: 'javascript',
          code: `const stack = d3.stack()
  .keys(keys)
  .offset(d3.stackOffsetWiggle)   // 河流图：以中心线对称，减少基线偏差
  .order(d3.stackOrderInsideOut)
  .value((d, k) => d[k]);

const series = stack(data);
const x = d3.scaleTime().domain(d3.extent(data, d => d.date)).range([0, w]);
const y = d3.scaleLinear()
  .domain([d3.min(series, s => d3.min(s, d => d[0])),
           d3.max(series, s => d3.max(s, d => d[1]))])
  .range([h, 0]);

const area = d3.area()
  .x(d => x(d.data.date))
  .y0(d => y(d[0]))
  .y1(d => y(d[1]))
  .curve(d3.curveBasis);

svg.selectAll("path").data(series).join("path")
  .attr("d", area)
  .attr("fill", d => color(d.key));` }
      ]
    },
    {
      no: '8.2',
      zh: { h: '空间可视化' },
      en: { h: 'Visualizing Space' },
      blocks: [
        { t: 'p',
          zh: '空间数据最常见的表达是分级统计图（choropleth）：把区域按数值填充颜色。它受"面积偏见"影响——大面积区域会吸引更多注意，即使数值很小。另一个常见问题是地理单元的划分方式会改变结论，即可塑性面积单元问题（MAUP）。',
          en: 'The most common spatial representation is the choropleth, filling regions by value with color. It suffers from area bias: large regions attract attention even when their values are small. Another issue is that the way geographic units are divided can change conclusions, known as the modifiable areal unit problem, MAUP.' },
        { t: 'demo',
          demo: 'demos/heatmap.html',
          capZh: '图 8-2　日历热力图：以天为单元展示全年数值，鼠标悬停查看当日详情。',
          capEn: 'Fig 8-2　Calendar heatmap: one cell per day across a year; hover to read the daily value.' }
      ]
    },
    {
      no: '8.3',
      zh: { h: '时空轨迹与流向' },
      en: { h: 'Trajectories and Flows' },
      blocks: [
        { t: 'p',
          zh: '当每个对象既有时间也有位置时，可把轨迹画成路径，用颜色或线宽编码速度、高度等第三变量。大量轨迹叠加会造成遮挡，常用手段是密度聚合（把空间网格化后统计流量）或边绑定（把走向相近的曲线聚拢成主干）。',
          en: 'When each object has both time and position, draw trajectories as paths, encoding a third variable such as speed or altitude by color or width. Many overlapping trajectories cause clutter; common remedies are density aggregation, binning space into a grid and counting flow, and edge bundling, which pulls curves of similar direction into trunks.' },
        { t: 'ul',
          zh: [
            '少量轨迹：直接绘制，配合时间滑块播放。',
            '大量轨迹：空间分箱后的流向图或 OD 矩阵。',
            '强调变化：用小倍数地图分时段对比，而不是把时间压缩进单一视图。'
          ],
          en: [
            'Few trajectories: draw directly, with a time slider for playback.',
            'Many trajectories: flow maps or origin-destination matrices after spatial binning.',
            'Emphasizing change: small-multiple maps by period rather than compressing time into one view.'
          ] }
      ]
    }
  ]
},

/* ============================ 第 9 章 ============================ */
{
  id: 'text',
  zh: {
    title: '文本与文档可视化',
    lede: '文本不是数值，但可以统计。从词频到主题模型，把非结构化内容转成可视结构。'
  },
  en: {
    title: 'Text and Document Visualization',
    lede: 'Text is not numeric, but it can be counted: from word frequencies to topics, turning unstructured content into visual structure.'
  },
  sections: [
    {
      no: '9.1',
      zh: { h: '文本可视化的流程' },
      en: { h: 'The Text Visualization Pipeline' },
      blocks: [
        { t: 'p',
          zh: '文本可视化通常经过三步：先把文本切分为词或句子并统计（词频、TF-IDF、情感分值），再抽取结构（关键词、主题、实体与关系），最后选择合适的视觉形式呈现。每一步都会引入假设，例如停用词表的选择会直接改变高频词的结果。',
          en: 'Text visualization usually runs in three steps: split text into words or sentences and count them, frequencies, TF-IDF, sentiment scores; extract structure, keywords, topics, entities and relations; then choose a suitable visual form. Every step introduces assumptions; the choice of a stop-word list, for instance, directly changes the top-frequency words.' },
        { t: 'ul',
          zh: [
            '词频统计：最简单也最常用，反映"说了多少"。',
            'TF-IDF：抑制在所有文档中都常见的词，突出某篇文档的特有词。',
            '主题模型：把文档表示为若干主题的混合，适合大规模语料。',
            '情感与实体：为后续的情感曲线与关系网络提供属性。'
          ],
          en: [
            'Word frequency: the simplest and most common, reflecting how much was said.',
            'TF-IDF: suppresses words common across all documents and highlights words specific to one.',
            'Topic modeling: represents documents as mixtures of topics, suited to large corpora.',
            'Sentiment and entities: supply attributes for later sentiment curves and relation networks.'
          ] }
      ]
    },
    {
      no: '9.2',
      zh: { h: '词云及其局限' },
      en: { h: 'Word Clouds and Their Limits' },
      blocks: [
        { t: 'p',
          zh: '词云用字号编码词频，制作简单、易于传播，但可比较性差：长词占面积更大，读者难以精确比较两个词的频率，也无法读出绝对数值。改进方式包括固定排序的词频条形图、保留位置信息的文本弧，或与时间序列结合的主题河流图。',
          en: 'Word clouds encode frequency by font size: easy to build and to share, but weak for comparison, since longer words occupy more area, precise comparison between two words is hard, and absolute values cannot be read. Improvements include frequency bar charts with fixed ordering, word trees or text arcs that keep positional information, and topic rivers over time.' },
        { t: 'demo',
          demo: 'demos/wordcloud.html',
          capZh: '图 9-1　词云与词频条形图对照：切换视图，比较两者在"第二高频词是哪个"上的判断效率。',
          capEn: 'Fig 9-1　Word cloud versus frequency bars: switch views and compare how efficiently you can find the second most frequent word.' }
      ]
    },
    {
      no: '9.3',
      zh: { h: '文档可视化' },
      en: { h: 'Document Visualization' },
      blocks: [
        { t: 'p',
          zh: '单篇文档的可视化强调结构：文档卡片用缩略布局展示长文的整体轮廓，文本弧把重复出现的短语按位置连成弧线以揭示叙述节奏。多篇文档的可视化强调关系：把文档投影为散点，距离代表相似度，配合关键词标签即可快速浏览语料全貌。',
          en: 'Visualizing a single document emphasizes structure: document cards show the outline of a long text in miniature, and text arcs connect repeated phrases by position to reveal narrative rhythm. Visualizing many documents emphasizes relations: project documents as points where distance means similarity, and label them with keywords to browse a corpus at a glance.' }
      ]
    }
  ]
},

/* ============================ 第 10 章 ============================ */
{
  id: 'interaction',
  zh: {
    title: '可视化交互',
    lede: '交互让静态图形变成分析工具。本章介绍交互的分类、常见模式与实现要点。'
  },
  en: {
    title: 'Visualization Interaction',
    lede: 'Interaction turns a static picture into an analysis tool: taxonomies, common patterns, and implementation notes.'
  },
  sections: [
    {
      no: '10.1',
      zh: { h: '交互的分类' },
      en: { h: 'A Taxonomy of Interaction' },
      blocks: [
        { t: 'p',
          zh: '交互可归纳为七类：选择（高亮感兴趣的对象）、探索（缩放平移以查看不同位置）、重配（改变视图布局）、编码切换（换一种图形表达）、抽象与具象切换（概览与细节）、过滤（按条件剔除数据）与联动（多个视图共享选择）。一个成熟的系统往往同时提供其中若干类。',
          en: 'Interaction falls into seven classes: select, explore by zoom and pan, reconfigure the layout, encode differently, abstract and elaborate between overview and detail, filter by conditions, and link selections across views. A mature system usually offers several of them at once.' },
        { t: 'ul',
          zh: [
            '选择：点选、框选、套索，是所有后续操作的基础。',
            '过滤：条件过滤与范围刷选，用于缩小关注范围。',
            '联动：一处选择，多处响应，是多视图分析的核心。',
            '重配与编码切换：让用户自己决定用哪种图形看数据。'
          ],
          en: [
            'Select: click, rectangle, and lasso; the basis of every later operation.',
            'Filter: conditional filtering and range brushing to narrow the focus.',
            'Link: one selection, many views responding; the core of multi-view analysis.',
            'Reconfigure and re-encode: let users decide which graphic to look through.'
          ] }
      ]
    },
    {
      no: '10.2',
      zh: { h: '概览优先与焦点上下文' },
      en: { h: 'Overview First, Focus + Context' },
      blocks: [
        { t: 'p',
          zh: 'Shneiderman 提出的信息检索金律：先给概览，再允许缩放与过滤，最后按需提供细节。焦点上下文技术在此基础上更进一步：在同一视图里同时呈现放大的焦点与压缩的上下文，如鱼眼透镜与双曲树，避免用户在多个视图间来回切换。',
          en: 'Shneiderman information-seeking mantra: overview first, zoom and filter, then details on demand. Focus-plus-context goes further by showing an enlarged focus and a compressed context in the same view, as in fisheye lenses and hyperbolic trees, so users need not jump between views.' },
        { t: 'quote',
          zh: '好的交互不是功能越多越好，而是让每一次点击都缩短"提问到答案"的距离。',
          en: 'Good interaction is not about more features but about shortening the distance from question to answer with every click.' }
      ]
    },
    {
      no: '10.3',
      zh: { h: '刷选与联动的实现' },
      en: { h: 'Implementing Brushing and Linking' },
      blocks: [
        { t: 'p',
          zh: '多视图联动的关键是把"选择集"提升为共享状态：任一视图产生的选择写入状态，其他视图订阅状态并重绘。D3 的 brush 组件给出像素范围，需要用标度的 invert 方法换算回数据域，再过滤数据。',
          en: 'The key to multi-view linking is to promote the selection set to shared state: any view writes its selection into the state, and other views subscribe and redraw. D3 brush yields pixel ranges, which must be converted back to the data domain with scale.invert before filtering.' },
        { t: 'code',
          demo: 'demos/brushlink.html',
          capZh: '图 10-1　刷选联动：在散点图中框选，条形图、直方图与数据表同步更新。',
          capEn: 'Fig 10-1　Brushing and linking: select in the scatter plot, and the bar chart, histogram, and table update together.',
          lang: 'javascript',
          code: `let selected = new Set();          // 共享状态：所有视图都从这里读

function onBrush({ selection }) {
  if (!selection) { selected = new Set(data.map(d => d.id)); }
  else {
    const [[x0, y0], [x1, y1]] = selection;
    selected = new Set(
      data.filter(d => {
        const px = x(d.income), py = y(d.score);
        return px >= x0 && px <= x1 && py >= y0 && py <= y1;
      }).map(d => d.id)
    );
  }
  renderBars(); renderHistogram(); renderTable();   // 订阅方统一重绘
}

const brush = d3.brush().extent([[0, 0], [w, h]]).on("brush end", onBrush);
svg.append("g").call(brush);` }
      ]
    },
    {
      no: '10.4',
      zh: { h: '动画与过渡' },
      en: { h: 'Animation and Transition' },
      blocks: [
        { t: 'p',
          zh: '动画的价值在于保持"对象连贯性"：当数据在两个状态间变化时，让同一个图形元素平滑移动，读者就能追踪它的去向。过渡时间一般控制在 300 到 800 毫秒；过长会拖慢分析，过短则无法察觉。避免为了装饰而动画。',
          en: 'The value of animation is object constancy: when data changes between two states, letting the same graphical element move smoothly lets readers follow where it went. Keep transitions between 300 and 800 milliseconds; longer slows analysis, shorter goes unnoticed. Never animate merely for decoration.' }
      ]
    }
  ]
},

/* ============================ 第 11 章 ============================ */
{
  id: 'evaluation',
  zh: {
    title: '可视化评估',
    lede: '如何判断一张图或一个系统是否真的有用：定量实验、定性研究与一份可执行的检查清单。'
  },
  en: {
    title: 'Evaluating Visualization',
    lede: 'How to judge whether a chart or a system really works: controlled experiments, qualitative studies, and a practical checklist.'
  },
  sections: [
    {
      no: '11.1',
      zh: { h: '为什么要评估' },
      en: { h: 'Why Evaluate' },
      blocks: [
        { t: 'p',
          zh: '可视化是为人而做的工具，效果不能只凭作者的主观感受。评估回答三个问题：用户能否完成任务、完成任务需要多久、以及用户是否形成了正确的理解。三者缺一，都不能称为有效。',
          en: 'Visualization is a tool for people, so its effect cannot rest on the author subjective feeling. Evaluation answers three questions: can users complete the task, how long does it take, and do they form a correct understanding. Missing any one of them, the design cannot be called effective.' }
      ]
    },
    {
      no: '11.2',
      zh: { h: '定量评估' },
      en: { h: 'Quantitative Evaluation' },
      blocks: [
        { t: 'p',
          zh: '受控实验比较两种设计方案在同一组任务上的表现。常用指标是正确率与完成时间，必要时记录眼动轨迹与点击次数。实验设计需注意任务难度分层、被试随机分配与顺序平衡，否则学习效应会污染结果。',
          en: 'A controlled experiment compares two designs on the same task set. Common metrics are accuracy and completion time, sometimes with eye-tracking and click counts. Design must stratify task difficulty, assign participants randomly, and counterbalance order, otherwise learning effects contaminate results.' },
        { t: 'ul',
          zh: [
            '正确率：任务答案是否正确，衡量理解是否成立。',
            '完成时间：从提问到作答的耗时，衡量检索效率。',
            '置信度与主观量表：NASA-TLX 等量表衡量认知负荷。',
            '统计检验：样本量、效应量与显著性缺一不可。'
          ],
          en: [
            'Accuracy: whether the answer is correct, measuring whether understanding was reached.',
            'Completion time: from question to answer, measuring retrieval efficiency.',
            'Confidence and subjective scales: instruments like NASA-TLX measure cognitive load.',
            'Statistical testing: sample size, effect size, and significance are all required.'
          ] }
      ]
    },
    {
      no: '11.3',
      zh: { h: '定性评估' },
      en: { h: 'Qualitative Evaluation' },
      blocks: [
        { t: 'p',
          zh: '定量方法擅长比较优劣，定性方法擅长解释原因。启发式评估由若干专家按既定准则（如是否支持概览、是否可撤销操作）逐项检查；可用性测试让真实用户边操作边出声思考；案例研究则在真实业务中观察系统如何被长期使用。',
          en: 'Quantitative methods compare alternatives; qualitative methods explain why. Heuristic evaluation has experts check against established criteria such as overview support and undo; usability testing asks real users to think aloud while operating; case studies observe long-term use in real settings.' }
      ]
    },
    {
      no: '11.4',
      zh: { h: '一份检查清单' },
      en: { h: 'A Practical Checklist' },
      blocks: [
        { t: 'ul',
          zh: [
            '数据到图形：每个属性是否都有明确且合适的通道？是否误把类别当成数值排序？',
            '标度与坐标：数值轴是否从零开始？单位与量纲是否标注清楚？',
            '颜色：是否使用了与数据性质匹配的配色？是否为色觉障碍留出替代方案？',
            '交互：是否支持概览、过滤与细节按需？操作是否可逆？',
            '可读性：文字是否直接标注在图旁？图例是否必要？缩写是否被解释？',
            '诚实性：是否存在截断轴、面积失真或选择性呈现数据？'
          ],
          en: [
            'Data to graphics: does every attribute have an explicit, suitable channel? Are nominal values mistakenly ordered?',
            'Scales and axes: do numeric axes start at zero? Are units and magnitudes labeled?',
            'Color: does the palette match the data type? Is there an alternative for color-deficient viewers?',
            'Interaction: are overview, filtering, and details-on-demand supported? Are actions reversible?',
            'Readability: are labels placed next to marks? Are legends necessary? Are abbreviations explained?',
            'Honesty: any truncated axes, distorted areas, or selective presentation of data?'
          ] }
      ]
    }
  ]
},

/* ============================ 第 12 章 ============================ */
{
  id: 'project',
  zh: {
    title: '综合实践：构建一个交互仪表盘',
    lede: '把前十一章的知识串成一条线：任务抽象、数据处理、编码选择、多视图联动与评估。'
  },
  en: {
    title: 'Capstone: Building an Interactive Dashboard',
    lede: 'Tying the first eleven chapters together: task abstraction, data processing, encoding, multi-view linking, and evaluation.'
  },
  sections: [
    {
      no: '12.1',
      zh: { h: '从问题到设计' },
      en: { h: 'From Question to Design' },
      blocks: [
        { t: 'p',
          zh: 'Munzner 的分析框架把设计分成四层：先明确领域问题与目标用户（why），再把问题抽象为数据与任务（what），然后设计编码与交互（how），最后实现并评估。跳过前两层直接画图，是可视化项目失败最常见的原因。',
          en: 'Munzner framework divides design into four layers: clarify the domain problem and target users, why; abstract the problem into data and tasks, what; design encoding and interaction, how; then implement and evaluate. Skipping the first two layers and drawing directly is the most common cause of failed visualization projects.' },
        { t: 'ul',
          zh: [
            '领域问题：谁在什么场景下要回答什么问题？',
            '数据抽象：有哪些属性，分别是什么类型，规模多大？',
            '任务抽象：是查找、比较、还是探索关系与分布？',
            '编码与交互：对应选择图表类型与交互模式。'
          ],
          en: [
            'Domain problem: who needs to answer what, in which situation?',
            'Data abstraction: which attributes exist, of what type, at what scale?',
            'Task abstraction: lookup, comparison, or exploring relations and distributions?',
            'Encoding and interaction: choose chart types and interaction patterns accordingly.'
          ] }
      ]
    },
    {
      no: '12.2',
      zh: { h: '数据流与模块划分' },
      en: { h: 'Data Flow and Modules' },
      blocks: [
        { t: 'p',
          zh: '工程上把仪表盘拆为四块：数据模块负责加载与清洗，状态模块保存当前选择与过滤条件，视图模块各自负责一种图形，调度模块在状态变化时触发重绘。模块之间通过单向数据流通信，避免出现"改了一处、别处不知道"的隐性耦合。',
          en: 'In practice a dashboard splits into four parts: a data module for loading and cleaning, a state module holding current selection and filters, view modules each responsible for one chart, and a scheduler that redraws on state change. Modules communicate through one-directional data flow to avoid hidden coupling where one change goes unnoticed elsewhere.' }
      ]
    },
    {
      no: '12.3',
      zh: { h: '一个完整示例' },
      en: { h: 'A Complete Example' },
      blocks: [
        { t: 'p',
          zh: '下面的示例把散点图、条形图与直方图组合为一个联动仪表盘：在散点图中框选后，其余视图同步响应，顶部显示当前选择的数量与均值。它覆盖了数据绑定、标度、刷选、过渡与状态共享五个要点。',
          en: 'The example below combines a scatter plot, a bar chart, and a histogram into one linked dashboard: brushing in the scatter plot updates the other views, while the header shows the count and mean of the current selection. It covers data joins, scales, brushing, transitions, and shared state.' },
        { t: 'code',
          demo: 'demos/dashboard.html',
          capZh: '图 12-1　综合仪表盘：框选、图例过滤、悬停高亮与统计联动。',
          capEn: 'Fig 12-1　The dashboard: brushing, legend filtering, hover highlight, and linked statistics.',
          lang: 'javascript',
          code: `const state = { ids: new Set(data.map(d => d.id)), category: "all" };

function current() {
  return data.filter(d => state.ids.has(d.id) &&
    (state.category === "all" || d.category === state.category));
}

function render() {
  const rows = current();
  d3.select("#count").text(rows.length);
  d3.select("#mean").text(d3.mean(rows, d => d.score).toFixed(2));

  scatter(rows);      // 位置编码：两个定量属性
  bars(rows);         // 长度编码：分类汇总
  histogram(rows);    // 分箱聚合：分布形态
}

d3.selectAll(".legend-item").on("click", (e, d) => {
  state.category = d;
  render();
});` }
      ]
    },
    {
      no: '12.4',
      zh: { h: '评价标准与练习建议' },
      en: { h: 'Rubric and Practice Advice' },
      blocks: [
        { t: 'p',
          zh: '一份完整的课程实践应从四个维度评价：内容正确性（编码与数据性质匹配）、交互完整性（概览、过滤、细节按需）、表达清晰度（标注、图例与配色克制）与工程质量（代码结构、性能与可复现性）。建议从一个小规模数据集做起，先完成单视图，再逐步增加联动与动画。',
          en: 'A complete course project is judged on four dimensions: correctness of encoding against data types, completeness of interaction including overview, filter, and details-on-demand, clarity of presentation with restrained labels and colors, and engineering quality of structure, performance, and reproducibility. Start from a small dataset, finish one view first, then add linking and animation step by step.' },
        { t: 'quote',
          zh: '先让它正确，再让它清晰，最后才让它漂亮。',
          en: 'Make it correct, then make it clear, and only then make it beautiful.' }
      ]
    }
  ]
}

];
