import { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { turmasApi } from '../../services/api';

interface TurmaFormData {
  nome: string;
  idade_minima: number;
  idade_maxima: number;
  ativo: boolean;
}

export default function TurmaForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: TurmaFormData;
  onSubmit: (data: TurmaFormData) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<TurmaFormData>({
    nome: '',
    idade_minima: 0,
    idade_maxima: 0,
    ativo: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
            Cadastro de Turma
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Nome da Turma"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Idade Mínima"
                    name="idade_minima"
                    type="number"
                    value={formData.idade_minima}
                    onChange={handleNumberChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Idade Máxima"
                    name="idade_maxima"
                    type="number"
                    value={formData.idade_maxima}
                    onChange={handleNumberChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl component="fieldset" fullWidth>
                    <FormControlLabel
                      control={
                        <Select
                          required
                          fullWidth
                          label="Status"
                          name="ativo"
                          value={formData.ativo ? 'ativo' : 'inativo'}
                          onChange={(e) =>
                            handleCheckboxChange({
                              target: {
                                name: 'ativo',
                                checked: e.target.value === 'ativo',
                              },
                            })
                          }
                        >
                          <MenuItem value="ativo">Ativo</MenuItem>
                          <MenuItem value="inativo">Inativo</MenuItem>
                        </Select>
                      }
                      label="Status"
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mr: 2 }}
                  >
                    Salvar
                  </Button>
                  <Button onClick={onCancel}>Cancelar</Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
