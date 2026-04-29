import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Button } from '~/components/shared';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 3,
      }}
    >
      <Typography variant="h3" sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
        Innotter Global Feed
      </Typography>

      <Typography color="text.secondary" sx={{ fontFamily: 'Inter, sans-serif', fontSize: '18px' }}>
        You are not logged in. Read public posts or join us!
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button onClick={() => navigate('/login')}>Login</Button>
        <Button color="secondary" onClick={() => navigate('/signup')}>
          Create Account
        </Button>
      </Box>

      <Box
        sx={{
          mt: 5,
          p: 4,
          border: '1px dashed #ccc',
          borderRadius: 2,
          width: '100%',
          maxWidth: 600,
          textAlign: 'center',
        }}
      >
        <Typography color="text.secondary">[ Placeholder for Global Posts Feed ]</Typography>
      </Box>
    </Box>
  );
};

export default Home;
