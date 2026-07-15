import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

import { ProfileLayout } from '~/components/layouts';
import {
  fetchProfileAction,
  updateProfileAction,
  deleteProfileAction,
  uploadAvatarAction,
} from '~/store/actions/profile.action';
import { AppState } from '~/store/reducers';
import { Avatar } from '~/components/shared/Avatar';
import avatarImg from '~/assets/no_avatar.png';
import { FormField } from '~/components/shared/FormField';

// ИСПРАВЛЕНИЕ: Теперь мы собираем номер строго по маске +375 (XX) XXX-XX-XX
// чтобы PatternFormat идеально принял его при первой загрузке.
const getInitialPhone = (phone?: string | null) => {
  if (!phone) return '';

  // 1. Оставляем только цифры
  const digits = phone.replace(/\D/g, '');

  // 2. Отрезаем код страны 375, если он есть
  let main = digits;
  if (digits.startsWith('375')) {
    main = digits.slice(3);
  }

  // Если цифр нет (или был только код), возвращаем пустую строку
  if (!main) return '';

  // 3. Собираем строку строго по формату +375 (##) ###-##-##
  let res = '+375';
  if (main.length > 0) res += ` (${main.slice(0, 2)}`;
  if (main.length > 2) res += `) ${main.slice(2, 5)}`;
  if (main.length > 5) res += `-${main.slice(5, 7)}`;
  if (main.length > 7) res += `-${main.slice(7, 9)}`;

  return res;
};

export const ProfileEditPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFormSaving, setIsFormSaving] = useState(false);

  const { data, isLoading, isUpdating, error } = useSelector((state: AppState) => state.profile);

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone_number: '',
    username: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchProfileAction.request());
  }, [dispatch]);

  // Заполняем форму актуальными данными, только если мы не в режиме редактирования
  useEffect(() => {
    if (data && !isEditing) {
      setFormData({
        name: data.name || '',
        surname: data.surname || '',
        phone_number: getInitialPhone(data.phone_number),
        username: data.username || '',
      });
    }
  }, [data, isEditing]);

  // Закрываем режим редактирования ТОЛЬКО после осознанного нажатия Submit
  useEffect(() => {
    if (isFormSaving && !isUpdating) {
      if (!error) {
        setIsEditing(false);
      }
      setIsFormSaving(false);
    }
  }, [isUpdating, error, isFormSaving]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    if (data) {
      setFormData({
        name: data.name || '',
        surname: data.surname || '',
        phone_number: getInitialPhone(data.phone_number),
        username: data.username || '',
      });
    }
    setIsEditing(false);
    setIsFormSaving(false);
  };

  const handleSaveSubmit = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    const payload: Partial<{ name: string; surname: string; phone_number: string }> = {};

    if (formData.name !== (data?.name || '')) payload.name = formData.name;
    if (formData.surname !== (data?.surname || '')) payload.surname = formData.surname;

    // Очищаем введенный телефон от маски (оставляем только цифры) перед отправкой
    const cleanedPhone = formData.phone_number.replace(/\D/g, '');
    const dataPhoneCleaned = (data?.phone_number || '').replace(/\D/g, '');

    if (cleanedPhone !== dataPhoneCleaned) {
      if (cleanedPhone.length > 3) {
        payload.phone_number = `+${cleanedPhone}`;
      } else {
        payload.phone_number = ''; // Если пользователь полностью стер номер телефона
      }
    }

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      return;
    }

    setIsFormSaving(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(updateProfileAction.request(payload as any));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch(uploadAvatarAction.request(file));
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDeleteProfile = () => {
    dispatch(deleteProfileAction.request({ navigate }));
    setIsDeleteModalOpen(false);
  };

  if (isLoading && !data) {
    return (
      <ProfileLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </ProfileLayout>
    );
  }

  const rawAvatarUrl = data?.profile_image_url;
  const avatar = rawAvatarUrl && String(rawAvatarUrl) !== 'null' ? String(rawAvatarUrl) : avatarImg;
  const userFullTitle = data ? `${data.name} ${data.surname || ''}`.trim() : 'User Profile';

  return (
    <ProfileLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '500px',
          mx: 'auto',
          mt: 4,
          gap: 3,
        }}
      >
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar src={avatar} size="large" />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
          />
          <IconButton
            type="button"
            onClick={() => fileInputRef.current?.click()}
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 4,
              backgroundColor: 'white',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
              border: '1px solid #E5E7EB',
              '&:hover': { backgroundColor: '#F3F4F6' },
              p: '6px',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </IconButton>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '22px' }}>{userFullTitle}</Typography>
          <Typography sx={{ color: '#828282' }}>{data?.email}</Typography>
        </Box>

        {error && (
          <Typography color="error" sx={{ alignSelf: 'flex-start', fontSize: '14px' }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2.5 }}>
          <FormField
            label="Name"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <FormField
            label="Surname"
            name="surname"
            fullWidth
            value={formData.surname}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <FormField
            label="Email account"
            name="email"
            fullWidth
            value={data?.email || ''}
            disabled
          />
          <FormField
            label="Mobile number"
            name="phone_number"
            isPhone={true}
            fullWidth
            value={formData.phone_number}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <FormField
            label="Username"
            name="username"
            fullWidth
            value={formData.username}
            disabled
          />
        </Box>

        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', gap: 2, mt: 2 }}>
          {!isEditing ? (
            <Button
              type="button"
              variant="contained"
              onClick={(e) => {
                e.currentTarget.blur();
                setIsEditing(true);
              }}
              sx={{ borderRadius: '20px', px: 4, py: 1, textTransform: 'none', fontWeight: 600 }}
            >
              Edit Info
            </Button>
          ) : (
            <>
              <Button
                type="button"
                onClick={handleSaveSubmit}
                variant="contained"
                disabled={isUpdating}
                sx={{ borderRadius: '20px', px: 4, py: 1, textTransform: 'none', fontWeight: 600 }}
              >
                {isUpdating ? 'Saving...' : 'Submit'}
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={handleCancel}
                sx={{
                  borderRadius: '20px',
                  px: 4,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#828282',
                  borderColor: '#E5E7EB',
                  '&:hover': { borderColor: '#D1D5DB' },
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Box>

        <Box
          sx={{
            width: '100%',
            borderTop: '1px solid #E5E7EB',
            mt: 4,
            pt: 3,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            type="button"
            variant="text"
            color="error"
            onClick={(e) => {
              e.currentTarget.blur();
              setIsDeleteModalOpen(true);
            }}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#FFF5F5' },
            }}
          >
            Delete Profile Account
          </Button>
        </Box>
      </Box>

      <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete your account permanently?</DialogTitle>
        <DialogContent>
          <Typography>
            This action cannot be undone. You will lose access to all your pages, posts, and
            personal information.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            type="button"
            onClick={() => setIsDeleteModalOpen(false)}
            sx={{ color: '#828282', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDeleteProfile}
            color="error"
            variant="contained"
            sx={{ borderRadius: '20px', textTransform: 'none' }}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </ProfileLayout>
  );
};
