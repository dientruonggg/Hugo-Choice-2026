import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';
import { signInWithGoogle, isFirebaseConfigured, GoogleUserProfile } from '../utils/firebase';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: GoogleUserProfile) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRealGoogleLogin = async () => {
    soundFx.playSelect();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isFirebaseConfigured) {
        const userProfile = await signInWithGoogle();
        onLoginSuccess(userProfile);
        onClose();
      } else {
        // Fallback for environment where Firebase env vars aren't set yet
        setErrorMessage(
          "Firebase config not found in .env. Using demo login for testing."
        );
        setTimeout(() => {
          onLoginSuccess({
            name: 'Hugo Member',
            email: 'member@hugoenglishclub.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HugoMember'
          });
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      console.error("Google Auth error:", err);
      // Clean error messaging for popup closed or cancellation
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Sign in popup was closed before completing.');
      } else if (err?.code === 'auth/cancelled-popup-request') {
        setErrorMessage('Sign in request was cancelled.');
      } else if (err?.code === 'auth/configuration-not-found') {
        setErrorMessage('Google Sign-in chưa được bật trên Firebase Console. Vui lòng vào Firebase Console ➔ Authentication ➔ Sign-in method và bật Google.');
      } else if (err?.message) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to sign in with Google. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    soundFx.playSelect();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: 'Hugo Guest User',
        email: 'guest@hugoenglishclub.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HugoGuest'
      });
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#132217] border-2 border-amber-400/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4 border-b border-white/10">
          <div className="inline-flex p-3 rounded-full bg-amber-400/20 border border-amber-400/50 mb-3">
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
              />
            </svg>
          </div>
          <h2 className="font-cinzel text-2xl font-extrabold text-white">
            Log in to Hugo Award
          </h2>
          <p className="font-sans-clean text-xs text-amber-200/90 mt-1">
            Sign in with Google to cast your official ballot
          </p>
        </div>

        {/* Error message alert */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google Authentication Options */}
        <div className="my-6 space-y-3">
          <button
            onClick={handleRealGoogleLogin}
            disabled={isLoading}
            className="w-full py-4 px-4 rounded-2xl bg-white text-gray-900 font-sans-clean font-bold text-base flex items-center justify-center space-x-3 transition-all cursor-pointer hover:bg-amber-100 hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
              />
            </svg>
            <span>{isLoading ? 'Authenticating...' : 'Sign in with Google'}</span>
          </button>

          {(!isFirebaseConfigured || errorMessage) && (
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 border border-amber-400/40 font-sans-clean text-xs flex items-center justify-center transition-all cursor-pointer"
            >
              <span>Tiếp tục bằng tài khoản Demo / Khách</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
