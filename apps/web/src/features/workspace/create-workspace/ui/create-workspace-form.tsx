'use client';

import { Building2, Upload } from 'lucide-react';
import { useCreateWorkspaceFlow } from '../model/use-create-workspace-flow';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

interface CreateWorkspaceFormProps {
  variant?: 'page' | 'modal';
  onSuccess?: () => void;
}

const CreateWorkspaceForm = ({ variant = 'page', onSuccess }: CreateWorkspaceFormProps) => {
  const { form, isPending, logoFile, onNameChange, onSlugChange, onSubmit } =
    useCreateWorkspaceFlow({ onSuccess });

  const workspaceName = form.watch('name');
  const workspaceSlug = form.watch('slug');
  const isModal = variant === 'modal';

  return (
    <section className="space-y-5">
      <div className="border-b border-neutral-200 text-center px-6 py-8">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-black text-white">
          <Building2 className="size-6" />
        </div>
        <h1 className="text-base font-semibold text-black">Create a workspace</h1>
        <p className="mx-auto mt-1 max-w-[220px] text-xs text-neutral-500">
          Set up a common space to manage your links with your team.
        </p>
      </div>
      <form className={isModal ? 'space-y-4 p-1' : 'space-y-5 p-1'} onSubmit={onSubmit}>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="create-workspace-name" className="font-semibold text-neutral-800">
            Workspace name
          </Label>
          <Input
            id="create-workspace-name"
            value={workspaceName}
            placeholder="Acme, Inc."
            onChange={(event) => onNameChange(event.target.value)}
          />
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="create-workspace-slug" className="font-semibold text-neutral-800">
            Workspace slug
          </Label>
          <Input
            id="create-workspace-slug"
            value={workspaceSlug}
            placeholder="acme"
            onChange={(event) => onSlugChange(event.target.value)}
          />
          <p className="text-xs text-neutral-500">
            app.statter.space/{workspaceSlug || 'your-slug'}
          </p>
        </div>

        <div className="flex flex-col space-y-2">
          <Label className="font-semibold text-neutral-800">Workspace logo</Label>
          <div className="flex items-center gap-3">
            <label
              htmlFor="create-workspace-logo"
              className="flex overflow-hidden relative group size-14 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white"
            >
              <div className="flex items-center justify-center rounded-full absolute group-hover:opacity-100 opacity-0 transition-all top-0 left-0 w-full h-full bg-white">
                <Upload className="size-5" />
              </div>
              <Building2 className="size-6 text-neutral-500" />
            </label>
            <div className="space-y-1">
              <input
                id="create-workspace-logo"
                ref={logoFile.inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={logoFile.onFileChange}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => logoFile.inputRef.current?.click()}
              >
                <Upload className="size-4" />
                Upload image
              </Button>
              <p className="text-xs text-neutral-500">Recommended size: 160x160px</p>
              {logoFile.fileName ? (
                <p className="text-xs text-neutral-500">{logoFile.fileName}</p>
              ) : null}
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isPending || !workspaceName.trim()}>
          {isPending ? 'Creating workspace...' : 'Create workspace'}
        </Button>
      </form>
    </section>
  );
};

export { CreateWorkspaceForm };
