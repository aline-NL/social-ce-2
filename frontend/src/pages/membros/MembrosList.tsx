// frontend/src/pages/membros/MembrosList.tsx
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
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { membroApi } from '../../services/api';

const MembrosList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['membros', { page, rowsPerPage }],
    queryFn: () => membroApi.listMembros({ page: page + 1, pageSize: rowsPerPage }),
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
        Erro ao carregar a lista de membros
      </Alert>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Membros Cadastrados</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/membros/novo')}
        >
          Novo Membro
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Data Nasc.</TableCell>
                <TableCell>Idade</TableCell>
                <TableCell>Família</TableCell>
                <TableCell>Parentesco</TableCell>
                <TableCell>Escola</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.results.map((membro: any) => (
                <TableRow
                  key={membro.id}
                  hover
                  onClick={() => navigate(`/membros/${membro.id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{membro.nome}</TableCell>
                  <TableCell>{new Date(membro.data_nascimento).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {new Date().getFullYear() - new Date(membro.data_nascimento).getFullYear()}
                  </TableCell>
                  <TableCell>{membro.familia_nome || 'Não informado'}</TableCell>
                  <TableCell>{membro.parentesco || 'Não informado'}</TableCell>
                  <TableCell>{membro.escola || 'Não informado'}</TableCell>
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

export default MembrosList;