import * as echarts from 'echarts/core';
import { GraphChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { GraphSeriesOption } from 'echarts/charts';
import type { TooltipComponentOption } from 'echarts/components';
import { DATA_CATEGORICAL, INK } from '../styles/palette';
import type { DemoModule } from './types';

echarts.use([GraphChart, TooltipComponent, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<GraphSeriesOption | TooltipComponentOption>;

const NAMES = ['数分', '可视化', '前端', '后端', '算法', '产品', '设计', '测试', '运维', '数据', '交互', '叙事'];
const NAMES_EN = ['analysis', 'vis', 'frontend', 'backend', 'algo', 'pm', 'design', 'qa', 'ops', 'data', 'ixd', 'story'];
const GROUPS = [0, 0, 1, 1, 0, 2, 2, 1, 1, 0, 2, 2];
const EDGES: [number, number][] = [
  [0, 1], [0, 4], [0, 9], [1, 2], [1, 10], [1, 11], [2, 3], [2, 6],
  [3, 8], [3, 7], [4, 9], [5, 6], [5, 10], [6, 10], [10, 11], [5, 11],
];

/**
 * force-network:可拖拽的力导向图。斥力决定网络是抱团还是散开。
 * params.repel: 50..300
 */
export const forceNetwork: DemoModule = {
  mount(el, ctx) {
    const chart = echarts.init(el);
    const repel = Math.max(30, Math.min(400, Number(ctx.params.repel ?? 120)));
    const zh = ctx.lang === 'zh';
    const option: EChartsOption = {
      color: [...DATA_CATEGORICAL],
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'graph',
          layout: 'force',
          roam: true,
          draggable: true,
          force: { repulsion: repel, edgeLength: 90, gravity: 0.12 },
          label: { show: true, color: INK.main, fontSize: 12 },
          lineStyle: { color: INK.faint, width: 1.2 },
          emphasis: { focus: 'adjacency', lineStyle: { width: 2.5 } },
          data: NAMES.map((n, i) => ({
            name: zh ? n : NAMES_EN[i],
            value: 1,
            symbolSize: 30 + (i % 3) * 8,
            category: GROUPS[i],
            itemStyle: { color: DATA_CATEGORICAL[GROUPS[i]] },
          })),
          links: EDGES.map(([s, t]) => ({ source: s, target: t })),
          categories: [0, 1, 2].map((c) => ({ name: String(c) })),
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