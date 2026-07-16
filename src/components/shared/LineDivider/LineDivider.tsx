import React from 'react';
import { Box } from '@mui/material';

export const LineDivider: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '706.5px',
        height: '0px',
        borderBottom: '1.5px solid #E5E7EB',
        opacity: 1,
      }}
    />
  );
};
