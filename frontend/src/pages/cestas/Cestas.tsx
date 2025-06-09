import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { cestasApi } from '../../services/api';
import { Familia } from '../../types';

interface EntregaCestaFormData {
  familia_id: number | null;
  data_entrega: Date | null;
  observacoes: string;
}

const Cestas: React.FC = () => {
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [entregas, setEntregas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<EntregaCestaFormData>({
    familia_id: null,
    data_entrega: null,
    observacoes: '',
  });

  useEffect(() => {
    fetchFamilias();
  }, []);

  const fetchFamilias = async () => {
    try {
      const response = await cestasApi.getFamilias();
      setFamilias(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntregas = async () => {
    try {
      const response = await cestasApi.getEntregas();
      setEntregas(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleFamiliaChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFormData(prev => ({ ...prev, familia_id: event.target.value as number }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({ ...prev, data_entrega: date }));
  };

  const handleObservacoesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, observacoes: event.target.value }));
  };

  const handleCreateEntrega = async () => {
    try {
      await cestasApi.createEntrega(formData);
      setOpenDialog(false);
      fetchEntregas();
    } catch (error) {
      handleError(error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      familia_id: null,
      data_entrega: null,
      observacoes: '',
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography component="h1" variant="h4" align="center">
          Entregas de Cestas
        </Typography>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleOpenDialog}
          >
            Nova Entrega
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Família</TableCell>
                <TableCell>Data de Entrega</TableCell>
                <TableCell>Última Entrega</TableCell>
                <TableCell>Observações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entregas.map(entrega => (
                <TableRow key={entrega.id}>
                  <TableCell>{entrega.familia.nome}</TableCell>
                  <TableCell>{new Date(entrega.data_entrega).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    {entrega.familia.ultima_entrega ?
                      new Date(entrega.familia.ultima_entrega).toLocaleDateString('pt-BR') :
                      'Nenhuma entrega anterior'}
                  </TableCell>
                  <TableCell>{entrega.observacoes || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Nova Entrega de Cesta</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                select
                fullWidth
                label="Família"
                value={formData.familia_id || ''}
                onChange={handleFamiliaChange}
                required
              >
                <MenuItem value="">Selecione uma família</MenuItem>
                {familias.map(familia => (
                  <MenuItem key={familia.id} value={familia.id}>
                    {familia.nome}
                  </MenuItem>
                ))}
              </TextField>

              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                  label="Data de Entrega"
                  value={formData.data_entrega}
                  onChange={handleDateChange}
                  required
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>

              <TextField
                fullWidth
                label="Observações"
                multiline
                rows={4}
                value={formData.observacoes}
                onChange={handleObservacoesChange}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleCreateEntrega} variant="contained">
              Criar Entrega
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default Cestas;
