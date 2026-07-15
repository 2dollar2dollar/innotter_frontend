import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Chip, Button, CircularProgress, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { MainLayout } from '~/components/layouts';
import { Avatar } from '~/components/shared/Avatar';
import { AppState } from '~/store/reducers';
import {
  fetchTagsAction,
  fetchAllPagesAction,
  fetchSubscriptionsAction,
  toggleFollowAction,
  createTagAction,
} from '~/store/actions/posts.action';
import avatarImg from '~/assets/no_avatar.png';

export const Explore: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');

  const { tags, allPages, subscribedPageIds, isLoading } = useSelector(
    (state: AppState) => state.posts
  );

  const currentUserRole = useMemo(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return 'USER';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const rawRole = payload.role || payload.role_name || 'USER';
      return String(rawRole).toUpperCase(); // ФОРСИРУЕМ ВЕРХНИЙ РЕГИСТР
    } catch {
      return 'USER';
    }
  }, []);

  const canCreateTag = currentUserRole === 'ADMIN' || currentUserRole === 'MODERATOR';

  useEffect(() => {
    dispatch(fetchTagsAction.request());
    dispatch(fetchAllPagesAction.request());
    dispatch(fetchSubscriptionsAction.request());
  }, [dispatch]);

  const handleToggleFollow = (pageId: string, isCurrentlyFollowed: boolean) =>
    dispatch(toggleFollowAction.request({ pageId, isCurrentlyFollowed }));
  const handleTagClick = (tagName: string) => {
    if (selectedTag === tagName) {
      setSelectedTag(null);
      dispatch(fetchAllPagesAction.request());
    } else {
      setSelectedTag(tagName);
      dispatch(fetchAllPagesAction.request({ tags: tagName }));
    }
  };
  const handleCreateTag = () => {
    if (newTagName.trim()) {
      dispatch(createTagAction.request(newTagName.trim()));
      setNewTagName('');
    }
  };

  return (
    <MainLayout>
      <Box sx={{ py: '15px', px: '30px', borderBottom: '1px solid #E5E7EB' }}>
        <Typography sx={{ fontSize: '24px', fontWeight: 700 }}>Explore</Typography>
      </Box>

      {/* ТРЕНДОВЫЕ ТЕГИ */}
      <Box sx={{ p: '20px 30px', borderBottom: '1px solid #E5E7EB' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: '20px', fontWeight: 800 }}>Trending Tags</Typography>
        </Box>

        {canCreateTag && (
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              size="small"
              placeholder="New tag name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={handleCreateTag}
              disabled={!newTagName.trim()}
              sx={{ textTransform: 'none', borderRadius: '20px', fontWeight: 600 }}
            >
              Create Tag
            </Button>
          </Box>
        )}

        {tags.length === 0 ? (
          <Typography sx={{ color: '#828282' }}>No tags available yet.</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tags.map((tag) => (
              <Chip
                key={tag.id}
                label={`#${tag.name}`}
                clickable
                onClick={() => handleTagClick(tag.name)}
                sx={{
                  fontSize: '16px',
                  fontWeight: 600,
                  bgcolor: selectedTag === tag.name ? '#1D9BF0' : '#F3F4F6',
                  color: selectedTag === tag.name ? 'white' : 'inherit',
                  '&:hover': { bgcolor: selectedTag === tag.name ? '#1A8CD8' : '#E5E7EB' },
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* КАТАЛОГ СТРАНИЦ */}
      <Box sx={{ p: '20px 30px' }}>
        <Typography sx={{ fontSize: '20px', fontWeight: 800, mb: 4 }}>
          {selectedTag ? `Pages with #${selectedTag}` : 'Who to follow'}
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : allPages.length === 0 ? (
          <Typography sx={{ color: '#828282', textAlign: 'center', mt: 4 }}>
            No pages found with this tag.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {allPages.map((page: any) => {
              const isFollowed = subscribedPageIds.includes(page.id);
              const userAvatar = page.user?.profile_image_url || avatarImg;
              const handle = page.user?.username
                ? `@${page.user.username}`
                : `@user_${page.user_id?.substring(0, 6)}`;
              const postsCount = page.posts_count || 0;

              return (
                <Box
                  key={page.id}
                  sx={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    backgroundColor: 'white',
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '150px',
                      backgroundColor: '#E8EEFA',
                      backgroundImage: page.image_url ? `url(${page.image_url})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <Box sx={{ px: '30px', pb: '20px', position: 'relative' }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '-60px',
                        border: '4px solid white',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        display: 'flex',
                      }}
                    >
                      <Avatar src={String(userAvatar)} size="large" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1.5, pb: 1 }}>
                      <Button
                        variant={isFollowed ? 'outlined' : 'contained'}
                        size="small"
                        onClick={() => handleToggleFollow(page.id, isFollowed)}
                        sx={{
                          textTransform: 'none',
                          borderRadius: '20px',
                          minWidth: '90px',
                          fontWeight: 600,
                        }}
                      >
                        {isFollowed ? 'Unfollow' : 'Follow'}
                      </Button>
                    </Box>
                    <Box
                      sx={{ mt: 1, pr: '60px', cursor: 'pointer' }}
                      onClick={() => navigate(`/page/${page.id}`)}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: '20px',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        {page.name}
                      </Typography>
                      <Typography sx={{ color: '#828282', fontSize: '15px', mb: 1 }}>
                        {handle}
                      </Typography>
                      {page.tags && page.tags.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 1.5 }}>
                          {page.tags.map((t: any) => (
                            <Typography
                              key={t.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTagClick(t.name);
                              }}
                              sx={{
                                color: '#1D9BF0',
                                fontSize: '15px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                '&:hover': { textDecoration: 'underline' },
                              }}
                            >
                              #{t.name}
                            </Typography>
                          ))}
                        </Box>
                      )}
                      {page.description && (
                        <Typography
                          sx={{
                            fontSize: '15px',
                            color: '#0F1419',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {page.description}
                        </Typography>
                      )}
                    </Box>
                    <Box
                      onClick={() => navigate(`/page/${page.id}`)}
                      sx={{
                        position: 'absolute',
                        bottom: '20px',
                        right: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#828282',
                        cursor: 'pointer',
                        transition: 'color 0.2s ease',
                        '&:hover': { color: '#1D9BF0' },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        </svg>
                      </Box>
                      <Typography sx={{ fontSize: '15px', fontWeight: 600 }}>
                        {postsCount}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </MainLayout>
  );
};
