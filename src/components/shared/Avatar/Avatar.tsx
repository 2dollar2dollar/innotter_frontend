import React from 'react';
import { Box } from '@mui/material';
import { AvatarProps } from './types';
import editIcon from '~/assets/edit.png';

const SIZES = {
  small: '40px',
  large: '105px',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'small',
  showEditButton = false,
  onEditClick,
}) => {
  const currentSize = SIZES[size];

  return (
    <Box
      sx={{
        position: 'relative',
        width: currentSize,
        height: currentSize,
        display: 'inline-block',
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          objectFit: 'cover',
        }}
      />
      {showEditButton && (
        <Box
          component="img"
          src={editIcon}
          onClick={onEditClick}
          sx={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            zIndex: 2,
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            padding: '4px',
            boxSizing: 'border-box',
            '&:hover': { transform: 'scale(1.1)' },
          }}
        />
      )}
    </Box>
  );
};
