import React from 'react';
import { AuthLayout } from '~/components/layouts';
import { SignupForm } from '~/components/forms/SignupForm';

export const SignUpPage: React.FC = () => {
  return (
    <AuthLayout>
      <SignupForm onSubmit={(values) => console.log('Signup:', values)} />
    </AuthLayout>
  );
};
