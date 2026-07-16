import React from 'react';
import { Box } from '@mui/material';

import { Logo } from '~/components/shared/Logo';
import { BackButton } from '~/components/shared/BackButton';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <Box
        sx={{
          flex: 1,
          backgroundColor: '#E8EEFA',
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Logo size="hero" />
      </Box>

      <Box
        sx={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 4, md: 6, lg: 8 },
          overflowY: 'auto',
        }}
      >
        <Box sx={{ mb: 2 }}>
          <BackButton />
        </Box>

        <Box sx={{ my: 'auto', display: 'flex', justifyContent: 'center', width: '100%' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
