import { Globe } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { GoogleIcon } from '@/shared/ui/icons';
import { Separator } from '@/shared/ui/separator';

interface AuthSocialButtonsProps {
  googleAuthUrl: string | null;
  githubAuthUrl: string | null;
}

const AuthSocialButtons = ({ googleAuthUrl, githubAuthUrl }: AuthSocialButtonsProps) => {
  return (
    <>
      <div className="flex items-center gap-4 py-3">
        <Separator className="flex-1" />
        <p className="text-tiny text-neutral-500">OR CONTINUE WITH</p>
        <Separator className="flex-1" />
      </div>

      <div className="grid grid-cols-1 gap-2">
        <Button
          variant="outline"
          className="w-full justify-center gap-2"
          disabled={!googleAuthUrl}
          onClick={() => {
            if (googleAuthUrl) {
              window.location.href = googleAuthUrl;
            }
          }}
        >
          <GoogleIcon width={18} height={18} />
          Google
        </Button>
        <Button
          variant="outline"
          className="w-full justify-center gap-2"
          disabled={!githubAuthUrl}
          onClick={() => {
            if (githubAuthUrl) {
              window.location.href = githubAuthUrl;
            }
          }}
        >
          <Globe className="size-4.5" />
          GitHub
        </Button>
      </div>
    </>
  );
};

export { AuthSocialButtons };
