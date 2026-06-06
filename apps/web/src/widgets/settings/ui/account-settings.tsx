'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { LogOut, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Skeleton } from '@/shared/ui/skeleton';
import { Switch } from '@/shared/ui/switch';
import { authApi, getErrorMessage } from '@/shared/api';
import { ROUTES, WORKSPACE_COOKIE_NAME } from '@/shared/config';
import { confirmPasswordChangeSchema, updateProfileSchema } from '@/entities';
import type { User } from '@/entities';
import type { useProfileSettings } from '@/features/user';

type ProfileSettingsHook = ReturnType<typeof useProfileSettings>;

interface AccountSettingsProps {
  user: User | undefined;
  isLoading: boolean;
  hooks: ProfileSettingsHook;
}

type UpdateProfileForm = z.infer<typeof updateProfileSchema>;
type ConfirmPasswordForm = z.infer<typeof confirmPasswordChangeSchema>;

const AccountSettings = ({ user, isLoading, hooks }: AccountSettingsProps) => {
  const router = useRouter();
  const [codeSent, setCodeSent] = useState(false);

  const profileForm = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
    },
  });

  const passwordForm = useForm<ConfirmPasswordForm>({
    resolver: zodResolver(confirmPasswordChangeSchema),
    defaultValues: { code: '', newPassword: '', confirmPassword: '' },
  });

  const handleProfileSubmit = profileForm.handleSubmit(async (values) => {
    await hooks.updateProfileMutation.mutateAsync({
      firstName: values.firstName,
      lastName: values.lastName ?? null,
    });
  });

  const handleRequestPasswordChange = async () => {
    await hooks.requestPasswordChangeMutation.mutateAsync();
    setCodeSent(true);
  };

  const handleConfirmPasswordChange = passwordForm.handleSubmit(async (values) => {
    await hooks.confirmPasswordChangeMutation.mutateAsync({
      code: values.code,
      newPassword: values.newPassword,
    });
    passwordForm.reset();
    setCodeSent(false);
  });

  const handleToggleTwoFactor = async (enabled: boolean) => {
    await hooks.toggleTwoFactorMutation.mutateAsync(enabled);
  };

  const handleSignOut = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    router.push(ROUTES.SIGN_IN);
    router.refresh();
  };

  const handleDeleteAccount = async () => {
    try {
      await hooks.deleteAccountMutation.mutateAsync();
      document.cookie = `${WORKSPACE_COOKIE_NAME}=;path=/;max-age=0;samesite=lax`;
      router.push(ROUTES.SIGN_IN);
      router.refresh();
    } catch {
      // Mutation hook handles toast errors.
    }
  };

  return (
    <section className="space-y-4">
      {/* Name */}
      <Card>
        <CardHeader>
          <CardTitle>Full Name</CardTitle>
          <CardDescription>Update your first and last name.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <>
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
            </>
          ) : (
            <form id="profile-name-form" onSubmit={handleProfileSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  {...profileForm.register('firstName')}
                />
                {profileForm.formState.errors.firstName && (
                  <p className="text-sm text-destructive">
                    {profileForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  {...profileForm.register('lastName')}
                />
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            type="submit"
            form="profile-name-form"
            disabled={isLoading || hooks.updateProfileMutation.isPending}
          >
            {hooks.updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            We will send a verification code to your email to confirm the change.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!codeSent ? (
            <Button
              variant="outline"
              onClick={handleRequestPasswordChange}
              disabled={hooks.requestPasswordChangeMutation.isPending}
            >
              {hooks.requestPasswordChangeMutation.isPending
                ? 'Sending...'
                : 'Send verification code'}
            </Button>
          ) : (
            <form
              id="password-change-form"
              onSubmit={handleConfirmPasswordChange}
              className="space-y-3"
            >
              <div className="space-y-1.5">
                <Label htmlFor="otp-code">Verification code</Label>
                <Input
                  id="otp-code"
                  placeholder="6-digit code"
                  maxLength={6}
                  {...passwordForm.register('code')}
                />
                {passwordForm.formState.errors.code && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.code.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Min 8 characters"
                  {...passwordForm.register('newPassword')}
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Repeat new password"
                  {...passwordForm.register('confirmPassword')}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </form>
          )}
        </CardContent>
        {codeSent && (
          <CardFooter className="justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCodeSent(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="password-change-form"
              disabled={hooks.confirmPasswordChangeMutation.isPending}
            >
              {hooks.confirmPasswordChangeMutation.isPending ? 'Changing...' : 'Change Password'}
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Email */}
      <Card>
        <CardHeader>
          <CardTitle>Email Address</CardTitle>
          <CardDescription>Your current email address. To change it, contact us.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          {isLoading ? (
            <Skeleton className="h-10 flex-1 rounded-lg" />
          ) : (
            <>
              <Input
                value={user?.email ?? ''}
                disabled
                className="flex-1"
                readOnly
              />
              <a
                href="mailto:support@statter.io"
                className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                Contact us
              </a>
            </>
          )}
        </CardContent>
      </Card>

      {/* 2FA */}
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security — you will receive a verification code by email on each
            login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {user?.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <Switch
              checked={user?.isTwoFactorEnabled ?? false}
              disabled={isLoading || hooks.toggleTwoFactorMutation.isPending}
              onCheckedChange={handleToggleTwoFactor}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sign out */}
      <Card>
        <CardHeader>
          <CardTitle>Sign Out</CardTitle>
          <CardDescription>Sign out from your account on this device.</CardDescription>
        </CardHeader>
        <CardFooter className="justify-end">
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="size-4" />
            Sign Out
          </Button>
        </CardFooter>
      </Card>

      {/* Delete account */}
      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-end">
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  type="button"
                  variant="destructive"
                  disabled={hooks.deleteAccountMutation.isPending}
                />
              }
            >
              <>
                <Trash2 className="size-4" />
                {hooks.deleteAccountMutation.isPending ? 'Deleting...' : 'Delete Account'}
              </>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Your account and all data will be permanently
                  deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={hooks.deleteAccountMutation.isPending}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={hooks.deleteAccountMutation.isPending}
                >
                  {hooks.deleteAccountMutation.isPending ? 'Deleting...' : 'Delete Account'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </section>
  );
};

export { AccountSettings };
