// frontend/src/pages/turmas/TurmasList.tsx
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
  Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { turmaApi } from '../../services/api';

const TurmasList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['turmas', { page, rowsPerPage }],
    queryFn: () => turmaApi.listTurmas({ page: page + 1, pageSize: rowsPerPage }),
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
        Erro ao carregar a lista de turmas
      </Alert>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Turmas</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/turmas/nova')}
        >
          Nova Turma
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Idade Mínima</TableCell>
                <TableCell>Idade Máxima</TableCell>
                <TableCell>Dias da Semana</TableCell>
                <TableCell>Horário</TableCell>
                <TableCell>Ativa</TableCell>
                <TableCell>Membros</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.results.map((turma: any) => (
                <TableRow
                  key={turma.id}
                  hover
                  onClick={() => navigate(`/turmas/${turma.id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{turma.nome}</TableCell>
                  <TableCell>{turma.idade_minima} anos</TableCell>
                  <TableCell>{turma.idade_maxima} anos</TableCell>
                  <TableCell>
                    <Box display="flex" gap={0.5} flexWrap="wrap">
                      {turma.dias_semana?.map((dia: string) => (
                        <Chip key={dia} label={dia} size="small" />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>{turma.horario_inicio} - {turma.horario_fim}</TableCell>
                  <TableCell>
                    <Chip
                      label={turma.ativa ? 'Ativa' : 'Inativa'}
                      color={turma.ativa ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{turma.total_membros || 0} membros</TableCell>
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

export default TurmasList;