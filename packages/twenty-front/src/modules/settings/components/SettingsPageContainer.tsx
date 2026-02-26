import { OBJECT_SETTINGS_WIDTH } from '@/settings/data-model/constants/ObjectSettings';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { ScrollWrapper } from '@/ui/utilities/scroll/components/ScrollWrapper';
import { useScrollRestoration } from '@/ui/utilities/scroll/hooks/useScrollRestoration';
import styled from '@emotion/styled';
import { type ReactNode, useMemo } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import { SettingsPath } from 'twenty-shared/types';
import { getSettingsPath, isDefined } from 'twenty-shared/utils';

const StyledSettingsPageContainer = styled.div<{
  width?: number;
}>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(8)};
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${({ theme }) => theme.spacing(6, 8, 8)};
  width: 100%;
  max-width: ${({ width }) => {
    if (isDefined(width)) {
      return width + 'px';
    }
    if (useIsMobile()) {
      return '100%';
    }
    return OBJECT_SETTINGS_WIDTH + 'px';
  }};
  padding-bottom: ${({ theme }) => theme.spacing(20)};
`;

export const SettingsPageContainer = ({
  children,
}: {
  children: ReactNode;
}) => {
  const location = useLocation();
  const settingsPath = useMemo(() => {
    const sortedPaths = Object.values(SettingsPath).sort(
      (a, b) => b.length - a.length,
    );

    return sortedPaths.find((path) => {
      const settingsPath = getSettingsPath(path);
      const match = matchPath(settingsPath, location.pathname);
      return isDefined(match);
    });
  }, [location.pathname]);

  const componentInstanceId = `scroll-wrapper-settings-page-container-${settingsPath}`;

  // #region agent log
  if (typeof window !== 'undefined') {
    fetch(
      'http://127.0.0.1:7888/ingest/cdd0bf20-cf35-4460-b3a4-5ccefba44a6d',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': '47bed2',
        },
        body: JSON.stringify({
          sessionId: '47bed2',
          runId: 'pre-fix-layout',
          hypothesisId: 'H4',
          location: 'SettingsPageContainer.tsx:render',
          message: 'Settings page layout data',
          data: {
            settingsPath,
            innerWidth: window.innerWidth,
            objectSettingsWidth: OBJECT_SETTINGS_WIDTH,
          },
          timestamp: Date.now(),
        }),
      },
    ).catch(() => {});
  }
  // #endregion agent log

  useScrollRestoration(componentInstanceId);

  return (
    <ScrollWrapper componentInstanceId={componentInstanceId}>
      <StyledSettingsPageContainer>{children}</StyledSettingsPageContainer>
    </ScrollWrapper>
  );
};
