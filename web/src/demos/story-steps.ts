import * as echarts from 'echarts/core';
import { ScatterChart } from 'echarts/charts';
import { GridComponent, MarkLineComponent, MarkPointComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { ScatterSeriesOption } from 'echarts/charts';
import type { GridComponentOption, TitleComponentOption, TooltipComponentOption } from 'echarts/components';
import { DATA_CATEGORICAL, INK } from '../styles/palette';
import type { DemoModule } from './types';

echarts.use([ScatterChart, GridComponent, MarkLineComponent, MarkPointComponent, TitleComponent, TooltipComponent, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<
  ScatterSeriesOption | GridComponentOption | TitleComponentOption | TooltipComponentOption
>;

const PTS: [number, number][] = [
  [2, 3.1], [3, 4.2], [4, 4.8], [5, 6.1], [6, 6.9], [7, 8.2], [8, 8.8], [9, 10.1], [10, 10.9], [11, 4.0],
];

const TITLES = [
  { zh: '第 1 步:只给你看原始散点', en: 'Step 1: raw scatter only' },
  { zh: '第 2 步:叠加趋势线——整体向上', en: 'Step 2: add the trend — rising overall' },
  { zh: '第 3 步:揪出离群点——它在撒谎吗?', en: 'Step 3: flag the outlier — is it lying?' },
  { zh: '第 4 步:结论——去掉离群点,趋势更可信', en: 'Step 4: takeaway — the trend holds without it' },
];

/**
 * story-steps:四步叙事,同一张散点讲出完整故事。
 * params.step: '1' | '2' | '3' | '4'
 */
export const storySteps: DemoModule = {
  mount(el, ctx) {
    const chart = echarts.init(el);
    const step = Math.max(1, Math.min(4, Number(ctx.params.step ?? 1)));
    const zh = ctx.lang === 'zh';
    const main = PTS.slice(0, 9);
    const outlier = PTS[9];

    const series: ScatterSeriesOption = {
      type: 'scatter',
      symbolSize: 11,
      data: step >= 3 ? main.map((p) => ({ value: p })) : PTS.map((p) => ({ value: p })),
      itemStyle: { color: DATA_CATEGORICAL[0], opacity: 0.9 },
    };
    if (step >= 2) {
      series.markLine = {
        symbol: 'none',
        lineStyle: { color: INK.secondary, type: 'dashed', width: 1.5 },
        label: { formatter: zh ? '趋势' : 'trend', color: INK.secondary, fontSize: 12 },
        data: [[{ coord: [1.5, 2.6] }, { coord: [11.5, 11.6] }]],
      };
    }
    const seriesArr: ScatterSeriesOption[] = [series];
    if (step >= 3) {
      seriesArr.push({
        type: 'scatter',
        symbolSize: 16,
        data: [{ value: outlier }],
        itemStyle: { color: DATA_CATEGORICAL[3] },
      });
    }

    const option: EChartsOption = {
      color: [...DATA_CATEGORICAL],
      grid: { left: 52, right: 24, top: 56, bottom: 44 },
      title: {
        text: zh ? TITLES[step - 1].zh : TITLES[step - 1].en,
        left: 'center',
        top: 8,
        textStyle: { color: INK.main, fontSize: 13, fontWeight: 600 },
      },
      tooltip: { trigger: 'item' },
      xAxis: {
        min: 1,
        max: 12,
        axisLabel: { color: INK.secondary },
        splitLine: { lineStyle: { color: INK.line } },
      },
      yAxis: {
        min: 2,
        max: 12,
        axisLabel: { color: INK.secondary },
        splitLine: { lineStyle: { color: INK.line } },
      },
      series: seriesArr,
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