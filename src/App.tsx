import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { SignUpPage } from './pages/SignUpPage/SignUpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage/ForgotPasswordPage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { ProfileEditPage } from './pages/ProfilePage/ProfileEditPage';
import { Home } from './pages/home';
import { PageProfile } from './pages/PageProfile/PageProfile';
import { PostDetails } from './pages/PostDetails/PostDetails';
import { Explore } from './pages/Explore/Explore';
import { CreatePage } from './pages/CreatePage/CreatePage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/:userId" element={<ProfilePage />} />
      <Route path="/profile/edit" element={<ProfileEditPage />} />
      <Route path="/create-page" element={<CreatePage />} />
      <Route path="/page/:pageId" element={<PageProfile />} />
      <Route path="/post/:postId" element={<PostDetails />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="*" element={<h1>404: Page Not Found</h1>} />
    </Routes>
  );
};

export default App;
