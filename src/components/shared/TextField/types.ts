import { TextFieldProps as MuiTextFieldProps, OutlinedInputProps } from '@mui/material';

export type TextFieldProps = Omit<MuiTextFieldProps, 'variant'> & {
  variant?: 'outlined';
  InputProps?: Partial<OutlinedInputProps>;
};
