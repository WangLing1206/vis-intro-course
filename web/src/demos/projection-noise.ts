import * as echarts from 'echarts/core';
import { ScatterChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { ScatterSeriesOption } from 'echarts/charts';
import type { GridComponentOption, LegendComponentOption, TooltipComponentOption } from 'echarts/components';
import { DATA_CATEGORICAL, INK } from '../styles/palette';
import type { DemoModule } from './types';

echarts.use([ScatterChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<
  ScatterSeriesOption | GridComponentOption | LegendComponentOption | TooltipComponentOption
>;

function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CENTERS = [
  [2.2, 7.5],
  [7.8, 3.2],
  [6.5, 8.0],
];
const BASE: number[][][] = CENTERS.map(([cx, cy], c) => {
  const rand = mulberry32(100 + c);
  const pts: number[][] = [];
  for (let i = 0; i < 60; i++) {
    const u1 = Math.max(rand(), 1e-6);
    const u2 = rand();
    const g1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const g2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    pts.push([cx + g1 * 0.8, cy + g2 * 0.8]);
  }
  return pts;
});

/**
 * projection-noise:噪声越大,三个簇糊成一团——降维投影的信息损失直觉。
 * params.noise: 0..100
 */
export const projectionNoise: DemoModule = {
  mount(el, ctx) {
    const chart = echarts.init(el);
    const k = Math.max(0, Math.min(100, Number(ctx.params.noise ?? 20))) / 100;
    const rand = mulberry32(999);
    const zh = ctx.lang === 'zh';
    const series: ScatterSeriesOption[] = BASE.map((pts, c) => ({
      name: zh ? `簇 ${c + 1}` : `cluster ${c + 1}`,
      type: 'scatter',
      symbolSize: 8,
      data: pts.map(([x, y]) => [
        +(x + (rand() - 0.5) * k * 9).toFixed(2),
        +(y + (rand() - 0.5) * k * 9).toFixed(2),
      ]),
      itemStyle: { color: DATA_CATEGORICAL[c], opacity: 0.85 },
    }));
    const option: EChartsOption = {
      color: [...DATA_CATEGORICAL],
      grid: { left: 48, right: 20, top: 44, bottom: 44 },
      legend: { top: 8, textStyle: { color: INK.secondary, fontSize: 12 } },
      tooltip: { trigger: 'item' },
      xAxis: {
        min: 0,
        max: 10,
        axisLabel: { color: INK.secondary },
        splitLine: { lineStyle: { color: INK.line } },
      },
      yAxis: {
        min: 0,
        max: 10,
        axisLabel: { color: INK.secondary },
        splitLine: { lineStyle: { color: INK.line } },
      },
      series,
    };
    chart.setOption(option);
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(el);
    return () => {
      ro.disconnect();
      chart.dispose();
    };
  },
};