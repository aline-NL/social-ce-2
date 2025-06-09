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
import { MembroForm } from './MembroForm';
import { useAuth } from '../../contexts/AuthContext';
import { membrosApi, familiasApi } from '../../services/api';

export default function Membros() {
  const [membros, setMembros] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMembro, setSelectedMembro] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchMembros();
  }, []);

  const fetchMembros = async () => {
    try {
      setIsLoading(true);
      const data = await membrosApi.list();
      setMembros(data);
    } catch (error) {
      console.error('Error fetching membros:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (membro = null) => {
    setSelectedMembro(membro);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedMembro(null);
    setOpenDialog(false);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedMembro) {
        await membrosApi.update(selectedMembro.id, formData);
      } else {
        await membrosApi.create(formData);
      }
      fetchMembros();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving membro:', error);
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
            Cadastro de Membros
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
            sx={{ mb: 2 }}
          >
            Novo Membro
          </Button>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Família</TableCell>
                  <TableCell>Data Nascimento</TableCell>
                  <TableCell>Sexo</TableCell>
                  <TableCell>Grau Parentesco</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {membros.map((membro) => (
                  <TableRow key={membro.id}>
                    <TableCell>{membro.nome}</TableCell>
                    <TableCell>{membro.familia.nome}</TableCell>
                    <TableCell>
                      {membro.data_nascimento
                        ? new Date(membro.data_nascimento).toLocaleDateString('pt-BR')
                        : ''}
                    </TableCell>
                    <TableCell>{membro.sexo === 'M' ? 'Masculino' : 'Feminino'}</TableCell>
                    <TableCell>{membro.grau_parentesco}</TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        onClick={() => handleOpenDialog(membro)}
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
          {selectedMembro ? 'Editar Membro' : 'Novo Membro'}
        </DialogTitle>
        <DialogContent>
          <MembroForm
            initialData={selectedMembro}
            onSubmit={handleSave}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
}
