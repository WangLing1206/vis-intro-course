import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { BarSeriesOption } from 'echarts/charts';
import type {
  GridComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
import { DATA_CATEGORICAL, INK, SEMANTIC } from '../styles/palette';
import type { DemoModule } from './types';

echarts.use([BarChart, GridComponent, TitleComponent, TooltipComponent, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<
  BarSeriesOption | GridComponentOption | TitleComponentOption | TooltipComponentOption
>;

const CATS = ['A', 'B', 'C'];
const VALS = [128, 142, 151];

/**
 * truncated-axis:y 轴起点从 0 切到 100,肉眼差异被放大约 5 倍。
 * params.baseline: '0' | '100'
 */
export const truncatedAxis: DemoModule = {
  mount(el, ctx) {
    const chart = echarts.init(el);
    const { lang, params } = ctx;
    const base = Number(params.baseline ?? 0);
    const cut = base > 0;

    const option: EChartsOption = {
      color: [...DATA_CATEGORICAL],
      grid: { left: 52, right: 20, top: cut ? 64 : 36, bottom: 44 },
      title: cut
        ? {
            text:
              lang === 'zh'
                ? '注意:y 轴从 100 开始,C 只比 A 高 18%,看起来却像高了 3 倍'
                : 'Warning: y starts at 100 — C is only 18% above A but looks 3x taller',
            left: 'center',
            top: 6,
            textStyle: { color: SEMANTIC.err, fontSize: 12, fontWeight: 600 },
          }
        : undefined,
      tooltip: { trigger: 'item' },
      xAxis: {
        type: 'category',
        data: CATS,
        axisLabel: { color: INK.secondary },
        axisTick: { alignWithLabel: true },
      },
      yAxis: {
        min: base,
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
          barWidth: '38%',
          label: { show: true, position: 'top', color: INK.secondary, fontSize: 12 },
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