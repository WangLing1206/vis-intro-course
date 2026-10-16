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

const CATS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const VALS = [42, 58, 35, 72, 64, 81];

/** 彩虹色板:刻意作为反面教材,明度跳变会误导顺序判读 */
const RAINBOW = ['#e41a1c', '#ff7f00', '#ffe500', '#4daf4a', '#377eb8', '#984ea3'];
const MONO = new Array(6).fill('#2F6BFF') as string[];

/**
 * palette-compare:同一组分类数据,三种配色方案。
 * params.scheme: 'site' | 'rainbow' | 'mono'
 */
export const paletteCompare: DemoModule = {
  mount(el, ctx) {
    const chart = echarts.init(el);
    const scheme = String(ctx.params.scheme ?? 'site');
    const colors = scheme === 'rainbow' ? RAINBOW : scheme === 'mono' ? MONO : [...DATA_CATEGORICAL];

    const option: EChartsOption = {
      color: colors,
      grid: { left: 52, right: 20, top: 36, bottom: 44 },
      tooltip: { trigger: 'item' },
      xAxis: {
        type: 'category',
        data: CATS,
        axisLabel: { color: INK.secondary },
        axisTick: { alignWithLabel: true },
      },
      yAxis: {
        max: 100,
        axisLabel: { color: INK.secondary },
        splitLine: { lineStyle: { color: INK.line } },
      },
      series: [
        {
          type: 'bar',
          data: VALS.map((v, i) => ({
            value: v,
            itemStyle: { color: colors[i % colors.length], borderRadius: [6, 6, 0, 0] },
          })),
          barWidth: '46%',
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