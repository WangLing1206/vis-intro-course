import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart, ScatterChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { BarSeriesOption, LineSeriesOption, PieSeriesOption, ScatterSeriesOption } from 'echarts/charts';
import type { GridComponentOption, TooltipComponentOption } from 'echarts/components';
import { DATA_CATEGORICAL, INK } from '../styles/palette';
import type { DemoModule } from './types';

echarts.use([BarChart, LineChart, PieChart, ScatterChart, GridComponent, TooltipComponent, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
  | ScatterSeriesOption
  | GridComponentOption
  | TooltipComponentOption
>;

const MONTHS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const SALES = [42, 38, 51, 47, 62, 58, 74, 81, 69, 88, 95, 112];

/**
 * chart-switcher:同一份月度销售,比较/趋势/构成/关系四种视角。
 * params.mode: 'bar' | 'line' | 'pie' | 'scatter'
 */
export const chartSwitcher: DemoModule = {
  mount(el, ctx) {
    const chart = echarts.init(el);
    const mode = String(ctx.params.mode ?? 'bar');
    const unit = ctx.lang === 'zh' ? '销售额(万)' : 'sales(10k)';

    const catAxis = {
      type: 'category' as const,
      data: MONTHS,
      name: ctx.lang === 'zh' ? '月' : 'mo',
      nameTextStyle: { color: INK.secondary },
      axisLabel: { color: INK.secondary },
      axisTick: { alignWithLabel: true },
    };
    const valAxis = {
      name: unit,
      nameTextStyle: { color: INK.secondary },
      axisLabel: { color: INK.secondary },
      splitLine: { lineStyle: { color: INK.line } },
    };

    let option: EChartsOption;
    const base = { color: [...DATA_CATEGORICAL], tooltip: { trigger: 'item' as const } };
    if (mode === 'line') {
      option = {
        ...base,
        grid: { left: 60, right: 24, top: 36, bottom: 48 },
        xAxis: catAxis,
        yAxis: valAxis,
        series: [
          {
            type: 'line',
            data: SALES,
            smooth: true,
            symbolSize: 7,
            lineStyle: { width: 3, color: DATA_CATEGORICAL[0] },
            itemStyle: { color: DATA_CATEGORICAL[0] },
            areaStyle: { color: DATA_CATEGORICAL[0], opacity: 0.08 },
          },
        ],
      };
    } else if (mode === 'pie') {
      const q = [0, 1, 2, 3].map((i) => SALES[i * 3] + SALES[i * 3 + 1] + SALES[i * 3 + 2]);
      option = {
        ...base,
        series: [
          {
            type: 'pie',
            radius: ['38%', '62%'],
            center: ['50%', '54%'],
            data: q.map((v, i) => ({ value: v, name: `Q${i + 1}` })),
            label: { color: INK.main, formatter: '{b}: {c}' },
            itemStyle: { borderColor: '#fff', borderWidth: 2 },
          },
        ],
      };
    } else if (mode === 'scatter') {
      option = {
        ...base,
        grid: { left: 60, right: 24, top: 36, bottom: 48 },
        xAxis: {
          min: 1,
          max: 12,
          name: ctx.lang === 'zh' ? '月' : 'mo',
          nameTextStyle: { color: INK.secondary },
          axisLabel: { color: INK.secondary },
          splitLine: { lineStyle: { color: INK.line } },
        },
        yAxis: valAxis,
        series: [
          {
            type: 'scatter',
            symbolSize: 12,
            data: SALES.map((v, i) => ({ value: [i + 1, v] })),
            itemStyle: { color: DATA_CATEGORICAL[0], opacity: 0.9 },
          },
        ],
      };
    } else {
      option = {
        ...base,
        grid: { left: 60, right: 24, top: 36, bottom: 48 },
        xAxis: catAxis,
        yAxis: valAxis,
        series: [
          {
            type: 'bar',
            data: SALES.map((v) => ({
              value: v,
              itemStyle: { color: DATA_CATEGORICAL[0], borderRadius: [4, 4, 0, 0] },
            })),
            barWidth: '55%',
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