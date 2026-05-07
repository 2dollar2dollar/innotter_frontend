import React from 'react';
import { Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import { Logo } from '~/components/shared/Logo';
import { Button } from '~/components/shared/Button';
import { NavItem } from '~/components/shared/NavItem';

import HomeIcon from '~/assets/Home.png';
import ExploreIcon from '~/assets/Explore.png';
import AvatarIcon from '~/assets/no_avatar.png';

export const Sidebar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Home', icon: HomeIcon, path: '/home' },
    { label: 'Explore', icon: ExploreIcon, path: '/explore' },
    { label: 'Profile', icon: AvatarIcon, path: '/profile', isAvatar: true },
  ];

  return (
    <Box
      sx={{
        width: '360px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        p: '30px 50px',
        borderRight: '1px solid #E8EEFA',
        position: 'fixed',
        left: 0,
        top: 0,
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* 1. Logo */}
      <Box sx={{ mb: '10px', pl: '10px' }}>
        <Logo size="header" onClick={() => navigate('/home')} />
      </Box>

      {/* 2. Navigation */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '35px', pl: '20px' }}>
        {menuItems.map((item) => (
          <NavItem
            key={item.label}
            label={item.label}
            iconSrc={item.icon}
            isAvatar={item.isAvatar}
            isActive={pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </Box>

      {/* 3. Post */}
      <Box sx={{ mt: '40px', width: '100%' }}>
        <Button
          fullWidth
          variant="contained"
          sx={{
            py: '18px',
            fontSize: '24.7px',
            fontWeight: 700,
            fontFamily: 'Roboto, sans-serif',
            borderRadius: '16px',
            textTransform: 'none',
            boxShadow: '0px 4px 12px rgba(44, 115, 235, 0.2)',
          }}
          onClick={() => console.log('Open Create Post Modal')}
        >
          Post
        </Button>
      </Box>
    </Box>
  );
};
