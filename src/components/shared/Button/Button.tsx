import React from 'react';
import { Button as MuiButton } from '@mui/material';
import { ButtonProps } from './types';

export const Button: React.FC<ButtonProps> = ({
  children,
  size = 'medium',
  color = 'primary',
  sx,
  ...props
}) => {
  const smallStyles =
    size === 'small'
      ? {
          width: '106.2px',
          height: '50.8px',
          borderRadius: '9px',
          fontSize: '16px',
          padding: '14.4px 33.6px',
          boxShadow: '0px 12px 24px 0px rgba(0, 0, 0, 0.08)',
        }
      : {};

  return (
    <MuiButton
      color={color}
      variant="contained"
      sx={{
        textTransform: 'none',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 700,
        ...smallStyles,
        '&.Mui-disabled': {
          backgroundColor: '#2C73EB',
          color: '#FFFFFF',
          opacity: 0.4,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};
