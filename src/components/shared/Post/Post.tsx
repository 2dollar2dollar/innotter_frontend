import React from 'react';
import { Box, Typography, Button } from '@mui/material';

import { Avatar } from '~/components/shared/Avatar';
import { RoundedImage } from '~/components/shared/RoundedImage';
import { ClickableIcon } from '~/components/shared/ClickableIcon';

import chevronIcon from '~/assets/Chevron down.png';

export interface PostProps {
  id: string;
  authorName: string;
  authorHandle: string;
  timeAgo: string;
  avatarUrl: string;
  content?: string;
  imageUrl?: string;
  pageId: string;
  isFollowed?: boolean;
  onToggleFollow?: (pageId: string, isFollowed: boolean) => void;
}

export const Post: React.FC<PostProps> = ({
  authorName,
  authorHandle,
  timeAgo,
  avatarUrl,
  content,
  imageUrl,
  pageId,
  isFollowed,
  onToggleFollow,
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

          {onToggleFollow && (
            <Button
              variant={isFollowed ? 'outlined' : 'contained'}
              size="small"
              onClick={() => onToggleFollow(pageId, !!isFollowed)}
              sx={{ textTransform: 'none', borderRadius: '20px', height: '24px', ml: '12px' }}
            >
              {isFollowed ? 'Unfollow' : 'Follow'}
            </Button>
          )}

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
