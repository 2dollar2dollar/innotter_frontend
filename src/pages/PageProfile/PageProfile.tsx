import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  InputBase,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { MainLayout } from '~/components/layouts';
import { Post } from '~/components/shared/Post';
import { AppState } from '~/store/reducers';
import {
  fetchPostsAction,
  fetchPageDetailsAction,
  fetchSubscriptionsAction,
  fetchMyLikesAction,
  toggleFollowAction,
  toggleLikeAction,
  fetchAllPagesAction,
  createPostAction,
  editPageAction,
  deletePageAction,
  editPostAction,
  deletePostAction,
  blockPageAction,
  PostData,
  TagData,
} from '~/store/actions/posts.action';
import { Avatar } from '~/components/shared/Avatar';
import avatarImg from '~/assets/no_avatar.png';

export const PageProfile: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [postText, setPostText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [isDeletePageOpen, setIsDeletePageOpen] = useState(false);
  const [pageEditName, setPageEditName] = useState('');
  const [pageEditDesc, setPageEditDesc] = useState('');
  const [editPageFile, setEditPageFile] = useState<File | null>(null);
  const [editPagePreview, setEditPagePreview] = useState<string | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const [postToEdit, setPostToEdit] = useState<{ id: string; content: string } | null>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [pageToBan, setPageToBan] = useState<string | null>(null);
  const [banDate, setBanDate] = useState('');

  const {
    items: posts,
    subscribedPageIds,
    likedPostIds,
    isLoading,
    currentPageDetails,
  } = useSelector((state: AppState) => state.posts);
  const isAuthenticated = !!localStorage.getItem('accessToken');

  const currentUserData = useMemo(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const rawRole = payload.role || payload.role_name || 'USER';
      return {
        id: payload.id || payload.user_id || payload.sub,
        role: String(rawRole).toUpperCase(), // ФОРСИРУЕМ ВЕРХНИЙ РЕГИСТР
        group: payload.group_name || payload.group || '',
      };
    } catch {
      return null;
    }
  }, []);

  const currentUserId = currentUserData?.id;
  const currentUserRole = currentUserData?.role;
  const currentUserGroup = currentUserData?.group;

  const isMyPage = currentPageDetails?.user_id === String(currentUserId);
  const isFollowed = pageId ? subscribedPageIds.includes(pageId) : false;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchSubscriptionsAction.request());
      dispatch(fetchMyLikesAction.request());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (pageId) {
      dispatch(fetchPageDetailsAction.request(pageId));
      dispatch(fetchPostsAction.request({ feedType: 'page', pageId }));
    }
  }, [dispatch, pageId]);

  const handleToggleFollow = (id: string, isCurrentlyFollowed: boolean) =>
    dispatch(toggleFollowAction.request({ pageId: id, isCurrentlyFollowed }));
  const handleToggleLike = (postId: string, isCurrentlyLiked: boolean) =>
    dispatch(toggleLikeAction.request({ postId, isLiked: isCurrentlyLiked }));
  const handleCommentClick = (postId: string) => navigate(`/post/${postId}`);
  const handleTagClick = (tagName: string) => {
    navigate('/explore');
    dispatch(fetchAllPagesAction.request({ tags: tagName }));
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

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!postText.trim() && !selectedFile) || !pageId) return;
    dispatch(
      createPostAction.request({
        content: postText || '\u200B',
        imageFile: selectedFile || undefined,
        pageId: pageId,
      })
    );
    setPostText('');
    handleRemoveImage();
  };

  const handleEditPageSubmit = () => {
    if (pageId) {
      dispatch(
        editPageAction.request({
          pageId,
          name: pageEditName,
          description: pageEditDesc,
          file: editPageFile || undefined,
        })
      );
      setIsEditPageOpen(false);
    }
  };
  const handleDeletePageSubmit = () => {
    if (pageId) {
      dispatch(deletePageAction.request({ pageId, navigate }));
      setIsDeletePageOpen(false);
    }
  };
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

  const userAvatar = currentPageDetails?.user?.profile_image_url || avatarImg;
  const handle = currentPageDetails?.user?.username
    ? `@${currentPageDetails.user.username}`
    : `@user_${currentPageDetails?.user_id?.substring(0, 6)}`;
  const postsCount = currentPageDetails?.posts_count || 0;

  return (
    <MainLayout>
      <Box sx={{ borderBottom: '1px solid #E5E7EB', pb: 4 }}>
        <Box
          sx={{
            width: '100%',
            height: '150px',
            backgroundColor: '#E8EEFA',
            backgroundImage: currentPageDetails?.image_url
              ? `url(${currentPageDetails.image_url})`
              : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Box sx={{ px: '30px', position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              top: '-60px',
              border: '4px solid white',
              borderRadius: '50%',
              backgroundColor: 'white',
            }}
          >
            <Avatar src={String(userAvatar)} size="large" />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              minHeight: '60px',
              pt: 2,
              pb: 1,
              gap: 1,
            }}
          >
            {currentPageDetails && !isMyPage && (
              <Button
                variant={isFollowed ? 'outlined' : 'contained'}
                onClick={() => handleToggleFollow(pageId || '', isFollowed)}
                sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 600 }}
              >
                {isFollowed ? 'Unfollow' : 'Follow'}
              </Button>
            )}
            {isMyPage && (
              <>
                <Button
                  variant="outlined"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    setPageEditName(currentPageDetails?.name || '');
                    setPageEditDesc(currentPageDetails?.description || '');
                    setEditPagePreview(currentPageDetails?.image_url || null);
                    setEditPageFile(null);
                    setIsEditPageOpen(true);
                  }}
                  sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 600 }}
                >
                  Edit Page
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    setIsDeletePageOpen(true);
                  }}
                  sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 600 }}
                >
                  Delete
                </Button>
              </>
            )}
          </Box>
          <Box sx={{ mt: 1, position: 'relative' }}>
            <Typography sx={{ fontWeight: 800, fontSize: '24px' }}>
              {currentPageDetails?.name || 'Loading...'}
            </Typography>
            <Typography sx={{ color: '#828282', mb: 1.5 }}>{handle}</Typography>
            {currentPageDetails?.tags && currentPageDetails.tags.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 1.5 }}>
                {currentPageDetails.tags.map((t: TagData) => (
                  <Typography
                    key={t.id}
                    onClick={() => handleTagClick(t.name)}
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
            {currentPageDetails?.description && (
              <Typography sx={{ mb: 2, maxWidth: '80%' }}>
                {currentPageDetails.description}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              <Typography sx={{ color: '#828282' }}>
                <strong style={{ color: 'black' }}>
                  {currentPageDetails?.followers_count || 0}
                </strong>{' '}
                Followers
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                bottom: '0px',
                right: '0px',
                display: 'flex',
                alignItems: 'center',
                color: '#828282',
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
              <Typography sx={{ fontSize: '15px', fontWeight: 600 }}>{postsCount}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {isMyPage && (
        <Box sx={{ p: '20px 30px', borderBottom: '1px solid #E5E7EB' }}>
          <Box
            component="form"
            onSubmit={handleCreatePost}
            sx={{ display: 'flex', flexDirection: 'column' }}
          >
            <InputBase
              placeholder="What’s happening"
              multiline
              fullWidth
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              sx={{ fontSize: '20px', mb: 2, pt: 1 }}
            />
            {imagePreview && (
              <Box sx={{ position: 'relative', mb: 2, maxWidth: '200px' }}>
                <Box
                  component="img"
                  src={imagePreview}
                  sx={{ width: '100%', borderRadius: '12px', border: '1px solid #E5E7EB' }}
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                disabled={!postText.trim() && !selectedFile}
                sx={{ borderRadius: '25px', textTransform: 'none', fontWeight: 600, px: 3, py: 1 }}
              >
                Post
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      <Box sx={{ pt: 2 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Typography sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            No posts yet.
          </Typography>
        ) : (
          posts.map((post: PostData) => {
            const postUser = post.author || post.page_details?.user;
            const authorName = postUser?.name
              ? `${postUser.name} ${postUser.surname || ''}`.trim()
              : post.page_details?.name || 'Unknown Page';
            const postHandle = postUser?.username
              ? `@${postUser.username}`
              : `@user_${post.author_id?.substring(0, 6) || post.page_details?.user_id?.substring(0, 6) || 'unknown'}`;
            const avatar = postUser?.profile_image_url || avatarImg;

            return (
              <Box key={post.id} sx={{ py: '20px', px: '30px', borderBottom: '1px solid #E5E7EB' }}>
                <Post
                  id={post.id}
                  pageId={post.page}
                  isFollowed={isFollowed}
                  onToggleFollow={handleToggleFollow}
                  authorName={authorName}
                  authorHandle={postHandle}
                  timeAgo={new Date(post.created_at).toLocaleDateString()}
                  avatarUrl={String(avatar)}
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

      {/* МОДАЛКИ */}
      <Dialog
        open={isEditPageOpen}
        onClose={() => setIsEditPageOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Page</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Box
            sx={{
              width: '100%',
              height: '100px',
              backgroundColor: '#E8EEFA',
              backgroundImage: editPagePreview ? `url(${editPagePreview})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
            }}
          >
            <input
              type="file"
              accept="image/*"
              ref={editFileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setEditPageFile(e.target.files[0]);
                  setEditPagePreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
              style={{ display: 'none' }}
            />
            <Button
              variant="contained"
              onClick={() => editFileInputRef.current?.click()}
              sx={{ bgcolor: 'rgba(255,255,255,0.8)', color: 'black' }}
            >
              Change Banner
            </Button>
          </Box>
          <TextField
            label="Name"
            fullWidth
            value={pageEditName}
            onChange={(e) => setPageEditName(e.target.value)}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={pageEditDesc}
            onChange={(e) => setPageEditDesc(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setIsEditPageOpen(false)} sx={{ color: '#828282' }}>
            Cancel
          </Button>
          <Button onClick={handleEditPageSubmit} variant="contained" sx={{ borderRadius: '20px' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isDeletePageOpen} onClose={() => setIsDeletePageOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete this page?</DialogTitle>
        <DialogContent>
          <Typography>
            This action cannot be undone. All posts and followers will be lost.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setIsDeletePageOpen(false)} sx={{ color: '#828282' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeletePageSubmit}
            color="error"
            variant="contained"
            sx={{ borderRadius: '20px' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
          <Button onClick={() => setPostToEdit(null)} sx={{ color: '#828282' }}>
            Cancel
          </Button>
          <Button onClick={handleEditPostSubmit} variant="contained" sx={{ borderRadius: '20px' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!postToDelete} onClose={() => setPostToDelete(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete post?</DialogTitle>
        <DialogContent>
          <Typography>This can’t be undone and it will be removed from your profile.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPostToDelete(null)} sx={{ color: '#828282' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeletePostSubmit}
            color="error"
            variant="contained"
            sx={{ borderRadius: '20px' }}
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
          <Button onClick={() => setPageToBan(null)} sx={{ color: '#828282' }}>
            Cancel
          </Button>
          <Button
            onClick={handleBanSubmit}
            color="error"
            variant="contained"
            disabled={!banDate}
            sx={{ borderRadius: '20px' }}
          >
            Ban
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};
