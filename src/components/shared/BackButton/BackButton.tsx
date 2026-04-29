import React from 'react';
import { Link } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router-dom';

export const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Link
      component="button"
      onClick={() => navigate(-1)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        color: '#8A92A6',
        textDecoration: 'none',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        fontSize: '14px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        p: 0,
        '&:hover': { color: 'primary.main' },
      }}
    >
      <ArrowBackIosNewIcon sx={{ fontSize: '12px' }} /> Back
    </Link>
  );
};
