import React from 'react';
import { Box } from '@mui/material';
import { Logo, BackButton } from '~/components/shared';
import { ForgotPasswordForm } from '~/components/forms/ForgotPasswordForm';

export const ForgotPasswordPage: React.FC = () => {
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
          <ForgotPasswordForm onSubmit={(values) => console.log('Forgot Password:', values)} />
        </Box>
      </Box>
    </Box>
  );
};
