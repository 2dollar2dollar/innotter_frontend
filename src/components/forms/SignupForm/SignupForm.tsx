import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { Button } from '../../shared/Button';
import { FormField } from '../../shared/FormField';

export interface SignupFormValues {
  name: string;
  surname: string;
  email: string;
  phone: string;
  username: string;
  password: string;
}

interface SignupFormProps {
  onSubmit: (values: SignupFormValues) => void;
  isLoading?: boolean;
}

const validationSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Min 2 characters')
    .matches(/^[A-Za-z]+$/, 'Only letters')
    .required('Name is required'),
  surname: yup
    .string()
    .min(2, 'Min 2 characters')
    .matches(/^[A-Za-z]+$/, 'Only letters')
    .required('Surname is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup
    .string()
    .matches(/^\+375 \(\d{2}\) \d{3}-\d{2}-\d{2}$/, 'Please enter a valid phone number')
    .required('Phone number is required'),
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/\d/, 'Must contain at least one number')
    .required('Password is required'),
});

export const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, isLoading }) => {
  const formik = useFormik<SignupFormValues>({
    initialValues: { name: '', surname: '', email: '', phone: '', username: '', password: '' },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
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
          sx={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', mb: 3 }}
        >
          Become a member and enjoy exclusive promotions.
        </Typography>
        <Divider />
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormField
              label="Name"
              placeholder="Name"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={(formik.touched.name && formik.errors.name) || ' '}
            />
            <FormField
              label="Surname"
              placeholder="Surname"
              id="surname"
              name="surname"
              value={formik.values.surname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.surname && Boolean(formik.errors.surname)}
              helperText={(formik.touched.surname && formik.errors.surname) || ' '}
            />
          </Box>

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

          <FormField
            label="Password"
            placeholder="Create a password"
            id="password"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={(formik.touched.password && formik.errors.password) || ' '}
          />

          <Button color="primary" type="submit" fullWidth size="large" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Continue'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};
