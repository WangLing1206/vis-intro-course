import type { Lang } from '../i18n/types';
import type { ParamValues } from '../content/types';

export interface DemoCtx {
  lang: Lang;
  params: ParamValues;
}

/** Demo 契约:挂载到给定元素,返回卸载函数。取色必须来自 styles/palette。 */
export interface DemoModule {
  mount: (el: HTMLElement, ctx: DemoCtx) => () => void;
}