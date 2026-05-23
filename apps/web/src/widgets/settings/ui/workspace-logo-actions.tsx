import type { ChangeEvent, RefObject } from 'react';
import { Button } from '@/shared/ui/button';

interface WorkspaceLogoActionsProps {
  inputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSelect: () => void;
  onUpload: () => void;
  hasFile: boolean;
  fileName: string | null;
  isUploading: boolean;
}

const WorkspaceLogoActions = ({
  inputRef,
  onFileChange,
  onSelect,
  onUpload,
  hasFile,
  fileName,
  isUploading,
}: WorkspaceLogoActionsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />

      <Button type="button" variant="outline" onClick={onSelect}>
        Select logo
      </Button>

      <Button type="button" variant="outline" onClick={onUpload} disabled={!hasFile || isUploading}>
        {isUploading ? 'Uploading...' : 'Upload logo'}
      </Button>

      {fileName ? <span className="text-xs text-neutral-500">{fileName}</span> : null}
    </div>
  );
};

export { WorkspaceLogoActions };
