import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TextField, Button, IconButton, Grid, Typography, CircularProgress, Alert, MenuItem, Box, Paper } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ptBR } from 'date-fns/locale/pt-BR';
import { AddCircleOutline, RemoveCircleOutline, Save } from '@mui/icons-material';

import { familiasApi } from '../../services/api';

// API functions using actual API services


// Helper functions for input formatting
const formatCPF = (value: string) => {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .slice(0, 14);
};

const formatPhone = (value: string) => {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(\d{4})(\d{1,4})$/, '$1-$2') // for 8 digit numbers
    .slice(0, 15);
};

const formatCEP = (value: string) => {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 9);
};

interface ResponsavelFormData {
  id?: string;
  nome_completo: string;
  cpf?: string | null;
  telefone: string;
  email?: string | null;
  sexo: 'M' | 'F' | 'O' | '';
  data_nascimento?: Date | null;
  parentesco?: string | null;
}

interface FamiliaFormData {
  id?: string;
  nome?: string | null;
  cep?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  observacoes?: string | null;
  recebe_programas_sociais: boolean;
  programas_sociais?: string | null;
  responsaveis: ResponsavelFormData[];
}

const responsavelSchema: yup.ObjectSchema<ResponsavelFormData> = yup.object().shape({
  id: yup.string().optional(),
  nome_completo: yup.string().required('Nome completo é obrigatório').min(3, 'Mínimo 3 caracteres'),
  cpf: yup.string().nullable().matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido').optional(), // type: string | null | undefined
  telefone: yup.string().required('Telefone é obrigatório').matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido'),
  email: yup.string().email('Email inválido').nullable().optional(), // type: string | null | undefined
  sexo: yup.string<'M' | 'F' | 'O' | ''>().oneOf(['M', 'F', 'O', '']).required('Sexo é obrigatório ou selecione "Não informar"'),
  data_nascimento: yup.date().nullable().typeError('Data inválida').optional(), // type: Date | null | undefined
  parentesco: yup.string().nullable().optional(), // type: string | null | undefined
});

const familiaSchema: yup.ObjectSchema<FamiliaFormData> = yup.object().shape({
  id: yup.string().optional(),
  nome: yup.string().nullable().min(3, 'Mínimo 3 caracteres para o nome da família').optional(), // type: string | null | undefined
  cep: yup.string().nullable().matches(/^\d{5}-\d{3}$/, 'CEP inválido').optional(), // type: string | null | undefined
  logradouro: yup.string().nullable().optional(),
  numero: yup.string().nullable().optional(),
  complemento: yup.string().nullable().optional(),
  bairro: yup.string().nullable().optional(),
  cidade: yup.string().nullable().optional(),
  estado: yup.string().nullable().max(2, 'Estado deve ter 2 caracteres').optional(),
  observacoes: yup.string().nullable().optional(),
  recebe_programas_sociais: yup.boolean().required(),
  programas_sociais: yup.string().when('recebe_programas_sociais', {
    is: true,
    then: (schema: yup.StringSchema) => schema.required('Detalhe os programas sociais').min(3, 'Mínimo 3 caracteres'),
    otherwise: (schema: yup.StringSchema) => schema.nullable().optional(), // type: string | null | undefined
  }),
  responsaveis: yup.array(responsavelSchema).min(1, 'Pelo menos um responsável é obrigatório').required(),
});

interface FamiliaFormProps {
  familiaId?: string; // For edit mode
  onSuccess?: () => void; // Callback on successful submission
}

const FamiliaForm: React.FC<FamiliaFormProps> = ({ familiaId, onSuccess }) => {
  const queryClient = useQueryClient();
  const isEditMode = !!familiaId;

  const {
    control, 
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FamiliaFormData>({
    resolver: yupResolver(familiaSchema),
    defaultValues: {
      id: undefined,
      nome: null,
      cep: null,
      logradouro: null,
      numero: null,
      complemento: null,
      bairro: null,
      cidade: null,
      estado: null,
      observacoes: null,
      recebe_programas_sociais: false,
      programas_sociais: null,
      responsaveis: [{
        id: undefined,
        nome_completo: '', 
        telefone: '', 
        cpf: null, 
        email: null, 
        sexo: '', 
        data_nascimento: null, 
        parentesco: null
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'responsaveis',
  });

  // Type for the API response from familiasApi.getFamiliaById
  // Adjust this based on the actual structure returned by your API
  interface FamiliaApiData {
    id: string;
    nome?: string | null;
    cep?: string | null;
    logradouro?: string | null;
    numero?: string | null;
    complemento?: string | null;
    bairro?: string | null;
    cidade?: string | null;
    estado?: string | null;
    observacoes?: string | null;
    recebe_programas_sociais: boolean;
    programas_sociais?: string | null;
    responsaveis: (Omit<ResponsavelFormData, 'data_nascimento'> & { data_nascimento?: string | null })[];
  }

  const { isLoading: isLoadingFamilia, error: fetchError } = useQuery<FamiliaApiData | null, Error>(
    ['familia', familiaId],
    () => familiasApi.getFamiliaById(familiaId!),
    {
      enabled: isEditMode,
      onSuccess: (apiData) => {
        if (apiData) {
          const formattedData: FamiliaFormData = {
            ...apiData, // Spread known fields
            id: apiData.id, // Ensure id is mapped
            // Ensure all fields from FamiliaFormData are explicitly mapped or handled
            nome: apiData.nome ?? null,
            cep: apiData.cep ?? null,
            logradouro: apiData.logradouro ?? null,
            numero: apiData.numero ?? null,
            complemento: apiData.complemento ?? null,
            bairro: apiData.bairro ?? null,
            cidade: apiData.cidade ?? null,
            estado: apiData.estado ?? null,
            observacoes: apiData.observacoes ?? null,
            recebe_programas_sociais: apiData.recebe_programas_sociais,
            programas_sociais: apiData.programas_sociais ?? null,
            responsaveis: apiData.responsaveis.map((r: Omit<ResponsavelFormData, 'data_nascimento'> & {data_nascimento?: string | null}) => ({
              ...r,
              id: r.id || undefined, // Ensure id is optional for new items from API not having it
              cpf: r.cpf ?? null,
              email: r.email ?? null,
              sexo: r.sexo || '',
              data_nascimento: r.data_nascimento ? new Date(r.data_nascimento) : null,
              parentesco: r.parentesco ?? null,
            })),
          };
          reset(formattedData);
        }
      },
    }
  );

  const mutation = useMutation(
    (data: FamiliaFormData) => 
      isEditMode ? familiasApi.updateFamilia(familiaId!, data) : familiasApi.createFamilia(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('familias'); // Invalidate list of familias
        if (isEditMode) queryClient.invalidateQueries(['familia', familiaId]);
        if (onSuccess) onSuccess();
        if (!isEditMode) reset(); // Reset form on successful creation
      },
      // onError: (error) => { /* Handle error, maybe show a notification */ }
    }
  );

  const onSubmit: SubmitHandler<FamiliaFormData> = (data) => {
    mutation.mutate(data);
  };

  const recebeProgramasSociais = watch('recebe_programas_sociais');

  if (isEditMode && isLoadingFamilia) return <CircularProgress />;
  if (fetchError) return <Alert severity="error">Erro ao carregar dados da família: {(fetchError as Error).message}</Alert>;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {isEditMode ? 'Editar Família' : 'Cadastrar Nova Família'}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('nome')}
                label="Nome da Família (Opcional)"
                fullWidth
                error={!!errors.nome}
                helperText={errors.nome?.message}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Controller
                name="cep"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="CEP"
                    fullWidth
                    error={!!errors.cep}
                    helperText={errors.cep?.message}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(formatCEP(e.target.value))}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('logradouro')}
                label="Logradouro"
                fullWidth
                error={!!errors.logradouro}
                helperText={errors.logradouro?.message}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                {...register('numero')}
                label="Número"
                fullWidth
                error={!!errors.numero}
                helperText={errors.numero?.message}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                {...register('complemento')}
                label="Complemento"
                fullWidth
                error={!!errors.complemento}
                helperText={errors.complemento?.message}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                {...register('bairro')}
                label="Bairro"
                fullWidth
                error={!!errors.bairro}
                helperText={errors.bairro?.message}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                {...register('cidade')}
                label="Cidade"
                fullWidth
                error={!!errors.cidade}
                helperText={errors.cidade?.message}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                {...register('estado')}
                label="Estado (UF)"
                fullWidth
                error={!!errors.estado}
                helperText={errors.estado?.message}
                inputProps={{ maxLength: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="recebe_programas_sociais"
                control={control}
                render={({ field }) => (
                  <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="checkbox" 
                      name={field.name}
                      checked={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      style={{ marginRight: '8px' }}
                    />
                    Recebe programas sociais?
                  </label>
                )}
              />
            </Grid>
            {recebeProgramasSociais && (
              <Grid item xs={12}>
                <TextField
                  {...register('programas_sociais')}
                  label="Quais programas sociais?"
                  fullWidth
                  multiline
                  rows={2}
                  error={!!errors.programas_sociais}
                  helperText={errors.programas_sociais?.message}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                {...register('observacoes')}
                label="Observações Gerais"
                fullWidth
                multiline
                rows={3}
                error={!!errors.observacoes}
                helperText={errors.observacoes?.message}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" component="h3" sx={{ mt: 3, mb: 1 }}>
            Responsáveis pela Família
          </Typography>
          {errors.responsaveis && !errors.responsaveis.length && (
             <Alert severity="error" sx={{ mb: 2 }}>{errors.responsaveis.message}</Alert>
          )}

          {fields.map((item, index) => (
            <Box key={item.id} sx={{ border: '1px solid #ddd', p: 2, mb: 2, borderRadius: '4px' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={5}>
                  <TextField
                    {...register(`responsaveis.${index}.nome_completo`)}
                    label="Nome Completo do Responsável"
                    fullWidth
                    error={!!errors.responsaveis?.[index]?.nome_completo}
                    helperText={errors.responsaveis?.[index]?.nome_completo?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Controller
                    name={`responsaveis.${index}.cpf`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="CPF"
                        fullWidth
                        error={!!errors.responsaveis?.[index]?.cpf}
                        helperText={errors.responsaveis?.[index]?.cpf?.message}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(formatCPF(e.target.value))}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                   <Controller
                    name={`responsaveis.${index}.telefone`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Telefone"
                        fullWidth
                        error={!!errors.responsaveis?.[index]?.telefone}
                        helperText={errors.responsaveis?.[index]?.telefone?.message}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(formatPhone(e.target.value))}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    {...register(`responsaveis.${index}.email`)}
                    label="Email (Opcional)"
                    type="email"
                    fullWidth
                    error={!!errors.responsaveis?.[index]?.email}
                    helperText={errors.responsaveis?.[index]?.email?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Controller
                    name={`responsaveis.${index}.sexo`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Sexo"
                        fullWidth
                        error={!!errors.responsaveis?.[index]?.sexo}
                        helperText={errors.responsaveis?.[index]?.sexo?.message}
                      >
                        <MenuItem value=""><em>Não informar</em></MenuItem>
                        <MenuItem value="M">Masculino</MenuItem>
                        <MenuItem value="F">Feminino</MenuItem>
                        <MenuItem value="O">Outro</MenuItem>
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name={`responsaveis.${index}.data_nascimento`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <DatePicker
                        label="Data de Nascimento"
                        value={field.value}
                        onChange={field.onChange}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!fieldState.error,
                            helperText: fieldState.error?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    {...register(`responsaveis.${index}.parentesco`)}
                    label="Parentesco (Opcional)"
                    fullWidth
                    error={!!errors.responsaveis?.[index]?.parentesco}
                    helperText={errors.responsaveis?.[index]?.parentesco?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={1} container justifyContent="flex-end">
                  {fields.length > 1 && (
                    <IconButton onClick={() => remove(index)} color="error">
                      <RemoveCircleOutline />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            </Box>
          ))}
          <Button
            type="button"
            onClick={() => append({ id: undefined, nome_completo: '', telefone: '', cpf: null, email: null, sexo: '', data_nascimento: null, parentesco: null } as ResponsavelFormData)}
            startIcon={<AddCircleOutline />}
            variant="outlined"
            sx={{ mt: 1, mb: 2 }}
          >
            Adicionar Responsável
          </Button>

          {mutation.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Erro ao salvar família: {(mutation.error as Error).message}
            </Alert>
          )}

          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={isSubmitting || mutation.isLoading}
            startIcon={isSubmitting || mutation.isLoading ? <CircularProgress size={20} /> : <Save />}
            sx={{ mt: 3 }}
          >
            {isEditMode ? 'Salvar Alterações' : 'Cadastrar Família'}
          </Button>
        </form>
      </Paper>
    </LocalizationProvider>
  );
};

export default FamiliaForm;
