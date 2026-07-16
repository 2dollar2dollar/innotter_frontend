import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, CircularProgress, InputBase, Button, IconButton } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { MainLayout } from '~/components/layouts';
import { Post } from '~/components/shared/Post';
import { AppState } from '~/store/reducers';
import {
  fetchPostDetailsAction,
  fetchRepliesAction,
  createCommentAction,
  toggleLikeAction,
  PostData,
} from '~/store/actions/posts.action';

import avatarImg from '~/assets/no_avatar.png';

export const PostDetails: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [commentText, setCommentText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { currentPost, replies, likedPostIds, isLoading, error } = useSelector(
    (state: AppState) => state.posts
  );

  useEffect(() => {
    if (postId) {
      dispatch(fetchPostDetailsAction.request(postId));
      dispatch(fetchRepliesAction.request(postId));
    }
  }, [dispatch, postId]);

  const handleToggleLike = (id: string, isCurrentlyLiked: boolean) => {
    dispatch(toggleLikeAction.request({ postId: id, isLiked: isCurrentlyLiked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!commentText.trim() && !selectedFile) || !currentPost) return;

    dispatch(
      createCommentAction.request({
        content: commentText || '\u200B',
        replyTo: currentPost.id,
        pageId: currentPost.page, // Передаем ID страницы поста!
        file: selectedFile || undefined,
      })
    );

    setCommentText('');
    handleRemoveImage();
  };

  if (isLoading && !currentPost) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (!currentPost) {
    return (
      <MainLayout>
        <Typography sx={{ p: 4, textAlign: 'center' }}>Post not found.</Typography>
      </MainLayout>
    );
  }

  // Для главного поста берем автора из author (если есть) ИЛИ из страницы
  const mainUser = currentPost.author || currentPost.page_details?.user;
  const mainAuthorName = mainUser?.name
    ? `${mainUser.name} ${mainUser.surname || ''}`.trim()
    : currentPost.page_details?.name || 'Unknown';
  const mainHandle = mainUser?.username
    ? `@${mainUser.username}`
    : `@user_${currentPost.author_id?.substring(0, 6) || currentPost.page_details?.user_id?.substring(0, 6)}`;

  return (
    <MainLayout>
      <Box
        sx={{
          py: '15px',
          px: '30px',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography
          onClick={() => navigate(-1)}
          sx={{
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: 700,
            '&:hover': { color: '#1D9BF0' },
          }}
        >
          ← Thread
        </Typography>
      </Box>

      <Box sx={{ pt: '20px', borderBottom: '1px solid #E5E7EB' }}>
        <Post
          id={currentPost.id}
          pageId={currentPost.page}
          authorName={mainAuthorName}
          authorHandle={mainHandle}
          timeAgo={new Date(currentPost.created_at).toLocaleDateString()}
          avatarUrl={mainUser?.profile_image_url || avatarImg}
          content={currentPost.content}
          imageUrl={currentPost.image_url || undefined}
          likesCount={currentPost.likes_count}
          isLiked={likedPostIds.includes(currentPost.id)}
          commentsCount={replies.length}
          onToggleLike={handleToggleLike}
        />
      </Box>

      <Box sx={{ position: 'relative', px: '30px', pt: '20px' }}>
        {replies.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              left: '72px',
              top: '0px',
              bottom: '60px',
              width: '2px',
              backgroundColor: '#E5E7EB',
              zIndex: 0,
            }}
          />
        )}

        <Box
          component="form"
          onSubmit={handleCommentSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            ml: '50px',
            mb: '40px',
            zIndex: 1,
            position: 'relative',
          }}
        >
          {error && (
            <Typography color="error" sx={{ mb: 1, fontSize: '14px', fontWeight: 600 }}>
              ⚠️ {error}
            </Typography>
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              borderBottom: '1px solid #E5E7EB',
              pb: 1,
            }}
          >
            <InputBase
              fullWidth
              multiline
              rows={2}
              placeholder="Post your reply..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              sx={{ fontSize: '18px' }}
            />

            {imagePreview && (
              <Box sx={{ position: 'relative', mt: 2, maxWidth: '200px' }}>
                <Box
                  component="img"
                  src={imagePreview}
                  sx={{ width: '100%', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                />
                <IconButton
                  onClick={handleRemoveImage}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                    p: 0.5,
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </IconButton>
              </Box>
            )}
          </Box>

          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}
          >
            <Box>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <IconButton onClick={() => fileInputRef.current?.click()} sx={{ color: '#1D9BF0' }}>
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
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </IconButton>
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={!commentText.trim() && !selectedFile}
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: 600,
                height: '40px',
                px: 3,
              }}
            >
              Reply
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', zIndex: 1, position: 'relative' }}>
          {replies.map((reply: PostData) => {
            // ИСПОЛЬЗУЕМ ДАННЫЕ ИЗ НОВОГО ПОЛЯ AUTHOR, А НЕ ИЗ СТРАНИЦЫ
            const replyUser = reply.author || reply.page_details?.user;
            const replyAuthorName = replyUser?.name
              ? `${replyUser.name} ${replyUser.surname || ''}`.trim()
              : 'Unknown User';
            const replyHandle = replyUser?.username
              ? `@${replyUser.username}`
              : `@user_${reply.author_id?.substring(0, 6) || reply.page_details?.user_id?.substring(0, 6)}`;

            return (
              <Box key={reply.id} sx={{ mb: '10px' }}>
                <Post
                  id={reply.id}
                  pageId={reply.page}
                  authorName={replyAuthorName}
                  authorHandle={replyHandle}
                  timeAgo={new Date(reply.created_at).toLocaleDateString()}
                  avatarUrl={replyUser?.profile_image_url || avatarImg}
                  content={reply.content}
                  imageUrl={reply.image_url || undefined}
                  likesCount={reply.likes_count}
                  isLiked={likedPostIds.includes(reply.id)}
                  commentsCount={reply.replies_count}
                  onToggleLike={handleToggleLike}
                  onCommentClick={(id) => navigate(`/post/${id}`)}
                />
              </Box>
            );
          })}
        </Box>
      </Box>
    </MainLayout>
  );
};
