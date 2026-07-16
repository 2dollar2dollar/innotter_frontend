import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '~/components/layouts';
import { ForgotPasswordForm } from '~/components/forms/ForgotPasswordForm';
import { forgotPasswordAction } from '~/store/actions/auth.action';
import { AppState } from '~/store/reducers';
import { ForgotPasswordFormValues } from '~/components/forms/ForgotPasswordForm/types';

export const ForgotPasswordPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: AppState) => state.auth);

  const handleForgotPassword = (values: ForgotPasswordFormValues) => {
    dispatch(forgotPasswordAction.request({ email: values.email, navigate }));
  };

  return (
    <AuthLayout>
      <ForgotPasswordForm
        onSubmit={handleForgotPassword}
        isLoading={isLoading}
        serverError={error}
      />
    </AuthLayout>
  );
};
