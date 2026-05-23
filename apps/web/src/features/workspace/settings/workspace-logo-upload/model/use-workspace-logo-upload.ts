'use client';

import { useSelectedFileRef } from '@/shared/lib/hooks/use-selected-file-ref';

interface UseWorkspaceLogoUploadOptions {
  onUpload: (file: File) => Promise<unknown>;
  isPending: boolean;
}

const useWorkspaceLogoUpload = ({ onUpload, isPending }: UseWorkspaceLogoUploadOptions) => {
  const logoFile = useSelectedFileRef();

  const selectFile = () => {
    logoFile.inputRef.current?.click();
  };

  const uploadSelected = async () => {
    const file = logoFile.getFile();
    if (!file) {
      return;
    }

    try {
      await onUpload(file);
      logoFile.clear();
    } catch {
      // Mutation hook handles toast errors.
    }
  };

  return {
    inputRef: logoFile.inputRef,
    onFileChange: logoFile.onFileChange,
    hasFile: logoFile.hasFile,
    fileName: logoFile.fileName,
    selectFile,
    uploadSelected,
    isSubmitting: isPending,
  };
};

export { useWorkspaceLogoUpload };
