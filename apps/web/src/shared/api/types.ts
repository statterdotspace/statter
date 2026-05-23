export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiErrorResponse {
  statusCode?: number;
  timestamp?: string;
  path?: string;
  method?: string;
  message?: string | string[];
}

export interface UploadUrlResponse {
  uploadUrl: string;
  fileUrl: string;
  expiresIn: number;
}

export interface UploadUrlPayload {
  fileName: string;
  contentType: string;
}

export interface SuccessResponse {
  success: boolean;
}
