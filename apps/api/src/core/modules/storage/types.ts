export interface GenerateUploadUrlInput {
  ownerPath: string;
  fileName: string;
  contentType: string;
}

export interface UploadUrlPayload {
  uploadUrl: string;
  fileUrl: string;
  expiresIn: number;
}
