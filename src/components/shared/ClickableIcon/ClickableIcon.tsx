import React from 'react';
import { Box } from '@mui/material';
import { ClickableIconProps } from './types';

export const ClickableIcon: React.FC<ClickableIconProps> = ({
  src,
  alt = 'icon',
  size = 'medium',
  onClick,
}) => {
  const currentSize = size === 'small' ? '19.2px' : '32.4px';

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      onClick={onClick}
      sx={{
        width: currentSize,
        height: currentSize,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'opacity 0.2s',
        '&:hover': { opacity: onClick ? 0.7 : 1 },
      }}
    />
  );
};
