import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { Button } from '../../shared/Button';
import { FormField } from '../../shared/FormField';

export interface SignupFormValues {
  fullName: string;
  email: string;
  phone: string;
  username: string;
}

export interface SignupFormProps {
  onSubmit: (values: SignupFormValues) => void;
}

const validationSchema = yup.object({
  fullName: yup.string().required('Full Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup
    .string()
    .matches(/^\+375 \(\d{2}\) \d{3}-\d{2}-\d{2}$/, 'Please enter a valid phone number')
    .required('Phone number is required'),
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
});

export const SignupForm: React.FC<SignupFormProps> = ({ onSubmit }) => {
  const formik = useFormik<SignupFormValues>({
    initialValues: { fullName: '', email: '', phone: '', username: '' },
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
          sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '30px', mb: 1.5 }}
        >
          Account Signup
        </Typography>
        <Typography
          color="text.secondary"
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: '18px',
            lineHeight: '28px',
            mb: 3,
          }}
        >
          Become a member and enjoy exclusive promotions.
        </Typography>
        <Divider />
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormField
            label="Full Name"
            placeholder="Enter your full name"
            id="fullName"
            name="fullName"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={(formik.touched.fullName && formik.errors.fullName) || ' '}
          />

          <FormField
            label="Email Address"
            placeholder="Enter your email"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={(formik.touched.email && formik.errors.email) || ' '}
          />

          <FormField
            label="Phone number"
            isPhone
            id="phone"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={(formik.touched.phone && formik.errors.phone) || ' '}
          />

          <FormField
            label="Username"
            placeholder="Choose a username"
            id="username"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={(formik.touched.username && formik.errors.username) || ' '}
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
            Continue
          </Button>
        </Box>
      </form>
    </Box>
  );
};
