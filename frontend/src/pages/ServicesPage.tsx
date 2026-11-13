import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AllServicesPage } from '../components/AllServicesPage';
import './ServicesExperience.css';

type CSSPointerCard = HTMLElement & {
  style: CSSStyleDeclaration;
};

const SERVICE_CARD_SELECTOR =
  '.services-experience article, .services-experience [data-3d-card], .services-experience .glass-panel, .services-experience .group, .services-experience [class*="card"]';

function resetCard(card: CSSPointerCard | null) {
  if (!card) return;
  card.classList.remove('route-pointer-card');
  card.style.removeProperty('--route-mx');
  card.style.removeProperty('--route-my');
  card.style.removeProperty('--route-rx');
  card.style.removeProperty('--route-ry');
}

export function ServicesPage() {
  const navigate = useNavigate();
  const activeCardRef = useRef<CSSPointerCard | null>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const shell = event.currentTarget;
    const shellRect = shell.getBoundingClientRect();
    const shellX = ((event.clientX - shellRect.left) / Math.max(shellRect.width, 1)) * 100;
    const shellY = ((event.clientY - shellRect.top) / Math.max(shellRect.height, 1)) * 100;
    shell.style.setProperty('--sxp-pointer-x', `${shellX}%`);
    shell.style.setProperty('--sxp-pointer-y', `${shellY}%`);

    if (event.pointerType === 'touch') return;
    const target = event.target;
    if (!(target instanceof Element)) return;

    const card = target.closest(SERVICE_CARD_SELECTOR) as CSSPointerCard | null;
    if (!card) {
      resetCard(activeCardRef.current);
      activeCardRef.current = null;
      return;
    }

    if (activeCardRef.current !== card) {
      resetCard(activeCardRef.current);
      activeCardRef.current = card;
    }

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / Math.max(rect.width, 1);
    const y = (event.clientY - rect.top) / Math.max(rect.height, 1);
    card.classList.add('route-pointer-card');
    card.style.setProperty('--route-mx', `${x * 100}%`);
    card.style.setProperty('--route-my', `${y * 100}%`);
    card.style.setProperty('--route-rx', `${(0.5 - y) * 5}deg`);
    card.style.setProperty('--route-ry', `${(x - 0.5) * 6}deg`);
  };

  const clearPointerEffects = (event: React.PointerEvent<HTMLDivElement>) => {
    resetCard(activeCardRef.current);
    activeCardRef.current = null;
    event.currentTarget.style.setProperty('--sxp-pointer-x', '50%');
    event.currentTarget.style.setProperty('--sxp-pointer-y', '50%');
  };

  return (
    <div
      className="services-experience services-experience--catalog"
      onPointerMove={handlePointerMove}
      onPointerLeave={clearPointerEffects}
    >
      <div className="services-experience__ambient services-experience__ambient--one" aria-hidden="true" />
      <div className="services-experience__ambient services-experience__ambient--two" aria-hidden="true" />

      <AllServicesPage
        onSelectService={(slug) => navigate(`/services/${slug}`)}
        onOpenConsultation={(category, serviceSlug) => {
          const params = new URLSearchParams();
          if (category) params.set('category', category);
          if (serviceSlug) params.set('service', serviceSlug);
          const query = params.toString();
          navigate(query ? `/book-consultation?${query}` : '/book-consultation');
        }}
        onBackToHome={() => navigate('/')}
      />
    </div>
  );
}

export default ServicesPage;
