import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { LineSeriesOption } from 'echarts/charts';
import type { GridComponentOption, LegendComponentOption, TooltipComponentOption } from 'echarts/components';
import { DATA_CATEGORICAL, INK } from '../styles/palette';
import type { DemoModule } from './types';

echarts.use([LineChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<
  LineSeriesOption | GridComponentOption | LegendComponentOption | TooltipComponentOption
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

/** 120 天:趋势 + 周周期 + 噪声 */
const DAYS: string[] = [];
const VALS: number[] = [];
{
  const rand = mulberry32(21);
  for (let i = 0; i < 120; i++) {
    DAYS.push(`D${i + 1}`);
    VALS.push(Math.round(50 + i * 0.35 + Math.sin(i / 3.5) * 12 + (rand() - 0.5) * 14));
  }
}
function ma7(arr: number[]): (number | null)[] {
  return arr.map((_, i) => {
    if (i < 6) return null;
    let s = 0;
    for (let k = 0; k < 7; k++) s += arr[i - k];
    return Math.round(s / 7);
  });
}

/**
 * time-window:时间窗口越长越能看见趋势,7 日均线滤掉噪声。
 * params.days: 14..120, params.ma: 'on' | 'off'
 */
export const timeWindow: DemoModule = {
  mount(el, ctx) {
    const chart = echarts.init(el);
    const n = Math.max(14, Math.min(120, Number(ctx.params.days ?? 60)));
    const showMa = String(ctx.params.ma ?? 'on') !== 'off';
    const zh = ctx.lang === 'zh';
    const days = DAYS.slice(-n);
    const vals = VALS.slice(-n);
    const series: LineSeriesOption[] = [
      {
        name: zh ? '日值' : 'daily',
        type: 'line',
        data: vals,
        showSymbol: false,
        lineStyle: { width: 1.5, color: DATA_CATEGORICAL[0], opacity: 0.65 },
      },
    ];
    if (showMa) {
      series.push({
        name: zh ? '7 日均线' : '7-day MA',
        type: 'line',
        data: ma7(vals),
        showSymbol: false,
        lineStyle: { width: 2.5, color: DATA_CATEGORICAL[3] },
      });
    }
    const option: EChartsOption = {
      color: [...DATA_CATEGORICAL],
      grid: { left: 52, right: 24, top: 44, bottom: 44 },
      legend: { top: 8, textStyle: { color: INK.secondary, fontSize: 12 } },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: days,
        axisLabel: { color: INK.secondary, hideOverlap: true, interval: 'auto' },
      },
      yAxis: {
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