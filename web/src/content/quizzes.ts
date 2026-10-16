import type { QuizItem } from './types';

export const QUIZZES: QuizItem[] = [
  {
    id: 'ch1-q1',
    chapterId: '1',
    q: { zh: '可视化管线的正确顺序是?', en: 'What is the correct order of the visualization pipeline?' },
    options: [
      { zh: '视觉映射 → 数据变换 → 数据与任务 → 视图', en: 'Mapping → transform → task → view' },
      { zh: '数据与任务 → 数据变换 → 视觉映射 → 视图与交互', en: 'Task → transform → mapping → view & interaction' },
      { zh: '视图 → 视觉映射 → 数据变换 → 数据', en: 'View → mapping → transform → data' },
    ],
    answer: 1,
    explain: {
      zh: '先明确问题与数据,再变换、映射,最后呈现与交互。问题不清,后面的步骤都是空中楼阁。',
      en: 'Clarify the question and data first, then transform, map, and finally present. A vague question undermines every later step.',
    },
  },
  {
    id: 'ch1-q2',
    chapterId: '1',
    q: { zh: '安斯库姆四重奏最想说明的是?', en: 'What is the main lesson of Anscombe’s quartet?' },
    options: [
      { zh: '回归分析没有用', en: 'Regression analysis is useless' },
      { zh: '相同的统计量可能对应完全不同的数据形态,必须看图', en: 'Identical statistics can hide totally different shapes — always look at the plot' },
      { zh: '散点图只适合线性数据', en: 'Scatter plots only suit linear data' },
    ],
    answer: 1,
    explain: {
      zh: '四组统计量几乎相同,图形却讲述了四个故事:可视化能暴露数字的盲区。',
      en: 'Four groups, near-identical statistics, four different stories: visualization exposes what numbers hide.',
    },
  },
  {
    id: 'ch1-q3',
    chapterId: '1',
    q: { zh: '评价一幅可视化作品时,最重要的底线是?', en: 'When judging a visualization, the most important baseline is?' },
    options: [
      { zh: '美观:颜色越丰富越好', en: 'Beauty: the more colorful the better' },
      { zh: '复杂:一张图回答越多问题越好', en: 'Complexity: one chart should answer as many questions as possible' },
      { zh: '诚实:图形与数据严格对应,不误导读者', en: 'Honesty: graphics must correspond strictly to data and never mislead' },
    ],
    answer: 2,
    explain: {
      zh: '诚实 > 清晰 > 美观。截断坐标轴、面积冒充长度,都是不诚实的典型手法。',
      en: 'Honest > clear > beautiful. Truncated axes and areas posing as lengths are classic dishonesties.',
    },
  },
  {
    id: 'ch1-q4',
    chapterId: '1',
    q: { zh: '一张柱状图的 y 轴从 100 开始,最可能造成什么后果?', en: 'A bar chart’s y axis starts at 100. What is the most likely consequence?' },
    options: [
      { zh: '没有任何影响,读者会自动脑补', en: 'No effect — readers adjust automatically' },
      { zh: '微小差异被视觉放大,读者高估组间差距', en: 'Tiny differences look huge; readers overestimate the gaps' },
      { zh: '柱子颜色会失真', en: 'The bar colors become distorted' },
    ],
    answer: 1,
    explain: {
      zh: '人眼默认柱子从共同基线开始比较长度。截断基线后,18% 的差距看起来像 3 倍。修正:柱状图 y 轴永远从 0 开始。',
      en: 'Eyes compare bar lengths assuming a common baseline. Cut it, and an 18% gap looks like 3x. Fix: bar charts always start at zero.',
    },
  },
  {
    id: 'ch2-q1',
    chapterId: '2',
    q: { zh: '对定量数据,表达精度最高的视觉通道是?', en: 'For quantitative data, the most precise visual channel is?' },
    options: [
      { zh: '颜色深浅', en: 'Color lightness' },
      { zh: '气泡面积', en: 'Bubble area' },
      { zh: '线上位置', en: 'Position on a line' },
    ],
    answer: 2,
    explain: {
      zh: '精度排序:位置 > 长度 > 角度/面积 > 颜色。这就是散点图和柱状图经久不衰的原因。',
      en: 'Precision ranking: position > length > angle/area > color. That is why scatter and bar charts endure.',
    },
  },
  {
    id: 'ch2-q2',
    chapterId: '2',
    q: { zh: '表达“销售额从低到高”的顺序数据,应该选?', en: 'To show sequential data like “sales from low to high”, choose?' },
    options: [
      { zh: '彩虹色,颜色越多信息量越大', en: 'Rainbow — more colors, more information' },
      { zh: '单色相明度渐变,越深越大', en: 'Single-hue lightness ramp — darker means larger' },
      { zh: '六种高饱和分类色随机分配', en: 'Six saturated categorical colors at random' },
    ],
    answer: 1,
    explain: {
      zh: '顺序数据用单色相渐变;彩虹色的明度跳变会制造数据中不存在的边界。',
      en: 'Sequential data wants a single-hue ramp; rainbow lightness jumps fabricate boundaries absent from the data.',
    },
  },
  {
    id: 'ch2-q3',
    chapterId: '2',
    q: { zh: '以下哪项不在感知陷阱自查清单里?', en: 'Which is NOT on the perceptual trap checklist?' },
    options: [
      { zh: '柱子从 0 开始', en: 'Bars start at zero' },
      { zh: '删掉扭曲长度的 3D 与阴影', en: 'Remove 3D and shadows that distort length' },
      { zh: '一张图同时回答五个问题', en: 'Answer five questions in one chart' },
    ],
    answer: 2,
    explain: {
      zh: '一个视角只回答一个问题。贪多是清晰度的大敌,也是清单要防的事故之一。',
      en: 'One view answers one question. Greed kills clarity — exactly the kind of accident the checklist prevents.',
    },
  },
  {
    id: 'ch3-q1',
    chapterId: '3',
    q: { zh: '一组指数增长的用户数,想看增速稳不稳,应该选?', en: 'For exponential user growth, to judge whether the rate is steady, choose?' },
    options: [
      { zh: '线性轴:体量感最真实', en: 'Linear axis: truest sense of size' },
      { zh: '对数轴:指数变直线,节奏一目了然', en: 'Log axis: exponential becomes a straight line' },
      { zh: '把 y 轴从一个很大的数开始截断', en: 'Truncate the y axis from a large number' },
    ],
    answer: 1,
    explain: {
      zh: '线性轴回答现在有多大,对数轴回答增长有多稳。用对数轴必须在标题里明示,绝不能偷偷切换。',
      en: 'Linear asks how big now; log asks how steady the growth. A log axis must always be announced, never switched silently.',
    },
  },
  {
    id: 'ch3-q2',
    chapterId: '3',
    q: { zh: '200 个样本实际有两个峰,但直方图只显示一个驼峰,最可能的原因是?', en: 'Two hundred samples hide two peaks, but the histogram shows one hump. The most likely cause?' },
    options: [
      { zh: '分箱太少,双峰被抹平了', en: 'Too few bins — the twin peaks got smoothed away' },
      { zh: '分箱太多,噪声淹没了结构', en: 'Too many bins — noise drowned the structure' },
      { zh: '数据一定输错了', en: 'The data must have been entered wrong' },
    ],
    answer: 0,
    explain: {
      zh: '分箱太少吞掉结构,太多全是噪声。实践是从 10~15 箱起步,上下各试一档,结论三档都稳定才算数。',
      en: 'Too few bins swallow structure; too many drown it in noise. Start at 10–15, try one step each way — trust only conclusions stable across all three.',
    },
  },
  {
    id: 'ch3-q3',
    chapterId: '3',
    q: { zh: '时间序列缺失了一周的数据,诚实的做法是?', en: 'A time series is missing one week. The honest treatment?' },
    options: [
      { zh: '用直线把断点连起来,图好看最重要', en: 'Bridge the gap with a straight line — pretty charts first' },
      { zh: '把缺失的日期从横轴删掉,让线连贯', en: 'Delete the missing dates from the axis for continuity' },
      { zh: '横轴留空、断点就是断点', en: 'Leave the gap visible on the axis — a gap is a gap' },
    ],
    answer: 2,
    explain: {
      zh: '时间轴必须等距,缺失必须留空。用连线编造数据,和截断坐标轴是同一种不诚实。',
      en: 'Time axes stay evenly spaced and gaps stay visible. Inventing data with connecting lines is the same dishonesty as truncating an axis.',
    },
  },
  {
    id: 'ch4-q1',
    chapterId: '4',
    q: { zh: '老板问 12 个月销售额的走势如何,应该选?', en: 'The boss asks about the 12-month sales trajectory. Choose?' },
    options: [
      { zh: '折线图:连线强调走向', en: 'Line chart: the line emphasizes the movement' },
      { zh: '饼图:12 个月画 12 个扇形', en: 'Pie chart: 12 months, 12 slices' },
      { zh: '词云:销售额越大字越大', en: 'Word cloud: bigger sales, bigger words' },
    ],
    answer: 0,
    explain: {
      zh: '趋势问题配折线图,斜率本身就是故事。12 个扇形的饼图是色块拼盘,谁也读不出走势。',
      en: 'Trend questions take line charts — the slope is the story. A 12-slice pie is a mosaic nobody can read a trend from.',
    },
  },
  {
    id: 'ch4-q2',
    chapterId: '4',
    q: { zh: '以下哪种情况适合用饼图?', en: 'Which situation suits a pie chart?' },
    options: [
      { zh: '对比 12 个月的销售额高低', en: 'Comparing 12 months of sales' },
      { zh: '4 个季度占比,且 Q4 份额远超其他季度', en: 'Four quarterly shares with Q4 far ahead of the rest' },
      { zh: '展示销售额随月份的相关性', en: 'Showing month-vs-sales correlation' },
    ],
    answer: 1,
    explain: {
      zh: '饼图的安全区:不超过 5 类、差距够大、只关心谁占大头。精确比较请换排序条形图。',
      en: 'Pie’s safe zone: at most 5 categories, large gaps, readers asking only who takes the biggest slice. For precise comparison, switch to ranked bars.',
    },
  },
  {
    id: 'ch4-q3',
    chapterId: '4',
    q: { zh: '演示器里饼图把 12 个月聚合成 4 个季度,这说明了?', en: 'The demo’s pie aggregates 12 months into 4 quarters. This shows that?' },
    options: [
      { zh: '构成视角常以牺牲细节为代价', en: 'Composition views often trade detail for simplicity' },
      { zh: '聚合是作弊,永远不该做', en: 'Aggregation is cheating and must never be done' },
      { zh: '月份数据不适合任何图表', en: 'Monthly data suits no chart at all' },
    ],
    answer: 0,
    explain: {
      zh: '诚实的聚合要明示:饼图装不下 12 个答案,聚合成季度是承认边界,偷偷聚合才是作弊。',
      en: 'Honest aggregation is announced: a pie cannot hold 12 answers, so aggregating to quarters admits the limit. Silent aggregation is the cheat.',
    },
  },
  {
    id: 'ch5-q1',
    chapterId: '5',
    q: { zh: '力导向网络图里,节点颜色表达的是?', en: 'In the force-directed graph, node color encodes?' },
    options: [
      { zh: '节点的数值大小', en: 'Each node’s numeric value' },
      { zh: '分组归属:同色即同社群', en: 'Group membership: same color, same community' },
      { zh: '节点的随机装饰', en: 'Random decoration' },
    ],
    answer: 1,
    explain: {
      zh: '颜色是分类通道:同色抱团即社群,跨色连线即桥梁。这是第二章分类色的延续。',
      en: 'Color is the categorical channel: same-color clusters are communities, cross-color links are bridges — Chapter 2’s palette at work.',
    },
  },
  {
    id: 'ch5-q2',
    chapterId: '5',
    q: { zh: '只看 14 天窗口,曲线全是毛刺,最有效的下一步是?', en: 'A 14-day window shows nothing but spikes. The most effective next step?' },
    options: [
      { zh: '换一种颜色重画', en: 'Redraw it in a different color' },
      { zh: '拉长窗口并叠加 7 日均线', en: 'Stretch the window and overlay the 7-day average' },
      { zh: '把纵轴截断放大波动', en: 'Truncate the axis to magnify the wiggles' },
    ],
    answer: 1,
    explain: {
      zh: '窗口越长越能看见趋势,均线滤掉周期与噪声。结论要在短中长三档窗口下都稳定才算数。',
      en: 'Longer windows reveal trends; the average filters cycles and noise. Conclusions must hold across short, medium and long windows.',
    },
  },
  {
    id: 'ch5-q3',
    chapterId: '5',
    q: { zh: '把各省病例总数直接画成分级设色地图,错在哪里?', en: 'Coloring provinces by raw case counts is wrong because?' },
    options: [
      { zh: '颜色不够鲜艳', en: 'The colors are not vivid enough' },
      { zh: '没有除以人口:画出来的只是人口地图', en: 'No division by population — it is merely a population map' },
      { zh: '地图不该用颜色', en: 'Maps should never use color' },
    ],
    answer: 1,
    explain: {
      zh: '地图铁律:永远画比率不画总量。上色之前先除以人口、面积或基数,再用单色相渐变。',
      en: 'The map iron rule: rates, never raw counts. Divide by population, area or baseline first, then use a single-hue ramp.',
    },
  },
  {
    id: 'ch6-q1',
    chapterId: '6',
    q: { zh: '投影噪声拉满后,三簇混成一片,这告诉我们?', en: 'At full projection noise the clusters merge into soup. The lesson?' },
    options: [
      { zh: '投影图只能看相对邻近,不能读精确距离', en: 'Projections show relative neighborhood only, never exact distances' },
      { zh: '数据本身没有结构', en: 'The data has no structure at all' },
      { zh: '聚类分析没有用', en: 'Clustering is useless' },
    ],
    answer: 0,
    explain: {
      zh: '投影必有损失:轴刻度没有业务含义,方法与失真度必须报告。不交代方法的投影图不可信。',
      en: 'Projection always loses something: axis ticks carry no business meaning, and method plus distortion must be reported. A projection with no method is not to be trusted.',
    },
  },
  {
    id: 'ch6-q2',
    chapterId: '6',
    q: { zh: '读者需要精确比较词频大小时,应该选?', en: 'When readers must compare word frequencies precisely, choose?' },
    options: [
      { zh: '词云:字越大词频越高', en: 'Word cloud: bigger words, higher frequency' },
      { zh: '排序条形图:长度通道读数最准', en: 'Ranked bars: the length channel reads most accurately' },
      { zh: '把词随机排成圆形', en: 'Arrange the words randomly in a circle' },
    ],
    answer: 1,
    explain: {
      zh: '词云用面积编码词频,第二和第三谁大基本靠猜。词云只适合营造氛围,精确比较永远用条形。',
      en: 'Clouds encode frequency with area — second versus third is a guess. Clouds suit atmosphere; precise comparison always takes bars.',
    },
  },
  {
    id: 'ch6-q3',
    chapterId: '6',
    q: { zh: '四步叙事里,第三步把离群点标红的作用是?', en: 'In the four-step story, flagging the outlier in red at step 3 serves to?' },
    options: [
      { zh: '制造冲突:追问它是撒谎还是新发现', en: 'Create conflict: interrogate it — lie or discovery' },
      { zh: '把它删掉,让趋势线更直', en: 'Delete it for a straighter trend line' },
      { zh: '装饰图表,增加颜色', en: 'Decorate the chart with more color' },
    ],
    answer: 0,
    explain: {
      zh: '钩子、背景、冲突、观点:离群点被标红追问而不是悄悄删掉。删离群点不留痕,和截断坐标轴同一种不诚实。',
      en: 'Hook, context, conflict, point: the outlier is flagged, never silently deleted. Deleting outliers without a trace equals truncating an axis.',
    },
  }
];

export function getQuiz(id: string): QuizItem | undefined {
  return QUIZZES.find((q) => q.id === id);
}