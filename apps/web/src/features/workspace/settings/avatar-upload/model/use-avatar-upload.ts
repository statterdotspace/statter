'use client';

import { useSelectedFileRef } from '@/shared/lib/hooks/use-selected-file-ref';

interface UseAvatarUploadOptions {
  onUpload: (file: File) => Promise<unknown>;
  isPending: boolean;
}

const useAvatarUpload = ({ onUpload, isPending }: UseAvatarUploadOptions) => {
  const avatarFile = useSelectedFileRef();

  const selectFile = () => {
    avatarFile.inputRef.current?.click();
  };

  const uploadSelected = async () => {
    const file = avatarFile.getFile();
    if (!file) {
      return;
    }

    try {
      await onUpload(file);
      avatarFile.clear();
    } catch {
      // Mutation hook handles toast errors.
    }
  };

  return {
    inputRef: avatarFile.inputRef,
    onFileChange: avatarFile.onFileChange,
    hasFile: avatarFile.hasFile,
    fileName: avatarFile.fileName,
    selectFile,
    uploadSelected,
    isSubmitting: isPending,
  };
};

export { useAvatarUpload };
