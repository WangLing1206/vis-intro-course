import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { getChapter, getNeighbor } from '../content';
import { tx } from '../content/types';
import { KnowledgeBlock } from '../components/KnowledgeBlock';
import { TOC } from '../components/TOC';
import { Quiz } from '../components/Quiz';

export function ChapterPage() {
  const { id = '1' } = useParams();
  const { lang, t } = useLang();
  const ch = getChapter(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!ch) {
    return (
      <div className="wrap">
        <p style={{ padding: '48px 0' }}>
          <Link to="/">← {t('nav.home')}</Link>
        </p>
      </div>
    );
  }
  const { prev, next } = getNeighbor(id);
  return (
    <div className="wrap">
      <div className="ch-head">
        <div className="kicker">{t('chapter.kicker', { n: ch.index })}</div>
        <h1>{tx(ch.title, lang)}</h1>
        <div className="goals">
          <b>{t('chapter.goals')}: </b>
          {ch.goals.map((g) => tx(g, lang)).join(lang === 'zh' ? '；' : '; ')}
        </div>
      </div>
      <div className="ch-layout">
        <TOC sections={ch.sections} lang={lang} />
        <div>
          {ch.sections.map((s) => (
            <KnowledgeBlock key={s.id} section={s} lang={lang} />
          ))}
          {ch.quizIds.length > 0 && (
            <>
              <h2 className="sec-title">{t('chapter.quiz.title')}</h2>
              {ch.quizIds.map((qid) => (
                <Quiz key={qid} quizId={qid} lang={lang} />
              ))}
            </>
          )}
          <div className="pagenav">
            {prev ? (
              <Link to={`/ch/${prev.id}`}>
                <small>← {t('chapter.prev')}</small>
                {tx(prev.title, lang)}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link to={`/ch/${next.id}`}>
                <small>{t('chapter.next')} →</small>
                {tx(next.title, lang)}
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}