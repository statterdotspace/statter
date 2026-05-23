import { Logotype } from '@/shared/ui/logotype';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
  return (
    <div className="mb-3 flex flex-col items-center">
      <Logotype mode="dark" className="size-11" />
      <h2 className="mt-2 text-xl font-medium text-neutral-900">{title}</h2>
      <p className="text-sm text-neutral-500">{subtitle}</p>
    </div>
  );
};

export { AuthHeader };
