// frontend/src/pages/NotFound.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          p: 4,
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: '4rem', sm: '6rem' },
            fontWeight: 'bold',
            mb: 2,
            color: 'primary.main',
          }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 'medium', mb: 3 }}
        >
          Página não encontrada
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: '600px', mb: 4 }}
        >
          A página que você está procurando pode ter sido removida, ter o nome alterado ou está
          temporariamente indisponível.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1.1rem',
          }}
        >
          Voltar para o Início
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;