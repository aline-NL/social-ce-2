import { Box, Grid, Paper, Typography } from '@mui/material';
import {
  People as PeopleIcon,
  Home as HomeIcon,
  LocalShipping as DeliveryIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { Bar } from '@nivo/bar';
import { Pie } from '@nivo/pie';

const SummaryCard = ({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) => (
  <Paper sx={{ p: 3, height: '100%', backgroundColor: `${color}.light` }}>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography variant="h6" color="textSecondary">
          {title}
        </Typography>
        <Typography variant="h4" color="textPrimary">
          {value}
        </Typography>
      </Box>
      <Box
        sx={{
          p: 2,
          borderRadius: '50%',
          backgroundColor: `${color}.main`,
          color: 'white',
        }}
      >
        <Icon fontSize="large" />
      </Box>
    </Box>
  </Paper>
);

const Dashboard = () => {
  // Mock data - replace with real data from your API
  const summaryData = [
    { title: 'Total de Famílias', value: '156', icon: HomeIcon, color: 'primary' },
    { title: 'Total de Membros', value: '423', icon: PeopleIcon, color: 'secondary' },
    { title: 'Entregas do Mês', value: '87', icon: DeliveryIcon, color: 'success' },
    { title: 'Turmas Ativas', value: '12', icon: SchoolIcon, color: 'warning' },
  ];

  const barChartData = [
    { month: 'Jan', value: 65 },
    { month: 'Fev', value: 59 },
    { month: 'Mar', value: 80 },
    { month: 'Abr', value: 81 },
    { month: 'Mai', value: 56 },
    { month: 'Jun', value: 55 },
  ];

  const pieChartData = [
    { id: 'Cestas Básicas', label: 'Cestas Básicas', value: 35 },
    { id: 'Auxílio Emergencial', label: 'Auxílio Emergencial', value: 25 },
    { id: 'Outros', label: 'Outros', value: 40 },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Visão Geral
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryData.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <SummaryCard
              title={item.title}
              value={item.value}
              icon={item.icon}
              color={item.color as any}
            />
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Entregas por Mês
            </Typography>
            <Box sx={{ height: 350 }}>
              <Bar
                data={barChartData}
                keys={['value']}
                indexBy="month"
                margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                padding={0.3}
                colors={{ scheme: 'nivo' }}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Mês',
                  legendPosition: 'middle',
                  legendOffset: 32,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Quantidade',
                  legendPosition: 'middle',
                  legendOffset: -40,
                }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Tipos de Assistência
            </Typography>
            <Box sx={{ height: 350 }}>
              <Pie
                data={pieChartData}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ scheme: 'nivo' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor="white"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
