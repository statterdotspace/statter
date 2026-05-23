'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authApi, getErrorMessage } from '@/shared/api';
import { loginSchema, otpSchema, type LoginSchema, type OtpSchema } from '@/entities';
import { toast } from 'sonner';
import { AUTH_MESSAGES } from '../../shared/model/auth.constants';
import { useAuthSuccessRedirect } from '../../shared/model/use-auth-success-redirect';

const useSignInForm = () => {
  const { redirectAfterAuth } = useAuthSuccessRedirect();
  const [isPending, setIsPending] = useState(false);
  const [otpEmail, setOtpEmail] = useState<string | null>(null);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const otpForm = useForm<OtpSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setIsPending(true);

    try {
      const response = await authApi.login(values);

      if (response.status === 'otp_required') {
        setOtpEmail(response.identifier);
        toast.success(AUTH_MESSAGES.OTP_SENT);
        return;
      }

      toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);
      await redirectAfterAuth();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsPending(false);
    }
  });

  const handleOtpSubmit = otpForm.handleSubmit(async (values) => {
    if (!otpEmail) {
      return;
    }

    setIsPending(true);

    try {
      const response = await authApi.verifyLogin({
        email: otpEmail,
        code: values.code,
      });

      if (response.status === 'authenticated') {
        toast.success(AUTH_MESSAGES.OTP_VERIFIED);
        await redirectAfterAuth();
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsPending(false);
    }
  });

  const resetOtpStage = () => {
    setOtpEmail(null);
    otpForm.reset({ code: '' });
  };

  return {
    form,
    otpForm,
    isPending,
    isOtpStage: Boolean(otpEmail),
    otpEmail,
    handleSubmit,
    handleOtpSubmit,
    resetOtpStage,
  };
};

export { useSignInForm };
