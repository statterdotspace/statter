import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import type { RegisterSchema } from '@/entities';

interface SignUpCredentialsFormProps {
  form: UseFormReturn<RegisterSchema>;
  isPending: boolean;
  onSubmit: (event?: React.BaseSyntheticEvent) => void;
}

const SignUpCredentialsForm = ({ form, isPending, onSubmit }: SignUpCredentialsFormProps) => {
  return (
    <form className="flex flex-col gap-4 p-1" onSubmit={onSubmit}>
      <div className="flex flex-col gap-1">
        <Label htmlFor="sign-up-first-name">First name</Label>
        <Input id="sign-up-first-name" placeholder="First name" {...form.register('firstName')} />
        {form.formState.errors.firstName?.message ? (
          <p className="px-1 text-xs text-red-600">{form.formState.errors.firstName.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="sign-up-last-name">Last name</Label>
        <Input id="sign-up-last-name" placeholder="Last name" {...form.register('lastName')} />
        {form.formState.errors.lastName?.message ? (
          <p className="px-1 text-xs text-red-600">{form.formState.errors.lastName.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="sign-up-email">Email</Label>
        <Input id="sign-up-email" placeholder="Enter your email" type="email" {...form.register('email')} />
        {form.formState.errors.email?.message ? (
          <p className="px-1 text-xs text-red-600">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="sign-up-password">Password</Label>
        <Input
          id="sign-up-password"
          placeholder="Enter your password"
          type="password"
          {...form.register('password')}
        />
        {form.formState.errors.password?.message ? (
          <p className="px-1 text-xs text-red-600">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="sign-up-confirm-password">Confirm password</Label>
        <Input
          id="sign-up-confirm-password"
          placeholder="Confirm password"
          type="password"
          {...form.register('confirmPassword')}
        />
        {form.formState.errors.confirmPassword?.message ? (
          <p className="px-1 text-xs text-red-600">{form.formState.errors.confirmPassword.message}</p>
        ) : null}
      </div>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Sign Up'}
      </Button>
    </form>
  );
};

export { SignUpCredentialsForm };
