import type { BaseSyntheticEvent, ChangeEvent, RefObject } from 'react';
import { Building2, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Skeleton } from '@/shared/ui/skeleton';

interface WorkspaceGeneralSettingsProps {
  workspaceName: string;
  workspaceSlug: string;
  workspaceLogoUrl: string | null;
  isLoading: boolean;
  isSaving: boolean;
  isUploadingLogo: boolean;
  isDeleting: boolean;
  onWorkspaceNameChange: (value: string) => void;
  onWorkspaceSlugChange: (value: string) => void;
  onSaveWorkspaceName: (event?: BaseSyntheticEvent) => void;
  onSaveWorkspaceSlug: (event?: BaseSyntheticEvent) => void;
  logoInputRef: RefObject<HTMLInputElement | null>;
  onLogoFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSelectLogo: () => void;
  onUploadLogo: () => void;
  hasSelectedLogo: boolean;
  selectedLogoFileName: string | null;
  onConfirmDelete: () => void;
}

const WorkspaceGeneralSettings = ({
  workspaceName,
  workspaceSlug,
  workspaceLogoUrl,
  isLoading,
  isSaving,
  isUploadingLogo,
  isDeleting,
  onWorkspaceNameChange,
  onWorkspaceSlugChange,
  onSaveWorkspaceName,
  onSaveWorkspaceSlug,
  logoInputRef,
  onLogoFileChange,
  onSelectLogo,
  onUploadLogo,
  hasSelectedLogo,
  selectedLogoFileName,
  onConfirmDelete,
}: WorkspaceGeneralSettingsProps) => {
  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Workspace Name</CardTitle>
          <CardDescription>This is the name of your workspace on Statter.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 rounded-lg" />
          ) : (
            <form id="workspace-name-form" onSubmit={onSaveWorkspaceName}>
              <Input
                id="workspace-name"
                value={workspaceName}
                maxLength={32}
                placeholder="Workspace name"
                onChange={(event) => onWorkspaceNameChange(event.target.value)}
              />
            </form>
          )}
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <p className="text-sm text-muted-foreground">Max 32 characters.</p>
          <Button
            type="submit"
            form="workspace-name-form"
            disabled={isLoading || isSaving || !workspaceName.trim()}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workspace Slug</CardTitle>
          <CardDescription>This is your workspace&apos;s unique slug on Statter.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 rounded-lg" />
          ) : (
            <form id="workspace-slug-form" onSubmit={onSaveWorkspaceSlug}>
              <Input
                id="workspace-slug"
                value={workspaceSlug}
                maxLength={48}
                placeholder="workspace-slug"
                onChange={(event) => onWorkspaceSlugChange(event.target.value)}
              />
            </form>
          )}
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Only lowercase letters, numbers, and dashes. Max 48 characters.
          </p>
          <Button
            type="submit"
            form="workspace-slug-form"
            disabled={isLoading || isSaving || !workspaceSlug.trim()}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workspace Logo</CardTitle>
          <CardDescription>Upload a logo for your workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={onLogoFileChange}
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex size-12 items-center justify-center overflow-hidden rounded-md border bg-background">
              {workspaceLogoUrl ? (
                <img
                  src={workspaceLogoUrl}
                  alt="Workspace logo"
                  className="size-full object-cover"
                />
              ) : (
                <Building2 className="size-5 text-muted-foreground" />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" variant="outline" onClick={onSelectLogo}>
                Select Logo
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onUploadLogo}
                disabled={!hasSelectedLogo || isUploadingLogo}
              >
                {isUploadingLogo ? 'Uploading...' : 'Upload Logo'}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <p className="text-sm text-muted-foreground">Recommended size: 160x160px.</p>
          {selectedLogoFileName ? (
            <p className="max-w-[260px] truncate text-sm text-muted-foreground">
              {selectedLogoFileName}
            </p>
          ) : (
            <span />
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delete Workspace</CardTitle>
          <CardDescription>
            Permanently delete this workspace and all related projects, monitors, and incidents.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-end gap-3">
          <AlertDialog>
            <AlertDialogTrigger
              render={<Button type="button" variant="destructive" disabled={isLoading || isDeleting} />}
            >
              <>
                <Trash2 className="size-4" />
                {isDeleting ? 'Deleting...' : 'Delete Workspace'}
              </>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete workspace?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your workspace.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={onConfirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Workspace'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </section>
  );
};

export { WorkspaceGeneralSettings };
