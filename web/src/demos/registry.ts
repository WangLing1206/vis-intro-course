import type { DemoModule } from './types';

/** 异步注册表:章节只引用 demoId,实现按需动态 import(减首屏包体积) */
const loaders: Record<string, () => Promise<DemoModule>> = {
  'anscombe-quartet': () => import('./anscombe-quartet').then((m) => m.anscombeQuartet),
  'truncated-axis': () => import('./truncated-axis').then((m) => m.truncatedAxis),
  'encoding-channels': () => import('./encoding-channels').then((m) => m.encodingChannels),
  'palette-compare': () => import('./palette-compare').then((m) => m.paletteCompare),
  'scale-switch': () => import('./scale-switch').then((m) => m.scaleSwitch),
  'histogram-bins': () => import('./histogram-bins').then((m) => m.histogramBins),
  'chart-switcher': () => import('./chart-switcher').then((m) => m.chartSwitcher),
  'force-network': () => import('./force-network').then((m) => m.forceNetwork),
  'time-window': () => import('./time-window').then((m) => m.timeWindow),
  'projection-noise': () => import('./projection-noise').then((m) => m.projectionNoise),
  'story-steps': () => import('./story-steps').then((m) => m.storySteps),
};

export function loadDemo(id: string): Promise<DemoModule> {
  const fn = loaders[id];
  return fn ? fn() : Promise.reject(new Error(`unknown demo: ${id}`));
}