'use client';

import { useProfileSettings } from '@/features/user';
import { PageContainer, PageContent } from '@/shared/ui/page-wrapper';
import { AccountSettings } from '@/widgets/settings';

const ProfilePageClient = () => {
  const hooks = useProfileSettings();

  return (
    <PageContainer>
      <PageContent>
        <AccountSettings
          user={hooks.userQuery.data}
          isLoading={hooks.userQuery.isLoading}
          hooks={hooks}
        />
      </PageContent>
    </PageContainer>
  );
};

export { ProfilePageClient };
