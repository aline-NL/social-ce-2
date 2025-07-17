import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  useMediaQuery,
  Divider,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  Group as GroupIcon,
  Class as ClassIcon,
  EventAvailable as EventAvailableIcon,
  LocalMall as LocalMallIcon,
  ArrowForward as ArrowForwardIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useApi } from '../hooks/useApi';

// Cores para os gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Dados de exemplo para o gráfico de presenças
const attendanceData = [
  { name: 'Seg', present: 40, absent: 10 },
  { name: 'Ter', present: 35, absent: 15 },
  { name: 'Qua', present: 45, absent: 5 },
  { name: 'Qui', present: 30, absent: 20 },
  { name: 'Sex', present: 50, absent: 0 },
];

// Dados de exemplo para o gráfico de distribuição
const distributionData = [
  { name: 'Cestas Básicas', value: 35 },
  { name: 'Kits Higiene', value: 25 },
  { name: 'Roupas', value: 20 },
  { name: 'Outros', value: 20 },
];

// Notificações recentes
const recentNotifications = [
  { 
    id: 1, 
    title: 'Nova família cadastrada', 
    description: 'Família Silva foi cadastrada no sistema',
    time: '10 min atrás',
    read: false,
    type: 'info'
  },
  { 
    id: 2, 
    title: 'Entrega de cesta atrasada', 
    description: 'A entrega da cesta para a família Oliveira está atrasada',
    time: '2 horas atrás',
    read: false,
    type: 'warning'
  },
  { 
    id: 3, 
    title: 'Presença registrada', 
    description: '25 membros confirmaram presença hoje',
    time: '1 dia atrás',
    read: true,
    type: 'success'
  },
];

export function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalFamilias: 0,
    totalMembros: 0,
    totalTurmas: 0,
    totalPresencas: 0,
    totalCestas: 0,
    metaMensal: 75,
    metaAtual: 45,
  });
  const [loading, setLoading] = useState(true);
  const api = useApi();

  // Simula o carregamento de dados da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Aqui você faria as chamadas reais para a API
        // const response = await api.get('/dashboard/stats');
        // setStats(response.data);
        
        // Dados simulados para demonstração
        setTimeout(() => {
          setStats({
            totalFamilias: 125,
            totalMembros: 423,
            totalTurmas: 8,
            totalPresencas: 287,
            totalCestas: 89,
            metaMensal: 150,
            metaAtual: 89,
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [api]);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <NotificationsIcon color="info" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      default:
        return <NotificationsIcon />;
    }
  };

  // Card de métrica
  const MetricCard = ({ title, value, icon, color, onClick }: any) => (
    <Card 
      onClick={onClick}
      sx={{ 
        height: '100%',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography color="textSecondary" variant="subtitle2">
            {title}
          </Typography>
          <Avatar
            sx={{
              backgroundColor: `${color}.light`,
              color: `${color}.dark`,
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
        </Box>
        <Typography variant="h4">
          {value}
        </Typography>
        {title === 'Cestas Entregues' && (
          <Box mt={2}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="textSecondary">
                Meta do mês: {stats.metaMensal}
              </Typography>
              <Typography variant="body2" color="primary">
                {Math.round((stats.metaAtual / stats.metaMensal) * 100)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(100, (stats.metaAtual / stats.metaMensal) * 100)} 
              color="primary"
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography>Carregando dados do dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Visão Geral
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Bem-vindo ao painel de controle do Sistema de Assistência Social
        </Typography>
      </Box>

      {/* Métricas principais */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <MetricCard
            title="Famílias Atendidas"
            value={stats.totalFamilias}
            icon={<GroupIcon />}
            color="primary"
            onClick={() => handleNavigate('/familias')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <MetricCard
            title="Membros Cadastrados"
            value={stats.totalMembros}
            icon={<PeopleIcon />}
            color="secondary"
            onClick={() => handleNavigate('/membros')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <MetricCard
            title="Turmas Ativas"
            value={stats.totalTurmas}
            icon={<ClassIcon />}
            color="success"
            onClick={() => handleNavigate('/turmas')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <MetricCard
            title="Presenças (Mês)"
            value={stats.totalPresencas}
            icon={<EventAvailableIcon />}
            color="warning"
            onClick={() => handleNavigate('/presencas')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <MetricCard
            title="Cestas Entregues"
            value={`${stats.totalCestas}/${stats.metaMensal}`}
            icon={<LocalMallIcon />}
            color="info"
            onClick={() => handleNavigate('/cestas')}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Gráfico de presenças */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader 
              title="Presenças na Semana" 
              action={
                <Button 
                  size="small" 
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => handleNavigate('/presencas')}
                >
                  Ver Tudo
                </Button>
              }
            />
            <Divider />
            <CardContent sx={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={attendanceData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" name="Presentes" fill="#4CAF50" />
                  <Bar dataKey="absent" name="Faltas" fill="#F44336" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de distribuição */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Distribuição de Benefícios" />
            <Divider />
            <CardContent sx={{ height: 350, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box width="100%" height={250}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} itens`, 'Quantidade']} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Button 
                variant="outlined" 
                color="primary" 
                size="small" 
                endIcon={<ArrowForwardIcon />}
                onClick={() => handleNavigate('/relatorios')}
                sx={{ mt: 2 }}
              >
                Ver Relatório Completo
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Notificações recentes */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Notificações Recentes" 
              action={
                <IconButton size="small">
                  <NotificationsIcon />
                </IconButton>
              }
            />
            <Divider />
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {recentNotifications.map((notification) => (
                <Box key={notification.id}>
                  <ListItem 
                    alignItems="flex-start"
                    secondaryAction={
                      <Typography variant="caption" color="textSecondary">
                        {notification.time}
                      </Typography>
                    }
                    sx={{
                      opacity: notification.read ? 0.7 : 1,
                      bgcolor: notification.read ? 'transparent' : 'action.hover',
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'transparent' }}>
                        {getIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center">
                          <Typography 
                            component="span" 
                            variant="subtitle2"
                            sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}
                          >
                            {notification.title}
                          </Typography>
                          {!notification.read && (
                            <Chip 
                              label="Nova" 
                              color="primary" 
                              size="small" 
                              sx={{ ml: 1, height: 18, fontSize: '0.65rem' }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {notification.description}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </Box>
              ))}
              <Box p={2} textAlign="center">
                <Button 
                  color="primary" 
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                >
                  Ver Todas as Notificações
                </Button>
              </Box>
            </List>
          </Card>
        </Grid>

        {/* Ações rápidas */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Ações Rápidas" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<GroupIcon />}
                    onClick={() => handleNavigate('/familias/nova')}
                    sx={{ p: 2, justifyContent: 'flex-start' }}
                  >
                    Cadastrar Nova Família
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<PeopleIcon />}
                    onClick={() => handleNavigate('/membros/novo')}
                    sx={{ p: 2, justifyContent: 'flex-start' }}
                  >
                    Adicionar Membro
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<EventAvailableIcon />}
                    onClick={() => handleNavigate('/presencas/registrar')}
                    sx={{ p: 2, justifyContent: 'flex-start' }}
                  >
                    Registrar Presenças
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<LocalMallIcon />}
                    onClick={() => handleNavigate('/cestas/entregar')}
                    sx={{ p: 2, justifyContent: 'flex-start' }}
                  >
                    Registrar Entrega de Cesta
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<ClassIcon />}
                    onClick={() => handleNavigate('/turmas/nova')}
                    sx={{ p: 2, justifyContent: 'flex-start' }}
                  >
                    Criar Nova Turma
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<AssessmentIcon />}
                    onClick={() => handleNavigate('/relatorios/gerar')}
                    sx={{ p: 2, justifyContent: 'flex-start' }}
                  >
                    Gerar Relatório
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
