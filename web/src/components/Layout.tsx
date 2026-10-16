import { Link, NavLink, Outlet } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';

function LangSwitch() {
  const { lang, setLang } = useLang();
  return (
    <div className="lang-sw" role="group" aria-label="language">
      <button className={lang === 'zh' ? 'on' : ''} onClick={() => setLang('zh')}>
        中文
      </button>
      <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>
        EN
      </button>
    </div>
  );
}

export function Layout() {
  const { t } = useLang();
  return (
    <>
      <header className="topbar">
        <div className="topbar-in">
          <Link className="brand" to="/">
            <span className="brand-dot" />
            {t('brand.name')}
          </Link>
          <nav className="nav">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              {t('nav.home')}
            </NavLink>
            <NavLink to="/ch/1" className={({ isActive }) => (isActive ? 'active hide-sm' : 'hide-sm')}>
              {t('nav.chapters')}
            </NavLink>
            <LangSwitch />
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="wrap">{t('footer.note')}</div>
      </footer>
    </>
  );
}