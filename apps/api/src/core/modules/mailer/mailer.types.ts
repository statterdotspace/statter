export interface SendMailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}
