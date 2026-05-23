import Link from 'next/link';
import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import type { LoginSchema } from '@/entities';

interface SignInCredentialsFormProps {
  form: UseFormReturn<LoginSchema>;
  isPending: boolean;
  onSubmit: (event?: React.BaseSyntheticEvent) => void;
}

const SignInCredentialsForm = ({ form, isPending, onSubmit }: SignInCredentialsFormProps) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 p-1">
      <div className="flex flex-col gap-1">
        <Label htmlFor="sign-in-email">Email</Label>
        <Input id="sign-in-email" placeholder="Enter your email" type="email" {...form.register('email')} />
        {form.formState.errors.email?.message ? (
          <p className="px-1 text-xs text-red-600">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="sign-in-password">Password</Label>
        <Input
          id="sign-in-password"
          placeholder="Enter your password"
          type="password"
          {...form.register('password')}
        />
        {form.formState.errors.password?.message ? (
          <p className="px-1 text-xs text-red-600">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      <div className="flex w-full items-center justify-between px-1 py-1">
        <div className="flex items-center gap-2">
          <Checkbox id="remember-me" />
          <Label htmlFor="remember-me">Remember me</Label>
        </div>
        <Link className="text-sm font-medium text-primary" href="#">
          Forgot password?
        </Link>
      </div>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};

export { SignInCredentialsForm };
