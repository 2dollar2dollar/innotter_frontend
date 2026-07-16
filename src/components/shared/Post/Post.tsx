import React, { useState } from 'react';
import { Box, Typography, IconButton, Menu, MenuItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Avatar } from '~/components/shared/Avatar';
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

  likesCount?: number;
  isLiked?: boolean;
  commentsCount?: number;
  onToggleLike?: (postId: string, isLiked: boolean) => void;
  onCommentClick?: (postId: string) => void;

  authorId?: string;
  currentUserId?: string | null;
  currentUserRole?: string;
  currentUserGroup?: string;
  ownerGroupName?: string;

  onEditClick?: (postId: string, currentContent: string) => void;
  onDeleteClick?: (postId: string) => void;
  onBanClick?: (pageId: string) => void;
}

const MAX_LENGTH = 250;

export const Post: React.FC<PostProps> = ({
  id,
  authorName,
  authorHandle,
  timeAgo,
  avatarUrl,
  content,
  imageUrl,
  pageId,
  likesCount = 0,
  isLiked = false,
  commentsCount = 0,
  onToggleLike,
  onCommentClick,
  authorId,
  currentUserId,
  currentUserRole,
  currentUserGroup,
  ownerGroupName,
  onEditClick,
  onDeleteClick,
  onBanClick,
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  // Клик по всей области поста -> переходим в детали поста
  const handlePostClick = () => {
    navigate(`/post/${id}`);
  };

  // Клик по профилю (Аватар, Имя, Юзернейм) -> переходим в профиль пользователя
  const handleProfileClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Останавливаем клик, чтобы не сработал handlePostClick
    if (authorId) {
      navigate(`/profile/${authorId}`);
    } else {
      navigate(`/page/${pageId}`);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event?: unknown) => {
    if (event && typeof (event as React.SyntheticEvent).stopPropagation === 'function') {
      (event as React.SyntheticEvent).stopPropagation();
    }
    setAnchorEl(null);
  };

  const isMyPost = currentUserId && authorId === currentUserId;
  const normalizedRole = String(currentUserRole || 'USER').toUpperCase();

  const canBan =
    normalizedRole === 'ADMIN' ||
    (normalizedRole === 'MODERATOR' && currentUserGroup === ownerGroupName);

  const shouldTruncate = content && content.length > MAX_LENGTH;
  const displayedContent =
    shouldTruncate && !isExpanded ? `${content.substring(0, MAX_LENGTH)}... ` : content;

  return (
    <Box
      onClick={handlePostClick}
      sx={{
        display: 'flex',
        gap: '20px',
        width: '100%',
        maxWidth: '750px',
        p: '12px',
        ml: '38px',
        mb: '18px',
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        '&:hover': {
          backgroundColor: '#F7F9F9',
        },
      }}
    >
      <Box onClick={handleProfileClick} sx={{ cursor: 'pointer' }}>
        <Avatar src={avatarUrl} size="small" />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: '8px' }}>
          {/* Кликабельная зона автора */}
          <Box
            onClick={handleProfileClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover .author-name': { textDecoration: 'underline' },
            }}
          >
            <Typography
              className="author-name"
              sx={{
                fontWeight: 700,
                fontSize: '18px',
                mr: '8px',
              }}
            >
              {authorName}
            </Typography>
            <Typography sx={{ color: '#828282', mr: '8px' }}>{authorHandle}</Typography>
          </Box>

          <Typography sx={{ color: '#828282', mr: '8px' }}>•</Typography>
          <Typography sx={{ color: '#828282' }}>{timeAgo}</Typography>

          {/* ИСПРАВЛЕНИЕ: Убрали условие hasMenuActions, теперь меню доступно ВСЕМ для перехода на страницу */}
          <Box sx={{ marginLeft: 'auto', position: 'relative' }}>
            <Box onClick={handleMenuClick} sx={{ display: 'inline-block', cursor: 'pointer' }}>
              <ClickableIcon src={chevronIcon} size="small" />
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              disableScrollLock={true}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              sx={{
                '& .MuiPaper-root': {
                  borderRadius: '12px',
                  minWidth: '150px',
                  mt: 1,
                  boxShadow: 3,
                },
              }}
            >
              {/* ИСПРАВЛЕНИЕ: Кнопка Visit Page теперь идет самой первой и доступна абсолютно всем */}
              <MenuItem
                onClick={(e) => {
                  handleMenuClose(e);
                  navigate(`/page/${pageId}`);
                }}
                sx={{ py: 1.5 }}
              >
                <ListItemText sx={{ '& .MuiTypography-root': { fontWeight: 600 } }}>
                  Visit Page
                </ListItemText>
              </MenuItem>

              {isMyPost && (
                <MenuItem
                  onClick={(e) => {
                    handleMenuClose(e);
                    if (onEditClick && content) onEditClick(id, content);
                  }}
                  sx={{ py: 1.5 }}
                >
                  <ListItemText sx={{ '& .MuiTypography-root': { fontWeight: 600 } }}>
                    Edit Post
                  </ListItemText>
                </MenuItem>
              )}
              {isMyPost && (
                <MenuItem
                  onClick={(e) => {
                    handleMenuClose(e);
                    if (onDeleteClick) onDeleteClick(id);
                  }}
                  sx={{ py: 1.5, color: '#F4212E' }}
                >
                  <ListItemText sx={{ '& .MuiTypography-root': { fontWeight: 600 } }}>
                    Delete Post
                  </ListItemText>
                </MenuItem>
              )}
              {canBan && (
                <MenuItem
                  onClick={(e) => {
                    handleMenuClose(e);
                    if (onBanClick) onBanClick(pageId);
                  }}
                  sx={{ py: 1.5 }}
                >
                  <ListItemText sx={{ '& .MuiTypography-root': { fontWeight: 600 } }}>
                    Ban Page
                  </ListItemText>
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Box>

        {content && content !== '\u200B' && (
          <Typography
            sx={{
              fontSize: '18px',
              lineHeight: '26.4px',
              mb: imageUrl ? '15px' : '0',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
          >
            {displayedContent}
            {shouldTruncate && !isExpanded && (
              <Box
                component="span"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(true);
                }}
                sx={{
                  color: '#1D9BF0',
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Read more
              </Box>
            )}
          </Typography>
        )}

        {imageUrl && (
          <Box
            component="img"
            src={imageUrl}
            sx={{
              width: '100%',
              maxHeight: '600px',
              objectFit: 'contain',
              borderRadius: '16px',
              mt: 1.5,
              border: '1px solid #E5E7EB',
              backgroundColor: '#F3F4F6',
            }}
          />
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 6 }}>
          {/* Зона лайка */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: isLiked ? '#F91880' : '#828282',
              cursor: 'pointer',
              '&:hover': { color: '#F91880' },
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleLike) onToggleLike(id, !!isLiked);
            }}
          >
            <IconButton size="small" sx={{ color: 'inherit', p: 0, mr: 1 }}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill={isLiked ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </IconButton>
            <Typography sx={{ fontSize: '15px' }}>{likesCount}</Typography>
          </Box>

          {/* Зона комментов */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#828282',
              cursor: 'pointer',
              '&:hover': { color: '#1D9BF0' },
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (onCommentClick) onCommentClick(id);
              else navigate(`/post/${id}`);
            }}
          >
            <IconButton size="small" sx={{ color: 'inherit', p: 0, mr: 1 }}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </IconButton>
            <Typography sx={{ fontSize: '15px' }}>{commentsCount}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
