import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ButtonProps extends MuiButtonProps {
  loading?: boolean;
}

export const Button = styled(({ loading, ...props }: ButtonProps) => (
  <MuiButton 
    {...props} 
    disabled={loading || props.disabled}
  />
))(({ theme, variant, color = 'primary' }) => ({
  textTransform: 'none',
  borderRadius: 8,
  fontWeight: 600,
  padding: '8px 24px',
  ...(variant === 'contained' && {
    boxShadow: 'none',
    '&:hover': {
      boxShadow: 'none',
    },
  }),
  ...(variant === 'outlined' && {
    borderWidth: 2,
    '&:hover': {
      borderWidth: 2,
    },
  }),
}));

export const IconButton = styled(MuiButton)(({ theme }) => ({
  minWidth: 'auto',
  padding: theme.spacing(1),
  borderRadius: '50%',
}));
