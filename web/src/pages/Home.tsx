import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { getChapter, getChapters } from '../content';
import { tx } from '../content/types';
import { HeroCanvas } from '../three/HeroCanvas';
import { DemoHost } from '../components/DemoHost';

const PIPELINE = [
  { n: '01', zh: '数据与任务', en: 'Data & task', dzh: '先有问题,再谈图形', den: 'Questions before graphics' },
  { n: '02', zh: '数据变换', en: 'Transform', dzh: '清洗聚合,最容易藏猫腻的一步', den: 'Where distortion hides' },
  { n: '03', zh: '视觉映射', en: 'Mapping', dzh: '数字变成位置、长度与颜色', den: 'Numbers into visual channels' },
  { n: '04', zh: '视图与交互', en: 'Interact', dzh: '让读者追问数据,而不只看图', den: 'Readers interrogate the data' },
];

const GALLERY = [
  { chapterId: '1', demoId: 'anscombe-quartet' },
  { chapterId: '1', demoId: 'truncated-axis' },
  { chapterId: '2', demoId: 'encoding-channels' },
];

export function Home() {
  const { lang, t } = useLang();
  const chapters = getChapters();
  const blocks = chapters.reduce((n, c) => n + c.sections.length, 0);
  const scrollToChapters = () => {
    document.getElementById('chapters')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <>
      <section className="hero">
        <HeroCanvas />
        <div className="hero-in">
          <span className="hero-kicker">{t('hero.kicker')}</span>
          <h1>{t('hero.title')}</h1>
          <p className="sub">{t('hero.sub')}</p>
          <div className="hero-cta">
            <Link className="btn btn-primary" to="/ch/1">
              {t('hero.cta.start')}
            </Link>
            <button className="btn btn-ghost" onClick={scrollToChapters}>
              {t('hero.cta.chapters')}
            </button>
          </div>
          <div className="hero-stats">
            <div>
              <b>{chapters.length}</b>
              <span>{t('hero.stat.chapters')}</span>
            </div>
            <div>
              <b>{blocks}</b>
              <span>{t('hero.stat.blocks')}</span>
            </div>
            <div>
              <b>ZH / EN</b>
              <span>{t('hero.stat.lang')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap">
        <h2 className="sec-title">{t('home.pipeline.title')}</h2>
        <p className="sec-sub">{t('home.pipeline.sub')}</p>
        <div className="pipe">
          {PIPELINE.map((s) => (
            <div className="pipe-step" key={s.n}>
              <span className="pipe-n">{s.n}</span>
              <b>{lang === 'zh' ? s.zh : s.en}</b>
              <span>{lang === 'zh' ? s.dzh : s.den}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap">
        <h2 className="sec-title">{t('home.gallery.title')}</h2>
        <p className="sec-sub">{t('home.gallery.sub')}</p>
        <div className="gallery">
          {GALLERY.map((g) => {
            const sec = getChapter(g.chapterId)?.sections.find((s) => s.demoId === g.demoId);
            if (!sec) return null;
            return (
              <div className="g-card" key={g.demoId}>
                <div className="g-head">
                  <b>{tx(sec.title, lang)}</b>
                  <Link to={`/ch/${g.chapterId}`}>{t('home.go')} →</Link>
                </div>
                <DemoHost demoId={g.demoId} specs={sec.params} lang={lang} />
                {sec.caption && <p className="g-cap">{tx(sec.caption, lang)}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="wrap" id="chapters">
        <h2 className="sec-title">{t('home.chapters.title')}</h2>
        <p className="sec-sub">{t('home.chapters.sub')}</p>
        <div className="cards">
          {chapters.map((c) => (
            <Link className="card" key={c.id} to={`/ch/${c.id}`}>
              <span className="card-no">{c.index}</span>
              <h3>{tx(c.title, lang)}</h3>
              <p>{tx(c.intro, lang)}</p>
              <span className="go">{t('home.go')} →</span>
            </Link>
          ))}
        </div>
        <div style={{ height: 56 }} />
      </section>
    </>
  );
}