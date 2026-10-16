import { ZH_CHAPTERS } from './chapters';
import type { Chapter } from './types';

/** 全站章节唯一入口(中英双语内联,天然保证 id 一一对应) */
export function getChapters(): Chapter[] {
  return ZH_CHAPTERS;
}

export function getChapter(id: string): Chapter | undefined {
  return ZH_CHAPTERS.find((c) => c.id === id);
}

export function getNeighbor(id: string): { prev?: Chapter; next?: Chapter } {
  const i = ZH_CHAPTERS.findIndex((c) => c.id === id);
  return { prev: ZH_CHAPTERS[i - 1], next: ZH_CHAPTERS[i + 1] };
}