import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '~/components/layouts';
import { LoginForm } from '~/components/forms/LoginForm';
import { loginAction } from '~/store/actions/auth.action';
import { AppState } from '~/store/reducers';
import { LoginFormValues } from '~/components/forms/LoginForm/types';

export const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error } = useSelector((state: AppState) => state.auth);

  const handleLogin = (values: LoginFormValues) => {
    dispatch(loginAction.request({ values, navigate }));
  };

  return (
    <AuthLayout>
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} serverError={error} />
    </AuthLayout>
  );
};
