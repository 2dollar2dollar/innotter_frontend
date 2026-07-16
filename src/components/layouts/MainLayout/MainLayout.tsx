import React from 'react';
import { Box } from '@mui/material';
import { Sidebar } from '../Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: '360px',
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '954px',
            minHeight: '100vh',
            backgroundColor: '#FFFFFF',
            boxShadow:
              '1.2px 0px 0px 0px rgba(0,0,0,0.08) inset, -1.2px 0px 0px 0px rgba(0,0,0,0.08) inset',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
