import React from 'react';
import { Box } from '@mui/material';
import logoImg from '../../../assets/logo.svg';

const SIZES = {
  hero: { width: 612, height: 408 },
  header: { width: 213.2, height: 141.7 },
};

export const Logo: React.FC<{ size?: 'hero' | 'header' }> = ({ size = 'header' }) => {
  const dimensions = SIZES[size];

  return (
    <Box
      component="img"
      src={logoImg}
      alt="Innotter Logo"
      sx={{
        width: dimensions.width,
        height: dimensions.height,
        objectFit: 'contain',
      }}
    />
  );
};
