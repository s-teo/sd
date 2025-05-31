import React from 'react';
import ProfileForm from '../../components/profile/Profile';
import MyAppointments from '../../components/myAppointments/MyAppointments';
import ProfileLayout from '../../components/profileLayout/ProfileLayout';

const ProfilePage = () => {
  return (
    <ProfileLayout sidebar={<MyAppointments />}>
      <ProfileForm />
    </ProfileLayout>
  );
};

export default ProfilePage;
