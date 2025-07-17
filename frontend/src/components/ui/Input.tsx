import { TextField, TextFieldProps, InputAdornment } from '@mui/material';
import { FieldHookConfig, useField } from 'formik';
import { FC } from 'react';

type InputProps = TextFieldProps & {
  name: string;
  label: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  fieldProps?: FieldHookConfig<any>;
};

export const Input: FC<InputProps> = ({
  name,
  label,
  startAdornment,
  endAdornment,
  fieldProps,
  ...props
}) => {
  const [field, meta] = useField(name);
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <TextField
      {...field}
      {...props}
      label={label}
      fullWidth
      variant="outlined"
      margin="normal"
      error={!!errorText}
      helperText={errorText}
      InputProps={{
        startAdornment: startAdornment ? (
          <InputAdornment position="start">{startAdornment}</InputAdornment>
        ) : undefined,
        endAdornment: endAdornment ? (
          <InputAdornment position="end">{endAdornment}</InputAdornment>
        ) : undefined,
      }}
    />
  );
};

export default Input;
