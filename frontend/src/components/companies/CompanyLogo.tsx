import React from 'react';
import { Company } from '@/lib/api/jobs';
import { cn } from '@/lib/utils';

interface CompanyLogoProps {
  company?: Company | null;
  companyName?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  company,
  companyName = 'Company',
  className,
  size = 'md',
}) => {
  const name = company?.name || companyName;
  const logoType = company?.logoType || 'letter';
  const logoBg = company?.logoBg || '#4f46e5';
  const logoColor = company?.logoColor || '#ffffff';
  const firstLetter = (company?.logoLetter || name.charAt(0) || 'C').toUpperCase();

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg text-xs',
    md: 'w-12 h-12 rounded-xl text-base',
    lg: 'w-16 h-16 rounded-2xl text-xl',
  }[size];

  // Specific customized vector logos matching the reference visual cards:
  if (company?.slug === 'acme-technologies' || name.toLowerCase().includes('acme')) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-indigo-50 border border-indigo-100 p-2 rounded-xl shadow-xs transition-transform dark:bg-indigo-950/40 dark:border-indigo-900/40',
          sizeClasses,
          className
        )}
      >
        <svg viewBox="0 0 36 36" fill="none" className="w-full h-full">
          <path
            d="M18 6L7 27H29L18 6Z"
            stroke="#4F46E5"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M12 21H24"
            stroke="#4F46E5"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="18" cy="14" r="2.5" fill="#4F46E5" />
        </svg>
      </div>
    );
  }

  if (company?.slug === 'vercel' || name.toLowerCase().includes('vercel')) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-white border border-slate-200 p-2.5 rounded-xl shadow-xs dark:bg-slate-900 dark:border-slate-800',
          sizeClasses,
          className
        )}
      >
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
          <path
            d="M6 9L16 25L26 9"
            stroke="#0F172A"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="dark:stroke-white"
          />
        </svg>
      </div>
    );
  }

  if (company?.slug === 'quantum-analytics' || name.toLowerCase().includes('quantum')) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-slate-100 border border-slate-200 p-2 rounded-xl shadow-xs dark:bg-slate-800 dark:border-slate-700',
          sizeClasses,
          className
        )}
      >
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
          <path
            d="M4 23L11 11L16 19L20 13L28 23H4Z"
            stroke="#0F172A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="dark:stroke-white"
          />
          <path
            d="M8 23L11 17L14 23"
            stroke="#0F172A"
            strokeWidth="1.5"
            className="dark:stroke-white"
          />
        </svg>
      </div>
    );
  }

  if (company?.slug === 'fintrust-bank' || name.toLowerCase().includes('fintrust')) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-sky-50 border border-sky-100 p-2 rounded-xl shadow-xs dark:bg-sky-950/40 dark:border-sky-900/40',
          sizeClasses,
          className
        )}
      >
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
          <path
            d="M7 16C7 12 11 10 14 13L18 19C21 22 25 20 25 16C25 12 21 10 18 13L14 19C11 22 7 20 7 16Z"
            stroke="#0284C7"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (company?.slug === 'globex-corp' || name.toLowerCase().includes('globex')) {
    return (
      <div
        className={cn(
          'flex items-center justify-center font-bold text-white rounded-xl shadow-xs',
          sizeClasses,
          className
        )}
        style={{ backgroundColor: '#4338CA' }}
      >
        G
      </div>
    );
  }

  if (company?.slug === 'healthtech-solutions' || name.toLowerCase().includes('healthtech')) {
    return (
      <div
        className={cn(
          'flex items-center justify-center font-bold text-white rounded-xl shadow-xs',
          sizeClasses,
          className
        )}
        style={{ backgroundColor: '#EA580C' }}
      >
        H
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center font-bold shadow-xs transition-transform',
        sizeClasses,
        className
      )}
      style={{
        backgroundColor: logoBg,
        color: logoColor,
      }}
    >
      {firstLetter}
    </div>
  );
};
