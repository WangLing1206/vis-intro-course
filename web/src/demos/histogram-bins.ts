import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { BarSeriesOption } from 'echarts/charts';
import type { GridComponentOption, TooltipComponentOption } from 'echarts/components';
import { DATA_CATEGORICAL, INK } from '../styles/palette';
import type { DemoModule } from './types';

echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<
  BarSeriesOption | GridComponentOption | TooltipComponentOption
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

/** 200 个双峰分布样本(确定性) */
function sample(): number[] {
  const rand = mulberry32(7);
  const out: number[] = [];
  for (let i = 0; i < 200; i++) {
    const peak = rand() < 0.55 ? 35 : 70;
    const u1 = Math.max(rand(), 1e-6);
    const u2 = rand();
    const gauss = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    out.push(Math.round(peak + gauss * 9));
  }
  return out;
}
const DATA = sample();

/**
 * histogram-bins:分箱数决定你能看到几个峰。分箱太少吞掉双峰,太多全是噪声。
 * params.bins: 5..40
 */
export const histogramBins: DemoModule = {
  mount(el, ctx) {
    const chart = echarts.init(el);
    const n = Math.max(3, Math.min(40, Number(ctx.params.bins ?? 12)));
    const min = Math.min(...DATA);
    const max = Math.max(...DATA);
    const w = (max - min) / n;
    const counts = new Array(n).fill(0) as number[];
    const labels: string[] = [];
    for (let i = 0; i < n; i++) {
      const a = min + w * i;
      const b = min + w * (i + 1);
      labels.push(`${Math.round(a)}–${Math.round(b)}`);
    }
    for (const v of DATA) {
      const i = Math.min(n - 1, Math.floor((v - min) / w));
      counts[i] += 1;
    }
    const twin = DATA_CATEGORICAL[1];
    const option: EChartsOption = {
      grid: { left: 52, right: 20, top: 36, bottom: 60 },
      tooltip: { trigger: 'item' },
      xAxis: {
        type: 'category',
        data: labels,
        axisLabel: { color: INK.secondary, interval: 'auto', hideOverlap: true, rotate: n > 16 ? 45 : 0 },
        axisTick: { show: false },
      },
      yAxis: {
        axisLabel: { color: INK.secondary },
        splitLine: { lineStyle: { color: INK.line } },
      },
      series: [
        {
          type: 'bar',
          data: counts.map((c) => ({
            value: c,
            itemStyle: { color: twin, borderRadius: [4, 4, 0, 0] },
          })),
          barWidth: '80%',
        },
      ],
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