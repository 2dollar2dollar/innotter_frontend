import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { MainLayout } from '~/components/layouts';
import { CreatePostForm } from '~/components/forms/CreatePostForm';
import { Post } from '~/components/shared/Post';
import { AppState } from '~/store/reducers';
import {
  fetchPostsAction,
  fetchSubscriptionsAction,
  fetchMyLikesAction,
  toggleFollowAction,
  toggleLikeAction,
  editPostAction,
  deletePostAction,
  blockPageAction,
  PostData,
} from '~/store/actions/posts.action';
import { fetchProfileAction } from '~/store/actions/profile.action';

import avatarImg from '~/assets/no_avatar.png';

export const Home: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState<'global' | 'subscriptions'>('global');

  const [postToEdit, setPostToEdit] = useState<{ id: string; content: string } | null>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [pageToBan, setPageToBan] = useState<string | null>(null);
  const [banDate, setBanDate] = useState('');

  const {
    items: posts,
    subscribedPageIds,
    likedPostIds,
    isLoading,
    error,
  } = useSelector((state: AppState) => state.posts);

  const { data: currentUserProfile } = useSelector((state: AppState) => state.profile);

  const isAuthenticated = !!localStorage.getItem('accessToken');

  const currentUserData = useMemo(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const rawRole = payload.role || payload.role_name || 'USER';
      return {
        id: payload.id || payload.user_id || payload.sub,
        role: String(rawRole).toUpperCase(),
        group: payload.group_name || payload.group || '',
      };
    } catch {
      return null;
    }
  }, []);

  const currentUserId = currentUserData?.id;
  const currentUserRole = currentUserData?.role;
  const currentUserGroup = currentUserData?.group;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchSubscriptionsAction.request());
      dispatch(fetchMyLikesAction.request());
      dispatch(fetchProfileAction.request());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    dispatch(fetchPostsAction.request({ feedType: tabValue }));
  }, [dispatch, tabValue]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: 'global' | 'subscriptions') =>
    setTabValue(newValue);
  const handleToggleFollow = (pageId: string, isCurrentlyFollowed: boolean) =>
    dispatch(toggleFollowAction.request({ pageId, isCurrentlyFollowed }));
  const handleToggleLike = (postId: string, isCurrentlyLiked: boolean) =>
    dispatch(toggleLikeAction.request({ postId, isLiked: isCurrentlyLiked }));
  const handleCommentClick = (postId: string) => navigate(`/post/${postId}`);

  const handleEditPostSubmit = () => {
    if (postToEdit) {
      dispatch(editPostAction.request({ postId: postToEdit.id, content: postToEdit.content }));
      setPostToEdit(null);
    }
  };
  const handleDeletePostSubmit = () => {
    if (postToDelete) {
      dispatch(deletePostAction.request(postToDelete));
      setPostToDelete(null);
    }
  };
  const handleBanSubmit = () => {
    if (pageToBan && banDate) {
      dispatch(
        blockPageAction.request({ pageId: pageToBan, unblockDate: new Date(banDate).toISOString() })
      );
      setPageToBan(null);
      setBanDate('');
    }
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

      {tabValue === 'global' && (
        <>
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
        </>
      )}

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
            const isFollowed = subscribedPageIds.includes(post.page);
            const user = post.page_details?.user;

            const isMyPost =
              post.author_id === currentUserId || post.page_details?.user_id === currentUserId;

            const authorName = user?.name
              ? `${user.name} ${user.surname || ''}`.trim()
              : isMyPost && currentUserProfile
                ? `${currentUserProfile.name} ${currentUserProfile.surname || ''}`.trim()
                : post.page_details?.name || 'Unknown Page';

            const handle = user?.username
              ? `@${user.username}`
              : isMyPost && currentUserProfile
                ? `@${currentUserProfile.username}`
                : `@user_${(post.author_id || post.page_details?.user_id || 'unknown').substring(0, 6)}`;

            const avatar = user?.profile_image_url
              ? String(user.profile_image_url)
              : isMyPost && currentUserProfile?.profile_image_url
                ? String(currentUserProfile.profile_image_url)
                : avatarImg;

            return (
              <Box key={post.id} sx={{ py: '20px', px: '30px', borderBottom: '1px solid #E5E7EB' }}>
                <Post
                  id={post.id}
                  pageId={post.page}
                  isFollowed={isFollowed}
                  onToggleFollow={handleToggleFollow}
                  authorName={authorName}
                  authorHandle={handle}
                  timeAgo={new Date(post.created_at).toLocaleDateString()}
                  avatarUrl={avatar}
                  content={post.content}
                  imageUrl={post.image_url ? post.image_url : undefined}
                  likesCount={post.likes_count}
                  isLiked={likedPostIds.includes(post.id)}
                  commentsCount={post.replies_count}
                  onToggleLike={handleToggleLike}
                  onCommentClick={handleCommentClick}
                  authorId={post.author_id || post.page_details?.user_id}
                  currentUserId={currentUserId}
                  currentUserRole={currentUserRole}
                  currentUserGroup={currentUserGroup}
                  ownerGroupName={post.page_details?.owner_group_name}
                  onEditClick={(id, content) => setPostToEdit({ id, content })}
                  onDeleteClick={(id) => setPostToDelete(id)}
                  onBanClick={(id) => setPageToBan(id)}
                />
              </Box>
            );
          })
        )}
      </Box>

      <Dialog open={!!postToEdit} onClose={() => setPostToEdit(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Post</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={postToEdit?.content || ''}
            onChange={(e) =>
              setPostToEdit((prev) => (prev ? { ...prev, content: e.target.value } : null))
            }
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setPostToEdit(null)}
            sx={{ color: '#828282', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditPostSubmit}
            variant="contained"
            sx={{ borderRadius: '20px', textTransform: 'none' }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!postToDelete} onClose={() => setPostToDelete(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete post?</DialogTitle>
        <DialogContent>
          <Typography>This can’t be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setPostToDelete(null)}
            sx={{ color: '#828282', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeletePostSubmit}
            color="error"
            variant="contained"
            sx={{ borderRadius: '20px', textTransform: 'none' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!pageToBan} onClose={() => setPageToBan(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Ban Page</DialogTitle>
        <DialogContent sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography>Specify the unblock date and time for this page:</Typography>
          <TextField
            type="datetime-local"
            variant="outlined"
            fullWidth
            value={banDate}
            onChange={(e) => setBanDate(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setPageToBan(null)}
            sx={{ color: '#828282', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBanSubmit}
            color="error"
            variant="contained"
            disabled={!banDate}
            sx={{ borderRadius: '20px', textTransform: 'none' }}
          >
            Ban
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};
