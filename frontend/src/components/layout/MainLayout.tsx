import { useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, useTheme, useMediaQuery, CssBaseline, Toolbar } from '@mui/material';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

export function MainLayout({ children, title = 'Dashboard' }: MainLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Fecha o menu ao mudar de rota em dispositivos móveis
  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Determina o título da página com base na rota atual
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/familias')) return 'Famílias';
    if (path.startsWith('/membros')) return 'Membros';
    if (path.startsWith('/turmas')) return 'Turmas';
    if (path.startsWith('/presencas')) return 'Presenças';
    if (path.startsWith('/cestas')) return 'Cestas Básicas';
    if (path.startsWith('/relatorios')) return 'Relatórios';
    if (path.startsWith('/configuracoes')) return 'Configurações';
    return title;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Header */}
      <Header 
        onMenuClick={handleDrawerToggle} 
        title={getPageTitle()}
      />
      
      {/* Sidebar */}
      <Sidebar 
        open={mobileOpen} 
        onClose={handleDrawerToggle}
      />
      
      {/* Conteúdo principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { md: `calc(100% - 260px)` },
          ml: { md: '260px' },
          mt: '64px', // Altura do header
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: theme.palette.background.default,
        }}
      >
        {/* Toolbar vazia para compensar o espaço do AppBar fixo */}
        <Toolbar sx={{ display: { md: 'none' } }} />
        
        {/* Conteúdo da página */}
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: theme.shadows[1],
            p: { xs: 2, md: 3 },
            minHeight: '100%',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;
