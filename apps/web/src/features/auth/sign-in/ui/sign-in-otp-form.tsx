import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import type { OtpSchema } from '@/entities';

interface SignInOtpFormProps {
  form: UseFormReturn<OtpSchema>;
  isPending: boolean;
  onSubmit: (event?: React.BaseSyntheticEvent) => void;
  onBack: () => void;
}

const SignInOtpForm = ({ form, isPending, onSubmit, onBack }: SignInOtpFormProps) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 p-1">
      <div className="flex flex-col gap-1">
        <Label htmlFor="sign-in-otp-code">Verification code</Label>
        <Input id="sign-in-otp-code" placeholder="Enter 6-digit code" {...form.register('code')} />
        {form.formState.errors.code?.message ? (
          <p className="px-1 text-xs text-red-600">{form.formState.errors.code.message}</p>
        ) : null}
      </div>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? 'Verifying...' : 'Verify code'}
      </Button>
      <Button type="button" variant="outline" className="w-full" onClick={onBack}>
        Back to login
      </Button>
    </form>
  );
};

export { SignInOtpForm };
