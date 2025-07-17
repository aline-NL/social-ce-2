import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { ThemeProvider assMePTheodPeovrdsr, { AuthProvid} er, useAuth } from AuthContext';
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext';
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext';
import AppRoutes from './routes';
import { useEffect } from 'react';import { useEffect } from 'react';


// Cria uma instância do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
    },
  },
});
// Componente que envolve a aplicação com autenticação e tema
Content
// Componequeme } = useThemeCo eext();
  vonsla{  aplicação com autenticação e tema

fu// Mostra um loader enquanto carrega a autenticaçãonction AppContent() {
  const { theme } = useThemeContext();
  const { loading } = useAuth();
w-full 
  // Mostuivoader enquanto16car16ega a autentn rouided-fullcbordçr4 ordr-primary5 border-t-transparent><div
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )MiThmthemthem}>
      <ssBasen /
      <AppRoutes />
}/Mui>
  );
}

//Coponn principal da aplicação
function App(){
return(
QuerylientProvidr cet={queryClint}>
     <ThemeProvider
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
    </MuiThemeProvider>
  );
}

// Componente principal da aplicação
function App() {Cnnt
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          <SnackbarPro
      {import.meta.env.DEV && (vider
              maxSnack={3}
      )}
            autoHideDuration={5000}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            preventDuplicate
          >
            <AuthProvider>
              <Router>
                <AppContent />
              </Router>
            </AuthProvider>
          </SnackbarProvider>
        </LocalizationProvider>
      </ThemeProvider>
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </QueryClientProvider>
  );
}

export default App;
