import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { presencasApi } from '../../services/api';
import { Turma, Presenca } from '../../types';

interface PresencaFormData {
  turma_id: number | null;
  data: Date | null;
}

const Presencas: React.FC = () => {
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [presencas, setPresencas] = useState<Presenca[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<PresencaFormData>({
    turma_id: null,
    data: null,
  });

  useEffect(() => {
    fetchTurmas();
  }, []);

  const fetchTurmas = async () => {
    try {
      const response = await presencasApi.getTurmas();
      setTurmas(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPresencas = async () => {
    if (!formData.turma_id || !formData.data) return;

    try {
      const response = await presencasApi.getPresencasByTurma(formData.turma_id, formData.data);
      setPresencas(response.data.presencas);
    } catch (error) {
      handleError(error);
    }
  };

  const handleTurmaChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFormData(prev => ({ ...prev, turma_id: event.target.value as number }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({ ...prev, data: date }));
  };

  const handlePresencaChange = async (presencaId: number, novoEstado: boolean) => {
    try {
      await presencasApi.updatePresenca(presencaId, { presente: novoEstado });
      setPresencas(prev => 
        prev.map(p => 
          p.id === presencaId ? { ...p, presente: novoEstado } : p
        )
      );
    } catch (error) {
      handleError(error);
    }
  };

  const handleSearch = () => {
    fetchPresencas();
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
          Registro de Presenças
        </Typography>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <FormControl fullWidth sx={{ maxWidth: 300 }}>
            <InputLabel>Turma</InputLabel>
            <Select
              value={formData.turma_id || ''}
              onChange={handleTurmaChange}
              label="Turma"
              disabled={loading}
            >
              <MenuItem value="">Selecione uma turma</MenuItem>
              {turmas.map(turma => (
                <MenuItem key={turma.id} value={turma.id}>
                  {turma.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <DatePicker
              label="Data"
              value={formData.data}
              onChange={handleDateChange}
              disabled={loading}
              sx={{ maxWidth: 300 }}
            />
          </LocalizationProvider>

          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={!formData.turma_id || !formData.data}
          >
            Buscar
          </Button>
        </Box>

        {presencas.length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Idade</TableCell>
                  <TableCell>Presença</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {presencas.map(presenca => (
                  <TableRow key={presenca.id}>
                    <TableCell>{presenca.membro.nome}</TableCell>
                    <TableCell>{presenca.membro.idade}</TableCell>
                    <TableCell>
                      <Button
                        variant={presenca.presente ? 'contained' : 'outlined'}
                        color={presenca.presente ? 'success' : 'error'}
                        onClick={() => handlePresencaChange(presenca.id, !presenca.presente)}
                        size="small"
                      >
                        {presenca.presente ? 'Presente' : 'Ausente'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {presencas.length > 0 && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Typography>
              Total: {presencas.length} membros - 
              Presentes: {presencas.filter(p => p.presente).length} - 
              Ausentes: {presencas.filter(p => !p.presente).length}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Presencas;
