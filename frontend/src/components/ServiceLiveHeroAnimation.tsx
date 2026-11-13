import React from 'react';
import type { ServiceItem } from '../data/services';
import { ServiceHeroAnimationRouter } from './serviceHeroAnimations/ServiceHeroAnimationRouter';

interface ServiceLiveHeroAnimationProps {
  service: ServiceItem;
}

export function ServiceLiveHeroAnimation({ service }: ServiceLiveHeroAnimationProps) {
  return (
    <div className="relative mt-2 w-full overflow-hidden transition-all duration-300">
      <ServiceHeroAnimationRouter service={service} />
    </div>
  );
}
