// frontend/src/pages/familias/FamiliaDetail.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography, Paper, Button, CircularProgress, Alert, Chip } from '@mui/material';
import { familiaApi } from '../../services/api';

const FamiliaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: familia, isLoading, error } = useQuery({
    queryKey: ['familia', id],
    queryFn: () => familiaApi.getFamiliaById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Erro ao carregar os dados da família
      </Alert>
    );
  }

  if (!familia) {
    return <Alert severity="warning">Família não encontrada</Alert>;
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Detalhes da Família</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/familias/editar/${id}`)}
        >
          Editar
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Informações Gerais
        </Typography>
        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={2}>
          <Box>
            <Typography variant="subtitle2">Endereço</Typography>
            <Typography>{familia.endereco}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">Bairro</Typography>
            <Typography>{familia.bairro}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">Cidade</Typography>
            <Typography>{familia.cidade}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">Telefone</Typography>
            <Typography>{familia.telefone}</Typography>
          </Box>
        </Box>

        {familia.programas_sociais && familia.programas_sociais.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle2">Programas Sociais</Typography>
            <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
              {familia.programas_sociais.map((programa: string) => (
                <Chip key={programa} label={programa} size="small" />
              ))}
            </Box>
          </Box>
        )}

        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Responsáveis
          </Typography>
          {familia.responsaveis?.map((responsavel: any) => (
            <Paper key={responsavel.id} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1">
                {responsavel.nome} - {responsavel.parentesco}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                CPF: {responsavel.cpf} | Telefone: {responsavel.telefone}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default FamiliaDetail;