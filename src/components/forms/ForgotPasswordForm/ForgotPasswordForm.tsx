import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { Button } from '../../shared/Button';
import { FormField } from '../../shared/FormField';

export interface ForgotPasswordFormProps {
  onSubmit: (values: { email: string }) => void;
}

const validationSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
});

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
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

          <Button
            color="primary"
            type="submit"
            fullWidth
            size="large"
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
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};
