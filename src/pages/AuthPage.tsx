import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { PublicLayout } from '../layouts/PublicLayout';
import { useSmartDeal } from '../contexts/SmartDealContext';
import { UserRole } from '../types';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const navigate = useNavigate();
  const { login, register, pushToast } = useSmartDeal();

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [forgotNotice, setForgotNotice] = useState('');

  // Register State
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState<'buyer' | 'seller'>('buyer');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [regError, setRegError] = useState('');

  useEffect(() => {
    const paramMode = searchParams.get('mode');
    if (paramMode === 'register' || paramMode === 'login') {
      setMode(paramMode);
    }
  }, [searchParams]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setForgotNotice('');

    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      setLoginError('Please enter a valid email address.');
      return;
    }
    if (loginPassword.length < 6) {
      setLoginError('Password must be at least 6 characters.');
      return;
    }

    const emailLower = loginEmail.toLowerCase();
    const role: UserRole = emailLower.includes('admin')
      ? 'admin'
      : emailLower.includes('seller') || emailLower.includes('technova')
      ? 'seller'
      : 'buyer';

    login(loginEmail, role);
    navigate(
      role === 'seller'
        ? '/seller/dashboard'
        : role === 'admin'
        ? '/admin/dashboard'
        : '/buyer/dashboard'
    );
  };

  const handleQuickDemo = (role: UserRole) => {
    const demoEmails: Record<UserRole, string> = {
      buyer: 'aarav@mehtaoffice.in',
      seller: 'sales@technovaperipherals.in',
      admin: 'admin@smartdeal.in',
    };
    login(demoEmails[role], role);
    navigate(
      role === 'seller'
        ? '/seller/dashboard'
        : role === 'admin'
        ? '/admin/dashboard'
        : '/buyer/dashboard'
    );
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (fullName.trim().length < 2) {
      setRegError('Please enter your full name.');
      return;
    }
    if (!regEmail.includes('@')) {
      setRegError('Please enter a valid email address.');
      return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setRegError('Please enter a valid 10-digit Indian phone number.');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== confirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }
    if (!acceptTerms) {
      setRegError('Please accept the Terms and Conditions to create an account.');
      return;
    }

    register({
      fullName: fullName.trim(),
      email: regEmail.trim(),
      phone: phone.trim(),
      role: accountType,
    });
    navigate(accountType === 'seller' ? '/seller/dashboard' : '/buyer/dashboard');
  };

  return (
    <PublicLayout>
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-lg mx-auto bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#14213D]">
                {mode === 'login' ? 'Sign in to SmartDeal' : 'Create your SmartDeal account'}
              </h1>
              <p className="text-sm text-[#64748B] mt-1">
                {mode === 'login'
                  ? 'Access your negotiations, bulk orders, and group buys.'
                  : 'Join as a Buyer or Seller to negotiate deals directly.'}
              </p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-2 text-sm font-semibold rounded-md transition-colors ${
                mode === 'login'
                  ? 'bg-white text-[#14213D] shadow-sm'
                  : 'text-[#64748B] hover:text-[#14213D]'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`py-2 text-sm font-semibold rounded-md transition-colors ${
                mode === 'register'
                  ? 'bg-white text-[#14213D] shadow-sm'
                  : 'text-[#64748B] hover:text-[#14213D]'
              }`}
            >
              Sign Up
            </button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
              {loginError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                  {loginError}
                </div>
              )}
              {forgotNotice && (
                <div className="p-3 rounded-lg bg-[#DCFCE7] text-xs font-medium text-[#14213D] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>{forgotNotice}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@company.in"
                  className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showLoginPass ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-lg text-sm pr-10 focus:outline-none focus:border-[#2563EB]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPass((v) => !v)}
                    aria-label={showLoginPass ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#14213D]"
                  >
                    {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-[#64748B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#E2E8F0] text-[#2563EB]"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotNotice(
                      `Password reset instructions sent to ${loginEmail || 'your registered email'}.`
                    );
                    pushToast('Reset link sent', 'Check your inbox for password recovery.', 'info');
                  }}
                  className="text-[#2563EB] hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-colors"
              >
                Login
              </button>

              <div className="pt-5 border-t border-[#E2E8F0]">
                <p className="text-xs font-medium text-[#64748B] mb-2.5">
                  Instant Demo Portal Access:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('buyer')}
                    className="px-3 py-2 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] text-xs font-semibold text-[#14213D]"
                  >
                    Demo Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('seller')}
                    className="px-3 py-2 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] text-xs font-semibold text-[#14213D]"
                  >
                    Demo Seller
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('admin')}
                    className="px-3 py-2 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] text-xs font-semibold text-[#14213D]"
                  >
                    Demo Admin
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4" noValidate>
              {regError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                  {regError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                  Account type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAccountType('buyer')}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      accountType === 'buyer'
                        ? 'border-[#2563EB] bg-[#2563EB]/5'
                        : 'border-[#E2E8F0] hover:border-[#64748B]'
                    }`}
                  >
                    <p className="text-sm font-semibold text-[#14213D]">Buyer</p>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      Negotiate prices & join group buys
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('seller')}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      accountType === 'seller'
                        ? 'border-[#2563EB] bg-[#2563EB]/5'
                        : 'border-[#E2E8F0] hover:border-[#64748B]'
                    }`}
                  >
                    <p className="text-sm font-semibold text-[#14213D]">Seller</p>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      List inventory & manage counteroffers
                    </p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Rohan Kulkarni"
                  className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1.5">Email</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="rohan@retail.in"
                    className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98201 00000"
                    className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2.5 text-xs text-[#64748B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[#E2E8F0] text-[#2563EB]"
                />
                <span>
                  I accept the SmartDeal Terms and Conditions and Privacy Policy for marketplace
                  negotiations.
                </span>
              </label>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-[#14213D] hover:bg-[#1E293B] text-white text-sm font-semibold transition-colors"
              >
                Create {accountType === 'seller' ? 'Seller' : 'Buyer'} Account
              </button>
            </form>
          )}
        </div>
      </section>
    </PublicLayout>
  );
};
