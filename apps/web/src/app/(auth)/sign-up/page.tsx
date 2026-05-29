import { Suspense } from 'react';
import { SignUpPageClient } from './client';

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpPageClient />;
    </Suspense>
  );
}
