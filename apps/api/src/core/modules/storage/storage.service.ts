import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { buildObjectKey, buildPublicFileUrl } from './storage.helpers';
import { GenerateUploadUrlInput, UploadUrlPayload } from './types';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  private readonly bucket: string;
  private readonly expiresIn: number;
  private readonly region: string;

  private readonly client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.getOrThrow<string>('storage.bucket');
    this.expiresIn = this.configService.getOrThrow<number>('storage.presignedExpiresIn');
    this.region = this.configService.getOrThrow<string>('storage.region');

    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('storage.accessKeyId'),
        secretAccessKey: this.configService.getOrThrow<string>('storage.secretAccessKey'),
      },
    });
  }

  public async generatePresignedUploadUrl(input: GenerateUploadUrlInput): Promise<UploadUrlPayload> {
    const objectKey = buildObjectKey(input.ownerPath, input.fileName);

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: objectKey,
      ContentType: input.contentType,
    });

    try {
      const uploadUrl = await getSignedUrl(this.client, command, {
        expiresIn: this.expiresIn,
      });

      return {
        uploadUrl,
        fileUrl: buildPublicFileUrl(objectKey, this.bucket, this.region),
        expiresIn: this.expiresIn,
      };
    } catch (error) {
      this.logger.error(
        `Failed to generate presigned upload URL: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      throw new InternalServerErrorException('Failed to generate upload URL.');
    }
  }
}
