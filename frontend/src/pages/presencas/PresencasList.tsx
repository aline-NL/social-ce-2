// frontend/src/pages/presencas/PresencasList.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  TablePagination,
  IconButton,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { presencaApi } from '../../services/api';

const PresencasList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['presencas', { page, rowsPerPage }],
    queryFn: () => presencaApi.listPresencas({ page: page + 1, pageSize: rowsPerPage }),
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
        Erro ao carregar a lista de presenças
      </Alert>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Controle de Presenças</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/presencas/nova')}
        >
          Nova Presença
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Membro</TableCell>
                <TableCell>Turma</TableCell>
                <TableCell>Presente</TableCell>
                <TableCell>Justificativa</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.results.map((presenca: any) => (
                <TableRow key={presenca.id}>
                  <TableCell>{new Date(presenca.data).toLocaleDateString()}</TableCell>
                  <TableCell>{presenca.membro_nome || 'N/A'}</TableCell>
                  <TableCell>{presenca.turma_nome || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={presenca.presente ? 'Sim' : 'Não'}
                      color={presenca.presente ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {presenca.justificativa || 'Nenhuma'}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => navigate(`/presencas/editar/${presenca.id}`)}
                      color="primary"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data?.count || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default PresencasList;