import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { TurmaForm } from './TurmaForm';
import { useAuth } from '../../contexts/AuthContext';
import { turmasApi } from '../../services/api';

export default function Turmas() {
  const [turmas, setTurmas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchTurmas();
  }, []);

  const fetchTurmas = async () => {
    try {
      setIsLoading(true);
      const data = await turmasApi.list();
      setTurmas(data);
    } catch (error) {
      console.error('Error fetching turmas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (turma = null) => {
    setSelectedTurma(turma);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedTurma(null);
    setOpenDialog(false);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedTurma) {
        await turmasApi.update(selectedTurma.id, formData);
      } else {
        await turmasApi.create(formData);
      }
      fetchTurmas();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving turma:', error);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Typography variant="h6">Carregando...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Cadastro de Turmas
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
            sx={{ mb: 2 }}
          >
            Nova Turma
          </Button>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Idade Mínima</TableCell>
                  <TableCell>Idade Máxima</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {turmas.map((turma) => (
                  <TableRow key={turma.id}>
                    <TableCell>{turma.nome}</TableCell>
                    <TableCell>{turma.idade_minima}</TableCell>
                    <TableCell>{turma.idade_maxima}</TableCell>
                    <TableCell>
                      {turma.ativo ? 'Ativo' : 'Inativo'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        onClick={() => handleOpenDialog(turma)}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedTurma ? 'Editar Turma' : 'Nova Turma'}
        </DialogTitle>
        <DialogContent>
          <TurmaForm
            initialData={selectedTurma}
            onSubmit={handleSave}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
}
