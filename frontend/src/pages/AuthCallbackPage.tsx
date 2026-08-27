import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RETURN_URL_KEY = 'hirra_auth_return_url';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let handled = false;

    const handleCallback = async () => {
      try {
        // 1. Check for URL error parameters from OAuth provider
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const error = searchParams.get('error_description') || hashParams.get('error_description') || searchParams.get('error') || hashParams.get('error');

        if (error) {
          setErrorMsg(error);
          return;
        }

        // 2. Exchange code / hash for active session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          setErrorMsg(sessionError.message || 'Failed to establish authentication session.');
          return;
        }

        if (session) {
          handled = true;
          const returnUrl = sessionStorage.getItem(RETURN_URL_KEY) || '/';
          try {
            sessionStorage.removeItem(RETURN_URL_KEY);
          } catch {
            // ignore
          }
          navigate(returnUrl, { replace: true });
          return;
        }

        // 3. If session not ready yet, listen for auth state change
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
          if (!handled && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && newSession) {
            handled = true;
            const returnUrl = sessionStorage.getItem(RETURN_URL_KEY) || '/';
            try {
              sessionStorage.removeItem(RETURN_URL_KEY);
            } catch {
              // ignore
            }
            navigate(returnUrl, { replace: true });
          }
        });

        // 4. Timeout fallback after 6s
        setTimeout(() => {
          if (!handled) {
            subscription.unsubscribe();
            setErrorMsg('Authentication timed out. Please try signing in again.');
          }
        }, 6000);

      } catch (err: any) {
        setErrorMsg(err?.message || 'An unexpected error occurred during authentication.');
      }
    };

    handleCallback();
  }, [navigate]);

  if (errorMsg) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 flex items-center justify-center text-red-600 dark:text-red-400 mb-6">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          Authentication Failed
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8 text-sm sm:text-base">
          {errorMsg}
        </p>
        <Button onClick={() => navigate('/', { replace: true })} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 h-11">
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
        <Loader2 size={32} className="animate-spin" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
        Connecting your account...
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
        Please wait while we complete your authentication and load your profile.
      </p>
    </div>
  );
};
