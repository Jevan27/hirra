import React from 'react';
import { Camera } from 'lucide-react';
import { ImagePlaceholder } from './ImagePlaceholder';
import { cn } from '@/lib/utils';

interface CulturePlaceholderProps {
  companyName: string;
  className?: string;
  onDark?: boolean;
}

/**
 * Large "company culture" image area with a subtle, intentional treatment
 * indicating where real team photography will eventually go.
 */
export const CulturePlaceholder: React.FC<CulturePlaceholderProps> = ({
  companyName,
  className,
  onDark = false,
}) => {
  return (
    <ImagePlaceholder
      icon={Camera}
      label={`Life at ${companyName}`}
      sublabel="Team photography coming soon"
      className={cn('min-h-[220px] sm:min-h-[260px]', className)}
      onDark={onDark}
    />
  );
};
