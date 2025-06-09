// frontend/src/pages/cestas/CestasList.tsx
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
import { cestaApi } from '../../services/api';

const CESTA_STATUS = {
  PENDENTE: 'Pendente',
  ENTREGUE: 'Entregue',
  CANCELADA: 'Cancelada',
};

const CESTA_STATUS_COLORS = {
  [CESTA_STATUS.PENDENTE]: 'warning',
  [CESTA_STATUS.ENTREGUE]: 'success',
  [CESTA_STATUS.CANCELADA]: 'error',
} as const;

const CestasList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['cestas', { page, rowsPerPage }],
    queryFn: () => cestaApi.listCestas({ page: page + 1, pageSize: rowsPerPage }),
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
        Erro ao carregar a lista de cestas
      </Alert>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Controle de Cestas Básicas</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/cestas/nova')}
        >
          Nova Entrega
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data da Entrega</TableCell>
                <TableCell>Família</TableCell>
                <TableCell>Responsável</TableCell>
                <TableCell>Itens</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Observações</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.results.map((cesta: any) => (
                <TableRow key={cesta.id} hover>
                  <TableCell>
                    {new Date(cesta.data_entrega).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{cesta.familia_nome || 'N/A'}</TableCell>
                  <TableCell>{cesta.responsavel_nome || 'N/A'}</TableCell>
                  <TableCell>
                    {Array.isArray(cesta.itens) ? cesta.itens.length : 0} itens
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={cesta.status || 'Pendente'}
                      color={CESTA_STATUS_COLORS[cesta.status as keyof typeof CESTA_STATUS_COLORS] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {cesta.observacoes?.substring(0, 30) || 'Nenhuma'}
                    {cesta.observacoes?.length > 30 ? '...' : ''}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => navigate(`/cestas/${cesta.id}`)}
                      color="primary"
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => navigate(`/cestas/editar/${cesta.id}`)}
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

export default CestasList;