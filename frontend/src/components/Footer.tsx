import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Sun,
  Moon,
  FileCheck,
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

        {/* Live status ticker */}
        <div className="site-footer__live-bar" aria-hidden="true">
          <span className="site-footer__live-dot" />
          <span className="site-footer__live-text">
            Accepting new clients &nbsp;·&nbsp; Year-round US tax &amp; accounting &nbsp;·&nbsp; Federal &amp; State &nbsp;·&nbsp; Secure file transfer &nbsp;·&nbsp; IRS Circular 230 compliant
          </span>
        </div>

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

        {/* Circular 230 disclosure */}
        <section className="site-footer__disclosure" aria-labelledby="site-footer-disclosure-title">
          <div className="site-footer__disclosure-heading" id="site-footer-disclosure-title">
            <FileCheck aria-hidden="true" />
            <span>IRS Circular 230 Disclosure &amp; Confidentiality Notice</span>
          </div>
          <p>
            To ensure compliance with requirements imposed by the Internal Revenue Service, any U.S. federal tax advice contained on this website or in related preliminary communications is not intended or written to be used, and cannot be used, for the purpose of (i) avoiding penalties under the Internal Revenue Code or (ii) promoting, marketing, or recommending to another party any transaction or matter addressed herein. Bilateral Non-Disclosure Agreements (NDAs) govern all client file transmissions.
          </p>
        </section>

        {/* Copyright and legal links */}
        <div className="site-footer__bottom">
          <p className="site-footer__copyright">
            © {new Date().getFullYear()} {settings.brandName}. All rights reserved.
            <span>Registered IRS Tax Return Preparers &amp; CPA Advisory.</span>
          </p>
          <nav className="site-footer__legal" aria-label="Legal information">
            <Link to="/about">Privacy Policy</Link>
            <span aria-hidden="true">•</span>
            <Link to="/about">Terms of Engagement</Link>
            <span aria-hidden="true">•</span>
            <Link to="/about">SOC 2 Type II Certified</Link>
          </nav>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
