import React from 'react';
import { Box, Stack, InputBase, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { Avatar } from '~/components/shared/Avatar';
import { ProfileText } from '~/components/shared/ProfileText';
import { LineDivider } from '~/components/shared/LineDivider';
import { Button } from '~/components/shared/Button';
import noAvatar from '~/assets/no_avatar.png';

export interface ProfileFormValues {
  name: string;
  surname: string;
  phone_number: string;
  email: string;
  username: string;
}

interface ProfileFormProps {
  initialValues: ProfileFormValues;
  onSubmit: (values: { name: string; surname: string; phone_number: string }) => void;
  isLoading: boolean;
  serverError?: string | null;
  isEditing: boolean;
  onEditClick: () => void;
}

const validationSchema = yup.object({
  name: yup.string().min(2, 'Min 2 chars').required('Name is required'),
  surname: yup.string().min(2, 'Min 2 chars').required('Surname is required'),
  phone_number: yup.string().nullable(),
});

export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
  serverError,
  isEditing,
  onEditClick,
}) => {
  const formik = useFormik<ProfileFormValues>({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      onSubmit({ name: values.name, surname: values.surname, phone_number: values.phone_number });
    },
  });

  const renderInput = (
    field: keyof ProfileFormValues,
    placeholder: string,
    forceDisabled = false
  ) => {
    const isDisabled = !isEditing || forceDisabled;
    const hasValue = formik.values[field] && formik.values[field].length > 0;

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <InputBase
          name={field}
          value={formik.values[field] || ''}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder={placeholder}
          disabled={isDisabled}
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: '24px',
            lineHeight: '100%',
            color: isDisabled ? '#A0A0A0' : hasValue ? '#18191B' : '#696F79',
            width: '100%',
            maxWidth: '400px',
            input: {
              textAlign: 'right',
              padding: 0,
              '&::placeholder': { color: '#325285', opacity: 1 },
            },
          }}
        />
        {formik.touched[field] && formik.errors[field] && (
          <Typography color="error" variant="caption">
            {formik.errors[field]}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ width: '100%', maxWidth: '706.5px' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '30px', mb: '50px' }}>
        <Avatar src={noAvatar} size="large" showEditButton onEditClick={onEditClick} />
        <Box>
          <ProfileText colorVariant="primary" sx={{ mb: '5px' }}>
            {`${formik.values.name} ${formik.values.surname}`.trim() || 'Your name'}
          </ProfileText>
          <ProfileText colorVariant="secondary">
            {formik.values.email || 'yourname@gmail.com'}
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

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: '25px',
          }}
        >
          <ProfileText colorVariant="primary">Surname</ProfileText>
          {renderInput('surname', 'Your surname')}
        </Box>
        <LineDivider />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: '25px',
          }}
        >
          <ProfileText colorVariant="primary">Email account</ProfileText>
          {renderInput('email', 'yourname@gmail.com', true)}
        </Box>
        <LineDivider />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: '25px',
          }}
        >
          <ProfileText colorVariant="primary">Mobile number</ProfileText>
          {renderInput('phone_number', 'Add number')}
        </Box>
        <LineDivider />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: '25px',
          }}
        >
          <ProfileText colorVariant="primary">Username</ProfileText>
          {renderInput('username', 'yourname@gmail.com', true)}
        </Box>
      </Stack>

      {serverError && (
        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
          {serverError}
        </Typography>
      )}

      {isEditing && (
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{
            width: '293px',
            height: '80px',
            borderRadius: '12px',
            fontSize: '24px',
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
            textTransform: 'none',
          }}
        >
          {isLoading ? 'Saving...' : 'Submit'}
        </Button>
      )}
    </Box>
  );
};
