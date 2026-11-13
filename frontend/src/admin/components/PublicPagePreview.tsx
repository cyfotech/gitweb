import React, { useMemo, Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

// Public Pages
import { Home } from '../../pages/Home';
import { AboutUs } from '../../pages/AboutUs';
import { ServicesPage } from '../../pages/ServicesPage';
import { CpaOutsourcingPage } from '../../pages/CpaOutsourcingPage';
import { HireProfessionalsPage } from '../../pages/HireProfessionalsPage';
import { TaxResourcesPage } from '../../pages/TaxResourcesPage';
import { BlogPage } from '../../pages/BlogPage';
import { ContactUs } from '../../pages/ContactUs';
import { BookConsultationPage } from '../../pages/BookConsultationPage';
import { TaxCalculatorPage } from '../../pages/TaxCalculatorPage';

interface ErrorBoundaryProps {
  children: ReactNode;
  pageSlug: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class PreviewErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[PreviewErrorBoundary] Rendering exception on page "${this.props.pageSlug}":`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 my-8 max-w-xl mx-auto rounded-3xl bg-rose-500/10 border border-rose-500/30 text-center text-white backdrop-blur-xl shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
            <AlertCircle size={28} />
          </div>
          <h3 className="text-base font-bold text-rose-300 mb-2">Live Page Preview Interrupted</h3>
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            A component within the <strong>{this.props.pageSlug}</strong> page threw an error:
          </p>
          <div className="p-3 mb-5 rounded-xl bg-black/60 border border-rose-500/20 text-[11px] font-mono text-rose-200 text-left overflow-x-auto">
            {this.state.error?.message || 'Unknown runtime error'}
          </div>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <RefreshCw size={14} />
            <span>Reload Page Preview</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

interface PublicPagePreviewProps {
  pageSlug: string;
}

export function PublicPagePreview({ pageSlug }: PublicPagePreviewProps) {
  const renderedPage = useMemo(() => {
    switch (pageSlug) {
      case 'home':
        return <Home />;
      case 'about':
        return <AboutUs />;
      case 'services':
        return <ServicesPage />;
      case 'cpa-outsourcing':
        return <CpaOutsourcingPage />;
      case 'hire-professionals':
        return <HireProfessionalsPage />;
      case 'tax-resources':
        return <TaxResourcesPage />;
      case 'blog':
        return <BlogPage />;
      case 'contact':
        return <ContactUs />;
      case 'book-consultation':
        return <BookConsultationPage />;
      case 'tax-calculator':
        return <TaxCalculatorPage />;
      default:
        return <Home />;
    }
  }, [pageSlug]);

  const handlePreviewClickCapture = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Intercept clicks on links (<a href="...">) or buttons with href/action
    const linkElement = target.closest('a');
    if (linkElement) {
      const href = linkElement.getAttribute('href');
      // If clicking inside an editable element, EditableElement's handler handles selection
      // But prevent browser / router from navigating away to public website
      e.preventDefault();
      e.stopPropagation();
      console.log('[CMS Preview] Intercepted navigation to:', href);
    }
  };

  return (
    <PreviewErrorBoundary pageSlug={pageSlug}>
      <div 
        onClickCapture={handlePreviewClickCapture}
        className="bg-[#FAFCFB] dark:bg-[#030F14] text-[#12242B] dark:text-[#F4FBFC] transition-colors duration-300 selection:bg-[#49E3D6] selection:text-[#03181E] flex flex-col overflow-x-hidden relative"
      >
        {/* Real Public Navbar */}
        <div className="pointer-events-auto">
          <Navbar />
        </div>

        {/* Real Public Page Body — flex-1 allows natural height growth */}
        <main className="w-full">{renderedPage}</main>

        {/* Real Public Footer */}
        <div className="pointer-events-auto">
          <Footer />
        </div>
      </div>
    </PreviewErrorBoundary>
  );
}
