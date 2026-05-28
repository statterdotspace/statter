import { WorkspaceMemberRole } from '@statter/database';

interface BuildInvitationEmailInput {
  workspaceName: string;
  role: WorkspaceMemberRole;
  inviteUrl: string;
}

const toRoleLabel = (role: WorkspaceMemberRole) => {
  if (role === WorkspaceMemberRole.ADMIN) {
    return 'Admin';
  }

  if (role === WorkspaceMemberRole.OWNER) {
    return 'Owner';
  }

  return 'Member';
};

const buildInvitationEmail = ({ workspaceName, role, inviteUrl }: BuildInvitationEmailInput) => {
  const roleLabel = toRoleLabel(role);
  const subject = `You're invited to join ${workspaceName} on Statter`;
  const text = [
    `You've been invited to join "${workspaceName}" as ${roleLabel}.`,
    'This invitation is valid for 14 days.',
    `Accept invitation: ${inviteUrl}`,
  ].join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827;">
      <h2 style="margin:0 0 12px;">Workspace invitation</h2>
      <p style="margin:0 0 8px;">You've been invited to join <strong>${workspaceName}</strong> as <strong>${roleLabel}</strong>.</p>
      <p style="margin:0 0 16px;">This invitation is valid for <strong>14 days</strong>.</p>
      <a href="${inviteUrl}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:8px;">Accept invitation</a>
      <p style="margin:16px 0 0;color:#6b7280;font-size:12px;">If the button doesn't work, open this link: ${inviteUrl}</p>
    </div>
  `;

  return { subject, text, html };
};

export { buildInvitationEmail };

