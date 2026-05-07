import React from 'react';
import { AuthLayout } from '~/components/layouts';
import { LoginForm } from '~/components/forms/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <AuthLayout>
      <LoginForm onSubmit={(values) => console.log('Login:', values)} />
    </AuthLayout>
  );
};
