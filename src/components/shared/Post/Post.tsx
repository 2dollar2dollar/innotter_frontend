import React from 'react';
import { Box, Typography } from '@mui/material';

import { Avatar } from '~/components/shared/Avatar';
import { RoundedImage } from '~/components/shared/RoundedImage';
import { ClickableIcon } from '~/components/shared/ClickableIcon';

import chevronIcon from '~/assets/Chevron down.png';

export interface PostProps {
  authorName: string;
  authorHandle: string;
  timeAgo: string;
  avatarUrl: string;
  content?: string;
  imageUrl?: string;
}

export const Post: React.FC<PostProps> = ({
  authorName,
  authorHandle,
  timeAgo,
  avatarUrl,
  content,
  imageUrl,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '20px',
        width: '100%',
        maxWidth: '750px',
        mb: '30px',
        ml: '50px',
      }}
    >
      <Box>
        <Avatar src={avatarUrl} size="small" />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: '8px' }}>
          <Typography
            sx={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 700,
              fontSize: '18px',
              color: '#000000',
              lineHeight: '100%',
              mr: '8px',
            }}
          >
            {authorName}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 400,
              fontSize: '18px',
              color: '#828282',
              lineHeight: '100%',
              mr: '8px',
            }}
          >
            {authorHandle}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 400,
              fontSize: '18px',
              color: '#828282',
              lineHeight: '100%',
              mr: '8px',
            }}
          >
            •
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 400,
              fontSize: '18px',
              color: '#828282',
              lineHeight: '100%',
            }}
          >
            {timeAgo}
          </Typography>

          <Box sx={{ marginLeft: 'auto' }}>
            <ClickableIcon
              src={chevronIcon}
              size="small"
              onClick={() => console.log('Open post menu')}
            />
          </Box>
        </Box>

        {content && (
          <Typography
            sx={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '26.4px',
              color: '#000000',
              mb: imageUrl ? '15px' : '0',
              wordBreak: 'break-word',
            }}
          >
            {content}
          </Typography>
        )}

        {imageUrl && <RoundedImage src={imageUrl} />}
      </Box>
    </Box>
  );
};
