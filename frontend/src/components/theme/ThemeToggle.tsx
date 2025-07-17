import { IconButton, Tooltip, useTheme } from '@mui/material';
import { Brightness4 as DarkIcon, Brightness7 as LightIcon } from '@mui/icons-material';
import { useThemeContext } from '../../contexts/ThemeContext';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  edge?: false | 'start' | 'end' | undefined;
}

export function ThemeToggle({ size = 'medium', edge = false }: ThemeToggleProps) {
  const theme = useTheme();
  const { toggleTheme, isDark } = useThemeContext();

  return (
    <Tooltip title={isDark ? 'Modo claro' : 'Modo escuro'}>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        size={size}
        edge={edge}
        aria-label={isDark ? 'Alternar para modo claro' : 'Alternar para modo escuro'}
        sx={{
          color: 'inherit',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'rotate(30deg)',
            backgroundColor: 'transparent',
          },
        }}
      >
        {isDark ? (
          <LightIcon sx={{ fontSize: size === 'large' ? 28 : 24 }} />
        ) : (
          <DarkIcon sx={{ fontSize: size === 'large' ? 28 : 24 }} />
        )}
      </IconButton>
    </Tooltip>
  );
}

export default ThemeToggle;
