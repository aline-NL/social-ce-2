import { createContext, useContext, useMemo, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import { createAppTheme, Theme } from '../theme/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
}

export function ThemeProvider({ children, defaultMode = 'system' }: ThemeProviderProps) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Tenta recuperar o tema salvo no localStorage
    const savedMode = localStorage.getItem('themeMode') as ThemeMode | null;
    return savedMode || defaultMode;
  });

  // Determina se o tema atual é escuro
  const isDark = useMemo(() => {
    if (mode === 'system') {
      return prefersDarkMode;
    }
    return mode === 'dark';
  }, [mode, prefersDarkMode]);

  // Cria o tema com base no modo selecionado
  const theme = useMemo(() => {
    return createAppTheme(isDark ? 'dark' : 'light');
  }, [isDark]);

  // Salva a preferência do tema no localStorage
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  // Alterna entre os temas claro e escuro
  const toggleTheme = () => {
    setMode((prevMode) => {
      if (prevMode === 'system') {
        return prefersDarkMode ? 'light' : 'dark';
      }
      return prevMode === 'light' ? 'dark' : 'light';
    });
  };

  // Define o modo do tema explicitamente
  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  // Adiciona uma classe ao body para estilos baseados no tema
  useEffect(() => {
    const className = isDark ? 'dark-theme' : 'light-theme';
    document.body.className = className;
    
    // Adiciona atributo para estilos baseados em preferências de acessibilidade
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    
    return () => {
      document.body.className = '';
    };
  }, [isDark]);

  const contextValue = useMemo(
    () => ({
      mode,
      theme,
      isDark,
      toggleTheme,
      setThemeMode,
    }),
    [mode, theme, isDark]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
