import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useAuth, OAuthProvider } from '@/context/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';

const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
    />
  </svg>
);

const LinkedInIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.63 1.63 0 1 0 0-3.26 1.63 1.63 0 0 0 0 3.26M7.86 18.5V10.13H5.07V18.5h2.79Z" />
  </svg>
);

export const CandidateAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signInWithOAuth,
    connectingProvider,
    authError,
    clearAuthError,
  } = useAuth();

  const handleProviderClick = (provider: OAuthProvider) => {
    if (connectingProvider) return;
    signInWithOAuth(provider);
  };

  const isConnecting = Boolean(connectingProvider);

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="sm:max-w-[440px] p-6 sm:p-8">
        
        {/* Header */}
        <DialogHeader className="text-center sm:text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center mb-1">
            <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">H</span>
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Welcome to Hirra
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Find your next opportunity. Continue with your preferred account to get started.
          </DialogDescription>
        </DialogHeader>

        {/* Error Alert Banner */}
        {authError && (
          <div
            role="alert"
            className="flex items-start gap-3 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs sm:text-sm animate-in fade-in"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
            <div className="flex-1">
              <p className="font-semibold">{authError}</p>
            </div>
            <button
              type="button"
              onClick={clearAuthError}
              className="text-red-500 hover:text-red-800 dark:hover:text-red-200 text-xs font-bold"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* OAuth Buttons Stack */}
        <div className="flex flex-col gap-3.5 my-2">
          
          {/* Google */}
          <button
            type="button"
            disabled={isConnecting}
            onClick={() => handleProviderClick('google')}
            className="w-full h-12 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-semibold text-sm sm:text-base flex items-center justify-center gap-3 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {connectingProvider === 'google' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600 dark:text-indigo-400" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <GoogleIcon />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* LinkedIn */}
          <button
            type="button"
            disabled={isConnecting}
            onClick={() => handleProviderClick('linkedin_oidc')}
            className="w-full h-12 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-semibold text-sm sm:text-base flex items-center justify-center gap-3 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {connectingProvider === 'linkedin_oidc' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600 dark:text-indigo-400" />
                <span>Connecting to LinkedIn...</span>
              </>
            ) : (
              <>
                <LinkedInIcon />
                <span>Continue with LinkedIn</span>
              </>
            )}
          </button>

        </div>

        {/* Footer / Terms */}
        <p className="text-xs text-center text-slate-400 dark:text-slate-500 leading-relaxed px-4">
          By continuing, you agree to Hirra's{' '}
          <a href="#terms" className="underline hover:text-indigo-600 dark:hover:text-indigo-400">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#privacy" className="underline hover:text-indigo-600 dark:hover:text-indigo-400">
            Privacy Policy
          </a>
          .
        </p>

      </DialogContent>
    </Dialog>
  );
};
