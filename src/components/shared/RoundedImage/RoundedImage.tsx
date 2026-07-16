import React from 'react';
import { Box } from '@mui/material';

interface RoundedImageProps {
  src?: string;
  alt?: string;
}

export const RoundedImage: React.FC<RoundedImageProps> = ({ src, alt = 'Post image' }) => {
  if (!src) return null;

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{
        width: '100%',
        maxWidth: '688.8px',
        maxHeight: '688.8px',
        borderRadius: '14.4px',
        objectFit: 'cover',
        backgroundColor: '#C4C4C4',
        display: 'block',
      }}
    />
  );
};
