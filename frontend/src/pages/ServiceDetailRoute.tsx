import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SERVICES_CATALOG, ServiceItem, ClientCategory } from '../data/services';
import { servicesApi } from '../api/services';
import { ServiceDetailPage } from '../components/ServiceDetailPage';
import './ServicesExperience.css';

type CSSPointerCard = HTMLElement;

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

export function ServiceDetailRoute() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const activeCardRef = useRef<CSSPointerCard | null>(null);

  const staticService = SERVICES_CATALOG.find((item) => item.slug === slug);
  const [service, setService] = useState<ServiceItem | undefined>(staticService);
  const [loading, setLoading] = useState<boolean>(!staticService);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);

    servicesApi.getBySlug(slug)
      .then((remote: any) => {
        if (remote && remote.slug) {
          const matchedStatic = SERVICES_CATALOG.find((item) => item.slug === remote.slug);
          setService({
            id: remote.id,
            slug: remote.slug,
            name: remote.name || matchedStatic?.name || '',
            category: (remote.servicecategory?.slug || matchedStatic?.category || 'individual') as ClientCategory,
            shortDescription: remote.shortDescription || matchedStatic?.shortDescription || '',
            fullDescription: remote.fullDescription || matchedStatic?.fullDescription || '',
            iconName: (remote.iconName || matchedStatic?.iconName || 'FileSpreadsheet') as any,
            deliverables: remote.deliverables?.length ? remote.deliverables : (matchedStatic?.deliverables || ['Tax Review', 'Executive Documentation']),
            idealFor: remote.idealFor || matchedStatic?.idealFor || 'Businesses & Individuals',
            turnaroundTime: remote.turnaroundTime || matchedStatic?.turnaroundTime || '2-4 Days',
            popular: remote.isFeatured ?? matchedStatic?.popular ?? false,
            demoType: (remote.demoType || matchedStatic?.demoType || 'tax-workflow') as any,
            heroTagline: remote.heroTagline || matchedStatic?.heroTagline || remote.shortDescription || '',
            features: remote.features?.length ? remote.features : (matchedStatic?.features || []),
            workflow: remote.workflow?.length ? remote.workflow : (matchedStatic?.workflow || []),
            benefits: remote.benefits?.length ? remote.benefits : (matchedStatic?.benefits || []),
            faqs: remote.faqs?.length ? remote.faqs : (matchedStatic?.faqs || []),
            relatedSlugs: remote.relatedSlugs?.length ? remote.relatedSlugs : (matchedStatic?.relatedSlugs || []),
            heroAnimationConfig: remote.additionalImages?.heroAnimationConfig || undefined,
          });
          setNotFound(false);
        } else if (staticService) {
          setService(staticService);
          setNotFound(false);
        } else {
          setService(undefined);
          setNotFound(true);
        }
      })
      .catch((err) => {
        if (staticService) {
          setService(staticService);
          setNotFound(false);
        } else {
          setService(undefined);
          setNotFound(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const shell = event.currentTarget;
    const shellRect = shell.getBoundingClientRect();
    shell.style.setProperty(
      '--sxp-pointer-x',
      `${((event.clientX - shellRect.left) / Math.max(shellRect.width, 1)) * 100}%`
    );
    shell.style.setProperty(
      '--sxp-pointer-y',
      `${((event.clientY - shellRect.top) / Math.max(shellRect.height, 1)) * 100}%`
    );

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

  const consultationNavigation = (category?: string, serviceSlug?: string) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (serviceSlug) params.set('service', serviceSlug);
    const query = params.toString();
    navigate(query ? `/book-consultation?${query}` : '/book-consultation');
  };

  if (loading && !service) {
    return (
      <div className="services-experience services-experience--detail flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-teal-400 font-bold">Loading Service Details...</p>
        </div>
      </div>
    );
  }

  if (notFound || !service) {
    return (
      <div
        className="services-experience services-experience--detail"
        onPointerMove={handlePointerMove}
        onPointerLeave={clearPointerEffects}
      >
        <div className="service-route-not-found">
          <div className="service-route-not-found__orb" aria-hidden="true" />
          <span className="service-route-not-found__eyebrow">SERVICE DIRECTORY</span>
          <h2>Service Not Found</h2>
          <p>
            The requested service catalog item <strong>{slug ?? 'unknown'}</strong> could not be located.
          </p>
          <button type="button" onClick={() => navigate('/services')}>
            View All Services <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="services-experience services-experience--detail"
      onPointerMove={handlePointerMove}
      onPointerLeave={clearPointerEffects}
    >
      <div className="services-experience__ambient services-experience__ambient--one" aria-hidden="true" />
      <div className="services-experience__ambient services-experience__ambient--two" aria-hidden="true" />

      <ServiceDetailPage
        service={service}
        onOpenConsultation={(category, serviceSlug) =>
          consultationNavigation(category, serviceSlug)
        }
        onNavigateService={(newSlug) => navigate(`/services/${newSlug}`)}
        onBackToCatalog={() => navigate('/services')}
        onBackToHome={() => navigate('/')}
      />
    </div>
  );
}

export default ServiceDetailRoute;
