import { NavLink, useLocation } from 'react-router-dom';
import { IoSparkles, IoGrid, IoChatbubbles, IoMegaphone, IoPeople, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { useState } from 'react';

/**
 * Sidebar Component
 * Persistent navigation sidebar with collapsible toggle.
 * Active route highlighting, brand logo, and responsive design.
 */

const navItems = [
  { path: '/', icon: IoGrid, label: 'Dashboard' },
  { path: '/copilot', icon: IoChatbubbles, label: 'AI Copilot' },
  { path: '/campaigns', icon: IoMegaphone, label: 'Campaigns' },
  { path: '/customers', icon: IoPeople, label: 'Customers' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`flex-shrink-0 h-screen sticky top-0 flex flex-col
                  bg-[#0F4C5C] border-r border-[#0A3D4A] text-white
                  transition-all duration-300 ease-in-out
                  ${collapsed ? 'w-[72px]' : 'w-[240px]'}`}
    >
      {/* Brand Logo */}
      <div className={`flex items-center gap-3 px-5 py-5 border-b border-[#0A3D4A] min-h-[72px]
                        ${collapsed ? 'justify-center px-0' : ''}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B6B] to-[#FFA69E] 
                        flex items-center justify-center shadow-lg shadow-[#FF6B6B]/25 flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5 text-white">
            <path d="M12 3L20 11L12 19L4 11L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="11" r="2.5" fill="currentColor"/>
            <path d="M7 11H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-extrabold text-white leading-tight tracking-wider uppercase whitespace-nowrap">Xenith AI</h1>
            <p className="text-[10px] text-teal-200/70 font-medium whitespace-nowrap">Xeno Campaign Engine</p>
          </div>
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
                          ${collapsed ? 'justify-center px-0 mx-auto w-11' : ''}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-colors
                               ${isActive ? 'text-white' : 'text-teal-200 group-hover:text-teal-100'}`} />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}

              {/* Active indicator bar - Coral color */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full 
                                bg-[#FF6B6B]" />
              )}

              {/* Tooltip on collapsed */}
              {collapsed && (
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

      {/* Collapse Toggle */}
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
    </aside>
  );
}
