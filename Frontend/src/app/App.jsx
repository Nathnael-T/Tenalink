import { AuthProvider } from './providers/AuthContext';
import { LanguageProvider } from './providers/LanguageContext';
import { AppRouter } from './Router';


function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppRouter />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
