import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Sun,
  Moon,
  ArrowUpRight,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useGlobalSettings } from '../context/GlobalSettingsContext';
import { BrandLogo } from './BrandLogo';
import { SocialLinksBar } from './SocialLinksBar';
import './Footer.css';

export function Footer() {
  const { theme, toggleTheme } = useTheme();
  const { settings } = useGlobalSettings();
  const isDark = theme === 'dark';

  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="site-footer__inner">

        {/* Main footer grid */}
        <div className="site-footer__grid">

          {/* Brand and contact information */}
          <section className="site-footer__brand" aria-label={settings.brandName}>
            <Link to="/" className="site-footer__logo" aria-label={`${settings.brandName} home`}>
              <BrandLogo />
            </Link>

            <p className="site-footer__description">
              {settings.description}
            </p>

            <address className="site-footer__contact">
              <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="site-footer__contact-item">
                <Phone aria-hidden="true" />
                <span>{settings.phone}</span>
              </a>
              <a href={`mailto:${settings.email}`} className="site-footer__contact-item">
                <Mail aria-hidden="true" />
                <span>{settings.email}</span>
              </a>
              <div className="site-footer__contact-item">
                <MapPin aria-hidden="true" />
                <span>{settings.address}</span>
              </div>
            </address>

            <SocialLinksBar
              channels={settings.socialChannels}
              fallbackLinks={{
                linkedin: settings.linkedin,
                twitter: settings.twitter,
                facebook: settings.facebook,
                instagram: settings.instagram,
                youtube: settings.youtube,
              }}
              variant="footer"
              iconSize={15}
            />
          </section>

          {/* Core advisory services */}
          <nav className="site-footer__column" aria-label="Core advisory services">
            <h2 className="site-footer__heading">Core Advisory</h2>
            <ul className="site-footer__links">
              <li><Link to="/usa-tax-preparation-services">USA Tax Preparation</Link></li>
              <li><Link to="/services/bookkeeping">Bookkeeping &amp; Accounting</Link></li>
              <li><Link to="/services/payroll-management">Payroll Management</Link></li>
              <li><Link to="/us-tax-planning-services">Tax Planning &amp; Advisory</Link></li>
            </ul>
            <Link className="site-footer__featured-link" to="/hire-professionals">
              Hire Professionals <ArrowUpRight aria-hidden="true" />
            </Link>
          </nav>

          {/* Resources and firm */}
          <nav className="site-footer__column" aria-label="Resources and firm information">
            <h2 className="site-footer__heading">Resources &amp; Firm</h2>
            <ul className="site-footer__links">
              <li><Link to="/blog">Tax Publications &amp; Insights</Link></li>
              <li><Link to="/about">About Our Firm &amp; Integrity</Link></li>
              <li><Link to="/contact">Contact Coordinates</Link></li>
            </ul>

            <div className="site-footer__theme-wrap">
              <button
                type="button"
                onClick={toggleTheme}
                className="site-footer__theme-button"
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
                <span>Switch to {isDark ? 'Light' : 'Dark'} Mode</span>
              </button>
            </div>
          </nav>

        </div>

        {/* Copyright and legal links */}
        <div className="site-footer__bottom">
          <p className="site-footer__copyright">
            © {new Date().getFullYear()} {settings.brandName}. All rights reserved.
            <span>Registered IRS Tax Return Preparers &amp; CPA Advisory.</span>
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
