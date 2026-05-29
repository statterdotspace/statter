import { CreateWorkspaceForm } from '@/features/workspace';

const CreateWorkspacePageClient = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
      <section className="w-full max-w-lg p-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <CreateWorkspaceForm variant="page" />
      </section>
    </main>
  );
};

export { CreateWorkspacePageClient };
