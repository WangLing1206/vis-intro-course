/* 应用主逻辑：路由 / 语言切换 / 内容渲染 / 代码高亮 / 滚动动效 */

(function () {
  'use strict';

  const CHAPTERS = (window.COURSE_A || []).concat(window.COURSE_B || []);

  /* ---------------- 界面文案 ---------------- */
  const UI = {
    zh: {
      brand: '可视化导论',
      brandEn: 'Introduction to Visualization',
      navHome: '首页', navToc: '目录',
      heroKicker: 'COURSE · DATA VISUALIZATION',
      heroTitleA: '看见数据的',
      heroTitleB: '形状',
      heroSub: '一门可以自己动手学的《可视化导论》：知识讲解、D3 代码与实时渲染效果逐章对照，中英双语随时切换。',
      ctaStart: '开始学习', ctaToc: '浏览目录',
      heroHint: '向下滚动 · SCROLL',
      overviewLabel: '课程概览',
      overviewTitle: '像读书一样，把可视化系统地学一遍',
      overviewP1: '本网站把《可视化导论》的课程知识组织为十二章，每一章按"知识 — 代码 — 运行效果"的顺序向下展开。你可以直接阅读，也可以修改代码后在本页内对照渲染结果。',
      overviewP2: '网站为纯静态实现：不依赖后端，所有图表在浏览器中实时计算与绘制；三处交互设计（首页粒子动效、章节内可运行示例、多视图联动）覆盖了从数据变换到交互探索的完整流程。',
      statChapters: '章节', statDemos: '可交互示例', statCode: '代码块', statLang: '界面语言',
      chaptersLabel: '课程章节',
      chaptersTitle: '十二章 · 从感知到实战',
      tocTitle: '目录',
      tocLede: '全部十二章，按学习顺序排列。建议从第 1 章开始，也可以直接跳到需要的主题。',
      cardGo: '进入章节',
      prev: '上一章', next: '下一章',
      codeTitle: '代码', resultTitle: '运行效果',
      openNew: '在新窗口打开',
      footer1: '《可视化导论》课程实践学习网站',
      footer2: '静态站点 · 原生中英双语 · D3.js + Three.js',
      langBtn: 'EN'
    },
    en: {
      brand: '可视化导论',
      brandEn: 'Introduction to Visualization',
      navHome: 'Home', navToc: 'Contents',
      heroKicker: 'COURSE · DATA VISUALIZATION',
      heroTitleA: 'See the',
      heroTitleB: 'Shape of Data',
      heroSub: 'An Introduction to Visualization you can study hands-on: explanation, D3 code, and live rendering side by side, in Chinese or English.',
      ctaStart: 'Start Learning', ctaToc: 'Browse Contents',
      heroHint: 'SCROLL DOWN',
      overviewLabel: 'Overview',
      overviewTitle: 'Study visualization systematically, like reading a book',
      overviewP1: 'The course is organized into twelve chapters, each unfolding as knowledge, code, and live result. You can simply read, or edit the code and compare it against the rendered output on the same page.',
      overviewP2: 'The whole site is static: no backend, every chart computed and drawn in the browser. Three interaction layers — the particle hero, runnable in-chapter examples, and multi-view linking — cover the full path from data transformation to interactive exploration.',
      statChapters: 'Chapters', statDemos: 'Live Examples', statCode: 'Code Blocks', statLang: 'Languages',
      chaptersLabel: 'Chapters',
      chaptersTitle: 'Twelve Chapters · From Perception to Practice',
      tocTitle: 'Table of Contents',
      tocLede: 'All twelve chapters in study order. Start from chapter one, or jump straight to a topic you need.',
      cardGo: 'Open chapter',
      prev: 'Previous', next: 'Next',
      codeTitle: 'Code', resultTitle: 'Live Result',
      openNew: 'Open in new window',
      footer1: 'Introduction to Visualization · Course Practice Website',
      footer2: 'Static site · Bilingual by design · D3.js + Three.js',
      langBtn: '中文'
    }
  };

  /* ---------------- 状态 ---------------- */
  function detectLang() {
    const saved = localStorage.getItem('vis_lang');
    if (saved === 'zh' || saved === 'en') return saved;
    return (navigator.language || '').toLowerCase().indexOf('zh') === 0 ? 'zh' : 'zh';
  }
  let lang = detectLang();

  const app = document.getElementById('app');
  const sidebar = document.getElementById('sidebar');
  const progress = document.getElementById('progress-bar');
  const langBtn = document.getElementById('lang-toggle');

  /* ---------------- 工具 ---------------- */
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function inline(s) {
    return esc(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code style="font-family:var(--mono);font-size:.92em;background:#f4f4f5;padding:1px 5px;border-radius:4px">$1</code>');
  }

  const KW = 'const|let|var|function|return|if|else|for|of|in|new|await|async|class|import|from|export|this|null|true|false|undefined|default|switch|case|while';
  function highlight(code) {
    const re = new RegExp(
      '(\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*)' +
      "|('(?:\\\\.|[^'\\\\])*'|\"(?:\\\\.|[^\"\\\\])*\")" +
      '|(\\b(?:' + KW + ')\\b)' +
      '|(\\b\\d[\\d.]*\\b)' +
      '|([A-Za-z_$][\\w$]*)(?=\\s*\\()', 'g');
    let out = '', last = 0, m;
    while ((m = re.exec(code)) !== null) {
      out += esc(code.slice(last, m.index));
      const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'k' : m[4] ? 'n' : 'f';
      out += '<span class="tok-' + cls + '">' + esc(m[0]) + '</span>';
      last = m.index + m[0].length;
    }
    return out + esc(code.slice(last));
  }

  function t(key) { return UI[lang][key]; }
  function tx(o) { return typeof o === 'string' ? o : (o ? o[lang] : ''); }

  /* ---------------- 侧栏 ---------------- */
  function renderSidebar(activeId) {
    const items = CHAPTERS.map(function (c, i) {
      const no = String(i + 1).padStart(2, '0');
      return '<li><a href="#/ch/' + c.id + '" class="' +
        (c.id === activeId ? 'active' : '') + '"><span class="side-num">' + no +
        '</span><span>' + esc(tx(c[lang].title)) + '</span></a></li>';
    }).join('');
    sidebar.innerHTML = '<p class="side-title">' + (lang === 'zh' ? '课程章节' : 'Chapters') +
      '</p><ul class="side-nav">' + items + '</ul>';
  }

  /* ---------------- 区块渲染 ---------------- */
  function blockHTML(b) {
    const L = lang;
    if (b.t === 'p') return '<p class="reveal">' + inline(tx(b)) + '</p>';
    if (b.t === 'ul') {
      const li = tx(b).map(function (x) { return '<li>' + inline(x) + '</li>'; }).join('');
      return '<ul class="md-list reveal">' + li + '</ul>';
    }
    if (b.t === 'quote') return '<blockquote class="quote reveal">' + inline(tx(b)) + '</blockquote>';

    if (b.t === 'code') {
      let h = '';
      if (b.code) {
        h += '<div class="codeblock reveal">' +
          '<div class="codeblock-head"><span class="lang-tag">' + (b.lang || 'javascript') +
          '</span><span>' + t('codeTitle') + '</span></div>' +
          '<pre><code>' + highlight(b.code) + '</code></pre></div>';
      }
      if (b.demo) h += demoHTML(b);
      return h;
    }
    if (b.t === 'demo') return demoHTML(b);
    return '';
  }

  function demoHTML(b) {
    const cap = lang === 'zh' ? b.capZh : b.capEn;
    const src = b.demo + '?lang=' + lang;
    const tall = b.tall ? ' tall' : '';
    return '<figure class="demo-frame' + tall + ' reveal">' +
      '<div class="demo-frame-bar"><span class="dot r"></span><span class="dot y"></span>' +
      '<span class="dot g"></span><span class="demo-frame-title">' + esc(b.demo.split('/').pop()) +
      '</span></div>' +
      '<iframe src="' + src + '" loading="lazy" title="' + esc(cap || '') + '"></iframe>' +
      (cap ? '<figcaption class="demo-caption">' + esc(cap) + '　<a class="demo-link" style="margin:0;padding:0;border:0" href="' +
        src + '" target="_blank" rel="noopener">↗ ' + t('openNew') + '</a></figcaption>' : '') +
      '</figure>';
  }

  /* ---------------- 页面：首页 ---------------- */
  function countDemos() {
    let d = 0, c = 0;
    CHAPTERS.forEach(function (ch) {
      ch.sections.forEach(function (s) {
        s.blocks.forEach(function (b) {
          if (b.demo) d++;
          if (b.code || b.t === 'code') c++;
        });
      });
    });
    return { d: d, c: c };
  }

  function renderHome() {
    const n = countDemos();
    const first = CHAPTERS[0].id;
    const cards = CHAPTERS.map(function (c, i) {
      return '<a class="ch-card reveal" href="#/ch/' + c.id + '">' +
        '<span class="num">CH ' + String(i + 1).padStart(2, '0') + '</span>' +
        '<h3>' + esc(tx(c[lang].title)) + '</h3>' +
        '<p>' + esc(c[lang].lede) + '</p>' +
        '<span class="go">' + t('cardGo') + ' →</span></a>';
    }).join('');

    app.innerHTML =
      '<section class="hero">' +
        '<div id="hero-mount" style="position:absolute;inset:0"></div>' +
        '<div class="hero-stage"></div>' +
        '<div class="hero-overlay">' +
          '<p class="hero-kicker">' + t('heroKicker') + '</p>' +
          '<h1 class="hero-title">' + t('heroTitleA') + ' <em>' + t('heroTitleB') + '</em></h1>' +
          '<p class="hero-sub">' + t('heroSub') + '</p>' +
          '<div class="hero-cta">' +
            '<a class="btn btn-primary" href="#/ch/' + first + '">' + t('ctaStart') + '</a>' +
            '<a class="btn btn-ghost" href="#/toc">' + t('ctaToc') + '</a>' +
          '</div>' +
        '</div>' +
        '<p class="hero-hint">' + t('heroHint') + '</p>' +
      '</section>' +
      '<section class="home-intro">' +
        '<p class="section-label">' + t('overviewLabel') + '</p>' +
        '<h2 class="reveal">' + t('overviewTitle') + '</h2>' +
        '<p class="reveal">' + t('overviewP1') + '</p>' +
        '<p class="reveal">' + t('overviewP2') + '</p>' +
        '<div class="home-stats reveal">' +
          '<div class="stat"><b>' + CHAPTERS.length + '</b><span>' + t('statChapters') + '</span></div>' +
          '<div class="stat"><b>' + n.d + '</b><span>' + t('statDemos') + '</span></div>' +
          '<div class="stat"><b>' + n.c + '</b><span>' + t('statCode') + '</span></div>' +
          '<div class="stat"><b>2</b><span>' + t('statLang') + '</span></div>' +
        '</div>' +
      '</section>' +
      '<section>' +
        '<p class="section-label">' + t('chaptersLabel') + '</p>' +
        '<h2 class="home-intro" style="padding:0 0 18px">' + t('chaptersTitle') + '</h2>' +
        '<div class="chapter-cards">' + cards + '</div>' +
      '</section>';

    mountHero();
  }

  function mountHero() {
    const el = document.getElementById('hero-mount');
    if (el && window.VizHero && !window.VizHero.isMounted()) window.VizHero.init(el);
  }
  function unmountHero() {
    if (window.VizHero && window.VizHero.isMounted()) window.VizHero.destroy();
  }

  /* ---------------- 页面：目录 ---------------- */
  function renderToc() {
    const rows = CHAPTERS.map(function (c, i) {
      return '<li><a href="#/ch/' + c.id + '">' +
        '<span class="no">CH ' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span class="tt">' + esc(tx(c[lang].title)) + '</span>' +
        '<span class="dd">' + esc(c[lang].lede) + '</span></a></li>';
    }).join('');
    app.innerHTML = '<section class="toc-page">' +
      '<h1>' + t('tocTitle') + '</h1>' +
      '<p class="lede">' + t('tocLede') + '</p>' +
      '<ul class="toc-list">' + rows + '</ul></section>';
  }

  /* ---------------- 页面：章节 ---------------- */
  function renderChapter(id) {
    const idx = CHAPTERS.findIndex(function (c) { return c.id === id; });
    if (idx < 0) { location.hash = '#/'; return; }
    const c = CHAPTERS[idx];
    const no = String(idx + 1).padStart(2, '0');

    const body = c.sections.map(function (s) {
      const h = '<h2><span class="sec-no">' + s.no + '</span>' + esc(s[lang].h) + '</h2>';
      return '<section class="section">' + h +
        s.blocks.map(blockHTML).join('') + '</section>';
    }).join('');

    let nav = '';
    const prev = CHAPTERS[idx - 1], nextC = CHAPTERS[idx + 1];
    if (prev || nextC) {
      nav = '<nav class="chapter-nav">' +
        (prev ? '<a href="#/ch/' + prev.id + '"><span class="dir">← ' + t('prev') +
          '</span><div class="t">' + esc(prev[lang].title) + '</div></a>' : '<span></span>') +
        (nextC ? '<a class="next" href="#/ch/' + nextC.id + '"><span class="dir">' + t('next') +
          ' →</span><div class="t">' + esc(nextC[lang].title) + '</div></a>' : '') +
        '</nav>';
    }

    app.innerHTML = '<article class="chapter">' +
      '<header class="chapter-head">' +
        '<p class="chapter-no">CHAPTER ' + no + '</p>' +
        '<h1>' + esc(tx(c[lang].title)) + '</h1>' +
        '<p class="lede">' + esc(c[lang].lede) + '</p>' +
      '</header>' + body + nav + '</article>';
  }

  /* ---------------- 路由 ---------------- */
  function route() {
    const h = location.hash || '#/';
    unmountHero();
    if (h.indexOf('#/ch/') === 0) {
      const id = h.slice(5);
      renderSidebar(id);
      renderChapter(id);
    } else if (h === '#/toc') {
      renderSidebar('');
      renderToc();
    } else {
      renderSidebar('');
      renderHome();
    }
    window.scrollTo(0, 0);
    progress.style.width = '0%';
    observeReveal();
    if (sidebar.classList) sidebar.classList.remove('open');
  }

  /* ---------------- 滚动动效与进度条 ---------------- */
  let io = null;
  function observeReveal() {
    if (io) io.disconnect();
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els.forEach(function (e) { io.observe(e); });
  }

  window.addEventListener('scroll', function () {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  }, { passive: true });

  /* ---------------- 语言切换 ---------------- */
  function applyLang() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    langBtn.textContent = t('langBtn');
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const k = el.getAttribute('data-i18n').replace('footer.line1', 'footer1').replace('footer.line2', 'footer2');
      if (UI[lang][k]) el.textContent = UI[lang][k];
    });
    document.title = lang === 'zh'
      ? '可视化导论 · 课程实践学习网站'
      : 'Introduction to Visualization · Course Website';
  }

  langBtn.addEventListener('click', function () {
    lang = lang === 'zh' ? 'en' : 'zh';
    localStorage.setItem('vis_lang', lang);
    applyLang();
    window.dispatchEvent(new CustomEvent('vis:langchange'));
    route();
  });

  /* ---------------- 移动端菜单 ---------------- */
  const menu = document.createElement('button');
  menu.className = 'menu-btn';
  menu.textContent = '≡';
  menu.setAttribute('aria-label', 'menu');
  menu.addEventListener('click', function () { sidebar.classList.toggle('open'); });
  document.querySelector('.top-nav').insertBefore(menu, langBtn);

  /* ---------------- 启动 ---------------- */
  applyLang();
  window.addEventListener('hashchange', route);
  route();
})();
