import type { Lang, Text } from '../i18n/types';

export type ProseNode =
  | { t: 'p'; x: Text }
  | { t: 'h3'; x: Text }
  | { t: 'olist'; x: Record<Lang, string[]> }
  | { t: 'figure'; src: string; alt: Text };

export interface ParamSpec {
  key: string;
  kind: 'select' | 'slider';
  label: Text;
  options?: { value: string; label: Text }[];
  min?: number;
  max?: number;
  step?: number;
  default: string | number;
  /** value -> 代码片段:代码联动时 {{key}} 会被替换为这里的文本(无则用原始值) */
  code?: Record<string, string>;
}
export type ParamValues = Record<string, string | number>;

export interface Section {
  id: string;
  title: Text;
  body: ProseNode[];
  code?: { lang: string; source: string | Text; collapsible?: boolean };
  demoId?: string;
  params?: ParamSpec[];
  caption?: Text;
}

export interface Chapter {
  id: string;
  index: number;
  title: Text;
  intro: Text;
  goals: Text[];
  sections: Section[];
  quizIds: string[];
}

export interface QuizItem {
  id: string;
  chapterId: string;
  q: Text;
  options: Text[];
  answer: number;
  explain: Text;
}

export function tx(t: Text, lang: Lang): string {
  return t[lang];
}

/** 代码联动:把源码中的 {{key}} 替换为当前参数对应的代码片段 */
export function renderCode(source: string, specs: ParamSpec[], values: ParamValues): string {
  return source.replace(/\{\{(\w+)\}\}/g, (_m, key: string) => {
    const spec = specs.find((s) => s.key === key);
    const v = String(values[key] ?? spec?.default ?? '');
    return spec?.code?.[v] ?? v;
  });
}