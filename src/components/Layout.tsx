import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  ClipboardCheck,
  FileText,
  Globe,
  Headphones,
  HeartHandshake,
  LayoutDashboard,
  Lock,
  Menu,
  Settings,
  ShieldCheck,
  UserCircle2,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { SupportedLanguage } from '../types';

export const WorkspaceLayout: React.FC = () => {
  const {
    language,
    setLanguage,
    role,
    setRole,
    officerName,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setHumanModalOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    { to: '/dashboard', label: t(language, 'navOverview'), icon: LayoutDashboard },
    { to: '/assessment', label: t(language, 'navAssessment'), icon: ClipboardCheck },
    { to: '/cases', label: t(language, 'navCases'), icon: FileText },
    { to: '/referrals', label: t(language, 'navReferrals'), icon: HeartHandshake },
    { to: '/analytics', label: t(language, 'navAnalytics'), icon: BarChart3 },
    { to: '/privacy', label: t(language, 'navPrivacy'), icon: Lock },
    { to: '/settings', label: t(language, 'navSettings'), icon: Settings },
  ];

  const getPageTitle = () => {
    if (location.pathname.startsWith('/cases/')) return 'Case Review & Oversight';
    const matched = navItems.find((item) => location.pathname === item.to);
    return matched ? matched.label : 'Sahaaya AI Workspace';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-[#0F2942] text-slate-100 border-r border-slate-800">
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/10">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-white"
          >
            <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" aria-hidden="true" />
            <span className="font-display text-base font-semibold tracking-tight text-white whitespace-nowrap">
              Sahaaya AI
            </span>
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto" aria-label="Workspace navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-600/20 text-white border border-teal-400/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 text-teal-300" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          <button
            type="button"
            onClick={() => setHumanModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium text-white bg-teal-700 hover:bg-teal-600 rounded-lg transition-colors"
          >
            <Headphones className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{t(language, 'connectHuman')}</span>
          </button>
          <p className="text-[11px] leading-relaxed text-slate-400">
            NHAA 14566 Prototype · Synthetic data only · Non-diagnostic indicator
          </p>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex w-72 max-w-xs flex-col bg-[#0F2942] text-white h-full z-50">
            <div className="flex items-center justify-between h-14 px-5 border-b border-white/10">
              <span className="font-display text-base font-semibold">Sahaaya AI</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="p-2 rounded-md text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                        isActive
                          ? 'bg-teal-600/20 text-white'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 text-teal-300 shrink-0" aria-hidden="true" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
            <div className="p-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setHumanModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium text-white bg-teal-700 hover:bg-teal-600 rounded-lg"
              >
                <Headphones className="w-4 h-4" />
                <span>{t(language, 'connectHuman')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Shell */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Portal
                </button>
                <span aria-hidden="true">/</span>
                <span className="truncate font-medium text-slate-700">{getPageTitle()}</span>
              </div>
              <h1 className="font-display text-base sm:text-lg font-semibold text-[#0F2942] truncate">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language selector */}
            <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50">
              <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
              <label htmlFor="workspace-lang" className="sr-only">
                Interface language
              </label>
              <select
                id="workspace-lang"
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="text-xs font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
              </select>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotifOpen((o) => !o);
                  setProfileOpen(false);
                }}
                aria-label={`Notifications (${unreadCount} unread)`}
                className="relative p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-teal-700 text-white text-[10px] font-semibold flex items-center justify-center tabular-nums">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-slate-200 shadow-lg z-40 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-900">
                      Support Queue Alerts
                    </span>
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="text-xs text-teal-700 hover:text-teal-800 font-medium"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-xs text-slate-500 text-center">
                        No alerts in this session.
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => {
                            markNotificationRead(n.id);
                            setNotifOpen(false);
                            if (n.caseId) navigate(`/cases/${n.caseId}`);
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${
                            n.read ? 'opacity-70' : 'bg-teal-50/30'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-900">
                              {n.title}
                            </span>
                            {!n.read && (
                              <span className="text-[11px] font-medium text-teal-700">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                            {n.message}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen((o) => !o);
                  setNotifOpen(false);
                }}
                aria-label="Open personnel profile menu"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <UserCircle2 className="w-4 h-4 text-[#0F2942]" aria-hidden="true" />
                <span className="hidden sm:inline text-xs font-medium text-slate-800 whitespace-nowrap">
                  {officerName}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-lg z-40 p-3 space-y-3">
                  <div className="pb-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900">{officerName}</p>
                    <p className="text-[11px] text-slate-500">{role} · Demo Session</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-slate-500 px-1">
                      Switch Demo Role
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setRole('Authorized Support Officer');
                        setProfileOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs ${
                        role === 'Authorized Support Officer'
                          ? 'bg-teal-50 text-teal-800 font-medium'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Authorized Support Officer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRole('Senior Case Supervisor');
                        setProfileOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs ${
                        role === 'Senior Case Supervisor'
                          ? 'bg-teal-50 text-teal-800 font-medium'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Senior Case Supervisor
                    </button>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-md text-xs text-slate-700 hover:bg-slate-50"
                    >
                      Return to Public Landing Page
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Prototype & Non-diagnostic banner */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <span>{t(language, 'prototypeNotice')}</span>
          <button
            type="button"
            onClick={() => setHumanModalOpen(true)}
            className="text-teal-800 font-medium hover:underline whitespace-nowrap"
          >
            {t(language, 'connectHuman')}
          </button>
        </div>

        {/* Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
