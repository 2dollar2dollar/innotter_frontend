import React from 'react';
import { Typography, TypographyProps } from '@mui/material';

export interface ProfileTextProps extends TypographyProps {
  colorVariant?: 'primary' | 'secondary';
}

export const ProfileText: React.FC<ProfileTextProps> = ({
  children,
  colorVariant = 'primary',
  sx,
  ...props
}) => {
  return (
    <Typography
      sx={{
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        fontSize: '24px',
        lineHeight: '100%',
        letterSpacing: '0%',
        color: colorVariant === 'primary' ? '#18191B' : '#696F79',
        display: 'flex',
        alignItems: 'center',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};
