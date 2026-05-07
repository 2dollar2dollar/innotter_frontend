import React, { useState } from 'react';
import { Box, InputBase } from '@mui/material';

import { Avatar } from '~/components/shared/Avatar';
import { Button } from '~/components/shared/Button';
import { ClickableIcon } from '~/components/shared/ClickableIcon';

import noAvatar from '~/assets/no_avatar.png';
import uploadImgIcon from '~/assets/upload_an_img.png';
import circleIcon from '~/assets/circle.png';
import plusIcon from '~/assets/+.png';

export const CreatePostForm: React.FC = () => {
  const [text, setText] = useState('');

  const isButtonDisabled = text.trim().length === 0;

  return (
    <Box sx={{ display: 'flex', gap: '20px', width: '100%', mb: '30px' }}>
      <Box>
        <Avatar src={noAvatar} size="small" />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <InputBase
          placeholder="What’s happening"
          multiline
          minRows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '24px',
            fontWeight: 500,
            mb: '20px',
            mt: '4px',
            '& textarea::placeholder': {
              color: '#696F79',
              opacity: 1,
            },
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ClickableIcon
            src={uploadImgIcon}
            alt="Upload image"
            onClick={() => console.log('Upload image')}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <ClickableIcon src={circleIcon} alt="Circle icon" />

            <Box sx={{ width: '1.5px', height: '32px', backgroundColor: '#E5E7EB' }} />

            <ClickableIcon src={plusIcon} alt="Add icon" />

            <Button
              variant="contained"
              size="small"
              disabled={isButtonDisabled}
              onClick={() => {
                console.log('Post published:', text);
                setText('');
              }}
              sx={{ ml: '10px' }}
            >
              Post
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
