import { useState, useEffect, useCallback } from 'react';
import { visitorApi, VisitorIdentity } from '../api/visitors';

export function useVisitorTracking() {
  const [visitor, setVisitor] = useState<VisitorIdentity | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize or check visitor identity on mount
  useEffect(() => {
    let mounted = true;
    visitorApi.identify(window.location.pathname, document.title)
      .then((data) => {
        if (mounted) {
          setVisitor(data);
          setIsReady(true);
        }
      })
      .catch((err) => {
        console.warn('Visitor tracking initialization failed:', err);
        if (mounted) setIsReady(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Track page navigation
  const trackPageView = useCallback((pageName: string, path: string) => {
    return visitorApi.trackActivity({
      activityType: 'page_view',
      page: pageName,
      pageUrl: path,
      description: `Navigated to ${pageName}`,
    });
  }, []);

  // Track form open
  const trackFormOpen = useCallback((formName: string) => {
    return visitorApi.trackActivity({
      activityType: 'form_open',
      page: formName,
      pageUrl: window.location.pathname,
      description: `Opened ${formName} form`,
    });
  }, []);

  // Track form submit (with automatic visitor name association!)
  const trackFormSubmit = useCallback(async (
    formType: string,
    name?: string,
    email?: string,
    additionalMetadata?: any
  ) => {
    try {
      if (name || email) {
        // Associate identity with visitor UUID
        const res = await visitorApi.associateIdentity({
          name: name || '',
          email: email || '',
          formType,
          pageUrl: window.location.pathname,
        });

        // Update local state to reflect identified visitor
        if (res?.displayName) {
          setVisitor((prev) => prev ? {
            ...prev,
            displayName: res.displayName,
            identificationStatus: 'identified',
          } : null);
        }
        return res;
      } else {
        // Anonymous submission
        return await visitorApi.trackActivity({
          activityType: 'form_submit_anonymous',
          page: formType,
          pageUrl: window.location.pathname,
          description: `Anonymous form submission for ${formType}`,
          metadata: additionalMetadata,
        });
      }
    } catch (err) {
      console.error('Track form submit error:', err);
    }
  }, []);

  return {
    visitor,
    isReady,
    trackPageView,
    trackFormOpen,
    trackFormSubmit,
  };
}

