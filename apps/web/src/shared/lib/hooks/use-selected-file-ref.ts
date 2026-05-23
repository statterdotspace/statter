import { useRef, useState, type ChangeEvent, type RefObject } from 'react';

interface UseSelectedFileRefResult {
  inputRef: RefObject<HTMLInputElement | null>;
  fileName: string | null;
  hasFile: boolean;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  getFile: () => File | null;
  clear: () => void;
}

const useSelectedFileRef = (): UseSelectedFileRefResult => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileRef = useRef<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    fileRef.current = file;
    setFileName(file?.name ?? null);
  };

  const getFile = () => {
    return fileRef.current;
  };

  const clear = () => {
    fileRef.current = null;
    setFileName(null);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return {
    inputRef,
    fileName,
    hasFile: Boolean(fileName),
    onFileChange,
    getFile,
    clear,
  };
};

export { useSelectedFileRef };
