import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_USERS } from '../data/mockItems';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup' | 'google';
  actionPromptMessage?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'signin',
  actionPromptMessage,
}) => {
  const { loginWithPassword, loginWithGoogle, signUp, switchUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'google'>(defaultTab);

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sign Up state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpDepartment, setSignUpDepartment] = useState('Computer Science & Engineering');
  const [signUpClassYear, setSignUpClassYear] = useState("Class of '26");
  const [signUpStudentId, setSignUpStudentId] = useState('');

  // Google sign in custom email
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');
  const [showGoogleCustomInput, setShowGoogleCustomInput] = useState(false);

  if (!isOpen) return null;

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const res = await loginWithPassword(signInEmail, signInPassword);
    setIsLoading(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Failed to sign in. Please verify your credentials.');
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const res = await signUp({
      name: signUpName,
      email: signUpEmail,
      password: signUpPassword,
      department: signUpDepartment,
      classYear: signUpClassYear,
      studentId: signUpStudentId,
    });
    setIsLoading(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Registration failed. Please check inputs.');
    }
  };

  const handleGoogleSignIn = async (email: string, name?: string) => {
    setIsLoading(true);
    await loginWithGoogle(email, name);
    setIsLoading(false);
    onClose();
  };

  const isEduEmail = (email: string) => email.toLowerCase().trim().endsWith('.edu');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50 backdrop-blur-sm animate-fadeIn">
      <div onClick={onClose} className="fixed inset-0" aria-hidden="true" />

      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-3xl shadow-2xl overflow-hidden z-10 border border-outline-variant/30 flex flex-col">
        {/* Top Header */}
        <div className="px-6 pt-6 pb-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              alt="CampusLoop"
              className="h-7 w-auto"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCxdGVUrZLCKyGDgr5UkF4AcGtRpBbWI4fP1MNKBoXrXM0dwEXrM2JC9_YKrz5OneXBeWDWvZVGz44vhr7TwveLxGYX6CYF2nDp_A03nonhzPAj5Hd9H7NIvjsFrg_F5BRbjJvgMCEHsYzN3uQPtL0Y9DQLY6n98ULE1vIevmvk9UUAYgf2bWVMUWDtjWW6Q79YWMM7cw2zcbRUr0Q6H1-SwTyveh12LgfnrMGEwkYFjTMft-N7SI-"
            />
            <div>
              <h2 className="font-title-md text-title-md text-primary font-semibold">
                CampusLoop Portal
              </h2>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Verified Student Network
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Action Prompt Banner if opened from a restricted action */}
        {actionPromptMessage && (
          <div className="bg-secondary-container/70 px-6 py-2.5 border-b border-secondary-container flex items-center gap-2 text-on-secondary-fixed text-label-md">
            <span className="material-symbols-outlined text-[18px] text-primary">lock</span>
            <span>{actionPromptMessage}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 bg-surface-container p-1.5 mx-6 mt-4 rounded-xl text-center">
          <button
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setErrorMsg('');
            }}
            className={`py-1.5 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
              activeTab === 'signin'
                ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setErrorMsg('');
            }}
            className={`py-1.5 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('google');
              setErrorMsg('');
            }}
            className={`py-1.5 rounded-lg font-label-md text-label-md transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'google'
                ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>Google</span>
          </button>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-error-container text-on-error-container text-label-md flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 pt-4 max-h-[72vh] overflow-y-auto">
          {/* TAB 1: Sign In */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                  University or Personal Email
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
                    mail
                  </span>
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="student@college.edu or gmail"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                {signInEmail && isEduEmail(signInEmail) && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-primary font-medium mt-1">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    <span>.EDU Domain detected: Verified student tier</span>
                  </span>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-label-md text-label-md text-on-surface font-semibold">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setSignInEmail('aarav.m@college.edu');
                      setSignInPassword('student2026');
                    }}
                    className="text-primary text-[11px] hover:underline cursor-pointer"
                  >
                    Fill Demo Password
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface-container text-on-surface text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-on-surface-variant hover:text-on-surface cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary-container hover:bg-primary text-on-primary font-title-md text-title-md rounded-xl shadow-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to CampusLoop</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>

              {/* Quick Google Sign In Row */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-surface-container w-full" />
                <span className="bg-surface-container-lowest px-3 font-label-sm text-label-sm text-on-surface-variant shrink-0">
                  Or continue with
                </span>
                <div className="border-t border-surface-container w-full" />
              </div>

              <button
                type="button"
                onClick={() => handleGoogleSignIn('nishanth.s.3005@gmail.com', 'Nishanth S.')}
                className="w-full py-2.5 px-4 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md rounded-xl transition-all border border-outline-variant/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>

              {/* Demo Accounts Switcher */}
              <div className="pt-2 border-t border-surface-container">
                <span className="font-label-sm text-label-sm text-on-surface-variant block mb-2 font-semibold uppercase tracking-wider">
                  Quick Switch Verified Student:
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      switchUser(DEFAULT_USERS[0]);
                      onClose();
                    }}
                    className="flex-1 p-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-left cursor-pointer transition-colors"
                  >
                    <div className="font-label-md text-label-md font-semibold text-primary">
                      Aarav Mehta
                    </div>
                    <div className="text-[11px] text-on-surface-variant">CSE '26 (Host)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      switchUser(DEFAULT_USERS[1]);
                      onClose();
                    }}
                    className="flex-1 p-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-left cursor-pointer transition-colors"
                  >
                    <div className="font-label-md text-label-md font-semibold text-primary">
                      Priya Sharma
                    </div>
                    <div className="text-[11px] text-on-surface-variant">Bio '25 (Peer)</div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: Register / Sign Up */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                  Full Name *
                </label>
                <input
                  required
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="e.g. Maya Chen"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                  University Email (.edu preferred) *
                </label>
                <input
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
                />
                <span className="text-[11px] text-on-surface-variant mt-1 block">
                  {isEduEmail(signUpEmail)
                    ? '✓ Verified .edu student badge will be assigned automatically.'
                    : 'Personal emails can also browse and participate with peer-endorsed status.'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Department
                  </label>
                  <select
                    value={signUpDepartment}
                    onChange={(e) => setSignUpDepartment(e.target.value)}
                    className="w-full px-2.5 py-2.5 rounded-xl bg-surface-container text-on-surface text-label-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                  >
                    <option value="Computer Science & Engineering">CS &amp; Engineering</option>
                    <option value="Bioengineering & Life Sciences">Bioengineering</option>
                    <option value="Electrical Engineering">Electrical Eng.</option>
                    <option value="Mathematics & Physics">Mathematics</option>
                    <option value="Architecture & Design">Architecture</option>
                    <option value="Arts & Humanities">Humanities</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Class Year
                  </label>
                  <select
                    value={signUpClassYear}
                    onChange={(e) => setSignUpClassYear(e.target.value)}
                    className="w-full px-2.5 py-2.5 rounded-xl bg-surface-container text-on-surface text-label-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                  >
                    <option value="Class of '25">Class of '25 (Senior)</option>
                    <option value="Class of '26">Class of '26 (Junior)</option>
                    <option value="Class of '27">Class of '27 (Sophomore)</option>
                    <option value="Class of '28">Class of '28 (Freshman)</option>
                    <option value="Graduate Student">Graduate Student</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                  Create Password *
                </label>
                <input
                  type="password"
                  required
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-2 bg-primary-container hover:bg-primary text-on-primary font-title-md text-title-md rounded-xl shadow-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                <span>Create Verified Account</span>
              </button>
            </form>
          )}

          {/* TAB 3: Google Sign In Direct */}
          {activeTab === 'google' && (
            <div className="space-y-4">
              <div className="text-center p-3">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <h3 className="font-title-md text-title-md text-on-surface">
                  Choose a Google Account
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  to continue to CampusLoop Mutual Aid
                </p>
              </div>

              {/* Detected user Google account */}
              <div className="space-y-2 border border-surface-container rounded-2xl p-2 bg-surface-container-low">
                <button
                  type="button"
                  onClick={() => handleGoogleSignIn('nishanth.s.3005@gmail.com', 'Nishanth S.')}
                  className="w-full p-3 rounded-xl hover:bg-surface-container flex items-center justify-between transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                      N
                    </div>
                    <div>
                      <div className="font-label-md text-label-md font-semibold text-on-surface group-hover:text-primary">
                        Nishanth S.
                      </div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant">
                        nishanth.s.3005@gmail.com
                      </div>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary group-hover:underline">
                    Sign in
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGoogleSignIn('priya.s.collegeresearch@gmail.com', 'Priya S.')}
                  className="w-full p-3 rounded-xl hover:bg-surface-container flex items-center justify-between transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-container text-primary flex items-center justify-center font-bold text-sm">
                      P
                    </div>
                    <div>
                      <div className="font-label-md text-label-md font-semibold text-on-surface group-hover:text-primary">
                        Priya S. (Campus Lab)
                      </div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant">
                        priya.s.collegeresearch@gmail.com
                      </div>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary group-hover:underline">
                    Sign in
                  </span>
                </button>
              </div>

              {/* Custom Google Email Option */}
              {showGoogleCustomInput ? (
                <div className="space-y-2 pt-2">
                  <input
                    type="email"
                    value={googleCustomEmail}
                    onChange={(e) => setGoogleCustomEmail(e.target.value)}
                    placeholder="Enter any @gmail.com address"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (googleCustomEmail.includes('@')) {
                        handleGoogleSignIn(googleCustomEmail);
                      }
                    }}
                    className="w-full py-2.5 bg-primary text-on-primary font-label-md text-label-md rounded-xl cursor-pointer"
                  >
                    Authenticate with this Google Account
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowGoogleCustomInput(true)}
                  className="w-full py-2 text-primary font-label-md text-label-md hover:underline flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Use another Google account</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
