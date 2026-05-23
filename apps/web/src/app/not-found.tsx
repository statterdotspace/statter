import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 p-4">
      <section className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold">Page not found</h1>
        <div className="mt-4 space-y-4 text-neutral-500">
          <p>The page you are looking for does not exist.</p>
          <Link
            className="inline-flex rounded-lg bg-black px-4 py-2 text-sm text-white"
            href="/sign-in"
          >
            Go to sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
