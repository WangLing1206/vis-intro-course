import { LangProvider } from './i18n/LangContext';
import { AppRoutes } from './routes';

export default function App() {
  return (
    <LangProvider>
      <AppRoutes />
    </LangProvider>
  );
}