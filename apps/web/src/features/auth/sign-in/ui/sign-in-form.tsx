'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { authApi } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { AuthHeader } from '../../shared/ui/auth-header';
import { AuthSocialButtons } from '../../shared/ui/auth-social-buttons';
import { SignInCredentialsForm } from './sign-in-credentials-form';
import { SignInOtpForm } from './sign-in-otp-form';
import { useSignInForm } from '../model/use-sign-in-form';

const SignInForm = () => {
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect');
  const {
    form,
    otpForm,
    isPending,
    isOtpStage,
    otpEmail,
    handleSubmit,
    handleOtpSubmit,
    resetOtpStage,
  } = useSignInForm({ redirectTarget });

  const googleAuthUrl = authApi.getGoogleAuthUrl();
  const githubAuthUrl = authApi.getGithubAuthUrl();

  return (
    <div className="relative z-10 w-full max-w-sm">
      <AuthHeader
        title={isOtpStage ? 'Email verification' : 'Welcome Back'}
        subtitle={
          isOtpStage ? `Enter the 6-digit code sent to ${otpEmail}` : 'Sign in to check your uptime'
        }
      />

      {!isOtpStage ? (
        <SignInCredentialsForm form={form} isPending={isPending} onSubmit={handleSubmit} />
      ) : (
        <SignInOtpForm
          form={otpForm}
          isPending={isPending}
          onSubmit={handleOtpSubmit}
          onBack={resetOtpStage}
        />
      )}

      {!isOtpStage ? (
        <AuthSocialButtons googleAuthUrl={googleAuthUrl} githubAuthUrl={githubAuthUrl} />
      ) : null}

      <p className="mt-5 text-center text-sm text-neutral-600">
        Don&apos;t have an account?{' '}
        <Link
          href={
            redirectTarget
              ? `${ROUTES.SIGN_UP}?redirect=${encodeURIComponent(redirectTarget)}`
              : ROUTES.SIGN_UP
          }
          className="font-medium text-primary"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export { SignInForm };
