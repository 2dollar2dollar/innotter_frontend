import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { MainLayout } from '~/components/layouts';
import { AppState } from '~/store/reducers';
import { fetchTagsAction, createPageFormAction } from '~/store/actions/posts.action';

export const CreatePage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { tags, isLoading, error } = useSelector((state: AppState) => state.posts);

  // Загружаем существующие теги при открытии страницы
  useEffect(() => {
    dispatch(fetchTagsAction.request());
  }, [dispatch]);

  const handleTagChange = (event: SelectChangeEvent<typeof selectedTags>) => {
    const value = event.target.value;
    const newTags = typeof value === 'string' ? value.split(',') : value;
    // Ограничиваем до 5 тегов
    if (newTags.length <= 5) {
      setSelectedTags(newTags);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    dispatch(
      createPageFormAction.request({
        name,
        description,
        tag_names: selectedTags,
        file: selectedFile || undefined,
        navigate, // Передаем навигатор в сагу, чтобы она перекинула нас после успеха
      })
    );
  };

  return (
    <MainLayout>
      <Box sx={{ py: '15px', px: '30px', borderBottom: '1px solid #E5E7EB' }}>
        <Typography sx={{ fontSize: '24px', fontWeight: 700 }}>Create New Page</Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ pb: 5 }}>
        {/* ЗОНА ЗАГРУЗКИ ФОНОВОГО БАННЕРА */}
        <Box
          sx={{
            width: '100%',
            height: '150px',
            backgroundColor: '#E8EEFA',
            backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <Button
            variant="contained"
            onClick={() => fileInputRef.current?.click()}
            sx={{
              bgcolor: 'rgba(255,255,255,0.8)',
              color: 'black',
              fontWeight: 600,
              borderRadius: '20px',
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ marginRight: '8px' }}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Upload Banner
          </Button>
        </Box>

        <Box sx={{ px: '30px', pt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {error && <Typography color="error">{error}</Typography>}

          <TextField
            label="Page Name"
            variant="outlined"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Box>
            <Typography sx={{ mb: 1, fontWeight: 600 }}>Select Tags (Max 5)</Typography>
            <Select
              multiple
              fullWidth
              value={selectedTags}
              onChange={handleTagChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={`#${value}`}
                      sx={{ bgcolor: '#1D9BF0', color: 'white' }}
                    />
                  ))}
                </Box>
              )}
            >
              {tags.map((tag) => (
                <MenuItem key={tag.id} value={tag.name}>
                  {tag.name}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !name.trim()}
            sx={{
              mt: 2,
              borderRadius: '25px',
              py: 1.5,
              fontSize: '16px',
              fontWeight: 700,
              textTransform: 'none',
            }}
          >
            {isLoading ? 'Creating...' : 'Create Page'}
          </Button>
        </Box>
      </Box>
    </MainLayout>
  );
};
