import { useState } from 'react';
import type { Lang } from '../i18n/types';
import { tx } from '../content/types';
import { getQuiz } from '../content/quizzes';
import { useLang } from '../i18n/LangContext';

export function Quiz({ quizId, lang }: { quizId: string; lang: Lang }) {
  const { t } = useLang();
  const [picked, setPicked] = useState<number | null>(null);
  const quiz = getQuiz(quizId);
  if (!quiz) return null;
  const done = picked !== null;
  const ok = picked === quiz.answer;
  return (
    <div className="quiz">
      <h3>{tx(quiz.q, lang)}</h3>
      {quiz.options.map((o, i) => (
        <label className="opt" key={i}>
          <input
            type="radio"
            name={quiz.id}
            checked={picked === i}
            onChange={() => setPicked(i)}
          />
          {tx(o, lang)}
        </label>
      ))}
      {done && (
        <>
          <div className={`verdict ${ok ? 'ok' : 'no'}`}>
            {ok ? t('quiz.correct') : t('quiz.wrong')}
          </div>
          <div className="explain">{tx(quiz.explain, lang)}</div>
        </>
      )}
    </div>
  );
}