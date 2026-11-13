export interface RegisteredAnimation {
  id: string;
  name: string;
  page: string;
  pageSlug: string;
  section: string;
  sectionKey: string;
  component: string;
  element: string;
  elementType: string;
  animationType: string;
  implementationType: string;
  trigger: string;
  targetSelector: string;
  defaultDuration: string;
  defaultDelay: string;
  defaultSpeed: string;
  defaultEasing: string;
  repeat: string | number;
  cssVarDuration?: string;
  cssVarDelay?: string;
  status: string;
  customCss?: string;
  desktop?: { enabled: boolean; duration?: string; delay?: string };
  tablet?: { enabled: boolean; duration?: string; delay?: string };
  mobile?: { enabled: boolean; duration?: string; delay?: string };
}

import registryData from './websiteAnimationsRegistry.json';

export const websiteAnimationsRegistry: RegisteredAnimation[] = registryData as RegisteredAnimation[];

