import React from 'react';
import { Button as MuiButton } from '@mui/material';
import { ButtonProps } from './types';

export const Button: React.FC<ButtonProps> = ({
  children,
  customProp,
  color = 'primary',
  ...elementProps
}) => {
  return (
    <MuiButton color={color} variant="contained" {...elementProps}>
      {customProp && <span>{customProp} - </span>}
      {children}
    </MuiButton>
  );
};
