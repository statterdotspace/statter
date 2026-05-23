import type { ChangeEvent, RefObject } from 'react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';

interface ProfileAvatarCardProps {
  inputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSelect: () => void;
  onUpload: () => void;
  hasFile: boolean;
  fileName: string | null;
  isUploading: boolean;
}

const ProfileAvatarCard = ({
  inputRef,
  onFileChange,
  onSelect,
  onUpload,
  hasFile,
  fileName,
  isUploading,
}: ProfileAvatarCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-0 text-lg font-semibold">Profile avatar</CardHeader>
      <CardContent className="space-y-3">
        <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />

        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline" onClick={onSelect}>
            Select avatar
          </Button>

          <Button type="button" onClick={onUpload} disabled={!hasFile || isUploading}>
            {isUploading ? 'Uploading...' : 'Upload avatar'}
          </Button>

          {fileName ? <span className="text-xs text-neutral-500">{fileName}</span> : null}
        </div>
      </CardContent>
    </Card>
  );
};

export { ProfileAvatarCard };
