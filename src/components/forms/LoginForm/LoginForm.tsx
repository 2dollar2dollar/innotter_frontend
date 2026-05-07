import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Link, Divider } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { Button } from '../../shared/Button';
import { FormField } from '../../shared/FormField';

export interface LoginFormValues {
  email: string;
  password?: string;
  rememberMe: boolean;
}

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
}

const validationSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  rememberMe: yup.boolean(),
});

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const formik = useFormik<LoginFormValues>({
    initialValues: { email: '', password: '', rememberMe: false },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
    },
  });

  return (
    // ИСПРАВЛЕНИЕ ЗДЕСЬ: Добавили maxWidth: 440 и mx: 'auto'
    <Box sx={{ width: '100%', maxWidth: 440, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '30px', mb: 1.5 }}
        >
          Account Login
        </Typography>
        <Typography
          color="text.secondary"
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: '18px',
            lineHeight: '28px',
          }}
        >
          If you are already a member you can login with your email address and password.
        </Typography>
      </Box>
      <Box sx={{ mb: 3 }}>
        <Divider />
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormField
            label="Email address"
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
            label="Password"
            type="password"
            placeholder="Enter your password"
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={(formik.touched.password && formik.errors.password) || ' '}
          />

          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="rememberMe"
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                Remember me
              </Typography>
            }
            sx={{ mt: -1 }}
          />

          <Button
            color="primary"
            type="submit"
            fullWidth
            size="large"
            sx={{ py: 1.5, textTransform: 'none', fontSize: '16px', borderRadius: 2 }}
          >
            Login{' '}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Don’t have an account ?{' '}
              <Link href="/signup" underline="hover" color="primary">
                Sign up here
              </Link>
            </Typography>
            <Link href="/forgot-password" underline="hover" color="primary" variant="body2">
              Forgot password?
            </Link>
          </Box>
        </Box>
      </form>
    </Box>
  );
};
