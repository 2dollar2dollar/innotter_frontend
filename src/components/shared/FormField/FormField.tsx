import React from 'react';
import { Box, Typography } from '@mui/material';
import { PatternFormat } from 'react-number-format';
import { TextField } from '../TextField';
import { TextFieldProps } from '../TextField/types';

export const FormLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography
    color="text.secondary"
    sx={{
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '100%',
      mb: 1,
    }}
  >
    {children}
  </Typography>
);

export const globalInputSx = {
  '& .MuiInputBase-input': {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    fontSize: '16px',
  },
  '& .MuiFormHelperText-root': {
    position: 'absolute',
    bottom: '-22px',
    margin: 0,
  },
};

export interface FormFieldProps extends TextFieldProps {
  label: string;
  isPhone?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  isPhone,
  sx,
  onChange,
  name,
  ...props
}) => {
  return (
    <Box>
      <FormLabel>{label}</FormLabel>

      {isPhone ? (
        <PatternFormat
          customInput={TextField}
          format="+375 (##) ###-##-##"
          mask="_"
          allowEmptyFormatting
          name={name}
          onValueChange={(values) => {
            if (onChange) {
              const event = {
                target: { name, value: values.formattedValue },
              } as React.ChangeEvent<HTMLInputElement>;
              onChange(event);
            }
          }}
          sx={{ ...globalInputSx, ...sx }}
          {...(props as Record<string, unknown>)}
        />
      ) : (
        <TextField name={name} onChange={onChange} sx={{ ...globalInputSx, ...sx }} {...props} />
      )}
    </Box>
  );
};
