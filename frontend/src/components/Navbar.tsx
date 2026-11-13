import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  FileSpreadsheet,
  BookOpen,
  TrendingUp,
  Wallet,
} from 'lucide-react';

import { useTheme } from '../context/ThemeContext';
import { useGlobalSettings } from '../context/GlobalSettingsContext';
import { BrandLogo } from './BrandLogo';
import './Navbar.css';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { settings } = useGlobalSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const servicesTriggerRef = useRef<HTMLButtonElement | null>(null);
  const servicesPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  // Close the desktop Services dropdown on navigation
  useEffect(() => {
    setServicesOpen(false);
  }, [location.pathname]);

  // Keyboard support for the Services dropdown
  useEffect(() => {
    if (!servicesOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setServicesOpen(false);
        servicesTriggerRef.current?.focus();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        const items = servicesPanelRef.current?.querySelectorAll<HTMLElement>('a');
        items?.[0]?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [servicesOpen]);

  const toggleServices = () => {
    setServicesOpen((open) => !open);
  };

  const closeServices = () => {
    setServicesOpen(false);
  };

  // Lock body scroll only while mobile menu is open, restore on close
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Hire Professionals', path: '/hire-professionals' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const servicesMenu = [
    { name: 'USA Tax Preparation', path: '/usa-tax-preparation-services', icon: FileSpreadsheet },
    { name: 'Bookkeeping & Accounting', path: '/bookkeeping', icon: BookOpen },
    { name: 'Payroll Management', path: '/services/payroll-management', icon: Wallet },
    { name: 'Tax Planning & Advisory', path: '/tax-planning', icon: TrendingUp },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`ptc-navbar fixed top-0 left-0 right-0 z-50 ${isScrolled ? 'ptc-navbar-scrolled' : ''
          }`}
      >
        <div
          className={`ptc-navbar-container ${mobileMenuOpen ? 'ptc-navbar-container-open' : ''
            }`}
        >
          {/* Brand logo (visible on mobile and desktop) */}
          <Link
            to="/"
            className="ptc-navbar-brand flex items-center"
            aria-label="Smart Tax Experts home"
            onClick={closeMobileMenu}
          >
            <BrandLogo />
          </Link>

          {/* Desktop navigation */}
          <nav
            className="ptc-desktop-nav hidden lg:flex items-center"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const active = isActive(link.path);

              if (link.name === 'Services') {
                return (
                  <div
                    key={link.name}
                    className="ptc-nav-item relative"
                  >
                    <div className="ptc-nav-services-row">
                      <Link
                        to={link.path}
                        aria-current={active ? 'page' : undefined}
                        className={`ptc-nav-link ${active ? 'ptc-nav-link-active' : ''}`}
                      >
                        <span>{link.name}</span>
                        {active && <span className="ptc-nav-active-indicator" />}
                      </Link>
                      <button
                        ref={servicesTriggerRef}
                        type="button"
                        onClick={toggleServices}
                        aria-haspopup="true"
                        aria-expanded={servicesOpen}
                        aria-controls="ptc-services-dropdown"
                        aria-label="Toggle services menu"
                        className={`ptc-nav-dropdown-trigger ${servicesOpen ? 'ptc-nav-dropdown-trigger-open' : ''}`}
                      >
                        <ChevronDown className="ptc-nav-chevron" size={14} aria-hidden="true" />
                      </button>
                    </div>

                    <div
                      ref={servicesPanelRef}
                      id="ptc-services-dropdown"
                      className={`ptc-services-dropdown ${servicesOpen ? 'ptc-services-dropdown-open' : ''}`}
                    >
                      <div className="ptc-services-dropdown-inner">
                        {servicesMenu.map((item) => {
                          const itemActive = isActive(item.path);
                          return (
                            <Link
                              key={item.name}
                              to={item.path}
                              onClick={closeServices}
                              aria-current={itemActive ? 'page' : undefined}
                              className={`ptc-services-dropdown-item ${itemActive ? 'ptc-services-dropdown-item-active' : ''}`}
                            >
                              <span className="ptc-services-dropdown-icon">
                                <item.icon size={17} aria-hidden="true" />
                              </span>
                              <span className="ptc-services-dropdown-text">{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={link.name} className="ptc-nav-item relative">
                  <Link
                    to={link.path}
                    aria-current={active ? 'page' : undefined}
                    className={`ptc-nav-link ${active ? 'ptc-nav-link-active' : ''
                      }`}
                  >
                    <span>{link.name}</span>

                    {active && (
                      <span className="ptc-nav-active-indicator" />
                    )}
                  </Link>

                </div>
              );
            })}
          </nav>

          {/* Desktop theme and consultation buttons */}
          <div className="ptc-desktop-actions hidden lg:flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'
                } mode`}
              className="ptc-theme-toggle"
            >
              {theme === 'dark' ? (
                <Sun size={17} />
              ) : (
                <Moon size={17} />
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/book-consultation')}
              className="ptc-consultation-button"
            >
              Book Consultation
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            className="ptc-mobile-toggle lg:hidden"
            onClick={() => {
              setMobileMenuOpen((open) => !open);
            }}
            aria-label={
              mobileMenuOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="ptc-mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="ptc-close-icon" size={24} aria-hidden="true" />
            ) : (
              <Menu className="ptc-menu-icon" size={24} aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          id="ptc-mobile-menu"
          aria-hidden={!mobileMenuOpen}
          inert={!mobileMenuOpen}
          className={`ptc-mobile-panel lg:hidden ${mobileMenuOpen ? 'ptc-mobile-panel-open' : ''
            }`}
        >
          <nav aria-label="Mobile navigation">
            {navLinks.map((link, index) => {
              if (link.name === 'Services') {
                return (
                  <div key={link.name} className="ptc-mobile-accordion">
                    <button
                      type="button"
                      onClick={() => setMobileServicesOpen((open) => !open)}
                      aria-expanded={mobileServicesOpen}
                      aria-controls="ptc-mobile-services-submenu"
                      className={`ptc-mobile-link ${isActive('/services') ? 'ptc-mobile-link-active' : ''
                        } ${mobileServicesOpen ? 'ptc-mobile-accordion-open' : ''}`}
                      style={{ transitionDelay: mobileMenuOpen ? `${index * 30}ms` : '0ms' }}
                    >
                      <span className="ptc-mobile-number">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>{link.name}</span>
                      <ChevronDown className="ptc-mobile-arrow" size={15} aria-hidden="true" />
                    </button>

                    <div
                      id="ptc-mobile-services-submenu"
                      className={`ptc-mobile-submenu ${mobileServicesOpen ? 'ptc-mobile-submenu-open' : ''}`}
                    >
                      {servicesMenu.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={closeMobileMenu}
                          aria-current={isActive(item.path) ? 'page' : undefined}
                          className={`ptc-mobile-submenu-item ${isActive(item.path) ? 'ptc-mobile-submenu-item-active' : ''}`}
                        >
                          <span className="ptc-mobile-submenu-icon">
                            <item.icon size={15} aria-hidden="true" />
                          </span>
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div key={link.name}>
                  <Link
                    to={link.path}
                    onClick={closeMobileMenu}
                    aria-current={
                      isActive(link.path) ? 'page' : undefined
                    }
                    className={`ptc-mobile-link ${isActive(link.path)
                      ? 'ptc-mobile-link-active'
                      : ''
                      }`}
                    style={{
                      transitionDelay: mobileMenuOpen
                        ? `${index * 30}ms`
                        : '0ms',
                    }}
                  >
                    <span className="ptc-mobile-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span>{link.name}</span>

                    <ArrowRight
                      className="ptc-mobile-arrow"
                      size={15}
                    />
                  </Link>

                </div>
              );
            })}
          </nav>


          <div className="ptc-mobile-footer">
            {/* Light / Dark Theme Switch */}
            <div className="ptc-mobile-theme-row">
              <div className="ptc-mobile-theme-info">
                <div className="ptc-mobile-theme-icon">
                  {theme === 'dark' ? (
                    <Moon size={19} />
                  ) : (
                    <Sun size={19} />
                  )}
                </div>

                <div className="ptc-mobile-theme-text">
                  <span className="ptc-mobile-theme-title">
                    Appearance
                  </span>

                  <span className="ptc-mobile-theme-description">
                    {theme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={theme === 'dark'}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                onClick={toggleTheme}
                className={`ptc-theme-switch ${theme === 'dark' ? 'ptc-theme-switch-dark' : ''
                  }`}
              >
                <span className="ptc-theme-switch-thumb">
                  {theme === 'dark' ? (
                    <Moon size={13} />
                  ) : (
                    <Sun size={13} />
                  )}
                </span>
              </button>
            </div>

            {/* Consultation Button */}
            <button
              type="button"
              onClick={() => {
                closeMobileMenu();
                navigate('/book-consultation');
              }}
              className="ptc-mobile-consultation"
            >
              <span>Book Strategic Consultation</span>
              <ArrowRight size={17} />
            </button>

            <p>Preferred Tax Consultancy</p>
          </div>

        </div>
      </header>

      {/* Background overlay while menu is open */}
      <button
        type="button"
        tabIndex={mobileMenuOpen ? 0 : -1}
        aria-label="Close navigation menu"
        onClick={closeMobileMenu}
        className={`ptc-mobile-backdrop lg:hidden ${mobileMenuOpen ? 'ptc-mobile-backdrop-visible' : ''
          }`}
      />
    </>
  );
}
