'use client';

import Link from 'next/link';
import { authApi } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { AuthHeader } from '../../shared/ui/auth-header';
import { AuthSocialButtons } from '../../shared/ui/auth-social-buttons';
import { SignUpCredentialsForm } from './sign-up-credentials-form';
import { SignUpOtpForm } from './sign-up-otp-form';
import { useSignUpForm } from '../model/use-sign-up-form';

const SignUpForm = () => {
  const { form, otpForm, isPending, isOtpStage, otpEmail, handleSubmit, handleOtpSubmit, resetOtpStage } =
    useSignUpForm();

  const googleAuthUrl = authApi.getGoogleAuthUrl();
  const githubAuthUrl = authApi.getGithubAuthUrl();

  return (
    <div className="relative z-10 w-full max-w-sm">
      <AuthHeader
        title={isOtpStage ? 'Verify your email' : 'Welcome!'}
        subtitle={isOtpStage ? `Enter the 6-digit code sent to ${otpEmail}` : 'Sign up to check your uptime'}
      />

      {!isOtpStage ? (
        <SignUpCredentialsForm form={form} isPending={isPending} onSubmit={handleSubmit} />
      ) : (
        <SignUpOtpForm form={otpForm} isPending={isPending} onSubmit={handleOtpSubmit} onBack={resetOtpStage} />
      )}

      {!isOtpStage ? (
        <AuthSocialButtons googleAuthUrl={googleAuthUrl} githubAuthUrl={githubAuthUrl} />
      ) : null}

      <p className="mt-5 text-center text-sm text-neutral-600">
        Already have an account?{' '}
        <Link className="font-medium text-primary" href={ROUTES.SIGN_IN}>
          Sign In
        </Link>
      </p>
    </div>
  );
};

export { SignUpForm };
