import React from 'react';
import { TextField as MuiTextField } from '@mui/material';
import { TextFieldProps } from './types';

export const TextField: React.FC<TextFieldProps> = ({ value, sx, ...props }) => {
  return (
    <MuiTextField
      variant="outlined"
      fullWidth
      value={value}
      sx={{
        '& .MuiOutlinedInput-root': {
          transition: 'box-shadow 0.5s ease-in-out',
          boxShadow: value ? '0px 4px 10px 3px #0000001C' : 'none',
        },
        ...sx,
      }}
      {...props}
    />
  );
};
