/* 《可视化导论》课程内容 · 第 1—6 章（中英双语数据层）
   块类型：p 段落 / ul 列表 / quote 引言 / code 代码块+运行效果 */

window.COURSE_A = [

/* ============================ 第 1 章 ============================ */
{
  id: 'intro',
  zh: {
    title: '可视化导论',
    lede: '从数据到洞察：理解可视化的定义、价值与标准流程，建立整门课程的知识坐标系。'
  },
  en: {
    title: 'Introduction to Visualization',
    lede: 'From data to insight: the definition, value, and standard pipeline that frame the whole course.'
  },
  sections: [
    {
      no: '1.1',
      zh: { h: '什么是数据可视化' },
      en: { h: 'What Is Data Visualization' },
      blocks: [
        { t: 'p',
          zh: '数据可视化把抽象的数据映射为可感知的图形符号，借助人类视觉系统的高带宽通道，把数据中隐藏的模式、趋势与异常直接呈现出来。它既是一门关于"如何准确表达"的设计学科，也是一套关于"如何高效计算与绘制"的技术体系。',
          en: 'Data visualization maps abstract data onto perceivable graphical symbols. By exploiting the high bandwidth of the human visual system, it exposes patterns, trends, and anomalies that remain hidden in tables. It is at once a design discipline about expressing data faithfully and a technical discipline about computing and rendering efficiently.' },
        { t: 'p',
          zh: '从形式上看，可视化由三个要素构成：数据、可视化形式与交互。数据是原材料，可视化形式是编码规则，交互决定使用者能否主动探索而不是被动接受。缺少交互的可视化只是一张静态图片，缺少编码规则的可视化只是一堆无意义的图形。',
          en: 'Formally, visualization consists of three elements: data, visual form, and interaction. Data is the raw material; visual form is the encoding rule; interaction decides whether the user can explore actively instead of receiving passively. A visualization without interaction is only a static picture; one without encoding rules is only a pile of meaningless shapes.' },
        { t: 'ul',
          zh: [
            '科学计算可视化：面向科学模拟与观测产生的空间数据，强调体数据的真实感绘制。',
            '信息可视化：面向抽象的、非空间的数据，强调结构、关系与演化的表达。',
            '可视分析学：把可视化与自动分析方法结合，形成"机器计算 + 人类判断"的分析闭环。'
          ],
          en: [
            'Scientific visualization: spatial data from simulation and observation, emphasizing realistic rendering of volumetric fields.',
            'Information visualization: abstract, non-spatial data, emphasizing structure, relationship, and evolution.',
            'Visual analytics: combining visualization with automated analysis into a loop of machine computation and human judgment.'
          ] },
        { t: 'quote',
          zh: '可视化的目的不是把图画得好看，而是让思考变得更快。',
          en: 'The purpose of visualization is insight, not pictures.' }
      ]
    },
    {
      no: '1.2',
      zh: { h: '为什么必须"看"数据' },
      en: { h: 'Why We Must Look at Data' },
      blocks: [
        { t: 'p',
          zh: '单纯依赖统计量会掩盖数据的真实形态。1973 年统计学家 Anscombe 构造了四组数据，它们的均值、方差、相关系数与回归直线几乎完全一致，但画成散点图后形态截然不同：直线、二次曲线、带离群点的直线，以及一条完全垂直的分布。这说明图形检查是数据分析中无法被数值摘要替代的一步。',
          en: 'Summary statistics alone can hide the true shape of data. In 1973 Anscombe constructed four datasets with nearly identical means, variances, correlation coefficients, and regression lines, yet their scatter plots are completely different: a line, a parabola, a line with one outlier, and a vertical distribution. Graphical inspection is therefore an irreplaceable step in data analysis.' },
        { t: 'code',
          demo: 'demos/anscombe.html',
          capZh: '图 1-1　Anscombe 四重奏：相同的统计量，完全不同的分布。点击散点可查看坐标。',
          capEn: 'Fig 1-1　Anscombe quartet: identical statistics, utterly different distributions. Click a point to read its coordinates.',
          lang: 'javascript',
          code: `const data = await d3.csv("anscombe.csv");

const x = d3.scaleLinear().domain([0, 20]).range([0, w]);
const y = d3.scaleLinear().domain([0, 14]).range([h, 0]);

// 四组数据分面绘制：同一标度，便于横向比较
["I", "II", "III", "IV"].forEach((g, i) => {
  const gx = svg.append("g").attr("transform", translate(i));
  gx.append("g").call(d3.axisBottom(x).ticks(5));
  gx.append("g").call(d3.axisLeft(y).ticks(5));

  gx.selectAll("circle")
    .data(data.filter(d => d.group === g))
    .join("circle")
    .attr("cx", d => x(d.x))
    .attr("cy", d => y(d.y))
    .attr("r", 3.5)
    .attr("fill", "#4f46e5");
});` },
        { t: 'p',
          zh: '视觉系统对图形的加工是并行的：人眼在约 200 毫秒内即可完成一次前注意加工，无需逐个注视就能感知颜色、大小、方向的显著差异。这种"一目了然"的速度，使可视化成为探索大规模数据的首选入口。',
          en: 'The visual system processes graphics in parallel: within roughly 200 milliseconds a pre-attentive sweep detects salient differences in color, size, or direction without sequential fixation. This glance-level speed makes visualization the preferred entry point for exploring large datasets.' }
      ]
    },
    {
      no: '1.3',
      zh: { h: '可视化流程' },
      en: { h: 'The Visualization Pipeline' },
      blocks: [
        { t: 'p',
          zh: '一条完整的流水线从原始数据出发，经过若干次变换，最终落到屏幕上的像素，并通过交互回到人手中。理解每一步的职责，是诊断"图为什么不好用"的前提。',
          en: 'A complete pipeline starts from raw data, passes through several transformations, ends in pixels on screen, and returns to the human through interaction. Knowing the responsibility of each stage is the precondition for diagnosing why a chart fails.' },
        { t: 'ul',
          zh: [
            '数据变换：清洗缺失值、剔除异常、采样、聚合、降维，把数据整理成可编码的形态。',
            '可视化映射：为每个数据项选择标记（点、线、面）与视觉通道（位置、长度、颜色、大小）。',
            '视图变换：选择坐标系与布局算法，决定缩放、平移与投影方式。',
            '渲染与交互：把几何图元绘制成像素，并为用户提供选择、过滤、联动等操作。'
          ],
          en: [
            'Data transformation: cleaning missing values, removing outliers, sampling, aggregation, and dimension reduction.',
            'Visual mapping: choosing marks (point, line, area) and visual channels (position, length, color, size) for each data item.',
            'View transformation: choosing coordinate systems and layout algorithms, deciding zoom, pan, and projection.',
            'Rendering and interaction: rasterizing geometry into pixels, and offering selection, filtering, and linking.'
          ] },
        { t: 'demo',
          demo: 'demos/pipeline.html',
          capZh: '图 1-2　可视化流水线：点击任一环节，观察该环节对同一份数据做了什么。',
          capEn: 'Fig 1-2　The visualization pipeline: click a stage to see what it does to the same dataset.' }
      ]
    },
    {
      no: '1.4',
      zh: { h: '简史与应用' },
      en: { h: 'A Brief History and Applications' },
      blocks: [
        { t: 'p',
          zh: '1786 年 Playfair 发明了条形图与折线图；1854 年 Snow 用霍乱死亡地图找到传染源；1869 年 Minard 用一幅图同时表达军队规模、行军路线、气温与时间，被视为叙事可视化的巅峰；1967 年 Tukey 提出探索性数据分析；1996 年 Shneiderman 总结出信息可视化的金律。',
          en: 'In 1786 Playfair invented the bar chart and the line chart; in 1854 Snow located the source of a cholera outbreak with a dot map; in 1869 Minard encoded army size, route, temperature, and time in a single image, still regarded as the summit of narrative visualization; in 1967 Tukey proposed exploratory data analysis; in 1996 Shneiderman formulated the visual information-seeking mantra.' },
        { t: 'quote',
          zh: 'Overview first, zoom and filter, then details-on-demand. — Ben Shneiderman',
          en: 'Overview first, zoom and filter, then details-on-demand. — Ben Shneiderman' },
        { t: 'ul',
          zh: [
            '科学研究：气候模拟、天体数据、基因序列与分子结构。',
            '商业智能：销售看板、用户行为漏斗、供应链监控。',
            '公共领域：疫情传播、城市交通、选举与人口统计。',
            '人工智能：模型可解释性、训练过程监控、嵌入空间探索。'
          ],
          en: [
            'Science: climate simulation, astronomy, genome sequences, molecular structures.',
            'Business intelligence: sales dashboards, conversion funnels, supply-chain monitoring.',
            'Public sector: epidemic spread, urban traffic, elections, and census data.',
            'Artificial intelligence: model interpretability, training monitoring, embedding-space exploration.'
          ] }
      ]
    }
  ]
},

/* ============================ 第 2 章 ============================ */
{
  id: 'perception',
  zh: {
    title: '视觉感知与视觉通道',
    lede: '图形之所以能被读懂，取决于人眼如何感知。本章讨论前注意加工、视觉通道与格式塔原则。'
  },
  en: {
    title: 'Visual Perception and Channels',
    lede: 'A chart is readable because of how the eye perceives it: pre-attentive processing, visual channels, and Gestalt principles.'
  },
  sections: [
    {
      no: '2.1',
      zh: { h: '前注意加工' },
      en: { h: 'Pre-attentive Processing' },
      blocks: [
        { t: 'p',
          zh: '前注意加工发生在意识介入之前：人眼无需逐个扫描，就能在一片图形中立刻发现颜色、大小、方向或曲率显著不同的目标。可视化设计的核心技巧之一，就是把最重要的信息放进这些"能被瞬间发现"的通道里。',
          en: 'Pre-attentive processing happens before conscious attention: without serial scanning, the eye instantly detects targets that differ in color, size, orientation, or curvature. A central design skill is to place the most important information into these instantly detectable channels.' },
        { t: 'p',
          zh: '前注意加工能力有限，通常一次只能支撑一到两个通道。若同时用颜色、大小、形状、纹理强调不同含义，读者反而需要逐个比对，并行优势随之消失。这就是"少即是多"在可视化中的含义。',
          en: 'This capacity is limited: it generally supports only one or two channels at a time. Highlighting several meanings at once with color, size, shape, and texture forces serial comparison, and the parallel advantage disappears. That is what "less is more" means in visualization.' }
      ]
    },
    {
      no: '2.2',
      zh: { h: '视觉通道' },
      en: { h: 'Visual Channels' },
      blocks: [
        { t: 'p',
          zh: '视觉通道是数据属性到视觉表现的映射途径。常用通道包括位置、长度、角度、面积、体积、密度、曲率、形状、纹理方向，以及颜色的三个分量：色相、饱和度与明度。同一个数据字段用不同通道表达，读者的判断精度差异很大。',
          en: 'A visual channel is a route from a data attribute to a visual appearance. Common channels include position, length, angle, area, volume, density, curvature, shape, and orientation, plus the three components of color: hue, saturation, and lightness. Encoding the same field with different channels yields very different judgment accuracy.' },
        { t: 'demo',
          demo: 'demos/channels.html',
          capZh: '图 2-1　同一组数据分别用长度、面积、角度、色相与明度编码，切换后比较读数的难易。',
          capEn: 'Fig 2-1　The same data encoded by length, area, angle, hue, and lightness; switch and compare how easily you can read values.' }
      ]
    },
    {
      no: '2.3',
      zh: { h: '通道的有效性排序' },
      en: { h: 'Effectiveness Ranking of Channels' },
      blocks: [
        { t: 'p',
          zh: 'Cleveland 与 McGill 通过心理物理实验给出了通道精度的大致排序：位置 > 长度 > 角度与斜率 > 面积 > 体积 > 密度 > 色相。位置与长度能被精确比较，而面积、体积与角度更适合粗略估计。',
          en: 'Through psychophysical experiments, Cleveland and McGill established a rough accuracy ranking: position > length > angle and slope > area > volume > density > hue. Position and length support precise comparison, whereas area, volume, and angle suit only rough estimation.' },
        { t: 'ul',
          zh: [
            '定量数据的精确比较：优先位置（散点图、折线图），其次长度（条形图）。',
            '整体与部分的关系：可用面积或角度（堆叠面积图、饼图），但精度低于长度。',
            '类别区分：使用色相，类别数量最好控制在 8 种以内。',
            '顺序或分级：使用明度或饱和度，天然带有"由少到多"的方向感。'
          ],
          en: [
            'Precise comparison of quantities: prefer position (scatter, line), then length (bar).',
            'Part-to-whole relations: area or angle (stacked area, pie), though less accurate than length.',
            'Category distinction: use hue, and keep the number of categories under eight.',
            'Ordering or grading: use lightness or saturation, which carry a natural sense of more or less.'
          ] },
        { t: 'quote',
          zh: '饼图之所以常被批评，不是因为它难看，而是因为角度与面积的比较精度远低于长度。',
          en: 'The pie chart is criticized not because it is ugly, but because angle and area are far less accurate than length.' }
      ]
    },
    {
      no: '2.4',
      zh: { h: '格式塔原则' },
      en: { h: 'Gestalt Principles' },
      blocks: [
        { t: 'p',
          zh: '格式塔心理学描述人如何把零散的视觉元素组织为整体。接近的元素被视为一组，相似的元素被视为同类，封闭的轮廓被视为一个物体，连续的线条被视为同一条路径。布局算法正是利用了这些规律：把相关的数据放在空间上更接近的位置，读者无需图例也能读出分组。',
          en: 'Gestalt psychology describes how scattered visual elements are organized into wholes. Nearby elements are seen as a group, similar elements as one category, closed contours as an object, and continuous lines as a single path. Layout algorithms exploit these laws: placing related data closer in space lets readers perceive groups even without a legend.' },
        { t: 'demo',
          demo: 'demos/gestalt.html',
          capZh: '图 2-2　接近性、相似性、闭合性与连续性：把鼠标移到任一组上观察分组效果。',
          capEn: 'Fig 2-2　Proximity, similarity, closure, and continuity: hover a group to see the effect.' }
      ]
    },
    {
      no: '2.5',
      zh: { h: '颜色的使用' },
      en: { h: 'Using Color' },
      blocks: [
        { t: 'p',
          zh: '颜色是最容易被滥用的通道。它适合区分类别或表达顺序，但不适合表达精确的数值。选择配色方案时应先判断数据性质：类别型数据用定性配色（色相变化、明度接近），有序或数值型数据用单色渐变或多色渐变配色。',
          en: 'Color is the most abused channel. It separates categories or expresses order well, but conveys exact values poorly. Choose a palette by data type first: qualitative palettes (varying hue, similar lightness) for nominal data; sequential or diverging palettes for ordered and quantitative data.' },
        { t: 'ul',
          zh: [
            '定性配色：区分类别，色相不同、明度相近，避免暗示大小关系。',
            '顺序配色：单一色相的明度渐变，表达由少到多。',
            '发散配色：两端色相相反、中间浅色，用于表达相对某个中点的偏离。',
            '避免红绿并列：约 8% 的男性存在红绿色觉障碍，应使用色盲安全配色。'
          ],
          en: [
            'Qualitative: distinguishes categories, varying hue with similar lightness so no magnitude is implied.',
            'Sequential: a lightness ramp within one hue, expressing less to more.',
            'Diverging: two opposing hues with a light middle, expressing deviation from a meaningful center.',
            'Avoid red-green pairs: about 8% of men have red-green deficiency, so use colorblind-safe palettes.'
          ] }
      ]
    }
  ]
},

/* ============================ 第 3 章 ============================ */
{
  id: 'data',
  zh: {
    title: '数据基础',
    lede: '可视化的输入不是"数字"，而是带有类型与结构的数据。本章讨论数据类型、数据集形态与预处理。'
  },
  en: {
    title: 'Data Foundations',
    lede: 'The input to visualization is not numbers but typed, structured data: types, dataset shapes, and preprocessing.'
  },
  sections: [
    {
      no: '3.1',
      zh: { h: '数据类型与测量尺度' },
      en: { h: 'Data Types and Measurement Scales' },
      blocks: [
        { t: 'p',
          zh: 'Stevens 将测量尺度分为四级：定类（nominal）、定序（ordinal）、定距（interval）与定比（ratio）。定类数据只有相等与不等，如城市名；定序数据有次序但间距未知，如满意度等级；定距与定比数据是数值，可做加减与比例运算，如温度与收入。',
          en: 'Stevens distinguished four measurement scales: nominal, ordinal, interval, and ratio. Nominal data only supports equality, such as city names; ordinal data has order but unknown spacing, such as satisfaction levels; interval and ratio data are numeric and support addition and proportion, such as temperature and income.' },
        { t: 'p',
          zh: '类型决定了可用的编码方式：定类数据不能编码为长度或位置顺序，否则会暗示并不存在的大小关系；定比数据则可以自由使用位置、长度与面积。把类型判断清楚，编码方案就基本确定了。',
          en: 'The type determines admissible encodings: nominal data must not be encoded as ordered length or position, which would imply magnitudes that do not exist; ratio data may freely use position, length, and area. Once the type is clear, the encoding plan is largely settled.' }
      ]
    },
    {
      no: '3.2',
      zh: { h: '数据集的四种形态' },
      en: { h: 'Four Shapes of Datasets' },
      blocks: [
        { t: 'p',
          zh: '数据集按结构可分为表格（table）、网络（network）、场（field）与几何（geometry）四类，不同形态对应不同的可视化家族。',
          en: 'By structure, datasets fall into tables, networks, fields, and geometry, each mapping to a family of visualization techniques.' },
        { t: 'ul',
          zh: [
            '表格：行是数据项、列是属性，对应柱状图、散点图、平行坐标等统计图表。',
            '网络：节点与边，对应节点链接图、邻接矩阵、力导向布局。',
            '场：连续空间上的采样值，如温度场、向量场，对应等值线、流线与体绘制。',
            '几何：具有明确空间形状的数据，如地形、建筑、人体器官，对应三维重建与科学可视化。'
          ],
          en: [
            'Tables: rows are items and columns are attributes, matching bar charts, scatter plots, and parallel coordinates.',
            'Networks: nodes and edges, matching node-link diagrams, adjacency matrices, and force-directed layouts.',
            'Fields: samples over continuous space such as temperature or vector fields, matching contours, streamlines, and volume rendering.',
            'Geometry: data with explicit spatial shape such as terrain, buildings, or organs, matching 3D reconstruction and scientific visualization.'
          ] }
      ]
    },
    {
      no: '3.3',
      zh: { h: '清洗、变换与标度' },
      en: { h: 'Cleaning, Transformation, and Scales' },
      blocks: [
        { t: 'p',
          zh: '原始数据往往含有缺失值、异常值与不一致的单位。常见处理方式是删除或插补缺失项、用分位数界定异常、统一量纲后归一化。变换之后的下一步是标度：把数据域映射到屏幕的值域，这是 D3 中最核心的一步。',
          en: 'Raw data usually contains missing values, outliers, and inconsistent units. Typical treatment: delete or impute missing entries, bound outliers by quantiles, and normalize after unifying units. The next step is the scale: mapping a data domain onto a screen range, the central operation in D3.' },
        { t: 'code',
          demo: 'demos/scales.html',
          capZh: '图 3-1　线性、对数、幂与平方根标度：拖动滑块观察同一组数据在四种标度下的形态差异。',
          capEn: 'Fig 3-1　Linear, log, power, and square-root scales: drag the slider to see the same data under four scales.',
          lang: 'javascript',
          code: `const values = data.map(d => +d.value);

const x = d3.scaleBand()
  .domain(d3.range(values.length))
  .range([0, w]).padding(0.2);

// 线性标度：差值可加，适合常规数值
const yLinear = d3.scaleLinear()
  .domain([0, d3.max(values)]).nice().range([h, 0]);

// 对数标度：跨越多个数量级时使用，注意定义域不能含 0
const yLog = d3.scaleLog()
  .domain([d3.min(values), d3.max(values)]).range([h, 0]);

// 平方根标度：面积编码的常用选择，使面积与数值成正比
const ySqrt = d3.scaleSqrt()
  .domain([0, d3.max(values)]).range([h, 0]);

svg.append("g").call(d3.axisLeft(yLinear));` }
      ]
    },
    {
      no: '3.4',
      zh: { h: '聚合、采样与降维' },
      en: { h: 'Aggregation, Sampling, and Reduction' },
      blocks: [
        { t: 'p',
          zh: '当数据量超过屏幕像素数时，逐点绘制只会造成重叠与卡顿。三种应对策略是聚合（按时间或空间分箱后统计）、采样（保留代表性的子集）与降维（把高维投影到二维）。它们都会损失信息，因此必须配合交互，让用户随时回到原始细节。',
          en: 'When data exceeds the number of screen pixels, per-item drawing causes overplotting and lag. Three strategies help: aggregate (bin by time or space and summarize), sample (keep a representative subset), and reduce (project high dimensions into two). All lose information, so they must be paired with interaction that lets users return to raw detail.' },
        { t: 'ul',
          zh: [
            '分箱聚合：直方图、热力图与日历图的基础，箱宽决定细节与噪声的权衡。',
            '随机与分层采样：分层采样能保留稀有类别，避免少数群体被完全抽走。',
            '线性降维：PCA 保留方差最大的方向，可解释但只捕捉线性结构。',
            '非线性降维：t-SNE 与 UMAP 保留局部邻域，适合观察聚类，但坐标距离不可直接解读。'
          ],
          en: [
            'Binning: the basis of histograms, heatmaps, and calendar views; bin width trades detail against noise.',
            'Random and stratified sampling: stratified sampling preserves rare categories that random sampling may miss entirely.',
            'Linear reduction: PCA keeps directions of maximal variance, interpretable but limited to linear structure.',
            'Non-linear reduction: t-SNE and UMAP preserve local neighborhoods, good for clusters, yet distances are not directly meaningful.'
          ] }
      ]
    }
  ]
},

/* ============================ 第 4 章 ============================ */
{
  id: 'encoding',
  zh: {
    title: '可视化编码与设计',
    lede: '把数据变成图形的规则：标记、通道、坐标系与设计原则，构成可视化设计的语法层。'
  },
  en: {
    title: 'Visual Encoding and Design',
    lede: 'The rules that turn data into graphics: marks, channels, coordinate systems, and design principles — the grammar layer.'
  },
  sections: [
    {
      no: '4.1',
      zh: { h: '标记与通道' },
      en: { h: 'Marks and Channels' },
      blocks: [
        { t: 'p',
          zh: '标记是承载数据的基本图形元素，最常用的是点、线与面。点适合表达离散的个体，线适合表达连续变化与连接关系，面适合表达累积量或区域范围。选好标记后，再为每个数据属性分配视觉通道。',
          en: 'Marks are the basic graphical elements that carry data: points, lines, and areas. Points suit discrete items, lines suit continuous change and connections, and areas suit accumulated quantities or regions. After choosing marks, assign a visual channel to each attribute.' },
        { t: 'p',
          zh: '一个编码方案可以写成一组配对：数值型属性 → 位置或长度；类别型属性 → 色相或形状；时序属性 → 位置（时间轴）；不确定性 → 透明度或模糊程度。把配对写清楚，图形的可读性就有了依据。',
          en: 'An encoding plan can be written as pairs: quantitative attribute to position or length; categorical attribute to hue or shape; temporal attribute to position along a time axis; uncertainty to opacity or blur. Writing the pairs down makes readability arguable rather than accidental.' }
      ]
    },
    {
      no: '4.2',
      zh: { h: '图形语法' },
      en: { h: 'The Grammar of Graphics' },
      blocks: [
        { t: 'p',
          zh: 'Wilkinson 提出的图形语法把一张图分解为若干独立层次：数据、变换、标度、坐标系、图形元素与引导元素（坐标轴、图例、注释）。这种分解让人不必记忆"图表类型"，而是通过组合层次来描述任意图形。',
          en: 'Wilkinson grammar of graphics decomposes a chart into independent layers: data, transformation, scale, coordinate system, graphical element, and guide (axes, legends, annotations). This decomposition removes the need to memorize chart types: any graphic is described by combining layers.' },
        { t: 'code',
          lang: 'javascript',
          code: `// 以声明式语法描述一张散点图：数据 + 标度 + 坐标系 + 图形元素
const spec = {
  data: { values: rows },
  mark: "point",
  encoding: {
    x: { field: "gdp",    type: "quantitative", scale: { type: "log" } },
    y: { field: "life",   type: "quantitative" },
    size: { field: "pop", type: "quantitative", scale: { type: "sqrt" } },
    color: { field: "region", type: "nominal" }
  }
};

vegaEmbed("#chart", spec);` },
        { t: 'p',
          zh: '声明式语法的价值在于可复用与可比较：改变一个层次即可得到另一张图，而底层的绘制逻辑保持不变。D3 属于命令式风格，Vega-Lite 属于声明式风格，两者在工程上各有优势。',
          en: 'The value of declarative grammar is reuse and comparability: changing one layer yields another chart while the drawing logic stays fixed. D3 is imperative, Vega-Lite is declarative; each has engineering advantages.' }
      ]
    },
    {
      no: '4.3',
      zh: { h: '设计原则' },
      en: { h: 'Design Principles' },
      blocks: [
        { t: 'p',
          zh: 'Tufte 提出数据墨水比：图形中用于表达数据的墨水量与总墨水量之比。装饰性的渐变、立体阴影与无意义的背景都在稀释这一比例。他同时定义了谎言因子：图形所显示的效应大小与数据真实效应大小之比，截断坐标轴是放大谎言因子的典型做法。',
          en: 'Tufte proposed the data-ink ratio: the share of ink devoted to representing data out of all ink used. Decorative gradients, shadows, and pointless backgrounds dilute it. He also defined the lie factor: the size of the effect shown in the graphic divided by the true effect in the data; truncating an axis is the classic way to inflate it.' },
        { t: 'ul',
          zh: [
            '数值轴应从零开始，除非明确说明截断；面积与体积编码必须保持与数值成正比。',
            '删去无信息量的装饰：网格线应弱化，图例只在必要时出现。',
            '直接标注优于依赖图例：在图形旁写字，减少读者的来回扫视。',
            '保持一致性：同一系列图表使用相同的颜色、量纲与坐标范围。'
          ],
          en: [
            'Start numeric axes at zero unless truncation is stated; area and volume must stay proportional to the value.',
            'Remove non-informative decoration: weaken gridlines, show legends only when necessary.',
            'Prefer direct labeling over legends: write text next to marks to reduce eye travel.',
            'Stay consistent: use the same colors, units, and axis ranges across a series of charts.'
          ] },
        { t: 'quote',
          zh: '图形 excellence 的标准：在最短时间内、用最少的墨水、给最多的人、传达最多的想法。',
          en: 'Graphical excellence: give the viewer the greatest number of ideas in the shortest time with the least ink in the smallest space.' }
      ]
    },
    {
      no: '4.4',
      zh: { h: '坐标系与视图' },
      en: { h: 'Coordinate Systems and Views' },
      blocks: [
        { t: 'p',
          zh: '直角坐标系适合表达趋势与相关，极坐标系适合表达周期与比例，地理坐标系适合表达空间分布。坐标系并非装饰，它会改变读者对"距离"与"方向"的直觉，因此必须与数据语义匹配。',
          en: 'Cartesian coordinates suit trends and correlation, polar coordinates suit cycles and proportions, and geographic coordinates suit spatial distribution. A coordinate system is not decoration: it reshapes intuition about distance and direction, so it must match the semantics of the data.' },
        { t: 'ul',
          zh: [
            '直角坐标：最通用，读者对斜率与高度的判断最稳定。',
            '极坐标：适合时间与周期，但半径方向的比较精度低于直角坐标。',
            '地理投影：任何投影都会扭曲面积、距离或角度，选择时需说明取舍。'
          ],
          en: [
            'Cartesian: the most general, and readers judge slope and height most reliably.',
            'Polar: good for cycles, but radial comparison is less accurate than along a straight axis.',
            'Geographic projections: every projection distorts area, distance, or angle, so the trade-off must be stated.'
          ] }
      ]
    }
  ]
},

/* ============================ 第 5 章 ============================ */
{
  id: 'charts',
  zh: {
    title: '基础图表与 D3 实现',
    lede: '从条形图到散点图：用 D3 的数据绑定思想实现最常用的四种统计图表，并理解它们的适用边界。'
  },
  en: {
    title: 'Basic Charts with D3',
    lede: 'From bar charts to scatter plots: implement the four most common statistical charts with D3 data joins, and learn their limits.'
  },
  sections: [
    {
      no: '5.1',
      zh: { h: '条形图：长度编码' },
      en: { h: 'Bar Charts: Encoding by Length' },
      blocks: [
        { t: 'p',
          zh: '条形图用一个方向的长度编码数值，另一个方向留给类别。由于长度是比较精度最高的通道之一，条形图成为类别对比的首选。横向条形图（类别名在纵轴）更适合长名称与较多类别。',
          en: 'A bar chart encodes value by length in one direction and leaves the other for categories. Since length is among the most accurate channels, bar charts are the default for category comparison. Horizontal bars suit long labels and many categories.' },
        { t: 'code',
          demo: 'demos/bar.html',
          capZh: '图 5-1　可排序条形图：点击表头切换排序，鼠标悬停查看数值。',
          capEn: 'Fig 5-1　Sortable bar chart: click the header to change ordering, hover to read values.',
          lang: 'javascript',
          code: `const x = d3.scaleLinear().domain([0, d3.max(data, d => d.value)]).range([0, w]);
const y = d3.scaleBand().domain(data.map(d => d.name)).range([0, h]).padding(0.25);

svg.selectAll("rect")
  .data(data, d => d.name)
  .join(
    enter => enter.append("rect")
      .attr("x", 0).attr("y", d => y(d.name))
      .attr("height", y.bandwidth())
      .attr("width", 0)
      .attr("fill", "#4f46e5")
      .call(e => e.transition().duration(700)
        .attr("width", d => x(d.value))),
    update => update
      .call(u => u.transition().duration(700)
        .attr("y", d => y(d.name))
        .attr("width", d => x(d.value)))
  );

svg.append("g").attr("transform", "translate(0," + h + ")").call(d3.axisBottom(x));
svg.append("g").call(d3.axisLeft(y));` }
      ]
    },
    {
      no: '5.2',
      zh: { h: '折线图：趋势与变化' },
      en: { h: 'Line Charts: Trend and Change' },
      blocks: [
        { t: 'p',
          zh: '折线图用水平位置编码时间或有序自变量，用垂直位置编码数值，线段本身暗示了连续性。多条折线时应控制数量（通常不超过五条），否则应改用分面小倍数图。当总量也有意义时，可用堆叠面积图，但只有最底层的一条基线是稳定的，其余层的比较精度较低。',
          en: 'A line chart encodes time or an ordered variable by horizontal position and value by vertical position; the segment implies continuity. Keep the number of lines small, usually under five, otherwise switch to small multiples. When the total also matters, stacked area charts work, but only the bottom band has a stable baseline.' },
        { t: 'code',
          demo: 'demos/line.html',
          capZh: '图 5-2　多序列折线图：点击图例可隐藏或显示序列，拖动可查看局部数值。',
          capEn: 'Fig 5-2　Multi-series line chart: click the legend to toggle series, hover to inspect values.',
          lang: 'javascript',
          code: `const x = d3.scaleTime().domain(d3.extent(data, d => d.date)).range([0, w]);
const y = d3.scaleLinear().domain([0, d3.max(series, s => d3.max(s.values, d => d.v))]).nice().range([h, 0]);
const color = d3.scaleOrdinal().domain(series.map(s => s.key)).range(d3.schemeTableau10);

const line = d3.line()
  .defined(d => d.v != null)
  .x(d => x(d.date))
  .y(d => y(d.v))
  .curve(d3.curveMonotoneX);

svg.selectAll("path.line")
  .data(series)
  .join("path")
  .attr("class", "line")
  .attr("fill", "none")
  .attr("stroke", d => color(d.key))
  .attr("stroke-width", 2)
  .attr("d", d => line(d.values));` }
      ]
    },
    {
      no: '5.3',
      zh: { h: '散点图：相关与分布' },
      en: { h: 'Scatter Plots: Correlation and Distribution' },
      blocks: [
        { t: 'p',
          zh: '散点图把两个定量属性分别映射到横纵位置，是观察相关关系、聚类与离群点的基本工具。数据量大时应降低点的透明度或使用六边形分箱，避免重叠造成的密度误判。加入趋势线或回归曲线可以帮助读者确认关系的方向与强度。',
          en: 'A scatter plot maps two quantitative attributes to horizontal and vertical position; it is the basic tool for correlation, clusters, and outliers. With many points, lower opacity or use hexagonal binning to avoid misleading density from overplotting. A trend line or regression curve helps confirm direction and strength.' },
        { t: 'code',
          demo: 'demos/scatter.html',
          capZh: '图 5-3　带刷选的散点图：拖出选框过滤数据，右侧直方图同步更新。',
          capEn: 'Fig 5-3　Scatter plot with brushing: drag a rectangle to filter, and the histogram on the right updates.',
          lang: 'javascript',
          code: `const x = d3.scaleLinear().domain(d3.extent(data, d => d.x)).nice().range([0, w]);
const y = d3.scaleLinear().domain(d3.extent(data, d => d.y)).nice().range([h, 0]);

svg.selectAll("circle")
  .data(data)
  .join("circle")
  .attr("cx", d => x(d.x))
  .attr("cy", d => y(d.y))
  .attr("r", 3.5)
  .attr("fill", "#4f46e5")
  .attr("fill-opacity", 0.55);

const brush = d3.brush().extent([[0, 0], [w, h]]).on("end", brushed);
svg.append("g").attr("class", "brush").call(brush);

function brushed({ selection }) {
  if (!selection) return;
  const [[x0, y0], [x1, y1]] = selection;
  const picked = data.filter(d =>
    x(d.x) >= x0 && x(d.x) <= x1 && y(d.y) >= y0 && y(d.y) <= y1);
  updateHistogram(picked);
}` }
      ]
    },
    {
      no: '5.4',
      zh: { h: '饼图及其替代方案' },
      en: { h: 'Pie Charts and Their Alternatives' },
      blocks: [
        { t: 'p',
          zh: '饼图用角度编码比例，适合类别很少（两到三类）且比例差异明显、总量有明确含义的场合。由于人眼比较角度与面积的精度有限，当类别超过三类或比例接近时，应改用条形图或堆叠条形图。',
          en: 'Pie charts encode proportion by angle and suit few categories, two or three, with clear differences and a meaningful total. Since angle and area are judged imprecisely, switch to bar or stacked bar charts when categories exceed three or proportions are close.' },
        { t: 'demo',
          demo: 'demos/pie.html',
          capZh: '图 5-4　饼图与条形图对照：切换视图，比较"哪一类别最大"的判断速度与准确率。',
          capEn: 'Fig 5-4　Pie versus bar: switch views and compare how fast and how accurately you judge the largest category.' }
      ]
    }
  ]
},

/* ============================ 第 6 章 ============================ */
{
  id: 'graph',
  zh: {
    title: '图与层次数据可视化',
    lede: '关系型数据的两类主流表达：节点链接图与邻接矩阵，以及树形数据的空间填充方法。'
  },
  en: {
    title: 'Graph and Hierarchy Visualization',
    lede: 'Two mainstream representations of relational data — node-link and adjacency matrix — plus space-filling layouts for trees.'
  },
  sections: [
    {
      no: '6.1',
      zh: { h: '节点链接与力导向布局' },
      en: { h: 'Node-Link and Force Layout' },
      blocks: [
        { t: 'p',
          zh: '节点链接图把实体画成点、把关系画成线，直观且符合直觉。布局质量决定了可读性：力导向布局把边看作弹簧、把节点看作互斥电荷，通过迭代最小化系统能量，使相连的节点靠近、所有节点均匀散开。',
          en: 'A node-link diagram draws entities as points and relations as lines, intuitive and direct. Layout quality determines readability: a force layout treats edges as springs and nodes as mutually repelling charges, iteratively minimizing system energy so that connected nodes come close while all nodes spread evenly.' },
        { t: 'code',
          demo: 'demos/force.html',
          capZh: '图 6-1　力导向图：拖动节点改变布局，点击节点高亮其邻居。',
          capEn: 'Fig 6-1　Force-directed graph: drag nodes to reshape the layout, click a node to highlight its neighbors.',
          lang: 'javascript',
          code: `const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(60))
  .force("charge", d3.forceManyBody().strength(-180))
  .force("center", d3.forceCenter(w / 2, h / 2))
  .force("collide", d3.forceCollide().radius(10));

const link = svg.append("g").selectAll("line").data(links)
  .join("line").attr("stroke", "#c7c7cc").attr("stroke-opacity", 0.6);

const node = svg.append("g").selectAll("circle").data(nodes)
  .join("circle").attr("r", 6).attr("fill", d => color(d.group))
  .call(d3.drag()
    .on("start", (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
    .on("drag",  (e, d) => { d.fx = e.x; d.fy = e.y; })
    .on("end",   (e, d) => { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; }));

simulation.on("tick", () => {
  link.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
  node.attr("cx", d => d.x).attr("cy", d => d.y);
});` }
      ]
    },
    {
      no: '6.2',
      zh: { h: '邻接矩阵' },
      en: { h: 'Adjacency Matrix' },
      blocks: [
        { t: 'p',
          zh: '邻接矩阵用第 i 行第 j 列的色块表示节点 i 与 j 之间是否有边。它不产生边交叉，因此在稠密图上比节点链接图更易读；缺点是路径追踪变难——沿着一条路径"走"需要反复在行列之间跳转。对节点重新排序（按聚类或度数）能显著提升矩阵的可读性。',
          en: 'An adjacency matrix represents the edge between nodes i and j by the cell at row i, column j. It produces no edge crossings, so it stays readable on dense graphs; the cost is that path tracing becomes hard, since following a path means jumping repeatedly between rows and columns. Reordering nodes by cluster or degree greatly improves readability.' },
        { t: 'ul',
          zh: [
            '稀疏图、需要追踪路径：优先节点链接图。',
            '稠密图、关注全局结构与聚类：优先邻接矩阵。',
            '大规模图：先做社区发现与聚合，再在摘要图上交互展开细节。'
          ],
          en: [
            'Sparse graphs and path tracing: prefer node-link.',
            'Dense graphs and global structure or clusters: prefer adjacency matrix.',
            'Very large graphs: detect communities and aggregate first, then expand details interactively.'
          ] }
      ]
    },
    {
      no: '6.3',
      zh: { h: '层次数据与树图' },
      en: { h: 'Hierarchies and Treemaps' },
      blocks: [
        { t: 'p',
          zh: '层次数据的经典表达是节点链接树，但它在深而宽的树上会浪费大量空间。空间填充方法把每个叶节点映射为一个矩形，面积编码数值、嵌套表达层级，典型代表是树图（treemap）。树图对"谁最大"的判断很好，对精确比较与深度读取较弱。',
          en: 'The classic representation of hierarchy is a node-link tree, but it wastes space on deep and wide trees. Space-filling methods map each leaf to a rectangle, encoding value by area and hierarchy by nesting, typified by the treemap. Treemaps excel at judging "which is largest" and are weaker for precise comparison and depth reading.' },
        { t: 'code',
          demo: 'demos/treemap.html',
          capZh: '图 6-2　树图：点击方块下钻，点击面包屑返回上层。',
          capEn: 'Fig 6-2　Treemap: click a tile to drill down, click a breadcrumb to go back.',
          lang: 'javascript',
          code: `const root = d3.hierarchy(data)
  .sum(d => d.value)
  .sort((a, b) => b.value - a.value);

d3.treemap().size([w, h]).paddingInner(3).round(true)(root);

const leaf = svg.selectAll("g")
  .data(root.leaves())
  .join("g")
  .attr("transform", d => "translate(" + d.x0 + "," + d.y0 + ")");

leaf.append("rect")
  .attr("width", d => d.x1 - d.x0)
  .attr("height", d => d.y1 - d.y0)
  .attr("fill", d => color(d.parent.data.name));

leaf.append("text")
  .attr("x", 6).attr("y", 16)
  .text(d => d.data.name)
  .attr("font-size", 11)
  .attr("fill", "#fff");` }
      ]
    },
    {
      no: '6.4',
      zh: { h: '大规模图的策略' },
      en: { h: 'Strategies for Large Graphs' },
      blocks: [
        { t: 'p',
          zh: '当节点达到上万级，绘制与布局都会成为瓶颈。工程上的常用做法包括：按社区聚合为超节点、只绘制权重较高的边、用层次化的多分辨率表示，以及在服务端预计算布局、在前端只做渲染。',
          en: 'At tens of thousands of nodes, both layout and rendering become bottlenecks. Common engineering strategies: aggregate communities into super-nodes, draw only high-weight edges, use hierarchical multi-resolution representations, and precompute layout on the server so the client only renders.' }
      ]
    }
  ]
}

];
