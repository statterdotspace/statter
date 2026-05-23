import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  bucket: process.env['AWS_S3_BUCKET'] ?? '',
  region: process.env['AWS_REGION'] ?? '',
  accessKeyId: process.env['AWS_ACCESS_KEY_ID'] ?? '',
  secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'] ?? '',
  presignedExpiresIn: Number(process.env['AWS_PRESIGNED_EXPIRES_IN'] ?? 900),
}));
