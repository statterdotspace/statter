'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authApi, getErrorMessage } from '@/shared/api';
import { otpSchema, registerSchema, type OtpSchema, type RegisterSchema } from '@/entities';
import { toast } from 'sonner';
import { AUTH_MESSAGES } from '../../shared/model/auth.constants';
import { useAuthSuccessRedirect } from '../../shared/model/use-auth-success-redirect';

const useSignUpForm = () => {
  const { redirectAfterAuth } = useAuthSuccessRedirect();
  const [isPending, setIsPending] = useState(false);
  const [otpEmail, setOtpEmail] = useState<string | null>(null);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
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
      const { confirmPassword: _confirmPassword, ...payload } = values;
      const response = await authApi.register(payload);

      if (response.status === 'otp_required') {
        setOtpEmail(response.identifier);
        toast.success(AUTH_MESSAGES.SIGNUP_CREATED);
      }
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
      const response = await authApi.verifyRegister({
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

export { useSignUpForm };
