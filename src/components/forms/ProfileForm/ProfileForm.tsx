import React, { useState } from 'react';
import { Box, Stack, InputBase } from '@mui/material';

import { Avatar } from '~/components/shared/Avatar';
import { ProfileText } from '~/components/shared/ProfileText';
import { LineDivider } from '~/components/shared/LineDivider';
import { Button } from '~/components/shared/Button';

import noAvatar from '~/assets/no_avatar.png';

export const ProfileForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: 'Your name',
    email: 'yourname@gmail.com',
    phone: '',
    username: 'yourname@gmail.com',
  });

  const handleChange =
    (prop: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [prop]: event.target.value });
    };

  const renderInput = (field: keyof typeof formData, placeholder: string) => {
    const hasValue = formData[field].length > 0;

    return (
      <InputBase
        value={formData[field]}
        onChange={handleChange(field)}
        placeholder={placeholder}
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          fontSize: '24px',
          lineHeight: '100%',
          color: hasValue ? '#18191B' : '#696F79',
          width: '100%',
          maxWidth: '400px',
          input: {
            textAlign: 'right',
            padding: 0,
            '&::placeholder': {
              color: '#325285',
              opacity: 1,
            },
          },
        }}
      />
    );
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '706.5px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '30px', mb: '50px' }}>
        <Avatar
          src={noAvatar}
          size="large"
          showEditButton
          onEditClick={() => console.log('Edit Avatar')}
        />
        <Box>
          <ProfileText colorVariant="primary" sx={{ mb: '5px' }}>
            {formData.name || 'Your name'}
          </ProfileText>
          <ProfileText colorVariant="secondary">
            {formData.email || 'yourname@gmail.com'}
          </ProfileText>
        </Box>
      </Box>

      <Stack spacing={0} sx={{ mb: '50px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: '25px',
          }}
        >
          <ProfileText colorVariant="primary">Name</ProfileText>
          {renderInput('name', 'Your name')}
        </Box>
        <LineDivider />

        {/* Email */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: '25px',
          }}
        >
          <ProfileText colorVariant="primary">Email account</ProfileText>
          {renderInput('email', 'yourname@gmail.com')}
        </Box>
        <LineDivider />

        {/* Phone */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: '25px',
          }}
        >
          <ProfileText colorVariant="primary">Mobile number</ProfileText>
          {renderInput('phone', 'Add number')}
        </Box>
        <LineDivider />

        {/* Username */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: '25px',
          }}
        >
          <ProfileText colorVariant="primary">Username</ProfileText>
          {renderInput('username', 'yourname@gmail.com')}
        </Box>
      </Stack>

      {/* Submit Button */}
      <Button
        variant="contained"
        sx={{
          width: '293px',
          height: '80px',
          borderRadius: '12px',
          fontSize: '24px',
          fontWeight: 700,
          fontFamily: 'Inter, sans-serif',
          textTransform: 'none',
        }}
        onClick={() => console.log('Form submitted:', formData)}
      >
        Submit
      </Button>
    </Box>
  );
};
