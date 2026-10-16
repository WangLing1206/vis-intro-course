import * as echarts from 'echarts/core';
import { ScatterChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { ScatterSeriesOption } from 'echarts/charts';
import type {
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
import { DATA_CATEGORICAL, INK } from '../styles/palette';
import type { DemoModule } from './types';

echarts.use([
  ScatterChart,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TooltipComponent,
  CanvasRenderer,
]);

type EChartsOption = echarts.ComposeOption<
  ScatterSeriesOption | GridComponentOption | LegendComponentOption | TooltipComponentOption
>;

/** 安斯库姆四重奏原始数据 */
const GROUPS: { x: number[]; y: number[] }[] = [
  {
    x: [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5],
    y: [8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68],
  },
  {
    x: [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5],
    y: [9.14, 8.14, 8.74, 8.77, 9.26, 8.1, 6.13, 3.1, 9.13, 7.26, 4.74],
  },
  {
    x: [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5],
    y: [7.46, 6.77, 12.74, 7.11, 7.81, 8.84, 6.08, 5.39, 8.15, 6.42, 5.73],
  },
  {
    x: [8, 8, 8, 8, 8, 8, 8, 19, 8, 8, 8],
    y: [6.58, 5.76, 7.71, 8.84, 8.47, 7.04, 5.25, 12.5, 5.56, 7.91, 6.89],
  },
];
const ROMAN = ['I', 'II', 'III', 'IV'];

/**
 * anscombe-quartet:四组统计量几乎相同、形态迥异的散点 + 同一条回归线。
 * params.group: 'all' | '0' | '1' | '2' | '3'
 */
export const anscombeQuartet: DemoModule = {
  mount(el, ctx) {
    const chart = echarts.init(el);
    const { lang, params } = ctx;
    const g = String(params.group ?? 'all');
    const show: number[] = g === 'all' ? [0, 1, 2, 3] : [Number(g)];

    const names = ROMAN.map((r) =>
      lang === 'zh' ? `第 ${r} 组` : `Group ${r}`,
    );
    const series: ScatterSeriesOption[] = show.map((gi, k) => ({
      name: names[gi],
      type: 'scatter',
      data: GROUPS[gi].x.map((x, i) => [x, GROUPS[gi].y[i]]),
      symbolSize: 10,
      itemStyle: { color: DATA_CATEGORICAL[gi], opacity: 0.9 },
      // 回归线 y = 3 + 0.5x:四组几乎重合,只在第一条序列上画一次
      ...(k === 0
        ? {
            markLine: {
              symbol: 'none',
              lineStyle: { color: INK.secondary, type: 'dashed', width: 1.5 },
              label: {
                formatter: lang === 'zh' ? '回归线 y=3+0.5x' : 'y = 3 + 0.5x',
                color: INK.secondary,
                fontSize: 12,
              },
              data: [[{ coord: [2, 4] }, { coord: [20, 13] }]],
            },
          }
        : {}),
    }));

    const option: EChartsOption = {
      color: [...DATA_CATEGORICAL],
      grid: { left: 52, right: 20, top: 44, bottom: 44 },
      tooltip: {
        trigger: 'item',
        valueFormatter: (v) => (typeof v === 'number' ? v.toFixed(2) : String(v)),
      },
      legend: {
        top: 8,
        textStyle: { color: INK.secondary, fontSize: 12 },
      },
      xAxis: {
        name: 'x',
        min: 2,
        max: 20,
        nameTextStyle: { color: INK.secondary },
        axisLabel: { color: INK.secondary },
        splitLine: { lineStyle: { color: INK.line } },
      },
      yAxis: {
        name: 'y',
        min: 2,
        max: 13,
        nameTextStyle: { color: INK.secondary },
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