import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Box,
  InputBase,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Button as MuiButton,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Avatar } from '~/components/shared/Avatar';
import { Button } from '~/components/shared/Button';
import { ClickableIcon } from '~/components/shared/ClickableIcon';
import { createPostAction } from '~/store/actions/posts.action';
import { AppState } from '~/store/reducers';
import * as PostsService from '~/core/services/posts/posts.service';

import noAvatar from '~/assets/no_avatar.png';
import uploadImgIcon from '~/assets/upload_an_img.png';

export const CreatePostForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // --- Стейты для логики выбора страницы ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [myPages, setMyPages] = useState<any[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isPosting = useSelector((state: AppState) => state.posts.isLoading);

  // Достаем ID пользователя из токена, чтобы загрузить его страницы
  const currentUserId = useMemo(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || payload.user_id || payload.sub;
    } catch {
      return null;
    }
  }, []);

  // При загрузке подтягиваем список страниц текущего пользователя
  useEffect(() => {
    if (currentUserId) {
      setIsLoadingPages(true);
      PostsService.getUserPages(currentUserId)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((res: any) => {
          const pages = Array.isArray(res) ? res : res.results || [];
          setMyPages(pages);
          // По умолчанию выбираем первую страницу, если она есть
          if (pages.length > 0) {
            setSelectedPageId(pages[0].id);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoadingPages(false));
    }
  }, [currentUserId]);

  // Кнопка блокируется, если нет текста/файла, если идет отправка, ИЛИ если не выбрана страница
  const isButtonDisabled =
    (text.trim().length === 0 && !selectedFile) || isPosting || !selectedPageId;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePost = () => {
    if (!selectedPageId) return;

    dispatch(
      createPostAction.request({
        content: text,
        imageFile: selectedFile || undefined,
        pageId: selectedPageId, // Явно указываем, в какую страницу летит пост
      })
    );
    setText('');
    setSelectedFile(null);
  };

  const selectedPageName = myPages.find((p) => p.id === selectedPageId)?.name || 'Select Page';

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
            {/* Кнопка выбора страницы */}
            <MuiButton
              variant="text"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              disabled={isLoadingPages}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: '#4473EB',
                fontSize: '16px',
                p: 0,
                minWidth: 'auto',
                '&:hover': { backgroundColor: 'transparent', opacity: 0.8 },
              }}
            >
              {isLoadingPages ? 'Loading...' : selectedPageName}
            </MuiButton>

            {/* Выпадающее меню */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              disableScrollLock={true}
              sx={{
                mt: 1,
                '& .MuiPaper-root': { borderRadius: '12px', minWidth: '180px', boxShadow: 3 },
              }}
            >
              <MenuItem
                onClick={() => navigate('/create-page')}
                sx={{ fontWeight: 700, color: '#4473EB', py: 1.5 }}
              >
                + Create New Page
              </MenuItem>

              {myPages.length > 0 && <Divider />}

              {myPages.map((page) => (
                <MenuItem
                  key={page.id}
                  selected={page.id === selectedPageId}
                  onClick={() => {
                    setSelectedPageId(page.id);
                    setAnchorEl(null);
                  }}
                  sx={{ py: 1.5, fontWeight: 500 }}
                >
                  {page.name}
                </MenuItem>
              ))}
            </Menu>

            <Box sx={{ width: '1.5px', height: '32px', backgroundColor: '#E5E7EB' }} />

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
