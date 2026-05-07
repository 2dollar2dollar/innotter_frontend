import React from 'react';
import { ProfileLayout } from '~/components/layouts';
import { ProfileForm } from '~/components/forms/ProfileForm';

export const ProfilePage: React.FC = () => {
  return (
    <ProfileLayout>
      <ProfileForm />
    </ProfileLayout>
  );
};
