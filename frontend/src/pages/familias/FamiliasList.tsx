// frontend/src/pages/familias/FamiliasList.tsx
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
  IconButton,
  TablePagination,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { familiaApi } from '../../services/api';

const FamiliasList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['familias', { page, rowsPerPage }],
    queryFn: () => familiaApi.listFamilias({ page: page + 1, pageSize: rowsPerPage }),
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
        Erro ao carregar a lista de famílias
      </Alert>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Famílias Cadastradas</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/familias/novo')}
        >
          Nova Família
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Responsável</TableCell>
                <TableCell>Endereço</TableCell>
                <TableCell>Bairro</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.results.map((familia: any) => (
                <TableRow key={familia.id}>
                  <TableCell>{familia.id}</TableCell>
                  <TableCell>
                    {familia.responsaveis?.[0]?.nome || 'Sem responsável cadastrado'}
                  </TableCell>
                  <TableCell>{familia.endereco}</TableCell>
                  <TableCell>{familia.bairro}</TableCell>
                  <TableCell>{familia.telefone}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => navigate(`/familias/${familia.id}`)}
                      color="primary"
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => navigate(`/familias/editar/${familia.id}`)}
                      color="secondary"
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

export default FamiliasList;