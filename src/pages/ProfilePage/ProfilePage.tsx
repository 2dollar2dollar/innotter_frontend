import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProfileLayout } from '~/components/layouts';
import { ProfileForm } from '~/components/forms/ProfileForm';
import { fetchProfileAction, updateProfileAction } from '~/store/actions/profile.action';
import { AppState } from '~/store/reducers';

export const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const { data, isLoading, isUpdating, error } = useSelector((state: AppState) => state.profile);

  useEffect(() => {
    dispatch(fetchProfileAction.request());
  }, [dispatch]);

  useEffect(() => {
    if (!isUpdating && !error && data) {
      setIsEditing(false);
    }
  }, [isUpdating, error, data]);

  const handleUpdate = (values: { name: string; surname: string; phone_number: string }) => {
    dispatch(updateProfileAction.request(values));
  };

  if (isLoading && !data) {
    return <div>Loading profile...</div>;
  }

  const initialValues = {
    name: data?.name || '',
    surname: data?.surname || '',
    email: data?.email || '',
    phone_number: data?.phone_number || '',
    username: data?.username || '',
  };

  return (
    <ProfileLayout>
      <ProfileForm
        initialValues={initialValues}
        onSubmit={handleUpdate}
        isLoading={isUpdating}
        serverError={error}
        isEditing={isEditing}
        onEditClick={() => setIsEditing(true)}
      />
    </ProfileLayout>
  );
};
