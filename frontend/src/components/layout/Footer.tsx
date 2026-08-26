import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const Footer: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <footer className="bg-[#0b132b] text-slate-300 pt-16 pb-12 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Links Grid from Reference */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 pb-16 border-b border-slate-800/80">
          
          {/* Column 1: Job Seekers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-5">
              Job Seekers
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">
                  Salary Tools
                </Link>
              </li>
              <li>
                <a href="#advice" className="hover:text-white transition-colors">
                  Career Advice
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Employers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-5">
              Employers
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link to="/employers" className="hover:text-white transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <a href="#hiring" className="hover:text-white transition-colors">
                  Hiring Solutions
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-5">
              Company
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#press" className="hover:text-white transition-colors">
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-5">
              Legal
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#cookies" className="hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2024 Hirra. All rights reserved.</p>

          {/* Functional Dark Mode Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <>
                  <Sun size={16} className="text-amber-400" />
                  <span className="text-xs">Light</span>
                </>
              ) : (
                <>
                  <Moon size={16} className="text-indigo-300" />
                  <span className="text-xs">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
