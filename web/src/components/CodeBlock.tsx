import { useMemo, useState } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import { useLang } from '../i18n/LangContext';

if (!hljs.getLanguage('javascript')) hljs.registerLanguage('javascript', javascript);
if (!hljs.getLanguage('typescript')) hljs.registerLanguage('typescript', typescript);

export function CodeBlock({
  codeLang,
  source,
  linked,
}: {
  codeLang: string;
  source: string;
  linked?: boolean;
}) {
  const { t } = useLang();
  const lines = useMemo(() => source.split('\n').length, [source]);
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => {
    try {
      return hljs.highlight(source, { language: codeLang }).value;
    } catch {
      return hljs.highlightAuto(source).value;
    }
  }, [source, codeLang]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(source);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = source;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`codeblock${collapsed ? ' collapsed' : ''}`}>
      <div className="codeblock-bar">
        <span className="lang">{codeLang}</span>
        {linked && <span className="linked">{t('code.linked')}</span>}
        {lines > 30 && (
          <button onClick={() => setCollapsed((c) => !c)}>
            {collapsed ? t('code.expand') : t('code.collapse')}
          </button>
        )}
        <button onClick={copy}>{copied ? t('code.copied') : t('code.copy')}</button>
      </div>
      <pre>
        <code className="hljs" dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}