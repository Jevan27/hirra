import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
        secondary:
          "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        destructive:
          "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300",
        outline:
          "text-slate-700 border border-slate-200 dark:text-slate-300 dark:border-slate-800",
        
        // Exact styling matches from reference image
        hybrid:
          "bg-indigo-50 text-indigo-600 border border-indigo-100/80 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-900/50",
        fulltime:
          "bg-indigo-50/70 text-indigo-700 border border-indigo-100/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/40",
        remote:
          "bg-emerald-50 text-emerald-600 border border-emerald-100/80 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/50",
        contract:
          "bg-blue-50 text-blue-600 border border-blue-100/80 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900/50",
        onsite:
          "bg-amber-50 text-amber-700 border border-amber-100/80 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
