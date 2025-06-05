// ProfileLayout.jsx (пример, если такой есть)
import React from 'react';
import './ProfileLayout.css'

const ProfileLayout = ({ children, sidebar }) => {
  return (
    <div className='profile-layout '>
      <main className='profile-left'>
        {children}
      </main>
      <aside className='profile-right'>
        {sidebar}
      </aside>
    </div>
  );
};

export default ProfileLayout;
