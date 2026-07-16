import React from 'react';
import { Box } from '@mui/material';
import { Sidebar } from '../Sidebar';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <Sidebar />

      <Box
        component="main"
        sx={{
          marginLeft: '280px',
          width: 'calc(100% - 280px)',
          paddingTop: '100px',
          paddingBottom: '50px',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '706.5px', margin: '0 auto', px: '20px' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
