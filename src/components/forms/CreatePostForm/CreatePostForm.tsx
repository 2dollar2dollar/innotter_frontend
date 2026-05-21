import React, { useState, useRef } from 'react';
import { Box, InputBase, Typography, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { Avatar } from '~/components/shared/Avatar';
import { Button } from '~/components/shared/Button';
import { ClickableIcon } from '~/components/shared/ClickableIcon';
import { createPostAction } from '~/store/actions/posts.action';
import { AppState } from '~/store/reducers';

import noAvatar from '~/assets/no_avatar.png';
import uploadImgIcon from '~/assets/upload_an_img.png';
import circleIcon from '~/assets/circle.png';
import plusIcon from '~/assets/+.png';

export const CreatePostForm: React.FC = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const isPosting = useSelector((state: AppState) => state.posts.isLoading);

  const isButtonDisabled = (text.trim().length === 0 && !selectedFile) || isPosting;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePost = () => {
    dispatch(
      createPostAction.request({
        content: text,
        imageFile: selectedFile || undefined,
      })
    );
    setText('');
    setSelectedFile(null);
  };

  return (
    <Box sx={{ display: 'flex', gap: '20px', width: '100%', mb: '30px' }}>
      <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />

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
            mb: selectedFile ? '10px' : '20px',
            mt: '4px',
            '& textarea::placeholder': {
              color: '#696F79',
              opacity: 1,
            },
          }}
        />
        {selectedFile && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: '15px' }}>
            <Typography variant="body2" sx={{ color: '#4473EB', fontWeight: 500 }}>
              📎 {selectedFile.name}
            </Typography>
            <IconButton size="small" onClick={() => setSelectedFile(null)} sx={{ ml: 1 }}>
              ×
            </IconButton>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ClickableIcon
            src={uploadImgIcon}
            alt="Upload image"
            onClick={() => fileInputRef.current?.click()}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <ClickableIcon src={circleIcon} alt="Circle icon" />

            <Box sx={{ width: '1.5px', height: '32px', backgroundColor: '#E5E7EB' }} />

            <ClickableIcon src={plusIcon} alt="Add icon" />

            <Button
              variant="contained"
              size="small"
              disabled={isButtonDisabled}
              onClick={handlePost}
              sx={{ ml: '10px' }}
            >
              {isPosting ? '...' : 'Post'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
