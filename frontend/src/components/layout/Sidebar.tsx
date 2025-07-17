import { useState, useEffect } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Divider,
  Tooltip,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  Home as HomeIcon,
  Groups as GroupsIcon,
  People as PeopleIcon,
  Class as ClassIcon,
  EventAvailable as EventAvailableIcon,
  LocalMall as LocalMallIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 260;
const collapsedWidth = 72;

interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  roles?: string[];
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <HomeIcon />,
  },
  {
    title: 'Famílias',
    path: '/familias',
    icon: <GroupsIcon />,
    roles: ['admin', 'atendente', 'visualizador'],
  },
  {
    title: 'Membros',
    path: '/membros',
    icon: <PeopleIcon />,
    roles: ['admin', 'atendente', 'visualizador'],
  },
  {
    title: 'Turmas',
    path: '/turmas',
    icon: <ClassIcon />,
    roles: ['admin', 'atendente', 'visualizador'],
  },
  {
    title: 'Presenças',
    path: '/presencas',
    icon: <EventAvailableIcon />,
    roles: ['admin', 'atendente', 'visualizador'],
  },
  {
    title: 'Cestas Básicas',
    path: '/cestas',
    icon: <LocalMallIcon />,
    roles: ['admin', 'atendente', 'visualizador'],
  },
  {
    title: 'Relatórios',
    path: '/relatorios',
    icon: <AssessmentIcon />,
    roles: ['admin'],
  },
  {
    title: 'Configurações',
    path: '/configuracoes',
    icon: <SettingsIcon />,
    roles: ['admin'],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState(false);

  // Verifica se um item de menu está ativo
  const isActive = (path: string, exact = true) => {
    return exact ? location.pathname === path : location.pathname.startsWith(path);
  };

  // Alterna a expansão de um item do menu
  const handleExpand = (path: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  // Fecha o menu em dispositivos móveis ao navegar
  useEffect(() => {
    if (isMobile) {
      onClose();
    }
  }, [location.pathname, isMobile, onClose]);

  // Filtra os itens do menu com base nas permissões do usuário
  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.roles) return true;
    if (!user) return false;
    return item.roles.includes(user.tipo);
  });

  // Renderiza um item do menu
  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isItemActive = isActive(item.path, !hasChildren);
    const isExpanded = expandedItems[item.path] || false;

    if (hasChildren) {
      return (
        <div key={item.path}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleExpand(item.path)}
              sx={{
                pl: 2 + depth * 2,
                pr: 2,
                py: 1.25,
                color: isItemActive ? 'primary.main' : 'text.secondary',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
                '& .MuiListItemIcon-root': {
                  color: isItemActive ? 'primary.main' : 'text.secondary',
                  minWidth: 40,
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              {!collapsed && (
                <>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={500}>
                        {item.title}
                      </Typography>
                    }
                  />
                  {isExpanded ? <ExpandLess /> : <ExpandMore />}
                </>
              )}
            </ListItemButton>
          </ListItem>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map((child) => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        </div>
      );
    }

    return (
      <ListItem key={item.path} disablePadding>
        <ListItemButton
          component={RouterLink}
          to={item.path}
          selected={isItemActive}
          sx={{
            pl: 2 + depth * 2,
            pr: 2,
            py: 1.25,
            '&.Mui-selected': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              borderRight: `3px solid ${theme.palette.primary.main}`,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
              },
              '& .MuiListItemIcon-root': {
                color: theme.palette.primary.main,
              },
            },
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
            '& .MuiListItemIcon-root': {
              color: isItemActive ? theme.palette.primary.main : 'text.secondary',
              minWidth: 40,
            },
          }}
        >
          <Tooltip title={collapsed ? item.title : ''} placement="right">
            <ListItemIcon>{item.icon}</ListItemIcon>
          </Tooltip>
          {!collapsed && (
            <ListItemText
              primary={
                <Typography variant="body2" fontWeight={500}>
                  {item.title}
                </Typography>
              }
            />
          )}
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Box
      component="nav"
      sx={{
        width: { md: collapsed ? collapsedWidth : drawerWidth },
        flexShrink: { md: 0 },
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
      aria-label="menu de navegação"
    >
      {/* Sidebar para mobile */}
      <Drawer
        variant="temporary"
        open={open && isMobile}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Melhora o desempenho em dispositivos móveis
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            minHeight: 64,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src="/logo-icon.png"
              alt="Logo"
              sx={{ height: 32, mr: 1 }}
            />
            <Typography variant="h6" color="primary" fontWeight={700}>
              Social CE
            </Typography>
          </Box>
        </Box>
        <List>
          {filteredMenuItems.map((item) => renderMenuItem(item))}
        </List>
      </Drawer>

      {/* Sidebar para desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: collapsed ? collapsedWidth : drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
        open
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          {/* Cabeçalho */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              minHeight: 64,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            {!collapsed ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  component="img"
                  src="/logo-icon.png"
                  alt="Logo"
                  sx={{ height: 32, mr: 1 }}
                />
                <Typography variant="h6" color="primary" fontWeight={700}>
                  Social CE
                </Typography>
              </Box>
            ) : (
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Box
                  component="img"
                  src="/logo-icon.png"
                  alt="Logo"
                  sx={{ height: 32 }}
                />
              </Box>
            )}
            
            <IconButton
              onClick={() => setCollapsed(!collapsed)}
              size="small"
              sx={{
                display: { xs: 'none', md: 'flex' },
                backgroundColor: theme.palette.action.hover,
                '&:hover': {
                  backgroundColor: theme.palette.action.selected,
                },
              }}
            >
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
          </Box>

          {/* Conteúdo do menu */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 1 }}>
            <List>
              {filteredMenuItems.map((item) => renderMenuItem(item))}
            </List>
          </Box>

          {/* Rodapé */}
          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              textAlign: 'center',
            }}
          >
            {!collapsed && (
              <Typography variant="caption" color="text.secondary">
                v{import.meta.env.VITE_APP_VERSION || '1.0.0'}
              </Typography>
            )}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}

export default Sidebar;
