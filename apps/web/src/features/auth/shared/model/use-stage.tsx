'use client';

import React from 'react';

export type Stage = 'login' | 'register' | 'verification' | 'twoFactor';

interface IStageContext {
  stage: Stage;
  setStage: (stage: Stage) => void;
}
interface IStageProvider {
  defaultStage?: Stage;
  children: React.ReactNode;
}

export const useStage = () => React.useContext(StageContext);

export const StageContext = React.createContext<IStageContext>({
  stage: 'login',
  setStage: (_stage) => undefined,
});

export const StageProvider: React.FC<IStageProvider> = ({ children, defaultStage = 'login' }) => {
  const [stage, setStage] = React.useState<Stage>(defaultStage);

  const value = React.useMemo(() => ({ stage, setStage }), [stage]);

  return <StageContext.Provider value={value}>{children}</StageContext.Provider>;
};
