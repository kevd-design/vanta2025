import { FC, ReactNode } from 'react'
import { OptimizedImage } from '@/app/components/common/OptimizedImage'
import type { ImageObject } from '@/app/lib/types/image'

interface ContactInfoCardProps {
  label: string;
  content: string | ReactNode;
  variant: 'white' | 'emerald';
  icon?: ImageObject | null;
  iconAlt?: string;
  link?: string;
  showSecondIcon?: boolean;
  secondIcon?: ImageObject | null;
  secondIconAlt?: string;
  secondLink?: string;
}

export const ContactInfoCard: FC<ContactInfoCardProps> = ({
  label,
  content,
  variant,
  icon,
  link,
  showSecondIcon = false,
  secondIcon,
  secondLink
}) => {
  // Determine styling based on variant
  const bgColor = variant === 'emerald' ? 'bg-emerald-800' : 'bg-white';
  const textColor = variant === 'emerald' ? 'text-white' : 'text-gray-900';
  const labelColor = variant === 'emerald' ? 'text-white' : 'text-gray-900';
  
  // Determine if this is a social card (has icons but no content text)
  const isSocialCard = (icon || showSecondIcon) && !content;
  
  // Social media icons rendering
  const renderIcons = () => (
    <div className="flex justify-left space-x-6 w-full">
      {icon && (
        <a 
          href={link || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block"
        >
          <div className="w-10 h-10 relative">
            <OptimizedImage
              image={icon}
              width={40}
              height={40}
              quality={85}
              className="w-full h-full"
            />
          </div>
        </a>
      )}
      {showSecondIcon && secondIcon && (
        <a 
          href={secondLink || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block"
        >
          <div className="w-10 h-10 relative">
            <OptimizedImage
              image={secondIcon}
              width={40}
              height={40}
              quality={85}
              className="w-full h-full"
            />
          </div>
        </a>
      )}
    </div>
  );

  // Shared card content
  const cardContent = (
    <div className="flex flex-col md:flex-row items-center py-3 px-6 md:py-4 md:px-8">
      {/* Content area (top on mobile, left on desktop) */}
      <div className={`text-center md:text-left ${textColor} text-xl md:text-xl font-medium mb-1 md:mb-0 md:flex-1`}>
        {isSocialCard ? renderIcons() : (typeof content === 'string' ? content : content)}
      </div>
      
      {/* Label (bottom on mobile, right on desktop) */}
      <div className={`text-center md:text-right ${labelColor} text-sm md:text-base font-medium md:ml-4`}>
        {label}
      </div>
    </div>
  );

  // Common card classes
  const cardClasses = `rounded-full md:rounded-3xl overflow-hidden shadow-md w-full ${bgColor}`;
  
  // Return card with or without link wrapper
  if (link && !isSocialCard) {
    return (
      <a 
        href={link} 
        className={`block ${cardClasses}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {cardContent}
      </a>
    );
  }
  
  // Default case: no link wrapper
  return (
    <div className={cardClasses}>
      {cardContent}
    </div>
  );
};