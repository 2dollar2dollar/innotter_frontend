import React from 'react';
import { AuthLayout } from '~/components/layouts';
import { ForgotPasswordForm } from '~/components/forms/ForgotPasswordForm';

export const ForgotPasswordPage: React.FC = () => {
  return (
    <AuthLayout>
      <ForgotPasswordForm onSubmit={(values) => console.log('Forgot Password:', values)} />
    </AuthLayout>
  );
};
