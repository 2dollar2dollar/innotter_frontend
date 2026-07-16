import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { MainLayout } from '~/components/layouts';
import { Avatar } from '~/components/shared/Avatar';
import { AppState } from '~/store/reducers';
import { fetchProfileAction } from '~/store/actions/profile.action';
import {
  fetchSubscriptionsAction,
  toggleFollowAction,
  fetchAllPagesAction, // <-- ИСПРАВЛЕНИЕ: Добавили недостающий импорт экшена
  TagData,
} from '~/store/actions/posts.action';
import * as PostsService from '~/core/services/posts/posts.service';

import avatarImg from '~/assets/no_avatar.png';

export const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [foreignUser, setForeignUser] = useState<any>(null);
  const [userPages, setUserPages] = useState<any[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(true);

  // Данные текущего залогиненного пользователя из Redux
  const { data: currentUserData, isLoading: isProfileLoading } = useSelector(
    (state: AppState) => state.profile
  );
  const { subscribedPageIds } = useSelector((state: AppState) => state.posts);

  // Достаем наш ID из токена, чтобы понять, смотрим ли мы свой профиль
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

  const isMyProfile = !userId || userId === currentUserId;
  const targetUserId = userId || currentUserId;

  // 1. Загружаем данные пользователя
  useEffect(() => {
    if (isMyProfile && !currentUserData) {
      dispatch(fetchProfileAction.request());
    } else if (!isMyProfile && userId) {
      // Если смотрим чужой профиль — тянем данные из UMS
      PostsService.getUserById(userId).then(setForeignUser).catch(console.error);
    }
  }, [dispatch, isMyProfile, currentUserData, userId]);

  // 2. Загружаем подписки (чтобы правильно отображать кнопки Follow/Unfollow)
  useEffect(() => {
    dispatch(fetchSubscriptionsAction.request());
  }, [dispatch]);

  // 3. Загружаем список страниц этого пользователя
  useEffect(() => {
    if (targetUserId) {
      setIsLoadingPages(true);
      PostsService.getUserPages(targetUserId)
        .then((res: any) => {
          const pages = Array.isArray(res) ? res : res.results || [];
          setUserPages(pages);
        })
        .catch(console.error)
        .finally(() => setIsLoadingPages(false));
    }
  }, [targetUserId]);

  const handleToggleFollow = (pageId: string, isCurrentlyFollowed: boolean) => {
    dispatch(toggleFollowAction.request({ pageId, isCurrentlyFollowed }));
  };

  // Определяем, чьи данные выводить на экран
  const displayUser = isMyProfile ? currentUserData : foreignUser;
  const isLoading = isProfileLoading || isLoadingPages || (!displayUser && isMyProfile);

  const avatar = displayUser?.profile_image_url || avatarImg;
  const displayName = displayUser
    ? `${displayUser.name} ${displayUser.surname || ''}`.trim()
    : '...';
  const handle = displayUser?.username
    ? `@${displayUser.username}`
    : `@user_${targetUserId?.substring(0, 6)}`;

  return (
    <MainLayout>
      <Box sx={{ borderBottom: '1px solid #E5E7EB', pb: 4 }}>
        {/* Шапка профиля */}
        <Box sx={{ width: '100%', height: '150px', backgroundColor: '#E8EEFA' }} />

        <Box sx={{ px: '30px', position: 'relative' }}>
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
            <Avatar src={String(avatar)} size="large" />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2, minHeight: '60px' }}>
            {/* КНОПКА РЕДАКТИРОВАНИЯ (Только если это мой профиль) */}
            {isMyProfile && (
              <Button
                variant="outlined"
                onClick={() => navigate('/profile/edit')}
                sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 600 }}
              >
                Edit Profile
              </Button>
            )}
          </Box>

          <Box sx={{ mt: 1 }}>
            <Typography sx={{ fontWeight: 800, fontSize: '24px' }}>{displayName}</Typography>
            <Typography sx={{ color: '#828282', mb: 2 }}>{handle}</Typography>
          </Box>
        </Box>
      </Box>

      {/* СПИСОК СТРАНИЦ ПОЛЬЗОВАТЕЛЯ */}
      <Box sx={{ p: '20px 30px' }}>
        <Typography sx={{ fontSize: '20px', fontWeight: 800, mb: 4 }}>
          {isMyProfile ? 'My Pages' : 'Pages'}
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : userPages.length === 0 ? (
          <Typography sx={{ color: '#828282', textAlign: 'center', mt: 4 }}>
            No pages found.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {userPages.map((page: any) => {
              const isFollowed = subscribedPageIds.includes(page.id);
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
                      <Avatar src={String(avatar)} size="large" />
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
                          {page.tags.map((t: TagData) => (
                            <Typography
                              key={t.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate('/explore');
                                dispatch(fetchAllPagesAction.request({ tags: t.name }));
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
