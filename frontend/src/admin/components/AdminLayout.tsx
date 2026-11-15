import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileEdit, Search, MousePointer, Activity,
  ChevronDown, ChevronRight, LogOut, User, Bell, Menu, X,
  Sun, Moon, Image, Briefcase, FileText, Calendar, Settings,
  TrendingUp, BarChart2, Globe, Shield, Sparkles, Sliders, Tag, PlayCircle
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useBackendStatus } from '../../context/BackendStatusContext';
import { FloatingBackground, MagneticButton } from './ThreeDComponents';
import { BrandLogo } from '../../components/BrandLogo';

interface SidebarItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: { label: string; href: string }[];
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
    href: '/admin/dashboard',
  },
  {
    key: 'editing-pages',
    label: 'Website Page Manager',
    icon: <FileEdit size={18} />,
    children: [
      { label: 'Blog Manager', href: '/admin/blog' },
      { label: 'Media Library', href: '/admin/media' },
      { label: 'Contact Inquiries', href: '/admin/contact' },
      { label: 'Consultations', href: '/admin/consultations' },
    ],
  },
  {
    key: 'seo',
    label: 'SEO Manager',
    icon: <Search size={18} />,
    href: '/admin/seo',
  },
  {
    key: 'settings',
    label: 'Global Settings',
    icon: <Settings size={18} />,
    href: '/admin/settings',
  },
  {
    key: 'analytics',
    label: 'Click Analytics',
    icon: <MousePointer size={18} />,
    children: [
      { label: 'Overview', href: '/admin/analytics' },
      { label: 'Page Views', href: '/admin/analytics/pages' },
      { label: 'Click Events', href: '/admin/analytics/clicks' },
    ],
  },
  {
    key: 'logs',
    label: 'Activity Logs',
    icon: <Activity size={18} />,
    children: [
      { label: 'Admin Activity', href: '/admin/logs' },
      { label: 'System Logs', href: '/admin/logs/system' },
    ],
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { admin, logout } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const { isFullyAvailable, status } = useBackendStatus();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['editing-pages']);
  const [loggingOut, setLoggingOut] = useState(false);

  const toggleSection = (key: string) => {
    setExpandedSections(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const isActive = (href: string) => location.pathname === href;
  const isParentActive = (item: SidebarItem) => {
    if (item.href) return isActive(item.href);
    return item.children?.some(c => location.pathname.startsWith(c.href)) ?? false;
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full select-none">
      {/* Brand Header with Original Frontend BrandLogo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-teal-500/10 dark:border-teal-500/15">
        <Link to="/admin/dashboard" className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-teal-500/20 shadow-sm">
            <BrandLogo className="h-8 w-auto" />
          </div>

          {(sidebarOpen || mobileSidebarOpen) && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold tracking-tight bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-300 dark:to-cyan-200 bg-clip-text text-transparent">
                  Admin CMS
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-teal-500/10 text-teal-600 dark:text-cyan-300 border border-teal-500/20">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Control Center</p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5 custom-scrollbar">
        {SIDEBAR_ITEMS.map(item => (
          <div key={item.key}>
            {item.href ? (
              <Link
                to={item.href}
                className={`group relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isParentActive(item)
                    ? 'bg-gradient-to-r from-teal-500/15 to-cyan-500/10 text-teal-700 dark:text-cyan-300 shadow-[0_4px_16px_-4px_rgba(44,207,197,0.25)] border border-teal-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-white/[0.04]'
                }`}
                onClick={() => setMobileSidebarOpen(false)}
              >
                <span className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${isParentActive(item) ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  {item.icon}
                </span>
                {(sidebarOpen || mobileSidebarOpen) && <span>{item.label}</span>}
                {isParentActive(item) && (
                  <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#2CCFC5]" />
                )}
              </Link>
            ) : (
              <>
                <button
                  onClick={() => toggleSection(item.key)}
                  className={`group relative w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isParentActive(item)
                      ? 'bg-gradient-to-r from-teal-500/15 to-cyan-500/10 text-teal-700 dark:text-cyan-300 border border-teal-500/25 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <span className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${isParentActive(item) ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {item.icon}
                  </span>
                  {(sidebarOpen || mobileSidebarOpen) && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      <span className="shrink-0 text-slate-400 group-hover:text-teal-400 transition-transform duration-200">
                        {expandedSections.includes(item.key)
                          ? <ChevronDown size={14} />
                          : <ChevronRight size={14} />
                        }
                      </span>
                    </>
                  )}
                </button>
                {expandedSections.includes(item.key) && (sidebarOpen || mobileSidebarOpen) && (
                  <div className="ml-5 pl-3 mt-1.5 space-y-1 border-l border-teal-500/20 dark:border-teal-500/20">
                    {item.children?.map(child => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className={`block px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                          isActive(child.href)
                            ? 'text-cyan-700 dark:text-cyan-300 bg-cyan-500/15 font-semibold translate-x-1'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                        onClick={() => setMobileSidebarOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </nav>

      {/* User Card */}
      {(sidebarOpen || mobileSidebarOpen) && (
        <div className="border-t border-teal-500/10 dark:border-teal-500/15 p-4 bg-slate-100/40 dark:bg-black/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0 uppercase">
              {admin?.firstName && admin?.lastName && admin.lastName.trim()
                ? `${admin.firstName[0]}${admin.lastName[0]}`
                : admin?.firstName
                ? admin.firstName.slice(0, 2)
                : 'SA'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {admin
                  ? [admin.firstName, admin.lastName].filter(Boolean).join(' ') || 'Super Admin'
                  : 'Super Admin'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {admin?.email || 'admin@preferredtax.com'}
              </p>
            </div>
          </div>
          <MagneticButton
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
          >
            <LogOut size={13} />
            <span>{loggingOut ? 'Logging out...' : 'Sign Out'}</span>
          </MagneticButton>
        </div>
      )}
    </div>
  );

  return (
    <div className="admin-layout flex h-screen bg-[#F7FAF9] dark:bg-[#030F14] text-slate-900 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden font-sans">
      <FloatingBackground />

      {/* Desktop Glass Sidebar */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 transition-all duration-300 z-20 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white/70 dark:bg-[#061820]/80 backdrop-blur-xl border-r border-teal-500/15 shadow-2xl shadow-black/5 dark:shadow-black/40`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-fade-in">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="relative w-72 bg-white dark:bg-[#071A22] border-r border-teal-500/20 flex flex-col z-10 shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Command Center Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Topbar Glass Bar */}
        <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 border-b border-teal-500/15 bg-white/60 dark:bg-[#071A22]/70 backdrop-blur-xl shrink-0 shadow-sm">
          {/* Left section: Brand (on mobile) or View Public Portal */}
          <div className="flex items-center gap-3">
            {/* Mobile Header Brand Logo */}
            <div className="lg:hidden flex items-center gap-2">
              <BrandLogo className="h-7 w-auto" />
            </div>

            <Link
              to="/"
              target="_blank"
              className="group hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 bg-black/5 dark:bg-white/5 border border-teal-500/15 hover:border-teal-500/40 transition-all shadow-sm"
            >
              <span>View Public Portal</span>
              <span className="text-teal-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">↗</span>
            </Link>
          </div>

          {/* Right section: Status, Theme, and Mobile-Only Right Corner Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* System Status Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-teal-500/15 text-xs">
              <span className={`w-2 h-2 rounded-full ${isFullyAvailable ? 'bg-emerald-500 shadow-[0_0_8px_#10B981]' : 'bg-rose-500 animate-pulse'}`} />
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                {isFullyAvailable ? 'System Operational' : `Backend ${status}`}
              </span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 bg-black/5 dark:bg-white/5 border border-teal-500/15 hover:border-teal-500/40 transition-all cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-teal-600" />}
            </button>

            {/* Mobile-Only Hamburger in Right Corner */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-300 bg-teal-500/10 border border-teal-500/25 transition-all cursor-pointer ml-1"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          {children}
        </main>
      </div>
    </div>
  );
}
