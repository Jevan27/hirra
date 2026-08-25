import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WORK_ARRANGEMENTS, EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from '@/lib/constants';

interface JobFiltersProps {
  arrangement: string;
  onArrangementChange: (val: string) => void;
  employmentType: string;
  onEmploymentTypeChange: (val: string) => void;
  experienceLevel: string;
  onExperienceLevelChange: (val: string) => void;
  onReset: () => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  arrangement,
  onArrangementChange,
  employmentType,
  onEmploymentTypeChange,
  experienceLevel,
  onExperienceLevelChange,
  onReset,
}) => {
  return (
    <aside className="w-full bg-white p-6 rounded-2xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <Filter size={18} className="text-indigo-600 dark:text-indigo-400" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      {/* Work Arrangement Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 dark:text-slate-400">
          Work Arrangement
        </label>
        <div className="space-y-2">
          {WORK_ARRANGEMENTS.map((item) => (
            <label
              key={item.value}
              className="flex items-center gap-3 text-sm font-medium text-slate-700 hover:text-slate-900 cursor-pointer dark:text-slate-300 dark:hover:text-white"
            >
              <input
                type="radio"
                name="arrangement"
                value={item.value}
                checked={arrangement === item.value}
                onChange={() => onArrangementChange(item.value)}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Employment Type Filter */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 dark:text-slate-400">
          Employment Type
        </label>
        <div className="space-y-2">
          {EMPLOYMENT_TYPES.map((item) => (
            <label
              key={item.value}
              className="flex items-center gap-3 text-sm font-medium text-slate-700 hover:text-slate-900 cursor-pointer dark:text-slate-300 dark:hover:text-white"
            >
              <input
                type="radio"
                name="employmentType"
                value={item.value}
                checked={employmentType === item.value}
                onChange={() => onEmploymentTypeChange(item.value)}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level Filter */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 dark:text-slate-400">
          Experience Level
        </label>
        <div className="space-y-2">
          {EXPERIENCE_LEVELS.map((item) => (
            <label
              key={item.value}
              className="flex items-center gap-3 text-sm font-medium text-slate-700 hover:text-slate-900 cursor-pointer dark:text-slate-300 dark:hover:text-white"
            >
              <input
                type="radio"
                name="experienceLevel"
                value={item.value}
                checked={experienceLevel === item.value}
                onChange={() => onExperienceLevelChange(item.value)}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};
