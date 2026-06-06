export enum WorkspaceMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  EXPIRED = 'expired',
}

export enum WorkspacePlan {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export enum EnumUserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum EnumUserProvider {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
  GITLAB = 'GITLAB',
}

export enum MonitorType {
  HTTP = 'http',
  HTTPS = 'https',
  TCP = 'tcp',
  PING = 'ping',
}

export enum MonitorRegion {
  EU = 'eu',
  UA = 'ua',
  US = 'us',
  ASIA = 'asia',
}

export enum MonitorStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  DISABLED = 'disabled',
}

export enum CheckStatus {
  UP = 'up',
  DOWN = 'down',
  DEGRADED = 'degraded',
  TIMEOUT = 'timeout',
}

export enum NotificationChannel {
  EMAIL = 'email',
  TELEGRAM = 'telegram',
  SLACK = 'slack',
}
