import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { GlobalSettingsProvider } from './context/GlobalSettingsContext';
import { AnimationSettingsProvider } from './context/AnimationSettingsContext';
import { BackendStatusProvider } from './context/BackendStatusContext';
import { BackendStatusIndicator } from './components/BackendStatusIndicator';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Public Pages
import { Home } from './pages/Home';
import { AboutUs } from './pages/AboutUs';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailRoute } from './pages/ServiceDetailRoute';
import { CpaOutsourcingPage } from './pages/CpaOutsourcingPage';
import { HireProfessionalsPage } from './pages/HireProfessionalsPage';
import { HireProfessionalRolePage } from './pages/HireProfessionalRolePage';
import { TaxResourcesPage } from './pages/TaxResourcesPage';
import { BlogPage } from './pages/BlogPage';
import { BlogArticlePage } from './pages/BlogArticlePage';
import { ContactUs } from './pages/ContactUs';
import { BookConsultationPage } from './pages/BookConsultationPage';
import { TaxCalculatorPage } from './pages/TaxCalculatorPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Imported Reference Pages
import MainServicesPage from './pages/MainServicesPage.jsx';
import TaxPlanningPage from './pages/services/TaxPlanningPage.jsx';
import TaxPreparationPage from './pages/services/USATaxPreparationPage.jsx';
import BookkeepingPage from './pages/services/BookkeepingPage.jsx';
import PayrollManagementPage from './pages/services/PayrollManagementPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import './pages/ImportedPages.css';

// Admin Pages
import { AdminAuthProvider } from './admin/components/AdminAuthContext';
import { AdminErrorBoundary } from './admin/components/AdminErrorBoundary';
import { VisualEditorProvider } from './context/VisualEditorContext';
import { ProtectedAdminRoute } from './admin/components/ProtectedAdminRoute';
import { AdminLoginPage } from './admin/pages/AdminLogin';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { EditingPagesIndex } from './admin/pages/EditingPages';
import { SectionEditorPage } from './admin/pages/SectionEditor';
import { PageContentEditor } from './admin/pages/PageContentEditor';
import { SEOManagerPage } from './admin/pages/SEOManager';
import { ClickAnalyticsPage } from './admin/pages/ClickAnalytics';
import { ActivityLogsPage } from './admin/pages/ActivityLogs';
import { VisitorDetailPage } from './admin/pages/VisitorDetail';
import { MediaLibraryPage } from './admin/pages/MediaLibrary';
import { AnimationManagerPage } from './admin/pages/AnimationManager';
import { TaxIntelligenceManagerPage } from './admin/pages/TaxIntelligenceManager';
import { ProductionDashboardManagerPage } from './admin/pages/ProductionDashboardManager';
import { ExecutionMapManagerPage } from './admin/pages/ExecutionMapManager';
import { ServiceManagerPage } from './admin/pages/ServiceManager';
import { BlogManagerPage } from './admin/pages/BlogManager';
import { ContactInquiriesPage } from './admin/pages/ContactInquiries';
import { ConsultationsManagerPage } from './admin/pages/ConsultationsManager';
import { GlobalSettingsPage } from './admin/pages/GlobalSettings';

import { analyticsApi } from './api/analytics';
import { visitorApi } from './api/visitors';
import { useAutoTelemetry } from './hooks/useAutoTelemetry';
import { useDynamicSEO } from './hooks/useDynamicSEO';

// Scroll to top helper on route change + pageview analytics
function ScrollToTop() {
  const { pathname, search } = useLocation();

  // Automatic live SEO injection (document.title, canonical, OG, Twitter, JSON-LD)
  useDynamicSEO();

  // Automatic section-view and click tracking on all public pages
  useAutoTelemetry();

  useEffect(() => {
    // If there's an anchor hash, scroll to that element
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track public pageviews automatically
    if (!pathname.startsWith('/admin')) {
      // Legacy analytics
      analyticsApi.initSession().then(() => {
        const slug = pathname === '/' ? 'home' : pathname.replace(/^\//, '');
        analyticsApi.trackPageView(pathname, slug, document.referrer);
      }).catch(() => { });

      // Visitor Activity Tracking with automatic Device & UUID recognition
      const pageTitle = document.title || (pathname === '/' ? 'Home Page' : pathname.replace(/^\//, ''));
      visitorApi.identify(pathname, pageTitle).then((visitor) => {
        const desc = visitor.displayName
          ? `Identified Visitor (${visitor.displayName}) navigated to ${pageTitle}`
          : `Visitor viewed ${pageTitle}`;
        visitorApi.trackActivity({
          activityType: 'page_view',
          page: pageTitle,
          pageUrl: pathname,
          description: desc,
        });
      }).catch(() => { });
    }
  }, [pathname, search]);

  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <GlobalSettingsProvider>
        <AnimationSettingsProvider>
          <BackendStatusProvider>
            <AdminAuthProvider>
              <VisualEditorProvider>
                <BrowserRouter>
                  <BackendStatusIndicator />
                  <Routes>
                    {/* ============================================================
                ADMIN ROUTES — No Navbar/Footer, protected by auth
            ============================================================ */}
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    <Route path="/admin/dashboard" element={
                      <ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>
                    } />
                    <Route path="/admin/pages" element={
                      <ProtectedAdminRoute>
                        <AdminErrorBoundary fallbackTitle="Page Manager Unavailable">
                          <EditingPagesIndex />
                        </AdminErrorBoundary>
                      </ProtectedAdminRoute>
                    } />
                    <Route path="/admin/pages/:pageId/sections" element={
                      <ProtectedAdminRoute>
                        <AdminErrorBoundary fallbackTitle="Section Editor Unavailable">
                          <SectionEditorPage />
                        </AdminErrorBoundary>
                      </ProtectedAdminRoute>
                    } />
                    <Route path="/admin/pages/:pageId/content" element={
                      <ProtectedAdminRoute>
                        <AdminErrorBoundary fallbackTitle="Page Content Editor Unavailable">
                          <PageContentEditor />
                        </AdminErrorBoundary>
                      </ProtectedAdminRoute>
                    } />
                    <Route path="/admin/seo" element={
                      <ProtectedAdminRoute><SEOManagerPage /></ProtectedAdminRoute>
                    } />
                    <Route path="/admin/analytics" element={
                      <ProtectedAdminRoute><ClickAnalyticsPage /></ProtectedAdminRoute>
                    } />
                    <Route path="/admin/analytics/clicks" element={
                      <ProtectedAdminRoute><ClickAnalyticsPage /></ProtectedAdminRoute>
                    } />
                    <Route path="/admin/logs" element={
                      <ProtectedAdminRoute><ActivityLogsPage /></ProtectedAdminRoute>
                    } />
                    <Route path="/admin/logs/system" element={
                      <ProtectedAdminRoute><ActivityLogsPage /></ProtectedAdminRoute>
                    } />
                    <Route path="/admin/visitors/:visitorId" element={
                      <ProtectedAdminRoute><VisitorDetailPage /></ProtectedAdminRoute>
                    } />
                    <Route path="/admin/media" element={
                      <ProtectedAdminRoute><MediaLibraryPage /></ProtectedAdminRoute>
                    } />
                    <Route path="/admin/services" element={
                      <ProtectedAdminRoute><ServiceManagerPage /></ProtectedAdminRoute>
                    } />
                    <Route path="/admin/animations" element={
                      <ProtectedAdminRoute><AnimationManagerPage /></ProtectedAdminRoute>
                    } />
                    <Route path="/admin/tax-intelligence" element={
                      <ProtectedAdminRoute><TaxIntelligenceManagerPage /></ProtectedAdminRoute>
                    } />
                    <Route path="/admin/production-dashboard" element={
                      <ProtectedAdminRoute><ProductionDashboardManagerPage /></ProtectedAdminRoute>
                    } />
                    <Route path="/admin/execution-map" element={
                      <ProtectedAdminRoute><ExecutionMapManagerPage /></ProtectedAdminRoute>
                    } />
                    <Route path="/admin/blog" element={
                      <ProtectedAdminRoute><BlogManagerPage /></ProtectedAdminRoute>
                    } />
                    <Route path="/admin/contact" element={
                      <ProtectedAdminRoute><ContactInquiriesPage /></ProtectedAdminRoute>
                    } />
                    <Route path="/admin/consultations" element={
                      <ProtectedAdminRoute><ConsultationsManagerPage /></ProtectedAdminRoute>
                    } />
                    <Route path="/admin/settings" element={
                      <ProtectedAdminRoute><GlobalSettingsPage /></ProtectedAdminRoute>
                    } />
                    {/* ============================================================
                PUBLIC ROUTES — With Navbar and Footer
            ============================================================ */}
                    <Route path="*" element={
                      <div className="min-h-screen bg-[#FAFCFB] dark:bg-[#030F14] text-[#12242B] dark:text-[#F4FBFC] transition-colors duration-300 selection:bg-[#49E3D6] selection:text-[#03181E] flex flex-col justify-between">
                        <ScrollToTop />
                        <Navbar />
                        <main className="flex-1">
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<AboutUs />} />
                            <Route path="/services" element={<MainServicesPage />} />
                            <Route path="/main-services" element={<MainServicesPage />} />
                            <Route path="/tax-planning" element={<TaxPlanningPage />} />
                            <Route path="/us-tax-planning-services" element={<TaxPlanningPage />} />
                            <Route path="/us-tax-planning-services/*" element={<TaxPlanningPage />} />
                            <Route path="/tax-preparation" element={<TaxPreparationPage />} />
                            <Route path="/usa-tax-preparation-services" element={<TaxPreparationPage />} />
                            <Route path="/usa-tax-preparation-services/*" element={<TaxPreparationPage />} />
                            <Route path="/bookkeeping" element={<BookkeepingPage />} />
                            <Route path="/bookkeeping-services-usa" element={<BookkeepingPage />} />
                            <Route path="/bookkeeping-services-usa/*" element={<BookkeepingPage />} />
                            <Route path="/services/tax-planning" element={<TaxPlanningPage />} />
                            <Route path="/services/tax-preparation" element={<TaxPreparationPage />} />
                            <Route path="/services/bookkeeping" element={<BookkeepingPage />} />
                            <Route path="/services/payroll-management" element={<PayrollManagementPage />} />
                            <Route path="/services/:slug" element={<ServiceDetailRoute />} />
                            <Route path="/cpa-outsourcing" element={<CpaOutsourcingPage />} />
                            <Route path="/hire-professionals" element={<HireProfessionalsPage />} />
                            <Route path="/hire-professionals/:roleSlug" element={<HireProfessionalRolePage />} />
                            <Route path="/tax-resources" element={<TaxResourcesPage />} />
                            <Route path="/blog" element={<BlogPage />} />
                            <Route path="/blog/:slug" element={<BlogArticlePage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/contact-us" element={<ContactPage />} />
                            <Route path="/book-consultation" element={<BookConsultationPage />} />
                            <Route path="/tax-calculator" element={<TaxCalculatorPage />} />
                            <Route path="*" element={<NotFoundPage />} />
                          </Routes>
                        </main>
                        <Footer />
                      </div>
                    } />
                  </Routes>
                </BrowserRouter>
              </VisualEditorProvider>
            </AdminAuthProvider>
          </BackendStatusProvider>
        </AnimationSettingsProvider>
      </GlobalSettingsProvider>
    </ThemeProvider>
  );
}
