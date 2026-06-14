import { NavLink, useLocation } from 'react-router-dom';
import { IoSparkles, IoGrid, IoChatbubbles, IoMegaphone, IoPeople, IoChevronBack, IoChevronForward, IoMenu, IoClose } from 'react-icons/io5';
import { useState, useEffect } from 'react';

/**
 * Sidebar Component
 * Persistent navigation sidebar with collapsible toggle on desktop.
 * On mobile (<768px), becomes a hamburger menu with slide-out drawer overlay.
 */

const navItems = [
  { path: '/', icon: IoGrid, label: 'Dashboard' },
  { path: '/copilot', icon: IoChatbubbles, label: 'AI Copilot' },
  { path: '/campaigns', icon: IoMegaphone, label: 'Campaigns' },
  { path: '/customers', icon: IoPeople, label: 'Customers' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const sidebarContent = (isMobile = false) => (
    <>
      {/* Brand Logo */}
      <div className={`flex items-center gap-3 px-5 py-5 border-b border-[#0A3D4A] min-h-[72px]
                        ${!isMobile && collapsed ? 'justify-center px-0' : ''}`}>
        <div className="w-10 h-10 rounded-xl bg-[#092D37] border border-teal-500/30
                        flex items-center justify-center shadow-lg flex-shrink-0 p-1.5">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
            <defs>
              <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B6B" />
                <stop offset="50%" stopColor="#FFA69E" />
                <stop offset="100%" stopColor="#FF8E53" />
              </linearGradient>
              <linearGradient id="glassGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#1B5E73" stopOpacity="0.2" />
              </linearGradient>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <path d="M50 5 L90 28 L90 72 L50 95 L10 72 L10 28 Z" stroke="url(#glowGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
            <path d="M25 25 L45 50 L25 75" stroke="url(#glowGrad)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M75 25 L55 50 L75 75" stroke="url(#glowGrad)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M50 20 L68 50 L50 80 L32 50 Z" fill="url(#glassGrad)" stroke="url(#glowGrad)" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="50" cy="50" r="4.5" fill="#FFFFFF" filter="url(#neonGlow)" />
            <path d="M50 38 L50 62 M38 50 L62 50" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" filter="url(#neonGlow)" />
          </svg>
        </div>
        {(isMobile || !collapsed) && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-extrabold text-white leading-tight tracking-wider uppercase whitespace-nowrap">Xenith AI</h1>
            <p className="text-[10px] text-teal-200/70 font-medium whitespace-nowrap">Xeno Campaign Engine</p>
          </div>
        )}
        {/* Close button for mobile */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <IoClose className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                          transition-all duration-200 group relative
                          ${isActive
                            ? 'bg-white/10 text-white border border-white/10 shadow-sm'
                            : 'text-teal-100 hover:text-white hover:bg-white/5 border border-transparent'}
                          ${!isMobile && collapsed ? 'justify-center px-0 mx-auto w-11' : ''}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-colors
                               ${isActive ? 'text-white' : 'text-teal-200 group-hover:text-teal-100'}`} />
              {(isMobile || !collapsed) && <span className="whitespace-nowrap">{item.label}</span>}

              {/* Active indicator bar - Coral color */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full 
                                bg-[#FF6B6B]" />
              )}

              {/* Tooltip on collapsed (desktop only) */}
              {!isMobile && collapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 rounded-lg bg-[#1B5E73] text-white
                                text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none
                                group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle (desktop only) */}
      {!isMobile && (
        <div className="px-3 py-4 border-t border-[#0A3D4A]">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs
                        text-teal-200 hover:text-teal-100 hover:bg-white/5
                        transition-all duration-200 w-full
                        ${collapsed ? 'justify-center' : ''}`}
            id="toggle-sidebar-btn"
          >
            {collapsed ? (
              <IoChevronForward className="w-4 h-4" />
            ) : (
              <>
                <IoChevronBack className="w-4 h-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Hamburger Button — fixed top-left */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-[#0F4C5C] text-white
                   shadow-lg shadow-[#0F4C5C]/30 hover:bg-[#1B5E73] transition-colors"
        id="mobile-menu-btn"
        aria-label="Open menu"
      >
        <IoMenu className="w-5 h-5" />
      </button>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 flex"
          onClick={() => setMobileOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 animate-modal-backdrop" />

          {/* Drawer */}
          <aside
            className="relative z-10 w-[260px] h-full flex flex-col bg-[#0F4C5C] border-r border-[#0A3D4A]
                        text-white shadow-2xl animate-slide-in-left"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent(true)}
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-shrink-0 h-screen sticky top-0 flex-col
                    bg-[#0F4C5C] border-r border-[#0A3D4A] text-white
                    transition-all duration-300 ease-in-out
                    ${collapsed ? 'w-[72px]' : 'w-[240px]'}`}
      >
        {sidebarContent(false)}
      </aside>
    </>
  );
}
