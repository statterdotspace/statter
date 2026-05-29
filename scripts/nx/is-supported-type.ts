export type ISupportedProjectType = 'app' | 'lib' | 'e2e';

export const supportedProjectTypes: ISupportedProjectType[] = ['app', 'lib', 'e2e'];

export function isSupportedProjectType(type: string): type is ISupportedProjectType {
  return supportedProjectTypes.includes(type as ISupportedProjectType);
}
