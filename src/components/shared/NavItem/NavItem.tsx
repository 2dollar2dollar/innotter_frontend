import React from 'react';
import { Box, Typography } from '@mui/material';
import { NavItemProps } from './types';
import { Avatar } from '~/components/shared/Avatar';

const ICON_CONTAINER_SIZE = '40px';

export const NavItem: React.FC<NavItemProps> = ({
  label,
  iconSrc,
  isActive = false,
  isAvatar = false,
  onClick,
}) => {
  const textColor = isActive ? '#2C73EB' : '#333333';
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        cursor: 'pointer',
        transition: 'opacity 0.2s',
        '&:hover': { opacity: 0.8 },
      }}
    >
      {isAvatar ? (
        <Avatar src={iconSrc} alt={label} size="small" />
      ) : (
        <Box
          component="img"
          src={iconSrc}
          alt={label}
          sx={{
            width: ICON_CONTAINER_SIZE,
            height: ICON_CONTAINER_SIZE,
            objectFit: 'contain',
          }}
        />
      )}
      <Typography
        sx={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 700,
          fontSize: '24.7px',
          lineHeight: '100%',
          color: textColor,
          letterSpacing: '0%',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};
