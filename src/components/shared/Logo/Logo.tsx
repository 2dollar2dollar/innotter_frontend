import React from 'react';
import { Box } from '@mui/material';
import logoImg from '~/assets/logo.png';
import { LogoProps } from './types';

const SIZES = {
  hero: { width: 612, height: 408 },
  header: { width: 213.2, height: 141.7 },
};

export const Logo: React.FC<LogoProps> = ({ size = 'header', onClick }) => {
  const dimensions = SIZES[size];

  return (
    <Box
      component="img"
      src={logoImg}
      alt="Innotter Logo"
      onClick={onClick}
      sx={{
        width: dimensions.width,
        height: dimensions.height,
        objectFit: 'contain',
        cursor: onClick ? 'pointer' : 'default',
      }}
    />
  );
};
