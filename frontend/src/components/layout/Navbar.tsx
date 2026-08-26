import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, User, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import hirraLight from '@/assets/hirra_light.svg';
import hirraDark from '@/assets/hirra_dark.svg';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Find Jobs', href: '/jobs', active: location.pathname === '/jobs' || location.pathname === '/' },
    { label: 'Companies', href: '/companies', active: location.pathname === '/companies' },
    { label: 'Career Resources', href: '#resources', active: false },
    { label: 'For Employers', href: '/employers', active: location.pathname === '/employers' },
  ];

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
          <button className="hidden sm:inline-flex text-sm font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2 anim-transition-colors anim-active-press dark:text-slate-300 dark:hover:text-white">
            Sign In
          </button>

          <Button 
            className="hidden sm:inline-flex bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 h-11 font-semibold shadow-md shadow-indigo-600/25 anim-active-press anim-transition-shadow"
            onClick={() => alert('Welcome to Hirra! Employer & Job seeker registration is live.')}
          >
            Get Started
          </Button>

          {/* User Profile Avatar Icon from reference */}
          <button 
            aria-label="User Profile"
            className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 anim-transition-colors anim-active-press dark:bg-slate-800 dark:border-slate-700 dark:text-indigo-400"
          >
            <User size={19} />
          </button>

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

                <div className="flex flex-col gap-4 py-6">
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
                  <Button variant="outline" className="w-full justify-center">
                    Sign In
                  </Button>
                  <Button className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white">
                    Get Started
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

      </div>
    </header>
  );
};
