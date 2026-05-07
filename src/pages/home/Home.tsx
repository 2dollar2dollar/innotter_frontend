import React from 'react';
import { Box, Typography } from '@mui/material';
import { MainLayout } from '~/components/layouts';
import { CreatePostForm } from '~/components/forms/CreatePostForm';
import { Post } from '~/components/shared/Post';

import avatarImg from '~/assets/no_avatar.png';
import postImg from '~/assets/image.png';

export const Home: React.FC = () => {
  const posts = [
    {
      id: 1,
      authorName: 'Annie',
      authorHandle: '@annie',
      timeAgo: '14s',
      avatarUrl: avatarImg,
      content:
        'This is a post. It can be long, or short. Depends on what you have to say. This is a post. It can be long, or short. Depends on what you have to say.',
      imageUrl: postImg,
    },
    {
      id: 2,
      authorName: 'Jorge Mckinney',
      authorHandle: '@Travis Wade',
      timeAgo: '14s',
      avatarUrl: avatarImg,
      content:
        'This is a post. It can be long, or short. Depends on what you have to say. This is a post. It can be long, or short. Depends on what you have to say.This is a post. It can be long, or short. Depends on what you have to say. This is a post. It can be long, or short. Depends on what you have to say.This is a post. It can be long, or short. Depends on what you have to say. This is a post. It can be long, or short. Depends on what you have to say.This is a post. It can be long, or short. Depends on what you have to say. This is a post. It can be long, or short. Depends on what you have to say.',
    },
  ];

  return (
    <MainLayout>
      <Box sx={{ py: '20px', px: '30px', borderBottom: '1px solid #E5E7EB' }}>
        <Typography
          sx={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 700,
            fontSize: '24px',
            color: '#000000',
          }}
        >
          Home
        </Typography>
      </Box>

      <Box sx={{ pt: '20px', pb: '10px', px: '30px' }}>
        <CreatePostForm />
      </Box>

      <Box
        sx={{
          width: '100%',
          height: '12px',
          backgroundColor: '#E8EEFA',
          borderTop: '1px solid #0000000A',
          borderBottom: '1px solid #0000000A',
        }}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {posts.map((post) => (
          <Box
            key={post.id}
            sx={{
              py: '20px',
              px: '30px',
              borderBottom: '1px solid #E5E7EB',
            }}
          >
            <Post {...post} />
          </Box>
        ))}
      </Box>
    </MainLayout>
  );
};
