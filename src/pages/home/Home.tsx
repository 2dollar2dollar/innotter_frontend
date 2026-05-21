import React, { useEffect, useState } from 'react';
import { Box, Typography, Tabs, Tab, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { MainLayout } from '~/components/layouts';
import { CreatePostForm } from '~/components/forms/CreatePostForm';
import { Post } from '~/components/shared/Post';
import { AppState } from '~/store/reducers';
import {
  fetchPostsAction,
  fetchSubscriptionsAction,
  toggleFollowAction,
  PostData,
} from '~/store/actions/posts.action';

import avatarImg from '~/assets/no_avatar.png';

export const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState<'global' | 'subscriptions'>('global');

  const {
    items: posts,
    subscribedPageIds,
    isLoading,
    error,
  } = useSelector((state: AppState) => state.posts);
  const isAuthenticated = !!localStorage.getItem('accessToken');

  // При загрузке запрашиваем список подписок, чтобы подсветить кнопки
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchSubscriptionsAction.request());
    }
  }, [dispatch, isAuthenticated]);

  // Запрос постов при переключении таба
  useEffect(() => {
    dispatch(fetchPostsAction.request({ feedType: tabValue }));
  }, [dispatch, tabValue]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: 'global' | 'subscriptions') => {
    setTabValue(newValue);
  };

  const handleToggleFollow = (pageId: string, isCurrentlyFollowed: boolean) => {
    dispatch(toggleFollowAction.request({ pageId, isCurrentlyFollowed }));
  };

  return (
    <MainLayout>
      <Box sx={{ py: '10px', px: '30px', borderBottom: '1px solid #E5E7EB' }}>
        <Typography
          sx={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 700,
            fontSize: '24px',
            color: '#000000',
            mb: 1,
          }}
        >
          Home
        </Typography>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab
            label="Global"
            value="global"
            sx={{ textTransform: 'none', fontSize: '16px', fontWeight: 600 }}
          />
          <Tab
            label="Following"
            value="subscriptions"
            sx={{ textTransform: 'none', fontSize: '16px', fontWeight: 600 }}
          />
        </Tabs>
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
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ p: 4, textAlign: 'center' }}>
            {error}
          </Typography>
        ) : posts.length === 0 ? (
          <Typography sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            No posts found.
          </Typography>
        ) : (
          posts.map((post: PostData) => {
            // Проверяем, есть ли ID страницы в нашем массиве подписок
            const isFollowed = subscribedPageIds.includes(post.page);

            return (
              <Box key={post.id} sx={{ py: '20px', px: '30px', borderBottom: '1px solid #E5E7EB' }}>
                <Post
                  id={post.id}
                  pageId={post.page} // Обязательно передаем ID страницы!
                  isFollowed={isFollowed}
                  onToggleFollow={handleToggleFollow}
                  authorName={post.page_details?.name || 'Unknown Page'}
                  authorHandle={`@user_${post.page_details?.user_id?.substring(0, 6) || 'unknown'}`}
                  timeAgo={new Date(post.created_at).toLocaleDateString()}
                  avatarUrl={post.page_details?.image_url || avatarImg}
                  content={post.content}
                  imageUrl={post.image_url ? post.image_url : undefined}
                />
              </Box>
            );
          })
        )}
      </Box>
    </MainLayout>
  );
};
