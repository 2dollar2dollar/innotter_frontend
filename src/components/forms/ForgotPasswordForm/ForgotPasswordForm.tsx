import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { Button } from '../../shared/Button';
import { FormField } from '../../shared/FormField';
import { ForgotPasswordFormValues, ForgotPasswordFormProps } from './types';

const validationSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
});

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  isLoading,
  serverError,
}) => {
  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues: { email: '' },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <Box sx={{ width: '100%', maxWidth: 440, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '30px',
            lineHeight: '1.2',
            mb: 3,
          }}
        >
          Input your email
          <br />
          to change password
        </Typography>
        <Divider />
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormField
            label="Email address"
            placeholder="Enter your email address"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={(formik.touched.email && formik.errors.email) || ' '}
          />

          {serverError && (
            <Typography color="error" variant="body2" sx={{ textAlign: 'center', mt: -1 }}>
              {serverError}
            </Typography>
          )}

          <Button
            color="primary"
            type="submit"
            fullWidth
            size="large"
            disabled={isLoading}
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: '16px',
              py: 1.5,
              textTransform: 'none',
              borderRadius: 2,
              mt: 1,
            }}
          >
            {isLoading ? 'Sending...' : 'Submit'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};
