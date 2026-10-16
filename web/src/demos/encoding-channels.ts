import * as echarts from 'echarts/core';
import { BarChart, PieChart, ScatterChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { BarSeriesOption, PieSeriesOption, ScatterSeriesOption } from 'echarts/charts';
import type { GridComponentOption, TooltipComponentOption } from 'echarts/components';
import { DATA_CATEGORICAL, INK } from '../styles/palette';
import type { DemoModule } from './types';

echarts.use([BarChart, PieChart, ScatterChart, GridComponent, TooltipComponent, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<
  | BarSeriesOption
  | PieSeriesOption
  | ScatterSeriesOption
  | GridComponentOption
  | TooltipComponentOption
>;

const CATS = ['A', 'B', 'C', 'D', 'E'];
const VALS = [12, 28, 45, 70, 96];

/**
 * encoding-channels:同一组数,四种视觉编码,读数难度天差地别。
 * params.encoding: 'position' | 'length' | 'area' | 'angle'
 */
export const encodingChannels: DemoModule = {
  mount(el, ctx) {
    const chart = echarts.init(el);
    const enc = String(ctx.params.encoding ?? 'position');

    const base = {
      color: [...DATA_CATEGORICAL],
      tooltip: { trigger: 'item' as const },
      textStyle: { fontFamily: 'inherit' },
    };

    let option: EChartsOption;
    if (enc === 'length') {
      option = {
        ...base,
        grid: { left: 52, right: 20, top: 36, bottom: 44 },
        xAxis: {
          type: 'category',
          data: CATS,
          axisLabel: { color: INK.secondary },
          axisTick: { alignWithLabel: true },
        },
        yAxis: {
          min: 0,
          max: 100,
          axisLabel: { color: INK.secondary },
          splitLine: { lineStyle: { color: INK.line } },
        },
        series: [
          {
            type: 'bar',
            data: VALS.map((v, i) => ({
              value: v,
              itemStyle: { color: DATA_CATEGORICAL[i], borderRadius: [6, 6, 0, 0] },
            })),
            barWidth: '44%',
          },
        ],
      };
    } else if (enc === 'area') {
      option = {
        ...base,
        grid: { left: 40, right: 40, top: 36, bottom: 44 },
        xAxis: {
          type: 'category',
          data: CATS,
          axisLabel: { color: INK.secondary, fontSize: 13 },
          axisLine: { show: false },
          axisTick: { show: false },
        },
        yAxis: { show: false, min: 0, max: 1 },
        series: [
          {
            type: 'scatter',
            data: VALS.map((v) => ({ value: [0, 0.55, v] })),
            symbolSize: (v: unknown) =>
              Math.sqrt((Array.isArray(v) ? Number(v[2]) : 0) / Math.PI) * 9,
            itemStyle: { opacity: 0.85 },
            label: { show: true, formatter: '{@[2]}', color: INK.main, fontSize: 12 },
          },
        ],
      };
      // 面积模式需要逐类着色
      const s = option.series as ScatterSeriesOption[];
      s[0].data = VALS.map((v, i) => ({
        value: [CATS[i], 0.55, v],
        itemStyle: { color: DATA_CATEGORICAL[i] },
      }));
    } else if (enc === 'angle') {
      option = {
        ...base,
        series: [
          {
            type: 'pie',
            radius: ['0%', '62%'],
            center: ['50%', '54%'],
            data: VALS.map((v, i) => ({ value: v, name: CATS[i] })),
            label: { color: INK.main, fontSize: 12, formatter: '{b}: {c}' },
            itemStyle: { borderColor: '#fff', borderWidth: 2 },
          },
        ],
      };
    } else {
      option = {
        ...base,
        grid: { left: 52, right: 24, top: 36, bottom: 44 },
        xAxis: {
          min: 0,
          max: 100,
          axisLabel: { color: INK.secondary },
          splitLine: { lineStyle: { color: INK.line } },
        },
        yAxis: {
          type: 'category',
          data: CATS,
          axisLabel: { color: INK.secondary },
          axisTick: { show: false },
        },
        series: [
          {
            type: 'scatter',
            symbolSize: 14,
            data: VALS.map((v, i) => ({
              value: [v, CATS[i]],
              itemStyle: { color: DATA_CATEGORICAL[i] },
            })),
          },
        ],
      };
    }
    chart.setOption(option);

    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(el);
    return () => {
      ro.disconnect();
      chart.dispose();
    };
  },
};