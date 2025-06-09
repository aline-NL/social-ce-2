import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  People as PeopleIcon,
  FamilyRestroom as FamilyIcon,
  ShoppingCart as ShoppingIcon,
  Diversity1 as DiversityIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { MetricCard } from '../../components/ui/MetricCard';
import { familiasApi } from '../../services/api';

interface DashboardData {
  totalFamilias: number;
  totalMembrosAtivos: number;
  totalCestasMes: number;
  totalFamiliasProgramas: number;
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await familiasApi.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Typography variant="h6">Carregando...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Metrics Grid */}
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Total de Famílias"
            value={dashboardData?.totalFamilias || 0}
            icon={<FamilyIcon sx={{ fontSize: 40 }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Membros Ativos"
            value={dashboardData?.totalMembrosAtivos || 0}
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Cestas do Mês"
            value={dashboardData?.totalCestasMes || 0}
            icon={<ShoppingIcon sx={{ fontSize: 40 }} />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Famílias com Programas Sociais"
            value={dashboardData?.totalFamiliasProgramas || 0}
            icon={<DiversityIcon sx={{ fontSize: 40 }} />}
            color="info"
          />
        </Grid>

        {/* Quick Actions Grid */}
        <Grid item xs={12}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Ações Rápidas
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Registrar Presença
                  </Typography>
                  <Typography variant="body2">
                    Marque a presença dos membros nas turmas
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => handleNavigate('/presencas')}
                  >
                    Ir para Presenças
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Entregar Cesta
                  </Typography>
                  <Typography variant="body2">
                    Registre a entrega de cestas básicas
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => handleNavigate('/cestas')}
                  >
                    Ir para Cestas
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Visualizar Relatórios
                  </Typography>
                  <Typography variant="body2">
                    Acesse relatórios detalhados
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => handleNavigate('/relatorios')}
                  >
                    Relatórios
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Cadastrar Família
                  </Typography>
                  <Typography variant="body2">
                    Cadastre novas famílias
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => handleNavigate('/familias/novo')}
                  >
                    Nova Família
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
