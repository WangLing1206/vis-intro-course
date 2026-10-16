/**
 * 统一色板:全站图表/三维/插图的唯一取色源。
 * ECharts / D3 / Canvas / Three 一律从这里 import,禁止在 demo 内硬编码颜色。
 * (CSS 侧镜像见 tokens.css,改一处必须同步另一处)
 */
export const BRAND = {
  main: '#2F6BFF',
  dark: '#1D4ED8',
  wash: '#EAF0FF',
} as const;

/** 数据分类色,6 色,低饱和和谐;同一数据含义全站同色,单图不超过 4 色 */
export const DATA_CATEGORICAL = [
  '#2F6BFF', // 蓝:与品牌同源,默认第一序列 / 对照组 A
  '#00A38D', // 青绿
  '#E8A100', // 琥珀
  '#E85D4D', // 珊瑚红:对照组 B / 强调异常
  '#7C5CFF', // 紫
  '#00B3D6', // 天青
] as const;

/** 顺序色板:热力/密度等单变量渐变,只用品牌蓝 ramp,不引入杂色相 */
export const DATA_SEQUENTIAL = [
  '#EAF0FF',
  '#B9C8FF',
  '#7E99FF',
  '#2F6BFF',
  '#1D4ED8',
] as const;

export const SEMANTIC = {
  ok: '#1F9D63',
  warn: '#C77700',
  err: '#D64545',
} as const;

export const HERO = {
  bg: '#0B1020',
  /** 粒子/连线只用这三色:品牌蓝 + 分类前两色,保证与章节图表同源 */
  particle: ['#2F6BFF', '#00A38D', '#00B3D6'] as const,
} as const;

export const INK = {
  main: '#111418',
  secondary: '#4A5568',
  faint: '#8A94A6',
  line: '#E6E8EC',
} as const;

/** ECharts 通用取色:直接赋给 option.color */
export function echartsPalette(n = 6): string[] {
  return DATA_CATEGORICAL.slice(0, Math.max(1, Math.min(6, n))) as unknown as string[];
}