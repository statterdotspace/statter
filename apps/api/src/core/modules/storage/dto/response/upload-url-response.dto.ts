import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UploadUrlResponseDto {
  @Expose()
  uploadUrl: string;

  @Expose()
  fileUrl: string;

  @Expose()
  expiresIn: number;
}
