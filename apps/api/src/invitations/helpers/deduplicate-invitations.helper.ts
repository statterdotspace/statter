export const deduplicateInvitations = <T extends { email: string }>(invitations: T[]) => {
  return Array.from(
    invitations
      .reduce((accumulator, invitation) => {
        if (!accumulator.has(invitation.email)) {
          accumulator.set(invitation.email, invitation);
        }

        return accumulator;
      }, new Map<string, T>())
      .values()
  );
};
