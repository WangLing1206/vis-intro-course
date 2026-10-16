import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { LineSeriesOption } from 'echarts/charts';
import type { GridComponentOption, TooltipComponentOption } from 'echarts/components';
import { DATA_CATEGORICAL, INK } from '../styles/palette';
import type { DemoModule } from './types';

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<
  LineSeriesOption | GridComponentOption | TooltipComponentOption
>;

const DAYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const VALS = [3, 5, 9, 17, 33, 65, 129, 200, 310];

/**
 * scale-switch:同一组指数增长数据,在线性轴与对数轴下讲出不同故事。
 * params.scale: 'linear' | 'log'
 */
export const scaleSwitch: DemoModule = {
  mount(el, ctx) {
    const chart = echarts.init(el);
    const log = String(ctx.params.scale ?? 'linear') === 'log';
    const option: EChartsOption = {
      color: [...DATA_CATEGORICAL],
      grid: { left: 56, right: 24, top: 36, bottom: 44 },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: DAYS,
        name: ctx.lang === 'zh' ? '天' : 'day',
        nameTextStyle: { color: INK.secondary },
        axisLabel: { color: INK.secondary },
      },
      yAxis: {
        type: log ? 'log' : 'value',
        name: ctx.lang === 'zh' ? '用户数' : 'users',
        nameTextStyle: { color: INK.secondary },
        axisLabel: { color: INK.secondary },
        splitLine: { lineStyle: { color: INK.line } },
      },
      series: [
        {
          type: 'line',
          data: VALS,
          smooth: true,
          symbolSize: 8,
          lineStyle: { width: 3, color: DATA_CATEGORICAL[0] },
          itemStyle: { color: DATA_CATEGORICAL[0] },
          areaStyle: { color: DATA_CATEGORICAL[0], opacity: 0.08 },
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