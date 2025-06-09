import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color = 'primary',
}) => {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette[color].light,
        color: theme.palette[color].contrastText,
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          {icon}
          <Typography color="inherit" gutterBottom variant="h4">
            {value}
          </Typography>
        </Box>
        <Typography color="inherit" variant="subtitle2">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};
