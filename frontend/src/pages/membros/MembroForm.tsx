import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from 'react-query';
import { TextField, Button, Grid, Typography, Box, Paper, Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { ptBR } from 'date-fns/locale/pt-BR';
import { membrosApi } from '../../services/api';

// Tamanhos disponíveis
const TAMANHOS_BERÇA = ['P', 'M', 'G'];
const TAMANHOS_BERMUDA = ['36', '38', '40', '42', '44'];
const TAMANHOS_BLAUSA = ['P', 'M', 'G', 'GG'];

// Schema de validação
const membroSchema = yup.object({
  nome_completo: yup.string().required('Nome completo é obrigatório'),
  data_nascimento: yup.date().required('Data de nascimento é obrigatória'),
  sexo: yup.string().required('Sexo é obrigatório'),
  numero_calçado: yup.number().required('Número do calçado é obrigatório'),
  tamanho_berca: yup.string().required('Tamanho da berça é obrigatório'),
  tamanho_bermuda: yup.string().required('Tamanho da bermuda é obrigatório'),
  tamanho_bluza: yup.string().required('Tamanho da blusa é obrigatório'),
  foto_3x4: yup.string().required('Foto 3x4 é obrigatória'),
});

interface MembroFormData {
  id?: string;
  nome_completo: string;
  data_nascimento: Date;
  sexo: 'M' | 'F' | 'O';
  numero_calçado: number;
  tamanho_berca: string;
  tamanho_bermuda: string;
  tamanho_bluza: string;
  foto_3x4: string;
}

interface MembroFormProps {
  membroId?: string;
  familiaId: string;
  onSuccess?: () => void;
}

export default function MembroForm({ membroId, familiaId, onSuccess }: MembroFormProps) {
  const queryClient = useQueryClient();
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<MembroFormData>({
    resolver: yupResolver(membroSchema),
    defaultValues: {
      sexo: 'M',
      tamanho_berca: 'P',
      tamanho_bermuda: '36',
      tamanho_bluza: 'P',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'responsaveis',
  });

  const mutation = useMutation({
    mutationFn: async (data: MembroFormData) => {
      if (membroId) {
        return await membrosApi.update(membroId, { ...data, familia: familiaId });
      }
      return await membrosApi.create({ ...data, familia: familiaId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['membros']);
      onSuccess?.();
    },
  });

  const onSubmit: SubmitHandler<MembroFormData> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            {membroId ? 'Editar Membro' : 'Novo Membro'}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="nome_completo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Nome Completo"
                error={!!errors.nome_completo}
                helperText={errors.nome_completo?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={6}>
          <Controller
            name="data_nascimento"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                  {...field}
                  label="Data de Nascimento"
                  format="dd/MM/yyyy"
                  slotProps={{ textField: { fullWidth: true } }}
                  error={!!errors.data_nascimento}
                  helperText={errors.data_nascimento?.message}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth error={!!errors.sexo}>
            <InputLabel>Sexo</InputLabel>
            <Select
              label="Sexo"
              value={control._formState.values.sexo}
              onChange={(e) => setValue('sexo', e.target.value as 'M' | 'F' | 'O')}
            >
              <MenuItem value="M">Masculino</MenuItem>
              <MenuItem value="F">Feminino</MenuItem>
              <MenuItem value="O">Outro</MenuItem>
            </Select>
            {errors.sexo && <FormHelperText>{errors.sexo.message}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={4}>
          <FormControl fullWidth error={!!errors.numero_calçado}>
            <InputLabel>Número do Calçado</InputLabel>
            <TextField
              type="number"
              value={control._formState.values.numero_calçado}
              onChange={(e) => setValue('numero_calçado', parseInt(e.target.value))}
              error={!!errors.numero_calçado}
              helperText={errors.numero_calçado?.message}
            />
          </FormControl>
        </Grid>

        <Grid item xs={4}>
          <FormControl fullWidth error={!!errors.tamanho_berca}>
            <InputLabel>Tamanho da Berça</InputLabel>
            <Select
              value={control._formState.values.tamanho_berca}
              onChange={(e) => setValue('tamanho_berca', e.target.value)}
              error={!!errors.tamanho_berca}
            >
              {TAMANHOS_BERÇA.map((tamanho) => (
                <MenuItem key={tamanho} value={tamanho}>
                  {tamanho}
                </MenuItem>
              ))}
            </Select>
            {errors.tamanho_berca && <FormHelperText>{errors.tamanho_berca.message}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={4}>
          <FormControl fullWidth error={!!errors.tamanho_bermuda}>
            <InputLabel>Tamanho da Bermuda</InputLabel>
            <Select
              value={control._formState.values.tamanho_bermuda}
              onChange={(e) => setValue('tamanho_bermuda', e.target.value)}
              error={!!errors.tamanho_bermuda}
            >
              {TAMANHOS_BERMUDA.map((tamanho) => (
                <MenuItem key={tamanho} value={tamanho}>
                  {tamanho}
                </MenuItem>
              ))}
            </Select>
            {errors.tamanho_bermuda && <FormHelperText>{errors.tamanho_bermuda.message}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={4}>
          <FormControl fullWidth error={!!errors.tamanho_bluza}>
            <InputLabel>Tamanho da Blusa</InputLabel>
            <Select
              value={control._formState.values.tamanho_bluza}
              onChange={(e) => setValue('tamanho_bluza', e.target.value)}
              error={!!errors.tamanho_bluza}
            >
              {TAMANHOS_BLAUSA.map((tamanho) => (
                <MenuItem key={tamanho} value={tamanho}>
                  {tamanho}
                </MenuItem>
              ))}
            </Select>
            {errors.tamanho_bluza && <FormHelperText>{errors.tamanho_bluza.message}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={mutation.isLoading}
            fullWidth
          >
            {mutation.isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
