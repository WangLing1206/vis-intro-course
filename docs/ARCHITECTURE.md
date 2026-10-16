# 《可视化导论》课程网站 - 架构设计 v1.1

> 目标:静态双语课程站,像参考书一样可自学;首页高冲击;每知识块 = 讲解 + 代码 + 渲染效果;部署 GitHub Pages。
> v1.1 修订:正文保持黑白书感;UI 强调、图表、Hero、插图允许彩色,但必须收敛到同一套色板,风格统一。

## 1. 约束清单(来自 task.txt + 修订)

- 静态站,无后端,中英双语原生切换。
- 首页:three.js 或高质量配图,体现数据处理动效。
- 章节页:按顺序向下,知识块三段式。
- 排版:知识正文黑白灰为主,无彩色气泡包裹正文,无大黑点,上下字号不跳变,讲解简洁书感。
- 色彩:图表/可视化/Hero/插图与交互强调可以使用彩色,但全站只允许一套统一色板,禁止各章节自造配色。
- 加分:强化交互,帮助获取视觉信息。

## 2. 技术选型(ADR)

| 决策 | 选择 | 理由 | 备选 |
|---|---|---|---|
| 脚手架 | Vite + React + TypeScript | 组件复用 KnowledgeBlock,生态大,静态构建快 | Astro(文案极大时再迁) |
| 路由 | HashRouter | GitHub Pages 无服务端 rewrite,hash 零 404 | Browser+404.html 兜底 |
| 图表 | ECharts 为主 + D3/Canvas 为辅 | ECharts 交互开箱即用;D3 做感知/编码等定制 demo | 全 D3(成本高,不选) |
| 首页 3D | Three.js(懒加载) | 粒子/流场表现数据管线 | 纯 CSS/SVG(降级方案) |
| 代码高亮 | highlight.js 运行时 | 构建简单,主题可控 | shiki 构建时(后期优化再切) |
| 样式 | CSS Variables + 手写 prose + 统一色板 | 精确控制字号行高,色彩收敛一套体系,杜绝风格漂移 | Tailwind(易引入风格漂移) |
| 内容 | TS 数据文件(非裸 md) | 强制三段式结构,样式收敛,双语一一对应 | MDX(样式难收敛,不选) |
| 部署 | GitHub Actions + Pages | main 推即部署,base 自动处理 | gh-pages 分支手动推 |

## 3. 总体架构

```
                 +------------------+
                 |  HashRouter      |
                 | /#/home /#/ch/N  |
                 +--------+---------+
                          |
        +-----------------+------------------+
        |                                    |
+-------v-------+                   +--------v--------+
| Home(首页)     |                   | Chapter(章节页)  |
| Hero3D懒加载   |                   | TOC+正文流      |
| 章节入口卡片   |                   | KnowledgeBlock* |
+-------+-------+                   +--------+--------+
        |                                    |
        +------------+          +------------+
                     |          |
              +------v----------v------+
              |  Content Model  |<--+ i18n dict(zh/en)
              |  chapters/*.ts  |   | LangContext
              +------+----------+
                     |
        +------------+-------------+
        |            |             |
   +----v----+  +----v----+  +-----v-----+
   | CodeBlock| | DemoHost |  | Quiz/自测 |
   | hljs+复制 | | 注册表   |  | localStorage|
   +---------+  +----+----+  +-----------+
                     |
        +------------+------------+
        |            |            |
     ECharts       D3/Canvas   Three(仅首页)
        |            |            |
        +------------+------------+
                     |
              palette.ts(唯一色板)
```

构建输出纯静态 dist/,直接发布 Pages。

## 4. 目录结构

```text
web/
  index.html
  vite.config.ts              # base: /<repo>/,懒加载 three
  src/
    main.tsx                  # 入口,挂载 App
    App.tsx                   # Router + LangProvider + Layout
    routes.tsx                # /home /ch/:id
    i18n/
      types.ts                # Lang = zh|en
      zh.ts / en.ts           # UI 文案字典
      LangContext.tsx         # useLang(),localStorage 持久
    content/
      types.ts                # Chapter/Section/DemoSpec 类型
      chapters.ts/ch1.ts/ch2.ts/stubs.ts  # 章节按文件拆分,chapters.ts 聚合

      quizzes.ts              # 章末自测题
    components/
      Layout/Header/Footer/TOC.tsx
      KnowledgeBlock.tsx      # 三段式容器:讲解+代码+效果
      RichText.tsx            # 受控正文渲染(只允许 p/h3/ol/figure,黑白灰)
      CodeBlock.tsx           # 高亮+复制+折叠
      DemoHost.tsx            # 按 demoId 挂载,传 lang
      Controls.tsx            # Slider/Select/Dataset 切换
      Quiz.tsx
    demos/
      registry.ts             # DEMOS: Record<id, DemoModule>
      bar-line-scatter.ts     # ECharts 类
      perception-channels.ts  # D3/Canvas 类
      network-geo-time.ts
      types.ts                # mount(el,ctx)/dispose 契约
    three/
      hero.ts                 # 粒子管线+流光+鼠标斥力+滚动淡出(取色自 palette)
      HeroCanvas.tsx          # 懒加载 wrapper + 降级图 + 减动效
    styles/
      tokens.css              # 色板/字号/行高/间距(CSS 变量)
      palette.ts              # 图表与三维共用色板(TS 唯一源)
      prose.css               # 书感正文唯一入口(黑白灰)
      components.css
  public/assets/              # 封面/降级图/视频海报(统一影调)
docs/ARCHITECTURE.md highlights.md
video/script.txt audio.mp3
```

## 5. 内容模型(核心契约)

```ts
type Lang = 'zh' | 'en';
interface Chapter { id: string; index: number; title: Record<Lang,string>;
  goals: Record<Lang,string[]>; sections: Section[]; quizIds: string[] }
interface Section { id: string; title: Record<Lang,string>;
  body: Record<Lang,ProseNode[]>;   // 受控节点,非裸 md
  code?: { lang: string; source: Record<Lang,string>|string; collapsible?: boolean };
  demoId?: string; params?: ParamSpec[]; caption?: Record<Lang,string> }
type ProseNode =
  | { t:'p'; x: Record<Lang,string> }
  | { t:'h3'; x: Record<Lang,string> }
  | { t:'olist'; x: Record<Lang,string[]> }  // 只允许有序列表,杜绝大黑点
  | { t:'figure'; src: string; alt: Record<Lang,string> };
interface DemoModule { mount(el: HTMLElement, ctx:{lang:Lang;params:any}): ()=>void }
```

规则:中英同一 id,缺译编译时报错;body 只允许上述 4 节点,从源头满足排版约束。

## 6. 双语架构

- UI 文案:字典式 `t(key)`,路由不变,切换只换 LangContext + 重渲染。
- 图表内文本:DemoHost 把 lang 透传给 demo,ECharts option 由函数按 lang 生成。
- 持久化:localStorage `vis-lang`,URL `?lang=` 优先,用于分享英文链接。
- 校验脚本:对比 zh/en 的 chapter/section id 集合,不一致则构建失败。

## 7. 路由与状态

- 路由:`/#/`首页,`/#/ch/1..6`章节,`/#/ch/:id#section-id`锚点。
- 状态:LangContext(语言)+ProgressContext(已读章节,localStorage)+DemoParams(局部)。
- 章节页布局:左 TOC(桌面)/顶折叠(移动)+中正文流(最大 760px)+ Demo 区全宽卡。

## 8. 组件设计要点

- KnowledgeBlock:三段纵排,顺序 讲解->代码->效果,间距固定 24/16,禁止彩色 callout 包裹正文。
- RichText:只渲染黑白灰(正文 16/1.8,标题 20,注释 14 灰),正文字不着色,强调只用加粗。
- 色彩落点:颜色只允许出现在 Demo 图表、Hero、封面插图、链接/激活态/滑杆等交互强调,以及 Quiz 对错反馈图标。
- CodeBlock:单主题浅色,行号淡灰,一键复制,超 30 行折叠。
- DemoHost:固定高度(320~420),loading 骨架,错误兜底文案,参数条统一置顶;图表取色必须来自 palette.ts。
- Quiz:单选即时反馈(对错仅图标+语义色),不记分,只记完成态。

## 9. Demo 渲染层

- 注册表:所有可视化必须在 registry 登记,Chapter 只引用 demoId。
- 适配器:ECharts 类统一 `makeOption(lang,params)`;D3 类手动处理 enter/update/exit + resize。
- 色板强制:所有 demo(ECharts/D3/Canvas)取色必须 import 自 `styles/palette.ts`,禁止硬编码自造颜色;review 清单强制检查。
- 交互基线:每个 demo 至少 1 个可调参(Slider/Select/数据集切换)+hover 提示。
- 性能:章节内 demo 进入视口才 mount(IntersectionObserver),离开销毁。

## 10. 首页 Three.js 设计

- 场景:深海军蓝底 + 数据色粒子流 RawPoints -> 坐标轴对齐 -> 聚合成柱/线隐喻,循环播放,滚轮视差。
- 取色:粒子与连线仅使用色板中的品牌蓝 + 分类色前 3 色,保证与章节图表同源。
- 工程:`React.lazy` 懒加载 three,首屏先骨架+降级图;`prefers-reduced-motion` 直接静态帧;移动端降粒子数 1/3。
- 兜底:WebGL 不可用则显示静态封面,不阻塞进入章节。

## 11. 样式与色彩规范(tokens,本节为唯一标准)

设计原则:文本克制,色彩服务于数据。读者第一眼看到的是干净书页,第二眼才是统一鲜明的可视化。

11.1 中性体系(正文/底/线,唯一允许的正文颜色)
- --paper #FFFFFF(纸),--wash #F5F7FA(浅灰底,代码块/Demo 卡底)
- --ink #111418(正文黑),--ink-2 #4A5568(次要灰),--line #E6E8EC(分割线)
- 字:正文 16/1.8,小注 14,代码 13.5,全站三档,不新增。
- 列表:只用 ol 数字,ul 全局禁用 disc,彻底消灭大黑点。
- 卡片:1px 灰线 + 8px 圆角,无阴影堆叠,无彩色边框。

11.2 品牌强调色(交互/UI,单色系,不发散)
- --brand #2F6BFF(链接/激活 TOC/按钮/滑杆/页内锚点高亮)
- --brand-dark #1D4ED8(hover),--brand-wash #EAF0FF(浅底高亮)
- 章节封面序号、进度条、首页 CTA 统一用该蓝系。

11.3 数据分类色板(图表唯一来源,6 色,低饱和和谐 + 色盲友好倾向)
- DATA_1 #2F6BFF 蓝(与品牌同源)  DATA_2 #00A38D 青绿
- DATA_3 #E8A100 琥珀            DATA_4 #E85D4D 珊瑚红
- DATA_5 #7C5CFF 紫              DATA_6 #00B3D6 天青
- 同一数据含义全站同色(如对照组 A 恒为蓝,B 恒为珊瑚红),单图不超过 4 色。
- 顺序数据(热力/密度)用品牌蓝单色渐变 ramp,不引入多余色相。

11.4 语义色(仅 Quiz/状态图标,不进正文)
- 成功 #1F9D63,警示 #C77700,错误 #D64545。

11.5 Hero 与插图影调(风格统一的关键)
- 首页 Hero 深底 #0B1020,粒子/线条取自 11.2+11.3 前三色。
- 章节封面图统一构图:浅灰底 #F5F7FA + 数据色几何图形 + 黑字标题,6 章同一模板。
- 如引入照片素材,必须加统一 overlay(藏青 20% + 去饱和)后再用,避免杂色破坏体系。
- 图表、Hero、封面三处颜色同源,是评审时风格统一的最有力证据。

## 12. 构建与部署(Pages)

- vite.config `base: ./`(相对路径,本地与 Pages 通用,免仓库名注入),配合 HashRouter。
- Actions:push main -> npm ci -> 类型+双语校验 -> build -> upload-pages -> deploy。
- 验证:首页/6 章/中英/移动端/刷新/复制代码/无 WebGL 降级,全过才录视频。

## 13. 非功能

- 性能预算:首屏 <200KB(gzip,不含 three),three chunk 懒加载;ECharts 按需 import。
- 可访问:语义标签,图表配文字小结,键盘可达,动效可关;分类色不只靠颜色区分,须配图例文字。
- 响应式:360/768/1200 三断点,正文列 760 居中,Demo 全宽。

## 14. 内容生产管线

1. 定范例块(ch1-s1)冻结样式+色板;2. 中文填 6 章;3. Demo 逐个对 id 实现(取色走 palette);
4. 英文翻译并跑 id 校验;5. 自测题与学习目标对齐;6. 录屏前冻结内容。

## 15. 风险与对策

- three 过重:懒加载+降级+减粒子。
- Pages base 错:Actions 单点注入,本地用相对路径预览。
- 双语漂移:TS 类型+CI 校验卡死。
- 代码与效果不一致:Demo 与 CodeBlock 同源 params,改一处必改另一处,review 清单强制项。
- 色彩发散:demos 禁止硬编码颜色,CI 加 grep 检查(registry 外出现 #hex 即告警)。

## 16. 实施顺序

1. 脚手架+tokens/palette+Lang;2. Hero+首页;3. KnowledgeBlock+CodeBlock+DemoHost;
4. ch1 范例章(含 1 个彩色 demo 验证色板);5. 其余 5 章+Demos;6. Quiz+进度;
7. 英文+i18n 图表;8. 部署+验收;9. 视频+亮点文档+压缩包。