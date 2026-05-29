import { Suspense } from 'react';
import { SignInPageClient } from './client';

export default function SignInPage() {
  return (
    <Suspense>
      <SignInPageClient />;
    </Suspense>
  );
}
