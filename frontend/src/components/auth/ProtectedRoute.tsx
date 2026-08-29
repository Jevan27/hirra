import React, { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingState } from '@/components/common/LoadingState';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'CANDIDATE' | 'EMPLOYER' | 'ADMIN'>;
  requireCompleteProfile?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = ['CANDIDATE'],
  requireCompleteProfile = false,
}) => {
  const { user, isLoading, openAuthModal } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      openAuthModal({ returnUrl: location.pathname + location.search });
    }
  }, [isLoading, user, location, openAuthModal]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingState message="Verifying authentication..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Redirect candidate to onboarding if their profile is incomplete
  if (
    requireCompleteProfile &&
    user.role === 'CANDIDATE' &&
    user.profileCompleted === false &&
    location.pathname !== '/candidate/onboarding'
  ) {
    return <Navigate to="/candidate/onboarding" replace />;
  }

  return <>{children}</>;
};
