import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, User as UserIcon, LogOut, Briefcase, Bookmark, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import hirraLight from '@/assets/hirra_light.svg';
import hirraDark from '@/assets/hirra_dark.svg';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user, openAuthModal, signOut, isLoading } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Find Jobs', href: '/jobs', active: location.pathname === '/jobs' || location.pathname === '/' },
    { label: 'Companies', href: '/companies', active: location.pathname === '/companies' },
    { label: 'Career Resources', href: '#resources', active: false },
    { label: 'For Employers', href: '/employers', active: location.pathname === '/employers' },
  ];

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`
    : user?.email?.split('@')[0] || 'Candidate';

  const userInitial = (user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 dark:bg-slate-900/90 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Brand Logo (Theme-aware SVG) */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center group focus:outline-none py-1">
            <img
              src={hirraLight}
              alt="Hirra"
              className="h-8 sm:h-9 w-auto block dark:hidden object-contain"
            />
            <img
              src={hirraDark}
              alt="Hirra"
              className="h-8 sm:h-9 w-auto hidden dark:block object-contain"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`text-sm font-semibold anim-transition-colors ${
                  link.active
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3.5">
          {!isLoading && user ? (
            /* Logged-In Candidate User Menu */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm"
                aria-expanded={userDropdownOpen}
                aria-label="User profile menu"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={displayName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                    {userInitial}
                  </div>
                )}
                <span className="hidden sm:inline-block font-semibold text-sm text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                  {displayName}
                </span>
                <ChevronDown size={15} className="text-slate-400 dark:text-slate-500 hidden sm:inline-block" />
              </button>

              {/* Dropdown Menu Popover */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3.5 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {user.email}
                    </p>
                    <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                      {user.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to={user.profileCompleted ? "/profile" : "/candidate/onboarding"}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
                    >
                      <UserIcon size={16} />
                      {user.profileCompleted ? "Profile" : "Complete Profile (CV)"}
                    </Link>
                    <Link
                      to="/jobs"
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <Briefcase size={16} className="text-slate-400" />
                      Browse Opportunities
                    </Link>
                    <Link
                      to="/companies"
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <Bookmark size={16} className="text-slate-400" />
                      Explore Companies
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left cursor-pointer"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged-Out Actions */
            <>
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="hidden sm:inline-flex text-sm font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2 anim-transition-colors anim-active-press dark:text-slate-300 dark:hover:text-white cursor-pointer"
              >
                Sign In
              </button>

              <Button 
                className="hidden sm:inline-flex bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 h-11 font-semibold shadow-md shadow-indigo-600/25 anim-active-press anim-transition-shadow cursor-pointer"
                onClick={() => openAuthModal()}
              >
                Get Started
              </Button>

              {/* User Profile Avatar Icon opens auth modal */}
              <button 
                type="button"
                onClick={() => openAuthModal()}
                aria-label="User Profile"
                className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 anim-transition-colors anim-active-press dark:bg-slate-800 dark:border-slate-700 dark:text-indigo-400 cursor-pointer"
              >
                <UserIcon size={19} />
              </button>
            </>
          )}

          {/* Mobile Menu Hamburger */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open Menu">
                  <Menu size={22} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <SheetHeader className="text-left pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <img
                      src={hirraLight}
                      alt="Hirra"
                      className="h-7 w-auto block dark:hidden object-contain"
                    />
                    <img
                      src={hirraDark}
                      alt="Hirra"
                      className="h-7 w-auto hidden dark:block object-contain"
                    />
                  </div>
                </SheetHeader>

                <div className="flex flex-col gap-3 py-6">
                  {user && (
                    <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 mb-2">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-indigo-600 text-white">
                        {user.role}
                      </span>
                    </div>
                  )}

                  {user && (
                    <Link
                      to={user.profileCompleted ? "/profile" : "/candidate/onboarding"}
                      onClick={() => setMobileOpen(false)}
                      className="text-base font-semibold px-3 py-2 rounded-lg transition-colors bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 flex items-center gap-2"
                    >
                      <UserIcon size={18} />
                      {user.profileCompleted ? "Profile" : "Complete Profile (CV)"}
                    </Link>
                  )}

                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`text-base font-semibold px-3 py-2 rounded-lg transition-colors ${
                        link.active
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 font-bold'
                          : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                  {user ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMobileOpen(false);
                        signOut();
                      }}
                      className="w-full justify-center text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setMobileOpen(false);
                          openAuthModal();
                        }}
                        className="w-full justify-center"
                      >
                        Sign In
                      </Button>
                      <Button
                        onClick={() => {
                          setMobileOpen(false);
                          openAuthModal();
                        }}
                        className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

      </div>
    </header>
  );
};
