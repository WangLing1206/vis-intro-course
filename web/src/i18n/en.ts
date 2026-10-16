import type { ZhDict } from './zh';

/** English UI strings. Keys must match zh.ts exactly. */
const en: Record<keyof ZhDict, string> = {
  'brand.name': 'Intro to Visualization',
  'brand.sub': 'Course Lab',
  'nav.home': 'Home',
  'nav.chapters': 'Chapters',
  'hero.kicker': 'INTERACTIVE COURSE · SELF-PACED',
  'hero.title': 'Learn Intro to Visualization like reading a book that moves',
  'hero.sub':
    'Six chapters where every block combines explanation, code and an interactive rendering. Drag the parameters and watch data turn into graphics, and graphics into insight.',
  'hero.cta.start': 'Start Chapter 1',
  'hero.cta.chapters': 'Browse all chapters',
  'hero.stat.chapters': 'Chapters',
  'hero.stat.blocks': 'Blocks (text + code + demo)',
  'hero.stat.lang': 'Bilingual ZH / EN',
  'home.chapters.title': 'Chapters',
  'home.chapters.sub': 'Study top-down in order. Each chapter ships interactive demos and a closing quiz.',
  'home.go': 'Open chapter',
  'home.pipeline.title': 'One pipeline, four steps to a chart',
  'home.pipeline.sub': 'Every demo on this site follows this pipeline: question first, graphics second.',
  'home.gallery.title': 'Sneak peek: interactive demos',
  'home.gallery.sub': 'Drag a parameter and watch graphics and code change together.',
  'chapter.kicker': 'Chapter {n}',
  'chapter.goals': 'Learning goals',
  'chapter.quiz.title': 'Check yourself',
  'chapter.prev': 'Previous',
  'chapter.next': 'Next',
  'demo.loading': 'Loading chart…',
  'demo.error': 'Failed to load the chart. Please refresh.',
  'code.copy': 'Copy',
  'code.copied': 'Copied',
  'code.expand': 'Expand all',
  'code.collapse': 'Collapse',
  'code.linked': 'Linked to params below',
  'quiz.correct': 'Correct',
  'quiz.wrong': 'Not quite — read the explanation',
  'footer.note':
    'Intro to Visualization · course lab · Companion reading: Chen Wei, Data Visualization · Static site on GitHub Pages',
};
export default en;