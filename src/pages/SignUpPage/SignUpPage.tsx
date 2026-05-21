import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '~/components/layouts';
import { SignupForm } from '~/components/forms/SignupForm';
import { createAccountAction } from '~/store/actions/auth.action';
import { AppState } from '~/store/reducers';
import { SignupFormValues } from '~/components/forms/SignupForm/SignupForm';

export const SignUpPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error } = useSelector((state: AppState) => state.auth);

  const handleSignup = (values: SignupFormValues) => {
    dispatch(createAccountAction.request({ values, navigate }));
  };

  return (
    <AuthLayout>
      <SignupForm onSubmit={handleSignup} isLoading={isLoading} serverError={error} />
    </AuthLayout>
  );
};
