import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CandidateAuthModal } from './components/auth/CandidateAuthModal';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { JobsPage } from './pages/JobsPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { CompanyDetailPage } from './pages/CompanyDetailPage';
import { EmployersPage } from './pages/EmployersPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { CandidateOnboardingPage } from './pages/CandidateOnboardingPage';
import { CandidateProfilePage } from './pages/CandidateProfilePage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/:id" element={<CompanyDetailPage />} />
          <Route path="/employers" element={<EmployersPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route
            path="/candidate/onboarding"
            element={
              <ProtectedRoute allowedRoles={['CANDIDATE']}>
                <CandidateOnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['CANDIDATE']} requireCompleteProfile={true}>
                <CandidateProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/candidate/profile" element={<Navigate to="/profile" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <CandidateAuthModal />
    </AuthProvider>
  );
}
